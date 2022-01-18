const express = require("express");

const app = express();

app.use(express.json());


let port = process.env.PORT || 8000;

app.get('/', function(req, res){
  res.send("hello!");
})

app.listen(port, function(){
  console.log("application started on port", port );
})