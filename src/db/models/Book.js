import { Model } from "objection"
import User from "./User.js"

class Book extends Model {
  static tableName = "books"

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "books.userId",
          to: "users.id",
        },
      },
    }
  }
}

export default Book
