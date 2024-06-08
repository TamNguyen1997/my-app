"use client"
import { Menu } from "lucide-react";
import parse from 'html-react-parser';
import { useState, useEffect } from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";

export default ({ selector }) => {
	const [headings, setHeadings] = useState([]);
	const [minLevel, setMinLevel] = useState([]);

	useEffect(() => {
		const headingList = document.querySelector(selector)?.querySelectorAll("h2, h3, h4, h5, h6");
		const headingArray = Array.from(headingList);
		let min = 6;
		headingArray.forEach(heading => {
			heading.dataset.id = Math.round(Math.random() * 100000).toString();

			const tagLevel = heading.tagName.match(/(\d+)/)?.[0] || "1";
			min = Math.min(+tagLevel, min);
		});
		setHeadings(headingArray);
		setMinLevel(min);
	}, []);

	return (
		<Accordion
			defaultExpandedKeys={["1"]}
			className="bg-[#f2f4f9] border border-[#d4d5da] rounded px-4"
		>
			<AccordionItem
				key="1"
				aria-label="Nội dung"
				title="Nội dung"
				startContent={<Menu />}
				className={`
                    [&>h2]:font-semibold 
                    [&>h2>button>span]:-rotate-90
                    [&>h2>button>span]:data-[open=true]:rotate-90
                    [&>h2>button>span>svg]:scale-[1.4]
                    [&>h2[data-open=true]>button]:pb-0.5
                    [&>h2>button]:transition-[padding]
                    [&>h2>button]:duration-200
                `}
			>
				{headings.map(heading => {
					const tagLevel = heading.tagName.match(/(\d+)/)?.[0] || "1";
					return (
						<button
							key={heading.dataset.id}
							data-id={heading.dataset.id}
							className={`
                                block w-full text-left p-[11px] first:pt-0
                                [&_*]:leading-none
                                ${+tagLevel > minLevel && "!font-normal"}
                            `}
							style={{
								paddingLeft: (+tagLevel - 2) * 30 + "px"
							}}
							onClick={() => {
								window.scrollTo({
									top: heading.getBoundingClientRect().top + window.scrollY - 60,
									behavior: "smooth"
								});
							}}
						>
							{parse(heading.innerHTML)}
						</button>
					)
				})}
			</AccordionItem>
		</Accordion>
	)
}