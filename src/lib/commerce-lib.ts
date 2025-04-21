import { db } from "@/lib/firebase";
import PersistentCartStorage from "@/lib/persistent-cart-storage";
import type { Account, Cart, CartLine, Product } from "@/types/models";
import {
	type DocumentData,
	type QueryDocumentSnapshot,
	Timestamp,
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	startAt,
	updateDoc,
	where,
} from "firebase/firestore";

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
				street: "Bridge Ave, East legon hills",
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

// Function to convert Firestore document to Product type
const convertToProduct = (doc: QueryDocumentSnapshot<DocumentData>): Product => {
	const data = doc.data();
	return {
		id: doc.id,
		object: "product",
		active: data.active,
		created: data.created?.seconds || Math.floor(Date.now() / 1000),
		description: data.description,
		images: data.images
			? data.images.map((img: string) => process.env.NEXT_PUBLIC_BUCKET_PRODUCT_IMAGE + img)
			: [],
		livemode: data.livemode || false,
		name: data.name,
		updated: data.updated?.seconds || Math.floor(Date.now() / 1000),
		marketing_features: data.marketing_features || [],
		default_price: {
			id: `price_${doc.id}`,
			object: "price",
			unit_amount: data.price || 0,
			currency: "ghs", //GH¢
			product: doc.id,
			type: "one_time",
		},
		metadata: data.metadata || {},
	};
};

// Product browse function with Firebase integration
export const productBrowse = async (
	params: {
		first?: number;
		last?: number;
		offset?: number;
		filter?: {
			category?: string;
			search?: string;
			priceMin?: number;
			priceMax?: number;
			brand?: string;
		};
		sort?: {
			field: string;
			direction: "asc" | "desc";
		};
		cursor?: unknown[];
	} = {},
): Promise<Product[]> => {
	try {
		const {
			first = 10,
			offset = 0,
			filter = {},
			sort = { field: "created", direction: "desc" as const },
			cursor,
		} = params;

		const productsCollection = collection(db, "products");
		let q = query(productsCollection);

		// Apply filters
		if (filter.category) {
			q = query(q, where("metadata.category", "==", filter.category));
		}

		if (filter.brand) {
			q = query(q, where("metadata.brand", "==", filter.brand));
		}

		if (filter.priceMin !== undefined) {
			q = query(q, where("price", ">=", filter.priceMin));
		}

		if (filter.priceMax !== undefined) {
			q = query(q, where("price", "<=", filter.priceMax));
		}

		// Apply sorting
		q = query(q, orderBy(sort.field, sort.direction));

		// Apply pagination
		q = query(q, limit(first));

		if (cursor) {
			q = query(q, startAfter(cursor));
		} else if (offset > 0) {
			// For initial offset without cursor
			q = query(q, startAt(offset));
		}

		const querySnapshot = await getDocs(q);

		let products: Product[] = [];

		querySnapshot.forEach((doc) => {
			products.push(convertToProduct(doc));
		});

		// Apply search filter client-side if provided
		if (filter.search && filter.search.trim() !== "") {
			const searchTerm = filter.search.toLowerCase();
			products = products.filter(
				(product) =>
					product.name.toLowerCase().includes(searchTerm) ||
					product.description?.toLowerCase().includes(searchTerm) ||
					product.metadata.brand?.toLowerCase().includes(searchTerm),
			);
		}

		// Apply last parameter if provided
		if (params.last) {
			return products.slice(-params.last);
		}

		return products;
	} catch (error) {
		console.error("Error fetching products from Firebase:", error);
		return [];
	}
};

// Mock product list with proper typing
export const productList = async () => {
	const products = await productBrowse({ first: 10 });
	return {
		data: products,
	};
};

// Get product by ID from Firebase
export const productGetById = async (id: string) => {
	try {
		const docRef = doc(db, "products", id);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			return convertToProduct(docSnap);
		} else {
			return null;
		}
	} catch (error) {
		console.error("Error getting product by ID from Firebase:", error);
		return null;
	}
};

// Get product by slug from Firebase
export const productGet = async ({ slug }: { slug: string }): Promise<Product[]> => {
	try {
		const productsCollection = collection(db, "products");
		const q = query(productsCollection, where("metadata.slug", "==", slug));
		const querySnapshot = await getDocs(q);

		const products: Product[] = [];
		querySnapshot.forEach((doc) => {
			products.push(convertToProduct(doc));
		});

		return products;
	} catch (error) {
		console.error("Error getting product by slug from Firebase:", error);
		return [];
	}
};

// Get categories from Firebase
export const categoryBrowse = async (): Promise<string[]> => {
	try {
		const productsCollection = collection(db, "products");
		const querySnapshot = await getDocs(productsCollection);

		const categories = new Set<string>();

		querySnapshot.forEach((doc) => {
			const data = doc.data();
			if (data.metadata?.category) {
				categories.add(data.metadata.category);
			}

			// Also add from categories array if available
			if (data.metadata?.categories && Array.isArray(data.metadata.categories)) {
				data.metadata.categories.forEach((cat: string) => categories.add(cat));
			}
		});

		return Array.from(categories);
	} catch (error) {
		console.error("Error fetching categories from Firebase:", error);
		return ["baby", "girl", "boy", "shoes", "teen", "accessories", "tops", "bottoms", "dress"];
	}
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
			status: "processing",
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

// Calculate cart total with possible tax
export const calculateCartTotalPossiblyWithTax = (cart: Cart) => {
	if (!cart) return 0;

	if (cart.cart.metadata?.taxCalculationId) {
		return cart.cart.amount;
	}

	return (cart.shippingRate?.fixed_amount?.amount ?? 0) + calculateCartTotalNetWithoutShipping(cart);
};

// Calculate cart total without shipping
export const calculateCartTotalNetWithoutShipping = (cart: Cart) => {
	if (!cart) return 0;

	return cart.lines.reduce(
		(total, { product, quantity }) => total + (product.default_price?.unit_amount ?? 0) * quantity,
		0,
	);
};

// Calculate cart total with shipping
export const calculateCartTotalNet = (cart: Cart) => {
	if (!cart) return 0;

	let total = calculateCartTotalNetWithoutShipping(cart);

	if (cart.shippingRate?.fixed_amount?.amount) {
		total += cart.shippingRate.fixed_amount.amount;
	}

	return total;
};
