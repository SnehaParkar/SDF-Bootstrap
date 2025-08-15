"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type MenuItem = {
	label: string;
	path: string;
};
const menuItems: MenuItem[] = [
	{ label: "MATHS", path: "/maths" },
	{ label: "IELTS", path: "/ielts" },
	// { label: "Page 3", path: "/page3" },
];
export default function MenuBar() {
	const router = useRouter();
	return (
		<nav className="sb-side-menu-container">
			{menuItems.map((item) => {
				const isActive = router.pathname === item.path;
				return (
					<Link
						key={item.path}
						href={item.path}
						className={isActive ? "sb-side-menu-item active" : "sb-side-menu-item"}>
						{item.label}
					</Link>
				);
			})}
		</nav >
	);
}