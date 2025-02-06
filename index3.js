const pg = require('pg');
const CATEGORY_TO_WORDPRESS_CATEGORY_ID = {
  "ALL": 7,
  "INFORMATION": 8,
  "NEWS": 9,
  "TERMINOLOGY": 10,
  "ADVISORY": 11,
  "MANUAL": 12,
}

const { Client } = pg
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  password: 'admin',
  port: 5432,
  database: 'dung-cu-ve-sinh'
})


const WORDPRESS_URL = "https://dcvs.shop/wordpress/wp-json/wp/v2/posts"
const WORDPRESS_USER = "admin"
const WORDPRESS_PASSWORD = "Password123!"

const execute = async () => {
  await client.connect()

  const blogs = await client.query("SELECT * FROM blog where length(content) > 50 limit 1");
  blogs.rows.forEach(async blog => {
    const data = {
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      categories: `${CATEGORY_TO_WORDPRESS_CATEGORY_ID[blog.category]},${CATEGORY_TO_WORDPRESS_CATEGORY_ID[blog.blogSubCategory]}`,
      status: blog.actice ? 'publish' : 'draft',
      thumbnail: `https://dcvs.shop/wordpress/wp-content/uploads/${blog.thumbnail}`,
      yoast_meta: {
        yoast_wpseo_title: blog.metaTitle,
        yoast_wpseo_metadesc: blog.metaDescription
      }
    }

    const result = await fetch(WORDPRESS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${WORDPRESS_USER}:${WORDPRESS_PASSWORD}`).toString('base64')}`
      },
      body: JSON.stringify(data)
    })
    console.log(result.status)
    console.log(await result.json())
  });
}

execute()