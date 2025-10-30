"use client"; // Necessário para hooks do React como useState

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
  Facebook,
  Instagram,
  Linkedin,
  MessagesSquare, // Ícone para o WhatsApp FAB
  Send,
  UserPlus
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// --- COMPONENTES REUTILIZÁVEIS ---

/**
 * Componente: Header
 * Barra de navegação fixa com menu responsivo.
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [
    { name: 'Serviços', href: '#services' },
    { name: 'Sobre', href: '#about' }, // Supondo um ID
    { name: 'Blog', href: '#blog' }, // Supondo um ID
    { name: 'Contato', href: '#contact' },
    { name: 'Painel', href: '/login' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-[#0D2A55] shadow-md z-50 font-inter">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="text-2xl font-bold font-poppins text-white">
          <Image
            src={LogoHorizontal}
            alt="Oriente Legalização"
            width={160}
            height={40}
          />
        </a>

        {/* Menu Desktop */}
        <div className="hidden md:flex space-x-6 lg:space-x-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`text-white hover:text-[#D9B465] transition-colors duration-200 ${item.name === 'Painel' ? 'text-[#B17C2D]' : ''}`}
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Botão do Menu Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menu"
            className="text-white"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Dropdown do Menu Mobile */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-[#0D2A55] shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="flex flex-col px-4 py-2">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setIsMenuOpen(false)} // Fecha o menu ao clicar
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
const HeroSection = () => {
  return (
    <section className="bg-white pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poppins text-[#0D2A55] mb-5 leading-tight">
          Legalize sua empresa com segurança e agilidade
        </h1>
        <p className="text-lg md:text-xl text-[#1C4C9A] font-inter mb-10 max-w-2xl mx-auto">
          Mais de 14 anos de experiência e processos 100% online para sua tranquilidade e foco no que realmente importa: seu negócio.
        </p>
        <a
          href="https://w.app/orientelegalizacao"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#B17C2D] text-white font-bold font-poppins py-3 px-10 text-lg rounded-lg shadow-lg hover:bg-[#D9B465] hover:text-[#0D2A55] transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Falar com um especialista
        </a>
      </div>
    </section>
  );
};

/**
 * Componente: Benefits
 * Seção de benefícios em cards.
 */
const Benefits = () => {
  const benefitsList = [
    {
      icon: <Globe size={48} className="text-[#B17C2D]" />,
      title: 'Atendimento em todo o Brasil',
      description: 'Nossa equipe está pronta para atender sua demanda de qualquer lugar do país.',
    },
    {
      icon: <ShieldCheck size={48} className="text-[#B17C2D]" />,
      title: 'Desde 2011, atuamos com excelência e credibilidade no mercado',
      description: 'Confie em quem entende do assunto para garantir a conformidade do seu negócio.',
    },
    {
      icon: <Clock size={48} className="text-[#B17C2D]" />,
      title: 'Processos 100% Online',
      description: 'Resolva tudo sem sair de casa, com agilidade, transparência e menos burocracia.',
    },
  ];

  return (
    <section className="py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefitsList.map((benefit, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-md text-center flex flex-col items-center"
            >
              <div className="mb-5">{benefit.icon}</div>
              <h3 className="text-xl font-bold font-poppins text-[#0D2A55] mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 font-inter">{benefit.description}</p>
            </div>
          ))}
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
      title: 'Constituição de Empresa',
      description: 'Abrimos seu CNPJ do zero, cuidando de todo o processo burocrático para você.',
    },
    {
      icon: <UserPlus size={40} className="text-[#1C4C9A]" />,
      title: 'Formalização de MEI',
      description: 'Cuidamos da criação completa do seu MEI, deixando tudo pronto para emitir notas fiscais e atuar legalmente.',
    },
    {
      icon: <FileDiff size={40} className="text-[#1C4C9A]" />,
      title: 'Alteração Contratual',
      description: 'Mudança de endereço, sócios, atividades (CNAEs) ou qualquer outra atualização necessária.',
    },
    {
      icon: <RefreshCw size={40} className="text-[#1C4C9A]" />,
      title: 'Regularização de Empresa',
      description: 'Deixe sua empresa em dia com todas as obrigações fiscais e legais.',
    },
    {
      icon: <FileX size={40} className="text-[#1C4C9A]" />,
      title: 'Baixa de Empresa',
      description: 'Encerre seu CNPJ de forma correta, evitando problemas e dívidas futuras.',
    },
  ];

  return (
    <section id="services" className="py-20 bg-[#0D2A55]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold font-poppins text-white text-center mb-12">
          Soluções Completas para sua Empresa
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {servicesList.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold font-poppins text-[#0D2A55] mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 font-inter mb-5 flex-grow">
                {service.description}
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
      name: 'João Silva',
      title: 'CEO da TechInova',
      quote:
        'A Oriente Legalização foi fundamental para abrir minha startup. O processo foi rápido, 100% online e a equipe foi muito atenciosa. Recomendo!',
      image: 'https://placehold.co/80x80/D9B465/0D2A55?text=JS',
    },
    {
      name: 'Maria Oliveira',
      title: 'Dona da Café & Arte',
      quote:
        'Eu estava com pendências na minha empresa e não sabia por onde começar. Eles resolveram tudo em tempo recorde. Profissionais de confiança!',
      image: 'https://placehold.co/80x80/B17C2D/FFFFFF?text=MO',
    },
  ];

  return (
    <section id="about" className="py-20 bg-[#F5F5F5]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold font-poppins text-[#0D2A55] text-center mb-12">
          O que nossos clientes dizem
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {testimonialsList.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-lg relative"
            >
              <div className="flex text-[#D9B465] mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-700 font-inter italic text-lg mb-6">
                {`"${testimonial.quote}"`}
              </p>
              <div className="flex items-center">
                <Image
                  width={16}
                  height={16}
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mr-4 border-2 border-[#D9B465]"
                />
                <div>
                  <h4 className="text-lg font-bold font-poppins text-[#0D2A55]">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-500 font-inter">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Componente: ContactForm
 * Seção com formulário de contato e CTA principal.
 */
const ContactForm = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lógica de envio do formulário (ex: API, Netlify Forms)
    alert('Mensagem enviada com sucesso! (Simulação)');
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Coluna de Texto e CTA */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-poppins text-[#0D2A55] mb-4">
              Dê o primeiro passo para o sucesso
            </h2>
            <p className="text-lg text-gray-700 font-inter mb-8">
              Preencha o formulário e nossa equipe de especialistas entrará em contato em até 24h para entender sua necessidade.
            </p>
            <p className="text-lg text-gray-700 font-inter mb-8">
              Prefere agilidade? <br />
              <strong>Clique no botão abaixo</strong> e fale conosco agora mesmo pelo WhatsApp.
            </p>
            <a
              href="https://w.app/orientelegalizacao"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#B17C2D] text-white font-bold font-poppins py-3 px-10 text-lg rounded-lg shadow-lg hover:bg-[#D9B465] hover:text-[#0D2A55] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Falar agora via WhatsApp
            </a>
          </div>

          {/* Coluna do Formulário */}
          <form
            onSubmit={handleSubmit}
            className="bg-[#F5F5F5] p-8 rounded-lg shadow-md font-inter"
          >
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-[#0D2A55] mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
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
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1C4C9A] focus:border-[#1C4C9A]"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-[#0D2A55] mb-1">
                Telefone / WhatsApp
              </label>
              <input
                type="tel"
                id="phone"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1C4C9A] focus:border-[#1C4C9A]"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-[#0D2A55] mb-1">
                Mensagem (Descreva sua necessidade)
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#1C4C9A] focus:border-[#1C4C9A]"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-[#0D2A55] text-white font-bold font-poppins py-3 px-6 rounded-lg text-lg hover:bg-[#1C4C9A] transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <Send size={20} />
              <span>Enviar Mensagem</span>
            </button>
          </form>
        </div>
      </div>
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
              Oriente Legalização
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
            <div className="flex space-x-5 mt-6">
              {/* <a href="#" aria-label="Facebook" className="text-gray-300 hover:text-[#D9B465] transition-colors"><Facebook size={24} /></a> */}
              <a href="https://www.instagram.com/oriente_legalizacao"  aria-label="Instagram" className="text-gray-300 hover:text-[#D9B465] transition-colors"><Instagram size={24} /></a>
              {/* <a href="#" aria-label="LinkedIn" className="text-gray-300 hover:text-[#D9B465] transition-colors"><Linkedin size={24} /></a> */}
            </div>
          </div>
        </div>

        {/* Linha de Copyright */}
        <div className="border-t border-[#1C4C9A] mt-10 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Oriente Legalização. Todos os direitos reservados.
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
      href="https://w.app/orientelegalizacao"
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
  return (
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
  );
}


