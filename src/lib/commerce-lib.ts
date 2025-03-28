import PersistentCartStorage from "@/lib/persistent-cart-storage";
import type { Account, Cart, CartLine, Product } from "@/types/models";
import type Stripe from "stripe";

// Create the persistent cart storage instance
const mockCarts = PersistentCartStorage.getInstance();

// Mock account data
export const accountGet = async (): Promise<{
	account: Account | null;
}> => {
	return {
		account: {
			name: "Coeur de Kids",
			url: "https://coeurdekids.com",
			description: "Children's clothing and accessories",
			email: "contact@coeurdekids.com",
			phone: "+233554878272",
			address: {
				street: "Adjeikojo Santeo Rd, East legon hills",
				city: "Accra",
				state: "Greater Accra",
				postalCode: "",
				country: "Ghana",
			},
			socialMedia: {
				facebook: "https://facebook.com/coeurdekids",
				instagram: "https://instagram.com/Coeur_de_Kids",
			},
		},
	};
};

// Product browse function with proper typing
export const productBrowse = async (
	params: {
		first?: number;
		last?: number;
		offset?: number;
		filter?: {
			category?: string;
		};
	} = {},
): Promise<Product[]> => {
	const { first = 10, last, offset = 0, filter = {} } = params;

	const allProducts = [
		{
			id: "prod-1",
			object: "product",
			group: "group-1",
			color: "white",
			active: true,
			created: 1709937600,
			name: "Kid's T-Shirt",
			description: "Comfortable cotton t-shirt for kids",
			images: [
				"https://image.hm.com/assets/hm/19/ef/19ef2c4d9365179b2f09b6a20acfb0b42c807055.jpg?imwidth=820",
				"https://image.hm.com/assets/hm/c6/1c/c61c28482cfa5d4389205ee0a0d1115e9de67d8e.jpg?imwidth=820",
			],
			livemode: false,
			metadata: {
				slug: "kids-tshirt",
				stock: 25,
				category: "baby",
				order: 1,
				brand: "H&M",
				variant: "white",
				size: "5M - 10M",
			},
			package_dimensions: null,
			shippable: true,
			statement_descriptor: null,
			tax_code: null,
			type: "good",
			unit_label: null,
			updated: 1709937600,
			url: null,
			default_price: {
				id: "price_1234",
				object: "price",
				unit_amount: 1999,
				currency: "ghs",
				product: "prod-1",
				type: "one_time",
			},
			marketing_features: ["New", "Bestseller"],
		},
		{
			id: "prod-2",
			object: "product",
			group: "group-1",
			color: "red",
			active: true,
			created: 1709937600,
			name: "Kid's Jeans",
			description: "Durable jeans for active kids",
			images: [
				"https://image.hm.com/assets/hm/1f/68/1f6887ba683faed4237de1212e87a056bd105468.jpg?imwidth=820",
			],
			livemode: false,
			metadata: {
				slug: "kids-tshirt",
				stock: 15,
				category: "baby",
				order: 2,
				brand: "NEXT",
				variant: "red",
				size: "10M",
			},
			package_dimensions: null,
			shippable: true,
			statement_descriptor: null,
			tax_code: null,
			type: "good",
			unit_label: null,
			updated: 1709937600,
			url: null,
			default_price: {
				id: "price_2345",
				object: "price",
				unit_amount: 2999,
				currency: "ghs",
				product: "prod-2",
				type: "one_time",
			},
			marketing_features: [],
		},
		{
			id: "prod-3",
			object: "product",
			group: "group-2",
			active: true,
			created: 1709937600,
			name: "Kid's Sneakers",
			description: "Comfortable and stylish sneakers",
			images: [
				"https://image.hm.com/assets/hm/c4/40/c440911d28f2ef6be761639fcd50fb687b008eba.jpg?imwidth=820",
			],
			livemode: false,
			metadata: {
				slug: "kids-tshirt",
				stock: 10,
				category: "baby",
				order: 3,
				variant: "blue",
				size: "5M",
			},
			package_dimensions: null,
			shippable: true,
			statement_descriptor: null,
			tax_code: null,
			type: "good",
			unit_label: null,
			updated: 1709937600,
			url: null,
			default_price: {
				id: "price_3456",
				object: "price",
				unit_amount: 3499,
				currency: "ghs",
				product: "prod-3",
				type: "one_time",
			},
			marketing_features: ["New"],
		},
		{
			id: "prod-4",
			object: "product",
			active: true,
			created: 1709937600,
			name: "Kid's Jacket",
			description: "Warm jacket for cold weather",
			images: [
				"https://image.hm.com/assets/hm/19/ef/19ef2c4d9365179b2f09b6a20acfb0b42c807055.jpg?imwidth=820",
			],
			livemode: false,
			metadata: {
				slug: "kids-tshirt",
				stock: 8,
				category: "baby",
				order: 4,
				brand: "Carter's",
				variant: "blue",
				size: "8M",
			},
			package_dimensions: null,
			shippable: true,
			statement_descriptor: null,
			tax_code: null,
			type: "good",
			unit_label: null,
			updated: 1709937600,
			url: null,
			default_price: {
				id: "price_4567",
				object: "price",
				unit_amount: 4999,
				currency: "ghs",
				product: "prod-4",
				type: "one_time",
			},
			marketing_features: ["Seasonal"],
		},
		{
			id: "prod-5",
			object: "product",
			active: true,
			created: 1709937600,
			name: "Kid's Hat",
			description: "Cute hat to protect from sun",
			images: [
				"https://image.hm.com/assets/hm/19/ef/19ef2c4d9365179b2f09b6a20acfb0b42c807055.jpg?imwidth=820",
			],
			livemode: false,
			metadata: {
				slug: "kids-hat",
				stock: 20,
				category: "baby",
				order: 5,
			},
			package_dimensions: null,
			shippable: true,
			statement_descriptor: null,
			tax_code: null,
			type: "good",
			unit_label: null,
			updated: 1709937600,
			url: null,
			default_price: {
				id: "price_5678",
				object: "price",
				unit_amount: 1499,
				currency: "ghs",
				product: "prod-5",
				type: "one_time",
			},
			marketing_features: [],
		},
		{
			id: "prod-6",
			object: "product",
			active: true,
			created: 1709937600,
			name: "Kid's Backpack",
			description: "Colorful backpack for school",
			images: [
				"https://image.hm.com/assets/hm/19/ef/19ef2c4d9365179b2f09b6a20acfb0b42c807055.jpg?imwidth=820",
			],
			livemode: false,
			metadata: {
				slug: "kids-backpack",
				stock: 12,
				category: "accessories",
				order: 6,
			},
			package_dimensions: null,
			shippable: true,
			statement_descriptor: null,
			tax_code: null,
			type: "good",
			unit_label: null,
			updated: 1709937600,
			url: null,
			default_price: {
				id: "price_6789",
				object: "price",
				unit_amount: 2499,
				currency: "ghs",
				product: "prod-6",
				type: "one_time",
			},
			marketing_features: ["Bestseller"],
		},
		{
			id: "prod-7",
			object: "product",
			active: true,
			created: 1709937600,
			name: "Kid's Socks",
			description: "Pack of 5 colorful socks",
			images: [
				"https://image.hm.com/assets/hm/19/ef/19ef2c4d9365179b2f09b6a20acfb0b42c807055.jpg?imwidth=820",
			],
			livemode: false,
			metadata: {
				slug: "kids-socks",
				stock: 30,
				category: "accessories",
				order: 7,
			},
			package_dimensions: null,
			shippable: true,
			statement_descriptor: null,
			tax_code: null,
			type: "good",
			unit_label: null,
			updated: 1709937600,
			url: null,
			default_price: {
				id: "price_7890",
				object: "price",
				unit_amount: 999,
				currency: "ghs",
				product: "prod-7",
				type: "one_time",
			},
			marketing_features: ["Bestseller"],
		},
	];

	// Apply category filter if provided
	let filteredProducts = allProducts;
	if (filter.category) {
		filteredProducts = allProducts.filter((product) => product.metadata.category === filter.category);
	}

	// Apply pagination
	if (last) {
		return filteredProducts.slice(-last);
	} else {
		return filteredProducts.slice(offset, offset + first);
	}
};

