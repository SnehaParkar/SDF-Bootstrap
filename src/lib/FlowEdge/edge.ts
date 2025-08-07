
import { v4 as uuidv4 } from "uuid";
import { FlowEdge } from "@/types/flowTypes";

const generateEdgeId = (source: string, target: string) => `reactflow__edge-${source}-${target}`;

export const createEdgeNode = (sourceNodeId: string, targetNodeId: string): FlowEdge => ({
	id: generateEdgeId(sourceNodeId, targetNodeId),
	sourceNodeId: sourceNodeId,
	targetNodeId: targetNodeId
});


