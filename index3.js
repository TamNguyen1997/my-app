const pg = require('pg');
const CATEGORY_TO_WORDPRESS_CATEGORY_ID = {
  "INFORMATION": 3,
  "NEWS": 2,
  "TERMINOLOGY": 4,
  "ADVISORY": 5,
  "MANUAL": 6,
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

  const blogs = await client.query("SELECT * FROM blog where length(content) > 50 and slug not in ('ho-tro', 'chinh-sach-bao-mat', 'hop-tac-ban-hang', 'chinh-sach-doi-tra', 'chinh-sach-bao-hanh','huong-dan-mua-hang', 'hinh-thuc-thanh-toan', 'hinh-thuc-van-chuyen', 'doi-tac', 'khach-hang')");
  blogs.rows.forEach(async blog => {
    const data = {
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      categories: `${CATEGORY_TO_WORDPRESS_CATEGORY_ID[blog.blog_category]},${CATEGORY_TO_WORDPRESS_CATEGORY_ID[blog.blog_sub_category]}`,
      status: blog.actice ? 'publish' : 'draft',
      thumbnail: `https://dcvs.shop/wordpress/wp-content/uploads/${blog.thumbnail}`,
      yoast_meta: {
        yoast_wpseo_title: blog.meta_title,
        yoast_wpseo_metadesc: blog.meta_description
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