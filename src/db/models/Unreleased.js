import { Model } from "objection"
import Catalog from "./Catalog.js"
import Released from "./Released.js"

class Unreleased extends Model {
  static tableName = "unreleased"

  static get relationMappings() {
    return {
      catalog: {
        relation: Model.HasManyRelation,
        modelClass: Catalog,
        join: {
          from: "unreleased.catalogid",
          to: "catalog.Id",
        },
      },
      released: {
        relation: Model.HasManyRelation,
        modelClass: Released,
        join: {
          from: "released.unreleasedid",
          to: "released.Id",
        },
      },
    }
  }
}

export default Unreleased
