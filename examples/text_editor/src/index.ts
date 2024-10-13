import { TopologyNode } from "@topology-foundation/node";
import type { TopologyObject } from "@topology-foundation/object";
import { Chat } from "./objects/text-editor";
import { TextEditor } from "./objects/text-editor";
import { text } from "stream/consumers";
import { Letter } from "./objects/text-editor";
import { createHash, Hash } from 'crypto';


const node = new TopologyNode();
// CRO = Conflict-free Replicated Object
let topologyObject: TopologyObject;
let textEditorCRO: TextEditor;
let peers: string[] = [];
let discoveryPeers: string[] = [];
let objectPeers: string[] = [];

const render = () => {
	if (topologyObject)
		(<HTMLButtonElement>document.getElementById("chatId")).innerText =
			topologyObject.id;
	const element_peerId = <HTMLDivElement>document.getElementById("peerId");
	element_peerId.innerHTML = node.networkNode.peerId;

	const element_peers = <HTMLDivElement>document.getElementById("peers");
	element_peers.innerHTML = `[${peers.join(", ")}]`;

	const element_discoveryPeers = <HTMLDivElement>(
		document.getElementById("discoveryPeers")
	);
	element_discoveryPeers.innerHTML = `[${discoveryPeers.join(", ")}]`;

	const element_objectPeers = <HTMLDivElement>(
		document.getElementById("objectPeers")
	);
	element_objectPeers.innerHTML = `[${objectPeers.join(", ")}]`;

	if (!textEditorCRO) return;
	const textEditor = textEditorCRO.getText();

	const element_chat = <HTMLDivElement>document.getElementById("chat");

	element_chat.innerHTML = "";

	if (textEditor.length === 0) {
		const div = document.createElement("div");
		div.innerHTML = "No messages yet";
		div.style.padding = "10px";
		element_chat.appendChild(div);
		return;
	}
	for (const letter of [...textEditor].sort()) {
		const div = document.createElement("div");
		div.innerHTML = letter.char;
		div.style.padding = "10px";
		element_chat.appendChild(div);
	}
};

async function writeLetter(letter: Letter, tail: Letter) {
	const timestamp: string = Date.now().toString();
	
	if (!textEditorCRO) {
		console.error("Text Editor CRO not initialized");
		alert("Please create or join a chat room first");
		return;
	}

	textEditorCRO.addLetter(letter, tail, timestamp);
	render();
}

async function createConnectHandlers() {
	node.addCustomGroupMessageHandler(topologyObject.id, (e) => {
		// on create/connect
		if (topologyObject)
			objectPeers = node.networkNode.getGroupPeers(topologyObject.id);
		render();
	});

	node.objectStore.subscribe(topologyObject.id, (_, _obj) => {
		render();
	});
}

async function main() {
	await node.start();
	render();

	// generic message handler
	node.addCustomGroupMessageHandler("", (e) => {
		peers = node.networkNode.getAllPeers();
		discoveryPeers = node.networkNode.getGroupPeers("topology::discovery");
		render();
	});

	const button_create = <HTMLButtonElement>(
		document.getElementById("create document")
	);

	button_create.addEventListener("click", async () => {
		topologyObject = await node.createObject(new TextEditor());
		textEditorCRO = topologyObject.cro as TextEditor;
		createConnectHandlers();
		render();
	});

	const button_connect = <HTMLButtonElement>document.getElementById("joinRoom");
	button_connect.addEventListener("click", async () => {
		const input: HTMLInputElement = <HTMLInputElement>(
			document.getElementById("roomInput")
		);
		const objectId = input.value;
		if (!objectId) {
			alert("Please enter a room id");
			return;
		}

		topologyObject = await node.createObject(
			new TextEditor(),
			objectId,
			undefined,
			true,
		);
		textEditorCRO = topologyObject.cro as TextEditor;
		createConnectHandlers();
		render();
	});

	// const button_send = <HTMLButtonElement>document.getElementById("writeText");
	// button_send.addEventListener("click", async () => {
	// 	const input: HTMLInputElement = <HTMLInputElement>(
	// 		document.getElementById("messageInput")
	// 	);
	// 	const message: string = input.value;
	// 	input.value = "";
	// 	if (!message) {
	// 		console.error("Tried sending an empty message");
	// 		alert("Please enter a message");
	// 		return;
	// 	}
	// 	await sendMessage(message);
	// 	const element_chat = <HTMLDivElement>document.getElementById("chat");
	// 	element_chat.scrollTop = element_chat.scrollHeight;
	// });

	//REVISAR ESSA PARTE
	
	const editor = <HTMLTextAreaElement>document.getElementById("editor"); // Cast to HTMLTextAreaElement
	let typingTimer: NodeJS.Timeout; // Timer identifier
	
	editor.addEventListener("input", () => {
		const timestamp = Date.now().toString();
		clearTimeout(typingTimer); // Clear the timer on each keystroke
		const message: string = editor.value.trim(); // Get the current value of the textarea
		const letter = {
			char: message,
			hash: createHash("0"),
			timestamp: timestamp, 
			insertion: [],
		};
		const tail = {
			char: message, //consertar essa porra aqui futuramente
			hash: createHash("0"),
			timestamp: timestamp,
			insertion: [],
		};
		// Set a timer to send the message after a short delay (e.g., 1 second)
		typingTimer = setTimeout(async () => {
			if (message) {
				await writeLetter(letter,tail);
				const element_chat = <HTMLDivElement>document.getElementById("chat"); // Get the chat element
				element_chat.scrollTop = element_chat.scrollHeight; // Scroll to the bottom
			}
		}, 1000); // Adjust the delay as needed
	});
	
	
}

main();
