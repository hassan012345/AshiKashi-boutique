import React, { useState } from 'react';
import { LOOKBOOK_SHOWCASE } from '../data/atelierData';
import { ArrowUpRight, Scissors, Clock } from 'lucide-react';
import { GarmentCategory, NecklineType, SleeveType, HemLength } from '../types/stitching';

interface LookbookSectionProps {
  onCustomizeStyle: (preset: {
    garmentId: GarmentCategory;
    neckline: NecklineType;
    sleeve: SleeveType;
    length: HemLength;
    fabricId: string;
    colorHex: string;
    colorName: string;
  }) => void;
}

export const LookbookSection: React.FC<LookbookSectionProps> = ({ onCustomizeStyle }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'maxi' | 'shalwar_kameez' | 'kalidar'>('all');

  const filteredLooks = LOOKBOOK_SHOWCASE.filter(look => {
    if (activeFilter === 'maxi') return look.garmentId === 'formal_maxi';
    if (activeFilter === 'shalwar_kameez') return look.garmentId === 'shalwar_kameez';
    if (activeFilter === 'kalidar') return look.garmentId === 'kalidar_frock';
    return true;
  });

  return (
    <section id="lookbook" className="py-16 lg:py-24 border-b border-[#E6E0D6] bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#EAE5DD]">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#7D5A44] font-medium">
              Pakistani Bridal, Festive & Luxury Pret Lookbook
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] mt-2">
              The Festive Couture Showcase
            </h2>
            <p className="text-sm text-[#57534E] mt-2 max-w-xl font-light">
              Signature custom-stitched Pakistani ensembles tailored for weddings, Eid celebrations, and formal galas across Lahore, Karachi, and Islamabad.
            </p>
          </div>

          {/* Functional Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#EFECE6] p-1 rounded-sm text-xs font-medium shrink-0">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-sm transition-colors ${
                activeFilter === 'all' ? 'bg-white text-[#1A1A1A] shadow-xs font-semibold' : 'text-[#78716C] hover:text-[#1A1A1A]'
              }`}
            >
              All Styles
            </button>
            <button
              onClick={() => setActiveFilter('shalwar_kameez')}
              className={`px-3 py-1.5 rounded-sm transition-colors ${
                activeFilter === 'shalwar_kameez' ? 'bg-white text-[#1A1A1A] shadow-xs font-semibold' : 'text-[#78716C] hover:text-[#1A1A1A]'
              }`}
            >
              Shalwar Kameez
            </button>
            <button
              onClick={() => setActiveFilter('kalidar')}
              className={`px-3 py-1.5 rounded-sm transition-colors ${
                activeFilter === 'kalidar' ? 'bg-white text-[#1A1A1A] shadow-xs font-semibold' : 'text-[#78716C] hover:text-[#1A1A1A]'
              }`}
            >
              Kalidar Frocks
            </button>
            <button
              onClick={() => setActiveFilter('maxi')}
              className={`px-3 py-1.5 rounded-sm transition-colors ${
                activeFilter === 'maxi' ? 'bg-white text-[#1A1A1A] shadow-xs font-semibold' : 'text-[#78716C] hover:text-[#1A1A1A]'
              }`}
            >
              Formal Maxis
            </button>
          </div>
        </div>

        {/* 3-Column Luxury Product Grid with PKR Prices */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {filteredLooks.map((look) => (
            <div
              key={look.id}
              className="group flex flex-col justify-between bg-white border border-[#E6E0D6] rounded-sm overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="relative aspect-[4/5] bg-[#EFECE6] overflow-hidden">
                <img
                  src={look.image}
                  alt={look.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="absolute top-3 left-3 bg-[#FAF9F6]/90 backdrop-blur-xs px-2.5 py-1 rounded-sm text-[11px] text-[#292524] flex items-center gap-1.5 border border-[#E6E0D6]">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: look.colorHex }} />
                  <span>{look.colorName}</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#78716C]">
                    <span>{look.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{look.stitchingDays} Days Stitching</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-medium text-[#1A1A1A] leading-snug group-hover:text-[#7D5A44] transition-colors">
                    {look.title}
                  </h3>

                  <p className="text-xs text-[#6B655F] leading-relaxed line-clamp-2">
                    {look.craftsmanship}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EAE5DD] space-y-3">
                  <div className="flex items-baseline justify-between text-xs">
                    <div>
                      <span className="text-[11px] text-[#78716C] block">Stitching Fee</span>
                      <span className="text-sm font-semibold text-[#1A1A1A] tabular-nums">
                        PKR {look.priceStitchingOnlyPKR.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-[#78716C] block">With Aurelia Fabric</span>
                      <span className="text-sm font-semibold text-[#7D5A44] tabular-nums">
                        PKR {look.priceWithFabricPKR.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onCustomizeStyle({
                        garmentId: look.garmentId,
                        neckline: look.neckline,
                        sleeve: look.sleeve,
                        length: look.length,
                        fabricId: look.fabricId,
                        colorHex: look.colorHex,
                        colorName: look.colorName
                      });
                    }}
                    className="w-full py-2.5 px-4 bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase rounded-sm hover:bg-[#38332E] transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Customize in Studio</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Bring Your Own Suit Banner */}
        <div className="mt-14 p-6 bg-[#F4F1EA] border border-[#E6E0D6] rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#5B3E2B] shrink-0 border border-[#E0D7CC]">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <div className="font-serif text-sm font-semibold text-[#1A1A1A]">
                Bought an unstitched suit from Khaadi, Maria.B, Baroque, or Sana Safinaz?
              </div>
              <div className="text-[#6B655F]">
                Our Master Darzi team will stitch it to your exact measurements with complete patch finishing and doorstep rider pickup.
              </div>
            </div>
          </div>

          <button
            onClick={() => onCustomizeStyle({
              garmentId: 'shalwar_kameez',
              neckline: 'sherwani_collar',
              sleeve: 'kurta_cut',
              length: 'knee_length',
              fabricId: 'raw-silk',
              colorHex: '#EDE6D6',
              colorName: 'Ivory Safaid'
            })}
            className="px-5 py-2.5 bg-white text-[#1A1A1A] border border-[#C5BBAF] text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#EFECE6] transition-colors whitespace-nowrap shrink-0"
          >
            Stitch My Brand Suit →
          </button>
        </div>

      </div>
    </section>
  );
};
