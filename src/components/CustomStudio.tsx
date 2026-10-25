import React, { useState } from 'react';
import { 
  GarmentCategory, 
  NecklineType, 
  SleeveType, 
  BottomType,
  HemLength, 
  FabricType, 
  CustomGarmentConfig, 
  BodyMeasurements,
  MeasurementMethod
} from '../types/stitching';
import { 
  GARMENT_DEFINITIONS, 
  NECKLINES, 
  SLEEVES, 
  BOTTOM_STYLES,
  FABRIC_LIBRARY, 
  EMBELLISHMENT_OPTIONS,
  STANDARD_SIZE_PRESETS,
  PAKISTANI_CITIES
} from '../data/atelierData';
import { SilhouetteVisualizer } from './SilhouetteVisualizer';
import { 
  Sparkles, 
  Ruler, 
  Scissors, 
  Truck, 
  Check, 
  Calendar, 
  ShoppingBag, 
  Home, 
  FileText,
  Clock,
  Box
} from 'lucide-react';

interface CustomStudioProps {
  onAddToCart: (garmentTitle: string, config: CustomGarmentConfig, calculatedPrice: any, estimatedDays: number) => void;
  onOpenMeasurements: () => void;
  clientMeasurements: BodyMeasurements;
  initialPreset?: Partial<CustomGarmentConfig>;
}

