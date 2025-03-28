import { getCartFromCookiesAction } from "@/actions/cart-actions";
import { getLocale, getTranslations } from "@/i18n/server";
import type { ReactNode } from "react";

import { CartEmpty } from "@/ui/checkout/cart-empty";
import { CartSummaryTable } from "@/ui/checkout/cart-summary-table";

export default async function CartLayout({ children }: { children: ReactNode }) {
	const cart = await getCartFromCookiesAction();
	if (!cart || cart.lines.length === 0) {
		return <CartEmpty />;
	}
	const t = await getTranslations("/cart.page");
	const locale = await getLocale();

	return (
		<div className="min-h-[calc(100dvh-7rem)] xl:grid xl:grid-cols-12 xl:gap-x-8">
			<div className="xl:col-span-7">
				<div className="sticky top-1">
					<h1 className="mb-4 text-4xl font-bold leading-none tracking-tight py-5 pl-4">{t("title")}</h1>
					<CartSummaryTable cart={structuredClone(cart)} locale={locale} />
				</div>
			</div>
			<div className="max-w-[65ch] xl:col-span-5">{children}</div>
		</div>
	);
}
