"use client";

import Brand from "@/app/components/product/Brand";
import { usePathname } from 'next/navigation'

const KimberlyClark = () => {
  const [_, filter] = usePathname().split("_")
  return (
    <>
      <div className="bg-no-repeat bg-cover md:px-7 bg-[url(/brand/banner/1440_290_Banner_Kimberly.png)] h-96">
      </div>
      <Brand params="thuong-hieu-kimberly-clark" productFilter={filter} />
    </>
  )
};


export default KimberlyClark;
