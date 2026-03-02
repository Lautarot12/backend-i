import express from 'express'
import Productsroute from './routes/products.routes.js'
import cartsRoute from './routes/carts.routes.js'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import viewsRoute from './routes/views.routes.js'
import http from 'http'
import { Server } from 'socket.io'
import ProductManager from './ProductManager.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server)
const productManager = new ProductManager('./products.json')

server.listen(8080, () => {
    console.log('Servidor ON')
})

app.engine('handlebars', handlebars.engine())

app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(express.static(__dirname + '/public'))

app.use('/api/products', Productsroute)
app.use('/api/carts', cartsRoute)
app.use('/', viewsRoute)

io.on('connection', async (socket)=>{
    console.log('Nuevo usuario conectado', socket.id)
    const productList = await productManager.getProducts()
    io.emit('productList', productList)

    socket.on('submit', async (data)=>{
        const addedProd = await productManager.addProduct(data)
        const productList = await productManager.getProducts()
        console.log('Se agrego:', addedProd)
        io.emit('productList', productList)
    })

    socket.on('deleteProd', async (prod2delete)=>{
        const deletedProd = await productManager.deleteProduct(prod2delete.id)
        const productList = await productManager.getProducts()
        io.emit('productList', productList)
        console.log('se elimino:', deletedProd)
    })
})