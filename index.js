const express = require("express");
const connection = require("./source/db");
require('dotenv').config();


const app = express();
let userroutes = require('./routes/users');


app.use(express.json());
app.use(userroutes)


let port = process.env.PORT || 8000;

app.get('/', function(req, res){
  res.send("hello!" + process.env.name );
})
app.get('/user', )

app.listen(port, function(){
  console.log("application started on port", port );
})