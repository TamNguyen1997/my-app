import HeroBanner from "@/components/HeroBanner";
import PopularItems from "@/components/PopularItems";
import PopularBlogs from "@/components/PopularBlogs";
import Customer from "@/components/Customer";
import Introduction from "@/components/Introduction";
import PopularSearches from "@/components/PopularSearches";
import { db } from "@/app/db"

export const viewport = {
  viewport: 'initial-scale=1.0, width=device-width',
}

const Home = async () => {
  const banners = await getBanners()
  const highlighProducts = await getHighlightProducts()
  const highlightCatesWithProducts = await getHighlightCatesWithProducts()
  const blogs = await getBlogs()
  const popularSearches = await getPopularSearch()
  return (
    <div>
      <HeroBanner banners={banners} />
      <PopularItems highlightProducts={highlighProducts} highlightCatesWithProducts={highlightCatesWithProducts} />
      <Introduction />
      <PopularBlogs blogs={blogs} />
      <div className="bg-[#FFD400] rounded-tr-[50px] rounded-bl-[50px] flex items-center w-2/3 md:w-1/3 min-w-[300px] h-[50px] m-auto shadow-md">
        <p className="m-auto text-black font-bold md:text-xl">KHÁCH HÀNG SAO VIỆT</p>
      </div>
      <Customer />
      <div className="pb-10">
        <PopularSearches popularSearches={popularSearches} />
      </div>
    </div>
  );
}

const getBanners = async () => {
  const [scheduledBanners, defaultBanners] = await Promise.all([
    db.banner.findMany({
      where: {
        type: "SCHEDULED",
        activeFrom: {
          lte: new Date()
        },
        activeTo: {
          gte: new Date()
        },
        active: true
      },
      orderBy: [
        {
          updatedAt: "desc"
        }
      ],
    }),
    db.banner.findMany({
      where: {
        type: "DEFAULT",
      },
      orderBy: [
        {
          updatedAt: "desc"
        }
      ],
    })
  ])

  return [...scheduledBanners, ...defaultBanners].splice(0, 5).filter(item => item && item.imageUrl)
}

const getHighlightProducts = async () => {
  return await db.product.findMany({
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
      image: true,
      category: true,
      subCate: true,
      brand: true,
      highlight: true,
      imageUrl: true
    },
    where: {
      highlight: true,
      active: true,
      productType: "PRODUCT",
      categoryId: {
        not: null
      },
      subCateId: {
        not: null
      }
    },
    orderBy: [
      {
        updatedAt: "desc"
      }
    ],
    take: 10,
    skip: 0
  })
}

const getHighlightCatesWithProducts = async () => {
  return await db.category.findMany({
    where: {
      highlight: true,
      active: true,
    },
    include: {
      image: true,
      product: {
        take: 10,
        where: {
          active: true,
          productType: "PRODUCT"
        },
        include: {
          saleDetails: true
        },
        orderBy: [
          {
            updatedAt: "desc"
          }
        ]
      }
    },
    take: 3,
    skip: 0
  })
}

const getBlogs = async () => {
  let blogs = []
  const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts/?_embed&per_page=3&categories_exclude=${process.env.NEXT_PUBLIC_WORDPRESS_PRODUCT_CATEGORY_ID}`)
  if (res.ok) blogs = await res.json()
  return blogs
}

const getPopularSearch = async () => {
  return await db.popular_search.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    },
    orderBy: {
      updatedAt: "desc"
    }
  })
}

export default Home