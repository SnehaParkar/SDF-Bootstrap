import { useState } from "react";
import Header from "@/components/Header";
import Formatter from "@/components/IeltsFormatter/Formatter";
import MenuBar from "@/components/MenuBar";

export default function Ielts() {
	return (
		<>
			<div className="sb-container">
				<div className="sb-layout-frame">
					<div className="sb-header-divider"></div>
					<div className="sb-main-content-page">
						<Header title="IELTS SkillBytes Creator" />
						<MenuBar />
						<Formatter />
					</div>
				</div>
			</div>
		</>
	);
}