export const CustomStudio: React.FC<CustomStudioProps> = ({
  onAddToCart,
  onOpenMeasurements,
  clientMeasurements,
  initialPreset
}) => {
  const [selectedGarmentId, setSelectedGarmentId] = useState<GarmentCategory>(
    initialPreset?.garmentId || 'shalwar_kameez'
  );

  const activeGarmentDef = GARMENT_DEFINITIONS.find(g => g.id === selectedGarmentId) || GARMENT_DEFINITIONS[0];

  const [neckline, setNeckline] = useState<NecklineType>(
    initialPreset?.neckline || activeGarmentDef.defaultNeckline
  );
  const [sleeve, setSleeve] = useState<SleeveType>(
    initialPreset?.sleeve || activeGarmentDef.defaultSleeve
  );
  const [bottomStyle, setBottomStyle] = useState<BottomType>(
    initialPreset?.bottomStyle || activeGarmentDef.defaultBottom
  );
  const [length, setLength] = useState<HemLength>(
    initialPreset?.length || activeGarmentDef.defaultLength
  );

  // Fabric Source & Brand
  const [fabricSource, setFabricSource] = useState<'atelier_fabric' | 'send_own_fabric'>('atelier_fabric');
  const [brandSuitName, setBrandSuitName] = useState<string>('Khaadi 3-Piece Luxury Embroidered Lawn');
  const [selectedFabric, setSelectedFabric] = useState<FabricType>(
    FABRIC_LIBRARY.find(f => f.id === initialPreset?.selectedFabric?.id) || FABRIC_LIBRARY[0]
  );
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string }>(
    initialPreset?.selectedColor || selectedFabric.colors[0]
  );

  // Lining & Finishes
  const [lining, setLining] = useState<'pure_cotton_malmal' | 'silk_shamooz' | 'unlined'>('pure_cotton_malmal');
  const [selectedEmbellishments, setSelectedEmbellishments] = useState<string[]>(['organza_lace_cutwork', 'shamooz_piping_latkans']);
  const [rushTier, setRushTier] = useState<'standard' | 'express'>('standard');

  // Measurement & Doorstep Fitting
  const [measurementMethod, setMeasurementMethod] = useState<MeasurementMethod>('exact_measurements');
  const [standardSize, setStandardSize] = useState<string>('M (Pakistani Size 38)');
  const [doorstepCity, setDoorstepCity] = useState<string>('Lahore');
  const [doorstepArea, setDoorstepArea] = useState<string>('Gulberg III / DHA Phase 5');
  const [doorstepDate, setDoorstepDate] = useState<string>('2026-10-28');
  const [doorstepSlot, setDoorstepSlot] = useState<string>('Afternoon (2:00 PM – 4:00 PM)');
  const [doorstepAddress, setDoorstepAddress] = useState<string>('House 42, Sector C, DHA Phase 5');
  const [doorstepPhone, setDoorstepPhone] = useState<string>('+92 300 1234567');

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'silhouette' | 'neck_sleeves' | 'bottoms' | 'fabric' | 'finishing' | 'measurement'>('silhouette');
  const [addedToast, setAddedToast] = useState(false);

  const handleSelectGarment = (id: GarmentCategory) => {
    setSelectedGarmentId(id);
    const def = GARMENT_DEFINITIONS.find(g => g.id === id);
    if (def) {
      setNeckline(def.defaultNeckline);
      setSleeve(def.defaultSleeve);
      setBottomStyle(def.defaultBottom);
      setLength(def.defaultLength);
    }
  };

  const handleSelectFabric = (fabric: FabricType) => {
    setSelectedFabric(fabric);
    setSelectedColor(fabric.colors[0]);
  };

  const toggleEmbellishment = (id: string) => {
    if (selectedEmbellishments.includes(id)) {
      setSelectedEmbellishments(selectedEmbellishments.filter(e => e !== id));
    } else {
      setSelectedEmbellishments([...selectedEmbellishments, id]);
    }
  };

  // Pricing calculations in PKR
  const baseStitchingPKR = activeGarmentDef.baseStitchingPricePKR;
  const fabricCostPKR = fabricSource === 'atelier_fabric' 
    ? activeGarmentDef.fabricMetersNeeded * selectedFabric.pricePerMeterPKR 
    : 0;

  const liningCostPKR = lining === 'pure_cotton_malmal' ? 1200 : lining === 'silk_shamooz' ? 2200 : 0;
  
  const embellishmentsCostPKR = selectedEmbellishments.reduce((acc, currId) => {
    const item = EMBELLISHMENT_OPTIONS.find(e => e.id === currId);
    return acc + (item ? item.pricePKR : 0);
  }, 0);

  const rushFeePKR = rushTier === 'express' ? 2000 : 0;
  const totalPricePKR = baseStitchingPKR + fabricCostPKR + liningCostPKR + embellishmentsCostPKR + rushFeePKR;
  const estimatedDays = rushTier === 'express' ? 3 : activeGarmentDef.standardTurnaroundDays;

  const handleAddToBag = () => {
    const config: CustomGarmentConfig = {
      garmentId: selectedGarmentId,
      neckline,
      sleeve,
      bottomStyle,
      length,
      fabricSource,
      clientBrandFabricName: fabricSource === 'send_own_fabric' ? brandSuitName : undefined,
      selectedFabric: fabricSource === 'atelier_fabric' ? selectedFabric : undefined,
      selectedColor: fabricSource === 'atelier_fabric' ? selectedColor : undefined,
      lining,
      embellishments: selectedEmbellishments,
      rushTier,
      measurementMethod,
      measurements: measurementMethod === 'exact_measurements' ? clientMeasurements : undefined,
      standardSizeBase: measurementMethod === 'standard_with_adjustments' ? standardSize : undefined,
      doorstepAppointment: measurementMethod === 'doorstep_master_tailor' ? {
        date: doorstepDate,
        slot: doorstepSlot,
        city: doorstepCity,
        area: doorstepArea,
        address: doorstepAddress,
        phone: doorstepPhone
      } : undefined
    };

    onAddToCart(
      activeGarmentDef.title,
      config,
      {
        stitchingBasePKR: baseStitchingPKR,
        fabricCostPKR,
        embellishmentsCostPKR,
        liningCostPKR,
        rushFeePKR,
        totalPKR: totalPricePKR
      },
      estimatedDays
    );

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <section id="studio" className="py-16 lg:py-24 max-w-7xl mx-auto px-6">
      
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#E6E0D6]">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-[#7D5A44] font-medium">
            Pakistani Bespoke Women's Tailoring Studio
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] mt-2">
            Custom Stitching Studio
          </h2>
          <p className="text-sm text-[#57534E] mt-2 max-w-2xl font-light">
            Craft your signature Pakistani silhouette—from Shalwar Kameez and Anarkali Kalidar Frocks to Bridal Maxis and Angrakha Ghararas. Transparent stitching rates in PKR.
          </p>
        </div>

        {/* Step Navigation Tabs with natural customer order */}
        <div className="flex items-center gap-1.5 p-1 bg-[#EFECE6] rounded-sm overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('silhouette')}
            className={`px-3 py-1.5 whitespace-nowrap rounded-sm transition-colors ${
              activeTab === 'silhouette' ? 'bg-white text-[#1A1A1A] shadow-xs font-semibold' : 'text-[#78716C] hover:text-[#1A1A1A]'
            }`}
          >
            1. What to Stitch (Garment)
          </button>
          <button
            onClick={() => setActiveTab('fabric')}
            className={`px-3 py-1.5 whitespace-nowrap rounded-sm transition-colors ${
              activeTab === 'fabric' ? 'bg-white text-[#1A1A1A] shadow-xs font-semibold' : 'text-[#78716C] hover:text-[#1A1A1A]'
            }`}
          >
            2. Fabric Sourcing
          </button>
          <button
            onClick={() => setActiveTab('neck_sleeves')}
            className={`px-3 py-1.5 whitespace-nowrap rounded-sm transition-colors ${
              activeTab === 'neck_sleeves' ? 'bg-white text-[#1A1A1A] shadow-xs font-semibold' : 'text-[#78716C] hover:text-[#1A1A1A]'
            }`}
          >
            3. Neck & Sleeves
          </button>
          <button
            onClick={() => setActiveTab('bottoms')}
            className={`px-3 py-1.5 whitespace-nowrap rounded-sm transition-colors ${
              activeTab === 'bottoms' ? 'bg-white text-[#1A1A1A] shadow-xs font-semibold' : 'text-[#78716C] hover:text-[#1A1A1A]'
            }`}
          >
            4. Bottom Styles
          </button>
          <button
            onClick={() => setActiveTab('finishing')}
            className={`px-3 py-1.5 whitespace-nowrap rounded-sm transition-colors ${
              activeTab === 'finishing' ? 'bg-white text-[#1A1A1A] shadow-xs font-semibold' : 'text-[#78716C] hover:text-[#1A1A1A]'
            }`}
          >
            5. Lace & Finishes
          </button>
          <button
            onClick={() => setActiveTab('measurement')}
            className={`px-3 py-1.5 whitespace-nowrap rounded-sm transition-colors ${
              activeTab === 'measurement' ? 'bg-white text-[#1A1A1A] shadow-xs font-semibold' : 'text-[#78716C] hover:text-[#1A1A1A]'
            }`}
          >
            6. Fitting & Measurements
          </button>
        </div>
      </div>

      {/* SIMPLE STEPS ROADMAP AT FIRST SIGHT */}
      <div className="mt-6 bg-[#F6F3EC] border border-[#E2DAD0] rounded-sm p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E7DFD4]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7D5A44]" />
            <span className="font-serif font-bold text-sm sm:text-base text-[#1A1A1A]">
              Simple Steps to Custom Stitch Your Outfit
            </span>
          </div>
          <span className="text-[11px] text-[#7D5A44] font-medium">
            First choose what to stitch, then select fabric, customize neckline & sleeves, and pick bottoms
          </span>
        </div>

        {/* 5-Step Visual Interactive Roadmap */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-3.5">
          {/* Step 1 */}
          <button
            onClick={() => setActiveTab('silhouette')}
            className={`p-3 rounded-sm border text-left transition-all ${
              activeTab === 'silhouette'
                ? 'bg-white border-[#1A1A1A] shadow-xs ring-1 ring-[#1A1A1A]'
                : 'bg-[#FAF9F6] border-[#DDD5C9] hover:bg-white hover:border-[#1A1A1A]'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-[#7D5A44]">
              <span>Step 1</span>
              <span className="text-[10px] font-mono text-[#78716C]">01</span>
            </div>
            <div className="font-serif font-bold text-xs sm:text-sm text-[#1A1A1A] mt-1">
              What to Stitch?
            </div>
            <div className="text-[11px] text-[#6B655F] mt-0.5 leading-tight">
              Shalwar Kameez, Frock, Maxi
            </div>
            <div className="text-[10px] text-[#8C7A6B] mt-1 font-medium">
              Choose Garment
            </div>
          </button>

          {/* Step 2 */}
          <button
            onClick={() => setActiveTab('fabric')}
            className={`p-3 rounded-sm border text-left transition-all ${
              activeTab === 'fabric'
                ? 'bg-white border-[#1A1A1A] shadow-xs ring-1 ring-[#1A1A1A]'
                : 'bg-[#FAF9F6] border-[#DDD5C9] hover:bg-white hover:border-[#1A1A1A]'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-[#7D5A44]">
              <span>Step 2</span>
              <span className="text-[10px] font-mono text-[#78716C]">02</span>
            </div>
            <div className="font-serif font-bold text-xs sm:text-sm text-[#1A1A1A] mt-1">
              Select Fabric
            </div>
            <div className="text-[11px] text-[#6B655F] mt-0.5 leading-tight">
              Send Brand Suit or Pure Fabric
            </div>
            <div className="text-[10px] text-[#8C7A6B] mt-1 font-medium">
              Fabric Sourcing
            </div>
          </button>

          {/* Step 3 */}
          <button
            onClick={() => setActiveTab('neck_sleeves')}
            className={`p-3 rounded-sm border text-left transition-all ${
              activeTab === 'neck_sleeves'
                ? 'bg-white border-[#1A1A1A] shadow-xs ring-1 ring-[#1A1A1A]'
                : 'bg-[#FAF9F6] border-[#DDD5C9] hover:bg-white hover:border-[#1A1A1A]'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-[#7D5A44]">
              <span>Step 3</span>
              <span className="text-[10px] font-mono text-[#78716C]">03</span>
            </div>
            <div className="font-serif font-bold text-xs sm:text-sm text-[#1A1A1A] mt-1">
              Neck & Sleeves
            </div>
            <div className="text-[11px] text-[#6B655F] mt-0.5 leading-tight">
              Ban, Paan Gala, Choori Daar
            </div>
            <div className="text-[10px] text-[#8C7A6B] mt-1 font-medium">
              Neckline & Sleeves
            </div>
          </button>

          {/* Step 4 */}
          <button
            onClick={() => setActiveTab('bottoms')}
            className={`p-3 rounded-sm border text-left transition-all ${
              activeTab === 'bottoms'
                ? 'bg-white border-[#1A1A1A] shadow-xs ring-1 ring-[#1A1A1A]'
                : 'bg-[#FAF9F6] border-[#DDD5C9] hover:bg-white hover:border-[#1A1A1A]'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-[#7D5A44]">
              <span>Step 4</span>
              <span className="text-[10px] font-mono text-[#78716C]">04</span>
            </div>
            <div className="font-serif font-bold text-xs sm:text-sm text-[#1A1A1A] mt-1">
              Shalwar / Bottoms
            </div>
            <div className="text-[11px] text-[#6B655F] mt-0.5 leading-tight">
              Patiala, Cigarette Pants, Gharara
            </div>
            <div className="text-[10px] text-[#8C7A6B] mt-1 font-medium">
              Bottom Styles
            </div>
          </button>

          {/* Step 5 */}
          <button
            onClick={() => setActiveTab('measurement')}
            className={`col-span-2 sm:col-span-1 p-3 rounded-sm border text-left transition-all ${
              activeTab === 'measurement'
                ? 'bg-white border-[#1A1A1A] shadow-xs ring-1 ring-[#1A1A1A]'
                : 'bg-[#FAF9F6] border-[#DDD5C9] hover:bg-white hover:border-[#1A1A1A]'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-[#7D5A44]">
              <span>Step 5</span>
              <span className="text-[10px] font-mono text-[#78716C]">05</span>
            </div>
            <div className="font-serif font-bold text-xs sm:text-sm text-[#1A1A1A] mt-1">
              Fitting & Darzi
            </div>
            <div className="text-[11px] text-[#6B655F] mt-0.5 leading-tight">
              Doorstep Visit or Sample Suit
            </div>
            <div className="text-[10px] text-[#8C7A6B] mt-1 font-medium">
              Measurements & Order
            </div>
          </button>
        </div>
      </div>

      {/* Main Studio 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-10 items-start">
        
        {/* Left Column: Interactive Configuration Panels */}
        <div className="lg:col-span-7 space-y-8">

          {/* TAB 1: Garment Silhouette Selection */}
          {activeTab === 'silhouette' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl text-[#1A1A1A]">Select Garment Silhouette (لباس کا انتخاب)</h3>
                <p className="text-xs text-[#78716C] mt-1">
                  Drafted by our certified Master Darzi team with perfect armhole curves and generous side chaaks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {GARMENT_DEFINITIONS.map((garment) => {
                  const isSelected = selectedGarmentId === garment.id;
                  return (
                    <button
                      key={garment.id}
                      onClick={() => handleSelectGarment(garment.id)}
                      className={`text-left p-4 rounded-sm border transition-all relative ${
                        isSelected 
                          ? 'border-[#1A1A1A] bg-white shadow-sm ring-1 ring-[#1A1A1A]' 
                          : 'border-[#E6E0D6] bg-[#FAF9F6] hover:border-[#C5BBAF] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-serif text-base font-semibold text-[#1A1A1A]">
                            {garment.title}
                          </div>
                          <div className="text-xs text-[#7D5A44] font-medium font-serif mt-0.5">
                            {garment.urduTitle}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs text-[#6B655F] mt-2 line-clamp-2">
                        {garment.subtitle}
                      </p>

                      <div className="mt-4 pt-3 border-t border-[#EAE5DD] flex items-center justify-between text-xs text-[#78716C]">
                        <span>Stitching: <strong className="text-[#1A1A1A] tabular-nums font-semibold">PKR {garment.baseStitchingPricePKR.toLocaleString()}</strong></span>
                        <span>{garment.fabricMetersNeeded}m needed</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Garment Details & Tailor Features */}
              <div className="p-4 bg-[#F4F1EA] border border-[#E6E0D6] rounded-sm text-xs space-y-2">
                <div className="font-semibold text-[#1A1A1A]">{activeGarmentDef.title} ({activeGarmentDef.urduTitle}):</div>
                <p className="text-[#57534E] leading-relaxed">{activeGarmentDef.description}</p>
                <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-[#78716C]">
                  {activeGarmentDef.features.map((feat, idx) => (
                    <span key={idx} className="bg-white px-2 py-0.5 rounded-sm border border-[#E0D7CC]">
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveTab('fabric')}
                  className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase rounded-sm hover:bg-[#38332E] transition-colors"
                >
                  Next: Select Fabric →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Neckline & Sleeves */}
          {activeTab === 'neck_sleeves' && (
            <div className="space-y-8">
              
              {/* Necklines */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div>
                    <h3 className="font-serif text-lg text-[#1A1A1A]">Neckline & Collar (گلا اور کالر)</h3>
                    <p className="text-xs text-[#78716C] mt-0.5">
                      Reinforced with fusible canvas interlining to prevent gaping and curling.
                    </p>
                  </div>
                  <span className="text-[11px] text-[#7D5A44] font-medium flex items-center gap-1">
                    <Box className="w-3.5 h-3.5" />
                    <span>3D Mannequin Updated Live →</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {NECKLINES.map((neck) => {
                    const isSelected = neckline === neck.id;
                    return (
                      <button
                        key={neck.id}
                        onClick={() => setNeckline(neck.id)}
                        className={`text-left p-3 rounded-sm border transition-all text-xs ${
                          isSelected
                            ? 'border-[#1A1A1A] bg-white ring-1 ring-[#1A1A1A] shadow-xs'
                            : 'border-[#E6E0D6] bg-[#FAF9F6] hover:bg-white hover:border-[#C5BBAF]'
                        }`}
                      >
                        <div className="font-semibold text-[#1A1A1A]">{neck.name}</div>
                        <div className="text-[11px] text-[#7D5A44] font-serif">{neck.urduName}</div>
                        <div className="text-[11px] text-[#78716C] mt-1 line-clamp-2">{neck.description}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sleeves */}
              <div className="space-y-4 pt-4 border-t border-[#EAE5DD]">
                <div>
                  <h3 className="font-serif text-lg text-[#1A1A1A]">Aastin / Sleeves (آستین کے ڈیزائن)</h3>
                  <p className="text-xs text-[#78716C] mt-0.5">
                    Choose traditional gathered Choori Daar, Bell bottom with lace, or straight Kurta cut.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SLEEVES.map((slv) => {
                    const isSelected = sleeve === slv.id;
                    return (
                      <button
                        key={slv.id}
                        onClick={() => setSleeve(slv.id)}
                        className={`text-left p-3 rounded-sm border transition-all text-xs ${
                          isSelected
                            ? 'border-[#1A1A1A] bg-white ring-1 ring-[#1A1A1A] shadow-xs'
                            : 'border-[#E6E0D6] bg-[#FAF9F6] hover:bg-white hover:border-[#C5BBAF]'
                        }`}
                      >
                        <div className="font-semibold text-[#1A1A1A]">{slv.name}</div>
                        <div className="text-[11px] text-[#7D5A44] font-serif">{slv.urduName}</div>
                        <div className="text-[11px] text-[#78716C] mt-1 line-clamp-2">{slv.description}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setActiveTab('fabric')}
                  className="px-4 py-2 border border-[#C5BBAF] text-xs font-medium text-[#1A1A1A] rounded-sm hover:bg-[#EFECE6]"
                >
                  ← Back: Fabric
                </button>
                <button
                  onClick={() => setActiveTab('bottoms')}
                  className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase rounded-sm hover:bg-[#38332E]"
                >
                  Next: Bottom Styles →
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: Bottoms & Trouser Styles */}
          {activeTab === 'bottoms' && (
            <div className="space-y-8">
              <div>
                <h3 className="font-serif text-xl text-[#1A1A1A]">Bottom Silhouette (شلوار / ٹراؤزر کا انتخاب)</h3>
                <p className="text-xs text-[#78716C] mt-1">
                  Tailored with comfortable asan depth, deep pockets, and fused canvas pancha.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BOTTOM_STYLES.map((bot) => {
                  const isSelected = bottomStyle === bot.id;
                  return (
                    <button
                      key={bot.id}
                      onClick={() => setBottomStyle(bot.id)}
                      className={`text-left p-4 rounded-sm border transition-all ${
                        isSelected
                          ? 'border-[#1A1A1A] bg-white ring-1 ring-[#1A1A1A] shadow-xs'
                          : 'border-[#E6E0D6] bg-[#FAF9F6] hover:bg-white hover:border-[#C5BBAF]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-base font-semibold text-[#1A1A1A]">{bot.name}</span>
                        <span className="text-xs text-[#7D5A44] font-serif">{bot.urduName}</span>
                      </div>
                      <p className="text-xs text-[#6B655F] mt-1.5 leading-relaxed">{bot.description}</p>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setActiveTab('neck_sleeves')}
                  className="px-4 py-2 border border-[#C5BBAF] text-xs font-medium text-[#1A1A1A] rounded-sm hover:bg-[#EFECE6]"
                >
                  ← Back: Neck & Sleeves
                </button>
                <button
                  onClick={() => setActiveTab('finishing')}
                  className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase rounded-sm hover:bg-[#38332E]"
                >
                  Next: Lace & Finishes →
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Fabric Sourcing (Atelier Silk vs Send-Your-Own Brand Suit) */}
          {activeTab === 'fabric' && (
            <div className="space-y-8">
              
              <div className="p-4 bg-[#F4F1EA] border border-[#E6E0D6] rounded-sm space-y-3">
                <div className="font-semibold text-xs text-[#1A1A1A] uppercase tracking-wider">
                  Fabric Provision Choice (کپڑے کا ذریعہ)
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setFabricSource('atelier_fabric')}
                    className={`p-3 text-left rounded-sm border transition-all text-xs ${
                      fabricSource === 'atelier_fabric'
                        ? 'border-[#1A1A1A] bg-white ring-1 ring-[#1A1A1A]'
                        : 'border-[#E6E0D6] bg-[#FAF9F6] hover:bg-white'
                    }`}
                  >
                    <div className="font-semibold text-[#1A1A1A]">Buy Fabric from Aurelia Vault</div>
                    <div className="text-[11px] text-[#78716C] mt-1">
                      Pure 80g PK Raw Silk, Korean Bamber Chiffon, Swiss Lawn, and Micro 9000 Velvet.
                    </div>
                  </button>

                  <button
                    onClick={() => setFabricSource('send_own_fabric')}
                    className={`p-3 text-left rounded-sm border transition-all text-xs ${
                      fabricSource === 'send_own_fabric'
                        ? 'border-[#1A1A1A] bg-white ring-1 ring-[#1A1A1A]'
                        : 'border-[#E6E0D6] bg-[#FAF9F6] hover:bg-white'
                    }`}
                  >
                    <div className="font-semibold text-[#1A1A1A]">Stitch My Unstitched Brand Suit (BYOF)</div>
                    <div className="text-[11px] text-[#78716C] mt-1">
                      Send your suit from Khaadi, Maria.B, Baroque, Asim Jofa, Sana Safinaz, or Sapphire.
                    </div>
                  </button>
                </div>
              </div>

              {/* If BYOF Brand Suit */}
              {fabricSource === 'send_own_fabric' ? (
                <div className="p-6 bg-white border border-[#E6E0D6] rounded-sm space-y-4 text-xs">
                  <div className="flex items-center gap-2 text-[#7D5A44]">
                    <Truck className="w-5 h-5" />
                    <span className="font-serif text-base font-semibold text-[#1A1A1A]">
                      Send Your Unstitched Designer Suit (اپنا سوٹ درزی کو بھیجیں)
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#78716C] block mb-1">
                      Brand / Suit Details (e.g. Khaadi 3-Piece Lawn, Maria.B Chiffon, Baroque Velvet):
                    </label>
                    <input
                      type="text"
                      value={brandSuitName}
                      onChange={(e) => setBrandSuitName(e.target.value)}
                      placeholder="e.g. Maria.B Luxury Mbroidered 3-Piece"
                      className="w-full p-2.5 bg-[#FAF9F6] border border-[#E6E0D6] rounded-sm text-xs text-[#1A1A1A]"
                    />
                  </div>

                  <div className="p-3 bg-[#FAF9F6] border border-[#EAE5DD] rounded-sm text-[#57534E] space-y-1">
                    <div>• <strong>Complimentary Rider Pickup:</strong> Available across Lahore, Karachi & Islamabad within 24 hours.</div>
                    <div>• <strong>Patch & Lace Application:</strong> We steam, cutwork, and machine-applique all organza patches and necklines included in the suit kit.</div>
                    <div>• <strong>Fabric Cost:</strong> ₨ 0 (You only pay the custom stitching fee!).</div>
                  </div>
                </div>
              ) : (
                /* Atelier Fabrics */
                <div className="space-y-4">
                  <div>
                    <h3 className="font-serif text-lg text-[#1A1A1A]">Aurelia Pure Fabric Collection</h3>
                    <p className="text-xs text-[#78716C] mt-0.5">
                      Premium unstitched yards dyed in signature Pakistani shades.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {FABRIC_LIBRARY.map((fabric) => {
                      const isSelected = selectedFabric.id === fabric.id;
                      return (
                        <div
                          key={fabric.id}
                          className={`p-4 rounded-sm border transition-all ${
                            isSelected
                              ? 'border-[#1A1A1A] bg-white ring-1 ring-[#1A1A1A] shadow-xs'
                              : 'border-[#E6E0D6] bg-[#FAF9F6] hover:bg-white'
                          }`}
                        >
                          <div className="cursor-pointer" onClick={() => handleSelectFabric(fabric)}>
                            <div className="flex items-center justify-between">
                              <span className="font-serif text-base font-semibold text-[#1A1A1A]">{fabric.name}</span>
                              <span className="text-xs font-semibold text-[#1A1A1A] tabular-nums">
                                PKR {fabric.pricePerMeterPKR.toLocaleString()} / meter
                              </span>
                            </div>
                            <div className="text-xs text-[#7D5A44] mt-0.5">{fabric.material} · {fabric.drape}</div>
                            <p className="text-xs text-[#6B655F] mt-1.5 leading-relaxed">{fabric.description}</p>
                          </div>

                          <div className="mt-3 pt-3 border-t border-[#EAE5DD]">
                            <div className="text-[11px] text-[#78716C] mb-1.5 font-medium">Select Shade / Rang:</div>
                            <div className="flex flex-wrap items-center gap-2">
                              {fabric.colors.map((color) => {
                                const isColorSelected = isSelected && selectedColor.hex === color.hex;
                                return (
                                  <button
                                    key={color.hex}
                                    onClick={() => {
                                      handleSelectFabric(fabric);
                                      setSelectedColor(color);
                                    }}
                                    className={`flex items-center gap-2 px-2.5 py-1 rounded-sm border text-xs transition-all ${
                                      isColorSelected
                                        ? 'border-[#1A1A1A] bg-white font-medium shadow-xs'
                                        : 'border-[#E6E0D6] hover:bg-[#EFECE6]'
                                    }`}
                                  >
                                    <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: color.hex }} />
                                    <span>{color.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setActiveTab('silhouette')}
                  className="px-4 py-2 border border-[#C5BBAF] text-xs font-medium text-[#1A1A1A] rounded-sm hover:bg-[#EFECE6]"
                >
                  ← Back: Garment
                </button>
                <button
                  onClick={() => setActiveTab('neck_sleeves')}
                  className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase rounded-sm hover:bg-[#38332E]"
                >
                  Next: Neck & Sleeves →
                </button>
              </div>

            </div>
          )}

          {/* TAB 5: Lining & Karhai Finishes */}
          {activeTab === 'finishing' && (
            <div className="space-y-8">
              
              {/* Inner Lining / Aster */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-serif text-lg text-[#1A1A1A]">Inner Lining / Aster (اندرونی استر)</h3>
                  <p className="text-xs text-[#78716C] mt-0.5">
                    Ensures opacity, skin breathability, and prevents sweat staining on pure silk & chiffon.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'pure_cotton_malmal', name: 'Pure Cotton Malmal Aster', pricePKR: 1200, desc: 'Soft unbleached Pakistani malmal for maximum coolness' },
                    { id: 'silk_shamooz', name: 'Silk Shamooz Slip Lining', pricePKR: 2200, desc: 'Lustrous anti-static slip for winter & wedding couture' },
                    { id: 'unlined', name: 'Unlined / Without Aster', pricePKR: 0, desc: 'For opaque lawns or pre-lined unstitched sets' }
                  ].map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLining(l.id as any)}
                      className={`text-left p-3.5 rounded-sm border transition-all text-xs ${
                        lining === l.id
                          ? 'border-[#1A1A1A] bg-white ring-1 ring-[#1A1A1A] shadow-xs'
                          : 'border-[#E6E0D6] bg-[#FAF9F6] hover:bg-white'
                      }`}
                    >
                      <div className="font-semibold text-[#1A1A1A]">{l.name}</div>
                      <div className="text-[#7D5A44] font-medium mt-1">
                        {l.pricePKR > 0 ? `+₨ ${l.pricePKR.toLocaleString()}` : 'Included'}
                      </div>
                      <div className="text-[11px] text-[#78716C] mt-1">{l.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Adda Work, Gota, and Organza Finishing */}
              <div className="space-y-4 pt-4 border-t border-[#EAE5DD]">
                <div>
                  <h3 className="font-serif text-lg text-[#1A1A1A]">Karhai, Gota & Laces (لیس، گوٹا اور اڈہ ورک)</h3>
                  <p className="text-xs text-[#78716C] mt-0.5">
                    Executed by our master artisans in Lahore and Karachi workshops.
                  </p>
                </div>

                <div className="space-y-3">
                  {EMBELLISHMENT_OPTIONS.map((emb) => {
                    const isChecked = selectedEmbellishments.includes(emb.id);
                    return (
                      <div
                        key={emb.id}
                        onClick={() => toggleEmbellishment(emb.id)}
                        className={`p-3.5 rounded-sm border cursor-pointer transition-all flex items-start gap-3.5 ${
                          isChecked
                            ? 'border-[#1A1A1A] bg-white ring-1 ring-[#1A1A1A]'
                            : 'border-[#E6E0D6] bg-[#FAF9F6] hover:bg-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-1 w-4 h-4 rounded text-[#1A1A1A] border-[#C5BBAF] cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-serif text-sm font-semibold text-[#1A1A1A]">{emb.name}</span>
                            <span className="text-xs font-semibold text-[#1A1A1A] tabular-nums">
                              +₨ {emb.pricePKR.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-[#6B655F] mt-0.5">{emb.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Express Urgent Delivery */}
              <div className="space-y-4 pt-4 border-t border-[#EAE5DD]">
                <h3 className="font-serif text-lg text-[#1A1A1A]">Tailoring Timeline (سلائی کا وقت)</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                    onClick={() => setRushTier('standard')}
                    className={`p-3 text-left rounded-sm border ${
                      rushTier === 'standard' ? 'border-[#1A1A1A] bg-white ring-1 ring-[#1A1A1A]' : 'border-[#E6E0D6] bg-[#FAF9F6]'
                    }`}
                  >
                    <div className="font-semibold text-[#1A1A1A]">Standard ({activeGarmentDef.standardTurnaroundDays} Days)</div>
                    <div className="text-[11px] text-[#78716C] mt-1">Normal master darzi queue with steam press. Included.</div>
                  </button>

                  <button
                    onClick={() => setRushTier('express')}
                    className={`p-3 text-left rounded-sm border ${
                      rushTier === 'express' ? 'border-[#1A1A1A] bg-white ring-1 ring-[#1A1A1A]' : 'border-[#E6E0D6] bg-[#FAF9F6]'
                    }`}
                  >
                    <div className="font-semibold text-[#1A1A1A]">Urgent Express (3 Days)</div>
                    <div className="text-[11px] text-[#78716C] mt-1">Priority Eid / Wedding slot (+₨ 2,000)</div>
                  </button>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setActiveTab('bottoms')}
                  className="px-4 py-2 border border-[#C5BBAF] text-xs font-medium text-[#1A1A1A] rounded-sm hover:bg-[#EFECE6]"
                >
                  ← Back: Bottom Styles
                </button>
                <button
                  onClick={() => setActiveTab('measurement')}
                  className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase rounded-sm hover:bg-[#38332E]"
                >
                  Next: Fitting & Measurements →
                </button>
              </div>

            </div>
          )}

          {/* TAB 6: Measurement & Doorstep Master Darzi */}
          {activeTab === 'measurement' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl text-[#1A1A1A]">Fitting & Measurement Delivery (ناپ کا طریقہ)</h3>
                <p className="text-xs text-[#78716C] mt-1">
                  Choose how you would like to submit your suit measurements.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  {
                    id: 'exact_measurements',
                    title: 'Enter Tape Measurements',
                    icon: Ruler,
                    desc: 'Input kameez length, chest, waist, teera, and shalwar pancha with our guide.'
                  },
                  {
                    id: 'standard_with_adjustments',
                    title: 'Pakistani Standard Size (36-44)',
                    icon: FileText,
                    desc: 'Pick standard baseline and specify custom adjustments (+1" length, etc.).'
                  },
                  {
                    id: 'doorstep_master_tailor',
                    title: 'Book Doorstep Master Darzi Visit',
                    icon: Home,
                    desc: 'Certified female master tailor visits your home in Lahore, Karachi, or Islamabad.'
                  },
                  {
                    id: 'clone_sample_garment',
                    title: 'Rider Pickup Sample Suit (سیمپل سوٹ)',
                    icon: Scissors,
                    desc: 'Rider picks up your best-fitting kameez shalwar to clone the exact stitch.'
                  }
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = measurementMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMeasurementMethod(m.id as MeasurementMethod)}
                      className={`text-left p-3.5 rounded-sm border transition-all ${
                        isSelected
                          ? 'border-[#1A1A1A] bg-white ring-1 ring-[#1A1A1A] shadow-xs'
                          : 'border-[#E6E0D6] bg-[#FAF9F6] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#7D5A44]" />
                        <span className="font-semibold text-[#1A1A1A]">{m.title}</span>
                      </div>
                      <p className="text-[11px] text-[#6B655F] mt-1.5 leading-relaxed">{m.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Exact Measurements Active Card */}
              {measurementMethod === 'exact_measurements' && (
                <div className="p-4 bg-white border border-[#E6E0D6] rounded-sm space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1A1A1A]">Current Client Measurements:</span>
                    <button
                      onClick={onOpenMeasurements}
                      className="text-[#7D5A44] hover:underline font-semibold"
                    >
                      Open Full Darzi Tape Guide →
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#57534E]">
                    <div className="bg-[#FAF9F6] p-2 border border-[#EAE5DD] rounded-sm">
                      <div className="text-[10px] text-[#78716C] uppercase">Kameez Length</div>
                      <div className="font-semibold text-[#1A1A1A] tabular-nums">{clientMeasurements.kameezLength}"</div>
                    </div>
                    <div className="bg-[#FAF9F6] p-2 border border-[#EAE5DD] rounded-sm">
                      <div className="text-[10px] text-[#78716C] uppercase">Chest / Bust</div>
                      <div className="font-semibold text-[#1A1A1A] tabular-nums">{clientMeasurements.chest}"</div>
                    </div>
                    <div className="bg-[#FAF9F6] p-2 border border-[#EAE5DD] rounded-sm">
                      <div className="text-[10px] text-[#78716C] uppercase">Shalwar Length</div>
                      <div className="font-semibold text-[#1A1A1A] tabular-nums">{clientMeasurements.shalwarLength}"</div>
                    </div>
                    <div className="bg-[#FAF9F6] p-2 border border-[#EAE5DD] rounded-sm">
                      <div className="text-[10px] text-[#78716C] uppercase">Pancha Opening</div>
                      <div className="font-semibold text-[#1A1A1A] tabular-nums">{clientMeasurements.panchaTrouserOpening}"</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Doorstep Scheduler Form */}
              {measurementMethod === 'doorstep_master_tailor' && (
                <div className="p-4 bg-white border border-[#E6E0D6] rounded-sm space-y-3 text-xs">
                  <div className="font-semibold text-[#1A1A1A]">Home Measurement Schedule:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#78716C] block mb-1">City (شہر)</label>
                      <select
                        value={doorstepCity}
                        onChange={(e) => setDoorstepCity(e.target.value)}
                        className="w-full p-2 bg-[#FAF9F6] border border-[#E6E0D6] rounded-sm text-xs"
                      >
                        {PAKISTANI_CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-[#78716C] block mb-1">Area / Sector</label>
                      <input
                        type="text"
                        value={doorstepArea}
                        onChange={(e) => setDoorstepArea(e.target.value)}
                        placeholder="e.g. DHA Phase 5 / Gulberg"
                        className="w-full p-2 bg-[#FAF9F6] border border-[#E6E0D6] rounded-sm text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-[#78716C] block mb-1">Fitting Date</label>
                      <input
                        type="date"
                        value={doorstepDate}
                        onChange={(e) => setDoorstepDate(e.target.value)}
                        className="w-full p-2 bg-[#FAF9F6] border border-[#E6E0D6] rounded-sm text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-[#78716C] block mb-1">Time Slot</label>
                      <select
                        value={doorstepSlot}
                        onChange={(e) => setDoorstepSlot(e.target.value)}
                        className="w-full p-2 bg-[#FAF9F6] border border-[#E6E0D6] rounded-sm text-xs"
                      >
                        <option>Morning (11:00 AM – 1:00 PM)</option>
                        <option>Afternoon (3:00 PM – 5:00 PM)</option>
                        <option>Evening (6:00 PM – 8:00 PM)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-[#78716C] block mb-1">Home Address</label>
                      <input
                        type="text"
                        value={doorstepAddress}
                        onChange={(e) => setDoorstepAddress(e.target.value)}
                        placeholder="House / Flat No., Street, Block"
                        className="w-full p-2 bg-[#FAF9F6] border border-[#E6E0D6] rounded-sm text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {measurementMethod === 'clone_sample_garment' && (
                <div className="p-4 bg-[#F4F1EA] border border-[#E6E0D6] rounded-sm text-xs space-y-2">
                  <div className="font-semibold text-[#1A1A1A]">Sample Garment Replication (سیمپل سوٹ)</div>
                  <p className="text-[#6B655F] leading-relaxed">
                    Our rider will bring a sealed garment bag to collect your best-fitting kameez and shalwar. Our Master Darzi will measure the exact chest, waist, mudda, and pancha, and return your sample suit safely with your new order.
                  </p>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setActiveTab('finishing')}
                  className="px-4 py-2 border border-[#C5BBAF] text-xs font-medium text-[#1A1A1A] rounded-sm hover:bg-[#EFECE6]"
                >
                  ← Back: Lace & Finishes
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Right Column: Dynamic 3D Mannequin Visualizer & Live PKR Cost Breakdown */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          
          {/* Live 3D / 2D Visualizer */}
          <SilhouetteVisualizer
            garmentId={selectedGarmentId}
            neckline={neckline}
            sleeve={sleeve}
            bottomStyle={bottomStyle}
            length={length}
            fabricColorHex={fabricSource === 'atelier_fabric' ? selectedColor.hex : '#D8CFBC'}
            fabricName={fabricSource === 'atelier_fabric' ? `${selectedFabric.name} (${selectedColor.name})` : (brandSuitName || 'Client Unstitched Suit')}
            measurements={clientMeasurements}
            onOpenMeasurements={onOpenMeasurements}
          />

          {/* Transparent Itemized Price Card in PKR */}
          <div className="bg-[#FAF9F6] border border-[#E6E0D6] rounded-sm p-5 space-y-4 shadow-sm text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DD]">
              <span className="font-serif text-base font-semibold text-[#1A1A1A]">Stitching Estimate</span>
              <span className="text-[#78716C] font-mono text-[11px]">PKR RATES</span>
            </div>

            <div className="space-y-2 text-[#57534E]">
              <div className="flex items-center justify-between">
                <span>Master Darzi Stitching ({activeGarmentDef.urduTitle})</span>
                <span className="font-semibold text-[#1A1A1A] tabular-nums">₨ {baseStitchingPKR.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>
                  {fabricSource === 'atelier_fabric' 
                    ? `Fabric (${activeGarmentDef.fabricMetersNeeded}m × ₨ ${selectedFabric.pricePerMeterPKR.toLocaleString()})` 
                    : 'Unstitched Suit Cutting & Steaming'}
                </span>
                <span className="font-semibold text-[#1A1A1A] tabular-nums">
                  {fabricSource === 'atelier_fabric' ? `₨ ${fabricCostPKR.toLocaleString()}` : '₨ 0 (BYOF Free)'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Inner Lining ({lining.replace(/_/g, ' ')})</span>
                <span className="font-semibold text-[#1A1A1A] tabular-nums">₨ {liningCostPKR.toLocaleString()}</span>
              </div>

              {embellishmentsCostPKR > 0 && (
                <div className="flex items-center justify-between">
                  <span>Lace, Gota & Karhai ({selectedEmbellishments.length} finishes)</span>
                  <span className="font-semibold text-[#1A1A1A] tabular-nums">₨ {embellishmentsCostPKR.toLocaleString()}</span>
                </div>
              )}

              {rushTier === 'express' && (
                <div className="flex items-center justify-between text-[#7D5A44]">
                  <span>Urgent Express Delivery (3 Days)</span>
                  <span className="font-semibold tabular-nums">+₨ 2,000</span>
                </div>
              )}
            </div>

            {/* Total and Turnaround */}
            <div className="pt-3 border-t border-[#EAE5DD] flex items-baseline justify-between">
              <div>
                <div className="text-[11px] text-[#78716C] uppercase tracking-wider">
                  Total Amount
                </div>
                <div className="font-serif text-2xl font-bold text-[#1A1A1A] tabular-nums">
                  ₨ {totalPricePKR.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-[#78716C] flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3" />
                  <span>Turnaround</span>
                </div>
                <div className="font-semibold text-[#1A1A1A] tabular-nums">{estimatedDays} Working Days</div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                onClick={handleAddToBag}
                className="w-full py-3.5 bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase rounded-sm hover:bg-[#38332E] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Custom Suit to Bag</span>
              </button>

              {addedToast && (
                <div className="mt-2 p-2 bg-[#EFECE6] text-[#292524] rounded-sm text-center text-xs font-medium flex items-center justify-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#5B3E2B]" />
                  <span>Suit added to Atelier Bag! Open bag to confirm.</span>
                </div>
              )}
            </div>

            <div className="text-[11px] text-[#78716C] text-center pt-1">
              Includes free alteration guarantee & Cash on Delivery (COD) across Pakistan.
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
