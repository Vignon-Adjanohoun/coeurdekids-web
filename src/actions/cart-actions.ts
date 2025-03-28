"use server";

import { clearCartCookie, getCartCookieJson, setCartCookieJson } from "@/lib/cart";
import * as Commerce from "@/lib/commerce-lib";
import type { Cart } from "@/types/models";
import type { AddressSchema } from "@/ui/checkout/checkout-form-schema";
import { revalidateTag } from "next/cache";

export async function getCartFromCookiesAction() {
	const cartJson = await getCartCookieJson();
	if (!cartJson) {
		return null;
	}

	const cart = await Commerce.cartGet(cartJson.id);
	if (cart) {
		return structuredClone(cart);
	}
	return null;
}

export async function setInitialCartCookiesAction(cartId: string, linesCount: number) {
	await setCartCookieJson({
		id: cartId,
		linesCount,
	});
	revalidateTag(`cart-${cartId}`);
}

export async function findOrCreateCartIdFromCookiesAction() {
	const cart = await getCartFromCookiesAction();
	if (cart) {
		return structuredClone(cart);
	}

	const newCart = await Commerce.cartCreate();
	await setCartCookieJson({
		id: newCart.id,
		linesCount: 0,
	});
	revalidateTag(`cart-${newCart.id}`);

	return newCart.id;
}

export async function clearCartCookieAction() {
	const cookie = await getCartCookieJson();
	if (!cookie) {
		return;
	}

	await clearCartCookie();
	revalidateTag(`cart-${cookie.id}`);
	// FIXME not ideal, revalidate per domain instead (multi-tenant)
	revalidateTag(`admin-orders`);
}

export async function addToCartAction(formData: FormData) {
	const productId = formData.get("productId");
	if (!productId || typeof productId !== "string") {
		throw new Error("Invalid product ID");
	}

	const cart = await getCartFromCookiesAction();

	const updatedCart = await Commerce.cartAdd({ productId, cartId: cart?.id });

	if (updatedCart) {
		await setCartCookieJson({
			id: updatedCart.id,
			linesCount: Commerce.cartCount(updatedCart),
		});

		revalidateTag(`cart-${updatedCart.id}`);
		return structuredClone(updatedCart);
	}
}

export async function increaseQuantity(productId: string) {
	const cart = await getCartFromCookiesAction();
	if (!cart) {
		throw new Error("Cart not found");
	}
	await Commerce.cartChangeQuantity({
		productId,
		cartId: cart.id,
		operation: "INCREASE",
	});
}

export async function decreaseQuantity(productId: string) {
	const cart = await getCartFromCookiesAction();
	if (!cart) {
		throw new Error("Cart not found");
	}
	await Commerce.cartChangeQuantity({
		productId,
		cartId: cart.id,
		operation: "DECREASE",
	});
}

export async function setQuantity({
	productId,
	cartId,
	quantity,
}: {
	productId: string;
	cartId: string;
	quantity: number;
}) {
	const cart = await getCartFromCookiesAction();
	if (!cart) {
		throw new Error("Cart not found");
	}
	await Commerce.cartSetQuantity({ productId, cartId, quantity });
}

export async function commerceGPTRevalidateAction() {
	const cart = await getCartCookieJson();
	if (cart) {
		revalidateTag(`cart-${cart.id}`);
	}
}

export async function saveShippingAddressAction({
	cartId,
	shippingAddress,
}: {
	cartId: string;
	shippingAddress: AddressSchema;
}): Promise<Cart | null> {
	if (!cartId) {
		throw new Error("No cart ID provided");
	}

	try {
		// Update the cart with the shipping address
		// You'd need to implement or modify this method in your Commerce library
		const cart = await Commerce.cartSaveShippingAddress({
			cartId,
			shippingAddress: {
				name: shippingAddress.name,
				email: shippingAddress.email,
				phone: shippingAddress.phone || undefined,
				city: shippingAddress.city,
				country: shippingAddress.country,
				line1: shippingAddress.line1,
				line2: shippingAddress.line2 || undefined,
				postalCode: shippingAddress.postalCode || undefined,
				state: shippingAddress.state || undefined,
			},
		});

		// Revalidate the cart data
		revalidateTag(`cart-${cartId}`);

		if (!cart) {
			throw new Error("Failed to save shipping address");
		}

		return cart;
	} catch (error) {
		console.error("Error saving shipping address:", error);
		throw new Error("Failed to save shipping address");
	}
}
