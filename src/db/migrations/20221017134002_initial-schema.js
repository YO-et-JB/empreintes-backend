export const up = async (knex) => {
  //step 1
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
  await knex.schema.createTable("catalogue", (table) => {
    table.increments("id")
    table.text("name").notNullable()
  })
  await knex.schema.createTable("unreleased", (table) => {
    table.increments("id")
    table.timestamps(true, true, true)
    table
      .integer("catalogueId")
      .notNullable()
      .references("id")
      .inTable("catalogue")
  })
  await knex.schema.createTable("released", (table) => {
    table.increments("id")
    table.timestamps(true, true, true)
    table
      .integer("catalogueId")
      .notNullable()
      .references("id")
      .inTable("catalogue")
    table
      .integer("unreleasedId")
      .notNullable()
      .references("id")
      .inTable("unreleased")
  })
  await knex.schema.createTable("books", (table) => {
    table.increments("id")
    table.text("name").notNullable()
    table.text("title").notNullable()
    table.text("topic").notNullable()
    table.timestamps(true, true, true)
    table
      .integer("releasedId")
      .notNullable()
      .references("id")
      .inTable("released")
  })
  await knex.schema.createTable("pictures", (table) => {
    table.increments("id")
    table.text("name").notNullable()
    table.text("title").notNullable()
    table.text("topic").notNullable()
    table.timestamps(true, true, true)
    table
      .integer("releasedId")
      .notNullable()
      .references("id")
      .inTable("released")
  })
  await knex.schema.createTable("medias", (table) => {
    table.increments("id")
    table.text("uri").notNullable()
    table.text("type").notNullable()
  })
  // step 2
  await knex.schema.createTable("Addresses", (table) => {
    table.increments("id")
    table.text("street").notNullable()
    table.text("number").notNullable()
    table.text("countryCode").notNullable()
    table.text("city").notNullable()
    table.text("appartmentNumber").notNullable()
    table.text("message").notNullable()
  })
  await knex.schema.createTable("carts", (table) => {
    table.increments("id")
    table.text("items").notNullable()
  })
  await knex.schema.createTable("orders", (table) => {
    table.increments("id")
    table.text("quotation").notNullable()
    table.timestamps(true, true, true)
  })
  // step 3
  await knex.schema.createTable("bills", (table) => {
    table.increments("id")
    table.text("totalCost").notNullable()
    table.text("billNumber").notNullable()
    table.text("paymentMethod").notNullable()
    table.text("paymentStatus").notNullable()
    table.timestamps(true, true, true)
  })
  await knex.schema.createTable("deliveries", (table) => {
    table.increments("id")
    table.text("status").notNullable()
    table.timestamps(true, true, true)
  })
  // RELATIONS
  await knex.schema.createTable("rel_medias_books", (table) => {
    table.integer("mediaId").notNullable().references("id").inTable("medias")
    table.integer("bookId").notNullable().references("id").inTable("books")
    table.primary(["bookId", "mediaId"])
  })
  await knex.schema.createTable("rel_medias_pictures", (table) => {
    table.integer("mediaId").notNullable().references("id").inTable("medias")
    table
      .integer("pictureId")
      .notNullable()
      .references("id")
      .inTable("pictures")
    table.primary(["pictureId", "mediaId"])
  })
}
//EXPORT
export const down = async (knex) => {
  await knex.schema.dropTable("rel_shops_pictures")
  await knex.schema.dropTable("rel_medias_books")
  await knex.schema.dropTable("deliveries")
  await knex.schema.dropTable("bills")
  await knex.schema.dropTable("orders")
  await knex.schema.dropTable("carts")
  await knex.schema.dropTable("addresses")
  await knex.schema.dropTable("medias")
  await knex.schema.dropTable("pictures")
  await knex.schema.dropTable("books")
  await knex.schema.dropTable("released")
  await knex.schema.dropTable("unreleased")
  await knex.schema.dropTable("catalogue")
  await knex.schema.dropTable("users")
}
