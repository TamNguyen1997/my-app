import SubCategory from "@/app/components/product/SubCategory";
import Category from "@/app/components/product/Category";
import CategoryNotFound from "@/app/components/CategoryNotFound";
import { db } from '@/app/db';
import { cate_type } from "@prisma/client";

import { WEBSITE_SCHEMA, ORGANIZATION_SCHEMA, getBreadcrumbSchema } from "@/lib/schema"

const ITEM_PER_PAGE = 20;

export async function generateMetadata({ params }) {
  const [slug] = params.categorySlug.split("_")
  const category = await db.category.findFirst({ where: { slug: slug } })
  return {
    title: category?.metaTitle || category?.name,
    description: category?.metaDescription || category?.description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/${slug}`,
    },
    openGraph: {
      title: category?.metaTitle || category?.name,
      description: category?.metaDescription || category?.description,
      url: `${process.env.NEXT_PUBLIC_DOMAIN}/${category.slug}`,
      images: [
        {
          url: category?.imageUrl || `${process.env.NEXT_PUBLIC_DOMAIN}/default-category-image.png`,
          width: 1440,
          height: 290,
          alt: category?.name || 'Dụng cụ vệ sinh Sao Việt',
        }
      ]
    }
  }
}

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    WEBSITE_SCHEMA,
    ORGANIZATION_SCHEMA
  ]
};

const Page = async ({ params, searchParams }) => {
  const slug = params.categorySlug
  const category = await db.category.findFirst({ where: { slug: slug }, include: { subcates: true, image: true } })
  let { filterId, range, page = 1, orderBy } = searchParams;
  const filterIds = filterId?.split(",").filter(item => item) || [];
  if (!category) {
    return <CategoryNotFound />
  }
  orderBy = orderBy?.split(":") || ['createdAt', 'desc'];
  const filters = (await db.filter.findMany({
    where: {
      active: true,
      filterValue: {
        some: {
          category_on_filter_value: {
            some: {
              categoryId: category.id || ""
            }
          }
        }
      }
    },
    include: {
      filterValue: {
        where: {
          active: true
        }
      }
    }
  })).filter(item => item.filterValue.length > 0)

  const categoryBreadCrumbSchema = getBreadcrumbSchema([
    { name: category.name, slug: category.slug },
  ])

  let schema = { ...jsonLdSchema }
  schema['@graph'].push(categoryBreadCrumbSchema)

  return <div className="my-3">
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
    {
      category?.type === cate_type.SUB_CATE ?
        <SubCategoryPage category={category} filterIds={filterIds} range={range} page={page} filters={filters} orderBy={orderBy}/> :
        <CategoryPage category={category} filters={filters} range={range} orderBy={orderBy} filterIds={filterIds}/>
    }
  </div>

}

const CategoryPage = async ({category, filters, filterIds, range, orderBy}) => {
  let products = await db.product.findMany({
    where: {
      categoryId: category.id,
      subCateId: {
        not: null
      },
      active: true,
      ...(filterIds.filter(item => item).length > 0 && {
        saleDetails: {
          some: {
            filterValue: {
              displayId: {
                in: filterIds
              }
            }
          }
        },
      }),
    },
    include: {
      image: true,
      subCate: true,
      filterOnProduct: true,
      category: true,
      brand: true,
      saleDetails: true
    }
  })

  const subCategories = products.map(product => product.subCate)
  products = applyRangeAndOrder(products, range, orderBy);

  return <Category category={category} subcates={subCategories} filters={filters} products={products} filterIds={filterIds} defaultOrderBy={orderBy?.join(":")}/>
}

const SubCategoryPage = async ({category, filterIds, range, page, orderBy, filters}) => {
  let products = await db.product.findMany({
    where: {
      OR: [
        { categoryId: category.id },
        { subCateId: category.id }
      ],
      active: true,
      ...(filterIds.filter(item => item).length > 0 && {
        saleDetails: {
          some: {
            filterValue: {
              displayId: {
                in: filterIds
              }
            }
          }
        },
      }),
    },
    include: {
      image: true,
      subCate: true,
      filterOnProduct: true,
      category: true,
      brand: true,
      saleDetails: true
    }
  })

  const total = products.length;
  const totalPage = Math.ceil(total / ITEM_PER_PAGE);
  products = applyRangeAndOrder(products, range, orderBy);
  products = products.slice((page - 1) * ITEM_PER_PAGE, page * ITEM_PER_PAGE);
  return <SubCategory category={category} products={products} filters={filters.filter(item => item.filterValue.length > 0)} selectedFilterIds={filterIds} defaultOrderBy={orderBy?.join(":")} page={page} totalPage={totalPage}/> 
}

const applyRangeAndOrder = (products, range, orderBy) => {
  let updatedProducts = products
  if (updatedProducts.length > 0 && range?.length > 0) {
    const [min, max] = range.split('-').map(Number);
    const inRange = (product) => {
      if (!product.saleDetails?.length) return false;
      const effectivePrices = product.saleDetails
        .filter(detail => detail.showPrice && (((detail.promotionalPrice ?? 0) > 0) || ((detail.price ?? 0) > 0)))
        .map(detail => (detail.promotionalPrice && detail.promotionalPrice > 0) ? detail.promotionalPrice : (detail.price || 0));
      if (!effectivePrices.length) return false;
      if (max >= 100000000) {
        return effectivePrices.some(p => p >= min);
      }
      return effectivePrices.some(p => p >= min && p <= max);
    };
    updatedProducts = updatedProducts.filter(inRange);
  }

  switch (orderBy[0]) {
    case 'price':
      const getEffectivePrices = (product) => {
        if (!product.saleDetails?.length) return [];
        return product.saleDetails
          .filter(detail => detail.showPrice && ((detail.promotionalPrice ?? 0) > 0 || (detail.price ?? 0) > 0))
          .map(detail => {
            const promo = detail.promotionalPrice ?? 0;
            const base = detail.price ?? 0;
            return promo > 0 ? promo : base;
          });
      };

      const compareAsc = (a, b) => {
        const pricesA = getEffectivePrices(a);
        const pricesB = getEffectivePrices(b);
        const hasPriceA = pricesA.length > 0 ? 0 : 1;
        const hasPriceB = pricesB.length > 0 ? 0 : 1;
        if (hasPriceA !== hasPriceB) return hasPriceA - hasPriceB; // items without price go last
        const minA = pricesA.length ? Math.min(...pricesA) : Number.POSITIVE_INFINITY;
        const minB = pricesB.length ? Math.min(...pricesB) : Number.POSITIVE_INFINITY;
        return minA - minB;
      };

      const compareDesc = (a, b) => {
        const pricesA = getEffectivePrices(a);
        const pricesB = getEffectivePrices(b);
        const hasPriceA = pricesA.length > 0 ? 0 : 1;
        const hasPriceB = pricesB.length > 0 ? 0 : 1;
        if (hasPriceA !== hasPriceB) return hasPriceA - hasPriceB; // items without price go last
        const maxA = pricesA.length ? Math.max(...pricesA) : Number.NEGATIVE_INFINITY;
        const maxB = pricesB.length ? Math.max(...pricesB) : Number.NEGATIVE_INFINITY;
        return maxB - maxA;
      };

      updatedProducts = updatedProducts.sort(orderBy[1] === 'asc' ? compareAsc : compareDesc);
      break;
    case 'createdAt':
    default:
      updatedProducts = updatedProducts.sort((a, b) => {
        return orderBy[1] === 'asc' ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt);
      });
      break;
  }

  return updatedProducts;
}

export default Page;