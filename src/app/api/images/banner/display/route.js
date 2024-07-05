import { NextResponse } from 'next/server'
import { db } from '@/app/db';
import { BannerType } from "@prisma/client";

export async function GET(req) {
  const scheduledBanners = await db.banner.findMany({
    where: {
      active: true,
      type: BannerType.SCHEDULED,
      activeFrom: {
        lte: new Date()
      },

      activeTo: {
        gte: new Date()
      },

      NOT: {
        imageId: null
      },
    },
    take: 5,
    include: {
      image: true
    },
    orderBy: [
      { order: "asc" }
    ]
  })

  const defaultBanners = await db.banner.findMany({
    where: {
      type: BannerType.DEFAULT,
      NOT: {
        imageId: null
      }
    },
    take: 5,
    include: {
      image: true
    },
    orderBy: [
      { order: "asc" }
    ]
  })

  return NextResponse.json({
    scheduledBanners, defaultBanners
  })
}
