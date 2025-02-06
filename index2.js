const pg = require('pg');
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

  const products = await client.query("SELECT * FROM product where length(description) > 50 limit 1");
  products.rows.forEach(async product => {
    const data = {
      title: product.name,
      slug: product.slug,
      content: product.description,
      status: 'publish'
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