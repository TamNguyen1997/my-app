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
  let {filterId, range, page = 1, orderBy} = searchParams;
  const filterIds = Array.isArray(filterId) ? filterId : [filterId]
  if (!category) {
    return <CategoryNotFound />
  }

  orderBy = orderBy?.split(":") || ['createdAt', 'desc'];
  const filters = await db.filter.findMany({
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
  })

  const categoryBreadCrumbSchema = getBreadcrumbSchema([
    { name: category.name, slug: category.slug },
  ])

  let schema = { ...jsonLdSchema }
  schema['@graph'].push(categoryBreadCrumbSchema)

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

  if (products.length > 0 && range?.length > 0) {
    const [min, max] = range.split('-').map(Number);
    if (max < 100000000) {
      products = products.filter(product => {
        return product.saleDetails?.find(detail => detail.showPrice && detail.price > min && detail.price < max);
      });
    }
  }


  switch (orderBy[0]) {
    case 'price':
      products = products.filter(product => product.saleDetails.find(detail => detail.showPrice && (detail.price > 0 || detail.promotionalPrice > 0)))
      if (orderBy[1] === "asc") {
        products = products.sort((a, b) => {
          const priceA = a.saleDetails.length
            ? Math.min(...a.saleDetails.map(sd => sd.price).filter(p => p !== null && p !== 0))
            : Infinity;
          const priceB = b.saleDetails.length
            ? Math.min(...b.saleDetails.map(sd => sd.price).filter(p => p !== null && p !== 0))
            : Infinity;
          if (priceA === Infinity) return 1;
          if (priceB === Infinity) return -1;
          return priceA - priceB;
        });
      }
      if (orderBy[1] === "desc") {
        products = products.sort((a, b) => {
          const priceA = a.saleDetails.length
            ? Math.max(...a.saleDetails.map(sd => sd.price).filter(p => p !== null))
            : -Infinity;
          const priceB = b.saleDetails.length
            ? Math.max(...b.saleDetails.map(sd => sd.price).filter(p => p !== null))
            : -Infinity;
          if (priceA === Infinity) return -1;
          if (priceB === Infinity) return 1;
          return priceB - priceA;
        });
      }
      break;
    case 'createdAt':
    default:
      products = products.sort((a, b) => {
        return orderBy[1] === 'asc' ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt);
      });
      break;
  }

  const total = products.length;
  const totalPage = Math.ceil(total / ITEM_PER_PAGE);
  products = products.slice((page - 1) * ITEM_PER_PAGE, page * ITEM_PER_PAGE);

  return <div className="my-3">
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
    {
      category?.type === cate_type.SUB_CATE ?
        <SubCategory category={category} products={products} filters={filters.filter(item => item.filterValue.length > 0)} selectedFilterIds={filterIds} defaultOrderBy={orderBy?.join(":")} page={page} totalPage={totalPage}/> :
        <Category category={category} subcates={category.subcates} filters={filters.filter(item => item.filterValue.length > 0)} />
    }
  </div>

}

export default Page;