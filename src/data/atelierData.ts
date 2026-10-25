import { 
  GarmentCategory, 
  NecklineType, 
  SleeveType, 
  BottomType,
  HemLength, 
  FabricType, 
  EmbellishmentType, 
  OrderStatus,
  BodyMeasurements
} from '../types/stitching';

export interface GarmentDefinition {
  id: GarmentCategory;
  title: string;
  urduTitle: string;
  subtitle: string;
  baseStitchingPricePKR: number;
  fabricMetersNeeded: number;
  standardTurnaroundDays: number;
  description: string;
  defaultNeckline: NecklineType;
  defaultSleeve: SleeveType;
  defaultBottom: BottomType;
  defaultLength: HemLength;
  recommendedFabrics: string[];
  features: string[];
}

export const GARMENT_DEFINITIONS: GarmentDefinition[] = [
  {
    id: 'shalwar_kameez',
    title: 'Classic 3-Piece Shalwar Kameez',
    urduTitle: 'شلوار قمیض',
    subtitle: 'Signature tailored kameez with side chaaks, daman facing, and custom pleated shalwar or trouser',
    baseStitchingPricePKR: 3800,
    fabricMetersNeeded: 4.5,
    standardTurnaroundDays: 6,
    description: 'Expertly patterned for a graceful, gap-free shoulder fit and smooth fall across the chest. Includes inner cotton malmal or silk slip lining, reinforced side chaaks, and neat pancha canvas pressing.',
    defaultNeckline: 'sherwani_collar',
    defaultSleeve: 'kurta_cut',
    defaultBottom: 'patiala_shalwar',
    defaultLength: 'knee_length',
    recommendedFabrics: ['raw-silk', 'swiss-lawn', 'chiffon-bamber'],
    features: ['Reinforced side chaak stay-tape', 'Pancha canvas interlining', 'Inner seam alteration margin of 2 inches']
  },
  {
    id: 'kalidar_frock',
    title: '32-Kali Flared Anarkali Frock',
    urduTitle: 'کلی دار فراک',
    subtitle: 'Dramatic festive kalidar with tailored choli bodice and sweeping flared kali panels',
    baseStitchingPricePKR: 7500,
    fabricMetersNeeded: 6.0,
    standardTurnaroundDays: 10,
    description: 'Each of the 32 kalis is individually bias-cut and aligned to create maximum flare at the ghera without bulkiness at the natural waist. Includes full inner lining, gota border finish, and matching churidar.',
    defaultNeckline: 'sweetheart',
    defaultSleeve: 'choori_daar',
    defaultBottom: 'churidar',
    defaultLength: 'ankle_length',
    recommendedFabrics: ['chiffon-bamber', 'raw-silk', 'micro-velvet'],
    features: ['32 individual bias kalis', 'Inner can-can netting optional', 'Hand-stitched gota patti daman']
  },
  {
    id: 'formal_maxi',
    title: 'Bridal & Party Wear Embellished Maxi',
    urduTitle: 'میکسی / گاؤن',
    subtitle: 'Floor-grazing couture maxi with contour darting, built-in bustier, and flared can-can skirt',
    baseStitchingPricePKR: 14500,
    fabricMetersNeeded: 7.5,
    standardTurnaroundDays: 14,
    description: 'Haute couture construction tailored for Pakistani weddings and formal receptions. Includes structured inner boning, double shamooz lining, heavy flare can-can, and weighted velvet/raw-silk hem border.',
    defaultNeckline: 'sweetheart',
    defaultSleeve: 'bell_bottom',
    defaultBottom: 'flared_palazzo',
    defaultLength: 'floor_length',
    recommendedFabrics: ['raw-silk', 'micro-velvet', 'banarasi-jamawar'],
    features: ['Built-in inner corset boning', 'Layered stiff can-can skirt', 'Weighted hem border for regal fall']
  },
  {
    id: 'angrakha_gharara',
    title: 'Royal Angrakha & Flared Gharara Suit',
    urduTitle: 'انگرکھا اور غرارہ',
    subtitle: 'Traditional mughal crossover angrakha tunic with heavy two-tier flared gharara',
    baseStitchingPricePKR: 8500,
    fabricMetersNeeded: 6.5,
    standardTurnaroundDays: 10,
    description: 'Diagonal crossover angrakha front with handmade silk dori and latkan tassels, paired with a two-tier gathered gharara trimmed with delicate gota kinari and tissue piping.',
    defaultNeckline: 'angrakha_wrap',
    defaultSleeve: 'choori_daar',
    defaultBottom: 'flared_gharara',
    defaultLength: 'knee_length',
    recommendedFabrics: ['raw-silk', 'chiffon-bamber', 'banarasi-jamawar'],
    features: ['Handmade silk dori & latkan tassels', 'Two-tier flared knee-ruched gharara', 'Full inner malmal lining']
  },
  {
    id: 'saree_blouse',
    title: 'Couture Padded Saree Blouse / Choli',
    urduTitle: 'ساڑھی بلاؤز / چولی',
    subtitle: 'Precision padded princess-cut bodice with customizable deep back and dori tie-up',
    baseStitchingPricePKR: 3500,
    fabricMetersNeeded: 1.2,
    standardTurnaroundDays: 5,
    description: 'Precision molded padded cups positioned to your exact bust apex distance. Double cotton lining, secure hook-and-eye placket, and deep back tie-ups.',
    defaultNeckline: 'sweetheart',
    defaultSleeve: 'sleeveless',
    defaultBottom: 'cigarette_pants',
    defaultLength: 'knee_length',
    recommendedFabrics: ['raw-silk', 'banarasi-jamawar', 'micro-velvet'],
    features: ['Contour padded cups', 'Deep back cut with dori tie-ups', '2-inch inner alteration margin']
  },
  {
    id: 'kurti_trouser',
    title: 'Straight Cut Kurti & Cigarette Pants',
    urduTitle: 'کرتی اور سگریٹ پینٹس',
    subtitle: 'Modern Pakistani daily wear & office silhouette with intricate pintex and lace detailing',
    baseStitchingPricePKR: 2800,
    fabricMetersNeeded: 3.5,
    standardTurnaroundDays: 5,
    description: 'Clean, minimalist Pakistani silhouette with clean straight cut, organza lace inserts on daman and sleeves, paired with tailored cigarette pants with pintex.',
    defaultNeckline: 'round_patti',
    defaultSleeve: 'kurta_cut',
    defaultBottom: 'cigarette_pants',
    defaultLength: 'knee_length',
    recommendedFabrics: ['swiss-lawn', 'raw-silk', 'chiffon-bamber'],
    features: ['Pintex pleating on trousers', 'Organza lace inserts on daman & sleeves', 'Deep in-seam pockets']
  }
];

