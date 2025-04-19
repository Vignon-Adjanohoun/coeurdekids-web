import { publicUrl } from "@/env.mjs";
import { getTranslations } from "@/i18n/server";
import instagramIcon from "@/images/social/social-instagram.svg";
import tiktokIcon from "@/images/social/social-tiktok.svg";
import StoreConfig from "@/store.config";
import { Separator } from "@/ui/separator";
import { YnsLink } from "@/ui/yns-link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

export const generateMetadata = async (): Promise<Metadata> => {
	const t = await getTranslations("/contact.metadata");
	return {
		title: t("title") || "Contact Us",
		description: t("description") || "Get in touch with Coeur de Kids. We'd love to hear from you!",
		alternates: { canonical: `${publicUrl}/contact` },
	};
};

export default async function ContactPage() {
	const t = await getTranslations("/contact.page");

	return (
		<main className="container mx-auto py-8 px-4 md:px-6 pb-16">
			<h1 className="text-4xl font-bold leading-none tracking-tight text-foreground py-5">
				{t("title") || "Contact Us"}
			</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
				{/* Left Column - Contact Information */}
				<div className="space-y-8">
					<div>
						<h2 className="text-2xl font-bold mb-4">{t("aboutTitle") || "About Coeur de Kids"}</h2>
						<p className="text-muted-foreground">
							{t("aboutDescription") ||
								"At Coeur de Kids, we combine luxury children's fashion with a commitment to healthy living. Our curated collection features high-quality, stylish clothing that lets children express themselves while ensuring comfort and durability. Founded with a passion for both fashion and wellbeing, we're more than just a clothing store - we're a lifestyle brand for modern families."}
						</p>
					</div>

					<div>
						<h2 className="text-2xl font-bold mb-4">{t("contactInfoTitle") || "How To Reach Us"}</h2>
						<ul className="space-y-4">
							<li className="flex items-start">
								<MapPin className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-neutral-500" />
								<span>{StoreConfig.contact.address}</span>
							</li>
							<li className="flex items-center">
								<Phone className="h-5 w-5 mr-3 flex-shrink-0 text-neutral-500" />
								<YnsLink href={`tel:${StoreConfig.contact.phone}`} className="hover:underline">
									{StoreConfig.contact.phone}
								</YnsLink>
							</li>
							<li className="flex items-center">
								<Mail className="h-5 w-5 mr-3 flex-shrink-0 text-neutral-500" />
								<YnsLink href={`mailto:${StoreConfig.contact.email}`} className="hover:underline">
									{StoreConfig.contact.email}
								</YnsLink>
							</li>
							<li className="flex items-center">
								<MessageCircle className="h-5 w-5 mr-3 flex-shrink-0 text-neutral-500" />
								<YnsLink
									href={`https://wa.me/${StoreConfig.contact.phone.replace(/\s+/g, "")}`}
									className="hover:underline"
									target="_blank"
								>
									WhatsApp Us
								</YnsLink>
							</li>
						</ul>
					</div>

					<div>
						<h2 className="text-2xl font-bold mb-4">{t("socialTitle") || "Follow Us"}</h2>
						<div className="flex gap-6">
							<YnsLink
								href={StoreConfig.social.instagram}
								target="_blank"
								className="flex items-center hover:text-neutral-700 transition-colors"
							>
								<Image src={instagramIcon} alt="Instagram" className="h-8 w-8 mr-2" />
								<span>Instagram</span>
							</YnsLink>
							<YnsLink
								href={StoreConfig.social.tiktok}
								target="_blank"
								className="flex items-center hover:text-neutral-700 transition-colors"
							>
								<Image src={tiktokIcon} alt="TikTok" className="h-8 w-8 mr-2" />
								<span>TikTok</span>
							</YnsLink>
						</div>
					</div>
				</div>

				{/* Right Column - Google Map */}
				<div className="space-y-6">
					<div className="h-[400px] w-full rounded-lg overflow-hidden border shadow-sm">
						<iframe
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.1018907442076!2d-0.1032805911559449!3d5.698416832180859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf83a94b0f0fbd%3A0xf0cf27c78e8e855d!2sCoeur%20de%20Kids!5e0!3m2!1sen!2sgh!4v1745105661867!5m2!1sen!2sgh"
							width="100%"
							height="100%"
							style={{ border: 0 }}
							allowFullScreen={true}
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
							title="Coeur de Kids Location"
							aria-label="Coeur de Kids store location on Google Maps"
						></iframe>
					</div>
					<div className="bg-neutral-50 p-4 rounded-lg border">
						<h3 className="font-medium mb-2">{t("storeHours") || "Store Hours"}</h3>
						<ul className="space-y-1 text-sm">
							<li className="flex justify-between">
								<span>Monday - Friday</span>
								<span>9:00 AM - 8:00 PM</span>
							</li>
							<li className="flex justify-between">
								<span>Saturday</span>
								<span>9:00 AM - 8:00 PM</span>
							</li>
							<li className="flex justify-between">
								<span>Sunday</span>
								<span>Closed</span>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* <Separator className="my-12" />

			<div className="mt-8">
				<h2 className="text-2xl font-bold mb-8 text-center">{t("getInTouchTitle") || "Send Us a Message"}</h2>
				<form className="max-w-2xl mx-auto grid gap-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div className="space-y-2">
							<label htmlFor="name" className="text-sm font-medium">
								{t("nameLabel") || "Name"}
							</label>
							<input id="name" name="name" className="w-full p-3 border rounded-md" required />
						</div>
						<div className="space-y-2">
							<label htmlFor="email" className="text-sm font-medium">
								{t("emailLabel") || "Email"}
							</label>
							<input id="email" name="email" type="email" className="w-full p-3 border rounded-md" required />
						</div>
					</div>
					<div className="space-y-2">
						<label htmlFor="subject" className="text-sm font-medium">
							{t("subjectLabel") || "Subject"}
						</label>
						<input id="subject" name="subject" className="w-full p-3 border rounded-md" required />
					</div>
					<div className="space-y-2">
						<label htmlFor="message" className="text-sm font-medium">
							{t("messageLabel") || "Message"}
						</label>
						<textarea
							id="message"
							name="message"
							rows={5}
							className="w-full p-3 border rounded-md"
							required
						></textarea>
					</div>
					<button
						type="submit"
						className="justify-self-start px-6 py-3 rounded-full bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors"
					>
						{t("sendButton") || "Send Message"}
					</button>
				</form> */}
			{/* </div> */}
		</main>
	);
}
