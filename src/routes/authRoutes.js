const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddlewares = require("../middlewares/authMiddlewares");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/profile", authMiddlewares, (req, res) => {
  res.json({
    message: "Rota protegida acessada!",
    user: req.user,
  });
});

module.exports = router;
