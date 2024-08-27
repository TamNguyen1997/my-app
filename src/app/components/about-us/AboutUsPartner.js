import Customer from "@/components/Customer";

const AboutUsPartner = () => {
	return (
		<div className="bg-[#eff2f8]">
			<div className="container pt-[60px] pb-10">
				<div className="max-w-full overflow-hidden">
					<h2 className="text-3xl font-semibold text-center mb-8">
						Đối tác của Sao Việt
					</h2>

					<Customer hideTitle />
				</div>
			</div>
		</div>
	)
};

export default AboutUsPartner;