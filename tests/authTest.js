const assert = require('assert');
const api = require('../api/api');
const Password = require('../src/helpers/passwordHelper');
const Context = require('./../src/db/strategies/base/ContextStrategy');
const UserSchema = require('./../src/db/strategies/postgres/schema/userSchema');
const Postgres = require('./../src/db/strategies/postgres/postgres');

let app = {}

const USER = {
    username: 'Testando',
    password: 'pass@123'
}

const USER_NO_DB = {
    ...USER.username.toLowerCase(),
    password: '$2b$04$9Glu1m7zAspBHJmdN4/Lm.XpKj8RqHQwzvL3NJmBq2UtcmBpElUgy'
}


describe('Teste de Auth', function () {
    this.beforeEach(async () => {
        app = await api //espera o server startar

        //instamcia do postgres model e crud
        const connectionPostgres = await Postgres.connect() // conect no DB
        const model = await Postgres.defineModel(connectionPostgres, UserSchema)
        const context = new Context(new Postgres(connectionPostgres, model))

        await context.update(null, USER_NO_DB, true) // registra user no DB
    });

    it('Obter Token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        });

        console.log('result', result.result)

        const statusCode = result.statusCode;
        assert.deepEqual(statusCode, 200)
        assert.ok(JSON.parse(result.payload).token.length > 10)
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

        //console.log(result.result)

        const statusCode = result.statusCode

        assert.ok(statusCode === 401)
        assert.deepEqual(JSON.parse(result.payload).message, 'Unauthorized')
 
    })

})