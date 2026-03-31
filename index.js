const express = require('express')
const app = express()
port = process.env.PORT || 80
app.get("/", (request,response)=>{
    response.send("Hello, world.  How are you, world!")
})
app.listen(port, ()=>{console.log("Server is running" + port)});