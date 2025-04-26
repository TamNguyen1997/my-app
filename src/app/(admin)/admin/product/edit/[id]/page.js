import { cate_type } from "@prisma/client";
import Default from "./default";
import { db } from "@/app/db";

export async function generateMetadata({ params }) {
  const product = await db.product.findFirst({ where: { id: params.id } })
  return {
    title: product?.metaTitle || product?.name || "Sản phẩm của Dụng cụ vệ sinh Sao Việt",
  }
}

const Page = async ({ params }) => {

  const [product, allCategories, brands] = await Promise.all([
    db.product.findFirst({
      where: {
        OR: [
          { id: params.id },
          { slug: params.id }
        ]
      },
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
        },
        brand: true
      }
    }),
    db.category.findMany({}),
    db.brand.findMany({}),

  ])

  const allCategoryIds = allCategories.map(item => item.id)
  const filters = await db.filter.findMany({
    include: {
      filterValue: true
    },
    where: {
      filterValue: {
        some: {
          category_on_filter_value: {
            some: {
              categoryId: { in: allCategoryIds }
            }
          }
        }
      }
    }
  })

  const categories = allCategories.filter(item => item.type === cate_type.CATE)

  const subCategories = allCategories.filter(item => item.type === cate_type.SUB_CATE)
  return (
    <Default initProduct={product} categories={categories} subCategories={subCategories} brands={brands} initFilters={filters} />
  )
}

export default Page
