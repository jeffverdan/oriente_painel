import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { cnpj, days } = req.query;

    if (!cnpj) {
      return res.status(400).json({ error: "CNPJ não informado" });
    }

    const url = `https://receitaws.com.br/v1/cnpj/${cnpj}`;
    console.log("🔍 Consultando ReceitaWS:", url);

    const { data } = await axios.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer 123", // substitua pelo token real
      },
    });

    console.log("✅ Dados recebidos:", data);
    return res.status(200).json(data);
  } catch (error) {
    console.error("❌ Erro ao consultar ReceitaWS:", error);

    return res.status(500).json({ error: "Erro interno ao consultar ReceitaWS" });
  }
}
