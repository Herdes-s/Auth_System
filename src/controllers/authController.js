const connection = require("../database/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validação simples
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatorios!" });
  }

  try {
    // Verificar se email já existe
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Erro no servidor!" });
        }

        if (results.length > 0) {
          return res.status(400).json({ error: "Email já cadastrado!" });
        }

        // Criptografar senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Inserir no banco
        connection.query(
          "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
          [name, email, hashedPassword],
          (err) => {
            if (err) {
              return res.status(500).json({ error: "Erro ao criar usuario!" });
            }

            return res
              .status(201)
              .json({ message: "Usuario criado com sucesso!" });
          },
        );
      },
    );
  } catch (error) {
    return res.status(500).json({ error: "Erro interno!" });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  // Validar
  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatorios!" });
  }

  // Procurar usuario no banco
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Erro no servidor!" });
      }

      if (results.length === 0) {
        return res.status(400).json({ error: "Usuario não encontrado!" });
      }

      const user = results[0];

      // Comparar senha digitada com senha criptografada
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(400).json({ error: "Senha incorreta!" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );

      return res.json({
        message: "Login realizado com sucesso!",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
      });
    },
  );
};
