import {
	ActionType,
	type CRO,
	type Operation,
	type ResolveConflictsType,
	SemanticsType,
	type Vertex,
} from "@topology-foundation/object";

import { createHash, Hash } from 'crypto';
import { openAsBlob } from "fs";

interface Letter {
	readonly char: string;
	readonly hash: Hash;
	readonly timestamp: Date;
}

export class Document implements CRO {
    readonly end: Letter;
	operations: string[] = ["addLetter", "RemoveLetter"]; // backtrack das operações ?
    document: Letter[];
    add_operations: Letter[];
    remove_operations: Set<Letter>;
    semanticsType: SemanticsType = SemanticsType.pair;

	// duvidas 
		// preciso de 2 funções de deleção ? uma local e outra pra mergear as alterações da network ?

    constructor() {
        this.end = {
            char: "\0",
            hash: createHash("0"),
            timestamp: new Date(),
        };

        this.document = [this.end];
        this.add_operations = [];
        this.remove_operations = new Set<Letter>();
    }

	addLetter(new_letter: Letter, tail: Letter) {
		this.add_operations.push(new_letter);
	}

	RemoveLetters() { // chama no merge
		for (const want_to_remove_letter of this.remove_operations) {
			this.document = this.document.filter(document_letter => 
				document_letter.hash !== want_to_remove_letter.hash
			);
		}

		this.remove_operations.clear(); // tem como eu apagar sem querer um cara que ta chegando ?
										// acredito que nao tenha como receber novas operações da rede ao mesmo tempo que opera localmente
	}

	resolveConflicts(vertices: Vertex[]): ResolveConflictsType {
		return { action: ActionType.Nop };
	}

	mergeCallback(operations: Operation[]): void { //  aqui implementa o a logica 
		for (const op of operations) {
			if (!op.value) continue;
			switch(op.type) {
				case "mergeRemoveLetters": {

				}

				case "mergeAddLetter": {
					
				}
			}
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
