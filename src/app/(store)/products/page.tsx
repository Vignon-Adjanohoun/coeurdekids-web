import { publicUrl } from "@/env.mjs";
import { getTranslations } from "@/i18n/server";
import * as Commerce from "@/lib/commerce-lib";
import { ProductList } from "@/ui/products/product-list";
import type { Metadata } from "next/types";

export const generateMetadata = async (): Promise<Metadata> => {
	const t = await getTranslations("/products.metadata");
	return {
		title: t("title"),
		alternates: { canonical: `${publicUrl}/products` },
	};
};

export default async function AllProductsPage() {
	const products = await Commerce.productBrowse({ first: 100 });
	const t = await getTranslations("/products.page");

	return (
		<main className="pb-8">
			<h1 className="text-4xl font-bold leading-none tracking-tight text-foreground uppercase py-5 pl-4">
				{t("title")}
			</h1>
			<ProductList products={products} />
		</main>
	);
}
