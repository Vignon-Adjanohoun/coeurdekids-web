import "@/app/globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartModalProvider } from "@/context/cart-modal";
import * as Commerce from "@/lib/commerce-lib";
import { Footer } from "@/ui/footer/footer";
import { JsonLd, accountToWebsiteJsonLd } from "@/ui/json-ld";
import { Nav } from "@/ui/nav/nav";
import { CartModalPage } from "./cart/cart-modal";

export default async function StoreLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const accountResult = await Commerce.accountGet();
	const logoLink = "/images/logo/logo.png";

	return (
		<>
			{/* <CommerceGPT /> */}
			<CartModalProvider>
				<Nav />
				<TooltipProvider>
					<main className="mx-auto flex w-full flex-1 flex-col pb-6">
						{children}
						<CartModalPage />
					</main>
					<Footer />
				</TooltipProvider>
			</CartModalProvider>
			<JsonLd
				jsonLd={accountToWebsiteJsonLd({
					account: accountResult?.account,
					logoUrl: logoLink,
				})}
			/>
		</>
	);
}
