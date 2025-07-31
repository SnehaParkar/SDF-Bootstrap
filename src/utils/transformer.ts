import { FlowTemplate, FlowNode, FlowEdge } from "@/types/flowTypes";
import { extractQuizData } from "./extractQuiz";
import { extractExplanationBlock } from "./extractExplanation";
import { nodePositions } from "./nodePositions";
import { edgeConnections } from "./edgeConnections";
import { create } from "domain";
import { v4 as uuidv4 } from "uuid";
import { start } from "repl";
const tenantId = "441194";
const positionX = "26.21700879129719";
const positionY = "662.2729609554739";
const zoom = "0.7393133700896274";

const quiz1Title = "Mini Quiz";
const quiz2Title = "Your next challenge";
const quizFooterText = "📘 Important Question";
const correctAnswerTitle = "✅ That's Correct!";
const correctAnswerButtonTitle = "Ok, got it";
const wrongAnswerTitle = "❌ That's Incorrect!";
const wrongAnswerButtonTitle = "Ok, got it";
const explanation1ButtonTitle = "Ok, got it";
const explanation2ButtonTitle = "Finish";


// Helpers to generate unique node/edge IDs
const generateNodeId = (prefix: string) => `${prefix}-${uuidv4().slice(0, 6)}`;
const generateEdgeId = (source: string, target: string) => `reactflow__edge-${source}-${target}`;

const createEdgeNode = (sourceNodeId: string, targetNodeId: string): FlowEdge => ({
	id: generateEdgeId(sourceNodeId, targetNodeId),
	sourceNodeId: sourceNodeId,
	targetNodeId: targetNodeId
});


// Helper to create a message node
const createMessageNode = (html: string, isStartNode = false, nodePositions: { posX: string, posY: string }): FlowNode => {
	const messageData: string = html.replace(/\n/g, "<br>");
	return {
		id: generateNodeId("main_message"),
		flowNodeType: "Message",
		isStartNode,
		flowNodePosition: nodePositions,
		flowReplies: [
			{
				flowReplyType: "Text",
				data: `<p>${messageData}</p>`,
				caption: "",
				mimeType: ""
			}
		]
	}
};

