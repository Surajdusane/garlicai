import OpenAI from "openai";
import { loadJson } from "@/utils"; 
import { CONFIG_FILE } from "@/constents/config"; 

let _client: OpenAI | null = null;

interface Config {
  apiKey: string;
}

export async function getClient(): Promise<OpenAI> {
  if (_client) return _client;

  const cfg = (await loadJson(CONFIG_FILE)) as Config;

  if (!cfg?.apiKey) {
    throw new Error(
      "API key not found. Please delete setup.json and restart."
    );
  }

  _client = new OpenAI({ apiKey: cfg.apiKey });
  return _client;
}

/** Validate an API key with a cheap models list call */
export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const client = new OpenAI({ apiKey });
    await client.models.list();
    return true;
  } catch {
    return false;
  }
}