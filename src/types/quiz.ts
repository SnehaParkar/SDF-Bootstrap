export type QuizType = {
	question: string;
	options: object;
	correctOption: string;
	correctAnswer: string;
	explanation: string;
	wrongAnswerExplanation: string;
};

export type IELTSQuizType = {
	question: string;
	options: Record<string, string>;
	correctOption: string;
}


