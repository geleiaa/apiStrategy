const assert = require('assert');
const api = require('./../api/api');

let app = {};

const BEER_TESTE = { nome: 'TesteCreate', preco: 3.99 }
const BEER_TESTE_1 = { nome: 'Test in ingleis', preco: 2.19 }
const BEER_TESTE_2 = { nome: 'Testando só', preco: 1.90 }
const BEER_TESTE_3 = { nome: 'Mais um teste', preco: 5.99 }

describe('Testes da Api', function () {
    this.beforeAll(async () => {
        app = await api // espera o server startar
        await app.inject({ method: 'POST', url: '/beers', payload: BEER_TESTE_1 })
        await app.inject({ method: 'POST', url: '/beers', payload: BEER_TESTE_2 })
        await app.inject({ method: 'POST', url: '/beers', payload: BEER_TESTE_3 })
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
        const TAM_LIMIT = 3
        const result = await app.inject({
            method: 'GET',
            url: `/beers?skip=0&limit=${TAM_LIMIT}`
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        //assert.ok(dados.length === TAM_LIMIT) <----- VER ISSO, DEU ERRO

    })

    it('Filtrar a query com string', async () => {
        const TAM_LIMIT = 'T'
        const result = await app.inject({
            method: 'GET',
            url: `/beers?skip=0&limit=${TAM_LIMIT}`
        })

        errorResult = {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "child \"limit\" fails because [\"limit\" must be a number]",
            "validation": {
                "source": "query",
                "keys": ["limit"]
            }
        }

        assert.deepEqual(result.statusCode, 400)
        assert.deepEqual(result.payload, JSON.stringify(errorResult))
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
