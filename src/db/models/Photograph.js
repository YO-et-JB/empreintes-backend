import { Model } from "objection"
import User from "./User.js"

class Photograph extends Model {
  static tableName = "photographs"

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "photographs.userId",
          to: "users.id"
        }
      }
    }
  }
}

export default Photograph
