/// This class may not be very useful at the moment

class interface_controller {
  constructor() {
  
    function copyRoomId() {
      //navigator.clipboard.writeText(document.getElementById("roomId").innerHTML);
    }
    function pasteRoomId() {
      //navigator.clipboard.readText().then((data) => { document.getElementById("otherRoomId").innerHTML = data });
    }
  }



  showCopyButton() {

  }
  getRoomId() {
  }
  assignButtonToFunction(button_id, method) {
    document.querySelector(button_id).addEventListener("click", method);
  }



  displayOnJoin(currentSocketId, currentRoomId) {
    console.log("You succsefully joined the room! Mabrook")
    console.log("Your socket with ID " + currentSocketId + " joined room with ID " + currentRoomId)
  }

  displayOnNewUser(socketId, roomId) {
    console.log("Socket with ID " + socketId + " joined current room with ID " + roomId)
  }


}

module.exports = interface_controller;