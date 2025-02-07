const pg = require('pg');
const { Client } = pg
const client = new Client({
  user: 'root',
  host: 'localhost',
  password: 'admin',
  port: 5432,
  database: 'dung-cu-ve-sinh'
})

const WORDPRESS_URL = "https://dcvs.shop/wordpress/wp-json/wp/v2"
const wpUsername = "admin";
const wpPassword = "Password123!"; // Or use JWT token
const newStatus = "publish"; // Options: 'publish', 'draft', 'private', etc.

async function updatePostStatus(newStatus) {
  try {
    const products = await client.query("SELECT * FROM product where length(description) > 50");
    products.rows.forEach(async product => {

      let response = await fetch(`${WORDPRESS_URL}/posts?slug=${product.slug}`, {
        method: "GET",
        headers: {
          "Authorization": "Basic " + btoa(`${wpUsername}:${wpPassword}`)
        }
      });

      let posts = await response.json();

      if (!posts.length) {
        throw new Error("Post not found");
      }

      let postId = posts[0].id;

      // Step 2: Update the post status
      response = await fetch(`${WORDPRESS_URL}/posts/${postId}`, {
        method: "POST",
        headers: {
          "Authorization": "Basic " + btoa(`${wpUsername}:${wpPassword}`),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });

      let updatedPost = await response.json();
      console.log("Post updated successfully:", updatedPost);
    });
    // Step 1: Fetch post by slug to get its ID
  } catch (error) {
    console.error("Error updating post:", error);
  }
}

// Call the function
updatePostStatus(newStatus);