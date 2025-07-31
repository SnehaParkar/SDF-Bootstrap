export type QuizData = {
	question: string;
	options: object;
	correctOption: string;
	correctAnswer: string;
	wrongAnswers: object;
	explanation: string;
	wrongAnswerExplanation: string;
};

export type ExplanationBlock = {
	explanationTitle: string;
	explanation: string;
};
