// import { ProductModel3D } from "@/app/(store)/product/[slug]/product-model3d";
import { ProductImageModal } from "@/app/(store)/product/[slug]/product-image-modal";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { publicUrl } from "@/env.mjs";
import { getLocale, getTranslations } from "@/i18n/server";
import * as Commerce from "@/lib/commerce-lib";
import { getRecommendedProducts } from "@/lib/search/trieve";
import { cn, deslugify, formatMoney, formatProductName } from "@/lib/utils";
import type { TrieveProductMetadata } from "@/scripts/upload-trieve";
import { AddToCartButton } from "@/ui/add-to-cart-button";
import { JsonLd, mappedProductToJsonLd } from "@/ui/json-ld";
import { MainProductImage } from "@/ui/products/main-product-image";
import { StickyBottom } from "@/ui/sticky-bottom";
import { YnsLink } from "@/ui/yns-link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { Suspense } from "react";

export const generateMetadata = async (props: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ variant?: string; size?: string }>;
}): Promise<Metadata> => {
	const searchParams = await props.searchParams;
	const params = await props.params;
	const variants = await Commerce.productGet({ slug: params.slug });

	const selectedVariant = searchParams.variant || variants[0]?.metadata.variant;
	const product = variants.find((variant) => variant.metadata.variant === selectedVariant);
	if (!product) {
		return notFound();
	}
	const t = await getTranslations("/product.metadata");

	const canonical = new URL(`${publicUrl}/product/${product.metadata.slug}`);
	if (selectedVariant) {
		canonical.searchParams.set("variant", selectedVariant);
	}
	if (searchParams.size) {
		canonical.searchParams.set("size", searchParams.size);
	}

	const productName = formatProductName(product.name, product.metadata.variant);

	return {
		title: t("title", { productName }),
		description: product.description,
		alternates: { canonical },
	} satisfies Metadata;
};

