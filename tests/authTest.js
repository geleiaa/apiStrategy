const assert = require('assert');
const api = require('../api/api');

let app = {}

describe('Teste de Auth', function () {
    this.beforeEach(async () => {
        app = await api //espera o server startar
    });

    it('Obter Token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'TesteUser',
                password: 'pass1234'
            }
        });

        const statusCode = result.statusCode;
    
        assert.deepEqual(statusCode, 200)
        assert.ok()

    });

})