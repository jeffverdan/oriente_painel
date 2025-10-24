// pages/_document.tsx
import { Html, Main, NextScript, Head } from "next/document";
import type { Metadata } from 'next';
import Logo from '@/images/OrienteRedondo.svg';

// Metadados para SEO
export const metadata: Metadata = {
  title: 'Oriente – Legalização de Empresas | Segurança e Agilidade',
  description:
    'Especialistas em abertura, alteração, regularização e baixa de empresas em todo o Brasil. Processos 100% online com mais de 14 anos de experiência.',
  keywords: 'abertura de empresa, legalização de empresas, CNPJ, alteração contratual, baixa de empresa',
};

const svg = encodeURIComponent(`
  ${Logo}
`);

export default function Document() {
  return (
    <Html suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