export default async function SingleProductPage(props: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ variant?: string; size?: string; image?: string }>;
}) {
	const params = await props.params;
	const searchParams = await props.searchParams;

	const variants = await Commerce.productGet({ slug: params.slug });
	const selectedVariant = (variants.length > 1 && searchParams.variant) || variants[0]?.metadata.variant;
	const product = variants.find((variant) => variant.metadata.variant === selectedVariant);

	if (!product) {
		return notFound();
	}

	const t = await getTranslations("/product.page");
	const locale = await getLocale();

	const category = product.metadata.category;
	const images = product.images;

	// Find variants with the same color (current color)
	const sameColorVariants = variants.filter((variant) => variant.metadata.variant === selectedVariant);

	// Extract available sizes for the current color variant
	const availableSizes = sameColorVariants.map((variant) => variant.metadata.size).filter(Boolean);

	// Get selected size or default to the product's size or first available size
	const selectedSize = searchParams.size || product.metadata.size || availableSizes[0];

	// Get the correct product for the selected variant and size combination
	const selectedProduct =
		sameColorVariants.find((variant) => variant.metadata.size === selectedSize) || product;

	return (
		<article className="pb-12">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink
							asChild
							className="inline-flex min-h-12 min-w-12 items-center justify-center pl-4 uppercase"
						>
							<YnsLink href="/products">{t("allProducts")}</YnsLink>
						</BreadcrumbLink>
					</BreadcrumbItem>
					{category && (
						<>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink
									className="inline-flex min-h-12 min-w-12 items-center justify-center uppercase"
									asChild
								>
									<YnsLink href={`/category/${category}`}>{deslugify(category)}</YnsLink>
								</BreadcrumbLink>
							</BreadcrumbItem>
						</>
					)}
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{product.name}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<StickyBottom product={selectedProduct} locale={locale}>
				<div className="mt-4 grid gap-4 lg:grid-cols-12">
					<div className="lg:col-span-5 lg:col-start-8">
						<h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">{product.name}</h1>
						{selectedProduct.default_price.unit_amount && (
							<p className="mt-2 text-2xl font-medium leading-none tracking-tight text-foreground/70">
								{formatMoney({
									amount: selectedProduct.default_price.unit_amount,
									currency: selectedProduct.default_price.currency,
									locale,
								})}
							</p>
						)}
						<div className="mt-2">{selectedProduct.metadata.stock <= 0 && <div>Out of stock</div>}</div>
					</div>

					<div className="lg:col-span-7 lg:row-span-3 lg:row-start-1">
						<h2 className="sr-only">{t("imagesTitle")}</h2>

						<div className="grid gap-4 lg:grid-cols-3 [&>*:first-child]:col-span-3">
							{images.map((image, idx) => {
								const params = new URLSearchParams({
									image: idx.toString(),
								});
								if (searchParams.variant) {
									params.set("variant", searchParams.variant);
								}
								if (searchParams.size) {
									params.set("size", searchParams.size);
								}
								return (
									<YnsLink key={idx} href={`?${params}`} scroll={false}>
										{idx === 0 && !product.metadata.preview ? (
											<MainProductImage
												key={image}
												className="w-full rounded-lg bg-neutral-100 object-cover object-center transition-opacity"
												src={image}
												loading="eager"
												priority
												alt=""
											/>
										) : (
											<Image
												key={image}
												className="w-full rounded-lg bg-neutral-100 object-cover object-center transition-opacity"
												src={image}
												width={700 / 3}
												height={700 / 3}
												sizes="(max-width: 1024x) 33vw, (max-width: 1280px) 20vw, 225px"
												loading="eager"
												priority
												alt=""
											/>
										)}
									</YnsLink>
								);
							})}
						</div>
					</div>

					<div className="grid gap-4 lg:col-span-5">
						<section>
							<h2 className="sr-only">{t("descriptionTitle")}</h2>
							{/* <div className="prose text-secondary-foreground">
                                <Markdown source={product.description || ""} />
                            </div> */}
						</section>

						{/* Color variants selection */}
						{variants.length > 1 && (
							<div className="grid gap-2">
								<p className="text-base font-medium" id="variant-label">
									<span className="uppercase">{t("colourTitle")}: </span>
									<span className="">{selectedVariant ? deslugify(selectedVariant) : ""}</span>
								</p>
								<ul role="list" className="grid grid-cols-4 gap-2" aria-labelledby="variant-label">
									{/* Get unique color variants */}
									{[...new Set(variants.map((variant) => variant.metadata.variant))]
										.filter(Boolean)
										.map((variantColor, idx) => {
											const variantProduct = variants.find((v) => v.metadata.variant === variantColor);
											if (!variantProduct) return null;

											const isSelected = selectedVariant === variantColor;
											return (
												<li key={variantProduct.id}>
													<YnsLink
														scroll={false}
														prefetch={true}
														href={`/product/${variantProduct.metadata.slug}?variant=${variantColor}${
															selectedSize ? `&size=${selectedSize}` : ""
														}`}
														className={cn(
															"flex cursor-pointer items-center justify-center gap-2 rounded-md border transition-colors hover:bg-neutral-100",
															isSelected && "border-black bg-neutral-50 font-medium",
														)}
														aria-selected={isSelected}
													>
														{variantProduct.images[0] ? (
															<div className="aspect-auto w-full overflow-hidden bg-neutral-100 rounded-md">
																<Image
																	className="group-hover:rotate rounded-md hover-perspective w-full bg-neutral-100 object-cover object-center transition-opacity group-hover:opacity-75"
																	src={variantProduct.images[0]}
																	width={200}
																	height={300}
																	loading={idx < 3 ? "eager" : "lazy"}
																	priority={idx < 3}
																	sizes="(max-width: 1024x) 100vw, (max-width: 1280px) 50vw, 700px"
																	alt=""
																/>
															</div>
														) : (
															deslugify(variantColor)
														)}
													</YnsLink>
												</li>
											);
										})}
								</ul>
							</div>
						)}

						{/* Size selection */}
						{availableSizes.length > 0 && (
							<div className="grid gap-2 mt-4">
								<p className="text-base font-medium" id="size-label">
									<span className="uppercase">{t("sizeTitle") || "Size"}: </span>
									<span className="">{selectedSize || ""}</span>
								</p>
								<ul role="list" className="grid grid-cols-4 gap-2" aria-labelledby="size-label">
									{availableSizes.map((size) => {
										if (!size) return null;
										const isSelected = selectedSize === size;
										const sizeVariant = sameColorVariants.find((variant) => variant.metadata.size === size);
										const isOutOfStock = sizeVariant && sizeVariant.metadata.stock <= 0;

										return (
											<li key={size}>
												<YnsLink
													scroll={false}
													prefetch={true}
													href={`/product/${product.metadata.slug}?variant=${selectedVariant}&size=${size}`}
													className={cn(
														"flex h-10 cursor-pointer items-center justify-center rounded-md border transition-colors",
														isSelected ? "border-black bg-neutral-50 font-medium" : "hover:bg-neutral-100",
														isOutOfStock && "opacity-50 cursor-not-allowed",
													)}
													aria-selected={isSelected}
													aria-disabled={isOutOfStock}
													onClick={isOutOfStock ? (e) => e.preventDefault() : undefined}
												>
													{size}
													{isOutOfStock && <span className="ml-1 text-xs">(Out of stock)</span>}
												</YnsLink>
											</li>
										);
									})}
								</ul>
							</div>
						)}

						<AddToCartButton productId={selectedProduct.id} disabled={selectedProduct.metadata.stock <= 0} />
					</div>
				</div>
			</StickyBottom>

			<Suspense>
				<SimilarProducts id={selectedProduct.id} />
			</Suspense>

			<Suspense>
				<ProductImageModal images={images} />
			</Suspense>

			<JsonLd jsonLd={mappedProductToJsonLd(selectedProduct)} />
		</article>
	);
}

async function SimilarProducts({ id }: { id: string }) {
	const products = await getRecommendedProducts({ productId: id, limit: 4 });

	if (!products) {
		return null;
	}

	return (
		<section className="py-12">
			<div className="mb-8">
				<h2 className="text-2xl font-bold tracking-tight">You May Also Like</h2>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{products.map((product) => {
					const trieveMetadata = product.metadata as TrieveProductMetadata;
					return (
						<div key={product.tracking_id} className="bg-card rounded overflow-hidden shadow-sm group">
							{trieveMetadata.image_url && (
								<YnsLink href={`${publicUrl}${product.link}`} className="block" prefetch={false}>
									<Image
										className={
											"w-full rounded-lg bg-neutral-100 object-cover object-center group-hover:opacity-80 transition-opacity"
										}
										src={trieveMetadata.image_url}
										width={300}
										height={300}
										sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px"
										alt=""
									/>
								</YnsLink>
							)}
							<div className="p-4">
								<h3 className="text-lg font-semibold mb-2">
									<YnsLink href={product.link || "#"} className="hover:text-primary" prefetch={false}>
										{trieveMetadata.name}
									</YnsLink>
								</h3>
								<div className="flex items-center justify-between">
									<span>
										{formatMoney({
											amount: trieveMetadata.amount,
											currency: trieveMetadata.currency,
										})}
									</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
