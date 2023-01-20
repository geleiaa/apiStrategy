const Bcrypt = require('bcrypt');

const {
    promisify
} = require('util')
const hashAsync = promisify(Bcrypt.hash)
const compareAsync = promisify(Bcrypt.compare)
const SALT = parseInt(process.env.SALT_PASS)

class Password {
	 static hashPass(pass) {
	 	return hashAsync(pass, SALT)
	 }

	 static comparePass(pass, hash) {
	 	return compareAsync(pass, hash)
	 }
}

module.exports = Password;