export const NECKLINES: { id: NecklineType; name: string; urduName: string; description: string }[] = [
  {
    id: 'sherwani_collar',
    name: 'Sherwani Ban Collar (V-Slit)',
    urduName: 'شیروانی بین گلا',
    description: 'Crisp 2.5cm raised stand ban collar with a modest front V-slit and fabric button closures.'
  },
  {
    id: 'sweetheart',
    name: 'Paan Gala (Sweetheart Arch)',
    urduName: 'پان گلا',
    description: 'Graceful leaf/heart curve contoured with silk piping that accentuates the neckline.'
  },
  {
    id: 'angrakha_wrap',
    name: 'Angrakha Diagonal Overlap',
    urduName: 'انگرکھا گلا',
    description: 'Asymmetric crossover diagonal neckline with loop buttons and handmade silk dori latkans.'
  },
  {
    id: 'boat_neck',
    name: 'Kashti Gala (Boat Neck)',
    urduName: 'کشتی گلا',
    description: 'Horizontal wide neckline extending shoulder-to-shoulder, framed with organza lace.'
  },
  {
    id: 'keyhole_dori',
    name: 'Keyhole Gala with Dori Tassels',
    urduName: 'ڈوری والا گلا',
    description: 'Modest teardrop keyhole opening tied with handmade resham and pearl latkans.'
  },
  {
    id: 'round_patti',
    name: 'Round Neck with Embroidered Patti',
    urduName: 'گول پٹی گلا',
    description: 'Classic round neckline with vertical embroidered front placket patti.'
  },
  {
    id: 'square_cut',
    name: 'Chokor Gala (Modern Square Cut)',
    urduName: 'چوکور گلا',
    description: 'Clean right-angled architectural neckline, structured with stay-tape to prevent gaping.'
  }
];

