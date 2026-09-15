import express from 'express';

const app = express();
const PORT = 3000;

// Middleware para JSON
app.use(express.json());

// Rota inicial (GET)
app.get('/', (req, res) => {
  res.send('Servidor Express com ES Modules rodando!');
});

// Rota de teste em JSON (GET)
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    modulo: 'ES Modules',
    timestamp: new Date()
  });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});