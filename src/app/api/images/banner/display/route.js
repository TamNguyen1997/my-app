import { NextResponse } from 'next/server'
import { db } from '@/app/db';
import { BannerType } from "@prisma/client";

export async function GET(req) {
  const scheduledBanners = await db.banner.findMany({
    where: {
      active: true,
      type: BannerType.SCHEDULED,
      OR: [
        {
          activeFrom: {
            lte: new Date()
          }
        },
        { activeFrom: null }
      ],
      OR: [
        {
          activeTo: {
            gte: new Date()
          }
        },
        { activeTo: null }
      ],

      NOT: {
        imageId: null
      },
    },
    take: 5,
    include: {
      image: true
    }
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
    }
  })

  return NextResponse.json({
    scheduledBanners, defaultBanners
  })
}
