import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import connectDB from "./config/db";
import v1Routes from "./routes/v1/index";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import notFoundMiddleware from "./middlewares/notFound";
import cookieParser from "cookie-parser";
import logger from "./utils/logger";                          

dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(helmet())

const corsOptions = {
  origin:[ "https://friend-circle-olive.vercel.app" , "http://friend-circle-olive.vercel.app", "http://localhost:5173"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.on('finish', () => {
    logger.logRequest(req, res);
  });

  next();
});

app.use("/api/v1", v1Routes);

if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "..", "..", "client", "dist");
  app.use(express.static(buildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(buildPath, "index.html"));
  });
}

app.get('/', (req, res) => {
  res.send('Server is working!');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const args = process.argv.slice(2);
const portArgIndex = args.indexOf("--port");
const PORT =
  portArgIndex !== -1
    ? Number(args[portArgIndex + 1])
    : Number(process.env.PORT) || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
