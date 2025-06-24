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
        include: {
          filter: true,
          filterValue: true,
          sale_detail_on_image: true,
          technical_detail_for_sale_detail: true
        }
      },
      image: true,
      category: true,
      subCate: true,
      product_on_image: {
        orderBy: {
          order: 'asc'
        },
      },
      brand: true
    },
    where: {
      slug: params.productSlug,
      active: true
    }
  })
  if (!product || !product.category || !product.subCate || !product.brand) {
    notFound()
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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <ProductDetail product={product} description={productDescription} relatedProducts={relatedProducts} />
    </>
  )
}

export default Page;