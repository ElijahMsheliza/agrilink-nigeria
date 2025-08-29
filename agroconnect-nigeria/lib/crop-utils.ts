import { MAJOR_CROPS, CROP_VARIETIES, QUALITY_GRADES, MEASUREMENT_UNITS } from '../constants/nigeria';

// Get approved crop types
export function getApprovedCrops(): string[] {
  return MAJOR_CROPS;
}

// Get crop varieties for a specific crop type
export function getCropVarieties(cropType: string): string[] {
  return CROP_VARIETIES[cropType as keyof typeof CROP_VARIETIES] || [];
}

// Get seasonal information for crops
export function getSeasonalInfo(cropType: string): {
  plantingSeasons: string[];
  harvestSeasons: string[];
  typicalHarvestTime: string;
} {
  const seasonalData: Record<string, {
    plantingSeasons: string[];
    harvestSeasons: string[];
    typicalHarvestTime: string;
  }> = {
    'Rice': {
      plantingSeasons: ['March-April', 'July-August'],
      harvestSeasons: ['July-August', 'November-December'],
      typicalHarvestTime: '4-6 months after planting'
    },
    'Maize': {
      plantingSeasons: ['March-April', 'August-September'],
      harvestSeasons: ['July-August', 'December-January'],
      typicalHarvestTime: '3-4 months after planting'
    },
    'Cassava': {
      plantingSeasons: ['March-April', 'September-October'],
      harvestSeasons: ['Year-round'],
      typicalHarvestTime: '8-18 months after planting'
    },
    'Yam': {
      plantingSeasons: ['March-April'],
      harvestSeasons: ['October-December'],
      typicalHarvestTime: '7-9 months after planting'
    },
    'Plantain': {
      plantingSeasons: ['March-April', 'September-October'],
      harvestSeasons: ['Year-round'],
      typicalHarvestTime: '9-12 months after planting'
    },
    'Cocoa': {
      plantingSeasons: ['April-May'],
      harvestSeasons: ['October-March'],
      typicalHarvestTime: '3-5 years after planting'
    },
    'Palm Oil': {
      plantingSeasons: ['March-April'],
      harvestSeasons: ['Year-round'],
      typicalHarvestTime: '3-4 years after planting'
    }
  };

  return seasonalData[cropType] || {
    plantingSeasons: ['Varies'],
    harvestSeasons: ['Varies'],
    typicalHarvestTime: 'Varies'
  };
}

// Validate crop type
export function validateCropType(cropType: string): { isValid: boolean; error?: string } {
  if (!cropType) {
    return { isValid: false, error: 'Crop type is required' };
  }

  if (!MAJOR_CROPS.includes(cropType)) {
    return { 
      isValid: false, 
      error: `Crop type must be one of: ${MAJOR_CROPS.join(', ')}` 
    };
  }

  return { isValid: true };
}

// Get crop icon
export function getCropIcon(cropType: string): string {
  const cropIcons: Record<string, string> = {
    'Rice': '🌾',
    'Maize': '🌽',
    'Cassava': '🥔',
    'Yam': '🍠',
    'Plantain': '🍌',
    'Cocoa': '🍫',
    'Palm Oil': '🫒'
  };

  return cropIcons[cropType] || '🌱';
}

// Get crop color for UI
export function getCropColor(cropType: string): string {
  const cropColors: Record<string, string> = {
    'Rice': 'bg-green-100 text-green-800',
    'Maize': 'bg-yellow-100 text-yellow-800',
    'Cassava': 'bg-orange-100 text-orange-800',
    'Yam': 'bg-purple-100 text-purple-800',
    'Plantain': 'bg-yellow-100 text-yellow-800',
    'Cocoa': 'bg-brown-100 text-brown-800',
    'Palm Oil': 'bg-red-100 text-red-800'
  };

  return cropColors[cropType] || 'bg-gray-100 text-gray-800';
}

// Get storage method display text
export function getStorageMethodText(method: string): string {
  const storageMethodTexts: Record<string, string> = {
    'Warehouse': 'Warehouse Storage',
    'Silo': 'Silo Storage',
    'Cold_Storage': 'Cold Storage',
    'Refrigerated': 'Refrigerated Storage',
    'Dry_Storage': 'Dry Storage',
    'Controlled_Atmosphere': 'Controlled Atmosphere',
    'Modified_Atmosphere': 'Modified Atmosphere',
    'Vacuum_Packed': 'Vacuum Packed',
    'Bulk_Storage': 'Bulk Storage',
    'Container_Storage': 'Container Storage'
  };

  return storageMethodTexts[method] || method;
}

// Get certification display text
export function getCertificationText(certification: string): string {
  const certificationTexts: Record<string, string> = {
    'Organic': 'Organic Certification',
    'NAFDAC': 'NAFDAC Approved',
    'SON': 'SON Certified',
    'ISO_9001': 'ISO 9001 Certified',
    'HACCP': 'HACCP Certified',
    'GMP': 'Good Manufacturing Practice',
    'Fair_Trade': 'Fair Trade Certified',
    'Rainforest_Alliance': 'Rainforest Alliance Certified',
    'UTZ_Certified': 'UTZ Certified',
    'Global_GAP': 'Global GAP Certified'
  };

  return certificationTexts[certification] || certification;
}
  const cropColors: Record<string, string> = {
    'Rice': 'text-green-600 bg-green-50',
    'Maize': 'text-yellow-600 bg-yellow-50',
    'Cassava': 'text-orange-600 bg-orange-50',
    'Yam': 'text-purple-600 bg-purple-50',
    'Plantain': 'text-yellow-500 bg-yellow-50',
    'Cocoa': 'text-brown-600 bg-brown-50',
    'Palm Oil': 'text-red-600 bg-red-50'
  };

  return cropColors[cropType] || 'text-gray-600 bg-gray-50';
}

