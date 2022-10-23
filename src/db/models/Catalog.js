import { Model } from "objection"
import Unreleased from "./Unreleased.js"
import Released from "./Released.js"

class Catalog extends Model {
  static tableName = "catalogs"

  static get relationMappings() {
    return {
      unreleased: {
        relation: Model.HasManyRelation,
        modelClass: Unreleased,
        join: {
          from: "catalogs.id",
          to: "unreleased.catalogId",
        },
      },
      released: {
        relation: Model.HasManyRelation,
        modelClass: Released,
        join: {
          from: "catalogs.id",
          to: "released.catalogId",
        },
      },
    }
  }
}

export default Catalog
