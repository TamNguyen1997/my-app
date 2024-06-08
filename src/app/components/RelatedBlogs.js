import Link from "next/link";
import Image from "next/image";

export default () => {
  return (
    <>
      <div className="text-lg text-[#FFD300] leading-none font-semibold border-l-4 border-[#83e214] pl-3 mb-4">BÀI VIẾT LIÊN QUAN</div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {
          [...Array(4)].map((_, index) => {
            return (
              <Link href="" className="flex items-center" key={index}>
                <Image
                  src="/gallery/free-images.jpg"
                  width="192"
                  height="120"
                  alt=""
                  title=""
                  
                  className="rounded"
                />
                <div className="pl-4">
                  <p className="text-sm font-semibold truncate line-clamp-2 whitespace-normal text-[#83e214] mb-2">KIẾN THỨC CƠ BẢN</p>
                  <p className="font-semibold truncate line-clamp-2 whitespace-normal mb-2">Thẻ đen là gì? Các đặc quyền thẻ đen ngân hàng với nhiều lợi ích</p>
                  <div className="text-xs text-[#a5a5a5] flex items-center flex-wrap">
                    <span>Uyên Hoàng</span>
                    <div className="w-0.5 h-0.5 min-w-0.5 bg-[currentColor] rounded-full mx-2"></div>
                    <span>13/03/2024</span>
                  </div>
                </div>
              </Link>
            )
          })
        }
      </div>
    </>
  )
}