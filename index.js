const express = require('express');
const { resolve } = require('path');
const mongoose=require('mongoose')
require('dotenv').config();
const URL=process.env.URL
const user= require("./schema")

const app = express();
const port = 3010;

app.use(express.json());
app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});
app.post("/api/users",(req,res)=>{
  try{
    const {name, email,password}=req.body;
    const payload={name , email, password}
    const userdata=new user({
    name,email,password
    })
    userdata.save();
    res.status(200).json({message:"User created successfully"})
  }catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: 'Validation error', details: error.errors });
    } else if (error.code === 11000) { // Handle unique key error for email
      res.status(400).json({ message: 'Validation error: Email already exists' });
    } else {
      res.status(500).json({ message: 'Server error', error });
    }
}})

app.listen(port, async() => {
  try{
    await mongoose.connect(URL)
    console.log("Connected to mongoDB");
  }catch(err){
    console.log("Error",err);
  }
  console.log(`Example app listening at http://localhost:${port}`);
});
