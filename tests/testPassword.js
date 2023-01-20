const assert = require('assert');

const Password = require('../src/helpers/passwordHelper');

const SENHA = 'pass@123';
const HASH = '$2b$04$AWjPE3ALC180/99GyEc3tOo8eRTlOpjPt3A/UhtUJFPrLEajbpm3O'

describe('Teste do helper password', function () {
	it('Gerar hash da senha', async () => {
		const result = await Password.hashPass(SENHA)
		assert.ok(result.length > 10)
	})

	it('Compara a o hash com a senha', async () => {
		const result = Password.comparePass(SENHA, HASH)
		assert.ok(result)
	})
})