// Mock product list with proper typing
export const productList = async () => {
	const products = await productBrowse({ first: 10 });
	return {
		data: products,
	};
};

// Mock product by ID
export const productGetById = async (id: string) => {
	const allProducts = await productBrowse({ first: 100 });
	return allProducts.find((product) => product.id === id) || null;
};

// Mock product by slug
export const productGet = async ({ slug }: { slug: string }): Promise<Product[]> => {
	const allProducts = await productBrowse({ first: 100 });
	return allProducts.filter((product) => product.metadata.slug === slug);
};

// Mock cart creation
export const cartCreate = async ({
	productId,
}: { productId?: string; cartId?: string } = {}): Promise<Cart> => {
	const cartId = `cart_${Math.random().toString(36).substring(2, 15)}`;
	const cart: Cart = {
		id: cartId,
		cart: {
			object: "cart",
			amount: 0,
			currency: "ghs",
			status: "requires_payment_method",
			created_at: Date.now() / 1000,
			metadata: {},
			payment_method: null,
			customer: null,
			canceled_at: null,
			cancellation_reason: null,
			description: null,
			invoice: null,
			statement_descriptor: null,
			statement_descriptor_suffix: null,
			taxBreakdown: [],
		},
		lines: [],
	};

	await cartSet(cartId, cart);

	if (productId) {
		await cartAdd({ productId, cartId });
	}

	return cart;
};

