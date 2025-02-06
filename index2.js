const pg = require('pg');
const { Client } = pg
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  password: 'admin',
  port: 5432,
  database: 'dung-cu-ve-sinh'
})


const WORDPRESS_URL = "https://dcvs.shop/wordpress/wp-json/wp/v2"
const WORDPRESS_USER = "admin"
const WORDPRESS_PASSWORD = "Password123!"

const execute = async () => {
  const images = []

  for (let i = 1; ; i++) {
    const slice = await fetch(`${WORDPRESS_URL}/media?per_page=100&page=${i}`)
    if (!slice.ok) break
    images.push(...await slice.json())
  }

  await client.connect()

  const products = await client.query("SELECT * FROM product where length(description) > 50 limit 1");
  products.rows.forEach(async product => {
    const data = {
      title: product.name,
      slug: product.slug,
      content: product.description,
      categories: 13,
      status: product.active ? 'publish' : 'draft',
    }

    const result = await fetch(`${WORDPRESS_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${WORDPRESS_USER}:${WORDPRESS_PASSWORD}`).toString('base64')}`
      },
      body: JSON.stringify(data)
    })
    console.log(result.status)
  });
}

execute()