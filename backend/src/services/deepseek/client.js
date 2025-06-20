const { OLLAMA_URL } = require("../../config/ollamaConfig");

class DeepSeekClient {
  static instance = null;

  constructor() {
    if (DeepSeekClient.instance) {
      return DeepSeekClient.instance;
    }

    this.url = `${OLLAMA_URL}/api/generate`;
    DeepSeekClient.instance = this;
  }

  async generarRespuesta(prompt, model = "llama3.2:latest") {
    const body = {
      model,
      prompt,
      stream: false,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120_000);

    const response = await fetch(this.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error en DeepSeek: ${error}`);
    }

    return await response.json();
  }
}

module.exports = new DeepSeekClient();
