// src/pages/login.tsx
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'
import Image from 'next/image';
import Logo  from '@/images/Oriente_Simbolo_Branco.png'
import HeadSeo from '@/componentes/HeadSeo/HeadSeo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null); // Para substituir o alert()
  const router = useRouter();

  // Paleta de cores da marca
  const colors = {
    primaryBlue: '#2a4a75', // Azul escuro do fundo da logo
    accentGold: '#b88e44', // Dourado principal da logo
    accentGoldLight: '#d4b477', // Dourado mais claro (para subtítulos)
    accentGoldDark: '#a17c3a', // Dourado mais escuro (para hover)
  };

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push('/');
  }

  async function handleMagicLink() {
    if (!email) {
      setError('Por favor, insira seu e-mail para receber o link mágico.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({ email });

    setIsLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Usando o estado 'message' ao invés de alert()
    setMessage('E-mail com o link mágico enviado — verifique sua caixa de entrada.');
  }

  return (
    <>
      <HeadSeo titlePage='Login' description='Página de login para acesso ao sistema Oriente.' />
      <main
        className="flex min-h-screen items-center justify-center p-4 font-['Inter',_sans-serif] text-gray-800"
        style={{ backgroundColor: colors.primaryBlue }} // Aplicando o azul da marca no fundo
      >
        <div className="w-full max-w-md">
          {/* Cabeçalho com Logo e Título */}
          <div className="text-center align mb-8">
            {/* Recriamos a parte textual da logo para um visual mais limpo.
              Se preferir usar a imagem, substitua este bloco por:
              <img src="/caminho/para/Oriente - Logo - Fundo azul - 15cm.png" alt="Oriente Logo" className="w-48 mx-auto mb-4" />
            */}
            <Image src={Logo} className='mx-auto mb-4' alt="Oriente Logo" width={48} height={48} />

            <h1
              className="font-['Cinzel',_serif] text-5xl font-bold text-white tracking-wider"
            >
              ORIENTE
            </h1>
            <p
              className="text-xs tracking-[0.2em] uppercase mt-1"
              style={{ color: colors.accentGoldLight }}
            >
              Legalização de Empresas
            </p>
            <div
              className="w-24 h-0.5 mx-auto mt-4"
              style={{ backgroundColor: colors.accentGold }}
            ></div>
          </div>

          {/* Card de Login */}
          <div className="bg-white rounded-xl shadow-2xl p-8 pt-10">
            {/* Mensagem de Erro */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 text-sm p-3 rounded-lg mb-4 text-center">
                {error}
              </div>
            )}
            {/* Mensagem de Sucesso (para Magic Link) */}
            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 text-sm p-3 rounded-lg mb-4 text-center">
                {message}
              </div>
            )}

            <form onSubmit={handleSignIn}>
              {/* Campo de E-mail */}
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Seu e-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:border-blue-500 focus:ring-blue-500" // Removido o style inline que causava conflito
                    style={{
                      '--tw-ring-color': colors.accentGold,
                      borderColor: colors.accentGoldLight,
                    } as React.CSSProperties} // Tipagem para CSS variables
                    placeholder="nome@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Campo de Senha */}
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Sua senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:border-blue-500 focus:ring-blue-500" // Removido o style inline que causava conflito
                    style={{
                      '--tw-ring-color': colors.accentGold,
                      borderColor: colors.accentGoldLight,
                    } as React.CSSProperties}
                    placeholder="•••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.563 3.029m0 0l-3.29-3.29m0 0l-3.29 3.29"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        ></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Opções Adicionais */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center cursor-pointer">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" // Removido o style inline que causava conflito
                    style={{
                      '--tw-ring-color': colors.accentGold,
                      color: colors.accentGold,
                    } as React.CSSProperties}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 text-sm font-medium text-gray-600"
                  >
                    Lembrar-me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm hover:underline"
                  style={{ color: colors.accentGold }}
                >
                  Recuperar senha?
                </a>
              </div>

              {/* Botão de Login */}
              <button
                type="submit"
                className="w-full cursor-pointer flex justify-center items-center text-white font-medium rounded-lg text-sm px-5 py-3 text-center transition-colors duration-300 disabled:cursor-not-allowed focus:ring-4 focus:outline-none" // Adicionado focus styles
                style={{
                  backgroundColor: isLoading
                    ? colors.accentGoldLight
                    : colors.accentGold,
                  '--tw-ring-color': colors.accentGoldLight, // Usando o dourado claro para o anel de foco
                } as React.CSSProperties}
                onMouseOver={(e) =>
                  !isLoading &&
                  (e.currentTarget.style.backgroundColor = colors.accentGoldDark)
                }
                onMouseOut={(e) =>
                  !isLoading &&
                  (e.currentTarget.style.backgroundColor = colors.accentGold)
                }
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    A processar...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>

            {/* Divisor "OU" */}
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 flex-shrink text-sm text-gray-500">OU</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Botão de Magic Link */}
            <button
              type="button"
              onClick={handleMagicLink}
              className="w-full cursor-pointer flex justify-center items-center font-medium rounded-lg text-sm px-5 py-2.5 text-center border transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-4 focus:outline-none" // Adicionado focus styles
              style={{
                borderColor: colors.accentGold,
                color: colors.accentGold,
                // '--tw-ring-color': colors.accentGoldLight, // Usando o dourado claro para o anel de foco
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = colors.accentGold;
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.accentGold;
                }
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Aguarde...' : 'Receber link mágico por e-mail'}
            </button>
          </div>

          {/* Rodapé */}
          <footer className="text-center mt-8">
            <p className="text-sm text-gray-300">
              &copy; {new Date().getFullYear()} Oriente. Todos os direitos
              reservados.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}

