import { getTranslations } from "@/i18n/server";
import instagramIcon from "@/images/social/social-instagram.svg";
import tiktokIcon from "@/images/social/social-tiktok.svg";
import StoreConfig from "@/store.config";
import { Newsletter } from "@/ui/footer/newsletter.client";
import { YnsLink } from "@/ui/yns-link";
import Image from "next/image";
import type { SVGAttributes } from "react";

const sections = [
	{
		header: "Products",
		links: StoreConfig.categories.map(({ name, slug }) => ({
			label: name,
			href: `/category/${slug}`,
		})),
	},
	{
		header: "Support",
		links: [
			{
				label: "Features",
				href: "https://yournextstore.com/#features",
			},
			{
				label: "Pricing",
				href: "https://yournextstore.com/#pricing",
			},
			{
				label: "Contact Us",
				href: "mailto:hi@yournextstore.com",
			},
		],
	},
];

const socialLinks = [
	{
		label: "Instagram",
		href: StoreConfig.social.instagram,
		icon: instagramIcon,
	},
	{
		label: "TikTok",
		href: StoreConfig.social.tiktok,
		icon: tiktokIcon,
	},
];

export async function Footer() {
	const t = await getTranslations("Global.footer");
	const currentYear = new Date().getFullYear();

	return (
		<footer className="w-full bg-neutral-50 p-6 text-neutral-800 md:py-12">
			{/* New Social Networks Section */}
			{/* <div className="container">
				<h3 className="mb-3 text-center font-semibold">Our Social Networks</h3>
				<div className="flex justify-center gap-6">
					{socialLinks.map((link) => (
						<YnsLink key={link.label} className="transition-transform hover:scale-110" href={link.href}>
							<Image src={link.icon} alt={link.label} className="h-6 w-6" />
							<span className="sr-only">{link.label}</span>
						</YnsLink>
					))}
				</div>
			</div> */}
			<div className="container flex flex-row flex-wrap justify-center gap-16 text-sm sm:justify-between">
				{/* <div className="">
					<div className="flex w-full max-w-sm flex-col gap-2">
						<h3 className="font-semibold">{t("newsletterTitle")}</h3>
						<Newsletter />
					</div>
				</div> */}
				{/* New Social Networks Section */}
				<div className="grid grid-cols-1">
					<div>
						<h3 className="mb-3 text-center font-semibold">Our Social Networks</h3>
						<div className="flex justify-center gap-6">
							{socialLinks.map((link) => (
								<YnsLink key={link.label} className="transition-transform hover:scale-110" href={link.href}>
									<Image src={link.icon} alt={link.label} className="h-6 w-6" />
									<span className="sr-only">{link.label}</span>
								</YnsLink>
							))}
						</div>
					</div>
				</div>

				<nav className="grid grid-cols-2 gap-16">
					{sections.map((section) => (
						<section key={section.header}>
							<h3 className="mb-2 font-semibold">{section.header}</h3>
							<ul role="list" className="grid gap-1">
								{section.links.map((link) => (
									<li key={link.label}>
										<YnsLink className="underline-offset-4 hover:underline" href={link.href}>
											{link.label}
										</YnsLink>
									</li>
								))}
							</ul>
						</section>
					))}
				</nav>
			</div>
			<div className="container mt-8 flexmax-w-7xl flex-col items-center justify-between gap-4 text-sm text-neutral-500 md:flex-row">
				<div className="text-center">
					<p>© {currentYear} Coeur de Kids. All rights reserved.</p>
					<p>Wear Luxury, Eat Healthy</p>
				</div>
			</div>
		</footer>
	);
}
