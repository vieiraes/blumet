'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Info, Menu, X, Github, CloudRain } from 'lucide-react';
import UpdateButton from './UpdateButton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HeaderProps {
  lastUpdate?: string;
}

export default function Header({ lastUpdate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Formatar data de última atualização - formato 24h para evitar confusão AM/PM
  const formattedDate = lastUpdate
    ? format(new Date(lastUpdate), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })
    : null;

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-md' : ''
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo e Título */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10">
              <CloudRain className="h-10 w-10 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-none">BLUmet</h1>
              <p className="text-xs text-gray-500 leading-none">Monitoramento de Chuvas</p>
            </div>
          </Link>

          {/* Informações e Última Atualização (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {formattedDate && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Última atualização</p>
                <p className="text-sm font-medium text-gray-800">{formattedDate}</p>
              </div>
            )}
            
            {/* Botão de Atualizar */}
            <UpdateButton />

            {/* Links de navegação */}
            <Link 
              href="/sobre" 
              className="text-gray-600 hover:text-blue-600 flex items-center gap-1 text-sm font-medium"
            >
              <Info className="h-4 w-4" />
              <span>Sobre</span>
            </Link>
            
            <Link 
              href="https://github.com/vieiraes/blumet" 
              target="_blank"
              className="text-gray-600 hover:text-blue-600 flex items-center gap-1 text-sm font-medium"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </Link>
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden flex items-center">
            {formattedDate && (
              <div className="text-right mr-4">
                <p className="text-xs text-gray-500">Atualizado</p>
                <p className="text-xs font-medium text-gray-800">{formattedDate.split(' às ')[1]}</p>
              </div>
            )}
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu dropdown mobile */}
      <div 
        className={`md:hidden bg-white border-t border-gray-200 overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
          <UpdateButton />
          
          <div className="flex justify-around border-t border-gray-100 pt-4">
            <Link 
              href="/sobre" 
              className="text-gray-600 hover:text-blue-600 flex flex-col items-center gap-1"
              onClick={() => setIsMenuOpen(false)}
            >
              <Info className="h-5 w-5" />
              <span className="text-xs">Sobre</span>
            </Link>
            
            <Link 
              href="https://github.com/vieiraes/blumet" 
              target="_blank"
              className="text-gray-600 hover:text-blue-600 flex flex-col items-center gap-1"
              onClick={() => setIsMenuOpen(false)}
            >
              <Github className="h-5 w-5" />
              <span className="text-xs">GitHub</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
