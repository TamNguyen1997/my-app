import { db } from "@/app/db"
import queryString from "query-string";
import { v4 } from "uuid";

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

    if (!body.id) {
      body.id = v4();
    }
    
    const promotionProgram = await db.promotion_program.upsert({
      where: {
        id: body.id
      },
      create: {
        id: body.id,
        promotion: body.promotion,
        name: body.name,
      },
      update: {
        promotion: body.promotion,
        name: body.name,
      }
    });

    await db.transaction(async (tx) => {
      await Promise.all([
        tx.category.updateMany({
          where: {
            promotionProgramId: body.id
          },
          data: {
            promotionProgramId: null
          }
        }), 
        tx.sub_category.updateMany({
          where: {
            promotionProgramId: body.id
          },
          data: {
            promotionProgramId: null
          }
        })
      ])
      await tx.category.updateMany({
        where: {
          id: {
            in: body.categoryIds || []
          }
        },
        data: {
          promotionProgramId: body.id
        }
      })
    });

    await db.transaction(async (tx) => {
      await tx.product.updateMany({
          where: {
            promotionProgramId: body.id
          },
          data: {
            promotionProgramId: null
          }
        })
      
      await tx.product.updateMany({
        where: {
          id: {
            in: body.productIds || []
          }
        },
        data: {
          promotionProgramId: body.id
        }
      })
    });

    await db.transaction(async (tx) => {
      await tx.sale_detail.updateMany({
        where: {
          promotionProgramId: body.id
        },
        data: {
          promotionProgramId: null
        }
      });
      await tx.sale_detail.updateMany({
        where: {
          id: {
            in: body.saleDetailIds || []
          }
        },
        data: {
          promotionProgramId: body.id
        }
      });
    });
    return NextResponse.json(promotionProgram);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Something went wrong", error: e }, { status: 400 });
  }
}