export const SLEEVES: { id: SleeveType; name: string; urduName: string; description: string }[] = [
  {
    id: 'choori_daar',
    name: 'Choori Daar Sleeves (Gathered)',
    urduName: 'چوڑی دار آستین',
    description: 'Extra length tailored sleeve (32 inches) creating 8-12 elegant fabric gathers (choorian) at the wrist.'
  },
  {
    id: 'bell_bottom',
    name: 'Bell Bottom Flared Sleeves',
    urduName: 'بیل باٹم آستین',
    description: 'Fitted through the upper arm and flaring from elbow down, edged with organza scalloped lace.'
  },
  {
    id: 'kurta_cut',
    name: 'Straight Kurta Cut with Cuff',
    urduName: 'سیدھی کرتا آستین',
    description: 'Traditional Pakistani straight sleeve with subtle slit vent at the wrist and contrast magzi.'
  },
  {
    id: 'bishop_cuff',
    name: 'Balloon / Bishop Sleeve with Pearl Cuff',
    urduName: 'بیلون آستین',
    description: 'Voluminous blouson gathered sleeve tapering into a fitted 3-button cuff.'
  },
  {
    id: 'cape_sleeve',
    name: 'Royal Split Cape Sleeves',
    urduName: 'کیپ آستین',
    description: 'Floor-sweeping open split sleeve revealing delicate inner arm embroidery.'
  },
  {
    id: 'sleeveless',
    name: 'Sleeveless with Shamooz Piping',
    urduName: 'بغیر آستین',
    description: 'Curved hand-bound armhole finish with no visible topstitching.'
  }
];

export const BOTTOM_STYLES: { id: BottomType; name: string; urduName: string; description: string }[] = [
  {
    id: 'patiala_shalwar',
    name: 'Patiala / Khari Shalwar',
    urduName: 'پٹیالہ شلوار',
    description: 'Generous traditional flared shalwar with 60+ pleats and stiff canvas pressed pancha.'
  },
  {
    id: 'cigarette_pants',
    name: 'Straight Cigarette Pants / Capri',
    urduName: 'سگریٹ پینٹس',
    description: 'Sleek tailored trouser with side slits, delicate pintex pleating, and organza lace inserts.'
  },
  {
    id: 'flared_gharara',
    name: 'Two-Tier Flared Gharara / Sharara',
    urduName: 'غرارہ / شرارہ',
    description: 'Gathered at the knee with gotta lace and opening into sweeping flares at the hem.'
  },
  {
    id: 'tulip_shalwar',
    name: 'Overlapping Tulip Shalwar',
    urduName: 'ٹیولپ شلوار',
    description: 'Petal-shaped curved overlap front with pearl beads and loop trims.'
  },
  {
    id: 'churidar',
    name: 'Traditional Churidar Pajama',
    urduName: 'چوڑی دار پاجامہ',
    description: 'Skin-fitted bias-cut bottom that forms graceful horizontal gathers at the ankle.'
  },
  {
    id: 'flared_palazzo',
    name: 'Wide-Leg Flowing Palazzo',
    urduName: 'پلازو',
    description: 'High-waist wide flare trousers crafted from fluid silk or chiffon with side pockets.'
  }
];

