const dotenv = require('dotenv');
const { join } = require('path');
const env = process.env.NODE_ENV || "dev"
dotenv.config({ path: join(__dirname, './../src/config',  `.env.${env}`) });

const assert = require('assert');
const beerSchema = require('./../src/db/strategies/mongodb/schemas/beerSchema');
const Context = require('./../src/db/strategies/base/ContextStrategy');
const MongoDB = require('./../src/db/strategies/mongodb/mongodb');

let context = {};

const TEST_BEER_CREATE = { nome: 'TetsBeer', preco: 1.99 };

const TEST_BEER_UPDATE = { nome: 'Uptest', preco: 2.99};

let TEST_BEER_UPDATE_ID = '';

describe('MongoDB Testes', () => {
    before(async () =>{
        const connection = MongoDB.connect() // conecta no DB
        context = new Context(new MongoDB(connection, beerSchema)) //instancia o crud com a strategy

        const result = await context.create(TEST_BEER_UPDATE)
        TEST_BEER_UPDATE_ID = result._id
    })

    it('verificar conexao', async () => {
        const result = await context.taConnectedEin()
        const expected = 'Conectado'

        assert.deepEqual(result, expected)
    })

    it('Create no MongDB', async () => {
        const { nome, preco } = await context.create(TEST_BEER_CREATE)

        assert.deepEqual({ nome, preco }, TEST_BEER_CREATE)
    })

    it('Read no MongDB', async () => {
        const [{nome, preco}] = await context.read({ nome: TEST_BEER_CREATE.nome })
        const result = {nome, preco}
        
        assert.deepEqual(result, TEST_BEER_CREATE)
    })

    it('Update no MongDB', async () => {
        const result = await context.update(TEST_BEER_UPDATE_ID, { nome: 'Updeitado' })

        assert.deepEqual(result.modifiedCount, 1)
    })

    it('Delete no MongDB', async () =>{
        const result = await context.delete(TEST_BEER_UPDATE_ID)

        assert.deepEqual(result.deletedCount, 1)
    })

})