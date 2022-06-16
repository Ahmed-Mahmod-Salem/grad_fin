const LSeqTree = require("modified-lseq-tree");
class lseq_controller {
    constructor() {
        this.lseq_client = new LSeqTree(50000);
        this.op_history = [];
        this.undo_ptr = -1;
        this.redo_ptr = -1,
            this.undo_count = 0;
    }
    localEdit(operations, options) {
        if (options == "normal_op") {
            for (let operation of operations) {
                operation["data"] = [];
                if (operation.type === "insert") {
                    let insert_index = operation.index;
                    for (let i = 0; i < operation.value.length; i++) {
                        let data = this.lseq_client.insert(operation.value[i], insert_index++);
                        operation.data.push(data);
                    }
                    delete operation.value;
                }
                else if (operation.type === "delete") {
                    let delete_index = operation.index;
                    let num_of_deletions = operation.number;
                    for (let i = 0; i < num_of_deletions; i++) {
                        let data_id = this.lseq_client.remove(delete_index);
                        operation.data.push({ elem: operation.value[i], id: data_id });
                    }
                    delete operation.value
                }

            }

            if (this.op_history.length + 1 > 200)
                this.op_history.shift();

            for (let i = 0; i < this.undo_count; i++)
                this.op_history.pop();

            this.op_history.push(operations);
            this.undo_ptr = this.op_history.length - 1;
            this.undo_count = 0;
            this.redo_ptr = -1;
            console.log(this.op_history);
        }
        else if (options === "undo") {
            if (this.op_history.length) {
                if (this.undo_ptr != -1) {
                    console.log("undo made");
                    let recent_operations = this.op_history[this.undo_ptr];
                    this.undoChanges(recent_operations, operations);
                    this.redo_ptr = this.undo_ptr;
                    this.undo_ptr--;
                    this.undo_count++;

                }
            }
        }
        else if (options === "redo") {
            if (this.op_history.length) {

                if (this.redo_ptr != -1 && this.redo_ptr != this.op_history.length) {
                    let recent_operations = this.op_history[this.redo_ptr];
                    this.redoChanges(recent_operations, operations);
                    this.undo_ptr = this.redo_ptr;
                    this.redo_ptr++;
                    this.undo_count--;


                }


            }

        }
        if (options)
            return operations;


    }
    remoteEdit(received) {
        const start = performance.now();
        if(received.operations)
        {
            for (let operation of received.operations) {
                if (operation.type === "insert") {
                    for (let data_item of operation.data) {
                        this.lseq_client.applyInsert(data_item);
                    }
                }
                else if (operation.type === "delete") {
                    for (let data_item of operation.data) {
                        this.lseq_client.applyRemove(data_item.id);
                    }
                }
        }

        }

        const duration = performance.now() - start;
        console.log(duration);


        if (this.op_history.length + 1 > 200)
            this.op_history.shift();

        for (let i = 0; i < this.undo_count; i++)
            this.op_history.pop();

        this.op_history.push(received.operations);
        this.undo_ptr = this.op_history.length - 1;
        this.undo_count = 0;
        this.redo_ptr = -1;


        return this.lseq_client.traverse();

    }

    undoChanges(recent_operations, operations) {
        for (let operation of recent_operations) {
            if (operation.type === "insert") {

                for (let data_item of operation.data)
                    this.lseq_client.applyRemove(data_item.id);

                operations.push({ type: "delete", data: operation.data });

            }
            else if (operation.type === "delete") {

                let new_data = [];

                for (let data_item of operation.data) {
                    let deleted_text = data_item.elem;
                    for (let char of deleted_text) {
                        new_data.push({ elem: char, id: data_item.id });
                        this.lseq_client.applyInsert(new_data.at(-1));
                    }
                }
                operations.push({ type: "insert", data: new_data });
            }

        }
    }

    redoChanges(recent_operations, operations) {
        for (let operation of recent_operations) {
            if (operation.type === "insert") {

                let new_data = [];

                for (let data_item of operation.data) {
                    let deleted_text = data_item.elem;
                    for (let char of deleted_text) {
                        new_data.push({ elem: char, id: data_item.id });
                        this.lseq_client.applyInsert(new_data.at(-1));
                    }
                }
                operations.push({ type: "insert", data: new_data });

            }
            else if (operation.type === "delete") {
                for (let data_item of operation.data)
                    this.lseq_client.applyRemove(data_item.id);
                operations.push({ type: "delete", data: operation.data });

            }

        }
    }
    resetParameters() {
        this.op_history = [];
        this.undo_ptr = -1;
        this.redo_ptr = -1;
        this.undo_count = 0;
    }

    populateFromFile(data) {
        this.lseq_client = (new LSeqTree(0)).fromJSON(JSON.parse(data));
        return this.lseq_client.traverse();
    }
}

module.exports = lseq_controller;