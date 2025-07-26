const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";

const app = next({
  dev,
  conf: { distDir: ".next" },
});

const handle = app.getRequestHandler();

// ✅ prepare() はリクエスト中ではなく最初に呼び出す
const server = async () => {
  await app.prepare();
  return async (req, res) => {
    try {
      await handle(req, res);
    } catch (e) {
      logger.error("Next.js request error", e);
      res.status(500).send("Internal Server Error");
    }
  };
};

// ✅ Cloud Functions v2 形式でエクスポート
exports.nextApp = onRequest(
  { timeoutSeconds: 60, memory: "512MiB", region: "us-central1" },
  async (req, res) => {
    const handler = await server();
    return handler(req, res);
  }
);
