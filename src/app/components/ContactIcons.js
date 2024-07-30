"use client"

import { Link } from "@nextui-org/react"
import { ChevronUp, Phone } from "lucide-react"

const ContactIcons = () => {
  return (<>
    <div className="fixed bottom-0 px-5 right-0">
      <ul>
        <li>
          <Link href="https://www.facebook.com/vesinhsaoviet/?ref=embed_page" isExternal>
            <span className="relative flex">
              <img src="/icon/messenger.png"></img>
              <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            </span>
          </Link>
        </li>
        <li>
          <Link href="https://zalo.me/0902405225" isExternal>
            <span className="relative flex">
              <img src="/icon/zalo.png"></img>
              <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            </span>
          </Link>
        </li>
        <li>
          <Link href="tel:0903802979" isExternal>
            <span className="relative flex bg-[#ffd300] rounded-full">
              <img src="/icon/phone.png"></img>
              <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            </span>
          </Link>
        </li>
        <li>
          <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Link href="">
              <ChevronUp size="50"></ChevronUp>
            </Link>
          </div>
        </li>
      </ul>
    </div>
  </>)
}

export default ContactIcons