/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "tailwindui.com",
      "images.unsplash.com",
      "i.ibb.co",
      "i.postimg.cc",
      "firebasestorage.googleapis.com",
      "images.ctfassets.net",
      "cdn.pixabay.com",
      "cdn.tgdd.vn",
      "hc.com.vn",
      "bizweb.dktcdn.net",
      "dungcuvesinhsaoviet.com",
      "dcvs.shop"
    ],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  matcher: "/",
  async headers() {
    return [
      {
        // matching all API routes
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: 'Access-Control-Expose-Headers', value: 'Location' },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Location" },
        ]
      }
    ]
  }
};

module.exports = nextConfig;
