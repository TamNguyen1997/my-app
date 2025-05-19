import "../globals.css";
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactIcons from '@/components/ContactIcons'
import CartProvider from '@/context/CartProvider'
import { db } from '@/app/db'

export default async function RootLayout({ children }) {
  const headers = getHeaders()
  return (
    <html lang="vi">
      <meta name="robots" content="index,follow" />
      <meta name="google-site-verification" content="bnj-0vSnMlKuLmNzj5kleHIQ2Sk85O1ZqwB4-fGPIHo" />
      <body className='font-roboto'>
        <CartProvider>
          <Header headers={await headers} />
          <div className="min-h-screen">
            {children}
          </div>
          <ContactIcons />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

const getHeaders = async () => {
  const brandCategory = {
    id: "-1",
    name: "Thương hiệu",
    subcates: BRANDS
  };

  const utilities = [
    {
      id: "1000",
      slug: "tin-tuc",
      name: "Tin tức",
      class: "flex md:hidden",
      subcates: []
    },
    {
      id: "1001",
      slug: "kien-thuc-hay",
      name: "Kiến thức hay",
      class: "flex md:hidden",
      subcates: [
        {
          id: "1",
          slug: "kien-thuc-hay/tu-dien-thuat-ngu",
          name: "Từ điển thuật ngữ"
        },
        {
          id: "2",
          slug: "kien-thuc-hay/tu-van-chon-mua",
          name: "Tư vấn chọn mua"
        },
        {
          id: "3",
          slug: "kien-thuc-hay/huong-dan-su-dung",
          name: "Hướng dẫn sử dụng"
        }
      ]
    }
  ]

  const headers = await db.category.findMany({
    where: {
      slug: {
        in: [
          "khan",
          "hop-thung-dung-do-da-nang",
          "xe-day-phuc-vu",
          "gang-tay-chuyen-dung",
          "dung-cu-ve-sinh",
          "cac-thiet-bi-khac",
          "dung-cu-ve-sinh-kinh"
        ]
      }
    },
    orderBy: [
      {
        updatedAt: "desc"
      }
    ],
    select: {
      id: true,
      name: true,
      slug: true,
      subcates: {
        select: {
          id: true,
          name: true,
          slug: true,
        }
      }
    }
  })

  return [brandCategory, ...headers, ...utilities]
}

const BRANDS = [
  {
    id: 1,
    slug: "thuong-hieu-rubbermaid",
    name: "Rubbermaid_Dụng cụ làm vệ sinh",
    image: {
      path: "/brand/Rubbermaid.webp"
    },
  },
  {
    id: 2,
    slug: "thuong-hieu-ghibli",
    name: "Ghibli_Máy vệ sinh công nghiệp",
    image: {
      path: "/brand/Logo-Ghibli.svg"
    },
  },
  {
    id: 3,
    slug: "thuong-hieu-moerman",
    name: "Moerman_Dụng cụ vệ sinh kính",
    image: {
      path: "/brand/Logo-Moerman.webp"
    }
  },
  {
    id: 4,
    slug: "thuong-hieu-mapa",
    name: "Mapa_Găng tay bảo hộ",
    image: {
      path: "/brand/Logo-Mapa.webp"
    },
  },
  {
    id: 5,
    slug: "thuong-hieu-kleen-tex",
    name: "Kleen-Tex_Thảm trải sản/sảnh",
    image: {
      path: "/brand/KLEEN-TEX.webp"
    },
  },
  {
    id: 6,
    slug: "thuong-hieu-kimberly-clark",
    name: "Kimberly Clark_Khăn giấy/vệ sinh",
    image: {
      path: "/brand/Logo-Kimberly-Clark.webp"
    },
  },

];