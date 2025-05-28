export const WEBSITE_SCHEMA = {
  '@type': 'WebSite',
  '@id': `${process.env.NEXT_PUBLIC_DOMAIN}#website`,
  'url': process.env.NEXT_PUBLIC_DOMAIN,
  'name': 'Dụng cụ vệ sinh Sao Việt',
  'description': 'Dụng cụ vệ sinh Sao Việt',
  "alternateName": "Dụng cụ vệ sinh Sao Việt",
  "inLanguage": "vi",
  'potentialAction': {
    '@type': 'SearchAction',
    'target': `${process.env.NEXT_PUBLIC_DOMAIN}/tim-kiem?q={search_term_string}`,
    'query-input': 'required q=search_term_string'
  }
}
export const ORGANIZATION_SCHEMA = {
  '@type': 'Organization',
  '@id': `${process.env.NEXT_PUBLIC_DOMAIN}#organization`,
  'name': 'Dụng cụ vệ sinh Sao Việt',
  'url': process.env.NEXT_PUBLIC_DOMAIN,
  'logo': {
    '@type': 'ImageObject',
    'url': `${process.env.NEXT_PUBLIC_DOMAIN}/saoviet.webp`
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "0903802979",
    "contactType": "Hỗ trợ khách hàng",
    "areaServed": "VN",
    "availableLanguage": ["Vietnamese"]
  },
  "foundingDate": "2005",
  "description": "Chuyên cung cấp các loại dụng cụ vệ sinh công nghiệp.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "666/62 Đường 3/2",
    "addressLocality": "Phường 14, Quận 10",
    "addressRegion": "TP Hồ Chí Minh",
    "postalCode": "700000",
    "addressCountry": "VN"
  },
  "sameAs": [
    "https://www.facebook.com/vesinhsaoviet/"
  ]
}

export const getBreadcrumbSchema = (categories = []) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": categories.map((cat, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": cat.name,
      "item": `${process.env.NEXT_PUBLIC_DOMAIN}/${cat.slug}`
    }))
  };
};

export const getBrandSchema = (brand) => {
  return {
    "@context": "https://schema.org",
    "@type": "Brand",
    "name": brand.name,
    "url": `${process.env.NEXT_PUBLIC_DOMAIN}/${brand.slug}`,
    "logo": {
      "@type": "ImageObject",
      "url": `${process.env.NEXT_PUBLIC_DOMAIN}/saoviet.webp`,
      "width": 600,
      "height": 60
    },
    "description": "Dụng cụ vệ sinh Sao Việt",
    "slogan": "Sản phẩm có tiêu chí chất lượng, công bố rõ ràng",
    "sameAs": [
      "https://www.facebook.com/vesinhsaoviet/",
    ]
  }
}

export const getProductSchema = (product, imageUrls = [], sku) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: imageUrls,
    description: product.description,
    sku: sku,
    brand: {
      "@type": "Brand",
      name: product.brand.name,
    },
    image: {
      "@type": "ImageObject",
      contentUrl: product.imageUrl,
      url: product.imageUrl,
      representativeOfPage: true,
      caption: product.name,
    },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_DOMAIN}/${product.subCate.slug}/${product.slug}`,
      priceCurrency: "VND"
    },
  }
}

export const getWebPageSchema = (path, title, description, breadcrumbList) => {
  return {
    "@type": "WebPage",
    "@id": `${process.env.NEXT_PUBLIC_DOMAIN}/${path}`,
    "url": `${process.env.NEXT_PUBLIC_DOMAIN}/${path}`,
    "name": title,
    "description": description,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbList
    },
    "mainEntity": {
      "@id": `${process.env.NEXT_PUBLIC_DOMAIN}/${path}#product`
    }
  }
}