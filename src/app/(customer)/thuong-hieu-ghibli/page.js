"use client";

import Brand from "@/app/components/product/Brand";
import { usePathname } from 'next/navigation'

const Ghibli = () => {
  const [_, filter] = usePathname().split("_")
  return (<>
    <div className="flex flex-col items-center justify-center w-full h-60 bg-cover bg-center bg-no-repeat">
      <div className="flex flex-col items-center justify-center w-full h-full bg-no-repeat bg-cover bg-[url(/brand/banner/1280_480_Banner_RBM.png)]">
      </div>
    </div>
    <Brand params="thuong-hieu-ghibli" productFilter={filter} />
  </>
  )
};


export default Ghibli;
