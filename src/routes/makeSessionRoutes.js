import express from "express"
import jsonwebtoken from "jsonwebtoken"
import config from "../config.js"
import User from "../db/models/User.js"
import validate from "../middlewares/validate.js"
import { send401 } from "../utils/http.js"
import { validateEmail, validatePassword } from "../validators.js"

const makeSessionRoutes = ({ app }) => {
  app.post(
    "/sign-in",
    express.json(),
    validate({
      email: validateEmail.required(),
      password: validatePassword.required(),
    }),
    async (req, res) => {
      const { email, password } = req.body

      if (!email) {
        res.status(401).send({ error: ["Invalid credentials."] })

        return
      }

      const user = await User.query().findOne({
        email: email,
      })

      if (!user) {
        send401(res)

        return
      }

      if (!user.checkPassword(password)) {
        send401(res)

        return
      }

      const jwt = jsonwebtoken.sign(
        {
          session: {
            user: {
              id: user.id,
              email: user.email,
              role: user.role,
            },
          },
        },
        config.security.jwt.secret,
        { expiresIn: config.security.jwt.expiresIn }
      )

      res.send({ result: [{ jwt }], count: 1 })
    }
  )
}

export default makeSessionRoutes
