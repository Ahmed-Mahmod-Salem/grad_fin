const http = require("http");
const fs = require("fs");
const connectionManager= require("./connections.js");
const LSeqTree = require("modified-lseq-tree");
const express = require("express");
const app = express();
const server = http.createServer(app);
const PORT = 9999; 
const connection = new connectionManager(server);
const path = require("path");
const {v4:uuidV4}=require("uuid");


app.use(express.static(path.join(__dirname,"../client/dist")))
app.use(express.urlencoded({extended:true}))


let current_trees = [];
let lseq_server = new LSeqTree(50000);
let test_string = "This is File1"
for(let i=0;i<test_string.length;i++)
lseq_server.insert(test_string[i],i);


fs.writeFile("./server/files/file1.txt",JSON.stringify(lseq_server),(err)=>{if(err) console.error(err)})
current_trees.push(lseq_server);

lseq_server = new LSeqTree(50000);


test_string = "This is File2"
for(let i=0;i<test_string.length;i++)
lseq_server.insert(test_string[i],i);

fs.writeFile("./server/files/file2.txt",JSON.stringify(lseq_server),(err)=>{if(err) console.error(err)})
current_trees.push(lseq_server);
console.log(`This is the current directory name:${__dirname}`);
connection.setListeners(uuid,readFile,saveFile);

function uuid()
{
    return uuidV4();
}
async function readFile(file_name)
{
    let filePath = "./server/files/"+file_name+".txt"
    return await fs.promises.readFile(filePath);
}

async function saveFile(file_name,received_operations)
{
    let index=0;
    if(file_name=="file1")
    index = 0;
    else if (file_name=="file2")
    index = 1;

   if(received_operations)
   {

       for(let operation of received_operations)
       {
           if(operation.type === "insert")
           {
               for(let data_item of operation.data)
               {
                   current_trees[index].applyInsert(data_item);
               }
   
           }
           else if (operation.type ==="delete")
           {
               for(let data_item of operation.data)
               {
                   current_trees[index].applyRemove(data_item.id);
               }
           }
   } 
    }
   
    let filePath = "./server/files/"+file_name+".txt";
    fs.writeFileSync(filePath,(JSON.stringify(current_trees[index])))
       
}

server.listen(PORT, ()=>{
    console.log("==============================")
    console.log("Server started operation")
    console.log(`Listening at port number ${PORT}`)
    console.log("http://localhost/")
    console.log("==============================")
})