import Link from "next/link";

const blogCategories = {
  "INFORMATION": "blog",
  "NEWS": "tin-tuc"
}

export default ({ relatedBlogs }) => {
  return (
    <>
      <div className="text-lg text-[#FFD300] leading-none font-semibold border-l-4 border-[#FFD300] pl-3 mb-4">BÀI VIẾT LIÊN QUAN</div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {
          relatedBlogs.map((item, index) => {
            return (
              <Link href={`/${blogCategories[item.blogCategory]}/${item.slug}`} className="flex items-center" key={index}>
                <img
                  src={`${process.env.NEXT_PUBLIC_FILE_PATH + item.thumbnail}`}
                  width="192"
                  height="120"
                  alt=""
                  title=""
                  className="rounded"
                />
                <div className="pl-4">
                  <p className="text-sm font-semibold truncate line-clamp-2 whitespace-normal text-[#FFD300] mb-2">TIN TỨC</p>
                  <p className="font-semibold truncate line-clamp-2 whitespace-normal mb-2">{item.title}</p>
                  <div className="text-xs text-[#a5a5a5] flex items-center flex-wrap">
                    <span>{item.title}</span>
                    <div className="w-0.5 h-0.5 min-w-0.5 bg-[currentColor] rounded-full mx-2"></div>
                    <span>{item.activeFrom ? new Date(item.activeFrom).toLocaleDateString() : ""}</span>
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