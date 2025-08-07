import { db } from "@/app/db"
import PromotionProgramPage from "@/components/admin/ui/PromotionProgramPage";

export async function generateMetadata() {
  return {
    title: "Chương trình khuyến mãi | Dụng cụ vệ sinh Sao Việt",
    description: "Quản lý chương trình khuyến mãi tại Dụng cụ vệ sinh Sao Việt",
  };
}

export default async function Page({ searchParams }) {
  const { searchTerm, active, page = 1, size = 10 } = searchParams;

  let condition = {};
  if (searchTerm) {
    condition = {
      OR: [
        {
          name: {
            contains: `${searchTerm}:*`,
            mode: "insensitive",
          },
        },
        {
          category: {
            some: {
              OR: [
                {
                  id: {
                    contains: `${searchTerm}:*`,
                    mode: "insensitive",
                  }
                },
                {
                  name: {
                    contains: `${searchTerm}:*`,
                    mode: "insensitive",
                  },
                },
                {
                  slug: {
                    contains: `${searchTerm}:*`,
                    mode: "insensitive",
                  },
                },
              ]
            },
          },
        },
        {
          product: {
            some: {
              OR: [
                {
                  id: {
                    contains: `${searchTerm}:*`,
                    mode: "insensitive",
                  }
                },
                {
                  name: {
                    contains: `${searchTerm}:*`,
                    mode: "insensitive",
                  },
                },
                {
                  slug: {
                    contains: `${searchTerm}:*`,
                    mode: "insensitive",
                  },
                },
              ]
            },
          },
        },
        {
          saleDetail: {
            some: {
              sku: {
                contains: `${searchTerm}:*`,
                mode: "insensitive",
              },
            },
          },
        }
      ],
    };
  }

  if (active && active !== 'undefined') {
    condition.active = active === "true" ? true : false;
  }

  const promotionPrograms = await db.promotion_program.findMany({
    where: condition,
    skip: (page - 1) * size,
    take: size,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <PromotionProgramPage promotionPrograms={promotionPrograms} queryParams={searchParams} />
  );
}