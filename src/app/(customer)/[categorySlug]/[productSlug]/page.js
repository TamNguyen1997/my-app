import ProductDetail from "@/app/components/product/ProductDetail";
import { db } from '@/app/db';
import { product_type } from "@prisma/client";
import { notFound } from "next/navigation";
import { WEBSITE_SCHEMA, getProductSchema, getBreadcrumbSchema } from "@/lib/schema"

export const dynamic = "force-dynamic"; // Forces dynamic rendering
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const product = await db.product.findFirst({ where: { slug: params.productSlug } })
  return {
    title: product?.metaTitle || product?.name || "Dụng cụ vệ sinh Sao Việt",
    description: product?.metaDescription,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/${params.categorySlug}/${params.productSlug}`,
    },
    openGraph: {
      title: product?.metaTitle || product?.name || "Dụng cụ vệ sinh Sao Việt",
      description: product?.metaDescription,
      url: `${process.env.NEXT_PUBLIC_DOMAIN}/${params.categorySlug}/${params.productSlug}`,
      images: [
        {
          url: product?.imageUrl || `${process.env.NEXT_PUBLIC_DOMAIN}/brand/sao-viet-fanpage.jpg`,
          width: 1440,
          height: 290,
          alt: product?.name || 'Dụng cụ vệ sinh Sao Việt',
        }
      ]
    }
  }
}

const Page = async ({ params }) => {
  const product = await db.product.findFirst({
    include: {
      technical_detail: {
        include: {
          filterValue: true,
          filter: true
        }
      },
      saleDetails: {
        orderBy: {
          updatedAt: 'asc'
        },
        select: {
          id: true,
          productId: true,
          value: true,
          price: true,
          type: true,
          saleDetailId: true,
          filterId: true,
          filterValueId: true,
          sku: true,
          promotionalPrice: true,
          showPrice: true,
          inStock: true,
          createdAt: true,
          updatedAt: true,
          promotionProgramId: true,
          filter: {
            select: {
              id: true,
              name: true,
              active: true,
            }
          },
          filterValue: {
            select: {
              id: true,
              value: true,
              filterId: true,
            }
          },
          sale_detail_on_image: {
            select: {
              imageUrl: true,
              order: true,
            },
            orderBy: {
              order: 'asc'
            }
          },
          technical_detail_for_sale_detail: {
            select: {
              id: true,
              technicalDetails: true,
            }
          },
          promotionProgram: {
            select: {
              id: true,
              name: true,
              promotion: true,
              active: true,
            }
          }
        }
      },
      promotionProgram: true,
      image: true,
      category: {
        include: {
          promotionProgram: true,
        }
      },
      subCate: {
        include: {
          promotionProgram: true
        }
      },
      product_on_image: {
        orderBy: {
          order: 'asc'
        },
      },
      brand: true,
      bundle_product: true
    },
    where: {
      slug: params.productSlug,
      active: true
    }
  })
  if (!product || !product.category || !product.subCate || !product.brand) {
    notFound()
  }
  // Enrich saleDetails with filter_value_on_sale_detail safely (avoid deep nested include that panics Prisma)
  if (product?.saleDetails?.length) {
    const saleDetailIds = product.saleDetails.map((sd) => sd.id).filter(Boolean)
    if (saleDetailIds.length) {
      const fvsds = await db.filter_value_on_sale_detail.findMany({
        where: { saleDetailId: { in: saleDetailIds } },
        orderBy: { updatedAt: 'asc' },
        select: {
          id: true,
          saleDetailId: true,
          filterValueId: true,
          createdAt: true,
          updatedAt: true,
        }
      })

      const filterValueIds = Array.from(new Set(fvsds.map((x) => x.filterValueId).filter(Boolean)))
      const filterValues = filterValueIds.length
        ? await db.filter_value.findMany({
            where: { id: { in: filterValueIds } },
            select: {
              id: true,
              value: true,
              filterId: true,
            },
          })
        : []
      const filterIdSet = Array.from(new Set(filterValues.map((fv) => fv.filterId).filter(Boolean)))
      const filters = filterIdSet.length
        ? await db.filter.findMany({
            where: { id: { in: filterIdSet } },
            select: { id: true, name: true },
          })
        : []
      const filterById = new Map(filters.map((f) => [f.id, f]))
      const filterValueById = new Map(
        filterValues.map((fv) => [fv.id, { ...fv, filter: fv.filterId ? filterById.get(fv.filterId) || null : null }])
      )

      const fvsdsBySaleDetailId = new Map()
      for (const row of fvsds) {
        const arr = fvsdsBySaleDetailId.get(row.saleDetailId) || []
        arr.push({
          ...row,
          filterValue: row.filterValueId ? filterValueById.get(row.filterValueId) || null : null,
        })
        fvsdsBySaleDetailId.set(row.saleDetailId, arr)
      }

      product.saleDetails = product.saleDetails.map((sd) => ({
        ...sd,
        filter_value_on_sale_detail: fvsdsBySaleDetailId.get(sd.id) || [],
      }))
    }
  }
  let productDescription = ""
  const productPostResponse = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts/?slug=${params.productSlug}`);
  if (productPostResponse.ok) {
    const productDescriptionJson = await productPostResponse.json();
    productDescription = productDescriptionJson[0]?.content?.rendered
  }

  const relatedProducts = await db.product.findMany({
    select: {
      active: true,
      brandId: true,
      categoryId: true,
      createdAt: true,
      id: true,
      name: true,
      imageId: true,
      productId: true,
      slug: true,
      updatedAt: true,
      imageAlt: true,
      imageId: true,
      saleDetails: true,
      technical_detail: true,
      image: true,
      category: true,
      subCate: true,
      brand: true,
      highlight: true,
      imageUrl: true,
    },
    where: {
      active: true,
      slug: {
        not: params.productSlug
      },
      productType: product_type.PRODUCT,
      categoryId: product.categoryId
    },
    orderBy: [
      {
        updatedAt: "desc"
      }
    ],
    take: 10,
    skip: 0
  })

  const productImages = [product.imageUrl, ...product.product_on_image.map(item => item.imageUrl)].filter(item => item)

  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      WEBSITE_SCHEMA,
      getBreadcrumbSchema([
        {
          name: product.subCate.name, slug: product.subCate.slug
        },
        {
          name: product.name, slug: product.slug
        },
        getProductSchema(product, productImages)
      ]),
    ]
  }

  const bundleId = product?.bundle_product?.[0]?.bundleId;
  const productsInBundle = bundleId ? await db.bundle_product.findMany({
    where: { bundleId: bundleId, productId: { not: product.id } },
    include: {
      product: {
        include: { saleDetails: true, technical_detail: true }
      }
    }
  }) : [];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <ProductDetail
        product={product}
        description={productDescription}
        relatedProducts={relatedProducts}
        productsInBundle={productsInBundle}
      />
    </>
  )
}

export default Page;