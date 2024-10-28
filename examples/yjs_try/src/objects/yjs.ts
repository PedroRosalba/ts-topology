import {
	ActionType,
	type CRO,
	type Operation,
	type ResolveConflictsType,
	SemanticsType,
	type Vertex,
} from "@topology-foundation/object";

import * as Y from 'yjs';
import  Delta  from 'quill-delta';
import Quill from "quill";

export class TextEditor implements CRO {
	operations: string[] = ["delete", "insert", "retain", "rollback"];
	semanticsType: SemanticsType = SemanticsType.pair;
	// store messages as strings in the format (timestamp, message, nodeId)
	Doc: Y.Doc;
	ytext: Y.Text;
	// retain: number;

	constructor() {
		this.Doc = new Y.Doc();
		this.ytext = this.Doc.getText('text-editor');
		// this.retain = 0;
	}

	addMessage(delta: Delta, nodeId: string): void {
		this._addMessage(delta, nodeId);
	}

	private _addMessage(
		delta: Delta,
		nodeId: string,
	): void {
		// this.ytext.applyDelta
	}

	getStringText(): String{ //T ´
		return this.ytext.toString();
	}

	getDeltaText(): Delta{
		return this.ytext.toDelta();
	}

	resolveConflicts(vertices: Vertex[]): ResolveConflictsType {
		return { action: ActionType.Nop };
	}

	mergeCallback(operations: Operation[]): void {
		for (const op of operations) {
			// if (!op.value) continue # tratar nop
			const delta = op.value;
			this.ytext.applyDelta(delta);

			// switch(op.type) {
			// 	case "insert": {
			// 		const text = op.value;
			// 		this.ytext.insert(this.retain, text);
			// 		break;
			// 	}
			// 	case "delete": {
			// 		const numberDeletedChar = op.value;
			// 		this.ytext.delete(this.retain, numberDeletedChar);
			// 		break;
			// 	}
			// 	case "retain": {
			// 		// acrecentar rich text posteiormente no op value
			// 		const retain = op.value;
			// 		this.retain = retain;
			// 		break;
			// 	}
			// 	case "rollback": {
			// 		// todo
			// 	}
			// }
		}
	}
}