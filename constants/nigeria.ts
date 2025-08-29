// Nigerian Agricultural Constants

export const APPROVED_CROPS = [
  'Rice',
  'Maize',
  'Cassava',
  'Yam',
  'Sorghum',
  'Millet',
  'Cowpea',
  'Groundnut',
  'Soybean',
  'Cocoa',
  'Coffee',
  'Tea',
  'Cotton',
  'Sugarcane',
  'Palm Oil',
  'Coconut',
  'Banana',
  'Plantain',
  'Mango',
  'Orange',
  'Pineapple',
  'Tomato',
  'Pepper',
  'Onion',
  'Garlic',
  'Ginger',
  'Turmeric',
  'Cocoyam',
  'Sweet Potato',
  'Irish Potato'
] as const;

export const CROP_VARIETIES = {
  Rice: ['Local', 'Improved', 'Ofada', 'Abakaliki', 'Nerica'],
  Maize: ['Local', 'Improved', 'Sweet Corn', 'Popcorn', 'Dent Corn'],
  Cassava: ['Local', 'Improved', 'Sweet', 'Bitter', 'TMS'],
  Yam: ['White Yam', 'Yellow Yam', 'Water Yam', 'Chinese Yam'],
  Sorghum: ['Local', 'Improved', 'Sweet Sorghum', 'Grain Sorghum'],
  Millet: ['Pearl Millet', 'Finger Millet', 'Proso Millet'],
  Cowpea: ['Local', 'Improved', 'Black-eyed', 'Brown'],
  Groundnut: ['Local', 'Improved', 'Spanish', 'Virginia', 'Runner'],
  Soybean: ['Local', 'Improved', 'Early Maturity', 'Late Maturity'],
  Cocoa: ['Forastero', 'Criollo', 'Trinitario'],
  Coffee: ['Arabica', 'Robusta'],
  Tea: ['Black Tea', 'Green Tea', 'Herbal Tea'],
  Cotton: ['Local', 'Improved', 'Long Staple', 'Short Staple'],
  Sugarcane: ['Local', 'Improved', 'Noble', 'Commercial'],
  'Palm Oil': ['Dura', 'Tenera', 'Pisifera'],
  Coconut: ['Tall', 'Dwarf', 'Hybrid'],
  Banana: ['Cavendish', 'Plantain', 'Lady Finger', 'Red Banana'],
  Plantain: ['Horn', 'French', 'False Horn'],
  Mango: ['Local', 'Improved', 'Alphonso', 'Keitt', 'Kent'],
  Orange: ['Local', 'Improved', 'Valencia', 'Navel', 'Blood Orange'],
  Pineapple: ['Local', 'Improved', 'Smooth Cayenne', 'Queen'],
  Tomato: ['Local', 'Improved', 'Roma', 'Cherry', 'Beefsteak'],
  Pepper: ['Bell Pepper', 'Chili Pepper', 'Cayenne', 'Jalapeño'],
  Onion: ['Local', 'Improved', 'Red Onion', 'White Onion', 'Yellow Onion'],
  Garlic: ['Local', 'Improved', 'Softneck', 'Hardneck'],
  Ginger: ['Local', 'Improved', 'Baby Ginger', 'Mature Ginger'],
  Turmeric: ['Local', 'Improved', 'Wild Turmeric'],
  Cocoyam: ['Local', 'Improved', 'Taro', 'Tannia'],
  'Sweet Potato': ['Local', 'Improved', 'Orange Flesh', 'White Flesh', 'Purple Flesh'],
  'Irish Potato': ['Local', 'Improved', 'Russet', 'Red', 'White', 'Fingerling']
} as const;

export const UNITS = [
  'kg',
  'tonnes',
  'bags',
  'pieces',
  'bundles',
  'liters',
  'gallons',
  'baskets',
  'crates',
  'sacks'
] as const;

export const QUALITY_GRADES = [
  'Premium',
  'Grade A',
  'Grade B',
  'Grade C',
  'Standard',
  'Commercial'
] as const;

export const STORAGE_METHODS = [
  'Traditional Storage',
  'Modern Warehouse',
  'Cold Storage',
  'Silo Storage',
  'Bag Storage',
  'Bulk Storage',
  'Controlled Atmosphere',
  'Refrigerated Storage'
] as const;

export const NIGERIAN_STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'Federal Capital Territory',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara'
] as const;

export const CERTIFICATIONS = [
  'Organic Certification',
  'Good Agricultural Practice (GAP)',
  'ISO 22000',
  'HACCP',
  'Fair Trade',
  'Rainforest Alliance',
  'UTZ Certified',
  'Global GAP',
  'Nigerian Organic Agriculture Network (NOAN)',
  'National Agency for Food and Drug Administration and Control (NAFDAC)'
] as const;

export const PRICE_RANGES = {
  Rice: { min: 30000, max: 80000 },
  Maize: { min: 25000, max: 60000 },
  Cassava: { min: 15000, max: 40000 },
  Yam: { min: 20000, max: 50000 },
  Sorghum: { min: 20000, max: 45000 },
  Millet: { min: 25000, max: 55000 },
  Cowpea: { min: 40000, max: 120000 },
  Groundnut: { min: 35000, max: 90000 },
  Soybean: { min: 45000, max: 100000 },
  Cocoa: { min: 800000, max: 2000000 },
  Coffee: { min: 600000, max: 1500000 },
  Tea: { min: 400000, max: 1000000 },
  Cotton: { min: 300000, max: 800000 },
  Sugarcane: { min: 20000, max: 50000 },
  'Palm Oil': { min: 80000, max: 200000 },
  Coconut: { min: 50000, max: 150000 },
  Banana: { min: 30000, max: 80000 },
  Plantain: { min: 25000, max: 70000 },
  Mango: { min: 40000, max: 100000 },
  Orange: { min: 35000, max: 90000 },
  Pineapple: { min: 50000, max: 120000 },
  Tomato: { min: 60000, max: 150000 },
  Pepper: { min: 80000, max: 200000 },
  Onion: { min: 40000, max: 100000 },
  Garlic: { min: 100000, max: 250000 },
  Ginger: { min: 80000, max: 200000 },
  Turmeric: { min: 60000, max: 150000 },
  Cocoyam: { min: 30000, max: 80000 },
  'Sweet Potato': { min: 25000, max: 60000 },
  'Irish Potato': { min: 40000, max: 100000 }
} as const;

export type CropType = typeof APPROVED_CROPS[number];
export type Unit = typeof UNITS[number];
export type QualityGrade = typeof QUALITY_GRADES[number];
export type StorageMethod = typeof STORAGE_METHODS[number];
export type NigerianState = typeof NIGERIAN_STATES[number];
export type Certification = typeof CERTIFICATIONS[number];
