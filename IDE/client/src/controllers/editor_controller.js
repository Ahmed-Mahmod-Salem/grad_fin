class editor_controller {


    constructor() {
        this.editor = CodeMirror.fromTextArea(document.getElementById("editor"),
            {
                mode: "text/x-c++src",
                theme: "vscode-dark",
                lineNumbers: true,
                lineSeparator: "\n",
                readOnly: false,     //It is read only to allow edits using only program commands. 
                historyEventDelay: 1 //Interval between edits that would register an input to the 

            })
        this.listenForChanges(this.editor);

    }

    get instance() {
        return this.editor;
    }

    listenForChanges(editor) {
        editor.on("beforeChange", (__, changeObject) => {
            if ((this.isLocalChange(changeObject))) {
                let [operations, options] = this.localEdit(changeObject);

                document.dispatchEvent(new CustomEvent("editor-processed-some-changes", { detail: { operations, options, } }))
            }

        })
    }
    isLocalChange(changeObject) {
        if (changeObject.origin != "setValue" && (changeObject.origin) != undefined)// I might change this line later
            return true;
    }
    localEdit(changeObject) {
        console.log(changeObject);
        this.operations = [];
        this.options = "";
        this.options = "normal_op";
        let value = "", type = "";
        let current_cursor_index = this.getCursorI();
        let selection_made = false;
        let select_start_index = this.editor.indexFromPos(changeObject.from);
        let select_end_index = this.editor.indexFromPos(changeObject.to);
        let num_selected_chars = Math.abs(select_end_index - select_start_index);
        if (num_selected_chars) {
            console.log("A selection operation is made");
            console.log(`Starting position ${select_start_index}`);
            console.log(`Ending positiong ${select_end_index}`);
            console.log(`Number of selected chars ${num_selected_chars}`);
            selection_made = true;
        }
        else if (changeObject.from.sticky == "after" || changeObject.from.sticky == "before")
            selection_made = true;


        if (changeObject.origin === "+delete" || changeObject.origin === "cut") {
            if (!(changeObject.from.hitSide) && !(changeObject.to.hitSide)) {
                type = "delete";
                if (selection_made)
                    this.removeRange(select_start_index, num_selected_chars);
                else
                    this.removeRange(--current_cursor_index, num_selected_chars);
            }
            else
                this.options = "";

        }
        else if (changeObject.origin === "+input") {
            if (selection_made) {

                this.removeRange(select_start_index, num_selected_chars);
                this.editor.setCursor(this.getPosFromIndex(select_start_index));
                current_cursor_index = this.getCursorI();
            }

            type = "insert";

            if (changeObject.text.length == 2 && changeObject.text[0] === "")
                value = "\n";
            else if (changeObject.text == "\t")
                value = "\t";
            else value = changeObject.text[0];
            for (let i = 0, count = current_cursor_index; i < value.length; i++, count++) {
                this.operations.push({ type, value, index: count, number: 1 });
            }

        }
         else if (changeObject.origin === "paste") {

            if (selection_made)
                this.removeRange(select_start_index, num_selected_chars);

            type = "insert";
            let count = select_start_index;

            for (let i = 0; i < changeObject.text.length; i++) {


                this.operations.push({ type, value: changeObject.text[i], index: count, number: changeObject.text[i].length });
                count = count + changeObject.text[i].length;

                if (changeObject.text.length > 0 && (i + 1 != changeObject.text.length)) {
                    this.operations.push({ type, value: "\n", index: count, number: 1 });
                    count++;
                }
            }
        }
        else if (changeObject.origin === "drag")
        {
            this.removeRange(select_start_index,num_selected_chars)

        }
        else if (changeObject.origin === "undo") {
            this.options = "undo";
        }
        else if (changeObject.origin === "redo") {
            this.options = "redo";
        }
        return [this.operations, this.options];






    }



    removeRange(index, number) {

        let value = this.editor.getRange(this.getPosFromIndex(index), this.getPosFromIndex(index + number));
        this.operations.push({ type: "delete", value, index, number });
        
    }
    populateFromLSEQ(text_from_lseq) {
        this.changeText(text_from_lseq);
        this.clearHistory();
    }
    remoteEdit(text_from_lseq) {
        let old_cursor_pos = this.getCursor();
        this.changeText(text_from_lseq);
        this.setCursor(old_cursor_pos);
    }
    permitEdit() {
        this.editor.setOption("readOnly", false)
    }
    changeText(text) {
        this.editor.setValue(text)
    }
    getCursor() {
        return this.editor.getCursor();
    }
    setCursor(cursor_pos) {
        this.editor.setCursor(cursor_pos);
    }
    getPosFromIndex(index) {
        return this.editor.posFromIndex(index)
    }
    getIndexFromPos(pos) {
        return this.editor.indexFromPos(pos);
    }
    addCharsToIndex(value, index) {
        this.editor.replaceRange(value, this.editor.posFromIndex(index));
    }
    clearHistory() {
        this.editor.clearHistory();
    }
    getCursorI() {
        return this.editor.indexFromPos(this.editor.getCursor());
    }

}

module.exports = editor_controller;
