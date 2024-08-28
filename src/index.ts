// tsc never uses path  in package.json , since i've specified the outDir in tsConfig , hence alsways just use tsc for build, why i always forget that ?
import express from "express"
import cors from "cors"
import { route as setup } from "./routes/setup.ts"
import { router as status } from "./routes/statusTracking.ts"

const port: number = 8080
const app = express()
app.use(
  cors({
    origin: "*",
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/mail", setup)
app.use("/webhook", status)
app.get("/", (req, res) => {
  res.status(200).json({ hellow: "user" })
})

app.listen(port, () => {
  console.log("listening on ", "http://localhost:" + port)
})