export const FABRIC_LIBRARY: FabricType[] = [
  {
    id: 'raw-silk',
    name: 'Pure 80g PK Raw Silk (Rawsilk)',
    material: '100% Handloom Mulberry Raw Silk (80 GSM)',
    category: 'raw_silk',
    pricePerMeterPKR: 2800,
    drape: 'Structured & Crisp',
    season: 'Year-round',
    colors: [
      { name: 'Emerald Sabz', hex: '#1C3F35' },
      { name: 'Blush Gulabi', hex: '#C59B97' },
      { name: 'Ivory Safaid', hex: '#EDE6D6' },
      { name: 'Midnight Surmai', hex: '#1B263B' },
      { name: 'Deep Ruby Surkh', hex: '#8B263E' }
    ],
    description: 'The quintessential fabric for Pakistani luxury pret and formal wear. Holds pleats, cuts, and zardozi embroidery with majestic elegance.'
  },
  {
    id: 'chiffon-bamber',
    name: 'Pure Bamber Chiffon',
    material: '100% Pure Silk Bamber Chiffon',
    category: 'chiffon',
    pricePerMeterPKR: 1950,
    drape: 'Fluid & Flowing',
    season: 'Year-round',
    colors: [
      { name: 'Powder Ferozi', hex: '#A3B8C8' },
      { name: 'Pistachio Pista', hex: '#A8B9A0' },
      { name: 'Dusk Jamuni', hex: '#635368' },
      { name: 'Jet Siyah', hex: '#1C1B1B' }
    ],
    description: 'Feather-light crinkled silk chiffon imported from Korean looms. Floats gracefully for dupattas, flowing maxis, and kalidar frocks.'
  },
  {
    id: 'swiss-lawn',
    name: 'St. Gallen Swiss Voile & Lawn',
    material: '100% Combed Cotton Voile (80/80 Count)',
    category: 'lawn',
    pricePerMeterPKR: 1250,
    drape: 'Fluid & Flowing',
    season: 'Summer & Spring',
    colors: [
      { name: 'Pearl Safaid', hex: '#F7F6F2' },
      { name: 'Almond Badami', hex: '#D8CFBC' },
      { name: 'Rosewater Gulab', hex: '#DDB6AA' },
      { name: 'Olive Zaitoon', hex: '#4A533E' }
    ],
    description: 'Ultra-breathable premium Egyptian cotton weave. Perfect for summer luxury kurtis, daily shalwar kameez, and embroidered lawn suits.'
  },
  {
    id: 'micro-velvet',
    name: 'Micro 9000 Pure Silk Velvet',
    material: 'Silk Blend High-Pile Micro 9000',
    category: 'velvet',
    pricePerMeterPKR: 3500,
    drape: 'Rich & Heavy',
    season: 'Winter Festive',
    colors: [
      { name: 'Imperial Jamuni Plum', hex: '#482038' },
      { name: 'Royal Maroon Yaqoot', hex: '#5E1926' },
      { name: 'Deep Forest Kastoori', hex: '#243D2F' },
      { name: 'Obsidian Velvet Siyah', hex: '#18181A' }
    ],
    description: 'Lustrous, dense pile velvet famous for Pakistani winter shaadi wear, regal shawls, and bridal maxis.'
  },
  {
    id: 'banarasi-jamawar',
    name: 'Pure Silk Banarasi Jamawar Brocade',
    material: 'Pure Silk with Zari Warp & Weft',
    category: 'banarasi',
    pricePerMeterPKR: 3200,
    drape: 'Structured & Crisp',
    season: 'Wedding Season',
    colors: [
      { name: 'Antique Gold Zari', hex: '#C29B38' },
      { name: 'Rust Sindoor', hex: '#B2624F' },
      { name: 'Silver Chandi', hex: '#D9D9D9' }
    ],
    description: 'Woven with gold and silver zari threads on pure silk. Ideal for formal ghararas, lehengas, and statement blazers.'
  }
];

export const EMBELLISHMENT_OPTIONS: EmbellishmentType[] = [
  {
    id: 'hand_adda_work',
    name: 'Hand Adda Needlework (Zardozi, Dabka & Sitara)',
    pricePKR: 6500,
    description: 'Artisanal hand embroidery on wooden adda frames using metallic French wire (dabka), sequins, and naqshi.'
  },
  {
    id: 'gota_kinari_tilla',
    name: 'Gota Kinari & Tilla Metallic Lace Trim',
    pricePKR: 2500,
    description: 'Hand-sewn metallic gota patti and traditional Lahore kinari along necklines, sleeves, and daman borders.'
  },
  {
    id: 'organza_lace_cutwork',
    name: 'Organza Tissue Insert & Scalloped Cutwork',
    pricePKR: 1800,
    description: 'Millimeter-precise scalloped laser-cut edges and pleating across daman, chaaks, and trouser bottoms.'
  },
  {
    id: 'shamooz_piping_latkans',
    name: 'Silk Shamooz Magzi Piping & Pearl Latkans',
    pricePKR: 1400,
    description: 'Contrasting pure silk shamooz piping on all side chaaks and handmade pearl drop tassels on dori ties.'
  },
  {
    id: 'pintex_pleating',
    name: 'Artisanal Pintex & Shadow-Work Detailing',
    pricePKR: 1600,
    description: 'Precision geometric pintex pleating and shadow-work stitching on chest yokes and trouser cuffs.'
  }
];

