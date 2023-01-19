const Joi = require('joi');
const Boom = require('@hapi/boom');
const Jwt = require('jsonwebtoken');

const USER = {
    username: 'TestUser',
    password:  'pass1234'
}

class AuthRoutes {
    constructor(key) {
        //super()
        this.secret = key
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                description: 'fazer login',
                notes: 'retorna um token',
                auth: false,
                tags: ['api'],
                validate: {
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }
            },

            handler: (request, headers) =>{
                const { username, password } = request.payload

                if(username !== USER.username || password !== USER.password) return Boom.unauthorized()

                return {
                    token: Jwt.sign({
                        username: username
                    }, this.secret)
                }

                console.log(token);
            }
        }
    }
}

module.exports = AuthRoutes;