// Helper to create an interactive button node
const createButtonNode = (
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
		interactiveButtonsBody: `<p>${buttonBody}</p>`,
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

const createStartButtonNodeAtIndex = (index: number) => {
	const title = "Ready to begin?";
	const body = `<p>Click below to start</p>`
	const buttonText = "Let's go"
	return createButtonNode(
		title,
		body,
		[{ text: buttonText }],
		nodePositions[index])
}

const createEndButtonNodeAtIndex = (index: number) => {
	const title = "What next?";
	const body = `<p>Whenever you are ready to explore other <strong>SkillBytes</strong>, you can respond to this chat with the below <strong>keywords</strong><br/><br/><br/>a) <strong>Maths </strong>- Chapter selection</p>\n<p>b) <strong>AP</strong> - SkillBytes selection for Arithmetic Progression</p>`
	const buttonText = "Done"
	return createButtonNode(
		title,
		body,
		[{ text: buttonText }],
		nodePositions[index])
}

const createFixedMessageNodeAtIndex = (index: number) => {
	const commonText = `<p><strong>Sorry we didnt get the response, can you answer again?</strong></p>`;
	return createMessageNode(
		commonText,
		false,
		nodePositions[index]);
}

const createQuizBytesAtStartIndex = (flowEdges: FlowEdge[], index: number, title: string, text: string): any => {
	let nodeIndex = index;
	// if (steps[2].includes("📘 Q.")) {
	const quizResult = extractQuizData(text);
	// console.log(quizResult);
	if (quizResult) {

		const quizBody = `<p>${quizResult.question}</p>`;//</br><p>${quizResult.options.map((option) => `<p>${option}</p>`).join("\n")}</p>`;
		const correctAns1Body = `<p>${quizResult.correctAnswer}</p></br><p>${quizResult.explanation}</p>`;
		const wrongAns1Body = `<p>${quizResult.wrongAnswerExplanation}</p></br><p><strong>Correct Ans is : </strong></p><br/><p>${correctAns1Body}</p>`;
		const optionKeys = Object.keys(quizResult.options);

		//Node 5 - Quiz Question
		const quizButton = createButtonNode(
			title,
			quizBody,
			optionKeys.map((option: string) => {
				const isCorrect = option === quizResult.correctOption;
				return {
					text: option,
					isCorrectAns: isCorrect
				};
			}),
			nodePositions[nodeIndex],
			quizFooterText);
		nodeIndex++;
		// console.log(quizButton)

		//Node 6 - Common Message
		const quizFixedMessage = createFixedMessageNodeAtIndex(nodeIndex);
		nodeIndex++;

		//Node 7 - Correct Answer
		const quizCorrectAns = createButtonNode(
			correctAnswerTitle,
			correctAns1Body,
			[{ text: correctAnswerButtonTitle }],
			nodePositions[nodeIndex],);
		nodeIndex++;

		//Node 8 - Common Message
		const quizCorrectAnsFixedMessage = createFixedMessageNodeAtIndex(nodeIndex);
		nodeIndex++;

		//Node 9 - Wrong Answer
		const quizWrongAns = createButtonNode(
			wrongAnswerTitle,
			wrongAns1Body,
			[{ text: wrongAnswerButtonTitle }],
			nodePositions[nodeIndex]);
		nodeIndex++;

		//Node 10 - Common Message
		const quizWrongAnsFixedMessage = createFixedMessageNodeAtIndex(nodeIndex);
		nodeIndex++;

		quizButton.interactiveButtonsDefaultNodeResultId = quizFixedMessage.id;
		quizCorrectAns.interactiveButtonsDefaultNodeResultId = quizCorrectAnsFixedMessage.id;
		quizWrongAns.interactiveButtonsDefaultNodeResultId = quizWrongAnsFixedMessage.id;

		flowEdges.push(createEdgeNode(`${quizButton.id}__${quizButton.id}-default`, quizFixedMessage.id));//6,20
		flowEdges.push(createEdgeNode(quizFixedMessage.id, quizButton.id));//7,21

		if (quizButton?.interactiveButtonsItems && quizButton.interactiveButtonsItems.length > 0) {
			let correctOptId,
				wrongOptsId: string[] = [];

			quizButton.interactiveButtonsItems.forEach((item) => {
				if (item.isCorrectAns)
					correctOptId = item.id;
				else
					wrongOptsId.push(item.id);

				item.nodeResultId = item.isCorrectAns ? quizCorrectAns.id : quizWrongAns.id;
			});

			flowEdges.push(createEdgeNode(`${quizButton.id}__${correctOptId}`, quizCorrectAns.id));//10,22
			flowEdges.push(createEdgeNode(`${quizButton.id}__${wrongOptsId[0]}`, quizWrongAns.id));//8,23
			flowEdges.push(createEdgeNode(`${quizButton.id}__${wrongOptsId[1]}`, quizWrongAns.id));//9,24

		}

		flowEdges.push(createEdgeNode(`${quizCorrectAns.id}__${quizCorrectAns.id}-default`, quizCorrectAnsFixedMessage.id));//11,25
		flowEdges.push(createEdgeNode(quizCorrectAnsFixedMessage.id, quizCorrectAns.id));//12,26

		flowEdges.push(createEdgeNode(`${quizWrongAns.id}__${quizWrongAns.id}-default`, quizWrongAnsFixedMessage.id));//13,27
		flowEdges.push(createEdgeNode(quizWrongAnsFixedMessage.id, quizWrongAns.id));//14,28

		return {
			quizButton,
			quizFixedMessage,
			quizCorrectAns,
			quizCorrectAnsFixedMessage,
			quizWrongAns,
			quizWrongAnsFixedMessage, nodeIndex
		};
	}

	// }
}

const createExplanationBytesAtStartIndex = (flowEdges: FlowEdge[], index: number, buttonTitle: string, text: string): any => {
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
		explanation1Button: explanationButton,
		explanation1FixedMessage: explanationFixedMessage,
		nodeIndex
	};
}


