require('dotenv').config({ path: '.env.local' });  // Load environment variables
const fs = require('fs');
const { PrismaClient } = require("@prisma/client");

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';

const db = new PrismaClient()

const VALID_CHANGEFREQ = new Set(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'])
function normalizeChangefreq(cf) {
  const value = typeof cf === 'string' ? cf.toLowerCase() : ''
  return VALID_CHANGEFREQ.has(value) ? value : 'weekly'
}
function normalizePriority(p) {
  const n = Number(p)
  if (!isFinite(n)) return '0.5'
  const clamped = Math.max(0, Math.min(1, n))
  return clamped.toFixed(1)
}

function buildUrlFromSegments() {
  const segments = Array.from(arguments).filter(Boolean).map(s => encodeURIComponent(String(s)))
  return `${siteUrl}/${segments.join('/')}`
}

function buildUrlFromPath(path) {
  const clean = String(path || '').replace(/^\/+|\/+$/g, '')
  const parts = clean.split('/').filter(Boolean).map(seg => encodeURIComponent(seg))
  return `${siteUrl}/${parts.join('/')}`
}

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

  fs.writeFileSync(__dirname + '/public/sitemap-san-pham.xml', convertToXmlProductSiteMap(products.filter(item => item.subCate && item.subCate.slug), 1.0, 'daily'));
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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${siteUrl}</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>${normalizeChangefreq('daily')}</changefreq><priority>${normalizePriority(1.0)}</priority></url>
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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${products.map(p => `
<url><loc>${buildUrlFromSegments(p.subCate.slug, p.slug)}</loc><lastmod>${new Date(p.updatedAt).toISOString()}</lastmod><changefreq>${normalizeChangefreq(changefreq)}</changefreq><priority>${normalizePriority(priority)}</priority></url>`).join('')}
</urlset>`;
}

function convertToXmlCategoriesSiteMap(categories, priority, changefreq) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${categories.map(cate => `
<url><loc>${buildUrlFromSegments(cate.slug)}</loc><lastmod>${new Date(cate.updatedAt).toISOString()}</lastmod><changefreq>${normalizeChangefreq(changefreq)}</changefreq><priority>${normalizePriority(priority)}</priority></url>`).join('')}
</urlset>`;
}

function convertToXmlBLogsSiteMap(blogs, priority = 0.9, changefreq) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${blogs.map(blog => {
  const modified = blog && blog.modified ? new Date(blog.modified) : new Date();
  const lastmod = isNaN(modified.getTime()) ? new Date().toISOString() : modified.toISOString();
  const section = (blog.categories || []).includes(parseInt(process.env.NEXT_PUBLIC_WORDPRESS_POST_NEWS_ID)) ? "tin-tuc" : "kien-thuc-hay";
  return `
<url><loc>${buildUrlFromSegments(section, blog.slug)}</loc><lastmod>${lastmod}</lastmod><changefreq>${normalizeChangefreq(changefreq)}</changefreq><priority>${normalizePriority(priority)}</priority></url>`;}).join('')}
</urlset>`;
}

function convertToXmlAboutUsSiteMap(urls, priority = 0.7, changefreq = "weekly") {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(p => `
<url><loc>${buildUrlFromPath(p)}</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>${normalizeChangefreq(changefreq)}</changefreq><priority>${normalizePriority(priority)}</priority></url>`).join('')}
</urlset>`;
}