export const LOOKBOOK_SHOWCASE = [
  {
    id: 'look-1',
    title: 'The Sabz Silk Formal Embellished Maxi',
    category: 'Wedding Festive & Reception',
    image: '/src/assets/images/lookbook_evening_gown_1792879884546.jpg',
    garmentId: 'formal_maxi' as GarmentCategory,
    neckline: 'sweetheart' as NecklineType,
    sleeve: 'bell_bottom' as SleeveType,
    bottomStyle: 'flared_palazzo' as BottomType,
    length: 'floor_length' as HemLength,
    fabricId: 'raw-silk',
    colorHex: '#1C3F35',
    colorName: 'Emerald Sabz',
    stitchingDays: 12,
    priceStitchingOnlyPKR: 14500,
    priceWithFabricPKR: 35500,
    craftsmanship: 'Floor-grazing silhouette with double silk shamooz lining, weighted velvet hemline, and can-can skirt.'
  },
  {
    id: 'look-2',
    title: 'Bone White Raw Silk Kurta & Cigarette Pants',
    category: 'Luxury Pret & Eid Collection',
    image: '/src/assets/images/lookbook_bespoke_suit_1792879885413.jpg',
    garmentId: 'shalwar_kameez' as GarmentCategory,
    neckline: 'sherwani_collar' as NecklineType,
    sleeve: 'kurta_cut' as SleeveType,
    bottomStyle: 'cigarette_pants' as BottomType,
    length: 'knee_length' as HemLength,
    fabricId: 'raw-silk',
    colorHex: '#EDE6D6',
    colorName: 'Ivory Safaid',
    stitchingDays: 6,
    priceStitchingOnlyPKR: 4200,
    priceWithFabricPKR: 16800,
    craftsmanship: 'Immaculate ban collar with mother-of-pearl buttons, side chaak silk piping, and pintex cigarette pants.'
  },
  {
    id: 'look-3',
    title: 'Rosewater Zardozi Kalidar Festive Frock',
    category: 'Bridal Troussseau & Shendi',
    image: '/src/assets/images/lookbook_ethnic_couture_1792879885502.jpg',
    garmentId: 'kalidar_frock' as GarmentCategory,
    neckline: 'sweetheart' as NecklineType,
    sleeve: 'choori_daar' as SleeveType,
    bottomStyle: 'churidar' as BottomType,
    length: 'ankle_length' as HemLength,
    fabricId: 'raw-silk',
    colorHex: '#C59B97',
    colorName: 'Blush Gulabi',
    stitchingDays: 10,
    priceStitchingOnlyPKR: 7500,
    priceWithFabricPKR: 24300,
    craftsmanship: '32-kali flared frock with gold dabka & sitara adda work, custom bustier cups, and choori daar sleeves.'
  }
];