// Mock cart get
export const cartGet = async (cartId: string): Promise<Cart | null> => {
	return mockCarts.get(cartId) || null;
};

// Mock cart get
export const cartGetByTracking = async (trackingNumber: string): Promise<Cart | null> => {
	// Get all carts from the storage
	const allCarts = mockCarts.getAllCarts();

	// Find the cart that matches the tracking number
	const foundCart = allCarts.find((cart) => cart.trackingNumber === trackingNumber);

	return foundCart || null;
};

// Mock cart set
export const cartSet = async (cartId: string, cart: Cart): Promise<boolean> => {
	mockCarts.set(cartId, cart);
	return true;
};

// Mock cart add
export const cartAdd = async ({
	productId,
	cartId,
}: {
	productId: string;
	cartId?: string;
}): Promise<Cart | null> => {
	let cart = cartId ? await cartGet(cartId) : null;

	if (!cart) {
		const newCart = await cartCreate();
		cart = await cartGet(newCart.id);
		cartId = newCart.id;
	}

	if (!cart || !cartId) return null;

	const product = await productGetById(productId);

	if (product) {
		// Check if product already exists in cart
		const existingLine = cart.lines.find((line: CartLine) => line.product.id === productId);

		if (existingLine) {
			existingLine.quantity += 1;
		} else {
			cart.lines.push({
				product,
				quantity: 1,
			});
		}

		// Update cart total
		cart.cart.amount = calculateCartTotalPossiblyWithTax(cart);

		await cartSet(cartId, cart);
	}

	return cart;
};

// Mock cart add optimistic
// export const cartAddOptimistic = async ({ cart, add }: {
// 	cart?: Cart | null;
// 	add: string | undefined;
// }): Promise<Cart | null | undefined> => {
// 	if (!add || !cart) return cart;

// 	const productId = add;
// 	const product = await productGetById(productId);

// 	if (!product) return cart;

// 	// Create a copy of the cart to avoid mutating the original
// 	const newCart = JSON.parse(JSON.stringify(cart)) as Cart;

// 	// Check if product already exists in cart
// 	const existingLineIndex = newCart.lines.findIndex((line) => line.product.id === productId);

// 	if (existingLineIndex !== -1 && newCart.lines[existingLineIndex]) {
// 		newCart.lines[existingLineIndex].quantity += 1;
// 	} else {
// 		newCart.lines.push({
// 			product,
// 			quantity: 1,
// 		});
// 	}

// 	// Update cart total
// 	newCart.cart.amount = calculateCartTotalPossiblyWithTax(newCart);

// 	return newCart;
// };

