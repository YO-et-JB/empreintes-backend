import { Model } from "objection"

class Released extends Model {
  static tableName = "released"

  static get relationMappings() {
    return {
      catalog: {
        relation: Model.BelongsToOneRelation,
        modelClass: Released,
        join: {
          from: "released.catalogId",
          to: "catalog.id",
        },
      },
    }
  }
}

export default Released
