
import Head from 'next/head'
import Header from '@/components/Header';
import { useState } from "react";
import Formatter from "@/components/MathFormatter/Formatter";
import MenuBar from "@/components/MenuBar";


export default function Maths() {
	return (
		<>
			<div className="sb-container">
				<div className="sb-layout-frame">
					<div className="sb-header-divider"></div>
					<div className="sb-main-content-page">
						<Header title="Maths SkillBytes Creator" />
						<MenuBar />
						<Formatter />
					</div>
				</div>
			</div>
		</>
	);
}
