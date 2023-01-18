const Hapi = require('@hapi/hapi');
const Joi = require('joi');
const apiRoutes = require('./routes/apiRoutes');
const Swagger = require('hapi-swagger');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');


const MongoDB = require('./../src/db/strategies/mongodb/mongodb');
const beerSchema = require('./../src/db/strategies/mongodb/schemas/beerSchema');
const Context = require('./../src/db/strategies/base/ContextStrategy');

const init = async () =>{
const app = Hapi.Server({ port:4000 });

const connection = MongoDB.connect();
const mongodb = new Context(new MongoDB(connection, beerSchema))

await app.register([
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

app.validator(Joi);

app.route(new apiRoutes(mongodb).list());

app.route(new apiRoutes(mongodb).create());

app.route(new apiRoutes(mongodb).update());

app.route(new apiRoutes(mongodb).delete());

await app.start();
console.log('Server Hapi up in port', app.info.port);

return app
}

module.exports = init();