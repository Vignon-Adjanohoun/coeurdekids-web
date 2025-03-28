import type { Cart } from "@/types/models";

// Setup persistent cart storage with expiration (temporary solution)
export default class PersistentCartStorage {
	private carts = new Map<string, Cart>();
	private expirations = new Map<string, number>();
	private readonly EXPIRATION_DAYS = 30; // 1 month expiration
	private static instance: PersistentCartStorage;
	private isClient: boolean;

	constructor() {
		this.isClient = typeof window !== "undefined";

		// Try to load from localStorage only on client-side
		if (this.isClient) {
			this.loadFromClientStorage();
		}
	}

	// Singleton pattern to ensure we use the same instance
	public static getInstance(): PersistentCartStorage {
		if (!PersistentCartStorage.instance) {
			PersistentCartStorage.instance = new PersistentCartStorage();
		}
		return PersistentCartStorage.instance;
	}

	private loadFromClientStorage() {
		try {
			// Load cart data
			const storedCarts = localStorage.getItem("coeurdekids-carts");
			if (storedCarts) {
				const parsedCarts = JSON.parse(storedCarts) as Record<string, Cart>;
				Object.entries(parsedCarts).forEach(([cartId, cartData]) => {
					this.carts.set(cartId, cartData);
				});
			}

			// Load expiration data
			const storedExpirations = localStorage.getItem("coeurdekids-cart-expirations");
			if (storedExpirations) {
				const parsedExpirations = JSON.parse(storedExpirations) as Record<string, number>;
				Object.entries(parsedExpirations).forEach(([cartId, expiration]) => {
					this.expirations.set(cartId, expiration);
				});
			}

			this.cleanExpiredCarts();
		} catch (error) {
			console.error("Failed to load carts from localStorage:", error);
		}
	}

	// This method will be replaced with Firestore implementation later
	private async persistData() {
		// For client-side, still use localStorage temporarily
		if (this.isClient) {
			try {
				// Save cart data
				const cartsObject = Object.fromEntries(this.carts.entries());
				localStorage.setItem("coeurdekids-carts", JSON.stringify(cartsObject));

				// Save expiration data
				const expirationsObject = Object.fromEntries(this.expirations.entries());
				localStorage.setItem("coeurdekids-cart-expirations", JSON.stringify(expirationsObject));
			} catch (error) {
				console.error("Failed to save carts to storage:", error);
			}
		}

		// TODO: Replace with Firestore implementation
		// This is where you would add code to save to Firestore
		// Example structure for future implementation:
		//
		// await db.collection('carts').doc(cartId).set({
		//   cart: cart,
		//   expiration: expirationTime
		// });
	}

	private cleanExpiredCarts() {
		const now = Date.now();
		let hasExpired = false;

		// Check for expired carts
		this.expirations.forEach((expirationTime, cartId) => {
			if (now > expirationTime) {
				this.carts.delete(cartId);
				this.expirations.delete(cartId);
				hasExpired = true;
			}
		});

		// Save if we removed any expired carts
		if (hasExpired) {
			this.persistData();
		}
	}

	get(cartId: string): Cart | undefined {
		this.cleanExpiredCarts();
		return this.carts.get(cartId);
	}

	set(cartId: string, cart: Cart): void {
		// Set or refresh the expiration date (30 days from now)
		const expirationTime = Date.now() + this.EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
		this.expirations.set(cartId, expirationTime);

		// Store the cart
		this.carts.set(cartId, cart);

		// Persist changes
		this.persistData();
	}

	has(cartId: string): boolean {
		this.cleanExpiredCarts();
		return this.carts.has(cartId);
	}

	delete(cartId: string): boolean {
		const hasCart = this.carts.has(cartId);

		if (hasCart) {
			this.carts.delete(cartId);
			this.expirations.delete(cartId);
			this.persistData();
		}

		return hasCart;
	}

	getAllCarts(): Cart[] {
		this.cleanExpiredCarts();
		return Array.from(this.carts.values());
	}

	// Future method for Firestore implementation
	async syncWithDatabase() {
		// TODO: Implement this method to sync with Firestore
		// This would load carts from Firestore into the in-memory Map
		//
		// const cartDocs = await db.collection('carts').get();
		// cartDocs.forEach(doc => {
		//   const data = doc.data();
		//   if (data.expiration > Date.now()) {
		//     this.carts.set(doc.id, data.cart);
		//     this.expirations.set(doc.id, data.expiration);
		//   } else {
		//     // Clean up expired carts from Firestore
		//     doc.ref.delete();
		//   }
		// });
	}
}
