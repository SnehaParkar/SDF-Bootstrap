// components/Formatter/JsonOutput.tsx
import { FlowTemplate } from "@/types/flowTypes";

type JsonOutputProps = {
	jsonOutput: FlowTemplate;
};

export default function JsonOutput({ jsonOutput }: JsonOutputProps) {
	return (
		<div className="sb-output-data-content">
			<pre className="overflow-auto max-h-96 ">{JSON.stringify(jsonOutput, null, 2)}</pre>
		</div>
	);
}
