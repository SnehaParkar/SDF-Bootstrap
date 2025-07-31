import { QuizData, ExplanationBlock } from "@/types/quiz";
export function extractQuizData(text: string): QuizData | null {
	//const questionMatch = text.match(/📘 \s*(.*?)\n/i);
	//const optionMatches = [...text.matchAll(/►\s*([A-C])\)\s*([^\n]+)/g)];
	// const correctMatch = text.match(/✅\s*Correct Answer:\s*([A-C])\)\s*([^\n]+)/i);
	// const explanationMatch = text.match(/📐.*?:\s*\n([\s\S]*?)(?=\n❌|$)/);
	// const wrongMatch = text.match(/❌\s*(.*?)\n\s*(.*)/);

	const questionMatch = text.match(/📘.*?\n(.*?)(?=Choose:)/s);
	const question = questionMatch ? questionMatch[0] : " "; //? [1].replace(/\n/g, " ").trim() : "";


	// Extract options
	const optionRegex = /►\s*([A-Z])\)\s*(.*)/g;
	const options: Record<string, string> = {};
	let optionMatch;
	while ((optionMatch = optionRegex.exec(text)) !== null) {
		options[optionMatch[1]] = optionMatch[2].trim();
	}

	// Correct Answer
	const correctMatch = text.match(/✅\s*Correct Answer:\s*([A-Z])\)?\s*(.*)?/);
	const correctOption = correctMatch?.[1] ?? "";
	const correctAnswer = correctMatch?.[0]?.trim() || options[correctOption] || "";

	// Wrong Answers
	const wrongAnswers: Record<string, string> = {};
	Object.entries(options).forEach(([key, val]) => {
		if (key !== correctOption) wrongAnswers[key] = val;
	});


	// Correct Explanation (up to ❌)
	const explanationMatch = text.match(/✅\s*Correct Answer:[\s\S]*?(?=❌|⚠️|$)/);
	const explanation = explanationMatch
		? explanationMatch[0].replace(/✅\s*Correct Answer:\s*[A-Z]?\)?/, "").trim()
		: "";

	// Wrong Answer Explanation
	//const wrongExplanationMatch = text.match(/❌\s*If you chose .*?Why wrong:[\s\S]*?(?=⚠️|$)/);
	const wrongExplanationMatch = text.match(/❌([\s\S]*)/);

	const wrongAnswerExplanation = wrongExplanationMatch
		? wrongExplanationMatch[0].trim()
		: "";

	// if (!questionMatch || !correctMatch || options.length === 0) {
	// 	return null;
	// }

	//const question = questionMatch[1];//.trim();

	//const options = optionMatches.map((match) => `${match[1]}) ${match[2].trim()}`);
	//const correctAnswer = `${correctMatch[1]}) ${correctMatch[2].trim()}`;
	// const explanation = explanationMatch ? explanationMatch[1].trim() : "";
	// const wrongAnswerFeedback = wrongMatch
	// ?`${wrongMatch[1]/*.trim()*/} ${wrongMatch[2]/*.trim()*/}`
	// : "";

	return {
		question,
		options,
		correctOption,
		correctAnswer,
		wrongAnswers,
		explanation,
		wrongAnswerExplanation,
	};
}

