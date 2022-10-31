export const up = async (knex) => {
  await knex.schema.alterTable("users", (table) => {
    table.text("role").notNullable().default("ADMIN")
  })
}

export const down = async (knex) => {
  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("role")
  })
}
