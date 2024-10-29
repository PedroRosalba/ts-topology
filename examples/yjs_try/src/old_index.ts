import { TopologyNode } from "@topology-foundation/node";
import type { TopologyObject } from "@topology-foundation/object";
import { TextEditor } from "./objects/yjs";
import * as Y from 'yjs';
// import { QuillBinding } from 'y-quill';
import Quill from 'quill';
// import QuillCursors from 'quill-cursors';

const node = new TopologyNode();
// CRO = Conflict-free Replicated Object
let topologyObject: TopologyObject;
let texteditorCRO: TextEditor;
let peers: string[] = [];
let discoveryPeers: string[] = [];
let objectPeers: string[] = [];

//agr na funcao render, tenho que dar handle em updatar o quillbinding

async function createConnectHandlers() {
	node.addCustomGroupMessageHandler(topologyObject.id, (e) => {
		// on create/connect
		if (topologyObject)
			objectPeers = node.networkNode.getGroupPeers(topologyObject.id);
		// render();
	});

	node.objectStore.subscribe(topologyObject.id, (_, _obj) => {
		// render();
	});
}

async function main(){
    await node.start();
    // render();

	node.addCustomGroupMessageHandler("", (e) => {
		peers = node.networkNode.getAllPeers();
		discoveryPeers = node.networkNode.getGroupPeers("topology::discovery");
		// render();
	});

	const button_create = <HTMLButtonElement>(
		document.getElementById("createRoom")
	);
	button_create.addEventListener("click", async () => {
		topologyObject = await node.createObject(new TextEditor());
		texteditorCRO = topologyObject.cro as TextEditor;

        const editorContainer = document.createElement('div');
        editorContainer.setAttribute('id', 'editor');     
        const editor = new Quill(editorContainer, {
            modules: {
              cursors: true,
              toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                ['image', 'code-block']
              ],
              history: {
                userOnly: true
              }
            },
            placeholder: 'Start collaborating...',
            theme: 'snow' // or 'bubble'
          });

        // const binding = new QuillBinding(
        //     texteditorCRO.ytext,
        //     editor
        // );

		createConnectHandlers();
		// render();
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
		texteditorCRO = topologyObject.cro as TextEditor;

        const editorContainer = document.createElement('div');
        editorContainer.setAttribute('id', 'editor');     
        const editor = new Quill(editorContainer, {
            modules: {
              cursors: true,
              toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                ['image', 'code-block']
              ],
              history: {
                userOnly: true
              }
            },
            placeholder: 'Start collaborating...',
            theme: 'snow' // or 'bubble'
          });
        const binding = new QuillBinding(
            texteditorCRO.ytext,
            editor
        );

		createConnectHandlers();
		// render();
	});

    //no caso aqui nao tem send pq eh editor de texto
}