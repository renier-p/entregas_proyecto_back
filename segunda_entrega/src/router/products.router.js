import { Router } from "express";
import ProductManager from "../Dao/mongo/productsManagerMongo.js";

const manager = new ProductManager();
const router = Router();

router.get("/", async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query, disponible } = req.query;
    const opt = {
      page: Number(page),
      limit: Number(limit),
      lean: true,
    };

    if (sort) {
      opt.sort = { price: sort === "asc" ? 1 : -1 };
    }

    let filter = {};
    if (query) {
      filter.category = query;
    }
    if (disponible) {
      filter.status = disponible === "disponible" ? true : false;
    }

    const products = await manager.getProducts(filter, opt);
    res.status(200).json({
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.hasPrevPage ? products.prevPage : null,
      nextPage: products.hasNextPage ? products.nextPage : null,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({});
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const productfind = await manager.getProductById(req.params.pid);
    res.status(200).json({ status: "success", productfind });
  } catch (error) {
    res.status(200).json({ status: "error", message: "Error del servidor" });
  }
});

router.post("/products", async (req, res) => {
  try {
    const obj = req.body;
    const newproduct = await manager.addProduct(obj);
    res.status(201).json({ status: "success", newproduct });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Error del servidor",
        error: error.message,
      });
  }
});

router.put("/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const obj = req.body;
    const updateProduct = await manager.updateProduct(pid, obj);
    res.status(200).json({ status: "success", updateProduct });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Error del servidor",
        error: error.message,
      });
  }
});

router.delete("/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const deleteproduct = await manager.deleteProduct(pid);
    res.status(200).json({ status: "success", deleteproduct });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Error del servidor",
        error: error.message,
      });
  }
});

export default router