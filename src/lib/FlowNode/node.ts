import { v4 as uuidv4 } from "uuid";
import { FlowNode } from "@/types/flowTypes";

// Helpers to generate unique node/edge IDs
const generateNodeId = (prefix: string) => `${prefix}-${uuidv4().slice(0, 6)}`;


export const createMessageNode = (message: string, isStartNode = false, nodePositions: { posX: string, posY: string }): FlowNode => {
	//const messageData: string = message.replace(/\n/g, "<br>");
	return {
		id: generateNodeId("main_message"),
		flowNodeType: "Message",
		isStartNode,
		flowNodePosition: nodePositions,
		flowReplies: [
			{
				flowReplyType: "Text",
				data: `<p>${message}</p>`,
				caption: "",
				mimeType: ""
			}
		]
	}
};

// Helper to create an interactive button node
export const createButtonNode = (
	title: string,
	body: string,
	buttons: { text: string; nextId?: string; isCorrectAns?: boolean }[],
	nodePositions: { posX: string, posY: string },
	footer?: string,
	defaultNextId?: string,
): FlowNode => {
	const nodeId = generateNodeId("main_buttons");
	const buttonTitle: string = title.replace(/\n/g, "<br>");
	const buttonBody: string = body.replace(/\n/g, "<br>");
	const buttonFooter: string = footer?.replace(/\n/g, "<br>") ?? "";

	return {
		id: nodeId,
		flowNodeType: "InteractiveButtons",
		isStartNode: false,
		flowNodePosition: nodePositions,
		interactiveButtonsHeader: {
			type: "Text",
			text: title,
			media: null
		},
		interactiveButtonsBody: `<p>${body}</p>`,
		interactiveButtonsFooter: footer,
		interactiveButtonsItems: buttons.map((btn) => ({
			id: uuidv4().slice(0, 8),
			buttonText: btn.text,
			nodeResultId: btn.nextId ?? "",
			isCorrectAns: btn.isCorrectAns ?? false
		})),
		interactiveButtonsUserInputVariable: "",
		interactiveButtonsDefaultNodeResultId: defaultNextId ?? ""
	};
};
