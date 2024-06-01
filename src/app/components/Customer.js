import Image from "next/image"
import Link from "next/link"

const Customer = () => {

  return (
    <div>
      <div className="p-3">
        <div className="bg-[#ffd300] rounded-tr-[50px] rounded-bl-[50px] flex items-center w-1/3 h-[50px] m-auto">
          <Link href="/" className="m-auto text-black font-bold text-xl">KHÁCH HÀNG SAO VIỆT</Link>
        </div>
      </div>

      <div className="border rounded-lg shadow-md grid grid-cols-3 gap-4 items-center">
        <div className="p-3">
          <Image
            width={400}
            height={200}
            src="/brand/Logo-NikkoSG.png"
          />
        </div>
        <div className="p-3">
          <Image
            width={400}
            height={200}
            src="/brand/Logo-Vingroup.png"
          />
        </div>
        <div className="p-3">
          <Image
            width={400}
            height={200}
            src="/brand/Sun-group-logo.png"
          />
        </div>
        <div className="p-3">
          <Image
            width={400}
            height={200}
            src="/brand/icon-Laz.svg"
          />
        </div>
        <div className="p-3">
          <Image
            width={400}
            height={200}
            src="/brand/icon-Shopee.svg"
          />
        </div>
        <div className="p-3 ">
          <Image
            width={400}
            height={200}
            src="/brand/Logo-Salinda-Resort.png"
          />
        </div>
      </div>
    </div>
  )
}

export default Customer
