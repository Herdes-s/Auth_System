require("dotenv").config();
const app = require("./src/app");

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta: ${process.env.PORT}`);
});
