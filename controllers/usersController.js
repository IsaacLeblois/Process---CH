const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys.js')

module.exports = {

    async getAll(req, res, next) {
        try {
            const data = await User.getAll()
            return res.status(201).json(data)
        } catch(err) {
            console.log(err)
            return res.status(501).json({
                succes: false,
                message: 'Error al obtener los usuarios'
            })
        }
    },

    async register(req, res, next) {
        try {
            const user = req.body
            const data = await User.create(user)
            return res.status(201).json({
                succes: true,
                message: 'El registro se realizó correctamente',
                data: data.id
            })
        } catch(err) {
            console.log(err)
            return res.status(501).json({
                succes: false,
                message: 'Error al registrar al usuario',
                error: err
            })
        }
    },

    async login(req, res, next) {
        try {
            const email = req.body.email
            const password = req.body.password
            const user = await User.findByEmail(email)
            
            if(!user) {
                return res.status(401).json({
                    succes: false,
                    message: 'El correo no fue encontrado'
                })
            }

            if(User.isPasswordMatched(password, user.password)) {
                const token = jwt.sign({id: user.id, email: user.email}, keys.secretOrKey, {
                    expiresIn: (60*60*24) //1 HORA
                })
                const data = {
                    id: user.id,
                    name: user.name,
                    lastname: user.lastname,
                    email: user.email,
                    phone: user.phone,
                    image: user.image,
                    session_token: `JWT ${token}`
                }

                return res.status(201).json({
                    succes: true,
                    data: data,
                    message: 'El usuario ha sido autenticado'
                })
            } else {
                return res.status(401).json({
                    succes: false,
                    message: 'La constraseña es incorrecta',
                })
            }

        } catch(err) {
            console.log(err)
            return res.status(501).json({
                succes: false,
                message: 'Error al iniciar sesion',
                error: err
            })
        }
    }
}