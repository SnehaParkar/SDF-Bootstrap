import { FlowEdge } from "@/types/flowTypes";
import { nodePositions } from "@/lib/nodePositions";
import { createButtonNode } from "@/lib/FlowNode/node";
import { createEdgeNode } from "@/lib/FlowEdge/edge";
import { createFixedMessageNodeAtIndex } from "@/lib/FlowNode/createDataNodes";
import { extractExplanationBlock } from "./extractExplanation";


export const createExplanationNodesAtStartIndex = (flowEdges: FlowEdge[], index: number, buttonTitle: string, text: string): any => {
	let nodeIndex = index;

	const explanationBlock = extractExplanationBlock(text);
	const explanationButton = createButtonNode(
		explanationBlock.explanationTitle,
		explanationBlock.explanation,
		[{ text: buttonTitle }],
		nodePositions[nodeIndex]);
	nodeIndex++;

	//Node 12 - Common Message
	const explanationFixedMessage = createFixedMessageNodeAtIndex(nodeIndex);
	nodeIndex++;

	explanationButton.interactiveButtonsDefaultNodeResultId = explanationFixedMessage.id;

	flowEdges.push(createEdgeNode(`${explanationButton.id}__${explanationButton.id}-default`, explanationFixedMessage.id));//17,31
	flowEdges.push(createEdgeNode(explanationFixedMessage.id, explanationButton.id));//18,32

	return {
		explanationButton: explanationButton,
		explanationFixedMessage: explanationFixedMessage,
		nodeIndex
	};
}
