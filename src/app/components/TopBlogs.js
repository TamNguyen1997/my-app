import BlogItem from "@/components/BlogItem";

export default ({ items }) => {
	return (
		<>
			<div className="text-lg text-[#191919] leading-none font-bold border-l-4 border-[#ffd300] pl-3 mb-4">Bài viết xem nhiều</div>

			<div className="space-y-3">
				{
					items.map(item => {
						return (
							<BlogItem
								item={item}
								key={item.id}
								textClass={`
										[&_.blog-category]:mb-0.5
										[&_.blog-title]:mb-1
										[&_.blog-description]:mb-1
								`}
							/>
						)
					})
				}
			</div>
		</>
	)
}