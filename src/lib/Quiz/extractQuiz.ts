import { QuizType } from "@/types/quiz";
import { start } from "repl";
export function extractQuizData(input: string): QuizType | null {
	const lines = input.split(/\r?\n/);
	let questionLines: string[] = [];
	let optionLines: string[] = [];
	let correctAnswer = '';
	let correctOption = '';
	let correctExplanationLines: string[] = [];
	let wrongExplanationLines: string[] = [];

	let isInQuestion = false;
	let isInCorrectExplanation = false;
	let isInWrongExplanation = false;
	let isAfterOptions = false;

	const questionRegex = /^(?:📘Q:|📘Q :|📘Q|📘|Q:|Q)/;
	const optionRegex = /^([A-Z]\)|►\s* ([A-Z])\)|►([A-Z])\))/
	const startOptionRegex = /^(A\)|► A\)|►A\)|(Choose[: ]))/;
	const correctAnswerRegex = /^(✅)|(✅ Correct Answer[: ]*([A-Z]))|(Correct Answer[: ]*([A-Z]))/;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();

		// Start of question
		if (questionRegex.test(line)) {
			isInQuestion = true;
		}

		// Detect start of optionLines
		if (startOptionRegex.test(line)) {
			isInQuestion = false;
			isAfterOptions = true;
		}

		if (isInQuestion) {
			questionLines.push(line.replace(questionRegex, '').trim());
		} else if (optionRegex.test(line)) {
			optionLines.push(line);
		} else if (correctAnswerRegex.test(line)) {
			const match = line.match(/Correct Answer[: ]*([A-Z])/);
			if (match) {
				correctAnswer = match[1];
				correctOption = match[0].trim();
			}
			isInCorrectExplanation = true;
		} else if (/^[❌⚠️]/.test(line)) {
			isInCorrectExplanation = false;
			isInWrongExplanation = true;
		}

		if (isInCorrectExplanation && !/^✅/.test(line)) {
			correctExplanationLines.push(line);
		}
		if (isInWrongExplanation) {
			wrongExplanationLines.push(line);
		}
	}

	const options: Record<string, string> = {};
	optionLines.forEach((option) => {
		const match = option.match(/^(?:►\s*)?([A-D])\)\s*(.*)/);
		if (match) {
			options[match[1]] = match[2].trim();
		}
	})

	return {
		question: questionLines.join(' ').trim(),
		options,
		correctOption,
		correctAnswer,
		explanation: correctExplanationLines.join(' ').trim(),
		wrongAnswerExplanation: wrongExplanationLines.join(' ').trim(),
	};
}

