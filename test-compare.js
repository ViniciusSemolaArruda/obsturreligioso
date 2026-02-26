import bcrypt from "bcryptjs"

const password = "@dm1nS3nh4F0rt3!"
const hash =
  "$2b$12$IJn.siQSKvnaFlb7fQKmvuGLeiFaW67Gymq/a2y5pfzkOBvcgjkbe"

const ok = await bcrypt.compare(password, hash)
console.log("MATCH:", ok)