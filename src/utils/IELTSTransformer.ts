

import { FlowTemplate, FlowNode, FlowEdge } from "@/types/flowTypes";
//import { nodePositions } from "../lib/nodePositions";
import {
	tenantId,
	transformData,
	ieltsRead_readSelect_wm,
	startNodePositions,
	ieltsRead_fillInBlanks_wm,
	ieltsRead_readComplete_wm
} from "@/lib/constants";
import { createEdgeNode } from "../lib/FlowEdge/edge";
import { createMessageNode, createButtonNode } from "../lib/FlowNode/node";
import { createStartButtonNodeAtPosition, createFixedMessageNodeAtPosition, createEndButtonNodeAtPosition } from "@/lib/FlowNode/createDataNodes";
import { createQuizNodesAtStartIndex } from "@/lib/Ielts/createQuizNodes";
import { calculateNodePositions } from "@/lib/FlowNode/createNodePositions";
import { IELTSQuizType } from "@/types/quiz";
import { ieltsSourceType } from "@/lib/constants";
const questText = "From the list of words pick out the correct one";
const fillinblanksQuestText = "Complete the sentence with the correct words";
const booleanQuestText = "True or False";
const multiChoiseQuestText = "From the list of options pick out the correct one";

const extractQuestions = (data: string, type: string): IELTSQuizType[] => {
	const questions: IELTSQuizType[] = [];
	const lines = data.trim().split("\n\n");


	lines.forEach((line, index) => {
		if (type == "Read & Select") {
			const keys = ["A", "B", "C", "D", "E", "F", "G"];
			let quest = createIELTSQuizSelectType(line, keys);
			questions.push(quest);
		}
		else if (type == "Fill in the Blanks") {
			const keys = ["0", "A", "B", "C", "D", "E", "F", "G"];
			let quest = createIELTSQuizFillInBlanksType(line, keys);
			questions.push(quest);
		}
		else if (type == "Read & Complete") {
			const keys = ["0", "A", "B", "C", "D", "E", "F", "G"];
			if (index == 0) {
				questions.push({
					question: line.trim().split("\n")[0],
					options: {},
					correctOption: "",
					correctAnswerText: line.trim().split("\n")[1]
				});
			} else {
				let quest = createIELTSQuizReadCompleteType(line, keys);
				questions.push(quest);
			}
		}

	});
	return questions;
}

type QuestionType = "multi-choice" | "boolean" | "fill_in_blanks" | "unknown";
const detectTypeOfQuestion = (data: string): QuestionType => {
	const lowerQ = data.toLowerCase().trim();
	// Detect Fill in the Blanks
	if (lowerQ.includes("___") || lowerQ.includes("blank")) {
		return "fill_in_blanks";
	}
	else if (lowerQ.includes("True or False:") || lowerQ.includes("blank")) {
		return "boolean";
	}
	else
		return "multi-choice";
}

const createIELTSQuizSelectType = (data: string, keys: string[]): IELTSQuizType => {
	let question = `<p>${questText}</p>\n`;
	const options: Record<string, string> = {};
	let correctOption = "";
	let correctAnswerText = "";

	const optionsArray = data.trim().split("\n");

	optionsArray.map((option, index) => {
		// Match pattern like "1a. SPDE" or "2b.BUZY"
		const match = option.match(/^(\d+)([a-c])\.?\s*(.+?)(\s*✅)?$/);
		if (match) {
			const optionText = match[3].trim();
			options[keys[index]] = optionText;
			question += `<p>${keys[index]}) ${optionText}</p>\n`;
			const isCorrect = match[4] ? match[4].trim() === "✅" : false;
			if (isCorrect)
				correctOption = keys[index];
		}
	})
	correctAnswerText = `The correct answer is  ${correctOption}) ${options[correctOption]}`

	return { question, options, correctOption, correctAnswerText };
}

