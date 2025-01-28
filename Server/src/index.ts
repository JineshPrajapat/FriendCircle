import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import connectDB from "./config/db";
import v1Routes from "./routes/v1/index";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import notFoundMiddleware from "./middlewares/notFound";
import logger from "./utils/logger";    

dotenv.config();
connectDB();


const app = express();
const server = http.createServer(app);

const allowedOrigins = ["http://localhost:3000", "https://friend-connections.vercel.app"];

app.use(cors({origin:allowedOrigins, credentials:true}));
app.use(helmet())
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


app.use((req, res, next) => {
    res.on('finish', () => {
      logger.logRequest(req, res);
    });
  
    next();
  });

app.use("/api/v1", v1Routes);

app.get('/', (req, res) => {
    res.send('Server is working!');
  });

const PORT =process.env.PORT ||  4000;

server.listen(PORT, ()=>{
    console.log(`Server is running at ${PORT}`);
});