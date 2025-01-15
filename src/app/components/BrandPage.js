"use client";

import Brand from "@/app/components/product/Brand";
import ErrorBoundary from "@/components/ErrorBoundary";
import { usePathname } from 'next/navigation'

const BrandPage = ({ brand, bg }) => {
  const [_, filter] = usePathname().split("#")
  return (<>
    <ErrorBoundary>
      <div className="flex flex-col items-center justify-center w-full xl:h-96 lg:h-72 md:h-60 h-32 bg-cover bg-center bg-no-repeat">
        <div className={`flex flex-col items-center justify-center w-full h-full bg-no-repeat bg-cover ${bg}`}>
        </div>
      </div>
      <Brand params={brand} productFilter={filter} />
    </ErrorBoundary>
  </>
  )
};


export default BrandPage;
