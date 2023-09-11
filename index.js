const express = require('express');
const dotenv = require('dotenv');
dotenv.config({path:'./config/config.env'})
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('./config/db.js')
const { userRoute } = require('./Routes/userRoute');
const { productRoute } = require('./Routes/productRoute');

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials:true, origin: 'https://provoke-front.vercel.app'}))


app.get('/', (req,res)=>{
    res.send('Welcome to Proof of Concept')
})

app.use('/user',userRoute)
app.use('/product',productRoute)


app.listen(port,()=>{
    console.log(`Server is running at ${port}`)
})