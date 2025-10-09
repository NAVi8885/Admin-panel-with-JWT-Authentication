require('dotenv').config();
const express = require('express');
const connectDb = require('./config/dbConnect');
const router = require("./routes/userRoute")
const app = express()


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
connectDb()
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'ejs')

app.use('/', router)

   
 
app.listen(3999, () => console.log("Server started running"))