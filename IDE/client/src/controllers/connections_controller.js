const RTCMultiConnection = require("rtcmulticonnection");
class connections_controller {
    constructor(PORT) {

        if (!PORT){
            console.log("port is undefined, trying on port 9999 probably not working");
            PORT=9999;
        }
        this.connection = new RTCMultiConnection();
        
        this.connection.socketURL = `http://localhost:${PORT}/`;
        this.connection.session = { data: true };
        this.connection.enableLogs = true;

    }
    connect(roomId) {
        this.currentRoomId = roomId;
        this.connection.connectSocket(() => {
            this.connection.getSocket((socket) => {
                this.current_socket = socket;
                this.currentSocketId = socket.id;
                this.connection.openOrJoin(this.currentRoomId, () => {
                    this.connection.socket.emit("joined-a-room", (this.currentSocketId), this.currentRoomId);
                    this.listenForEvents(this.connection, this.current_socket)
                })

            })

        })

    }
    listenForEvents(connection, socket) {
        let message = "message-from-server"
        socket.on("new-user-is-connected", (server_socketId, server_roomId) => {
            if (this.currentRoomId == server_roomId)

                document.dispatchEvent(new CustomEvent(message, {
                    detail:
                    {
                        type: "new-user-joined",
                        userId: server_socketId,
                        roomId: server_roomId,
                    }
                }))

        })

        socket.on("file-is-read", (received_data) => {
            document.dispatchEvent(new CustomEvent(message, {
                detail: {
                    type: "file-is-read",
                    received_data: received_data
                }
            }))
        })


        socket.on("changes-saved", () => {
            document.dispatchEvent(new CustomEvent(message, {
                detail:
                {
                    type: "changes-saved"
                }
            }))
        })

        connection.onmessage = (event) => {
            document.dispatchEvent(new CustomEvent("data-from-peers", {
                detail: { data: event.data }
            }))

        }
    }
    broadcast(file_name, operations) {
        if (this.connection) {

            this.connection.send({ file_name, operations }); //Sending the edit details to all peers.
            this.connection.socket.emit("edit-made", file_name, operations); //Sending the change details to the server.
        }

    }
    emit(message, data) {
        if (this.connection) {
            switch (message) {
                case "read-file":
                    this.connection.socket.emit("read-file", data);
                    break;

                default:
                    break;
            }
        }
    }

}

module.exports = connections_controller;