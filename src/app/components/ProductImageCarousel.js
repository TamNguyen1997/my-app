import Image from "next/image";
import { useMemo, useState } from "react";

const ProductImageCarousel = ({ items = [], mainImage, selectedSaleDetailImage }) => {
	const safe = (url) => (typeof url === 'string' && url.trim().length > 0) ? url : "/default-featured-image.webp";
	const imageList = useMemo(() => items.filter(i => typeof i === 'string' && i.trim().length > 0), [items]);
	const [hoverImage, setHoverImage] = useState(safe(mainImage || imageList[0]));

	return (
		<div className="flex flex-col gap-7">
			<div className="w-2/3 m-auto aspect-square max-w-full sm:w-2/3 sm:h-[450px]">
				<Image
					className="object-contain w-full h-full"
					src={safe(hoverImage || selectedSaleDetailImage || mainImage)}
					width={450}
					height={450}
					sizes="(max-width: 640px) 66vw, 450px"
					alt="Dụng cụ vệ sinh Sao Việt"
				/>
			</div>
			<div className="flex flex-wrap gap-1">
				{
					imageList.map((item, i) =>
						<Image
							src={safe(item)}
							width={120}
							height={120}
							sizes="120px"
							className={`p-2 ${hoverImage === item ? 'border-red-500 border-2' : ''}`}
							key={i}
							onMouseOver={() => {
								setHoverImage(item)
							}}
							alt="Dụng cụ vệ sinh Sao Việt"
						/>
					)
				}
			</div>
		</div>
	)
}

export default ProductImageCarousel
