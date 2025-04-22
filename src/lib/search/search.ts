import * as Commerce from "@/lib/commerce-lib";
import { unstable_cache } from "next/cache";
import { simpleSearch } from "./simplesearch";

export const searchProducts = unstable_cache(
	async (query: string) => {
		// If the query is simple (single word, no special chars), use Firebase's built-in filtering
		const isSimpleQuery = !query.includes(" ") && /^[a-zA-Z0-9]+$/.test(query);

		if (isSimpleQuery) {
			// Use the built-in search filter in productBrowse (more efficient for simple queries)
			return Commerce.productBrowse({
				first: 20,
				filter: { search: query },
				sort: { field: "name", direction: "asc" },
			});
		} else {
			// For complex queries, use the more sophisticated simpleSearch function
			const products = await Commerce.productBrowse({ first: 100 });
			const searchResults = simpleSearch(products, query);
			return searchResults.map((sr) => products.find((p) => p.id === sr.id)).filter(Boolean);
		}
	},
	["search", "products"],
	{
		tags: ["search", "products"],
	},
);

// Add a new search function that combines both approaches for better results
export const enhancedSearchProducts = unstable_cache(
	async (query: string) => {
		// First try direct Firebase filtering
		const directResults = await Commerce.productBrowse({
			first: 50,
			filter: { search: query },
		});

		// If we get enough results, return them
		if (directResults.length >= 5) {
			return directResults;
		}

		// Otherwise, fall back to the more advanced search
		const products = await Commerce.productBrowse({ first: 100 });
		const searchResults = simpleSearch(products, query);
		const complexResults = searchResults.map((sr) => products.find((p) => p.id === sr.id)).filter(Boolean);

		// Return the combined unique results
		const allProductIds = new Set();
		const combinedResults = [...directResults];

		directResults.forEach((product) => allProductIds.add(product.id));

		// Add complex results that weren't in direct results
		complexResults.forEach((product) => {
			if (product && !allProductIds.has(product.id)) {
				combinedResults.push(product);
				allProductIds.add(product.id);
			}
		});

		return combinedResults;
	},
	["enhanced-search", "products"],
	{
		tags: ["search", "products"],
	},
);
