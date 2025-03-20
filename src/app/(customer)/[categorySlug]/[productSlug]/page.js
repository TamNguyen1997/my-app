import ProductDetail from "@/app/components/product/ProductDetail";
import { db } from '@/app/db';
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const product = await db.product.findFirst({ where: { slug: params.productSlug } })
  return {
    title: product?.metaTitle,
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
          filterValue: true
        }
      },
      image: true,
      category: true,
      subCate: true,
      product_on_image: {
        orderBy: {
          order: 'asc'
        },
        include: { image: true }
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
  return <ProductDetail product={product} description={productDescription} />
}

export default Page;