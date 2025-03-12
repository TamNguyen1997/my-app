import ProductDetail from "@/app/components/product/ProductDetail";
import SubCategory from "@/app/components/product/SubCategory";
import Category from "@/app/components/product/Category";
import CategoryNotFound from "@/app/components/CategoryNotFound";
import { db } from '@/app/db';
import { cate_type } from "@prisma/client";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  if (params.slug.length === 1) {
    const [slug] = params.slug[0].split("_")
    const category = await db.category.findFirst({ where: { slug: slug } })
    return {
      title: category?.name
    }
  }

  const product = await db.product.findFirst({ where: { slug: params.slug[1] } })
  return {
    title: product?.metaTitle,
    description: product?.metaDescription,
  }
}

const Page = async ({ params }) => {
  const categorySlug = Array.isArray(params.slug) ? params.slug[0] : null;
  const productSlug = Array.isArray(params.slug) ? params.slug[1] : null;

  if (categorySlug && !productSlug) {
    const [slug, filter] = categorySlug.split("#")
    const category = await db.category.findFirst({ where: { slug: slug }, include: { subcates: true, image: true } })

    if (!category) {
      return <CategoryNotFound />
    }
    if (category?.type === cate_type.SUB_CATE) {
      return <SubCategory params={slug} productFilter={filter} />
    }
    return <Category category={category} productFilter={filter} />
  }
  if (categorySlug && productSlug) {
    const product = await db.product.findFirst({
      where: {
        AND: [
          {
            OR: [
              { brand: { slug: categorySlug } },
              { category: { slug: categorySlug } },
              { subCate: { slug: categorySlug } }
            ]
          },
          {
            slug: productSlug
          }
        ]
      }, include: {
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
      }
    })
    if (product) {
      let description = "";
      const productPostResponse = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts/?slug=${product.slug}&categories=${process.env.NEXT_PUBLIC_WORDPRESS_PRODUCT_CATEGORY_ID}`);
      if (productPostResponse.ok) {
        const productPost = await productPostResponse.json();
        description = productPost[0]?.content?.rendered;
      }
      return <ProductDetail id={params.slug[1]} product={product} description={description} />
    }
  }
  return notFound()
}

export default Page;