import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    name: 'SQL Brush Up API',
    version: '1.0.0',
    note: 'SQL execution runs client-side via sql.js. This API is for health checks and future extensions.',
  });
});

app.listen(PORT, () => {
  console.log(`SQL Brush Up server running on http://localhost:${PORT}`);
});

export default app;
