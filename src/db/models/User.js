import { Model } from "objection"
import hashPassword from "../../hashPassword.js"
import Book from "./Book.js"
import Photograph from "./Photograph.js"

class User extends Model {
  static tableName = "users"

  static get relationMappings() {
    return {
      books: {
        relation: Model.HasManyRelation,
        modelClass: Book,
        join: {
          from: "users.id",
          to: "books.userId",
        },
      },
      photographs: {
        relation: Model.HasManyRelation,
        modelClass: Photograph,
        join: {
          from: "users.id",
          to: "photographs.userId",
        },
      },
    }
  }

  checkPassword(password) {
    const [passwordHash] = hashPassword(password, this.passwordSalt)

    return this.passwordHash === passwordHash
  }
}

export default User
