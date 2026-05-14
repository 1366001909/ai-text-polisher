import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 3000);
const deepseekApiKey = (process.env.DEEPSEEK_API_KEY || '').trim();
const deepseekUrl = 'https://api.deepseek.com/chat/completions';

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/chat/completions', async (req, res) => {
  if (!deepseekApiKey) {
    return res.status(500).json({
      error: {
        message: 'Server API key is missing. Please configure DEEPSEEK_API_KEY.',
      },
    });
  }

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), 30_000);

  try {
    const upstreamResponse = await fetch(deepseekUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${deepseekApiKey}`,
      },
      body: JSON.stringify(req.body),
      signal: controller.signal,
    });

    const rawBody = await upstreamResponse.text();
    clearTimeout(timeoutHandle);

    res.status(upstreamResponse.status);
    try {
      res.json(JSON.parse(rawBody));
    } catch {
      res.send(rawBody);
    }
  } catch (error) {
    clearTimeout(timeoutHandle);

    const isTimeout = error instanceof Error && error.name === 'AbortError';
    return res.status(isTimeout ? 504 : 502).json({
      error: {
        message: isTimeout ? 'DeepSeek request timeout after 30 seconds.' : 'Failed to proxy DeepSeek request.',
      },
    });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`AI Text Polisher server is running at http://0.0.0.0:${port}`);
});
