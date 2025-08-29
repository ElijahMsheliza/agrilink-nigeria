// Nigerian States with Codes
export const NIGERIAN_STATES = [
  { name: 'Abia', code: 'AB' },
  { name: 'Adamawa', code: 'AD' },
  { name: 'Akwa Ibom', code: 'AK' },
  { name: 'Anambra', code: 'AN' },
  { name: 'Bauchi', code: 'BA' },
  { name: 'Bayelsa', code: 'BY' },
  { name: 'Benue', code: 'BE' },
  { name: 'Borno', code: 'BO' },
  { name: 'Cross River', code: 'CR' },
  { name: 'Delta', code: 'DE' },
  { name: 'Ebonyi', code: 'EB' },
  { name: 'Edo', code: 'ED' },
  { name: 'Ekiti', code: 'EK' },
  { name: 'Enugu', code: 'EN' },
  { name: 'Federal Capital Territory', code: 'FC' },
  { name: 'Gombe', code: 'GO' },
  { name: 'Imo', code: 'IM' },
  { name: 'Jigawa', code: 'JI' },
  { name: 'Kaduna', code: 'KD' },
  { name: 'Kano', code: 'KN' },
  { name: 'Katsina', code: 'KT' },
  { name: 'Kebbi', code: 'KE' },
  { name: 'Kogi', code: 'KO' },
  { name: 'Kwara', code: 'KW' },
  { name: 'Lagos', code: 'LA' },
  { name: 'Nasarawa', code: 'NA' },
  { name: 'Niger', code: 'NI' },
  { name: 'Ogun', code: 'OG' },
  { name: 'Ondo', code: 'ON' },
  { name: 'Osun', code: 'OS' },
  { name: 'Oyo', code: 'OY' },
  { name: 'Plateau', code: 'PL' },
  { name: 'Rivers', code: 'RI' },
  { name: 'Sokoto', code: 'SO' },
  { name: 'Taraba', code: 'TA' },
  { name: 'Yobe', code: 'YO' },
  { name: 'Zamfara', code: 'ZA' }
] as const;

// Major Agricultural Crops in Nigeria
export const MAJOR_CROPS = [
  'Rice',
  'Maize', 
  'Cassava',
  'Yam',
  'Plantain',
  'Cocoa',
  'Palm Oil',
  'Sorghum',
  'Millet',
  'Groundnut',
  'Soybean',
  'Cowpea',
  'Sweet Potato',
  'Irish Potato',
  'Tomato',
  'Pepper',
  'Onion',
  'Garlic',
  'Ginger',
  'Turmeric',
  'Cotton',
  'Sugarcane',
  'Tobacco',
  'Kola Nut',
  'Cashew',
  'Mango',
  'Orange',
  'Banana',
  'Pineapple',
  'Watermelon',
  'Melon',
  'Cucumber',
  'Carrot',
  'Cabbage',
  'Lettuce',
  'Spinach',
  'Okra',
  'Eggplant',
  'Green Beans',
  'Peas'
] as const;

// Quality Grades for Products
export const QUALITY_GRADES = [
  'premium',
  'grade_a', 
  'grade_b',
  'grade_c'
] as const;

// Measurement Units
export const MEASUREMENT_UNITS = [
  'bags',
  'tonnes',
  'kilograms'
] as const;

// Company Types for Buyers
export const COMPANY_TYPES = [
  'processor',
  'exporter',
  'wholesaler',
  'retailer'
] as const;

// Payment Terms
export const PAYMENT_TERMS = [
  'cash',
  'credit_30_days',
  'credit_60_days',
  'credit_90_days',
  'bank_transfer',
  'mobile_money'
] as const;

// Certifications
export const CERTIFICATIONS = [
  'Organic',
  'NAFDAC',
  'SON',
  'ISO_9001',
  'HACCP',
  'GMP',
  'Fair_Trade',
  'Rainforest_Alliance',
  'UTZ_Certified',
  'Global_GAP'
] as const;

// Storage Methods
export const STORAGE_METHODS = [
  'Warehouse',
  'Silo',
  'Cold_Storage',
  'Refrigerated',
  'Dry_Storage',
  'Controlled_Atmosphere',
  'Modified_Atmosphere',
  'Vacuum_Packed',
  'Bulk_Storage',
  'Container_Storage'
] as const;

