const assert = require('assert');
const api = require('./../api/api');

let app = {};

const BEER_TESTE = { nome: 'TesteCreate', preco: 3.99 }

describe('Testes da Api', function () {
    this.beforeAll(async () => {
        app = await api // espera o server startar
    })

    it('Listar na Api', async () =>{
        const result = await app.inject({
            method: 'GET',
            url: '/beers?skip=0&limit=3'
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })

    it('Listar com query', async () => {
        const TAM_LIMIT = 5
        const result = await app.inject({
            method: 'GET',
            url: `/beers?skip=0&limit=${TAM_LIMIT}`
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(dados.length === TAM_LIMIT)

    })

    it('Filtrar a query com string', async () => {
        const TAM_LIMIT = 'A'
        const result = await app.inject({
            method: 'GET',
            url: `/beers?skip=0&limit=${TAM_LIMIT}`
        })

        assert.deepEqual(result.payload, 'Erro no servidor')
    })

    it('Filtrar um item da query', async () => {
        const NAME = 'Teste'
        const result = await app.inject({
            method: 'GET',
            url: `/beers?skip=0&limit=3&nome=${NAME}`
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(dados[0].nome, NAME)

    })

    it('Create na API', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/beers',
            payload: BEER_TESTE
        })

        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
    })


})
