
const dotenv = require('dotenv');
const { join } = require('path');
//const { ok } = require('assert');

const env = process.env.NODE_ENV || "dev"
//ok(env === "prod" || env === "dev", "environment inválida! Ou prod ou dev");

dotenv.config({ path: join(__dirname, './../src/config',  `.env.${env}`) });

console.log('ENV', process.env);

const Hapi = require('@hapi/hapi');
const Joi = require('joi');
const Swagger = require('hapi-swagger');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Jwt = require('jsonwebtoken');
const HapiJwt = require('hapi-auth-jwt2');

const MongoDB = require('./../src/db/strategies/mongodb/mongodb');
const beerSchema = require('./../src/db/strategies/mongodb/schemas/beerSchema');

const Postgres = require('./../src/db/strategies/postgres/postgres');
const UserSchema = require('./../src/db/strategies/postgres/schema/userSchema');

const Context = require('./../src/db/strategies/base/ContextStrategy');

const apiRoutes = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes');
const KEY_SUPER_SECR = process.env.JWT_KEY

const init = async () =>{
const app = Hapi.Server({ port:process.env.PORT });

const connectionPostgres = await Postgres.connect()
const model = await Postgres.defineModel(connectionPostgres, UserSchema)
const postgresDB = new Context(new Postgres(connectionPostgres, model));

const connection = MongoDB.connect();
const mongodb = new Context(new MongoDB(connection, beerSchema))

await app.register([
    Inert,
    Vision,
    HapiJwt,
    {
        plugin: Swagger,
        options: {
            info: {
                title: 'API Beers - #CursoNodeBR',
                version: 'v1.0'
            }
            //lang: 'pt'
        }
    }
])

app.auth.strategy('jwt', 'jwt', {
    key: KEY_SUPER_SECR,
    validate: async (dado, request) => {
        console.log('dado', dado);
        const [result] = await postgresDB.read({
            username: dado.username.toLowerCase()
        })

        if(!result) return { isValid: false }

        return { isValid: true }
    }
})
app.auth.default('jwt')

app.validator(Joi);

app.route(new apiRoutes(mongodb).list());

app.route(new apiRoutes(mongodb).create());

app.route(new apiRoutes(mongodb).update());

app.route(new apiRoutes(mongodb).delete());

app.route(new authRoutes(KEY_SUPER_SECR, postgresDB).login());

await app.start();
console.log('Server Hapi up in port', app.info.port);

return app
}

module.exports = init();