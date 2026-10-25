import React, { useState } from 'react';
import { CartItem, OrderStatus } from '../types/stitching';
import { PAKISTANI_CITIES } from '../data/atelierData';
import { X, Trash2, ShoppingBag, ShieldCheck, ArrowRight, Check, Scissors, Clock, CreditCard } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOrderCompleted: (newOrder: OrderStatus) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearCart,
  onOrderCompleted
}) => {
  if (!isOpen) return null;

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [clientName, setClientName] = useState('Zainab Tariq');
  const [clientPhone, setClientPhone] = useState('0300-8451299');
  const [city, setCity] = useState('Lahore');
  const [deliveryAddress, setDeliveryAddress] = useState('House 84, Block F, Model Town, Lahore');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'jazzcash_easypaisa' | 'bank_transfer'>('cod');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<OrderStatus | null>(null);

  const subtotalPKR = items.reduce((acc, item) => acc + item.calculatedPrice.totalPKR, 0);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `AUR-${randomNum}`;

    const newOrder: OrderStatus = {
      orderId: newOrderId,
      clientName: clientName || 'Valued Client',
      garmentName: items.map(i => i.title).join(' & '),
      city,
      placedDate: 'October 24, 2026',
      targetCompletionDate: 'November 02, 2026',
      currentStep: 0,
      totalAmountPKR: subtotalPKR,
      steps: [
        {
          title: 'Measurements & Paper Pattern Drafted',
          date: 'In Progress · Oct 24',
          description: 'Master Darzi drafting custom individual sloper block.',
          completed: false,
          current: true
        },
        {
          title: 'Fabric Shrinking & Grain-Aligned Rotary Cutting',
          date: 'Estimated Oct 26',
          description: 'Textile steamed, de-linted, grain-aligned, and rotary cut.',
          completed: false,
          current: false
        },
        {
          title: 'Master Darzi Assembly & Hand Basting',
          date: 'Estimated Oct 28',
          description: 'Joining panels, stay-taping side chaaks, and sewing malmal lining.',
          completed: false,
          current: false
        },
        {
          title: 'Adda Hand Work & Gota Kinari Finishing',
          date: 'Estimated Oct 30',
          description: 'Appliqueing patches, pearl button placket, and pressed pancha canvas.',
          completed: false,
          current: false
        },
        {
          title: 'Final Steam Press & Courier Dispatch',
          date: 'Estimated Nov 02',
          description: 'Steam pressing and dispatched in sealed suit cover with COD bill.',
          completed: false,
          current: false
        }
      ],
      tailorNotes: specialInstructions || 'Client confirmed custom measurements. Added 2-inch inner side alteration margin.',
      measurementsSummary: items[0]?.config.measurements 
        ? `Kameez: ${items[0].config.measurements.kameezLength}", Chest: ${items[0].config.measurements.chest}", Waist: ${items[0].config.measurements.waist}", Pancha: ${items[0].config.measurements.panchaTrouserOpening}"`
        : 'Doorstep fitting / Standard size assigned.',
      fabricUsed: items[0]?.config.selectedFabric 
        ? `${items[0].config.selectedFabric.name} (${items[0].config.selectedColor?.name || 'Selected'})` 
        : (items[0]?.config.clientBrandFabricName || 'Client Provided Unstitched Suit (BYOF Rider Pickup Scheduled)')
    };

    onOrderCompleted(newOrder);
    setConfirmedOrder(newOrder);
    onClearCart();
    setIsCheckingOut(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-lg bg-[#FAF9F6] h-full shadow-2xl flex flex-col justify-between border-l border-[#E6E0D6] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 border-b border-[#EAE5DD] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#7D5A44]" />
            <h2 className="font-serif text-xl font-semibold text-[#1A1A1A]">
              Atelier Bag ({items.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#78716C] hover:text-[#1A1A1A] rounded-full hover:bg-[#EFECE6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          {confirmedOrder ? (
            <div className="p-6 bg-white border border-[#E6E0D6] rounded-sm text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-[#7D5A44] font-medium">Order Confirmed (آرڈر منظور)</span>
                <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] mt-1">
                  Order #{confirmedOrder.orderId}
                </h3>
                <p className="text-xs text-[#57534E] mt-2 leading-relaxed">
                  Thank you, <strong>{confirmedOrder.clientName}</strong>. Your custom piece has entered our Master Darzi queue.
                </p>
              </div>

              <div className="p-3 bg-[#FAF9F6] border border-[#EAE5DD] rounded-sm text-xs text-left space-y-1">
                <div>• <strong>Garment:</strong> {confirmedOrder.garmentName}</div>
                <div>• <strong>City:</strong> {confirmedOrder.city}</div>
                <div>• <strong>Total Payable:</strong> PKR {confirmedOrder.totalAmountPKR.toLocaleString()}</div>
                <div>• <strong>Estimated Delivery:</strong> {confirmedOrder.targetCompletionDate}</div>
                <div>• <strong>Tracking:</strong> Track live in the <em>Order Tracker</em> anytime using ID <strong>{confirmedOrder.orderId}</strong>.</div>
              </div>

              <button
                onClick={() => {
                  setConfirmedOrder(null);
                  onClose();
                }}
                className="w-full py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase rounded-sm hover:bg-[#38332E]"
              >
                Close Bag
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Scissors className="w-10 h-10 text-[#C5BBAF] mx-auto" />
              <div className="font-serif text-lg text-[#1A1A1A]">Your Atelier Bag is Empty</div>
              <p className="text-xs text-[#78716C] max-w-xs mx-auto">
                Design a custom shalwar kameez, frock, or maxi in the Custom Studio.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase rounded-sm hover:bg-[#38332E]"
              >
                Open Custom Studio
              </button>
            </div>
          ) : !isCheckingOut ? (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white border border-[#E6E0D6] rounded-sm space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-serif text-base font-semibold text-[#1A1A1A]">
                        {item.title}
                      </h4>
                      <div className="text-xs text-[#7D5A44] font-medium capitalize mt-0.5">
                        {item.config.neckline.replace(/_/g, ' ')} · {item.config.sleeve.replace(/_/g, ' ')} · {item.config.bottomStyle.replace(/_/g, ' ')}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[#A8998C] hover:text-red-600 transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-[11px] text-[#6B655F] space-y-1 bg-[#FAF9F6] p-2.5 rounded-sm border border-[#EAE5DD]">
                    <div>
                      <strong>Textile:</strong> {item.config.selectedFabric ? `${item.config.selectedFabric.name} (${item.config.selectedColor?.name})` : (item.config.clientBrandFabricName || 'Client Unstitched Brand Suit (BYOF)')}
                    </div>
                    <div>
                      <strong>Lining:</strong> {item.config.lining.replace(/_/g, ' ')}
                    </div>
                    <div>
                      <strong>Fitting:</strong> {item.config.measurementMethod.replace(/_/g, ' ')}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#EAE5DD] text-xs">
                    <span className="text-[#78716C] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.estimatedDays} Days Stitching</span>
                    </span>
                    <span className="font-serif text-base font-bold text-[#1A1A1A] tabular-nums">
                      PKR {item.calculatedPrice.totalPKR.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}

              <div className="p-3 bg-[#EFECE6] border border-[#D5CBBF] rounded-sm text-xs text-[#57534E] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#7D5A44] shrink-0 mt-0.5" />
                <span>
                  <strong>Pakistani Fit Guarantee:</strong> 2-inch inner alteration margin & free alterations across Pakistan.
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
              <div className="font-serif text-base font-semibold text-[#1A1A1A] pb-2 border-b border-[#EAE5DD]">
                Delivery & Payment Coordinates (پاکستان بھر میں ڈلیوری)
              </div>

              <div>
                <label className="text-[11px] text-[#78716C] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E6E0D6] rounded-sm text-xs text-[#1A1A1A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#78716C] block mb-1">City (شہر)</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E6E0D6] rounded-sm text-xs"
                  >
                    {PAKISTANI_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-[#78716C] block mb-1">Phone (WhatsApp updates)</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full p-2.5 bg-white border border-[#E6E0D6] rounded-sm text-xs text-[#1A1A1A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#78716C] block mb-1">Street Address & Area</label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E6E0D6] rounded-sm text-xs text-[#1A1A1A]"
                />
              </div>

              {/* Payment method selector */}
              <div>
                <label className="text-[11px] text-[#78716C] block mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cod', label: 'Cash on Delivery (COD)' },
                    { id: 'jazzcash_easypaisa', label: 'JazzCash / EasyPaisa' },
                    { id: 'bank_transfer', label: 'Online Bank Transfer' }
                  ].map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentMethod(p.id as any)}
                      className={`p-2 text-left rounded-sm border text-[11px] ${
                        paymentMethod === p.id ? 'border-[#1A1A1A] bg-white font-semibold ring-1 ring-[#1A1A1A]' : 'border-[#E6E0D6] bg-[#FAF9F6]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#78716C] block mb-1">Special Stitching Notes</label>
                <textarea
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Wedding date is next weekend; please apply gotta lace on all 4 sides of dupatta."
                  className="w-full p-2.5 bg-white border border-[#E6E0D6] rounded-sm text-xs text-[#1A1A1A]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="text-xs text-[#78716C] hover:underline"
                >
                  ← Back to Bag
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase rounded-sm hover:bg-[#38332E]"
                >
                  Confirm Custom Stitching
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer with Totals in PKR */}
        {!confirmedOrder && items.length > 0 && !isCheckingOut && (
          <div className="p-6 border-t border-[#EAE5DD] bg-white space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-[11px] text-[#78716C] uppercase tracking-wider">Total Commission</div>
                <div className="text-xs text-[#78716C]">Includes doorstep delivery & alteration guarantee</div>
              </div>
              <div className="font-serif text-2xl font-bold text-[#1A1A1A] tabular-nums">
                PKR {subtotalPKR.toLocaleString()}
              </div>
            </div>

            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full py-3.5 bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase rounded-sm hover:bg-[#38332E] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Proceed to Booking & Delivery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
