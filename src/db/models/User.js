import { Model } from "objection"
import hashPassword from "../../hashPassword.js"

class User extends Model {
  static tableName = "users"

  checkPassword(password) {
    const [passwordHash] = hashPassword(password, this.passwordSalt)

    return this.passwordHash === passwordHash
  }
}

export default User
