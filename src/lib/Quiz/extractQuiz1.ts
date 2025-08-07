import { QuizType } from "@/types/quiz";
export function extractQuizData(text: string): QuizType | null {

	// Extract question
	// Regex to match blocks starting with 📘, 📘Q, Q:, etc.
	//const questionRegex = /(?:📘Q[:\s]?|📘[:\s]?|Q[:\s]?)([\s\S]*?)(?=(?:📘|Q:|$))/g;

	const questionMatch = text.match(/📘.*?\n(.*?)(?=Choose)/s);
	const question = questionMatch ? questionMatch[0] : " "; //? [1].replace(/\n/g, " ").trim() : "";


	// Extract options
	const optionRegex = /►\s*([A-Z])\)\s*(.*)/g; //eg: ► A) 9 m

	// const optionRegex = /([A-Z])\)\s*([^\n]+)/g; // A) 9 m

	// const optionRegex = /^\s*(►\s*)?[A-Da-d]\)/; //eg: ► A) 9 m or A) 9 m
	const options: Record<string, string> = {};
	let optionMatch;
	while ((optionMatch = optionRegex.exec(text)) !== null) {
		console.log(optionMatch);
		options[optionMatch[1]] = optionMatch[2].trim();
	}
	console.log(options);
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
	const wrongExplanationMatch = text.match(/❌([\s\S]*)/);

	const wrongAnswerExplanation = wrongExplanationMatch
		? wrongExplanationMatch[0].trim()
		: "";

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

