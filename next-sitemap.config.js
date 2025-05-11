import { config } from 'dotenv';

config();
import { db } from "./src/app/db/index.js"

export default {
  siteUrl: process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  priority: 0.9,
  changefreq: "weekly",
  exclude: [
    '/server-sitemap.xml',
    '/api/*',        // Exclude all API routes
    '/admin*',
    '/login',
    '/not-found*'
  ],
  transform: async (config, path) => {
    let field = {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
    if (path.endsWith("/kien-thuc-hay") || path.endsWith("/tin-tuc") || path.endsWith("ve-chung-toi") || path.includes("/ho-tro/")) {
      field.priority = 0.7
    }

    return field
  },
  robotsTxtOptions: {
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_DOMAIN}/server-sitemap.xml`,
    ],
  },
  additionalPaths: async (config) => {
    const products = await db.product.findMany({
      where: {
        active: true,
        NOT: {
          subCateId: null,
          categoryId: null,
          brandId: null
        }
      }, include: { subCate: true }
    });

    const categories = await db.category.findMany({ where: { active: true } })

    const mappedProducts = products.filter(item => item.subCate?.slug).map((product) => ({
      loc: `${process.env.NEXT_PUBLIC_DOMAIN}/${product.subCate?.slug || "san-pham"}/${product.slug}`,
      changefreq: "daily",
      priority: 1,
      lastmod: product.updatedAt || new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    }));

    const mappedCategories = categories.map(category => ({
      loc: `${process.env.NEXT_PUBLIC_DOMAIN}/${category?.slug}`,
      changefreq: "weekly",
      priority: config.priority,
      lastmod: category.updatedAt || new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    }))

    let page = 1
    let total = 1;

    let blogs = []

    do {
      const res = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts?per_page=100&page=${page}&categories=${process.env.NEXT_PUBLIC_WORDPRESS_POST_NEWS_ID}&categories=${process.env.NEXT_PUBLIC_WORDPRESS_POST_INFORMATION_ID}`);
      blogs.push(...await res.json());
      page++
      total = res.headers.get('X-WP-TotalPages');
    } while (total > page)
    const mappedBlogs = blogs.map(blog =>
    ({

      loc: `${process.env.NEXT_PUBLIC_DOMAIN}/${blog.categories.includes(process.env.NEXT_PUBLIC_WORDPRESS_POST_NEWS_ID) ? 'tin-tuc' : 'kien-thuc-hay'}/${blog.slug}`,
      changefreq: "daily",
      priority: config.priority,
      lastmod: blog.modified || new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],

    })
    )
    return [...mappedProducts, ...mappedCategories, ...mappedBlogs,
    {
      loc: '/',
      changefreq: 'daily',
      priority: 1.0,
      lastmod: new Date().toISOString(),
    }
    ]
  }
}