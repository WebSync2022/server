const express = require('express');
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

app.get('/', (req, res) => {
  res.send('Relay server for WebSync');
});
let counter = 0;
io.on("connection", (socket)=>{
    counter ++;
    console.log(`${counter} users connected`);
    socket.on("join session", (sessionId, username)=>{
        console.log(`user joined session ${sessionId}`);
        socket.join(sessionId); // add socket to session
        socket.to(sessionId).emit("user joined", `${username} joined the session`);
    });

    socket.on("sync signal", (sessionId, syncObject)=>{
        // syncObject is a generic javascript object containing the sync signal
        console.log("signal received");
        socket.to(sessionId).emit("signal", syncObject);
    })


    socket.on("disconnect", ()=>{
        console.log("user disconnected");
        counter --;
        console.log(`${counter} users connected`);
    });    

})



// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});