import { FlowEdge } from "@/types/flowTypes";
import { nodePositions } from "@/lib/nodePositions";
import { quizData } from "@/lib/constants";
import { createButtonNode } from "@/lib/FlowNode/node";
import { createEdgeNode } from "../FlowEdge/edge";
import { createFixedMessageNodeAtIndex } from "@/lib/FlowNode/createDataNodes";
import { extractQuizData } from "./extractQuiz";

export const createQuizNodesAtStartIndex = (flowEdges: FlowEdge[], index: number, title: string, text: string): any => {
	let nodeIndex = index;
	// if (steps[2].includes("📘 Q.")) {
	const quizResult = extractQuizData(text);

	if (quizResult) {
		const optionsList = Object.entries(quizResult.options);
		const optionsListHTML = optionsList.map((option: any) => `<p><b>${option[0]}</b> : ${option[1]}</p>`).join("");

		const quizBody = `<p>${quizResult.question}</p></br>Choose : ${optionsListHTML}`;
		const correctAns1Body = `<p>${quizResult.correctOption}</p></br><p>${quizResult.explanation}</p>`;
		const wrongAns1Body = `<p>${quizResult.wrongAnswerExplanation}</p></br><p><b>Correct Answer </b></p><br/><p>${correctAns1Body}</p>`;
		const optionKeys = Object.keys(quizResult.options);

		//Node 5 - Quiz Question
		const quizButton = createButtonNode(
			title,
			quizBody,
			optionKeys.map((option: string) => {
				const isCorrect = option === quizResult.correctAnswer;
				return {
					text: option,
					isCorrectAns: isCorrect
				};
			}),
			nodePositions[nodeIndex],
			quizData.footer);
		nodeIndex++;
		// console.log(quizButton)

		//Node 6 - Common Message
		const quizFixedMessage = createFixedMessageNodeAtIndex(nodeIndex);
		nodeIndex++;

		//Node 7 - Correct Answer
		const quizCorrectAns = createButtonNode(
			quizData.correctAnswerTitle,
			correctAns1Body,
			[{ text: quizData.correctAnswerButtonTitle }],
			nodePositions[nodeIndex],);
		nodeIndex++;

		//Node 8 - Common Message
		const quizCorrectAnsFixedMessage = createFixedMessageNodeAtIndex(nodeIndex);
		nodeIndex++;

		//Node 9 - Wrong Answer
		const quizWrongAns = createButtonNode(
			quizData.wrongAnswerTitle,
			wrongAns1Body,
			[{ text: quizData.wrongAnswerButtonTitle }],
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