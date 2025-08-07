// components/EditableMessageNode.tsx
"use client";

import { useEffect, useState } from "react";
import { FlowNode } from "@/types/flowTypes";
import TipTapEditor from '../TipTapEditor';

type Props = {
	initialNode: FlowNode;
	index: string;
	updateNode: (updatedNode: FlowNode) => void;
};


export default function EditableMessageNode({ initialNode, index, updateNode }: Props) {
	const [node, setNode] = useState<FlowNode>(initialNode);
	const [isVisible, setIsVisible] = useState(false); // Initial state: hidden

	useEffect(() => {
		// console.log("Nodes updated:", node);
		updateNode(node);
	}, [node]);

	const toggleVisibility = () => {
		setIsVisible(!isVisible); // Toggle the state on click
	};
	const handleChange = (field: "body", value: string) => {
		setNode((prev) => {
			if (prev.flowReplies && prev.flowReplies.length > 0) {
				return {
					...prev,
					flowReplies: [{
						...prev.flowReplies[0],
						...(field === "body" && { data: value }),
					}]
				};
			} else {
				return prev;
			}
		});
	};

	return (
		<div className="sb-editable-node-container sb-editable-message">
			<div className="sb-editable-node-content">
				<div className="sb-editable-node-form">
					<h2 className="header">Edit Content</h2>
					<div className="sb-input-wrapper">
						<label className="sb-input-data-title">data (HTML)</label>
						<TipTapEditor value={node.flowReplies ? node.flowReplies[0].data ?? "" : ""} onChange={(value) => handleChange("body", value)} />
						{/* <textarea
							className="sb-source-input-textarea"
							rows={4}
							value={node.flowReplies ? node.flowReplies[0].data ?? "" : ""}
							onChange={(e) => handleChange("body", e.target.value)}
						/> */}
					</div>
				</div>

				<div className="sb-editable-node-preview">
					<h2 className="header">Preview</h2>
					<div className="sb-editable-node-preview-card">
						<h3 className="title">send a message</h3>
						<div
							className="body-content"
							dangerouslySetInnerHTML={{ __html: node.flowReplies ? node.flowReplies[0].data ?? "" : "" }}
						/>
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
