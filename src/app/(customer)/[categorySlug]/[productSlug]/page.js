import ProductDetail from "@/app/components/product/ProductDetail";
import { db } from '@/app/db';
import { product_type } from "@prisma/client";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const product = await db.product.findFirst({ where: { slug: params.productSlug } })
  return {
    title: product?.metaTitle || product?.name || "Sản phẩm của Dụng cụ vệ sinh Sao Việt",
    description: product?.metaDescription,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/${params.categorySlug}/${params.productSlug}`,
    },
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
          sale_detail_on_image: true
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
  if (!product) {
    notFound()
  }
  let productDescription = ""
  const productPostResponse = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts/?slug=${params.productSlug}&categories=${process.env.NEXT_PUBLIC_WORDPRESS_PRODUCT_CATEGORY_ID}`);
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
  return <ProductDetail product={product} description={productDescription} relatedProducts={relatedProducts} />
}

export default Page;