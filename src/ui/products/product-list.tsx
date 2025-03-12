import { getLocale } from "@/i18n/server";
import { formatMoney } from "@/lib/utils";
import type { Product } from "@/types/models";
import { JsonLd, mappedProductsToJsonLd } from "@/ui/json-ld";
import { YnsLink } from "@/ui/yns-link";
import type * as Commerce from "commerce-kit";
import Image from "next/image";

export const ProductList = async ({
	products,
	simple = false,
}: {
	products: Product[];
	simple?: boolean;
}) => {
	const locale = await getLocale();

	return (
		<>
			<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				{products.map((product, idx) => {
					return (
						<li key={product.id} className="group">
							<YnsLink
								href={`/product/${product.metadata.slug}${
									product.metadata.variant ? `?variant=${product.metadata.variant}` : ""
								}`}
							>
								<article className="overflow-hidden bg-white">
									{product.images[0] && (
										<div className="aspect-square w-full overflow-hidden bg-neutral-100">
											<Image
												className="group-hover:rotate hover-perspective w-full bg-neutral-100 object-cover object-center transition-opacity group-hover:opacity-75"
												src={product.images[0]}
												width={768}
												height={768}
												loading={idx < 3 ? "eager" : "lazy"}
												priority={idx < 3}
												sizes="(max-width: 1024x) 100vw, (max-width: 1280px) 50vw, 700px"
												alt=""
											/>
										</div>
									)}
									{!simple && (
										<div className="p-2">
											{product.metadata?.brand && (
												<h4 className="text-sm font-medium text-neutral-700">{product.metadata?.brand}</h4>
											)}
											<h2 className="text-xl font-medium text-neutral-700">{product.name}</h2>
											<footer className="text-base font-normal text-neutral-900">
												{product.default_price.unit_amount && (
													<p>
														{formatMoney({
															amount: product.default_price.unit_amount,
															currency: product.default_price.currency,
															locale,
														})}
													</p>
												)}
											</footer>
										</div>
									)}
								</article>
							</YnsLink>
						</li>
					);
				})}
			</ul>
			<JsonLd jsonLd={mappedProductsToJsonLd(products)} />
		</>
	);
};
