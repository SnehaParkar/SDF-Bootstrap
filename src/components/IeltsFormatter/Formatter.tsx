// components/Formatter/Formatter.tsx
import { useState } from "react";
import { transformSourceData } from "@/utils/IELTSTransformer";
import { FlowTemplate, FlowNode } from "@/types/flowTypes";
import SelectSource from "../Controls/SelectSource";
import SourceInput from "../Controls/SourceInput";
import OutputControls from "../Controls/OutputControls";
import JsonOutput from "../Controls/JsonOutput";
import EditableButtonNode from "../Viewer/EditableButtonNode";
import EditableMessageNode from "../Viewer/EditableMessageNode";
import { ieltsSourceType } from "@/lib/constants";

export default function Formatter() {
	const [sourceData, setSourceData] = useState<string>("");
	const [outputFileame, setOutputFilename] = useState<string>("test");
	const [jsonOutput, setJsonOutput] = useState<FlowTemplate | null>(null);
	const [nodes, setNodes] = useState<FlowNode[]>([]);
	const [selectedSourceType, setSelectedSourceType] = useState<number>(0);


	const handleClearSourceData = () => {
		setSourceData("");
		setJsonOutput(null);
		setOutputFilename("Test");
	};

	/**
	 * Transforms the current source data into a flow template.
	 * Logs the source data to the console.
	 * Uses the transformSourceData utility to generate a FlowTemplate object.
	 * Updates the jsonOutput state with the transformed data.
	 * Updates the nodes state with the flow nodes from the transformed data.
	 */
	const handleTransform = () => {
		const transformed = transformSourceData(sourceData, outputFileame, ieltsSourceType[selectedSourceType]);
		console.log(transformed);
		setJsonOutput(transformed);
		setNodes(transformed.flowNodes);
	};

	const handleDownload = () => {
		const json = JSON.stringify(jsonOutput, null, 2);
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${outputFileame}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(JSON.stringify(jsonOutput, null, 2));
	};

	const handleUpdateNode = (updatedNode: FlowNode) => {
		setNodes((prev) =>
			prev.map((node) =>
				node.id === updatedNode.id
					? updatedNode
					: node
			)
		);
		jsonOutput!.flowNodes = nodes;
		setJsonOutput(jsonOutput);
	};

	return (
		<div className="sb-main-content-section">
			<SelectSource
				sourceData={ieltsSourceType}
				selectedSourceType={selectedSourceType}
				onChangeSourceType={setSelectedSourceType}
			/>
			<SourceInput
				sourceData={sourceData}
				outputFileame={outputFileame}
				onChangeSourceData={setSourceData}
				onChangeFilename={setOutputFilename}
				onClear={handleClearSourceData}
			/>
			<button className="sb-button sb-transform-button" onClick={handleTransform}>
				Transform Data
			</button>

			{jsonOutput && (
				<>

					<div className="sb-validation-title">Validate Transformed Data</div>
					<div className="sb-validation-container">
						{nodes.map((node, index) => (

							<>{node.flowNodeType === "InteractiveButtons" ?
								(
									<div className="sb-editable-node-card" key={index}>
										<div className="sb-editable-node-card-title">Node : {index + 1} - {node.flowNodeType}</div>
										<EditableButtonNode index={node.id} initialNode={node} updateNode={handleUpdateNode} />
									</div>

								) :
								(

									<div className="sb-editable-node-card" key={index}>
										{/* <div className="sb-editable-node-card-title">Node : {index + 1} - {node.flowNodeType}</div>
										<EditableMessageNode index={node.id} initialNode={node} updateNode={handleUpdateNode} /> */}
									</div>
								)
							}
							</>
						))}
					</div>
					<div className="sb-output-data-container">
						<OutputControls onCopy={handleCopy} onDownload={handleDownload} />
						<JsonOutput jsonOutput={jsonOutput} />
					</div>
				</>

			)}
		</div>
	);
}
