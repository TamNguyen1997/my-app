import Image from "next/image";
import { useMemo, useState } from "react";

const ProductImageCarousel = ({ items = [], mainImage, selectedSaleDetailImage }) => {
	const safe = (url) => (typeof url === 'string' && url.trim().length > 0) ? url : "/default-featured-image.webp";
	const imageList = useMemo(() => items.filter(i => typeof i === 'string' && i.trim().length > 0), [items]);
	const [hoverImage, setHoverImage] = useState(safe(mainImage || imageList[0]));

	return (
		<div className="flex flex-col gap-5">
			<div className="w-full max-w-[520px] mx-auto aspect-square sm:w-2/3 sm:h-[450px]">
				<Image
					className="object-contain w-full h-full"
					src={safe(hoverImage || selectedSaleDetailImage || mainImage)}
					width={450}
					height={450}
					sizes="(max-width: 640px) 100vw, 450px"
					alt="Dụng cụ vệ sinh Sao Việt"
				/>
			</div>
			<div className="relative">
				<button
					aria-label="Prev"
					onClick={() => {
						const el = document.getElementById('thumbs-scroll')
						if (el) el.scrollBy({ left: -300, behavior: 'smooth' })
					}}
					className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 border rounded-full px-3 py-2 shadow"
				>
					‹
				</button>
				<div
					id="thumbs-scroll"
					className="flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 py-1"
					style={{ scrollbarWidth: 'thin' }}
				>
					{imageList.map((item, i) => (
						<div key={i} className="snap-start shrink-0">
							<Image
								src={safe(item)}
								width={96}
								height={96}
								sizes="(max-width: 640px) 72px, 96px"
								className={`p-1 sm:p-2 cursor-pointer ${hoverImage === item ? 'border-red-500 border-2' : ''}`}
								onClick={() => setHoverImage(item)}
								alt="Dụng cụ vệ sinh Sao Việt"
							/>
						</div>
					))}
				</div>
				<button
					aria-label="Next"
					onClick={() => {
						const el = document.getElementById('thumbs-scroll')
						if (el) el.scrollBy({ left: 300, behavior: 'smooth' })
					}}
					className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 border rounded-full px-3 py-2 shadow"
				>
					›
				</button>
			</div>
		</div>
	)
}

export default ProductImageCarousel
