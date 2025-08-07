import { startButtonData, endButtonData, commonTextMessage } from "@/lib/constants";
import { nodePositions } from "@/lib/nodePositions";
import { createMessageNode, createButtonNode } from "@/lib/FlowNode/node";
/**
 * Creates a "Start" button node at the given index.
 * @param index the index to place the node at
 * @returns the created node
 */
export const createStartButtonNodeAtIndex = (index: number) => {
	return createButtonNode(
		startButtonData.title,
		startButtonData.body,
		[{ text: startButtonData.buttonText }],
		nodePositions[index])
}

/**
 * Creates an "End" button node at the specified index.
 * @param index - The index at which to place the node.
 * @returns The created node.
 */
export const createEndButtonNodeAtIndex = (index: number) => {
	return createButtonNode(
		endButtonData.title,
		endButtonData.body,
		[{ text: endButtonData.buttonText }],
		nodePositions[index]
	);
}

export const createFixedMessageNodeAtIndex = (index: number) => {
	const commonText = commonTextMessage;
	return createMessageNode(
		commonText,
		false,
		nodePositions[index]);
}
