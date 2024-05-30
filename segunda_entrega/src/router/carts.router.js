import { Router } from 'express';
import CartManager from "../Dao/mongo/cartsManagerMongo.js";

const router = Router();
const manager = new CartManager()

// Ruta para obtener todos los carritos
router.get('/', async (req, res) => {
    try {
        const carts = await manager.getCarts();
        res.json(carts);
    } catch (error) {
        console.error('Error obteniendo los carritos:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const cart = await manager.addCart([]);
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error creando el carrito:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// Ruta para agregar un producto al carrito o crear un nuevo carrito si no existe
router.post('/:cid', async (req, res) => {
    try {  
        const { productId, quantity } = req.body;
        const cart = await manager.addProductToCart(req.params.cid, productId, quantity);
        res.status(200).json(cart);
    } catch (err) {
        console.error('Error agregando producto al carrito:', err);
        res.status(500).json({ status: 'error', message: 'Error del servidor' });
    }
});

// Ruta para obtener un carrito por ID
router.get('/:cid', async (req, res) => {
    try {
        const cart = await manager.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carro no existe' });
        }
       
        // res.render('cart', { cart });
        res.render('cart', {
            cart: cart,
        })
    } catch (err) {
        console.error('Error obteniendo el carrito:', err);
        res.status(500).json({ status: 'error', message: 'Error del servidor' });
    }
});

// Ruta para obtener un producto específico de un carrito por su ID
router.get('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await manager.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carro no existe' });
        }
        const product = cart.products.find(p => p._id.toString() === req.params.pid);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no existe en el carrito' });
        }
        res.status(200).json(product); 
    } catch (err) {
        console.error('Error obteniendo el producto del carrito:', err);
        res.status(500).json({ status: 'error', message: 'Error del servidor' });
    }
});

// Ruta para eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await manager.deleteProductInCart(req.params.cid, req.params.pid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carro no existe' });
        }
        res.status(200).json({ status: 'success', message: 'Producto eliminado' });
    } catch (err) {
        console.error('Error eliminando producto del carrito:', err);
        res.status(500).json({ status: 'error', message: 'Error del servidor' });
    }
});

// Ruta para actualizar los productos de un carrito
router.post('/:cid', async (req, res) => {
    try {
        const { products } = req.body;
        const cart = await manager.addPro(req.params.cid, products);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carro no existe' });
        }
        res.status(200).json({ status: 'success', message: 'Carro actualizado' });
    } catch (err) {
        console.error('Error actualizando el carrito:', err);
        res.status(500).json({ status: 'error', message: 'Error del servidor' });
    }
});

// Ruta para actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await CartManager.updateOneProduct(req.params.cid, { _id: req.params.pid, quantity });
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carro no existe' });
        }
        res.status(200).json({ status: 'success', message: 'Cantidad actualizada' });
    } catch (err) {
        console.error('Error actualizando la cantidad del producto:', err);
        res.status(500).json({ status: 'error', message: 'Error del servidor' });
    }
});

// Ruta para eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await manager.deleteAllProductsInCart(req.params.cid);

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        res.status(200).json({ message: 'Carrito vaciado', cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al vaciar el carrito', error });
    }
});

export default router;