export const transformSourceData = (sourceData: string, outputFileame: string): FlowTemplate => {
	// Mock transform logic – replace with actual parsing of sourceData
	const flowNodes: FlowNode[] = [];
	const flowEdges: FlowEdge[] = [];

	const stepRegex = /Step\s+(\d+):\s*(.*?)\n([\s\S]*?)(?=(?:Step\s+\d+:)|$)/g;
	const steps: string[] = [];

	// Match everything before the first step
	const firstStepMatch = sourceData.match(/Step\s+1:/);

	const intro = firstStepMatch
		? sourceData.slice(0, firstStepMatch.index).trim()
		: '';

	steps.push(intro);
	let match: RegExpExecArray | null;
	while ((match = stepRegex.exec(sourceData)) !== null) {
		// console.log(match);
		const stepNumber = parseInt(match[1]);
		const title = match[2];//.trim();
		const content = match[3];//.trim();

		steps.push(`${title}\n${content}`);
	}

	console.log(steps);
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
	let quiz1Nodes = createQuizBytesAtStartIndex(flowEdges, nodeIndex, quiz1Title, steps[2]);
	nodeIndex = quiz1Nodes.nodeIndex;

	if (learningPointButton?.interactiveButtonsItems && learningPointButton.interactiveButtonsItems.length > 0)
		learningPointButton.interactiveButtonsItems[0].nodeResultId = quiz1Nodes.quizButton.id;

	flowEdges.push(createEdgeNode(
		`${learningPointButton.id}__${(learningPointButton?.interactiveButtonsItems && learningPointButton.interactiveButtonsItems.length > 0) ? learningPointButton.interactiveButtonsItems[0].id : "default"}`, quiz1Nodes.quizButton.id)); //3


	// Explanation (11-12)
	// {
	// 	explanation1Button,
	// 	explanation1FixedMessage,
	// 	nodeIndex
	// };
	let explanation1Nodes = createExplanationBytesAtStartIndex(flowEdges, nodeIndex, explanation1ButtonTitle, steps[3]);
	nodeIndex = explanation1Nodes.nodeIndex;

	if (quiz1Nodes.quizCorrectAns?.interactiveButtonsItems && quiz1Nodes.quizCorrectAns.interactiveButtonsItems.length > 0)
		quiz1Nodes.quizCorrectAns.interactiveButtonsItems[0].nodeResultId = explanation1Nodes.explanation1Button.id;

	if (quiz1Nodes.quizWrongAns?.interactiveButtonsItems && quiz1Nodes.quizWrongAns.interactiveButtonsItems.length > 0)
		quiz1Nodes.quizWrongAns.interactiveButtonsItems[0].nodeResultId = explanation1Nodes.explanation1Button.id;


	flowEdges.push(createEdgeNode(
		`${quiz1Nodes.quizCorrectAns.id}__${(quiz1Nodes.quizCorrectAns?.interactiveButtonsItems && quiz1Nodes.quizCorrectAns.interactiveButtonsItems.length > 0) ? quiz1Nodes.quizCorrectAns.interactiveButtonsItems[0].id : "default"}`, explanation1Nodes.explanation1Button.id)); //15
	flowEdges.push(createEdgeNode(
		`${quiz1Nodes.quizWrongAns.id}__${(quiz1Nodes.quizWrongAns?.interactiveButtonsItems && quiz1Nodes.quizWrongAns.interactiveButtonsItems.length > 0) ? quiz1Nodes.quizWrongAns.interactiveButtonsItems[0].id : "default"}`, explanation1Nodes.explanation1Button.id)); //16


	// Challenge (13-18)
	let quiz2Nodes = createQuizBytesAtStartIndex(flowEdges, nodeIndex, quiz2Title, steps[4]);
	nodeIndex = quiz2Nodes.nodeIndex;

	if (explanation1Nodes.explanation1Button?.interactiveButtonsItems && explanation1Nodes.explanation1Button.interactiveButtonsItems.length > 0)
		explanation1Nodes.explanation1Button.interactiveButtonsItems[0].nodeResultId = quiz2Nodes.quizButton.id;

	flowEdges.push(createEdgeNode(
		`${explanation1Nodes.explanation1Button.id}__${(explanation1Nodes.explanation1Button?.interactiveButtonsItems && explanation1Nodes.explanation1Button.interactiveButtonsItems.length > 0) ? explanation1Nodes.explanation1Button.interactiveButtonsItems[0].id : "default"}`, quiz2Nodes.quizButton.id)); //19


	// Explanation (19-20)
	let explanation2Nodes = createExplanationBytesAtStartIndex(flowEdges, nodeIndex, explanation2ButtonTitle, steps[5]);
	nodeIndex = explanation2Nodes.nodeIndex;

	if (quiz2Nodes.quizCorrectAns?.interactiveButtonsItems && quiz2Nodes.quizCorrectAns.interactiveButtonsItems.length > 0)
		quiz2Nodes.quizCorrectAns.interactiveButtonsItems[0].nodeResultId = explanation2Nodes.explanation1Button.id;

	if (quiz2Nodes.quizWrongAns?.interactiveButtonsItems && quiz2Nodes.quizWrongAns.interactiveButtonsItems.length > 0)
		quiz2Nodes.quizWrongAns.interactiveButtonsItems[0].nodeResultId = explanation2Nodes.explanation1Button.id;

	flowEdges.push(createEdgeNode(
		`${quiz2Nodes.quizCorrectAns.id}__${(quiz2Nodes.quizCorrectAns?.interactiveButtonsItems && quiz2Nodes.quizCorrectAns.interactiveButtonsItems.length > 0) ? quiz2Nodes.quizCorrectAns.interactiveButtonsItems[0].id : "default"}`, explanation2Nodes.explanation1Button.id)); //29
	flowEdges.push(createEdgeNode(
		`${quiz2Nodes.quizWrongAns.id}__${(quiz2Nodes.quizWrongAns?.interactiveButtonsItems && quiz2Nodes.quizWrongAns.interactiveButtonsItems.length > 0) ? quiz2Nodes.quizWrongAns.interactiveButtonsItems[0].id : "default"}`, explanation2Nodes.explanation1Button.id)); //30



	//Node 21 -End Message
	const endButton = createEndButtonNodeAtIndex(nodeIndex);
	nodeIndex++;

	if (explanation2Nodes.explanation1Button?.interactiveButtonsItems && explanation2Nodes.explanation1Button.interactiveButtonsItems.length > 0)
		explanation2Nodes.explanation1Button.interactiveButtonsItems[0].nodeResultId = endButton.id;


	flowEdges.push(createEdgeNode(
		`${explanation2Nodes.explanation1Button.id}__${(explanation2Nodes.explanation1Button?.interactiveButtonsItems && explanation2Nodes.explanation1Button.interactiveButtonsItems.length > 0) ? explanation2Nodes.explanation1Button.interactiveButtonsItems[0].id : "default"}`, endButton.id)); //33


	flowNodes.push(startMessage, startButton, learningPointButton, learningPointFixedMessage);
	flowNodes.push(quiz1Nodes.quizButton, quiz1Nodes.quizFixedMessage, quiz1Nodes.quizCorrectAns, quiz1Nodes.quizCorrectAnsFixedMessage, quiz1Nodes.quizWrongAns, quiz1Nodes.quizWrongAnsFixedMessage);
	flowNodes.push(explanation1Nodes.explanation1Button, explanation1Nodes.explanation1FixedMessage);
	flowNodes.push(quiz2Nodes.quizButton, quiz2Nodes.quizFixedMessage, quiz2Nodes.quizCorrectAns, quiz2Nodes.quizCorrectAnsFixedMessage, quiz2Nodes.quizWrongAns, quiz2Nodes.quizWrongAnsFixedMessage);
	flowNodes.push(explanation2Nodes.explanation1Button, explanation2Nodes.explanation1FixedMessage);
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
			posX: positionX.toString(),
			posY: positionY.toString(),
			zoom: zoom.toString()
		},
		isPro: false,
		channelTypes: ["WA"]
	};
};
