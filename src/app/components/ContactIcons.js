"use client"

import { Image, Link } from "@nextui-org/react"
import { ChevronUp } from "lucide-react"

const ContactIcons = () => {
  return (<>
    <div className="fixed bottom-0 px-5 right-0 z-50">
      <ul>
        <li>
          <Link href="https://www.facebook.com/vesinhsaoviet/?ref=embed_page" isExternal>
            <span className="relative flex">
              <Image src="/icon/messenger.png" width={48} height={48} />
              <span className="motion-safe:animate-ping-delay absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            </span>
          </Link>
        </li>
        <li>
          <Link href="https://zalo.me/0902366617" isExternal>
            <span className="relative flex">
              <Image src="/icon/zalo.png" width={48} height={48} />
              <span className="motion-safe:animate-ping-delay absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            </span>
          </Link>
        </li>
        <li>
          <Link href="tel:0902802979" isExternal>
            <span className="relative flex bg-[#FFD400] rounded-full">
              <Image src="/icon/phone.png" width={48} height={48} />
              <span className="motion-safe:animate-ping-delay absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            </span>
          </Link>
        </li>
        <li>
          <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Link href="#">
              <ChevronUp size="50"></ChevronUp>
            </Link>
          </div>
        </li>
      </ul>
    </div>
  </>)
}

export default ContactIcons