const express = require('express');
const app = express();
const router = express.Router();
require('dotenv').config() 
const users = require('./routes/users')

//CONFIG SERVIDOR EXPRESS
const protocol = process.env.PROTOCOL || "http"
const ip = require('ip').address()
const port = process.env.PORT || 3030

//MIDDLEWARE
app.use(express.json());

//ROTAS
app.use('/users', users)

//EXECUTANDO SERVIDOR
app.listen(port, () => 
    console.log(`Server iniciado no http://localhot:${port} or ${protocol}://${ip}:${port}`
))