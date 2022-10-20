import cors from "cors";
import express from "express";
import knex from "knex";
import config from "./config.js";
import { Model } from "objection";
import handleErrors from "./middlewares/handleErrors.js";
// import makeUsersRoutes from "./routes/makeUsersRoutes.js";
// import makeShopsRoutes from "./routes/makeShopsRoutes.js";
// import makeCommentsRoutes from "./routes/makeCommentsRoutes.js";
// import makeReviewsRoutes from "./routes/makeReviewsRoutes.js";
// import makeProductsRoutes from "./routes/makeProductsRoutes.js";
// import makeSessionRoutes from "./routes/makeSessionRoutes.js";
// import makeUploadRoutes from "./routes/makeUploadRoutes.js";

const app = express();
const db = knex(config.db);

Model.knex(db);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.locals = {
    params: req.params,
    query: req.query,
    body: req.body,
  };

  next();
});

app.get("/products/:productId", (req, res) =>
  res.send(`Product #${req.params.productId}`)
);
app.get("/categories/:categoryId/products/:productId", (req, res) =>
  res.send(
    `Category #${req.params.categoryId} Product #${req.params.productId}`
  )
);

// makeUsersRoutes({ app, db });
// makeSessionRoutes({ app, db });
// makeCommentsRoutes({ app, db });
// makeReviewsRoutes({ app, db });
// makeShopsRoutes({ app, db });
// makeProductsRoutes({ app, db });
// makeUploadRoutes({ app, db });

app.use(handleErrors);

app.listen(config.server.port, () =>
  // eslint-disable-next-line no-console
  console.log(`Listening on :${config.server.port}`)
);
