const pg = require('pg');
const { Client } = pg
const client = new Client({
  user: 'root',
  host: '194.238.23.52',
  password: 'admin',
  port: 5432,
  database: 'dung-cu-ve-sinh'
})

const wordpress_url = "https://dcvs.shop/wordpress"

async function updateImage() {
  try {
    await client.connect()
    const products = await client.query("SELECT * FROM product where image_id is not null");
    products.rows.forEach(async product => {
      const image = (await client.query(`SELECT * FROM image where id = '${product.image_id}' limit 1`)).rows[0];
      console.log("updating product")
      if (image) {
        console.log("updating product", product.id)
        if (image.path.startsWith("https://dcvs.shop/wordpress")) {
          await client.query(`update product set image_url = '${image.path}' where id = '${product.id}'`);
        } else {
          await client.query(`update product set image_url = '${wordpress_url}${image.path}' where id = '${product.id}'`);
        }
      }
    });

    const product_on_image = await client.query("SELECT * FROM product_on_image");
    product_on_image.rows.forEach(async pOnImage => {
      const image = (await client.query(`SELECT * FROM image where id = '${pOnImage.imageId}' limit 1`)).rows[0];
      if (image) {
        console.log("updating product_on_image", pOnImage.productId, pOnImage.imageId)
        if (image.path.startsWith("https://dcvs.shop/wordpress")) {
          await client.query(`update product_on_image set image_url = '${image.path}' where "productId" = '${pOnImage.productId}' and "imageId" = '${pOnImage.imageId}'`);
        } else {
          await client.query(`update product_on_image set image_url = '${wordpress_url}${image.path}' where "productId" = '${pOnImage.productId}' and "imageId" = '${pOnImage.imageId}'`);
        }
      }
    });

    const banners = await client.query("SELECT * FROM banner where image_id is not null");
    banners.rows.forEach(async banner => {
      const image = (await client.query(`SELECT * FROM image where id = '${banner.image_id}' limit 1`)).rows[0];
      if (image) {
        console.log("updating banner", banner.id)
        if (image.path.startsWith("https://dcvs.shop/wordpress")) {
          await client.query(`update banner set image_url = '${image.path}' where "id" = '${banner.id}'`);
        } else {
          await client.query(`update banner set image_url = '${wordpress_url}${image.path}' where "id" = '${banner.id}'`);
        }
      }
    });
    const categories = await client.query(`SELECT * FROM category where "imageId" is not null`);
    categories.rows.forEach(async category => {
      const image = (await client.query(`SELECT * FROM image where id = '${category.imageId}' limit 1`)).rows[0];
      if (image) {
        console.log("updating category", category.id)
        if (image.path.startsWith("https://dcvs.shop/wordpress")) {
          await client.query(`update category set image_url = '${image.path}' where "id" = '${category.id}'`);
        } else {
          await client.query(`update category set image_url = '${wordpress_url}${image.path}' where "id" = '${category.id}'`);
        }
      }
    });


    // Step 1: Fetch post by slug to get its ID
  } catch (error) {
    console.error("Error updating post:", error);
  }
}

// Call the function
updateImage();