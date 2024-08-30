"use client";

import Brand from "@/app/components/product/Brand";
import { usePathname } from 'next/navigation'

const Rubbermaid = () => {
  const [_, filter] = usePathname().split("_")
  return (<>
    <div className="bg-no-repeat bg-cover md:px-7 bg-[url(/brand/banner/1440_290_Banner_RBM.png)] h-96">
    </div>
    <Brand params="thuong-hieu-rubbermaid" productFilter={filter} />
  </>)
};


export default Rubbermaid;
