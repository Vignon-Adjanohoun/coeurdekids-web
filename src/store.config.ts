import BabyImage from "@/images/highlights/baby-cat.jpg";
import BoyImage from "@/images/highlights/boy-cat.jpg";
import GirlImage from "@/images/highlights/girl-cat.jpg";
import teenImage from "@/images/highlights/teen-cat.jpg";

export const config = {
	categories: [
		{ name: "GIRL", slug: "girl", image: GirlImage },
		{ name: "BOY", slug: "boy", image: BoyImage },
		{ name: "BABY", slug: "baby", image: BabyImage },
		{ name: "TEEN", slug: "teen", image: teenImage },
	],

	social: {
		instagram: "https://instagram.com/Coeur_de_Kids",
		tiktok: "https://tiktok.com/Coeur_de_Kids", // TODO: Add TikTok
	},

	contact: {
		email: "contact@coeurdekids.com",
		phone: "+233 55 487 8272",
		address: "Adjeikojo Santeo Rd, East legon hills, Accra, Ghana",
	},
};

export type StoreConfig = typeof config;
export default config;
