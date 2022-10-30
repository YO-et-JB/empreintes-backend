import User from "../db/models/User.js"
import filterDBResult from "../filterDBResult.js"
import hashPassword from "../hashPassword.js"
import makeRoutes from "../makeRoutes.js"
import auth from "../middlewares/auth.js"
import validate from "../middlewares/validate.js"
import hasAccess from "../utils/hasAccess.js"
import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePhoneNumber,
  validateId,
  validateLimit,
  validateOffset,
  validatePassword
} from "../validators.js"

const makeUsersRoutes = makeRoutes("/users", ({ router }) => {
  // CREATE
  router.post(
    "/",
    validate({
      body: {
        firstName: validateFirstName.required(),
        lastName: validateLastName.required(),
        email: validateEmail.required(),
        phoneNumber: validatePhoneNumber.required(),
        password: validatePassword.required()
      }
    }),
    async (req, res) => {
      const { firstName, lastName, email, phoneNumber, password } = req.body
      const [passwordHash, passwordSalt] = hashPassword(password)

      const [user] = await User.query()
        .insert({
          firstName,
          lastName,
          email,
          phoneNumber,
          passwordHash,
          passwordSalt
        })
        .returning("*")

      res.send({ result: filterDBResult([user]), count: 1 })
    }
  )
  // READ collection
  router.get(
    "/",
    auth("ADMIN"),
    validate({
      query: {
        limit: validateLimit,
        offset: validateOffset
      }
    }),
    async (req, res) => {
      const { limit, offset } = req.locals.query
      const users = await User.query().limit(limit).offset(offset)
      const [{ count }] = await User.query().count()

      res.send({ result: filterDBResult(users), count })
    }
  )
  // READ single
  router.get(
    "/:email",
    validate({
      params: {
        email: validateEmail.required()
      }
    }),
    async (req, res) => {
      const { email } = req.params
      const user = await User.query().findOne({ email }).throwIfNotFound()

      res.send({ result: filterDBResult([user]), count: 1 })
    }
  )
  // UPDATE partial
  router.patch(
    "/:userId",
    auth(),
    validate({
      params: {
        userId: validateId.required()
      },
      body: {
        firstName: validateFirstName,
        lastName: validateLastName,
        email: validateEmail,
        phoneNumber: validatePhoneNumber,
        password: validatePassword
      }
    }),
    async (req, res) => {
      const {
        params: { userId },
        body: { firstName, lastName, email, phoneNumber, password },
        session
      } = req

      if (userId !== session.user.id) {
        hasAccess(req.session, "ADMIN")
      }

      const user = await User.query().findById(userId).throwIfNotFound()

      let passwordHash
      let passwordSalt

      if (password) {
        const [hash, salt] = hashPassword(password)

        passwordHash = hash
        passwordSalt = salt
      }

      const updatedUser = await user
        .$query()
        .patch({
          firstName,
          lastName,
          email,
          phoneNumber,
          passwordHash,
          passwordSalt,
          updatedAt: new Date()
        })
        .returning("*")

      res.send({ result: updatedUser, count: 1 })
    }
  )
  // DELETE
  router.delete(
    "/:userId",
    auth("ADMIN"),
    validate({
      params: {
        userId: validateId.required()
      }
    }),
    async (req, res) => {
      hasAccess("ADMIN")

      const { userId } = req.params

      const user = await User.query().deleteById(userId).throwIfNotFound()

      res.send({ result: filterDBResult([user]), count: 1 })
    }
  )

  return router
})

export default makeUsersRoutes
