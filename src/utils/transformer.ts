import { FlowTemplate, FlowNode, FlowEdge } from "@/types/flowTypes";
import { nodePositions } from "../lib/nodePositions";
import { tenantId, transformData, quizData, explanationData } from "@/lib/constants";
import { createEdgeNode } from "../lib/FlowEdge/edge";
import { createMessageNode, createButtonNode } from "../lib/FlowNode/node";
import { createStartButtonNodeAtIndex, createFixedMessageNodeAtIndex, createEndButtonNodeAtIndex } from "@/lib/FlowNode/createDataNodes";
import { createQuizNodesAtStartIndex } from "@/lib/Quiz/createQuizNodes";
import { createExplanationNodesAtStartIndex } from "@/lib/Explanation/createExplanationNodes";


const extractSteps = (sourceData: string): string[] => {
	const stepRegex = /Step\s+(\d+):\s*(.*?)\n([\s\S]*?)(?=(?:Step\s+\d+:)|$)/g;
	// const stepRegex = /(Step\s+\d+:)/gi;
	const steps: string[] = [];

	// Match everything before the first step
	const firstStepMatch = sourceData.match(/Step\s+1:/);

	const intro = firstStepMatch
		? sourceData.slice(0, firstStepMatch.index).trim()
		: '';

	steps.push(intro);

	let match: RegExpExecArray | null;
	while ((match = stepRegex.exec(sourceData)) !== null) {
		const stepNumber = parseInt(match[1]);
		const title = match[2];//.trim();
		const content = match[3];//.trim();

		steps.push(`${title}\n${content}`);
	}
	return steps;
}

