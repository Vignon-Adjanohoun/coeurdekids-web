"use client";
import type { Product } from "@/types/models";
import { useEffect, useState } from "react";
import { ProductBottomStickyCard } from "./product-bottom-sticky-card";

export const StickyBottom = ({
	children,
	product,
	locale,
}: Readonly<{
	children: React.ReactNode;
	product: Product;
	locale: string;
}>) => {
	const [show, setShow] = useState(false);
	useEffect(() => {
		const button = document.getElementById("button-add-to-cart");
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry) {
					setShow(!entry.isIntersecting);
				}
			},
			{ threshold: 0, rootMargin: "-100px 0px 0px 0px" },
		);

		if (button) {
			observer.observe(button);
		}

		return () => {
			if (button) {
				observer.unobserve(button);
			}
		};
	}, []);
	return (
		<>
			{children}
			<ProductBottomStickyCard product={product} locale={locale} show={show} />
		</>
	);
};
