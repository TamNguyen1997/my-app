"use client"

import { ChevronUp } from "lucide-react"
import Link from "next/link"

const ContactIcons = () => {
  return (<>
    <div className="fixed bottom-5 p-5">
      <ul>
        <li>
          <span class="relative flex">
            <img src="/icon/zalo.png"></img>
            <span class="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          </span>
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