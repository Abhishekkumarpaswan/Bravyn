const {
  getProductById,
  getProducts,
} = require("../controllers/products.controller");
const { Router } = require("express");
const router = Router();
router.get("/", getProducts);
router.get("/:id", getProductById);
//router.post("/",addP)

module.exports = router;
