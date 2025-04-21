export interface Account {
	name: string;
	url: string;
	description: string;
	email: string;
	phone: string;
	address: {
		street: string;
		city: string;
		state: string;
		postalCode: string;
		country: string;
	};
	socialMedia: {
		facebook: string;
		instagram: string;
	};
}

export interface Product {
	id: string;
	object: string;
	active: boolean;
	created: number;
	updated: number;
	description: string | null;
	images: Array<string>;
	livemode: boolean;
	name: string;
	marketing_features: string[];
	default_price: {
		unit_amount: number;
		id: string;
		currency: string;
		product: string;
		type: string;
		object: string;
	};
	metadata: {
		slug: string;
		stock: number;
		category?: string;
		categories?: string[];
		order?: number;
		variant?: string;
		size?: string;
		size_description?: string;
		digitalAsset?: string;
		preview?: string;
		brand?: string;
	};
}

export interface User {
	id: string;
	name: string;
	email: string;
	phone: string;
	street?: string;
	city?: string;
	state?: string;
	postalCode?: string;
	country?: string;
}

export interface Cart {
	id: string;
	trackingNumber?: string;
	cart: {
		object: "cart";
		metadata: {
			taxCalculationId?: string | undefined;
			couponCode?: string | undefined;
			taxedAmount?: string | undefined;
			"billingAddress.city"?: string | undefined;
			"billingAddress.country"?: string | undefined;
			"billingAddress.line1"?: string | undefined;
			"billingAddress.line2"?: string | undefined;
			"billingAddress.name"?: string | undefined;
			"billingAddress.postalCode"?: string | undefined;
			"billingAddress.state"?: string | undefined;
			netAmount?: string | undefined;
		} & Record<string, string>;
		customer: User | null;
		payment_method: string | null;
		taxBreakdown: {
			taxPercentage: string;
			taxAmount: number;
			taxType: string;
		}[];
		amount: number;
		canceled_at: number | null;
		cancellation_reason: string | null;
		created_at: number;
		currency: string;
		description: string | null;
		invoice: string | null;
		statement_descriptor: string | null;
		statement_descriptor_suffix: string | null;
		status: CartStatus;
	};
	lines: CartLine[];
	shippingRate?: { fixed_amount?: { amount?: number } } | null;
	shippingAddress?: {
		name?: string;
		email?: string;
		phone?: string;
		city?: string;
		country?: string;
		line1?: string;
		line2?: string;
		postalCode?: string;
		state?: string;
	} | null;
}

export interface CartLine {
	product: Product;
	quantity: number;
}

export type CartStatus = "canceled" | "submitted" | "confirmed" | "processing" | "delivering" | "completed";
