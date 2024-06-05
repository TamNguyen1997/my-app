"use client"

import Link from "next/link";
import { User, Calendar } from "lucide-react";

export default ({ noBorder = false, item, containerClass = "lg:grid-cols-[160px_auto]", textClass = "" }) => {
    return (
        <>
            <Link
                href={`/blog/${item.id}`}
                className={`
                    grid gap-4
                    max-w-full
                    ${containerClass}
                    ${!noBorder && '[&:not(:last-child)]:border-b border-[#ebebeb] pb-4'}
                `}
            >
                <img src={item.thumbnail} alt="" title="" className="aspect-[16/10] object-cover rounded-lg" />
                <div
                    className={`${textClass}`}
                >
                    <p className="text-xs font-bold text-[#153f17] truncate line-clamp-2 whitespace-normal border-l-3 border-[#83e214] pl-2 mb-2 blog-category">KIẾN THỨC CƠ BẢN</p>
                    <p className="text-sm font-bold text-[#191919] leading-normal truncate line-clamp-2 whitespace-normal hover:text-[#00b14f] transition mb-2 blog-title">{item.title}</p>
                    <p className="text-[13px] truncate line-clamp-2 whitespace-normal mb-2 blog-description">Mất thẻ ATM ngân hàng là một trong nhiều sự cố người dùng hay gặp phải. Khi bị mất thẻ ngân hàng bạn hãy bình tĩnh để có thể xử lý nhanh và kịp thời nhằm tránh những ảnh hưởng không tốt đến quyền lợi của chính mình. Tham khảo bài viết sau để biết chi tiết nhé!</p>
                    <div className="text-xs text-[#a5a5a5] flex items-center flex-wrap">
                        <span className="flex items-center">
                            <User size="12" color="currentColor" className="mr-1" />
                            Uyên Hoàng
                        </span>
                        <div className="w-0.5 h-0.5 min-w-0.5 bg-[currentColor] rounded-full mx-2"></div>
                        <span className="flex items-center">
                            <Calendar size="12" color="currentColor" className="mr-1" />
                            13/03/2024
                        </span>
                    </div>
                </div>
            </Link>
        </>
    )
}