import { Router } from 'express'
import Product from '../models/product.model.js'

const route = Router()


route.get('/', async (req, res)=>{
    try {
        const { limit = 10, page = 1, sort, query } = req.query
        let filter = {}
        if (query) {
            if(['frescos', 'congelados', 'precocidos'].includes(query)) filter.category = query
                else if (query === 'true' || query === 'false') filter.status = query === 'true'
        }
        let sortOption = {}
        if (sort) {
            if(sort === 'asc') {
                sortOption = { price: 1 }
            }
            else if(sort === 'desc'){
                sortOption = { price: -1 }
            }
        }
        const data = await Product.paginate(filter, { limit, page, sort: sortOption, lean: true })
        const products = data.docs
        delete data.docs
        const response = {
            status: 'success',
            payload: products,
            totalPages: data.totalPages,
            prevPage: data.hasPrevPage ? data.prevPage : null,
            nextPage: data.hasNextPage ? data.nextPage : null,
            page: data.page,
            hasPrevPage: data.hasPrevPage,
            hasnextPage: data.hasNextPage,
            prevLink: null,
            nextLink: null
        }

        return res.json(response)
    } catch (error) {
        res.status(500).send(error)
    }
})

route.get('/:pid', async (req, res)=>{
    try {
        const id = req.params.pid
        const prodFoundId = await Product.findById(id)
        if(!prodFoundId){
            res.status(404)
            return res.send('Producto no encontrado')
        } res.json(prodFoundId)
    } catch (error) {
        res.status(500).send(error)
    }
})

route.post('/', async (req, res)=>{
    try {
        const body = req.body
        const resultado = await Product.create(body)
        if (!resultado) {
            return res.status(400).send('Error, el producto no se pudo agregar, intente nuevamente.')
        }
        res.status(201).json(resultado)
    } catch (error) {
        res.status(500).send(error)
    }
})

route.put('/:pid', async (req, res)=>{
    try {
        const id = req.params.pid
        const updatedFields = req.body
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true, runValidators: true })
        if (!updatedProduct) {
            return res.status(404).send("Error: Producto no encontrado")
        }
        return res.json(updatedProduct)
    } catch (error) {
        res.status(500).send(error)
    }
})

route.delete('/:pid', async (req, res)=>{
    try {
        const id = req.params.pid
        const deletingProd = await Product.findByIdAndDelete(id)
        if (!deletingProd) {
            return res.status(404).send('Error: El producto no pudo eliminarse.')
        }
        res.json({
            status: 'success',
            deletingProd,
        })
    } catch (error) {
        res.status(500).send(error)
    }
})

export default route