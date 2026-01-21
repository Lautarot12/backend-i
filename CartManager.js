import fs from 'fs'

class CartManager {
    
    async createCart () {

        const existe = fs.existsSync('./carts.json')

        if (!existe) {
            fs.promises.writeFile('./carts.json', JSON.stringify([]))
        } 
        
        const readCart = await fs.promises.readFile('./carts.json', 'utf-8')
        const parsedCart = JSON.parse(readCart)

        const calculatingId = parsedCart.length === 0 ? 1 : parsedCart.length + 1

        const newCart = { id: calculatingId, products: [] }

        parsedCart.push(newCart)

        const stringedParsedCart = JSON.stringify(parsedCart)
        await fs.promises.writeFile('./carts.json', stringedParsedCart)
    }

    async addProduct2Cart (cid, pid){
        const readCart = await fs.promises.readFile('./carts.json', 'utf-8')
        const parsedCart = JSON.parse(readCart)
        const carritoEncontrado = parsedCart.find(carrito =>  carrito.id === cid)
        if (!carritoEncontrado){
            console.error('Error, no se pudo encontrar el carrito buscado.')
        }
        
        const encontradoId = carritoEncontrado.products.find ((product)=>{
            const coincide = product.product === Number(pid)
            return coincide
        })
        if(!encontradoId){
            carritoEncontrado.products.push({product: pid, quantity: 1})
        }
        encontradoId.quantity += 1 
        
        const parsednewCart = JSON.stringify(parsedCart)
        await fs.promises.writeFile('./carts.json', parsednewCart)
        return console.log('Producto agregado con exito')
    }
}

const cart1 = new CartManager()