// Get quality grade display text
export function getQualityGradeText(grade: string): string {
  const gradeTexts: Record<string, string> = {
    'Premium': 'Premium Grade',
    'Grade A': 'Grade A',
    'Grade B': 'Grade B',
    'Grade C': 'Grade C'
  };

  return gradeTexts[grade] || grade;
}

// Get unit display text
export function getUnitDisplayText(unit: string): string {
  const unitTexts: Record<string, string> = {
    'Bags': 'Bags',
    'Tonnes': 'Tonnes',
    'Kilograms': 'Kilograms',
    'Pieces': 'Pieces',
    'Bunches': 'Bunches'
  };

  return unitTexts[unit] || unit;
}



// Get crop description template
export function getCropDescriptionTemplate(cropType: string): string {
  const templates: Record<string, string> = {
    'Rice': 'High-quality {variety} rice harvested from our farm. {quality_grade} grade with excellent taste and texture. Perfect for local consumption and export.',
    'Maize': 'Fresh {variety} maize with high nutritional value. {quality_grade} grade suitable for human consumption and animal feed.',
    'Cassava': 'Premium {variety} cassava roots. {quality_grade} grade with high starch content. Ideal for garri production and industrial use.',
    'Yam': 'Fresh {variety} yam tubers. {quality_grade} grade with excellent taste and texture. Perfect for local markets and export.',
    'Plantain': 'Ripe {variety} plantains. {quality_grade} grade with natural sweetness. Suitable for cooking and processing.',
    'Cocoa': 'Premium {variety} cocoa beans. {quality_grade} grade with excellent flavor profile. Perfect for chocolate production.',
    'Palm Oil': 'Pure {variety} palm oil. {quality_grade} grade with high nutritional value. Suitable for cooking and industrial use.'
  };

  return templates[cropType] || 'High-quality {variety} {crop_type}. {quality_grade} grade suitable for various uses.';
}

// Generate crop description
export function generateCropDescription(
  cropType: string, 
  variety: string, 
  qualityGrade: string,
  customDescription?: string
): string {
  if (customDescription) {
    return customDescription;
  }

  const template = getCropDescriptionTemplate(cropType);
  return template
    .replace('{variety}', variety)
    .replace('{crop_type}', cropType)
    .replace('{quality_grade}', qualityGrade);
}

// Get crop-specific recommendations
export function getCropRecommendations(cropType: string): {
  storageTips: string[];
  qualityTips: string[];
  pricingTips: string[];
} {
  const recommendations: Record<string, {
    storageTips: string[];
    qualityTips: string[];
    pricingTips: string[];
  }> = {
    'Rice': {
      storageTips: [
        'Store in a cool, dry place',
        'Keep away from moisture',
        'Use airtight containers',
        'Check for pests regularly'
      ],
      qualityTips: [
        'Ensure grains are clean and whole',
        'Check for proper moisture content',
        'Verify color consistency',
        'Test cooking quality'
      ],
      pricingTips: [
        'Research current market prices',
        'Consider quality grade pricing',
        'Factor in transportation costs',
        'Check seasonal price variations'
      ]
    },
    'Maize': {
      storageTips: [
        'Store in well-ventilated area',
        'Control humidity levels',
        'Protect from rodents',
        'Regular inspection needed'
      ],
      qualityTips: [
        'Check kernel integrity',
        'Verify moisture content',
        'Ensure no mold presence',
        'Test germination rate'
      ],
      pricingTips: [
        'Compare with local market rates',
        'Consider bulk pricing',
        'Factor in drying costs',
        'Check export market prices'
      ]
    }
  };

  return recommendations[cropType] || {
    storageTips: ['Store in appropriate conditions', 'Regular monitoring required'],
    qualityTips: ['Maintain quality standards', 'Regular quality checks'],
    pricingTips: ['Research market prices', 'Consider all costs']
  };
}

// Get crop market information
export function getCropMarketInfo(cropType: string): {
  majorMarkets: string[];
  exportPotential: string;
  localDemand: string;
} {
  const marketInfo: Record<string, {
    majorMarkets: string[];
    exportPotential: string;
    localDemand: string;
  }> = {
    'Rice': {
      majorMarkets: ['Lagos', 'Kano', 'Kaduna', 'Rivers'],
      exportPotential: 'High - Major export crop',
      localDemand: 'Very High - Staple food'
    },
    'Maize': {
      majorMarkets: ['Kano', 'Kaduna', 'Lagos', 'Oyo'],
      exportPotential: 'Medium - Regional exports',
      localDemand: 'High - Food and feed'
    },
    'Cassava': {
      majorMarkets: ['Lagos', 'Ondo', 'Ogun', 'Delta'],
      exportPotential: 'Medium - Processed products',
      localDemand: 'High - Staple food'
    }
  };

  return marketInfo[cropType] || {
    majorMarkets: ['Various markets'],
    exportPotential: 'Varies by crop',
    localDemand: 'Good local demand'
  };
}
