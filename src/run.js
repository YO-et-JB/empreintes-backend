import cors from "cors"
import express from "express"
import knex from "knex"
import config from "./config.js"
import { Model } from "objection"
import handleErrors from "./middlewares/handleErrors.js"
import makeUsersRoutes from "./routes/makeUsersRoutes.js"

const app = express()
const db = knex(config.db)

Model.knex(db)

app.use(cors())

app.use((req, res, next) => {
  req.locals = {
    params: req.params,
    query: req.query,
    body: req.body,
  }

  next()
})

app.get("/products/:productId", (req, res) =>
  res.send(`Product #${req.params.productId}`)
)
app.get("/categories/:categoryId/products/:productId", (req, res) =>
  res.send(
    `Category #${req.params.categoryId} Product #${req.params.productId}`
  )
)

makeUsersRoutes({ app })

app.use(handleErrors)

app.listen(config.server.port, () =>
  // eslint-disable-next-line no-console
  console.log(`Listening on :${config.server.port}`)
)
