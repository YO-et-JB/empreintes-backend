export const up = async (knex) => {
  await knex.schema.createTable("users", (table) => {
    table.increments("id")
    table.text("firstName").notNullable()
    table.text("lastName").notNullable()
    table.text("email").notNullable()
    table.text("phoneNumber").notNullable()
    table.text("passwordHash").notNullable()
    table.text("passwordSalt").notNullable()
    table.timestamps(true, true, true)
  })
  await knex.schema.createTable("books", (table) => {
    table.increments("id")
    table.text("title").notNullable()
    table.text("topic").notNullable()
    table.datetime("publishedAt")
    table.timestamps(true, true, true)
    table.integer("userId").notNullable().references("id").inTable("users")
  })
  await knex.schema.createTable("photographs", (table) => {
    table.increments("id")
    table.text("title").notNullable()
    table.text("topic").notNullable()
    table.datetime("publishedAt")
    table.timestamps(true, true, true)
    table.integer("userId").notNullable().references("id").inTable("users")
  })
  await knex.schema.createTable("tags", (table) => {
    table.increments("id")
    table.text("name").notNullable()
    table.timestamps(true, true, true)
  })
  await knex.schema.createTable("medias", (table) => {
    table.increments("id")
    table.text("uri").notNullable()
    table.text("type").notNullable()
    table.timestamps(true, true, true)
  })
  await knex.schema.createTable("rel_books_tags", (table) => {
    table.integer("bookId").notNullable().references("id").inTable("books")
    table.integer("tagId").notNullable().references("id").inTable("tags")
    table.primary(["bookId", "tagId"])
  })
  await knex.schema.createTable("rel_photographs_tags", (table) => {
    table
      .integer("photographId")
      .notNullable()
      .references("id")
      .inTable("photographs")
    table.integer("tagId").notNullable().references("id").inTable("tags")
    table.primary(["photographId", "tagId"])
  })
  await knex.schema.createTable("rel_medias_books", (table) => {
    table.integer("mediaId").notNullable().references("id").inTable("medias")
    table.integer("bookId").notNullable().references("id").inTable("books")
    table.primary(["bookId", "mediaId"])
  })
  await knex.schema.createTable("rel_medias_photographs", (table) => {
    table.integer("mediaId").notNullable().references("id").inTable("medias")
    table
      .integer("photographId")
      .notNullable()
      .references("id")
      .inTable("photographs")
    table.primary(["photographId", "mediaId"])
  })
}
export const down = async (knex) => {
  await knex.schema.dropTable("rel_medias_photgraphs")
  await knex.schema.dropTable("rel_medias_books")
  await knex.schema.dropTable("rel_photographs_tags")
  await knex.schema.dropTable("rel_books_tags")
  await knex.schema.dropTable("tags")
  await knex.schema.dropTable("medias")
  await knex.schema.dropTable("photographs")
  await knex.schema.dropTable("books")
  await knex.schema.dropTable("users")
}
