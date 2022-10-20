export const up = async (knex) => {
  await knex.schema.alterTable("books", (table) => {
    table.dropForeign(["userId"])
    table
      .integer("userId")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .alter()
  })
}

export const down = async (knex) => {
  await knex.schema.alterTable("pictures", (table) => {
    table.dropForeign(["userId"])
    table
      .integer("userId")
      .notNullable()
      .references("id")
      .inTable("users")
      .alter()
  })
}
