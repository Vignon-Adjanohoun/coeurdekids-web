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
