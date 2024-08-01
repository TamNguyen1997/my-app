import Link from "next/link";
import { User, Calendar } from "lucide-react";

const blogCategories = {
  "INFORMATION": {
    title: "Kiến thức hay",
    slug: "kien-thuc-hay"
  },
  "NEWS": {
    title: "Tin tức",
    slug: "tin-tuc"
  }
}

export default ({ noBorder = false, item, containerClass = "lg:grid-cols-[160px_auto]", textClass = "" }) => {
  return (
    <>
      <Link
        href={`/${blogCategories[item.blogCategory].slug}/${item.slug}`}
        className={`
                    grid gap-4
                    max-w-full
                    ${containerClass}
                    ${!noBorder && '[&:not(:last-child)]:border-b border-[#ebebeb] pb-4'}
                `}
      >
        <img src={`${process.env.NEXT_PUBLIC_FILE_PATH + item.thumbnail}`} alt="" title="" className="w-full aspect-[16/10] object-cover rounded-lg" />
        <div
          className={`${textClass}`}
        >
          <p className="text-xs font-bold text-[#153f17] truncate line-clamp-2 whitespace-normal border-l-3 border-[#FFD400] pl-2 mb-2 blog-category">
            {blogCategories[item.blogCategory].title}
          </p>
          <p className="text-sm font-bold text-[#191919] leading-normal truncate line-clamp-2 whitespace-normal hover:text-[#bb9051] transition mb-2 blog-title">{item.title}</p>
          <p className="text-[13px] truncate line-clamp-2 whitespace-normal mb-2 blog-description">{item.summary}</p>
          <div className="text-xs text-[#a5a5a5] flex items-center flex-wrap">
            <span className="flex items-center">
              <User size="12" color="currentColor" className="mr-1" />
              {item.author}
            </span>
            <div className="w-0.5 h-0.5 min-w-0.5 bg-[currentColor] rounded-full mx-2"></div>
            <span className="flex items-center">
              <Calendar size="12" color="currentColor" className="mr-1" />
              {new Date(item.updatedAt).toLocaleDateString("en-GB")}
            </span>
          </div>
        </div>
      </Link>
    </>
  )
}