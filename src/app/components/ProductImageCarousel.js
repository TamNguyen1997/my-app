import Image from "next/image";

const ProductImageCarousel = ({ items = [], setImage = () => { }, mainImage }) => {
	return (
		<div className="flex flex-col gap-7">
			<Image className="w-2/3 m-auto h-[450px]" src={mainImage} width={450} height={450} />
			<div className="flex flex-wrap gap-1">
				{
					items.map((item, i) =>
						<Image src={item} width={120} height={120} className="p-2" key={i} onMouseOver={() => setImage(item)} onMouseOut={() => setImage(null)} />
					)
				}
			</div>
		</div>
	)
}

export default ProductImageCarousel
