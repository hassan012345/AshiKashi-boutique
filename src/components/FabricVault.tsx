import React, { useState } from 'react';
import { FABRIC_LIBRARY, PAKISTANI_CITIES } from '../data/atelierData';
import { FabricType } from '../types/stitching';
import { Check, Package } from 'lucide-react';

interface FabricVaultProps {
  onSelectFabricForStudio: (fabric: FabricType) => void;
}

export const FabricVault: React.FC<FabricVaultProps> = ({ onSelectFabricForStudio }) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'raw_silk' | 'chiffon' | 'lawn' | 'velvet' | 'banarasi'>('all');
  const [swatchPackSelection, setSwatchPackSelection] = useState<string[]>(['raw-silk', 'chiffon-bamber']);
  const [isSwatchModalOpen, setIsSwatchModalOpen] = useState(false);
  const [swatchCity, setSwatchCity] = useState('Lahore');
  const [swatchAddress, setSwatchAddress] = useState('');
  const [swatchSent, setSwatchSent] = useState(false);

  const filteredFabrics = FABRIC_LIBRARY.filter(f => {
    if (categoryFilter === 'all') return true;
    return f.category === categoryFilter;
  });

  const toggleSwatchPackItem = (id: string) => {
    if (swatchPackSelection.includes(id)) {
      setSwatchPackSelection(swatchPackSelection.filter(item => item !== id));
    } else {
      if (swatchPackSelection.length < 4) {
        setSwatchPackSelection([...swatchPackSelection, id]);
      }
    }
  };

  const handleOrderSwatches = (e: React.FormEvent) => {
    e.preventDefault();
    setSwatchSent(true);
    setTimeout(() => {
      setSwatchSent(false);
      setIsSwatchModalOpen(false);
      setSwatchPackSelection([]);
    }, 2000);
  };

  return (
    <section id="fabrics" className="py-16 lg:py-24 border-b border-[#E6E0D6] bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header with Split Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pb-12 border-b border-[#EAE5DD]">
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs uppercase tracking-[0.25em] text-[#7D5A44] font-medium">
              Pure Pakistani & Imported Textiles (خالص کپڑا)
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A]">
              The Fabric & Silk Archive
            </h2>
            <p className="text-sm text-[#57534E] leading-relaxed max-w-2xl font-light">
              We stock authentic 80g PK Raw Silk, Korean pure Bamber Chiffon, St. Gallen Swiss Voile Lawn, Micro 9000 Velvet, and Banarasi Jamawar. All fabrics are pre-shrunk and grain-aligned. All prices in Pakistani Rupees (PKR).
            </p>
            
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => setIsSwatchModalOpen(true)}
                className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase rounded-sm hover:bg-[#38332E] transition-colors flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                <span>Order Free Swatch Envelope ({swatchPackSelection.length}/4 selected)</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-lg bg-[#EFECE6]">
              <img
                src="/src/assets/images/fabric_craft_swatches_1792879886672.jpg"
                alt="Tactile flatlay of pure PK raw silk, bamber chiffon, velvet swatches, and master tailor scissors on wooden table"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-light">
                Pure 80g PK Raw Silk, Korean Bamber Chiffon & Micro 9000 Velvet
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between gap-4 mt-10 pb-6 border-b border-[#EAE5DD] flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#EFECE6] p-1 rounded-sm text-xs font-medium">
            {(['all', 'raw_silk', 'chiffon', 'lawn', 'velvet', 'banarasi'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-sm capitalize transition-colors ${
                  categoryFilter === cat ? 'bg-white text-[#1A1A1A] shadow-xs font-semibold' : 'text-[#78716C] hover:text-[#1A1A1A]'
                }`}
              >
                {cat === 'all' ? 'All Fabrics' : cat.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#78716C]">
            Select up to 4 swatches for free courier delivery across Pakistan
          </div>
        </div>

        {/* Fabric Swatch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredFabrics.map((fabric) => {
            const isSelectedForSwatch = swatchPackSelection.includes(fabric.id);
            return (
              <div
                key={fabric.id}
                className="bg-white border border-[#E6E0D6] rounded-sm p-6 flex flex-col justify-between space-y-5 hover:shadow-sm transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-[#1A1A1A]">
                        {fabric.name}
                      </h3>
                      <div className="text-xs text-[#7D5A44] font-medium mt-0.5">
                        {fabric.material}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-lg font-semibold text-[#1A1A1A] tabular-nums">
                        PKR {fabric.pricePerMeterPKR.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-[#78716C] block">/ meter</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#57534E] leading-relaxed">
                    {fabric.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-[#78716C] border-t border-[#EAE5DD]">
                    <span>Drape: <strong className="text-[#1A1A1A]">{fabric.drape}</strong></span>
                    <span>Season: <strong className="text-[#1A1A1A]">{fabric.season}</strong></span>
                  </div>

                  {/* Available Colors */}
                  <div className="space-y-1.5 pt-2">
                    <div className="text-[11px] text-[#78716C]">Available Shades (رنگ):</div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {fabric.colors.map((c) => (
                        <div
                          key={c.hex}
                          title={c.name}
                          className="flex items-center gap-1.5 px-2 py-1 bg-[#FAF9F6] border border-[#E6E0D6] rounded-sm text-[11px] text-[#292524]"
                        >
                          <span className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                          <span>{c.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EAE5DD] flex items-center gap-2">
                  <button
                    onClick={() => toggleSwatchPackItem(fabric.id)}
                    className={`flex-1 py-2 px-3 text-xs font-medium rounded-sm border transition-colors flex items-center justify-center gap-1.5 ${
                      isSelectedForSwatch
                        ? 'bg-[#EFECE6] border-[#1A1A1A] text-[#1A1A1A] font-semibold'
                        : 'border-[#C5BBAF] text-[#57534E] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    {isSelectedForSwatch ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Swatch Added</span>
                      </>
                    ) : (
                      <span>+ Swatch Pack</span>
                    )}
                  </button>

                  <button
                    onClick={() => onSelectFabricForStudio(fabric)}
                    className="py-2 px-3 bg-[#1A1A1A] text-white text-xs font-semibold rounded-sm hover:bg-[#38332E] transition-colors"
                  >
                    Stitch With This
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Free Swatch Order Modal */}
      {isSwatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF9F6] border border-[#E6E0D6] rounded-sm max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsSwatchModalOpen(false)}
              className="absolute top-4 right-4 text-[#78716C] hover:text-[#1A1A1A]"
            >
              ✕
            </button>

            <div className="space-y-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-[#7D5A44] font-medium">
                  Free Courier Delivery (مفت کپڑے کے نمونے)
                </div>
                <h3 className="font-serif text-2xl text-[#1A1A1A] mt-1">
                  Order Swatch Envelope
                </h3>
                <p className="text-xs text-[#57534E] mt-1">
                  We post fabric cuttings and thread shade cards anywhere in Pakistan via TCS / Leopard Courier free of cost.
                </p>
              </div>

              {swatchSent ? (
                <div className="p-6 bg-[#EFECE6] border border-[#C5BBAF] rounded-sm text-center space-y-2">
                  <Check className="w-8 h-8 text-[#5B3E2B] mx-auto" />
                  <div className="font-serif text-base font-semibold text-[#1A1A1A]">
                    Swatch Envelope Dispatched!
                  </div>
                  <p className="text-xs text-[#57534E]">
                    Your fabric samples have been dispatched to <strong>{swatchCity}</strong> and will arrive within 2 business days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleOrderSwatches} className="space-y-4 text-xs">
                  <div>
                    <label className="text-[11px] text-[#78716C] block mb-1">Selected Swatches ({swatchPackSelection.length}/4)</label>
                    <div className="p-3 bg-white border border-[#E6E0D6] rounded-sm space-y-1">
                      {swatchPackSelection.length === 0 ? (
                        <div className="text-[#78716C] italic">No swatches chosen. Click "+ Swatch Pack" on any fabric.</div>
                      ) : (
                        swatchPackSelection.map(id => {
                          const f = FABRIC_LIBRARY.find(fab => fab.id === id);
                          return (
                            <div key={id} className="flex items-center justify-between text-[#1A1A1A]">
                              <span>• {f?.name}</span>
                              <button
                                type="button"
                                onClick={() => toggleSwatchPackItem(id)}
                                className="text-[#78716C] hover:text-red-600"
                              >
                                remove
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#78716C] block mb-1">Recipient Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fatima Zahra"
                      className="w-full p-2.5 bg-white border border-[#E6E0D6] rounded-sm text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#78716C] block mb-1">City (شہر)</label>
                      <select
                        value={swatchCity}
                        onChange={(e) => setSwatchCity(e.target.value)}
                        className="w-full p-2.5 bg-white border border-[#E6E0D6] rounded-sm text-xs"
                      >
                        {PAKISTANI_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-[#78716C] block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="0300-1234567"
                        className="w-full p-2.5 bg-white border border-[#E6E0D6] rounded-sm text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#78716C] block mb-1">Delivery Address</label>
                    <input
                      type="text"
                      required
                      value={swatchAddress}
                      onChange={(e) => setSwatchAddress(e.target.value)}
                      placeholder="House No., Street, Block, Area"
                      className="w-full p-2.5 bg-white border border-[#E6E0D6] rounded-sm text-xs"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsSwatchModalOpen(false)}
                      className="px-4 py-2 border border-[#C5BBAF] text-xs rounded-sm hover:bg-[#EFECE6]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={swatchPackSelection.length === 0}
                      className="px-6 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase rounded-sm hover:bg-[#38332E] disabled:opacity-50"
                    >
                      Deliver Free Swatches
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