// Mock cart change quantity
export const cartChangeQuantity = async ({
	productId,
	cartId,
	operation,
	clearTaxCalculation,
}: {
	productId: string;
	cartId: string;
	operation: "INCREASE" | "DECREASE";
	clearTaxCalculation?: boolean;
}): Promise<Cart | null> => {
	const cart = await cartGet(cartId);

	if (!cart) return null;

	const lineIndex = cart.lines.findIndex((line: CartLine) => line.product.id === productId);

	if (lineIndex === -1) return null;

	if (operation === "INCREASE" && cart.lines[lineIndex]) {
		cart.lines[lineIndex].quantity += 1;
	} else if (operation === "DECREASE" && cart.lines[lineIndex]) {
		cart.lines[lineIndex].quantity -= 1;

		// Remove line if quantity is 0
		if (cart.lines[lineIndex].quantity <= 0) {
			cart.lines.splice(lineIndex, 1);
		}
	}

	// Update cart total
	cart.cart.amount = calculateCartTotalPossiblyWithTax(cart);

	// Clear tax calculation if needed
	if (clearTaxCalculation && cart.cart.metadata) {
		delete cart.cart.metadata.taxCalculationId;
		delete cart.cart.metadata.taxCalculationExp;
	}

	await cartSet(cartId, cart);

	return cart;
};

// Mock cart set quantity
export const cartSetQuantity = async ({
	cartId,
	productId,
	quantity,
}: {
	cartId: string;
	productId: string;
	quantity: number;
}): Promise<Cart | null> => {
	const cart = await cartGet(cartId);

	if (!cart) return null;

	const lineIndex = cart.lines.findIndex((line: CartLine) => line.product.id === productId);

	if (lineIndex === -1) return null;

	if (quantity <= 0) {
		// Remove line if quantity is 0
		cart.lines.splice(lineIndex, 1);
	} else if (cart.lines[lineIndex]) {
		cart.lines[lineIndex].quantity = quantity;
	}

	// Update cart total
	cart.cart.amount = calculateCartTotalPossiblyWithTax(cart);

	await cartSet(cartId, cart);

	return cart;
};

export const cartCount = (cart: Cart): number => {
	if (!cart || !cart.lines || !Array.isArray(cart.lines)) {
		return 0;
	}

	return cart.lines.reduce((total, line) => {
		return total + (line.quantity || 0);
	}, 0);
};

export const cartSaveShippingAddress = async ({
	cartId,
	shippingAddress,
}: {
	cartId: string;
	shippingAddress: {
		name: string;
		email: string;
		phone?: string;
		city: string;
		country: string;
		line1: string;
		line2?: string;
		postalCode?: string;
		state?: string;
	};
}): Promise<Cart | null> => {
	// Using null instead of undefined
	const cart = await cartGet(cartId);

	if (!cart) return null; // Consistent return type

	// Update the cart with shipping address
	cart.shippingAddress = {
		name: shippingAddress.name,
		email: shippingAddress.email,
		phone: shippingAddress.phone,
		city: shippingAddress.city,
		country: shippingAddress.country,
		line1: shippingAddress.line1,
		line2: shippingAddress.line2,
		postalCode: shippingAddress.postalCode,
		state: shippingAddress.state,
	};

	cart.cart.status = "submitted";
	const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
	cart.trackingNumber = randomNumber.toString();

	await cartSet(cartId, cart);
	return cart;
};

// Mock shipping rates
export const shippingBrowse = async (): Promise<Stripe.ShippingRate[]> => {
	return [
		{
			id: "shr_standard",
			object: "shipping_rate",
			active: true,
			created: Date.now() / 1000,
			display_name: "Standard Shipping",
			fixed_amount: {
				amount: 500,
				currency: "ghs",
			},
			livemode: false,
			metadata: {},
			tax_behavior: "exclusive",
			tax_code: null,
			type: "fixed_amount",
			delivery_estimate: {
				minimum: {
					unit: "business_day",
					value: 3,
				},
				maximum: {
					unit: "business_day",
					value: 5,
				},
			},
		},
		{
			id: "shr_express",
			object: "shipping_rate",
			active: true,
			created: Date.now() / 1000,
			display_name: "Express Shipping",
			fixed_amount: {
				amount: 1000,
				currency: "ghs",
			},
			livemode: false,
			metadata: {},
			tax_behavior: "exclusive",
			tax_code: null,
			type: "fixed_amount",
			delivery_estimate: {
				minimum: {
					unit: "business_day",
					value: 1,
				},
				maximum: {
					unit: "business_day",
					value: 2,
				},
			},
		},
	] as Stripe.ShippingRate[];
};

