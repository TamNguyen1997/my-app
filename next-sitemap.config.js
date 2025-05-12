require('dotenv').config({ path: '.env.local' });  // Load environment variables
const fs = require('fs');
const { PrismaClient } = require("@prisma/client");

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';

const db = new PrismaClient()

async function generateSitemap() {
  const products = await db.product.findMany({
    where: {
      active: true,
      subCateId: { not: null },
      categoryId: { not: null },
      brandId: { not: null },
    },
    include: { subCate: true },
  });

  const categories = await db.category.findMany({ where: { active: true } });

  let page = 1;
  let totalPages = 1;
  const blogs = [];

  do {
    const res = await fetch(
      `${process.env.WORDPRESS_URL}/wp-json/wp/v2/posts?per_page=100&page=${page}&categories=${process.env.NEXT_PUBLIC_WORDPRESS_POST_NEWS_ID},${process.env.NEXT_PUBLIC_WORDPRESS_POST_INFORMATION_ID}`
    );

    blogs.push(...await res.json());

    const total = res.headers.get("X-WP-TotalPages");
    totalPages = parseInt(total, 10) || 1;
    page++;
  } while (page <= totalPages);

  fs.writeFileSync(__dirname + '/public/sitemap-san-pham.xml', convertToXmlProductSiteMap(products.filter(item => item.subCate && item.subCate.slug), 1, 'daily'));
  fs.writeFileSync(__dirname + '/public/sitemap-category.xml', convertToXmlCategoriesSiteMap(categories, 0.9, 'weekly'));
  fs.writeFileSync(__dirname + '/public/sitemap-blog.xml', convertToXmlBLogsSiteMap(blogs, 0.9, 'daily'));
  fs.writeFileSync(__dirname + '/public/sitemap-ho-tro.xml', convertToXmlAboutUsSiteMap([
    "ve-chung-toi",
    "ho-tro/huong-dan-mua-hang",
    "ho-tro/chinh-sach-bao-mat",
    "ho-tro/chinh-sach-bao-hanh",
    "ho-tro/hinh-thuc-thanh-toan",
    "ho-tro",
    "ho-tro/chinh-sach-doi-tra",
    "ho-tro/hinh-thuc-van-chuyen",
  ], 0.7, 'weekly'));

  fs.writeFileSync(__dirname + '/public/sitemap-0.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
<url><loc>${siteUrl}</loc><lastmod>2025-05-11T17:20:49.887Z</lastmod><changefreq>daily</changefreq><priority>1</priority></url>
</urlset>`);
  fs.writeFileSync(__dirname + '/public/sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<sitemap><loc>${siteUrl}/sitemap-0.xml</loc></sitemap>
<sitemap><loc>${siteUrl}/sitemap-san-pham.xml</loc></sitemap>
<sitemap><loc>${siteUrl}/sitemap-category.xml</loc></sitemap>
<sitemap><loc>${siteUrl}/sitemap-blog.xml</loc></sitemap>
<sitemap><loc>${siteUrl}/sitemap-ho-tro.xml</loc></sitemap>
</sitemapindex>`
  )
}

generateSitemap();
function convertToXmlProductSiteMap(products, priority, changefreq) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/${changefreq}">${products.map(p => `
<url><loc>${siteUrl}/${p.subCate.slug}/${p.slug}</loc><lastmod>${p.updatedAt.toISOString()}</lastmod><changefreq>${priority}</changefreq><priority>${changefreq}</priority></url>`).join('')}
</urlset>`;
}

function convertToXmlCategoriesSiteMap(categories, priority, changefreq) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/${changefreq}">${categories.map(cate => `
<url><loc>${siteUrl}/${cate.slug}</loc><lastmod>${cate.updatedAt.toISOString()}</lastmod><changefreq>${priority}</changefreq><priority>${changefreq}</priority></url>`).join('')}
</urlset>`;
}

function convertToXmlBLogsSiteMap(blogs, priority = 0.9, changefreq) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/${changefreq}">${blogs.map(blog => `
<url><loc>${siteUrl}/${blog.categories.includes(parseInt(process.env.NEXT_PUBLIC_WORDPRESS_POST_NEWS_ID)) ? "tin-tuc" : "kien-thuc-hay"}/${blog.slug}</loc><lastmod>${blog.modified || new Date().toISOString()}</lastmod><changefreq>${priority}</changefreq><priority>${changefreq}</priority></url>`).join('')}
</urlset>`;
}

function convertToXmlAboutUsSiteMap(urls, priority = 0.7, changefreq = "weekly") {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/${changefreq}">${urls.map(p => `
<url><loc>${siteUrl}/${urls}</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>${priority}</changefreq><priority>${changefreq}</priority></url>`).join('')}
</urlset>`;
}
