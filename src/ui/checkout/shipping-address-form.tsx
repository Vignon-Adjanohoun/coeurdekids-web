"use client";

import { clearCartCookieAction } from "@/actions/cart-actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/i18n/client";
import type { Cart } from "@/types/models";
import { type AddressSchema, getAddressSchema } from "@/ui/checkout/checkout-form-schema";
import { CountrySelect } from "@/ui/country-select";
import { InputWithErrors } from "@/ui/input-errors";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { useTransition } from "react";

interface ShippingAddressFormProps {
	cartId: string;
	locale: string;
	initialAddress?: {
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
	onAddressSubmit: ({
		cartId,
		shippingAddress,
	}: {
		cartId: string;
		shippingAddress: AddressSchema;
	}) => Promise<Cart | null>;
}

export function ShippingAddressForm({
	cartId,
	locale,
	initialAddress,
	onAddressSubmit,
}: ShippingAddressFormProps) {
	const t = useTranslations("/cart.page.stripePayment");
	const ft = useTranslations("/cart.page.formErrors");
	const router = useRouter();
	const [isTransitioning, startTransition] = useTransition();

	const addressSchema = getAddressSchema({
		cityRequired: ft("cityRequired"),
		countryRequired: ft("countryRequired"),
		line1Required: ft("line1Required"),
		nameRequired: ft("nameRequired"),
		postalCodeRequired: ft("postalCodeRequired"),
	});

	const [addressValues, setAddressValues] = useState<AddressSchema>({
		name: initialAddress?.name || "",
		email: initialAddress?.email || undefined,
		city: initialAddress?.city || "Accra",
		country: initialAddress?.country || "Ghana",
		line1: initialAddress?.line1 || "",
		line2: initialAddress?.line2 || "",
		postalCode: initialAddress?.postalCode || "",
		state: initialAddress?.state || "",
		phone: initialAddress?.phone || "",
		taxId: "",
	});

	const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<
		Partial<Record<keyof AddressSchema, string[] | null | undefined>>
	>({});
	const [isLoading, setIsLoading] = useState(false);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.currentTarget;
		setAddressValues((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const validatedAddress = addressSchema.safeParse(addressValues);

		if (!validatedAddress.success) {
			setFieldErrors(validatedAddress.error?.flatten().fieldErrors || {});
			setFormErrorMessage(t("fillRequiredFields"));
			return;
		}

		setFieldErrors({});
		setIsLoading(true);

		try {
			startTransition(async () => {
				const cart = await onAddressSubmit({ cartId, shippingAddress: validatedAddress.data });

				if (!cart) {
					throw new Error("Failed to submit address");
				}

				console.log(cart);
				await clearCartCookieAction();
				router.push("/order/success?tracking=" + cart.trackingNumber);
				const params = new URLSearchParams({
					tracking: cart.trackingNumber ?? "",
				});
				router.push("/order/success?" + params.toString());
				router.refresh();
			});
		} catch (error) {
			setFormErrorMessage(error instanceof Error ? error.message : t("unexpectedError"));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="grid gap-4">
			{/* <h2 className="text-xl font-bold">{t("shippingAddressTitle")}</h2> */}

			<InputWithErrors
				label={t("fullName")}
				name="name"
				value={addressValues.name || ""}
				className="w-full"
				errors={fieldErrors}
				onChange={handleInputChange}
				autoComplete="name"
			/>

			<InputWithErrors
				label={t("email")}
				name="email"
				type="email"
				value={addressValues.email || ""}
				className="w-full"
				errors={fieldErrors}
				onChange={handleInputChange}
				autoComplete="email"
			/>

			<InputWithErrors
				label={t("phone")}
				name="phone"
				type="tel"
				value={addressValues.phone || ""}
				className="w-full"
				errors={fieldErrors}
				onChange={handleInputChange}
				autoComplete="tel"
			/>

			<InputWithErrors
				label={t("address1")}
				name="line1"
				value={addressValues.line1 || ""}
				className="w-full"
				errors={fieldErrors}
				onChange={handleInputChange}
				autoComplete="address-line1"
			/>

			{/* <InputWithErrors
				label={t("address2")}
				name="line2"
				value={addressValues.line2 || ""}
				className="w-full"
				errors={fieldErrors}
				onChange={handleInputChange}
				autoComplete="address-line2"
			/> */}

			{/* <div className="grid gap-6 sm:grid-cols-2"> */}
			{/* <InputWithErrors
					label={t("postalCode")}
					name="postalCode"
					value={addressValues.postalCode || ""}
					className="w-full"
					errors={fieldErrors}
					onChange={handleInputChange}
					autoComplete="postal-code"
				/> */}

			<InputWithErrors
				label={t("city")}
				name="city"
				value={addressValues.city || ""}
				className="w-full"
				errors={fieldErrors}
				onChange={handleInputChange}
				autoComplete="address-level2"
			/>
			{/* </div> */}
			{/* 
			<div className="grid gap-6 sm:grid-cols-2">
				<InputWithErrors
					label={t("state")}
					name="state"
					value={addressValues.state || ""}
					className="w-full"
					errors={fieldErrors}
					onChange={handleInputChange}
					autoComplete="address-level1"
				/> */}

			<CountrySelect
				label={t("country")}
				name="country"
				value={addressValues.country || ""}
				errors={fieldErrors}
				onChangeValue={(value) => setAddressValues((prev) => ({ ...prev, country: value }))}
				autoComplete="country"
			/>
			{/* </div> */}

			{formErrorMessage && (
				<Alert variant="destructive" className="mt-2" aria-live="polite" aria-atomic>
					<AlertCircle className="-mt-1 h-4 w-4" />
					<AlertTitle>{t("errorTitle")}</AlertTitle>
					<AlertDescription>{formErrorMessage}</AlertDescription>
				</Alert>
			)}

			<Button
				type="submit"
				className="w-full rounded-full text-lg cursor-pointer mt-3"
				size="lg"
				disabled={isLoading || isTransitioning}
			>
				{isLoading || isTransitioning ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					</>
				) : (
					t("submitOrder")
				)}
			</Button>
		</form>
	);
}