const createIELTSQuizFillInBlanksType = (data: string, keys: string[]): IELTSQuizType => {

	const quizArray = data.trim().split("\n");
	console.log(quizArray);
	let questionText = quizArray[0].split(":")[1].trim();

	let question = `<p>${fillinblanksQuestText}</p>\n<p>${questionText}</p>\n`;
	const options: Record<string, string> = {};
	let correctOption = "";
	let correctAnswerText = "";

	quizArray.map((option, index) => {
		// Match pattern like "a) on ✅  or. b) in "
		const match = option.match(/^([a-c])\)\.?\s*(.+?)(\s*✅)?$/);
		console.log(match, index, keys[index]);
		if (match) {
			const optionText = match[2].trim();
			options[keys[index]] = optionText;
			console.log(options);
			question += `<p>${keys[index]}) ${optionText}</p>\n`;
			const isCorrect = match[3] ? match[3].trim() === "✅" : false;
			if (isCorrect)
				correctOption = keys[index];
		}
	})
	let correctedSentence = `${questionText.split("___")[0]} <strong>${options[correctOption]}</strong> ${questionText.split("___")[1]}`;
	correctAnswerText = `The correct answer is  ${correctOption}) ${options[correctOption]}\n<p>${correctedSentence}</p>`
	return { question, options, correctOption, correctAnswerText };
}

const createIELTSQuizMultiChoiceType = (data: string, keys: string[]): IELTSQuizType => {

	const quizArray = data.trim().split("\n");
	console.log(quizArray);
	let questionText = quizArray[0];//.split(":")[1].trim();

	let question = `<p>${multiChoiseQuestText}</p>\n<p>${questionText}</p>`;
	const options: Record<string, string> = {};
	let correctOption = "";
	let correctAnswerText = "";

	quizArray.map((option, index) => {
		// Match pattern like "a) on ✅  or. b) in "
		const match = option.match(/^([a-c])\)\.?\s*(.+?)(\s*✅)?$/);
		console.log(match, index, keys[index]);
		if (match) {
			const optionText = match[2].trim();
			options[keys[index]] = optionText;
			console.log(options);
			question += `<p>${keys[index]}) ${optionText}</p>\n`;
			const isCorrect = match[3] ? match[3].trim() === "✅" : false;
			if (isCorrect)
				correctOption = keys[index];
		}
	})
	correctAnswerText = `The correct answer is  ${correctOption}) ${options[correctOption]}`
	return { question, options, correctOption, correctAnswerText };
}

const createIELTSQuizBooleanType = (data: string, keys: string[]): IELTSQuizType => {

	const quizArray = data.trim().split("\n");
	console.log(quizArray);
	let questionText = quizArray[0].split(":")[1].trim();

	let question = `<p>${booleanQuestText}</p>\n<p>${questionText}</p>`;
	const options: Record<string, string> = {};
	let correctOption = "";
	let correctAnswerText = "";

	quizArray.map((option, index) => {
		// Match pattern like "a) on ✅  or. b) in "
		const match = option.match(/^.?\s*(.+?)(\s*✅)?$/);
		console.log(match, index, keys[index]);
		if (match) {
			const optionText = match[2].trim();
			options[keys[index]] = optionText;
			console.log(options);
			question += `<p>${keys[index]}) ${optionText}</p>\n`;
			const isCorrect = match[3] ? match[3].trim() === "✅" : false;
			if (isCorrect)
				correctOption = keys[index];
		}
	})
	correctAnswerText = `The correct answer is  ${correctOption}) ${options[correctOption]}`
	return { question, options, correctOption, correctAnswerText };

}

