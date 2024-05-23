import Router from "express";
import ProductManager from "../Dao/mongo/productsManagerMongo.js";
import CartManager from "../Dao/mongo/cartsManagerMongo.js";
import __dirname from "../utils.js";

const productmanager = new ProductManager();
const cartmanager = new CartManager();
const router = Router();

let cart = [];

router.get("/products", async (req, res) => {
  try {
    let { limit, page, sort, category } = req.query;
    const opt = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: { price: Number(sort) },
      lean: true,
    };

    if (!(opt.sort.price === -1 || opt.sort.price === 1)) {
      delete opt.sort;
    }
    const links = (products) => {
      let prevLink;
      let nextLink;
      if (req.originalUrl.includes("page")) {
        prevLink = products.hasPrevPage
          ? req.originalUrl.replace(
              `page=${products.page}`,
              `page=${products.prevPage}`
            )
          : null;
        nextLink = products.hasNextPage
          ? req.originalUrl.replace(
              `page=${products.page}`,
              `page=${products.nextPage}`
            )
          : null;
        return { prevLink, nextLink };
      }
      if (!req.originalUrl.includes("?")) {
        prevLink = products.hasPrevPage
          ? req.originalUrl.concat(`?page=${products.prevPage}`)
          : null;
        nextLink = products.hasNextPage
          ? req.originalUrl.concat(`?page=${products.nextPage}`)
          : null;
        return { prevLink, nextLink };
      }
      prevLink = products.hasPrevPage
        ? req.originalUrl.concat(`&page=${products.prevPage}`)
        : null;
      nextLink = products.hasNextPage
        ? req.originalUrl.concat(`&page=${products.nextPage}`)
        : null;
      return { prevLink, nextLink };
    };

    const categories = await productmanager.categories();
    const result = categories.some((categ) => categ === category);
    if (result) {
      const products = await productmanager.getProducts({ category }, opt);
      const { prevLink, nextLink } = links(products);
      const {
        totalPages,
        prevPage,
        nextPage,
        hasNextPage,
        hasPrevPage,
        docs,
        page,
      } = products;
      if (page > totalPages)
        return res.render("No existe", { pageNotFound: "/products" });
      return res.render("products", {
        products: docs,
        totalPages,
        prevPage,
        nextPage,
        hasNextPage,
        hasPrevPage,
        prevLink,
        nextLink,
        page,
        cart: cart.length,
      });
    }
    const products = await productmanager.getProducts({}, opt);
    const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } =
      products;
    const { prevLink, nextLink } = links(products);
    if (page > totalPages)
      return res.render("No existe", { pageNotFound: "/products" });
    return res.render("products", {
      products: docs,
      totalPages,
      prevPage,
      nextPage,
      hasNextPage,
      hasPrevPage,
      prevLink,
      nextLink,
      page,
      cart: cart.length,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/products/inCart", async (req, res) => {
  const productsCart = await Promise.all(
    cart.map(async (product) => {
      const productDB = await productmanager.getProductById(product._id);
      return { title: productDB, quantity: product.quantity };
    })
  );
  return res.send({ cartLength: cart.length, productsCart });
});

router.post("/products", async (req, res) => {
  try {
    const { product, finish } = req.body;
    if (product) {
      if (product.quantity > 0) {
        const findId = cart.findIndex(
          (productCart) => productCart._id === product._id
        );
        findId !== -1
          ? cart[findId].quantity + -product.quantity
          : cart.push(product);
      }
    }
    if (finish) {
      await cartmanager.addCart(cart);
      cart.splice(0, cart.length);
    }
    return res.render("products");
  } catch (error) {
    console.log(error);
  }
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});

router.get("/messages", (req, res) => {
  res.render("messages");
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const result = await cartmanager.getCartById(cid);
    if (result === null || typeof result === "string")
      return res.render("cart", { result: false, message: "ID no existe" });
  } catch (err) {
    console.log(err);
  }
});

export default router;
