import { Router } from 'express';
import CartManager from '../Dao/mongo/cartsManagerMongo.js';

const router = Router();
const manager = new CartManager()

router.get('/', async (req, res) => {
    try {
        const carts = await manager.getCarts();
        res.json(carts);
    } catch (error) {
        console.error('Error obteniendo carritos:', error);
        res.status(500).json({ message: 'Error  del servidor' });
    }
});
router.post('/', async (req, res) => {  
    const cart = await manager.addCart([])
    res.status(200).json(cart)
})

router.post('/:cid', async (req, res) => {
    try {  
        const productId = req.body.productId;
        const quantity = req.body.quantity;
        const cart = await manager.addProductToCart(req.params.cid, productId, quantity)
        res.status(200).json(cart)
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Error del servidor' });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await manager.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carro no existe' });
        }
        res.render('cart', { cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Error interno' });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await manager.deleteProductInCart(req.params.cid, req.params.pid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carro no existe' });
        }
        res.status(200).json({ status: 'success', message: 'Producto eliminado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Error interno' });
    }
});

router.post('/:cid', async (req, res) => {
    try {
        const { products } = req.body;
        const cart = await manager.addPro(req.params.cid, products);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carro no existe' });
        }
        res.status(200).json({ status: 'success', message: 'Carro actualizado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Error interno' });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await CartManager.updateOneProduct(req.params.cid, { _id: req.params.pid, quantity });
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carro no existe' });
        }
        res.status(200).json({ status: 'success', message: 'Cantidad actualizada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Error interno' });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const cart = await CartManager.deleteAllProductsInCart(req.params.cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carro no existe' });
        }
        res.status(200).json({ status: 'success', message: 'Carro vaciado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Error interno' });
    }
});

export default router;

