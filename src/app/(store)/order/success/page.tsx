import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLocale, getTranslations } from "@/i18n/server";
import { getCartCookieJson } from "@/lib/cart";
import { cartGetByTracking } from "@/lib/commerce-lib";
import { findMatchingCountry } from "@/lib/countries";
import { formatMoney, formatProductName } from "@/lib/utils";
import type { CartStatus } from "@/types/models";
import { ClearCookieClientComponent } from "@/ui/checkout/clear-cookie-client-component";
import { Markdown } from "@/ui/markdown";
import { Separator } from "@/ui/separator";
import { YnsLink } from "@/ui/yns-link";
import { CheckCircle2, Clock, MapPin, Package, ShoppingBag, Truck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import React, { type ComponentProps, Fragment } from "react";

export const generateMetadata = async (): Promise<Metadata> => {
	const t = await getTranslations("/order.metadata");
	return {
		title: t("title"),
	};
};

export default async function OrderDetailsPage(props: {
	searchParams: Promise<{
		tracking?: string | string[] | undefined | null;
	}>;
}) {
	const searchParams = await props.searchParams;
	if (typeof searchParams.tracking !== "string") {
		return <OrderErrorState message="Invalid order details" />;
	}

	const order = await cartGetByTracking(searchParams.tracking);
	if (!order) {
		return <OrderErrorState message="Order not found" />;
	}

	const cookie = await getCartCookieJson();
	const t = await getTranslations("/order.page");
	const locale = await getLocale();

	// Calculate order totals
	const subtotal = order.lines.reduce(
		(total, line) => total + (line.product.default_price.unit_amount ?? 0) * line.quantity,
		0,
	);
	// const shipping = order.shippingRate?.amount || 0;
	// const grandTotal = order.cart.amount;
	// const tax = grandTotal - subtotal - shipping;

	return (
		<div className="container mx-auto py-8 px-4 md:px-6">
			<ClearCookieClientComponent cartId={order.id} cookieId={cookie?.id} />

			{/* Order Success Header */}
			<div className="mb-12 text-center">
				<div className="inline-flex items-center justify-center bg-emerald-100 rounded-full p-3 mb-4">
					<CheckCircle2 className="h-10 w-10 text-emerald-600" />
				</div>
				<h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{t("title")}</h1>
				<p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("description")}</p>
				<div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
					<div className="flex items-center">
						<span className="text-sm font-medium mr-2">{t("orderNumberTitle")}:</span>
						<Badge variant="outline" className="text-lg px-3 py-1 font-mono">
							{order.trackingNumber}
						</Badge>
					</div>
					<OrderStatus status={order.status} />
				</div>
			</div>

			<div className="grid gap-8 lg:grid-cols-3">
				{/* Order Details Section */}
				<div className="lg:col-span-2">
					<Card>
						<CardHeader className="border-b">
							<div className="flex items-center justify-between">
								<CardTitle>
									<div className="flex items-center">
										<ShoppingBag className="h-5 w-5 mr-2" />
										{t("productsTitle") || "Order Items"}
									</div>
								</CardTitle>
								<Badge>
									{order.lines.length} {order.lines.length === 1 ? "item" : "items"}
								</Badge>
							</div>
						</CardHeader>
						<CardContent className="p-0">
							<ul role="list" className="divide-y">
								{order.lines.map((line) => (
									<li key={line.product.id} className="p-6">
										<div className="flex gap-4">
											{line.product.images[0] && (
												<div className="flex-shrink-0">
													<div className="h-24 w-24 rounded-md overflow-hidden border">
														<Image
															className="h-full w-full object-cover object-center"
															src={line.product.images[0]}
															width={96}
															height={96}
															alt=""
														/>
													</div>
												</div>
											)}
											<div className="flex flex-1 flex-col">
												<div className="flex justify-between">
													<h3 className="font-medium text-foreground">
														{formatProductName(line.product.name, line.product.metadata.variant)}
													</h3>
													<p className="font-medium">
														{formatMoney({
															amount: (line.product.default_price.unit_amount ?? 0) * line.quantity,
															currency: line.product.default_price.currency,
															locale,
														})}
													</p>
												</div>

												<div className="mt-1 text-sm text-muted-foreground line-clamp-2">
													<Markdown source={line.product.description || ""} />
												</div>

												<div className="mt-2 flex items-center text-sm text-muted-foreground">
													<span>
														{t("quantity")}: {line.quantity}
													</span>
													<span className="mx-2">•</span>
													<span>
														{formatMoney({
															amount: line.product.default_price.unit_amount ?? 0,
															currency: line.product.default_price.currency,
															locale,
														})}{" "}
														{t("each")}
													</span>
													{line.product.metadata.size && (
														<>
															<span className="mx-2">•</span>
															<span>
																Size: {line.product.metadata.size_description || line.product.metadata.size}
															</span>
														</>
													)}
												</div>
											</div>
										</div>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				</div>

				{/* Order Summary & Shipping Section */}
				<div className="space-y-8">
					{/* Order Summary */}
					<Card>
						<CardHeader className="border-b">
							<CardTitle>
								<div className="flex items-center">
									<Package className="h-5 w-5 mr-2" />
									{t("orderSummary") || "Order Summary"}
								</div>
							</CardTitle>
						</CardHeader>
						<CardContent className="p-6">
							<div className="space-y-4">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">{t("subtotal") || "Subtotal"}</span>
									<span>
										{formatMoney({
											amount: subtotal,
											currency: order.cart.currency,
											locale,
										})}
									</span>
								</div>

								{/* <div className="flex justify-between text-sm">
									<span className="text-muted-foreground">{t("shipping") || "Shipping"}</span>
									<span>
										{formatMoney({
											amount: shipping,
											currency: order.cart.currency,
											locale,
										})}
									</span>
								</div> */}

								{/* {tax > 0 && (
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">{t("tax") || "Tax"}</span>
										<span>
											{formatMoney({
												amount: tax,
												currency: order.cart.currency,
												locale,
											})}
										</span>
									</div>
								)} */}

								<Separator />

								<div className="flex justify-between font-medium">
									<span>{t("total") || "Total"}</span>
									<span>
										{formatMoney({
											amount: order.cart.amount,
											currency: order.cart.currency,
											locale,
										})}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Shipping Address */}
					{order.shippingAddress && (
						<Card>
							<CardHeader className="border-b">
								<CardTitle>
									<div className="flex items-center">
										<MapPin className="h-5 w-5 mr-2" />
										{t("shippingAddress") || "Shipping Address"}
									</div>
								</CardTitle>
							</CardHeader>
							<CardContent className="p-6">
								<div className="space-y-1">
									<p className="font-medium">{order.shippingAddress.name}</p>
									<p>{order.shippingAddress.line1}</p>
									{order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
									<p>
										{order.shippingAddress.city}
										{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ""}
										{order.shippingAddress.postalCode ? ` ${order.shippingAddress.postalCode}` : ""}
									</p>
									<p>{findMatchingCountry(order.shippingAddress?.country)?.label}</p>
									<Separator className="my-3" />
									<div className="flex items-center">
										<p className="text-sm text-muted-foreground">
											<span className="block">{order.shippingAddress.email}</span>
											{order.shippingAddress.phone && <span>{order.shippingAddress.phone}</span>}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Shipping Status */}
					<Card>
						<CardHeader className="border-b">
							<CardTitle>
								<div className="flex items-center">
									<Truck className="h-5 w-5 mr-2" />
									{t("deliveryStatus") || "Delivery Status"}
								</div>
							</CardTitle>
						</CardHeader>
						<CardContent className="p-6">
							<div className="space-y-4">
								<div className="flex items-center">
									<div className="relative mr-3">
										<div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
											<Clock className="h-4 w-4 text-emerald-600" />
										</div>
										<div className="absolute left-1/2 top-full h-12 w-px -translate-x-1/2 bg-emerald-200" />
									</div>
									<div>
										<p className="font-medium">{t("orderPlaced") || "Order Placed"}</p>
										<p className="text-sm text-muted-foreground">
											{new Date(order.cart.created_at || Date.now()).toLocaleDateString(locale, {
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
										</p>
									</div>
								</div>

								<div className="flex items-center">
									<div className="mr-3">
										<div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
											<Package className="h-4 w-4 text-slate-600" />
										</div>
									</div>
									<div>
										<p className="font-medium">{t("statusUpdates") || "Status Updates"}</p>
										<p className="text-sm text-muted-foreground">
											{t("willBeUpdated") || "Your order status will be updated soon"}
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Footer */}
			<div className="mt-12 text-center">
				<p className="mb-4 text-muted-foreground">{t("questions") || "Have questions about your order?"}</p>
				<div className="flex flex-wrap justify-center gap-4">
					<YnsLink href="/products" className="inline-flex items-center">
						<ShoppingBag className="mr-2 h-4 w-4" />
						{t("continueShopping") || "Continue Shopping"}
					</YnsLink>
					<YnsLink href="/contact" className="inline-flex items-center">
						{t("contactUs") || "Contact Us"}
					</YnsLink>
				</div>
			</div>
		</div>
	);
}

// Error state component
function OrderErrorState({ message }: { message: string }) {
	return (
		<div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
			<div className="rounded-full bg-muted p-6">
				<ShoppingBag className="h-12 w-12 text-muted-foreground" />
			</div>
			<h2 className="text-2xl font-bold tracking-tight">{message}</h2>
			<p className="text-muted-foreground">Try checking your tracking number or viewing your recent orders</p>
			<YnsLink
				className="inline-flex h-10 items-center justify-center rounded-md bg-neutral-900 px-6 text-sm font-medium text-neutral-50 shadow-sm transition-colors hover:bg-neutral-900/90 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50"
				href="/products"
			>
				Continue Shopping
			</YnsLink>
		</div>
	);
}

// Order status badge component
const OrderStatus = async ({ status }: { status: CartStatus }) => {
	const t = await getTranslations("/order.cartStatus");
	const statusConfig = {
		canceled: { variant: "destructive", icon: <Clock className="h-4 w-4 mr-1" /> },
		processing: { variant: "secondary", icon: <Package className="h-4 w-4 mr-1" /> },
		confirmed: { variant: "secondary", icon: <CheckCircle2 className="h-4 w-4 mr-1" /> },
		submitted: { variant: "secondary", icon: <Clock className="h-4 w-4 mr-1" /> },
		delivering: { variant: "secondary", icon: <Truck className="h-4 w-4 mr-1" /> },
		completed: { variant: "default", icon: <CheckCircle2 className="h-4 w-4 mr-1" /> },
	} satisfies Record<CartStatus, { variant: ComponentProps<typeof Badge>["variant"]; icon: JSX.Element }>;

	const config = statusConfig[status];

	return (
		<Badge className="capitalize px-3 py-1 text-sm flex items-center" variant={config.variant}>
			{config.icon}
			{t(status)}
		</Badge>
	);
};
