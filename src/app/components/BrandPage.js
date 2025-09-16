"use client";

import Brand from "@/app/components/product/Brand";
import { usePathname } from 'next/navigation'

const BrandPage = ({ brand, bg, filters, products = [], defaultOrderBy = "createdAt:desc", defaultRange = [0, 100000000], defaultFilterIds = [] }) => {
  const [_, filter] = usePathname().split("#")
  return (<>
    <div className="flex flex-col items-center justify-center w-full xl:h-96 lg:h-72 md:h-60 h-32 bg-cover bg-center bg-no-repeat">
      <div className={`flex flex-col items-center justify-center w-full h-full bg-no-repeat bg-cover ${bg}`}>
      </div>
    </div>
    <Brand 
      brandSlug={brand}
      products={products}
      filters={filters}
      defaultOrderBy={defaultOrderBy}
      defaultRange={defaultRange}
      defaultFilterIds={defaultFilterIds}
      productFilter={filter}
    />
  </>
  )
};


export default BrandPage;
