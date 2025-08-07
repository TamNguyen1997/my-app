import { db } from "@/app/db"
import { NextResponse } from "next/server";
import queryString from "query-string";

export const GET = async (req) => {
  const { query } = queryString.parseUrl(req.url);
  let page = parseInt(query.page) || 1;
  let size = parseInt(query.size) || 10;

  let condition = {};
  if (query.active) {
    condition.active = query.active === 'true';
  }

  if (query.searchTerm) {
    const searchTerm = query.name.trim().replaceAll(" ", " & ");
    condition = Object.assign(condition, {
      OR: [
        {
          name: {
            search: `${searchTerm}:*`
          }
        },
        {
          category: {
            some: {
              name: {
                search: `${searchTerm}:*`
              }
            }
          }
        },
        {
          subCategory: {
            some: {
              name: {
                search: `${searchTerm}:*`
              }
            }
          }
        },
        {
          product: {
            some: {
              name: {
                search: `${searchTerm}:*`
              }
            }
          }
        },
        {
          saleDetail: {
            some: {
              name: {
                search: `${searchTerm}:*`
              }
            }
          }
        }
      ]
    });
  }

  try {
    const result = await db.promotion_program.findMany({
      where: condition,
      include: {
        category: true,
        subCategory: true,
        product: true
      },
      skip: (page - 1) * size,
      take: size,
      orderBy: {
        updatedAt: "desc"
      }
    })
    return NextResponse.json(result)
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: "Có lỗi xảy ra", error: e }, { status: 400 })
  }
}

export const POST = async (req) => {
  try {
    let body = await req.json();

    const promotionProgram = await db.promotion_program.upsert({
      where: {
        id: body.id
      },
      create: {
        id: body.id,
        active: body.active,
        promotion: body.promotion,
        name: body.name,
      },
      update: {
        promotion: body.promotion,
        active: body.active,
        name: body.name,
      }
    });

    await db.$transaction(async (tx) => {
      await Promise.all([
        tx.category.updateMany({
          where: {
            promotionProgramId: promotionProgram.id
          },
          data: {
            promotionProgramId: null
          }
        })
      ])
      if (body.categoryIds?.length > 0) {
        await tx.category.updateMany({
          where: {
            id: {
              in: body.categoryIds || []
            }
          },
          data: {
            promotionProgramId: promotionProgram.id
          }
        })
      }
    });

    await db.$transaction(async (tx) => {
      await tx.product.updateMany({
        where: {
          promotionProgramId: promotionProgram.id
        },
        data: {
          promotionProgramId: null
        }
      })
      if (body.products?.length > 0) {
        await tx.product.updateMany({
          where: {
            id: {
              in: body.productIds || []
            }
          },
          data: {
            promotionProgramId: promotionProgram.id
          }
        })
      }
    });

    await db.$transaction(async (tx) => {
      await tx.sale_detail.updateMany({
        where: {
          promotionProgramId: promotionProgram.id
        },
        data: {
          promotionProgramId: null
        }
      });

      if (body.saleDetailIds?.length > 0) {
        await tx.sale_detail.updateMany({
          where: {
            id: {
              in: body.saleDetailIds || []
            }
          },
          data: {
            promotionProgramId: promotionProgram.id
          }
        });
      }
    });
    return NextResponse.json(promotionProgram);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 });
  }
}