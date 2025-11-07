"use client"; // Necessário para hooks do React como useState

import Head from "next/head";
import React, { useState } from 'react';
import LogoHorizontal from '@/images/OrienteHorizontal.png'

// Importando ícones do lucide-react
import {
  ShieldCheck,
  Globe,
  Clock,
  FileText,
  FileDiff,
  RefreshCw,
  FileX,
  Star,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Instagram,
  MessagesSquare, // Ícone para o WhatsApp FAB
  Send,
  CheckCircle,
  UserPlus
} from 'lucide-react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// --- COMPONENTES REUTILIZÁVEIS ---

/**
 * Componente: Header
 * Barra de navegação fixa com menu responsivo.
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [
    { name: "Serviços", href: "#services" },
    { name: "Sobre", href: "#about" },
    { name: "Blog", href: "#blog" },
    { name: "Contato", href: "#contact" },
    { name: "Painel", href: "/login" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-[#0D2A55] shadow-md z-50 font-inter">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold font-poppins text-white">
          <Image
            src={LogoHorizontal}
            alt="Oriente Legalização de Empresas"
            width={160}
            height={40}
            priority
          />
        </a>

        {/* Menu Desktop */}
        <div className="hidden md:flex space-x-6 lg:space-x-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`text-white hover:text-[#D9B465] transition-colors duration-200 ${item.name === "Painel" ? "text-[#B17C2D]" : ""
                }`}
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Botão Mobile */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir menu"
          className="md:hidden text-white"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Menu Mobile */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-[#0D2A55] shadow-lg transition-all duration-300 overflow-hidden ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="flex flex-col px-4 py-2">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="py-3 text-lg text-white hover:bg-[#1C4C9A] rounded-md text-center"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

/**
 * Componente: Hero Section
 * Seção principal de boas-vindas.
 */
const HeroSection = () => (
  <section className="bg-white pt-28 sm:pt-32 pb-20 md:pb-28 text-center">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poppins text-[#0D2A55] mb-5 leading-tight">
        Legalização de Empresas com Segurança e Agilidade
      </h1>
      <p className="text-lg md:text-xl text-[#1C4C9A] font-inter mb-10 max-w-2xl mx-auto">
        Abra, altere ou regularize sua empresa 100% online. São mais de 14 anos
        de experiência oferecendo tranquilidade e foco no que realmente importa:
        o seu negócio.
      </p>
      <a
        href="https://wa.me/5521933006931?text=Ol%C3%A1!%20Gostaria%20de%20abrir%20ou%20regularizar%20minha%20empresa."
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-[#B17C2D] text-white font-bold font-poppins py-3 px-10 text-lg rounded-lg shadow-lg hover:bg-[#D9B465] hover:text-[#0D2A55] transition-all duration-300 transform hover:-translate-y-0.5"
      >
        Falar com um especialista
      </a>
      <p className="text-sm mt-4 text-gray-600">
        Precisa abrir sua empresa hoje?{" "}
        <a href="#contact" className="underline text-[#B17C2D]">
          Fale agora mesmo.
        </a>
      </p>
    </div>
  </section>
);

/**
 * Componente: Benefits
 * Seção de benefícios em cards.
 */
const Benefits = () => {
  const benefitsList = [
    {
      icon: <Globe size={48} className="text-[#B17C2D]" />,
      title: "Atendimento em todo o Brasil",
      description:
        "Nossa equipe está pronta para atender sua demanda de qualquer lugar do país.",
    },
    {
      icon: <ShieldCheck size={48} className="text-[#B17C2D]" />,
      title: "Excelência e Credibilidade desde 2011",
      description:
        "Confie em quem entende do assunto para garantir a conformidade do seu negócio.",
    },
    {
      icon: <Clock size={48} className="text-[#B17C2D]" />,
      title: "Processos 100% Online",
      description:
        "Resolva tudo sem sair de casa, com agilidade, transparência e menos burocracia.",
    },
  ];

  return (
    <section className="py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefitsList.map((b, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-lg shadow-md text-center flex flex-col items-center"
            >
              <div className="mb-5">{b.icon}</div>
              <h3 className="text-xl font-bold font-poppins text-[#0D2A55] mb-3">
                {b.title}
              </h3>
              <p className="text-gray-600 font-inter">{b.description}</p>
            </div>
          ))}
        </div>
        {/* Selo de confiança */}
        <div className="text-center mt-10 text-sm text-gray-500 italic">
          Recomendado por escritórios contábeis de todo o Brasil ✅
        </div>
      </div>
    </section>
  );
};

/**
 * Componente: Services
 * Seção de serviços oferecidos.
 */
const Services = () => {
  const servicesList = [
    {
      icon: <FileText size={40} className="text-[#1C4C9A]" />,
      title: "Constituição de Empresa",
      description:
        "Abrimos seu CNPJ do zero, cuidando de todo o processo burocrático para você.",
    },
    {
      icon: <UserPlus size={40} className="text-[#1C4C9A]" />,
      title: "Formalização de MEI",
      description:
        "Cuidamos da criação completa do seu MEI, deixando tudo pronto para emitir notas fiscais e atuar legalmente.",
    },
    {
      icon: <FileDiff size={40} className="text-[#1C4C9A]" />,
      title: "Alteração Contratual",
      description:
        "Mudança de endereço, sócios, CNAEs ou qualquer atualização necessária.",
    },
    {
      icon: <RefreshCw size={40} className="text-[#1C4C9A]" />,
      title: "Regularização de Empresa",
      description:
        "Deixe sua empresa em dia com todas as obrigações fiscais e legais.",
    },
    {
      icon: <FileX size={40} className="text-[#1C4C9A]" />,
      title: "Baixa de Empresa",
      description:
        "Encerre seu CNPJ de forma correta, evitando problemas e dívidas futuras.",
    },
  ];

  return (
    <section id="services" className="py-20 bg-[#0D2A55]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold font-poppins text-white text-center mb-12">
          Soluções Completas para sua Empresa
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {servicesList.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-6 flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-4">{s.icon}</div>
              <h3 className="text-xl font-bold font-poppins text-[#0D2A55] mb-3">
                {s.title}
              </h3>
              <p className="text-gray-600 font-inter mb-5 flex-grow">
                {s.description}
              </p>
              <a
                href="#contact"
                className="font-bold font-poppins text-[#B17C2D] hover:text-[#D9B465] transition-colors"
              >
                Solicitar Orçamento
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Componente: Testimonials
 * Seção de depoimentos de clientes.
 */
const Testimonials = () => {
  const testimonialsList = [
    {
      name: "João Silva",
      title: "CEO da TechInova",
      quote:
        "A Oriente Legalização de Empresas foi fundamental para abrir minha startup. O processo foi rápido, 100% online e a equipe foi muito atenciosa. Recomendo!",
      image: "https://placehold.co/80x80/D9B465/0D2A55?text=JS",
    },
    {
      name: "Maria Oliveira",
      title: "Dona da Café & Arte",
      quote:
        "Eu estava com pendências na minha empresa e não sabia por onde começar. Eles resolveram tudo em tempo recorde. Profissionais de confiança!",
      image: "https://placehold.co/80x80/B17C2D/FFFFFF?text=MO",
    },
    {
      name: "Carlos Mendes",
      title: "Empresário – CM Logística",
      quote:
        "Minha empresa estava com CNPJ suspenso e a Oriente cuidou de tudo com total transparência. Atendimento impecável!",
      image: "https://placehold.co/80x80/0D2A55/FFFFFF?text=CM",
    },
    {
      name: "Fernanda Rocha",
      title: "Consultora de Marketing",
      quote:
        "Nunca pensei que abrir um CNPJ pudesse ser tão simples. Fiz tudo pelo celular e recebi minha documentação no mesmo dia!",
      image: "https://placehold.co/80x80/D9B465/FFFFFF?text=FR",
    },
    {
      name: "Lucas Pereira",
      title: "Sócio da LP Construtora",
      quote:
        "A equipe da Oriente me orientou em cada etapa da alteração contratual. Atendimento rápido e muito profissional.",
      image: "https://placehold.co/80x80/B17C2D/FFFFFF?text=LP",
    },
    {
      name: "Patrícia Gomes",
      title: "Advogada",
      quote:
        "Excelente experiência! Precisei regularizar minha empresa e todo o processo foi feito de forma clara e segura.",
      image: "https://placehold.co/80x80/0D2A55/FFFFFF?text=PG",
    },
    {
      name: "Rodrigo Alves",
      title: "Fundador da RaTech",
      quote:
        "Serviço de alta qualidade! Cumpriram todos os prazos e me mantiveram informado a cada atualização.",
      image: "https://placehold.co/80x80/D9B465/0D2A55?text=RA",
    },
    {
      name: "Juliana Costa",
      title: "Proprietária da Bela Estética",
      quote:
        "Com a ajuda da Oriente consegui finalmente colocar minha clínica em dia com todos os órgãos públicos. Sensacional!",
      image: "https://placehold.co/80x80/B17C2D/FFFFFF?text=JC",
    },
    {
      name: "André Souza",
      title: "Contador Autônomo",
      quote:
        "Como contador, recomendo a Oriente a todos os meus clientes. São rápidos, seguros e conhecem bem a legislação.",
      image: "https://placehold.co/80x80/0D2A55/FFFFFF?text=AS",
    },
    {
      name: "Renata Martins",
      title: "Empreendedora",
      quote:
        "Fiquei surpresa com o nível de suporte que recebi. Eles realmente se preocupam em resolver e não apenas vender.",
      image: "https://placehold.co/80x80/D9B465/0D2A55?text=RM",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-[#F5F5F5]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold font-poppins text-[#0D2A55] text-center mb-12">
          O que nossos clientes dizem
        </h2>

        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4500 }}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{ 768: { slidesPerView: 2 } }}
          style={{ paddingBottom: "40px" }} // 🔹 Espaço extra para as bolinhas
        >
          {testimonialsList.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div
                className="bg-white p-8 rounded-lg shadow-lg flex flex-col justify-between"
                style={{
                  minHeight: "360px",
                }}
              >
                <div>
                  <div className="flex text-[#D9B465] mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={20} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-gray-700 font-inter italic text-lg mb-6 leading-relaxed">
                    {`"${testimonial.quote}"`}
                  </p>
                </div>

                <div className="flex items-center mt-auto">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={64}
                    height={64}
                    unoptimized
                    className="w-16 h-16 rounded-full mr-4 border-2 border-[#D9B465] object-cover"
                  />
                  <div>
                    <h4 className="text-lg font-bold font-poppins text-[#0D2A55]">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-500 font-inter">
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

/**
 * Componente: ContactForm
 * Seção com formulário de contato e CTA principal.
 */
const ContactForm = () => {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', mensagem: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log("OAUTH_CLIENT_ID: ", process.env.NEXT_PUBLIC_EMAIL_USER);


    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          mensagem: `${form.mensagem}\nTelefone: ${form.telefone}`,
        }),
      });

      if (!res.ok) throw new Error('Erro ao enviar e-mail.');

      setIsModalOpen(true);
      setForm({ nome: '', email: '', telefone: '', mensagem: '' });
    } catch (err) {
      alert('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Coluna de texto */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-poppins text-[#0D2A55] mb-4">
              Dê o primeiro passo para o sucesso
            </h2>
            <p className="text-lg text-gray-700 font-inter mb-8">
              Preencha o formulário e nossa equipe entrará em contato em até 24h para entender sua necessidade.
            </p>
            <p className="text-lg text-gray-700 font-inter mb-8">
              Prefere agilidade? <br />
              <strong>Clique abaixo</strong> e fale conosco agora pelo WhatsApp.
            </p>
            <a
              href="https://wa.me/5521933006931?text=Ol%C3%A1!%20Gostaria%20de%20obter%20mais%20informa%C3%A7%C3%B5es%20sobre%20seus%20servi%C3%A7os."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#B17C2D] text-white font-bold font-poppins py-3 px-10 text-lg rounded-lg shadow-lg hover:bg-[#D9B465] hover:text-[#0D2A55] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Falar via WhatsApp
            </a>
          </div>

          {/* Coluna do formulário */}
          <form
            onSubmit={handleSubmit}
            className="bg-[#F5F5F5] p-8 rounded-lg shadow-md font-inter"
          >
            <div className="mb-4">
              <label htmlFor="nome" className="block text-sm font-medium text-[#0D2A55] mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                id="nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1C4C9A] focus:border-[#1C4C9A]"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-[#0D2A55] mb-1">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1C4C9A] focus:border-[#1C4C9A]"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="telefone" className="block text-sm font-medium text-[#0D2A55] mb-1">
                Telefone / WhatsApp
              </label>
              <input
                type="tel"
                id="telefone"
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1C4C9A] focus:border-[#1C4C9A]"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="mensagem" className="block text-sm font-medium text-[#0D2A55] mb-1">
                Mensagem (Descreva sua necessidade)
              </label>
              <textarea
                id="mensagem"
                rows={4}
                value={form.mensagem}
                onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1C4C9A] focus:border-[#1C4C9A]"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0D2A55] text-white font-bold font-poppins py-3 px-6 rounded-lg text-lg hover:bg-[#1C4C9A] transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-70"
            >
              <Send size={20} />
              <span>{loading ? 'Enviando...' : 'Enviar Mensagem'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* 🌟 MODAL DE CONFIRMAÇÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-fade-in">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#0D2A55] mb-2">
              Mensagem Enviada!
            </h3>
            <p className="text-gray-600 mb-6">
              Recebemos sua mensagem com sucesso. Nossa equipe entrará em contato em breve!
            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-[#0D2A55] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#1C4C9A] transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

/**
 * Componente: Footer
 * Rodapé da página.
 */
const Footer = () => {
  return (
    <footer className="bg-[#0D2A55] text-white pt-16 pb-8 font-inter">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Coluna 1: Sobre */}
          <div>
            <h3 className="text-2xl font-bold font-poppins mb-4">
              Oriente Legalização de Empresas
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Simplificando a burocracia para você focar no seu crescimento.
            </p>
            <p className="text-gray-400 text-xs">
              CNPJ: 51.697.242/0001-17 <br />
              Duque de Caxias - RJ
            </p>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div>
            <h4 className="text-lg font-bold font-poppins mb-4">
              Links Rápidos
            </h4>
            <ul className="space-y-2">
              <li><a href="#services" className="text-gray-300 hover:text-[#D9B465] transition-colors">Serviços</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-[#D9B465] transition-colors">Quem Somos</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-[#D9B465] transition-colors">Contato</a></li>

            </ul>
          </div>

          {/* Coluna 3: Contato e Redes */}
          <div>
            <h4 className="text-lg font-bold font-poppins mb-4">
              Entre em Contato
            </h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center space-x-2">
                <Phone size={18} />
                <span>(21) 93300-6931</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={18} />
                <span>contato@orientelegalizacao.com.br</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={18} />
                <span>Atendimento 100% Digital</span>
              </li>
            </ul>
            <div className="flex space-x-2 mt-6">
              {/* <a href="#" aria-label="Facebook" className="text-gray-300 hover:text-[#D9B465] transition-colors"><Facebook size={24} /></a> */}
              <a href="https://www.instagram.com/oriente_legalizacao" aria-label="Instagram" className="text-gray-300 hover:text-[#D9B465] transition-colors"><Instagram size={24} /></a>
              <span>@oriente_legalizacao</span>
              {/* <a href="#" aria-label="LinkedIn" className="text-gray-300 hover:text-[#D9B465] transition-colors"><Linkedin size={24} /></a> */}
            </div>
          </div>
        </div>

        {/* Linha de Copyright */}
        <div className="border-t border-[#1C4C9A] mt-10 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Oriente Legalização de Empresas. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

/**
 * Componente: WhatsApp FAB (Floating Action Button)
 * Botão flutuante para contato rápido via WhatsApp.
 */
const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/5521933006931?text=Ol%C3%A1!%20Gostaria%20de%20obter%20mais%20informa%C3%A7%C3%B5es%20sobre%20seus%20servi%C3%A7os."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com um especialista no WhatsApp"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition-all duration-300 transform hover:scale-110"
    >
      <MessagesSquare size={32} />
    </a>
  );
};


/**
 * Componente Principal: App
 * Monta a página inteira.
 */
export default function App() {
  return (<>
    <Head>
      <title>Oriente Legalização – Abertura e Regularização de Empresas em Todo o Brasil</title>
      <meta
        name="description"
        content="Mais de 14 anos legalizando empresas com agilidade e segurança. Abertura, alteração e baixa de CNPJ 100% online. Peça seu orçamento agora!"
      />
      <meta
        name="keywords"
        content="legalização de empresas, abrir empresa, CNPJ, alteração contratual, baixa de empresa, abrir MEI, constituição de empresa, Oriente Legalização"
      />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://www.orientelegalizacao.com.br/" />
      <meta property="og:title" content="Oriente Legalização – Abertura e Regularização de Empresas em Todo o Brasil" />
      <meta property="og:description" content="Mais de 14 anos legalizando empresas 100% online. Abertura, alteração e baixa de CNPJ com segurança e agilidade." />
      <meta property="og:url" content="https://www.orientelegalizacao.com.br/" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://www.orientelegalizacao.com.br/og-banner.jpg" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Oriente Legalização de Empresas",
            "url": "https://www.orientelegalizacao.com.br",
            "logo": "https://www.orientelegalizacao.com.br/logo.png",
            "description":
              "Mais de 14 anos legalizando empresas com agilidade e segurança. Abertura, alteração e baixa de CNPJ 100% online.",
            "telephone": "+55 21 98811-1558",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Duque de Caxias",
              "addressRegion": "RJ",
              "addressCountry": "BR",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Quanto tempo demora para abrir uma empresa?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "O processo leva de 1 a 5 dias úteis, dependendo do estado e da Junta Comercial."
                },
              },
              {
                "@type": "Question",
                "name": "Posso abrir empresa 100% online?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sim. A Oriente Legalização realiza todo o processo digitalmente, com assinatura eletrônica."
                },
              },
            ],
          }),
        }}
      />
    </Head>

    {/* Resto do seu conteúdo */}
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <HeroSection />
        <Benefits />
        <Services />
        <Testimonials />
        <ContactForm />
      </main>

      <Footer />

      <WhatsAppButton />
    </div>
  </>
  );
}


