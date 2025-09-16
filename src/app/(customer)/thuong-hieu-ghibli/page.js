import { db } from '@/app/db';
import BrandPage from "@/components/BrandPage";
import { WEBSITE_SCHEMA, ORGANIZATION_SCHEMA, getBreadcrumbSchema, getBrandSchema } from "@/lib/schema"
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Thương hiệu Ghibli',
  description: 'Thương hiệu Ghibli',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/thuong-hieu-ghibli`,
  },
  openGraph: {
    title: 'Thương hiệu Ghibli',
    description: 'Thương hiệu Ghibli',
    url: `${process.env.NEXT_PUBLIC_DOMAIN}/thuong-hieu-ghibli`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/brand/banner/1440_290_Banner_Cate_Ghibli.png`,
        width: 1440,
        height: 290,
        alt: 'Thương hiệu Ghibli',
      }
    ]
  }
}

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    WEBSITE_SCHEMA,
    ORGANIZATION_SCHEMA,
    getBreadcrumbSchema([
      {
        name: 'Thương hiệu Ghibli', slug: 'thuong-hieu-ghibli'
      }
    ]),
    getBrandSchema({
      name: 'Thương hiệu Ghibli', slug: 'thuong-hieu-ghibli'
    })
  ]
}

export default async function Page({ searchParams }) {
  let { filterId, range, orderBy } = searchParams || {};
  const filterIds = filterId?.split(",").filter(item => item) || [];
  orderBy = orderBy?.split(":") || ['createdAt', 'desc'];
  const brand = await db.brand.findFirst({
    where: {
      slug: "thuong-hieu-ghibli"
    }
  })

  if (!brand) {
    notFound()
  }

  const filters = await db.filter.findMany({
    where: {
      active: true,
      filterValue: {
        some: {
          brand_on_filter_value: {
            some: {
              brandId: brand.id
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

  // Fetch products for this brand
  let products = await db.product.findMany({
    where: {
      active: true,
      brand: {
        slug: "thuong-hieu-ghibli"
      },
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
      category: true,
      brand: true,
      saleDetails: true
    }
  })

  products = applyRangeAndOrder(products, range, orderBy);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <BrandPage 
        brand="thuong-hieu-ghibli" 
        bg="bg-[url(/brand/banner/1440_290_Banner_Cate_Ghibli.png)]" 
        filters={filters.filter(item => item.filterValue.length > 0)}
        products={products}
        defaultOrderBy={orderBy?.join(":")}
        defaultRange={range?.split('-').map(Number) || [0, 100000000]}
        defaultFilterIds={filterIds}
      />
    </>
  )
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
    case 'price': {
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
        if (hasPriceA !== hasPriceB) return hasPriceA - hasPriceB;
        const minA = pricesA.length ? Math.min(...pricesA) : Number.POSITIVE_INFINITY;
        const minB = pricesB.length ? Math.min(...pricesB) : Number.POSITIVE_INFINITY;
        return minA - minB;
      };

      const compareDesc = (a, b) => {
        const pricesA = getEffectivePrices(a);
        const pricesB = getEffectivePrices(b);
        const hasPriceA = pricesA.length > 0 ? 0 : 1;
        const hasPriceB = pricesB.length > 0 ? 0 : 1;
        if (hasPriceA !== hasPriceB) return hasPriceA - hasPriceB;
        const maxA = pricesA.length ? Math.max(...pricesA) : Number.NEGATIVE_INFINITY;
        const maxB = pricesB.length ? Math.max(...pricesB) : Number.NEGATIVE_INFINITY;
        return maxB - maxA;
      };

      updatedProducts = updatedProducts.sort(orderBy[1] === 'asc' ? compareAsc : compareDesc);
      break;
    }
    case 'createdAt':
    default:
      updatedProducts = updatedProducts.sort((a, b) => {
        return orderBy[1] === 'asc' ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt);
      });
      break;
  }

  return updatedProducts;
}
