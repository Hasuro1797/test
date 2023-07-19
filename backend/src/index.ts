import express, { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import informationRouter from './routes/information.route'
import cors from 'cors'
import db from './db/connection'
import morgan from 'morgan'
import { AppError } from './utils'
import path from 'path'
dotenv.config()

const app = express()
const dbConnection = async () => {
  try {
    await db.authenticate();
    await db.sync({ force: false })
    console.log('Connection has been established successfully.');
  } catch (error: any) {
    throw new Error(error)
  }
}
dbConnection()
const PORT: string = process.env.PORT ? process.env.PORT : '3000'
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/information', informationRouter)

const __dir = path.resolve();
app.use(express.static(path.join(__dir, "/front/dist")));

app.get("*", (_req: Request, res: Response) =>
  res.sendFile(path.join(__dir, "/front/dist/index.html"))
);
console.log("el path static es:", path.join(__dir, "/front/dist"))
console.log("el path fronts es:", path.join(__dir, "/front/dist/index.html"))
app.use((err: AppError, _req: Request, res: Response, _next: NextFunction): void => {
  console.log("datos:", err)
  const status = err.statusCode || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send({ message });
});

app.listen(PORT, () => {
  console.log(`Server runiing on port ${PORT}`)
})