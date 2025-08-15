// components/EditableButtonNode.tsx
"use client";

import { useEffect, useState } from "react";
import { FlowNode } from "@/types/flowTypes";
import TipTapEditor from '../TipTapEditor';

type Props = {
	initialNode: FlowNode;
	index: string;
	updateNode: (updatedNode: FlowNode) => void;
};


export default function EditableButtonNode({ initialNode, index, updateNode }: Props) {
	const [node, setNode] = useState<FlowNode>(initialNode);
	const [isVisible, setIsVisible] = useState(false); // Initial state: hidden

	useEffect(() => {
		// console.log("Nodes updated:", node);
		updateNode(node);
	}, [node]);

	const toggleVisibility = () => {
		setIsVisible(!isVisible); // Toggle the state on click
	};
	const handleChange = (field: "title" | "body", value: string) => {
		// console.log(field, value);
		setNode((prev) => ({
			...prev,
			interactiveButtonsHeader: {
				...prev.interactiveButtonsHeader,
				...(field === "title" && { text: value }),
			} as { type: string; text: string; media: null | string }, // assert the type of interactiveButtonsHeader
			...(field === "body" && { interactiveButtonsBody: value }),
		}));
	};

	return (
		<div className="sb-editable-node-container sb-editable-button">
			<div className="sb-editable-node-content">
				<div className="sb-editable-node-form">
					<h2 className="header">Edit Content</h2>
					<div className="sb-input-wrapper ">
						<label className="sb-input-data-title">Title</label>
						<input
							type="text"
							className="sb-input-text-field"
							value={node.interactiveButtonsHeader?.text}
							onChange={(e) => handleChange("title", e.target.value)}
						/>
					</div>
					<div className="sb-input-wrapper">
						<label className="sb-input-data-title">Body (HTML)</label>
						<TipTapEditor value={node.interactiveButtonsBody ?? ""}
							onChange={(value) => handleChange("body", value)} />
					</div>
				</div>

				<div className="sb-editable-node-preview">
					<h2 className="header">Preview</h2>
					<div className="sb-editable-node-preview-card">
						<h3 className="title">Buttons</h3>
						<div className="body-content">
							<h4 className="sub-title mb-4">{node.interactiveButtonsHeader?.text}</h4>
							<div
								dangerouslySetInnerHTML={{ __html: node.interactiveButtonsBody ?? "" }}
							/>
						</div>
						<div className="button-items">
							{node.interactiveButtonsItems?.map((item, index) => (
								<div className="button-item">{item.buttonText}</div>
							))}
						</div>
					</div>
				</div>
			</div>
			<button className=" sb-button  sb-toogle-node-data-button" onClick={toggleVisibility}>
				{isVisible ? 'Hide Node Object' : 'Show Node Object'}
			</button>
			{isVisible && (
				<div className="sb-editable-node-json">
					<h2 className="header">Node JSON</h2>

					<pre className="overflow-auto max-h-96 rounded-md">
						{JSON.stringify(node, null, 2)}
					</pre>

				</div>
			)}
		</div>
	);
}
