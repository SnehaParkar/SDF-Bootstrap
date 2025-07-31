export type FlowReply = {
	flowReplyType: string;
	data: string;
	caption: string;
	mimeType: string;
};

export type FlowNode = {
	id: string;
	flowNodeType: string;
	flowNodePosition: { posX: string; posY: string };
	isStartNode: boolean;
	flowReplies?: FlowReply[];
	interactiveButtonsHeader?: {
		type: string;
		text: string;
		media: null | string;
	};
	interactiveButtonsBody?: string;
	interactiveButtonsFooter?: string;
	interactiveButtonsItems?: {
		id: string;
		buttonText: string;
		nodeResultId: string;
		isCorrectAns: boolean;
	}[];
	interactiveButtonsUserInputVariable?: string;
	interactiveButtonsDefaultNodeResultId?: string;
};

export type FlowEdge = {
	id: string;
	sourceNodeId: string;
	targetNodeId: string;
};

export type FlowTemplate = {
	id: null;
	tenantId: string;
	name: string;
	created: null;
	flowNodes: FlowNode[];
	flowEdges: FlowEdge[];
	lastUpdated: string;
	isDeleted: boolean;
	transform: {
		posX: string;
		posY: string;
		zoom: string;
	};
	isPro: boolean;
	channelTypes: string[];
};