// Crop Varieties (examples for major crops)
export const CROP_VARIETIES = {
  'Rice': [
    'FARO 44',
    'FARO 52',
    'FARO 60',
    'NERICA 1',
    'NERICA 2',
    'NERICA 3',
    'NERICA 4',
    'NERICA 5',
    'NERICA 6',
    'NERICA 7',
    'NERICA 8',
    'NERICA 9',
    'NERICA 10',
    'NERICA 11',
    'NERICA 12',
    'NERICA 13',
    'NERICA 14',
    'NERICA 15',
    'NERICA 16',
    'NERICA 17',
    'NERICA 18',
    'NERICA 19',
    'NERICA 20',
    'NERICA 21',
    'NERICA 22',
    'NERICA 23',
    'NERICA 24',
    'NERICA 25',
    'NERICA 26',
    'NERICA 27',
    'NERICA 28',
    'NERICA 29',
    'NERICA 30',
    'NERICA 31',
    'NERICA 32',
    'NERICA 33',
    'NERICA 34',
    'NERICA 35',
    'NERICA 36',
    'NERICA 37',
    'NERICA 38',
    'NERICA 39',
    'NERICA 40',
    'NERICA 41',
    'NERICA 42',
    'NERICA 43',
    'NERICA 44',
    'NERICA 45',
    'NERICA 46',
    'NERICA 47',
    'NERICA 48',
    'NERICA 49',
    'NERICA 50',
    'NERICA 51',
    'NERICA 52',
    'NERICA 53',
    'NERICA 54',
    'NERICA 55',
    'NERICA 56',
    'NERICA 57',
    'NERICA 58',
    'NERICA 59',
    'NERICA 60',
    'NERICA 61',
    'NERICA 62',
    'NERICA 63',
    'NERICA 64',
    'NERICA 65',
    'NERICA 66',
    'NERICA 67',
    'NERICA 68',
    'NERICA 69',
    'NERICA 70',
    'NERICA 71',
    'NERICA 72',
    'NERICA 73',
    'NERICA 74',
    'NERICA 75',
    'NERICA 76',
    'NERICA 77',
    'NERICA 78',
    'NERICA 79',
    'NERICA 80',
    'NERICA 81',
    'NERICA 82',
    'NERICA 83',
    'NERICA 84',
    'NERICA 85',
    'NERICA 86',
    'NERICA 87',
    'NERICA 88',
    'NERICA 89',
    'NERICA 90',
    'NERICA 91',
    'NERICA 92',
    'NERICA 93',
    'NERICA 94',
    'NERICA 95',
    'NERICA 96',
    'NERICA 97',
    'NERICA 98',
    'NERICA 99',
    'NERICA 100',
    'Local_Variety'
  ],
  'Maize': [
    'TZEE-W Pop DT STR',
    'TZEE-Y Pop DT STR',
    'TZEE-W Pop DT STR C4',
    'TZEE-Y Pop DT STR C4',
    'TZEE-W Pop DT STR C5',
    'TZEE-Y Pop DT STR C5',
    'TZEE-W Pop DT STR C6',
    'TZEE-Y Pop DT STR C6',
    'TZEE-W Pop DT STR C7',
    'TZEE-Y Pop DT STR C7',
    'TZEE-W Pop DT STR C8',
    'TZEE-Y Pop DT STR C8',
    'TZEE-W Pop DT STR C9',
    'TZEE-Y Pop DT STR C9',
    'TZEE-W Pop DT STR C10',
    'TZEE-Y Pop DT STR C10',
    'Local_Variety'
  ],
  'Cassava': [
    'TME 419',
    'TMS 30572',
    'TMS 4(2)1425',
    'TMS 81/00110',
    'TMS 82/00058',
    'TMS 92/0057',
    'TMS 92/0067',
    'TMS 92/0326',
    'TMS 92/0427',
    'TMS 92/0055',
    'TMS 92/0067',
    'TMS 92/0326',
    'TMS 92/0427',
    'TMS 92/0055',
    'TMS 92/0067',
    'TMS 92/0326',
    'TMS 92/0427',
    'TMS 92/0055',
    'Local_Variety'
  ],
  'Yam': [
    'White Yam',
    'Yellow Yam',
    'Water Yam',
    'Chinese Yam',
    'Local_Variety'
  ],
  'Plantain': [
    'Horn Plantain',
    'French Plantain',
    'False Horn Plantain',
    'Local_Variety'
  ]
} as const;

// Currency and Regional Settings
export const CURRENCY = '₦';
export const DEFAULT_TIMEZONE = 'Africa/Lagos';
export const PHONE_PREFIX = '+234';
export const DEFAULT_STATE = 'Lagos';

// Bag Sizes (in kg) for different crops
export const BAG_SIZES = {
  'Rice': 50,
  'Maize': 50,
  'Cassava': 50,
  'Yam': 50,
  'Plantain': 50,
  'Sorghum': 50,
  'Millet': 50,
  'Groundnut': 50,
  'Soybean': 50,
  'Cowpea': 50,
  'default': 50
} as const;

// Price ranges per kg (in Naira) for different crops
export const PRICE_RANGES = {
  'Rice': { min: 400, max: 800 },
  'Maize': { min: 200, max: 400 },
  'Cassava': { min: 50, max: 150 },
  'Yam': { min: 300, max: 600 },
  'Plantain': { min: 100, max: 300 },
  'Cocoa': { min: 800, max: 1500 },
  'Palm Oil': { min: 600, max: 1200 },
  'Sorghum': { min: 150, max: 300 },
  'Millet': { min: 150, max: 300 },
  'Groundnut': { min: 400, max: 800 },
  'Soybean': { min: 300, max: 600 },
  'Cowpea': { min: 200, max: 400 }
} as const;

// Legacy exports for backward compatibility
export const NIGERIAN_STATES_LEGACY = NIGERIAN_STATES.map(state => state.name);
export const MAJOR_CROPS_LEGACY = MAJOR_CROPS;
export const QUALITY_GRADES_LEGACY = QUALITY_GRADES.map(grade => 
  grade === 'premium' ? 'Premium' : 
  grade === 'grade_a' ? 'Grade A' : 
  grade === 'grade_b' ? 'Grade B' : 'Grade C'
);
export const MEASUREMENT_UNITS_LEGACY = MEASUREMENT_UNITS.map(unit => 
  unit === 'bags' ? 'Bags' : 
  unit === 'tonnes' ? 'Tonnes' : 'Kilograms'
);
