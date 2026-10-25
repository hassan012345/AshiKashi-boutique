import React, { useState } from 'react';
import { 
  BodyMeasurements, 
  CartItem, 
  CustomGarmentConfig, 
  FabricType, 
  OrderStatus,
  GarmentCategory,
  NecklineType,
  SleeveType,
  HemLength
} from './types/stitching';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CustomStudio } from './components/CustomStudio';
import { LookbookSection } from './components/LookbookSection';
import { FabricVault } from './components/FabricVault';
import { OrderTracker } from './components/OrderTracker';
import { CraftsmanshipStory } from './components/CraftsmanshipStory';
import { Footer } from './components/Footer';
import { MeasurementGuideModal } from './components/MeasurementGuideModal';
import { CartDrawer } from './components/CartDrawer';
import { FABRIC_LIBRARY } from './data/atelierData';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMeasurementsModalOpen, setIsMeasurementsModalOpen] = useState(false);
  
  // Custom orders placed in this session
  const [sessionOrders, setSessionOrders] = useState<OrderStatus[]>([]);

  // Preset configuration for the custom studio (when loaded from lookbook or fabric vault)
  const [studioPreset, setStudioPreset] = useState<Partial<CustomGarmentConfig> | undefined>(undefined);

  // Client's verified measurement profile
  const [clientMeasurements, setClientMeasurements] = useState<BodyMeasurements>({
    unit: 'inches',
    kameezLength: 39.0,
    bust: 36.0,
    chest: 36.0,
    waist: 28.5,
    hip: 39.5,
    shoulderTeera: 15.0,
    armhole: 16.5,
    sleeveLength: 21.5,
    wristCuff: 8.5,
    frontGalaDepth: 7.0,
    backGalaDepth: 4.5,
    damanGhera: 23.0,
    shalwarLength: 38.0,
    panchaTrouserOpening: 7.0,
    thighAsan: 14.5,
    notes: 'Kameez straight silhouette with 2-inch side chaak piping and cigarette trousers with lace inserts.'
  });

  // Navigation handler
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Add to cart handler
  const handleAddToCart = (
    title: string,
    config: CustomGarmentConfig,
    calculatedPrice: any,
    estimatedDays: number
  ) => {
    const newItem: CartItem = {
      id: `ITEM-${Date.now()}`,
      title,
      config,
      calculatedPrice,
      estimatedDays
    };
    setCart((prev) => [...prev, newItem]);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // When user clicks "Customize This Silhouette" on lookbook
  const handleCustomizeStyle = (preset: {
    garmentId: GarmentCategory;
    neckline: NecklineType;
    sleeve: SleeveType;
    length: HemLength;
    fabricId: string;
    colorHex: string;
    colorName: string;
  }) => {
    const fabricObj = FABRIC_LIBRARY.find((f) => f.id === preset.fabricId);
    setStudioPreset({
      garmentId: preset.garmentId,
      neckline: preset.neckline,
      sleeve: preset.sleeve,
      length: preset.length,
      fabricSource: 'atelier_fabric',
      selectedFabric: fabricObj,
      selectedColor: { name: preset.colorName, hex: preset.colorHex }
    });
    handleNavigate('studio');
  };

  // When user clicks "Stitch With This" from Fabric Vault
  const handleSelectFabricForStudio = (fabric: FabricType) => {
    setStudioPreset((prev) => ({
      ...prev,
      fabricSource: 'atelier_fabric',
      selectedFabric: fabric,
      selectedColor: fabric.colors[0]
    }));
    handleNavigate('studio');
  };

  const handleOrderCompleted = (newOrder: OrderStatus) => {
    setSessionOrders((prev) => [newOrder, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1A1A1A]">
      {/* Strict Top Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        cartCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenMeasurements={() => setIsMeasurementsModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onStartCustomizing={() => handleNavigate('studio')}
          onExploreLookbook={() => handleNavigate('lookbook')}
        />

        {/* Custom Stitching Studio */}
        <CustomStudio
          key={studioPreset ? JSON.stringify(studioPreset) : 'default-studio'}
          onAddToCart={handleAddToCart}
          onOpenMeasurements={() => setIsMeasurementsModalOpen(true)}
          clientMeasurements={clientMeasurements}
          initialPreset={studioPreset}
        />

        {/* Lookbook Gallery */}
        <LookbookSection onCustomizeStyle={handleCustomizeStyle} />

        {/* Fabric Vault & Swatch Explorer */}
        <FabricVault onSelectFabricForStudio={handleSelectFabricForStudio} />

        {/* Craftsmanship Principles Story */}
        <CraftsmanshipStory />

        {/* Live Order Tracker */}
        <OrderTracker customOrders={sessionOrders} />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenMeasurements={() => setIsMeasurementsModalOpen(true)}
      />

      {/* Interactive Measurement Guide Modal */}
      <MeasurementGuideModal
        isOpen={isMeasurementsModalOpen}
        onClose={() => setIsMeasurementsModalOpen(false)}
        measurements={clientMeasurements}
        onSaveMeasurements={(updated) => setClientMeasurements(updated)}
      />

      {/* Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOrderCompleted={handleOrderCompleted}
      />
    </div>
  );
}
