import accessoriesImage from "@/images/highlights/accessories-cat.jpg";
// import BabyImage from "@/images/highlights/baby-cat.jpg";
import BoyImage from "@/images/highlights/boy-cat.jpg";
import GirlImage from "@/images/highlights/girl-cat.jpg";
// import teenImage from "@/images/highlights/teen-cat.jpg";
import ShoesImage from "@/images/highlights/shoes-cat.jpg";

export const config = {
	categories: [
		{ name: "GIRL", slug: "girl", image: GirlImage },
		{ name: "BOY", slug: "boy", image: BoyImage },
		// { name: "BABY", slug: "baby", image: BabyImage },
		// { name: "TEEN", slug: "teen", image: teenImage },
		{ name: "SHOES", slug: "shoes", image: ShoesImage },
		{ name: "ACCESSORIES", slug: "accessories", image: accessoriesImage },
	],

	social: {
		instagram: "https://instagram.com/Coeur_de_Kids",
		tiktok: "https://tiktok.com/Coeur_de_Kids", // TODO: Add TikTok
	},

	contact: {
		email: "contact@coeurdekids.com",
		phone: "+233 55 487 8272",
		address: "Bridge Ave, East legon hills, Accra, Ghana",
	},
};

export type StoreConfig = typeof config;
export default config;
