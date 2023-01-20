const assert = require('assert');
const api = require('../api/api');
const Password = require('../src/helpers/passwordHelper');
const UserSchema = require('./../src/db/strategies/postgres/schema/userSchema');
const Postgres = require('./../src/db/strategies/postgres/postgres');

let app = {}

const USER = {
    username: 'Testando',
    password: 'pass@123'
}

const USER_NO_DB = {
    ...USER,
    password: '$2b$04$AWjPE3ALC180/99GyEc3tOo8eRTlOpjPt3A/UhtUJFPrLEajbpm3O'
}


describe('Teste de Auth', function () {
    this.beforeEach(async () => {
        app = await api //espera o server startar

        //instamcia do postgres model e crud
        const connectionPostgres = await Postgres.connect() // conect no DB
        const model = await Postgres.defineModel(connectionPostgres, UserSchema)
        const context = new Context(new Postgres(connectionPostgres, model))

        //await context.update(null, USER, true)
    });

    it('Obter Token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        });

        const statusCode = result.statusCode;
        assert.deepEqual(statusCode, 200)
        assert.ok(JSON.parse(result.payload).token.length > 10)

        console.log(result)
    });

    it('Teste do Nao Autorizado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'UserErrado',
                password: 'passErrado'
            }
        });

        const statusCode = result.statusCode

        assert.ok(statusCode === 401)
        assert.deepEqual(JSON.parse(result.payload).message, 'Unauthorized')
 
    })

})