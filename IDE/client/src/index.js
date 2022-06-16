const Connections_Controller = require("controllers/connections_controller.js");
const Interface_Controller = require("controllers/interface_controller.js");
const Editor_Controller = require("controllers/editor_controller.js");
const LSEQ_Controller = require("controllers/lseq_controller");

const PORT =9999;
let editor = new Editor_Controller();
let connections = new Connections_Controller(PORT);
let LSEQ = new LSEQ_Controller();
let interfaceREnamed = new Interface_Controller(); //Mostly useless atm


let client = document; //Nothing fancy, just a different name for the DOM object.
let currentRoomId = "e4047d1f-be6e-480d-b869-1b77faf24169"; //We shall obtain this ID in another way.

connections.connect(currentRoomId);

client.addEventListener("message-from-server", (m) => {
    message = m.detail; //Nothing fancy; just saving this in a variable so it is easier to deal with.
    switch (message.type) {

        case "new-user-joined":
            interfaceREnamed.displayOnNewUser(message.userId, message.roomId)
            break;
        case "file-is-read":
            let text_from_lseq = LSEQ.populateFromFile(message.received_data);
            editor.populateFromLSEQ(text_from_lseq);
            break;
        case "changes-saved":
            console.log("Your changes are saved");
            break;
        default:
            break;
    }
})


client.addEventListener("data-from-peers", (m) => {
    message = m.detail.data;
    if (current_file_name == message.file_name) {
        let text_from_lseq = LSEQ.remoteEdit(message);
        editor.remoteEdit(text_from_lseq);
        console.log("data from peers", m.detail.data);
    }
})


client.addEventListener("editor-processed-some-changes", (m) => {
    message = m.detail;
    operations = LSEQ.localEdit(message.operations, message.options);
    if (connections && operations ) connections.broadcast(current_file_name, operations);
})


let current_file_name = "";
function File1() {

    if (connections && current_file_name != "file1") {
        current_file_name = "file1";
        connections.emit("read-file", current_file_name) //should emit file.name extension later on
        editor.permitEdit();
        LSEQ.resetParameters();
    }
}

function File2() {
    if (connections && current_file_name != "file2") {
        current_file_name = "file2";
        connections.emit("read-file", current_file_name) //should emit file.name extension later on
        editor.permitEdit();
        LSEQ.resetParameters();
    }
}


// Only adds an event listener to buttons from front-end
interfaceREnamed.assignButtonToFunction("#File2", File2);
interfaceREnamed.assignButtonToFunction("#File1", File1)
