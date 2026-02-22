import fs from 'fs'

class CartManager {
    
    async getData () {
        const existe = fs.existsSync('./carts.json')
        if(!existe) {
            const emptyData = []
            await fs.promises.writeFile('./carts.json', JSON.stringify(emptyData))
        }
    
        const resultado = await fs.promises.readFile('./carts.json', 'utf-8')
        const data = JSON.parse(resultado)
        return data
        }
    
        async saveData (data) {
            const stringedData = JSON.stringify(data)
            await fs.promises.writeFile('./carts.json', stringedData)
        }
    
    async createCart () {

        const cartData = await this.getData()

        const calculatingId = cartData.length === 0 ? 1 : cartData.length + 1

        const newCart = { id: calculatingId, products: [] }

        cartData.push(newCart)

        await this.saveData(cartData)
        return newCart
    }

    async getCartById (id) {
        const data = await this.getData()

        const encontradoId = data.find ((cart)=>{
            const coincide = cart.id === Number(id)
            return coincide
        })
        if (!encontradoId) {
            console.log('El carrito no pudo ser encontrado.')
            return null
        }
        return encontradoId
    }

    async addProduct2Cart (cid, pid){
        const cartData = await this.getData()
        const carritoEncontrado = cartData.find(carrito =>  carrito.id === Number(cid))
        if (!carritoEncontrado){
            console.error('Error, no se pudo encontrar el carrito buscado.')
            return null
        }
        
        const encontradoId = carritoEncontrado.products.find ((product)=>{
            const coincide = product.product === Number(pid)
            return coincide
        })
        if(!encontradoId){
            carritoEncontrado.products.push({product: pid, quantity: 1})
            await this.saveData(cartData)
            return carritoEncontrado
        }
        encontradoId.quantity += 1 
        
        await this.saveData(cartData)
        return carritoEncontrado
    }
}

export default CartManager