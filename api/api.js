const Hapi = require('@hapi/hapi');
const Joi = require('joi');
const Swagger = require('hapi-swagger');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Jwt = require('jsonwebtoken');
const HapiJwt = require('hapi-auth-jwt2');


const apiRoutes = require('./routes/apiRoutes');
const MongoDB = require('./../src/db/strategies/mongodb/mongodb');
const beerSchema = require('./../src/db/strategies/mongodb/schemas/beerSchema');
const Context = require('./../src/db/strategies/base/ContextStrategy');
const authRoutes = require('./routes/authRoutes');
const KEY_SUPER_SECR = 'SECRETA'

const init = async () =>{
const app = Hapi.Server({ port:4000 });

const connection = MongoDB.connect();
const mongodb = new Context(new MongoDB(connection, beerSchema))

await app.register([
    HapiJwt,
    Inert,
    Vision,
    {
        plugin: Swagger,
        options: {
            info: {
                title: 'API Beers - #CursoNodeBR',
                version: 'v1.0'
            },
            lang: 'pt'
        }
    }
])

app.auth.strategy('jwt', 'jwt', {
    key: KEY_SUPER_SECR,
    validade: (dado, request) => {
        return {
            isValid: true
        }
    }
})
app.auth.default('jwt')

app.validator(Joi);

app.route(new authRoutes(KEY_SUPER_SECR), login());

app.route(new apiRoutes(mongodb).list());

app.route(new apiRoutes(mongodb).create());

app.route(new apiRoutes(mongodb).update());

app.route(new apiRoutes(mongodb).delete());

await app.start();
console.log('Server Hapi up in port', app.info.port);

return app
}

module.exports = init();