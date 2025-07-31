import { QuizData, ExplanationBlock } from "@/types/quiz";

export function extractExplanationBlock(text: string): ExplanationBlock {
	const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line !== "");

	const explanationTitle = lines[0] || "";
	const explanation = lines.slice(1).join("\n");

	return {
		explanationTitle,
		explanation
	};
}