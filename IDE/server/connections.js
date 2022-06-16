const socketio = require("socket.io");
const RTCMultiConnectionServer = require('rtcmulticonnection-server');


class connectionManager
{
    constructor(server)
    {
         this.io = socketio(server, {
				cors: {
					origin: "*",
					methods: ["GET", "POST"],
				},
			});
    }
    setListeners(uuid,readFile,saveFile)
    {

        this.io.on("connection",(socket)=>{

            RTCMultiConnectionServer.addSocket(socket);
            console.log(`New socket with ID ${socket.id} is connected to the server`)
        
            socket.on("create-new-room",()=>
            {
        
                let room_id = uuid(); //////////////////////////////NOT CURRENT ROOM ID- IT IS THE LAST ROOM ID
        
                this.io.to(socket.id).emit("new-room-is-created",room_id)
                console.log(`Socket with ID ${socket.id} created a room with ID = ${room_id}`)
            })
        
            socket.on("joined-a-room",(socket_id,room_id)=>
            {
                console.log(`Socket with ID ${socket_id} joined room ID ${room_id}`)
                socket.broadcast.emit("new-user-is-connected",socket_id,room_id)
            })
        
        
        
            socket.on("read-file",(file_name)=>
            {
                readFile(file_name,socket.id)
                .then((data)=>
                {
                this.io.to(socket.id).emit("file-is-read",data.toString(),file_name);
                });
                
                
            })
        
            socket.on("edit-made",(file_name,received_operations)=>
            {
            saveFile(file_name,received_operations)
            .then(()=>
            {
                console.log(`"Some change made by ${socket.id} is saved to file name ${file_name}`)
                this.io.to(socket.id).emit("changes-saved");
            });
            
            })
        
            
        })
    }
}

module.exports = connectionManager;