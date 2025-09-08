import Image from "next/image";
import { useState } from "react";

const ProductImageCarousel = ({ items = [], mainImage, selectedSaleDetailImage }) => {
	const [hoverImage, setHoverImage] = useState(mainImage || items[0]);

	return (
		<div className="flex flex-col gap-7">
			<div className="w-2/3 m-auto aspect-square max-w-full sm:w-2/3 sm:h-[450px]">
				<Image
					className="object-contain w-full h-full"
					src={hoverImage || selectedSaleDetailImage}
					width={450}
					height={450}
					alt="Dụng cụ vệ sinh Sao Việt"
				/>
			</div>
			<div className="flex flex-wrap gap-1">
				{
					items.map((item, i) =>
						<Image
							src={item}
							width={120}
							height={120}
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
