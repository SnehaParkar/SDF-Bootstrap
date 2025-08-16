
import { FlowEdge, FlowNodePosition, FlowNode } from "@/types/flowTypes";
import { createButtonNode } from "@/lib/FlowNode/node";
import { createEdgeNode } from "../FlowEdge/edge";
import { createFixedMessageNodeAtPosition } from "@/lib/FlowNode/createDataNodes";
import { IELTSQuizType } from "@/types/quiz";
import { calculateNodePositions } from "@/lib/FlowNode/createNodePositions";
const ieltsQuiz = {
	"correctAnsTitle": "Great Work !",
	"correctAnsText": "✅ <strong>That's Correct!</strong>",
	"correctAnswerButtonTitle": "Ok, got it",
	"wrongAnswerTitle": "❌ That's Incorrect!",
	"wrongAnswerButtonTitle": "Ok, got it"
}


export const createQuizNodesAtStartIndex = (flowEdges: FlowEdge[], index: number, nodePositions: FlowNodePosition, sourceNodes: FlowNode[], questionIndex: number, question: IELTSQuizType): any => {
	let nodeIndex = index;
	const optionKeys = Object.keys(question.options);
	const wrongAnsBody = `<p>${question.correctAnswerText}</p>`;

	const correctAnsBody = `<p>${ieltsQuiz.correctAnsText}</p> </br>\n <p>${question.correctAnswerText}</p>`;
	//Node - Quiz Question
	const quizButton = createButtonNode(
		`Quiz ${questionIndex + 1}`,
		question.question,
		optionKeys.map((option: string) => {
			const isCorrect = option === question.correctOption;
			return {
				text: option,
				isCorrectAns: isCorrect
			};
		}),
		nodePositions);
	nodeIndex++;
	nodePositions = calculateNodePositions(nodePositions, "questFixedMessage");



	//Node  - Common Message
	const quizFixedMessage = createFixedMessageNodeAtPosition(nodePositions);
	nodeIndex++;
	nodePositions = calculateNodePositions(nodePositions, "correctAnswer");

	//Node  - Correct Answer
	const quizCorrectAns = createButtonNode(
		ieltsQuiz.correctAnsTitle,
		correctAnsBody,
		[{ text: ieltsQuiz.correctAnswerButtonTitle }],
		nodePositions);
	nodeIndex++;

	//Node  - Common Message
	nodePositions = calculateNodePositions(nodePositions, "correctAnsFixedMessage");
	const quizCorrectAnsFixedMessage = createFixedMessageNodeAtPosition(nodePositions);
	nodeIndex++;
	nodePositions = calculateNodePositions(nodePositions, "wrongAnswer");


	//Node  - Wrong Answer
	const quizWrongAns = createButtonNode(
		ieltsQuiz.wrongAnswerTitle,
		wrongAnsBody,
		[{ text: ieltsQuiz.wrongAnswerButtonTitle }],
		nodePositions);
	nodeIndex++;
	nodePositions = calculateNodePositions(nodePositions, "wrongAnsFixedMessage");

	//Node  - Common Message
	const quizWrongAnsFixedMessage = createFixedMessageNodeAtPosition(nodePositions);
	nodeIndex++;
	nodePositions = calculateNodePositions(nodePositions, "question");


	quizButton.interactiveButtonsDefaultNodeResultId = quizFixedMessage.id;
	quizCorrectAns.interactiveButtonsDefaultNodeResultId = quizCorrectAnsFixedMessage.id;
	quizWrongAns.interactiveButtonsDefaultNodeResultId = quizWrongAnsFixedMessage.id;

	// connect sourceNodes to question Node
	sourceNodes.map((sourceNode: FlowNode) => {
		if (sourceNode?.interactiveButtonsItems && sourceNode.interactiveButtonsItems.length > 0)
			sourceNode.interactiveButtonsItems[0].nodeResultId = quizButton.id;
		flowEdges.push(createEdgeNode(
			`${sourceNode.id}__${(sourceNode?.interactiveButtonsItems && sourceNode.interactiveButtonsItems.length > 0) ? sourceNode.interactiveButtonsItems[0].id : "default"}`, quizButton.id));
	});

	flowEdges.push(createEdgeNode(`${quizButton.id}__${quizButton.id}-default`, quizFixedMessage.id));//6,20
	flowEdges.push(createEdgeNode(quizFixedMessage.id, quizButton.id));//7,21

	sourceNodes = [
		quizCorrectAns,
		quizWrongAns
	];


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
		nodes: [
			quizButton,
			quizFixedMessage,
			quizCorrectAns,
			quizCorrectAnsFixedMessage,
			quizWrongAns,
			quizWrongAnsFixedMessage],
		nodeIndex,
		nodePositions,
		sourceNodes
	};
}