// Mock shipping rate by ID
export const shippingGet = async (id: string): Promise<Stripe.ShippingRate | null> => {
	const rates = await shippingBrowse();
	return rates.find((rate) => rate.id === id) || null;
};

// Mock category list
export const categoryBrowse = async (): Promise<string[]> => {
	return ["tops", "bottoms", "footwear", "outerwear", "accessories"];
};

// Mock order data
export const orderGet = async (orderId: string) => {
	// Check if this is a cart that's been "completed"
	if (mockCarts.has(orderId)) {
		const cart = mockCarts.get(orderId);
		return {
			order: {
				...cart.cart,
				status: "succeeded",
				payment_method: {
					id: "pm_123456",
					object: "payment_method",
					type: "card",
					card: {
						brand: "visa",
						display_brand: "Visa",
						exp_month: 12,
						exp_year: 2025,
						last4: "4242",
					},
					billing_details: {
						address: {
							city: "Paris",
							country: "FR",
							line1: "123 Main St",
							line2: null,
							postal_code: "75000",
							state: null,
						},
						email: "customer@example.com",
						name: "Customer Name",
						phone: "+3312345678",
					},
				},
				latest_charge: {
					id: "ch_123456",
					object: "charge",
					amount: cart.cart.amount,
					created: Date.now() / 1000,
					currency: "ghs",
					status: "succeeded",
				},
				taxBreakdown: [],
				receipt_email: "customer@example.com",
			},
			lines: cart.lines,
			shippingRate: cart.shippingRate,
		};
	}

	// Mock a standard order if not found in carts
	return {
		order: {
			id: orderId,
			object: "payment_intent",
			status: "succeeded",
			amount: 5998,
			amount_capturable: 0,
			amount_received: 5998,
			currency: "ghs",
			created: Date.now() / 1000 - 86400, // 1 day ago
			client_secret: null,
			metadata: {
				shippingRateId: "shr_standard",
				taxId: "123456789",
			},
			payment_method: {
				id: "pm_123456",
				object: "payment_method",
				type: "card",
				card: {
					brand: "visa",
					display_brand: "Visa",
					exp_month: 12,
					exp_year: 2025,
					last4: "4242",
				},
				billing_details: {
					address: {
						city: "Paris",
						country: "FR",
						line1: "123 Main St",
						line2: null,
						postal_code: "75000",
						state: null,
					},
					email: "customer@example.com",
					name: "Customer Name",
					phone: "+3312345678",
				},
			},
			latest_charge: {
				id: "ch_123456",
				object: "charge",
				amount: 5998,
				created: Date.now() / 1000 - 86400,
				currency: "ghs",
				status: "succeeded",
			},
			receipt_email: "customer@example.com",
			shipping: {
				name: "Customer Name",
				address: {
					city: "Paris",
					country: "FR",
					line1: "123 Main St",
					line2: null,
					postal_code: "75000",
					state: null,
				},
				phone: "+3312345678",
			},
			taxBreakdown: [],
			livemode: false,
			capture_method: "automatic",
			confirmation_method: "automatic",
			application: null,
			application_fee_amount: null,
			automatic_payment_methods: null,
			canceled_at: null,
			cancellation_reason: null,
			description: null,
			invoice: null,
			last_payment_error: null,
			next_action: null,
			on_behalf_of: null,
			payment_method_configuration_details: null,
			payment_method_options: null,
			payment_method_types: ["card"],
			processing: null,
			review: null,
			setup_future_usage: null,
			source: null,
			statement_descriptor: null,
			statement_descriptor_suffix: null,
			transfer_data: null,
			transfer_group: null,
			customer: null,
		},
		lines: [
			{
				product: (await productGetById("prod-1"))!,
				quantity: 2,
			},
			{
				product: (await productGetById("prod-2"))!,
				quantity: 1,
			},
		],
		shippingRate: await shippingGet("shr_standard"),
	};
};

// Helper function to get products from cart metadata
export const getProductsFromCart = (metadata) => {
	const result = [];

	if (!metadata) return result;

	for (const [key, value] of Object.entries(metadata)) {
		if (key.startsWith("product_") && key.endsWith("_quantity")) {
			const productId = key.replace("product_", "").replace("_quantity", "");
			const quantity = parseInt(value, 10);

			if (!isNaN(quantity) && quantity > 0) {
				result.push([productId, quantity]);
			}
		}
	}

	return result;
};

