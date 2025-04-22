import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

const seedProducts = async () => {
	try {
		const productsCollection = collection(db, "products");

		const products = [
			{
				id: "prod-1",
				active: true,
				livemode: true,
				created: new Date(1709937600 * 1000),
				updated: new Date(1709937600 * 1000),
				name: "Kid's T-Shirt",
				description: "Comfortable cotton t-shirt for kids",
				marketing_features: ["New", "Bestseller"],
				images: [
					"https://image.hm.com/assets/hm/19/ef/19ef2c4d9365179b2f09b6a20acfb0b42c807055.jpg?imwidth=820",
					"https://image.hm.com/assets/hm/c6/1c/c61c28482cfa5d4389205ee0a0d1115e9de67d8e.jpg?imwidth=820",
				],
				price: 200,
				currency: "ghs",
				metadata: {
					slug: "kids-tshirt",
					stock: 25,
					category: "baby",
					categories: ["baby", "girl", "boy", "shoes", "teen", "accessories", "tops", "bottoms", "dress"],
					order: 1000,
					brand: "H&M",
					variant: "white",
					size: "5M - 10M",
				},
			},
			// Add more products here
		];

		// Use batch writes or Promise.all to upload all products
		await Promise.all(
			products.map((product) => {
				const docRef = doc(productsCollection, product.id);
				return setDoc(docRef, product);
			}),
		);

		console.log("Products seeded successfully!");
	} catch (error) {
		console.error("Error seeding products:", error);
	}
};

// Execute this function to seed your database
// This can be run as a separate script or imported and called when needed
export default seedProducts;
