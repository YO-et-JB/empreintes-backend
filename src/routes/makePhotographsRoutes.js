import Photograph from "../db/models/Photograph.js"
import filterDBResult from "../filterDBResult.js"
import auth from "../middlewares/auth.js"
import validate from "../middlewares/validate.js"
import {
  validateId,
  validateLimit,
  validateOffset,
  validateTitle,
  validateTopic,
  validatePublishedAt,
  validateSearch
} from "../validators.js"

const makePhotographsRoutes = ({ app, db }) => {
  // CREATE
  app.post(
    "/photographs",
    auth,
    validate({
      body: {
        title: validateTitle.required(),
        topic: validateTopic.required(),
        publishedAt: validatePublishedAt
      }
    }),
    async (req, res) => {
      const {
        body: { title, topic, publishedAt },
        session: { user }
      } = req

      const [photograph] = await db("photographs")
        .insert({
          title,
          topic,
          publishedAt,
          userId: user.id
        })
        .returning("*")

      res.send({ result: filterDBResult([photograph]), count: 1 })
    }
  )
  // READ collection
  app.get(
    "/photographs",
    validate({
      query: {
        limit: validateLimit,
        offset: validateOffset,
        userId: validateId,
        search: validateSearch
      }
    }),
    async (req, res) => {
      const { limit, offset, userId, search } = req.locals.query
      const photographsQuery = Photograph.query()
        .withGraphFetched("user")
        .limit(limit)
        .offset(offset)
        .whereNotNull("publishedAt")
        .orderBy("publishedAt", "DESC")
      const countQuery = Photograph.query().count().whereNotNull("publishedAt")

      if (userId) {
        photographsQuery.where({ userId })
        countQuery.where({ userId })
      }

      if (search) {
        const searchPattern = `%${search}%`
        photographsQuery.where((query) =>
          query
            .whereILike("title", searchPattern)
            .orWhereILike("content", searchPattern)
        )
        countQuery.where((query) =>
          query
            .whereILike("title", searchPattern)
            .gorWhereILike("content", searchPattern)
        )
      }

      const [{ count }] = await countQuery
      const photographs = await photographsQuery

      res.send({ result: filterDBResult(photographs), count })
    }
  )
  // READ single
  app.get(
    "/photographs/:photographId",
    validate({
      params: {
        photographId: validateId.required()
      }
    }),
    async (req, res) => {
      const { photographId } = req.params

      const [photograph] = await db("photographs").where({ id: photographId })

      if (!photograph) {
        res.status(404).send({ error: "Photograph not found." })

        return
      }

      const formattedPhotograph = Object.entries(photograph).reduce(
        (xs, [key, value]) => {
          if (key.startsWith("users:")) {
            xs.user[key.slice(6)] = value

            return xs
          }

          xs[key] = value

          return xs
        },
        { user: {} }
      )

      res.send({ result: [formattedPhotograph], count: 1 })
    }
  )
  // UPDATE partial
  app.patch(
    "/photographs/:photographId",
    // auth,
    validate({
      params: {
        bookId: validateId.required()
      },
      body: {
        title: validateTitle,
        topic: validateTopic,
        publishedAt: validatePublishedAt
      }
    }),
    async (req, res) => {
      const {
        params: { photographId },
        body: { title, topic, publishedAt }
      } = req

      const [photograph] = await db("photographs").where({ id: photographId })

      if (!photograph) {
        res.status(404).send({ error: "Photograph not found." })

        return
      }

      const [updatedPhotograph] = await db("photographs")
        .where({ id: photographId })
        .update({
          title,
          topic,
          publishedAt,
          updatedAt: new Date()
        })
        .returning("*")

      res.send({ result: [updatedPhotograph], count: 1 })
    }
  )
  // DELETE
  app.delete(
    "/photographs/:photographId",
    validate({ params: { photographId: validateId.required() } }),
    async (req, res) => {
      const {
        params: { photographId }
      } = req

      const [photograph] = await db("photographs").where({ id: photographId })

      if (!photograph) {
        res.status(404).send({ error: "Photograph not found." })

        return
      }

      await db("photographs").where({ id: photographId }).delete()

      res.send({ result: [photograph], count: 1 })
    }
  )
}

export default makePhotographsRoutes
