import React from 'react';
import { ShoppingBag, Ruler, Compass, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenMeasurements: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  cartCount,
  onOpenCart,
  onOpenMeasurements
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E6E0D6] transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <a 
          href="#home" 
          onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
          className="font-serif text-2xl tracking-wider text-[#1A1A1A] hover:text-[#7D5A44] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span>AURELIA COUTURE</span>
          <span className="hidden sm:inline-block text-[10px] tracking-widest uppercase font-sans font-semibold text-[#7D5A44] border-l border-[#D5CBBF] pl-2.5">
            Bespoke Tailoring PK
          </span>
        </a>

        {/* Zone 2: 4-5 Concise Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#57534E]">
          <button
            onClick={() => onNavigate('studio')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeSection === 'studio' ? 'text-[#1A1A1A] font-semibold' : 'hover:text-[#1A1A1A]'
            }`}
          >
            Custom Studio
            {activeSection === 'studio' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#1A1A1A]" />
            )}
          </button>

          <button
            onClick={() => onNavigate('lookbook')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeSection === 'lookbook' ? 'text-[#1A1A1A] font-semibold' : 'hover:text-[#1A1A1A]'
            }`}
          >
            Lookbook
            {activeSection === 'lookbook' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#1A1A1A]" />
            )}
          </button>

          <button
            onClick={() => onNavigate('fabrics')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeSection === 'fabrics' ? 'text-[#1A1A1A] font-semibold' : 'hover:text-[#1A1A1A]'
            }`}
          >
            Fabric Vault
            {activeSection === 'fabrics' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#1A1A1A]" />
            )}
          </button>

          <button
            onClick={onOpenMeasurements}
            className="whitespace-nowrap shrink-0 transition-colors py-1 hover:text-[#1A1A1A] flex items-center gap-1.5"
          >
            <Ruler className="w-4 h-4 text-[#8C7A6B]" />
            Measurement Guide
          </button>

          <button
            onClick={() => onNavigate('tracker')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeSection === 'tracker' ? 'text-[#1A1A1A] font-semibold' : 'hover:text-[#1A1A1A]'
            }`}
          >
            Order Tracker
            {activeSection === 'tracker' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#1A1A1A]" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Cart Bag */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={onOpenCart}
            aria-label="View shopping bag"
            className="relative p-2.5 rounded-full text-[#1A1A1A] hover:bg-[#EFECE6] transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#7D5A44] text-white text-[11px] font-semibold rounded-full flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('studio')}
            className="px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-white bg-[#1A1A1A] hover:bg-[#33312E] transition-all whitespace-nowrap shrink-0 rounded-sm shadow-sm"
          >
            Start Stitching
          </button>
        </div>
      </div>
    </header>
  );
};
