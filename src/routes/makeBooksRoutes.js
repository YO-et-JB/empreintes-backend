import Book from "../db/models/Book.js"
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
  validateSearch,
} from "../validators.js"

const makeBooksRoutes = ({ app, db }) => {
  // CREATE
  app.post(
    "/books",
    auth,
    validate({
      body: {
        title: validateTitle.required(),
        topic: validateTopic.required(),
        publishedAt: validatePublishedAt,
      },
    }),
    async (req, res) => {
      const {
        body: { title, topic, publishedAt },
        session: { user },
      } = req

      const [book] = await db("books")
        .insert({
          title,
          topic,
          publishedAt,
          userId: user.id,
        })
        .returning("*")

      res.send({ result: filterDBResult([book]), count: 1 })
    }
  )
  // READ collection
  app.get(
    "/books",
    validate({
      query: {
        limit: validateLimit,
        offset: validateOffset,
        userId: validateId,
        search: validateSearch,
      },
    }),
    async (req, res) => {
      const { limit, offset, userId, search } = req.locals.query
      const booksQuery = Book.query()
        .withGraphFetched("user")
        .limit(limit)
        .offset(offset)
        .whereNotNull("publishedAt")
        .orderBy("publishedAt", "DESC")
      const countQuery = Book.query().count().whereNotNull("publishedAt")

      if (userId) {
        booksQuery.where({ userId })
        countQuery.where({ userId })
      }

      if (search) {
        const searchPattern = `%${search}%`
        booksQuery.where((query) =>
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
      const books = await booksQuery

      res.send({ result: filterDBResult(books), count })
    }
  )
  // READ single
  app.get(
    "/books/:bookId",
    validate({
      params: {
        bookId: validateId.required(),
      },
    }),
    async (req, res) => {
      const { bookId } = req.params

      const [book] = await db("books").where({ id: bookId })

      if (!book) {
        res.status(404).send({ error: "Book not found." })

        return
      }

      const formattedBook = Object.entries(book).reduce(
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

      res.send({ result: [formattedBook], count: 1 })
    }
  )
  // UPDATE partial
  app.patch(
    "/books/:bookId",
    // auth,
    validate({
      params: {
        bookId: validateId.required(),
      },
      body: {
        title: validateTitle,
        topic: validateTopic,
        publishedAt: validatePublishedAt,
      },
    }),
    async (req, res) => {
      const {
        params: { bookId },
        body: { title, topic, publishedAt },
      } = req

      const [book] = await db("books").where({ id: bookId })

      if (!book) {
        res.status(404).send({ error: "Book not found." })

        return
      }

      const [updatedBook] = await db("books")
        .where({ id: bookId })
        .update({
          title,
          topic,
          publishedAt,
          updatedAt: new Date(),
        })
        .returning("*")

      res.send({ result: [updatedBook], count: 1 })
    }
  )
  // DELETE
  app.delete(
    "/books/:bookId",
    validate({ params: { bookId: validateId.required() } }),
    async (req, res) => {
      const {
        params: { bookId },
      } = req

      const [book] = await db("books").where({ id: bookId })

      if (!book) {
        res.status(404).send({ error: "Book not found." })

        return
      }

      await db("books").where({ id: bookId }).delete()

      res.send({ result: [book], count: 1 })
    }
  )
}

export default makeBooksRoutes