export const transformSourceData = (sourceData: string, outputFileame: string): FlowTemplate => {
	// Mock transform logic – replace with actual parsing of sourceData
	const flowNodes: FlowNode[] = [];
	const flowEdges: FlowEdge[] = [];
	const steps = extractSteps(sourceData);

	// console.log(steps);
	let nodeIndex = 0;

	//Node 1 -Start Message
	const startMessage = createMessageNode(
		`${steps[0]}`,
		true,
		nodePositions[nodeIndex]
	);
	nodeIndex++;

	//Node 2 - Start Button
	const startButton = createStartButtonNodeAtIndex(nodeIndex);
	nodeIndex++;
	flowEdges.push(createEdgeNode(startMessage.id, startButton.id)); //1

	//Node 3 - Learning point 
	const learningPointButton = createButtonNode(
		"Let's start!",
		steps[1],
		[{ text: "Tell me more" }],
		nodePositions[nodeIndex]);
	nodeIndex++;
	flowEdges.push(createEdgeNode(
		`${startButton.id}__${(startButton?.interactiveButtonsItems && startButton.interactiveButtonsItems.length > 0) ? startButton.interactiveButtonsItems[0].id : "default"}`, learningPointButton.id)); //2


	//Node 4 - Common Message
	const learningPointFixedMessage = createFixedMessageNodeAtIndex(nodeIndex);
	nodeIndex++;

	learningPointButton.interactiveButtonsDefaultNodeResultId = learningPointFixedMessage.id;
	if (startButton?.interactiveButtonsItems && startButton.interactiveButtonsItems.length > 0)
		startButton.interactiveButtonsItems[0].nodeResultId = learningPointButton.id;

	flowEdges.push(createEdgeNode(`${learningPointButton.id}__${learningPointButton.id}-default`, learningPointFixedMessage.id));//4
	flowEdges.push(createEdgeNode(learningPointFixedMessage.id, learningPointButton.id));//5

	// Mini Quiz (5-10)
	// {
	// 	quizButton,
	// 	quizFixedMessage,
	// 	quizCorrectAns,
	// 	quizCorrectAnsFixedMessage,
	// 	quizWrongAns,
	// 	quizWrongAnsFixedMessage, nodeIndex
	// }
	let miniQuiz = createQuizNodesAtStartIndex(flowEdges, nodeIndex, quizData.title_1, steps[2]);
	nodeIndex = miniQuiz.nodeIndex;

	if (learningPointButton?.interactiveButtonsItems && learningPointButton.interactiveButtonsItems.length > 0)
		learningPointButton.interactiveButtonsItems[0].nodeResultId = miniQuiz.quizButton.id;

	flowEdges.push(createEdgeNode(
		`${learningPointButton.id}__${(learningPointButton?.interactiveButtonsItems && learningPointButton.interactiveButtonsItems.length > 0) ? learningPointButton.interactiveButtonsItems[0].id : "default"}`, miniQuiz.quizButton.id)); //3


	// Explanation (11-12)
	// {
	// 	explanationButton,
	// 	explanationFixedMessage,
	// 	nodeIndex
	// };
	let explanation1Nodes = createExplanationNodesAtStartIndex(flowEdges, nodeIndex, explanationData.buttonTitle_1, steps[3]);
	nodeIndex = explanation1Nodes.nodeIndex;

	if (miniQuiz.quizCorrectAns?.interactiveButtonsItems && miniQuiz.quizCorrectAns.interactiveButtonsItems.length > 0)
		miniQuiz.quizCorrectAns.interactiveButtonsItems[0].nodeResultId = explanation1Nodes.explanationButton.id;

	if (miniQuiz.quizWrongAns?.interactiveButtonsItems && miniQuiz.quizWrongAns.interactiveButtonsItems.length > 0)
		miniQuiz.quizWrongAns.interactiveButtonsItems[0].nodeResultId = explanation1Nodes.explanationButton.id;


	flowEdges.push(createEdgeNode(
		`${miniQuiz.quizCorrectAns.id}__${(miniQuiz.quizCorrectAns?.interactiveButtonsItems && miniQuiz.quizCorrectAns.interactiveButtonsItems.length > 0) ? miniQuiz.quizCorrectAns.interactiveButtonsItems[0].id : "default"}`, explanation1Nodes.explanationButton.id)); //15
	flowEdges.push(createEdgeNode(
		`${miniQuiz.quizWrongAns.id}__${(miniQuiz.quizWrongAns?.interactiveButtonsItems && miniQuiz.quizWrongAns.interactiveButtonsItems.length > 0) ? miniQuiz.quizWrongAns.interactiveButtonsItems[0].id : "default"}`, explanation1Nodes.explanationButton.id)); //16


	// Challenge (13-18)
	let challengeNode = createQuizNodesAtStartIndex(flowEdges, nodeIndex, quizData.title_2, steps[4]);
	nodeIndex = challengeNode.nodeIndex;

	if (explanation1Nodes.explanationButton?.interactiveButtonsItems && explanation1Nodes.explanationButton.interactiveButtonsItems.length > 0)
		explanation1Nodes.explanationButton.interactiveButtonsItems[0].nodeResultId = challengeNode.quizButton.id;

	flowEdges.push(createEdgeNode(
		`${explanation1Nodes.explanationButton.id}__${(explanation1Nodes.explanationButton?.interactiveButtonsItems && explanation1Nodes.explanationButton.interactiveButtonsItems.length > 0) ? explanation1Nodes.explanationButton.interactiveButtonsItems[0].id : "default"}`, challengeNode.quizButton.id)); //19


	// Explanation (19-20)
	let explanation2Nodes = createExplanationNodesAtStartIndex(flowEdges, nodeIndex, explanationData.buttonTitle_2, steps[5]);
	nodeIndex = explanation2Nodes.nodeIndex;

	if (challengeNode.quizCorrectAns?.interactiveButtonsItems && challengeNode.quizCorrectAns.interactiveButtonsItems.length > 0)
		challengeNode.quizCorrectAns.interactiveButtonsItems[0].nodeResultId = explanation2Nodes.explanationButton.id;

	if (challengeNode.quizWrongAns?.interactiveButtonsItems && challengeNode.quizWrongAns.interactiveButtonsItems.length > 0)
		challengeNode.quizWrongAns.interactiveButtonsItems[0].nodeResultId = explanation2Nodes.explanationButton.id;

	flowEdges.push(createEdgeNode(
		`${challengeNode.quizCorrectAns.id}__${(challengeNode.quizCorrectAns?.interactiveButtonsItems && challengeNode.quizCorrectAns.interactiveButtonsItems.length > 0) ? challengeNode.quizCorrectAns.interactiveButtonsItems[0].id : "default"}`, explanation2Nodes.explanationButton.id)); //29
	flowEdges.push(createEdgeNode(
		`${challengeNode.quizWrongAns.id}__${(challengeNode.quizWrongAns?.interactiveButtonsItems && challengeNode.quizWrongAns.interactiveButtonsItems.length > 0) ? challengeNode.quizWrongAns.interactiveButtonsItems[0].id : "default"}`, explanation2Nodes.explanationButton.id)); //30



	//Node 21 -End Message
	const endButton = createEndButtonNodeAtIndex(nodeIndex);
	nodeIndex++;

	if (explanation2Nodes.explanationButton?.interactiveButtonsItems && explanation2Nodes.explanationButton.interactiveButtonsItems.length > 0)
		explanation2Nodes.explanationButton.interactiveButtonsItems[0].nodeResultId = endButton.id;


	flowEdges.push(createEdgeNode(
		`${explanation2Nodes.explanationButton.id}__${(explanation2Nodes.explanationButton?.interactiveButtonsItems && explanation2Nodes.explanationButton.interactiveButtonsItems.length > 0) ? explanation2Nodes.explanationButton.interactiveButtonsItems[0].id : "default"}`, endButton.id)); //33


	flowNodes.push(startMessage, startButton, learningPointButton, learningPointFixedMessage);
	flowNodes.push(miniQuiz.quizButton, miniQuiz.quizFixedMessage, miniQuiz.quizCorrectAns, miniQuiz.quizCorrectAnsFixedMessage, miniQuiz.quizWrongAns, miniQuiz.quizWrongAnsFixedMessage);
	flowNodes.push(explanation1Nodes.explanationButton, explanation1Nodes.explanationFixedMessage);
	flowNodes.push(challengeNode.quizButton, challengeNode.quizFixedMessage, challengeNode.quizCorrectAns, challengeNode.quizCorrectAnsFixedMessage, challengeNode.quizWrongAns, challengeNode.quizWrongAnsFixedMessage);
	flowNodes.push(explanation2Nodes.explanationButton, explanation2Nodes.explanationFixedMessage);
	flowNodes.push(endButton);

	//console.log(flowNodes)

	return {
		id: null,
		tenantId: tenantId.toString(),
		name: outputFileame,
		created: null,
		flowNodes, // generated by linking flowNodes
		flowEdges, // generated by linking flowEdges
		lastUpdated: new Date().toISOString(),
		isDeleted: false,
		transform: {
			posX: transformData.posX.toString(),
			posY: transformData.posY.toString(),
			zoom: transformData.zoom.toString()
		},
		isPro: false,
		channelTypes: ["WA"]
	};
};
