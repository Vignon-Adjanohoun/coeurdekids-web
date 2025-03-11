"use client";

import { useEffect, useRef, useState } from "react";

type Brand = {
	name: string;
	url?: string;
};

const brands: Brand[] = [
	{ name: "NEXT" },
	{ name: "Hennes & Mauritz" },
	{ name: "Zara" },
	{ name: "Carter's" },
	{ name: "Nike" },
	{ name: "Addidas" },
	{ name: "New Balance" },
	{ name: "Rebook" },
];

export function BrandMarquee() {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [scrollPosition, setScrollPosition] = useState(0);

	useEffect(() => {
		const scrollContainer = scrollRef.current;
		if (!scrollContainer) return;

		const scrollWidth = scrollContainer.scrollWidth;
		const containerWidth = scrollContainer.clientWidth;

		const animate = () => {
			setScrollPosition((prev) => {
				const nextPosition = prev + 0.5;
				return nextPosition > scrollWidth / 2 ? 0 : nextPosition;
			});
		};

		const animationId = setInterval(animate, 20);

		return () => {
			clearInterval(animationId);
		};
	}, []);

	const allBrands = [...brands, ...brands, ...brands];

	return (
		<section className="w-full py-4 bg-white">
			<div className="w-full">
				<div className="overflow-hidden relative">
					<div
						ref={scrollRef}
						className="flex whitespace-nowrap"
						style={{
							transform: `translateX(-${scrollPosition}px)`,
							transition: scrollPosition === 0 ? "none" : "transform 0.1s linear",
						}}
					>
						{allBrands.map((brand, index) => (
							<div key={`${brand.name}-${index}`} className="flex-shrink-0 mx-8 px-4 py-2">
								<span className="text-lg font-medium text-gray-700">{brand.name}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
