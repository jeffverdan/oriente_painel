import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { nome, email, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.OAUTH_CLIENT_ID,
      process.env.OAUTH_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.OAUTH_REFRESH_TOKEN,
    });

    // Obtém o access token automaticamente
    const { token } = await oauth2Client.getAccessToken();
    if (!token) throw new Error('Não foi possível gerar o access token.');

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Monta o corpo do e-mail no formato RFC 2822 (Base64)
    const messageParts = [
      `From: ${process.env.EMAIL_USER}`,
      `To: ${process.env.EMAIL_USER}`,
      'Content-Type: text/plain; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: 📩 Novo contato pelo site`,
      '',
      `Nome: ${nome}`,
      `Email: ${email}`,
      '',
      `${mensagem}`,
    ];

    const message = messageParts.join('\n');
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Envia via Gmail API
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage },
    });

    console.log('✅ E-mail enviado via Gmail API:', response.data.id);

    return res.status(200).json({ message: 'Email enviado com sucesso!' });
  } catch (error) {
    console.error('❌ Erro ao enviar e-mail via Gmail API:', error);
    return res.status(500).json({
      error: 'Erro ao enviar email via Gmail API.',
      details: error,
    });
  }
}
