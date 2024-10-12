import {
	ActionType,
	type CRO,
	type Operation,
	type ResolveConflictsType,
	SemanticsType,
	type Vertex,
} from "@topology-foundation/object";

import { createHash, Hash } from 'crypto';

interface Letter {
	readonly char: string;
	readonly hash: Hash;
	readonly timestamp: Date;
}

export class Document implements CRO {
    readonly end: Letter;
	operations: string[] = ["STACK DAS OPERAÇÕES"]; // backtrack das operações ?
    document: Letter[];
    add_operations: Letter[];
    remove_operations: Set<Hash>;
    semanticsType: SemanticsType = SemanticsType.pair;

    constructor() {
        this.end = {
            char: "\0",
            hash: createHash("0"),
            timestamp: new Date(),
        };

        this.document = [this.end];
        this.add_operations = [];
        this.remove_operations = new Set<Hash>();
    }

	addLetter(new_letter: Letter) {
		this.add_operations.push(new_letter);
	}

	resolveConflicts(vertices: Vertex[]): ResolveConflictsType {
		return { action: ActionType.Nop };
	}

	mergeCallback(operations: Operation[]): void {
		for (const op of operations) {
			continue;
		}
	}
	
}

export class Chat implements CRO {
	operations: string[] = ["addMessage"];
	semanticsType: SemanticsType = SemanticsType.pair;
	// store messages as strings in the format (timestamp, message, nodeId)
	messages: Set<string>;
	constructor() {
		this.messages = new Set<string>();
	}

	addMessage(timestamp: string, message: string, nodeId: string): void {
		this._addMessage(timestamp, message, nodeId);
	}

	private _addMessage(
		timestamp: string,
		message: string,
		nodeId: string,
	): void {
		this.messages.add(`(${timestamp}, ${message}, ${nodeId})`);
	}

	getMessages(): Set<string> {
		return this.messages;
	}

	resolveConflicts(vertices: Vertex[]): ResolveConflictsType {
		return { action: ActionType.Nop };
	}

	mergeCallback(operations: Operation[]): void {
		for (const op of operations) {
			const args = op.value as string[];
			this._addMessage(args[0], args[1], args[2]);
		}
	}
}
