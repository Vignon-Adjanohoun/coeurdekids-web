import { publicUrl } from "@/env.mjs";
import { getTranslations } from "@/i18n/server";
import intoProduct from "@/images/highlights/home-product.avif";
import * as Commerce from "@/lib/commerce-lib";
import StoreConfig from "@/store.config";
import { BrandMarquee } from "@/ui/brand-marquee";
import { CategoryBox } from "@/ui/category-box";
import { ProductList } from "@/ui/products/product-list";
import { YnsLink } from "@/ui/yns-link";
import Image from "next/image";
import type { Metadata } from "next/types";

export const metadata = {
	alternates: { canonical: publicUrl },
} satisfies Metadata;

export default async function Home() {
	const products = await Commerce.productBrowse({ first: 6 });
	const t = await getTranslations("/");

	return (
		<main>
			<section className="rounded bg-[#dfdfdf] py-8 sm:py-12">
				<div className="mx-auto grid grid-cols-1 items-center justify-items-center gap-8 px-8 sm:px-16 md:grid-cols-2">
					<div className="max-w-md space-y-4">
						<h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">{t("hero.title")}</h2>
						<p className="text-pretty text-neutral-600">{t("hero.description")}</p>
						<YnsLink
							className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-900 px-6 font-medium text-neutral-50 transition-colors hover:bg-neutral-900/90 focus:outline-hidden focus:ring-1 focus:ring-neutral-950"
							href={t("hero.link")}
						>
							{t("hero.action")}
						</YnsLink>
					</div>
					<Image
						alt="Intro dress"
						loading="eager"
						priority={true}
						className="rounded"
						height={450}
						width={450}
						src={intoProduct}
						style={{
							objectFit: "cover",
						}}
						sizes="(max-width: 640px) 70vw, 450px"
					/>
				</div>
			</section>

			<BrandMarquee />

			<div className="flex justify-between px-2">
				<div className="text-1xl text-neutral-900 py-1">{t("products.newArrival")}</div>
				<div className="text-1xl underline text-neutral-900 py-1">{t("products.viewAll")}</div>
			</div>
			<ProductList products={products} simple={true} />

			<section className="w-full py-8">
				<div className="grid gap-8 lg:grid-cols-2">
					{StoreConfig.categories.map(({ slug, image: src }) => (
						<CategoryBox key={slug} categorySlug={slug} src={src} />
					))}
				</div>
			</section>
		</main>
	);
}