const createIELTSQuizReadCompleteType = (data: string, keys: string[]): IELTSQuizType => {
	console.log(data);
	let question = "";
	let options: Record<string, string> = {};
	let correctOption = "";
	let correctAnswerText = "";
	let questObj: any = {};

	let questType = detectTypeOfQuestion(data);
	console.log(questType);
	if (questType == "multi-choice") {
		questObj = createIELTSQuizMultiChoiceType(data, keys);
	} else if (questType == "fill_in_blanks") {
		questObj = createIELTSQuizFillInBlanksType(data, keys);
	} else if (questType == "boolean") {
		questObj = createIELTSQuizBooleanType(data, keys);
	}
	question = questObj.question;
	options = questObj.options;
	correctOption = questObj.correctOption;
	correctAnswerText = questObj.correctAnswerText;

	return { question, options, correctOption, correctAnswerText };
}



export const transformSourceData = (sourceData: string, outputFileame: string, sourceType: string): FlowTemplate => {

	let nodeIndex = 0;
	let nodePositions = startNodePositions;

	const flowNodes: FlowNode[] = [];
	const flowEdges: FlowEdge[] = [];

	let sourceNodes: FlowNode[] = [];
	let questions: any[] = [];
	let welcomeMessage = "";
	let questionNodes: any[] = [];

	if (sourceType == "Read & Select") {
		welcomeMessage = ieltsRead_readSelect_wm;
	} else if (sourceType == "Fill in the Blanks") {
		welcomeMessage = ieltsRead_fillInBlanks_wm;
	} else if (sourceType == "Read & Complete") {
		welcomeMessage = ieltsRead_readComplete_wm;
	}
	questions = extractQuestions(sourceData, sourceType);

	console.log(questions);


	//Node 1 -Start Message
	const startMessage = createMessageNode(
		welcomeMessage,
		true,
		nodePositions
	);
	nodeIndex++;
	nodePositions = calculateNodePositions(nodePositions, "adjacent");


	//Node 2 - Start Button
	const startButton = createStartButtonNodeAtPosition(nodePositions);
	nodeIndex++;
	nodePositions = calculateNodePositions(nodePositions, "adjacent");
	flowEdges.push(createEdgeNode(startMessage.id, startButton.id)); //1
	sourceNodes = [startButton];

	if (sourceType == "Read & Complete") {
		const readCompleteButton = createButtonNode(
			questions[0].question,
			questions[0].correctAnswerText,
			[{ text: "continue" }],
			nodePositions);
		nodeIndex++;
		nodePositions = calculateNodePositions(nodePositions, "adjacent");
		flowEdges.push(createEdgeNode(startButton.id, readCompleteButton.id)); //1
		sourceNodes = [readCompleteButton];

		// remove first question
		questions.splice(0, 1);
	}

	//Question- Answer Nodes
	questions.map((question: any, index: number) => {
		let quiz = createQuizNodesAtStartIndex(flowEdges, nodeIndex, nodePositions, sourceNodes, index, question);
		nodeIndex = quiz.nodeIndex;
		nodePositions = quiz.nodePositions;
		sourceNodes = quiz.sourceNodes;
		questionNodes = questionNodes.concat(quiz.nodes);
	});

	// End Button
	const endButton = createEndButtonNodeAtPosition("What next ?",
		"<p> Click option 1 to go back to main menu (IELTS LIST)</p>\n<p> Click option 2 to start next skillbyte(in reading section sequential)</p>",
		["Option 1", "Option 2"],
		nodePositions);
	nodeIndex++;
	nodePositions = calculateNodePositions(nodePositions, "adjacent");


	// connect sourceNodes to End Node
	sourceNodes.map((sourceNode: FlowNode) => {
		if (sourceNode?.interactiveButtonsItems && sourceNode.interactiveButtonsItems.length > 0)
			sourceNode.interactiveButtonsItems[0].nodeResultId = endButton.id;
		flowEdges.push(createEdgeNode(
			`${sourceNode.id}__${(sourceNode?.interactiveButtonsItems && sourceNode.interactiveButtonsItems.length > 0) ? sourceNode.interactiveButtonsItems[0].id : "default"}`, endButton.id));
	});


	// push nodes
	flowNodes.push(startMessage, startButton);
	questionNodes.map((node: any) => {
		flowNodes.push(node);
	});
	flowNodes.push(endButton);



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
