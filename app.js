import express from 'express'
import Productsroute from './routes/products.routes.js'
import cartsRoute from './routes/carts.routes.js'
import __dirname from './utils.js'

const app = express()
app.use(express.json())
app.use(express.static(__dirname + '/public'))

app.use('/api/products', Productsroute)
app.use('/api/carts', cartsRoute)


app.listen(8080, ()=>{
    console.log('Servidor ON')
})