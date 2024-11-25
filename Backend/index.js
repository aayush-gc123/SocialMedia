
import express , {urlencoded} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import messageRoute from "./routes/message.route.js"
import connectDB from "./utils/database.js";
dotenv.config({});

const app = express()
const port = process.env.PORT


// middlewares
app.use(express.json())
app.use(cookieParser()) // store tokens in cookie
app.use(urlencoded({ extended: true }));


const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}

 app.use(cors(corsOptions))
 app.use('/api/v1/user' , userRoute)
 app.use('/api/v1/post' , postRoute)
 app.use('/api/v1/message' , messageRoute)
 
app.get('/', (_, res) => {
  res.send('Hello World!');

})

app.listen(port, () => {
  connectDB()
  console.log(`Example app listening on port ${port}`)
})