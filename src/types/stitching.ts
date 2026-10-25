export type GarmentCategory = 
  | 'shalwar_kameez'
  | 'kalidar_frock'
  | 'formal_maxi'
  | 'angrakha_gharara'
  | 'saree_blouse'
  | 'kurti_trouser';

export type NecklineType = 
  | 'sherwani_collar'
  | 'sweetheart'
  | 'angrakha_wrap'
  | 'boat_neck'
  | 'keyhole_dori'
  | 'square_cut'
  | 'round_patti';

export type SleeveType = 
  | 'choori_daar'
  | 'bell_bottom'
  | 'kurta_cut'
  | 'bishop_cuff'
  | 'cape_sleeve'
  | 'sleeveless';

export type BottomType = 
  | 'patiala_shalwar'
  | 'cigarette_pants'
  | 'flared_gharara'
  | 'tulip_shalwar'
  | 'churidar'
  | 'flared_palazzo';

export type HemLength = 
  | 'floor_length'
  | 'ankle_length'
  | 'knee_length'
  | 'asymmetrical';

export type FabricType = {
  id: string;
  name: string;
  material: string;
  category: 'raw_silk' | 'chiffon' | 'lawn' | 'velvet' | 'banarasi';
  pricePerMeterPKR: number;
  drape: 'Fluid & Flowing' | 'Structured & Crisp' | 'Medium Architectural' | 'Rich & Heavy';
  season: 'Year-round' | 'Summer & Spring' | 'Winter Festive' | 'Wedding Season';
  colors: { name: string; hex: string }[];
  description: string;
};

export type EmbellishmentType = {
  id: string;
  name: string;
  pricePKR: number;
  description: string;
};

export type MeasurementMethod = 
  | 'exact_measurements' 
  | 'standard_with_adjustments' 
  | 'doorstep_master_tailor' 
  | 'clone_sample_garment';

export interface BodyMeasurements {
  unit: 'inches' | 'cm';
  kameezLength: number;
  bust: number;
  chest: number;
  waist: number;
  hip: number;
  shoulderTeera: number;
  armhole: number;
  sleeveLength: number;
  wristCuff: number;
  frontGalaDepth: number;
  backGalaDepth: number;
  damanGhera: number;
  shalwarLength: number;
  panchaTrouserOpening: number;
  thighAsan: number;
  notes?: string;
}

export interface CustomGarmentConfig {
  garmentId: GarmentCategory;
  neckline: NecklineType;
  sleeve: SleeveType;
  bottomStyle: BottomType;
  length: HemLength;
  fabricSource: 'atelier_fabric' | 'send_own_fabric';
  clientBrandFabricName?: string; // e.g. Khaadi, Maria B, Baroque unstitched suit
  selectedFabric?: FabricType;
  selectedColor?: { name: string; hex: string };
  lining: 'pure_cotton_malmal' | 'silk_shamooz' | 'unlined';
  embellishments: string[];
  rushTier: 'standard' | 'express';
  measurementMethod: MeasurementMethod;
  measurements?: BodyMeasurements;
  standardSizeBase?: string;
  doorstepAppointment?: {
    date: string;
    slot: string;
    city: 'Lahore' | 'Karachi' | 'Islamabad' | 'Rawalpindi' | 'Faisalabad' | 'Multan' | 'Peshawar' | string;
    area: string;
    address: string;
    phone: string;
  };
  sampleGarmentPickup?: {
    pickupDate: string;
    city: string;
    address: string;
    phone: string;
  };
}

export interface CartItem {
  id: string;
  title: string;
  config: CustomGarmentConfig;
  calculatedPrice: {
    stitchingBasePKR: number;
    fabricCostPKR: number;
    embellishmentsCostPKR: number;
    liningCostPKR: number;
    rushFeePKR: number;
    totalPKR: number;
  };
  estimatedDays: number;
  previewImage?: string;
}

export interface OrderStatus {
  orderId: string;
  clientName: string;
  garmentName: string;
  city: string;
  placedDate: string;
  targetCompletionDate: string;
  currentStep: number; // 0 to 4
  steps: {
    title: string;
    date?: string;
    description: string;
    completed: boolean;
    current: boolean;
  }[];
  tailorNotes: string;
  measurementsSummary: string;
  fabricUsed: string;
  totalAmountPKR: number;
}