export const SAMPLE_ORDERS: Record<string, OrderStatus> = {
  'AUR-8921': {
    orderId: 'AUR-8921',
    clientName: 'Ayesha Khan',
    garmentName: '32-Kali Flared Anarkali Frock (Emerald Sabz)',
    city: 'Lahore (Gulberg III)',
    placedDate: 'October 18, 2026',
    targetCompletionDate: 'October 27, 2026',
    currentStep: 2,
    totalAmountPKR: 24500,
    steps: [
      {
        title: 'Measurements & Paper Pattern Sloper Drafted',
        date: 'Oct 19, 2026',
        description: 'Master Darzi drafted custom 36"-28"-39" individual paper pattern block.',
        completed: true,
        current: false
      },
      {
        title: 'Fabric Shrinkage, Steaming & Kali Rotary Cutting',
        date: 'Oct 21, 2026',
        description: 'Bamber chiffon steamed and 32 kalis precision bias-cut with grain alignment.',
        completed: true,
        current: false
      },
      {
        title: 'Master Darzi Assembly & Hand Basting',
        date: 'In Progress · Oct 24',
        description: 'Joining kali panels, encasing French seams, and attaching cotton malmal lining.',
        completed: false,
        current: true
      },
      {
        title: 'Adda Hand Work & Gota Kinari Finishing',
        date: 'Estimated Oct 25',
        description: 'Hand-sewing gota borders, pearl tassels, and dori tie-up.',
        completed: false,
        current: false
      },
      {
        title: 'Final Steam Press & Doorstep Delivery',
        date: 'Estimated Oct 27',
        description: 'Cedarwood pressing, breathable luxury suit cover, and tracked courier dispatch.',
        completed: false,
        current: false
      }
    ],
    tailorNotes: 'Client requested 1 inch extra ease on armhole (mudda) and 2.5 inch extra choorian on sleeves. Verified pure malmal inner lining.',
    measurementsSummary: 'Kameez Length: 48", Chest: 36", Waist: 28", Hip: 39", Teera: 15", Armhole: 16", Churidar Length: 44"',
    fabricUsed: 'Pure Bamber Chiffon (Emerald Sabz) · 6.0 Meters'
  },
  'AUR-9044': {
    orderId: 'AUR-9044',
    clientName: 'Mahnoor Tariq',
    garmentName: 'Raw Silk Shalwar Kameez & Patiala (Ivory Safaid)',
    city: 'Karachi (Clifton Block 4)',
    placedDate: 'October 20, 2026',
    targetCompletionDate: 'October 26, 2026',
    currentStep: 3,
    totalAmountPKR: 16800,
    steps: [
      {
        title: 'Measurements & Paper Pattern Sloper Drafted',
        date: 'Oct 21, 2026',
        description: 'Kameez block drafted with straight side chaak pitch and ban collar curvature.',
        completed: true,
        current: false
      },
      {
        title: 'Fabric Shrinkage, Steaming & Precision Cutting',
        date: 'Oct 22, 2026',
        description: '80g PK Raw silk grain-aligned and rotary cut with 2-inch alteration allowance.',
        completed: true,
        current: false
      },
      {
        title: 'Master Darzi Assembly & Basting',
        date: 'Oct 23, 2026',
        description: 'Sewing side chaaks, setting kurta sleeves, and pressing Patiala shalwar pleats.',
        completed: true,
        current: false
      },
      {
        title: 'Finishing & Buttonhole Placket',
        date: 'In Progress · Oct 24',
        description: 'Mother-of-pearl buttons attached, silk magzi piping along chaaks, and pancha canvas set.',
        completed: false,
        current: true
      },
      {
        title: 'Final Steam Press & Doorstep Delivery',
        date: 'Estimated Oct 26',
        description: 'Steam pressing and dispatched via TCS / Leopard Express in sealed garment box.',
        completed: false,
        current: false
      }
    ],
    tailorNotes: 'Patiala shalwar stitched with 64 deep pleats. Pancha canvas kept at 1.5 inches width with 5 rows of fine thread stitching.',
    measurementsSummary: 'Kameez Length: 39", Chest: 38", Waist: 30", Hip: 41", Teera: 15.5", Shalwar Length: 38", Pancha: 7"',
    fabricUsed: 'Pure 80g PK Raw Silk (Ivory Safaid) · 4.5 Meters'
  }
};

