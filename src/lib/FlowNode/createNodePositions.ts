
import { positionConstants } from "../constants";
import { FlowNodePosition } from "@/types/flowTypes";

export const calculateNodePositions = (currentPositions: FlowNodePosition, nodeType: string): FlowNodePosition => {
	let newPosX = parseInt(currentPositions.posX);
	let newPosY = parseInt(currentPositions.posY);

	if (nodeType === "adjacent") {
		newPosX += positionConstants.gapX;
	} else if (nodeType == "question") {
		newPosX += positionConstants.gapX;
		newPosY = positionConstants.startY;
	} else if (nodeType == "questFixedMessage") {
		newPosY += positionConstants.gapY;
	} else if (nodeType == "correctAnswer") {
		newPosX += positionConstants.gapX;
		newPosY = positionConstants.topY;
	} else if (nodeType == "correctAnsFixedMessage") {
		newPosY += positionConstants.gapY;
	} else if (nodeType == "wrongAnswer") {
		newPosY = positionConstants.bottomY;
	} else if (nodeType == "wrongAnsFixedMessage") {
		newPosY += positionConstants.gapY;
	}

	return {
		"posX": newPosX.toString(),
		"posY": newPosY.toString()
	}
}
