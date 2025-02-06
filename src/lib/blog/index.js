const BLOG_CATEGORIES = [
  {
    id: "INFORMATION",
    value: "Kiến thức hay"
  },
  {
    id: "NEWS",
    value: "Tin tức"
  }
]

const BLOG_SUB_CATEGORIES = [
  {
    value: "Từ điển thuật ngữ",
    id: "TERMINOLOGY",
  },
  {
    value: "Tư vấn chọn mua",
    id: "ADVISORY",
  },
  {
    value: "Hướng dẫn sử dụng",
    id: "MANUAL",
  }
]

const WORDPRESS_CATEGORY_ID_TO_CATEGORY = {
  "7": "ALL",
  "8": "INFORMATION",
  "9": "NEWS",
  "10": "TERMINOLOGY",
  "11": "ADVISORY",
  "12": "MANUAL",
}

const CATEGORY_TO_WORDPRESS_CATEGORY_ID = {
  "ALL": 7,
  "INFORMATION": 8,
  "NEWS": 9,
  "TERMINOLOGY": 10,
  "ADVISORY": 11,
  "MANUAL": 12,
}

export { BLOG_CATEGORIES, BLOG_SUB_CATEGORIES, WORDPRESS_CATEGORY_ID_TO_CATEGORY, CATEGORY_TO_WORDPRESS_CATEGORY_ID }