// Helper function to get products from metadata
export const getProductsFromMetadata = async (metadata) => {
	const productQuantities = getProductsFromCart(metadata);
	const result = [];

	for (const [productId, quantity] of productQuantities) {
		const product = await productGetById(productId);
		result.push({ product, quantity });
	}

	return result;
};

// Helper function to get cart with products by ID
export const getCartWithProductsById = async (cartId) => {
	return await cartGet(cartId);
};

// Calculate cart total with possible tax
export const calculateCartTotalPossiblyWithTax = (cart) => {
	if (!cart) return 0;

	if (cart.cart.metadata?.taxCalculationId) {
		return cart.cart.amount;
	}

	return (cart.shippingRate?.fixed_amount?.amount ?? 0) + calculateCartTotalNetWithoutShipping(cart);
};

// Calculate cart total without shipping
export const calculateCartTotalNetWithoutShipping = (cart) => {
	if (!cart) return 0;

	return cart.lines.reduce(
		(total, { product, quantity }) => total + (product.default_price?.unit_amount ?? 0) * quantity,
		0,
	);
};

// Calculate cart total with shipping
export const calculateCartTotalNet = (cart) => {
	if (!cart) return 0;

	let total = calculateCartTotalNetWithoutShipping(cart);

	if (cart.shippingRate?.fixed_amount?.amount) {
		total += cart.shippingRate.fixed_amount.amount;
	}

	return total;
};

// Address schema creation
export const getAddressSchema = (tr) => {
	// Since we're mocking, we'll return a simple validator function
	return {
		safeParse: (data) => {
			const required = ["name", "city", "country", "line1", "postalCode"];
			const missing = required.filter((field) => !data[field]);

			if (missing.length > 0) {
				return {
					success: false,
					error: {
						flatten: () => ({
							fieldErrors: missing.reduce((acc, field) => {
								acc[field] = [tr[`${field}Required`]];
								return acc;
							}, {}),
						}),
					},
				};
			}

			return {
				success: true,
				data,
			};
		},
	};
};

// Update payment intent
export const updatePaymentIntent = async ({
	paymentIntentId,
	data,
	customerOverride,
	clearTaxCalculation,
}) => {
	const cart = mockCarts.get(paymentIntentId);

	if (!cart) throw new Error("Payment intent not found");

	// Update the cart with new data
	cart.cart = {
		...cart.cart,
		...data,
	};

	if (customerOverride) {
		cart.cart.customer = customerOverride;
	}

	// Clear tax calculation if needed
	if (clearTaxCalculation && cart.cart.metadata) {
		delete cart.cart.metadata.taxCalculationId;
		delete cart.cart.metadata.taxCalculationExp;
	}

	mockCarts.set(paymentIntentId, cart);

	return cart.cart;
};

// Cart save email
export const cartSaveEmail = async ({ cartId, email }) => {
	const cart = mockCarts.get(cartId);

	if (!cart) return undefined;

	cart.cart.receipt_email = email;

	mockCarts.set(cartId, cart);

	return cart.cart;
};

// Cart save tax ID
export const cartSaveTax = async ({ cartId, taxId }) => {
	const cart = mockCarts.get(cartId);

	if (!cart) return undefined;

	if (!cart.cart.metadata) cart.cart.metadata = {};
	cart.cart.metadata.taxId = taxId;

	mockCarts.set(cartId, cart);

	return cart.cart;
};

// Cart save shipping
export const cartSaveShipping = async ({ cartId, shippingRateId }) => {
	const cart = mockCarts.get(cartId);

	if (!cart) return undefined;

	const shippingRate = await shippingGet(shippingRateId);

	if (shippingRate) {
		cart.shippingRate = shippingRate;
		if (!cart.cart.metadata) cart.cart.metadata = {};
		cart.cart.metadata.shippingRateId = shippingRateId;

		// Update cart total
		cart.cart.amount = calculateCartTotalPossiblyWithTax(cart);
	}

	mockCarts.set(cartId, cart);

	return cart.cart;
};