export const MEASUREMENT_GUIDE_POINTS = [
  {
    key: 'kameezLength',
    label: 'Kameez / Frock Length (قمیض کی لمبائی)',
    hint: 'From the highest point of shoulder next to the neck straight down over the bust apex to your desired hemline (knee, calf, or ankle).',
    svgCoords: { x: 50, y: 75 }
  },
  {
    key: 'chest',
    label: 'Chest / Bust (چھاتی کی پیمائش)',
    hint: 'Measure horizontally around the fullest part of your chest/bust. Keep tape comfortably snug and level across the back.',
    svgCoords: { x: 50, y: 32 }
  },
  {
    key: 'waist',
    label: 'Natural Waist (کمر کی گولائی)',
    hint: 'Measure around the narrowest part of your torso, usually 1 to 2 inches above the belly button.',
    svgCoords: { x: 50, y: 44 }
  },
  {
    key: 'hip',
    label: 'Hip / Chaak Point (کولہے / چاک کی پیمائش)',
    hint: 'Measure around the fullest prominence of your hips/seat where the side chaak opening of the kameez will begin.',
    svgCoords: { x: 50, y: 58 }
  },
  {
    key: 'shoulderTeera',
    label: 'Shoulder / Teera (تیرا)',
    hint: 'From the tip of one outer shoulder bone across the back of the neck to the other shoulder bone.',
    svgCoords: { x: 50, y: 22 }
  },
  {
    key: 'armhole',
    label: 'Armhole / Mudda (موڈھا)',
    hint: 'Wrap the tape measure around the armpit and over the shoulder joint with arm relaxed at your side.',
    svgCoords: { x: 30, y: 28 }
  },
  {
    key: 'sleeveLength',
    label: 'Sleeve Length (آستین کی لمبائی)',
    hint: 'From outer shoulder bone down to wrist bone (or +6 inches if requesting Choori Daar gathers).',
    svgCoords: { x: 25, y: 40 }
  },
  {
    key: 'damanGhera',
    label: 'Daman / Ghera Flare (دامن / گھیرا)',
    hint: 'Total flat width across the bottom hem of the kameez or total flare circumference for kalidar frocks.',
    svgCoords: { x: 50, y: 78 }
  },
  {
    key: 'shalwarLength',
    label: 'Shalwar / Trouser Length (شلوار کی لمبائی)',
    hint: 'From the waistband/navel straight down to the ankle bone or heel floor level.',
    svgCoords: { x: 50, y: 88 }
  },
  {
    key: 'panchaTrouserOpening',
    label: 'Pancha / Bottom Opening (پانچہ کی چوڑائی)',
    hint: 'Circumference around the bottom ankle opening (typically 6.5" for cigarette pants, 7.5"-8" for shalwar).',
    svgCoords: { x: 50, y: 95 }
  }
];

export const STANDARD_SIZE_PRESETS: Record<string, Partial<BodyMeasurements>> = {
  'XS (Pakistani Size 34)': { kameezLength: 38, chest: 34, waist: 26, hip: 37, shoulderTeera: 14.5, sleeveLength: 21, shalwarLength: 37, panchaTrouserOpening: 6.5 },
  'S (Pakistani Size 36)': { kameezLength: 39, chest: 36, waist: 28, hip: 39, shoulderTeera: 15.0, sleeveLength: 21.5, shalwarLength: 38, panchaTrouserOpening: 7.0 },
  'M (Pakistani Size 38)': { kameezLength: 40, chest: 38, waist: 30, hip: 41, shoulderTeera: 15.5, sleeveLength: 22, shalwarLength: 39, panchaTrouserOpening: 7.0 },
  'L (Pakistani Size 40)': { kameezLength: 41, chest: 41, waist: 33, hip: 44, shoulderTeera: 16.0, sleeveLength: 22.5, shalwarLength: 39.5, panchaTrouserOpening: 7.5 },
  'XL (Pakistani Size 42)': { kameezLength: 42, chest: 44, waist: 36, hip: 47, shoulderTeera: 16.5, sleeveLength: 23, shalwarLength: 40, panchaTrouserOpening: 7.5 },
  '2XL (Pakistani Size 44)': { kameezLength: 42, chest: 47, waist: 39, hip: 50, shoulderTeera: 17.0, sleeveLength: 23, shalwarLength: 40.5, panchaTrouserOpening: 8.0 }
};

export const PAKISTANI_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Sialkot',
  'Gujranwala',
  'Quetta',
  'Overseas Pakistani (Global Courier)'
];
