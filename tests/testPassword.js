const assert = require('assert');

const Password = require('../src/helpers/passwordHelper');

const SENHA = 'pass@123';
const HASH = '$2b$04$9Glu1m7zAspBHJmdN4/Lm.XpKj8RqHQwzvL3NJmBq2UtcmBpElUgy'

describe('Teste do helper password', function () {
	it('Gerar hash da senha', async () => {
		const result = await Password.hashPass(SENHA)

		console.log(result);

		assert.ok(result.length > 10)
	})

	it('Compara a o hash com a senha', async () => {
		const result = Password.comparePass(SENHA, HASH)
		assert.ok(result)
	})
})