import { BudgetPreferences, BudgetReport, CostBreakdownItem, QualityTier } from '../src/types';

export interface BudgetCalculationParams {
  totalBuiltUpArea: number; // in sq.ft across all floors
  floorsCount: number;
  bathroomsCount: number;
  bedroomsCount: number;
  tier: QualityTier;
  userBudget: BudgetPreferences;
  appliedSavings?: string[];
}

export function calculateConstructionBudget(params: BudgetCalculationParams): BudgetReport {
  const { totalBuiltUpArea, bathroomsCount, bedroomsCount, tier, userBudget, appliedSavings = [] } = params;

  // Base rates per sq.ft by quality tier in INR
  const baseRates = {
    Economy: {
      civil: 1350,
      electrical: 140,
      plumbing: 110,
      flooring: 120,
      doorsWindows: 150,
      sanitary: 90,
      painting: 75,
      kitchen: 85,
      furniture: 160,
      misc: 70,
    },
    Standard: {
      civil: 1750,
      electrical: 210,
      plumbing: 160,
      flooring: 220,
      doorsWindows: 260,
      sanitary: 160,
      painting: 130,
      kitchen: 170,
      furniture: 290,
      misc: 110,
    },
    Premium: {
      civil: 2400,
      electrical: 360,
      plumbing: 280,
      flooring: 480,
      doorsWindows: 490,
      sanitary: 340,
      painting: 260,
      kitchen: 390,
      furniture: 580,
      misc: 220,
    },
  };

  const rates = baseRates[tier] || baseRates.Standard;

  let civilCost = Math.round(totalBuiltUpArea * rates.civil);
  let electricalCost = Math.round(totalBuiltUpArea * rates.electrical);
  let plumbingCost = Math.round(totalBuiltUpArea * rates.plumbing + (bathroomsCount * 8000));
  let flooringCost = Math.round(totalBuiltUpArea * rates.flooring);
  let doorsWindowsCost = Math.round(totalBuiltUpArea * rates.doorsWindows);
  let sanitaryCost = Math.round(bathroomsCount * (tier === 'Premium' ? 55000 : tier === 'Standard' ? 22000 : 12000) + totalBuiltUpArea * rates.sanitary * 0.4);
  let paintingCost = Math.round(totalBuiltUpArea * rates.painting);
  let kitchenCost = tier === 'Premium' ? 520000 : tier === 'Standard' ? 195000 : 90000;
  let furnitureCost = Math.round(bedroomsCount * (tier === 'Premium' ? 180000 : tier === 'Standard' ? 95000 : 50000) + (totalBuiltUpArea * rates.furniture * 0.5));
  let miscCost = Math.round(totalBuiltUpArea * rates.misc);

  // Apply savings if user toggled them
  if (appliedSavings.includes('opt_windows')) {
    doorsWindowsCost -= Math.min(doorsWindowsCost * 0.22, 60000);
  }
  if (appliedSavings.includes('opt_flooring')) {
    flooringCost -= Math.min(flooringCost * 0.28, 75000);
  }
  if (appliedSavings.includes('opt_circulation')) {
    civilCost -= Math.min(civilCost * 0.05, 90000);
  }
  if (appliedSavings.includes('opt_sanitary')) {
    sanitaryCost -= Math.min(sanitaryCost * 0.25, 45000);
  }
  if (appliedSavings.includes('opt_furniture')) {
    furnitureCost -= Math.min(furnitureCost * 0.35, 120000);
  }

  const totalEstimatedCost = Math.round(
    civilCost +
    electricalCost +
    plumbingCost +
    flooringCost +
    doorsWindowsCost +
    sanitaryCost +
    paintingCost +
    kitchenCost +
    furnitureCost +
    miscCost
  );

  const categories: CostBreakdownItem[] = [
    {
      category: 'Civil & Structural Construction',
      cost: civilCost,
      percentage: Math.round((civilCost / totalEstimatedCost) * 100),
      tier,
      details: 'RCC Columns, Beams, Red Brick / AAC Blockwork, Cement & TMT Steel (Fe550D)',
      reducibleAmount: 90000,
      optimizationNote: 'Optimize column spans & structural circulation efficiency',
    },
    {
      category: 'Electrical Wiring & Smart Automation',
      cost: electricalCost,
      percentage: Math.round((electricalCost / totalEstimatedCost) * 100),
      tier,
      details: 'FR Grade Copper Wire, Modular Switchboards, MCB Distribution & Conduit Piping',
      reducibleAmount: 35000,
    },
    {
      category: 'Plumbing & Concealed Wet Shafts',
      cost: plumbingCost,
      percentage: Math.round((plumbingCost / totalEstimatedCost) * 100),
      tier,
      details: 'CPVC Lifeline hot/cold lines, SWR drainage lines, overhead water tanks & pumps',
      reducibleAmount: 25000,
    },
    {
      category: 'Flooring & Tiling Work',
      cost: flooringCost,
      percentage: Math.round((flooringCost / totalEstimatedCost) * 100),
      tier,
      details: 'Vitrified tiles / marble flooring, skirtings and anti-skid bathroom surfaces',
      reducibleAmount: 75000,
      optimizationNote: 'Switch secondary areas from marble/slabs to 4x2 ft vitrified tiles',
    },
    {
      category: 'Doors, Windows & Glazing',
      cost: doorsWindowsCost,
      percentage: Math.round((doorsWindowsCost / totalEstimatedCost) * 100),
      tier,
      details: 'Teak/flush main entry, UPVC/Aluminium double glazed soundproof windows & ironmongery',
      reducibleAmount: 60000,
      optimizationNote: 'Use standard UPVC frames instead of imported thermal-break aluminium',
    },
    {
      category: 'Sanitary Fixtures & CP Fittings',
      cost: sanitaryCost,
      percentage: Math.round((sanitaryCost / totalEstimatedCost) * 100),
      tier,
      details: 'Wall-hung water closets, diverters, rain showers, vanities & designer faucets',
      reducibleAmount: 45000,
      optimizationNote: 'Select Standard collection Jaquar/Cera fixtures for guest baths',
    },
    {
      category: 'Internal & External Painting',
      cost: paintingCost,
      percentage: Math.round((paintingCost / totalEstimatedCost) * 100),
      tier,
      details: '2 coats acrylic wall putty, 1 coat primer, 2 coats premium washable emulsion & exterior weather-shield',
      reducibleAmount: 30000,
    },
    {
      category: 'Modular Kitchen & Countertops',
      cost: kitchenCost,
      percentage: Math.round((kitchenCost / totalEstimatedCost) * 100),
      tier,
      details: 'BWP Marine ply carcass, soft-close Blum hinges, quartz/granite counter and built-in chimney space',
      reducibleAmount: 50000,
    },
    {
      category: 'Built-in Wardrobes & Furniture',
      cost: furnitureCost,
      percentage: Math.round((furnitureCost / totalEstimatedCost) * 100),
      tier,
      details: 'Master suite wardrobes, living room media unit, sofa sets, beds & dining suite',
      reducibleAmount: 120000,
      optimizationNote: 'Prioritize built-in core wardrobes and phase loose lounge accessories',
    },
    {
      category: 'Contingency & Approvals',
      cost: miscCost,
      percentage: Math.round((miscCost / totalEstimatedCost) * 100),
      tier,
      details: 'Municipal sanction liaison, soil testing, temporary site utilities & 3% buffer',
      reducibleAmount: 20000,
    },
  ];

  const targetBudget = userBudget.totalBudget || 3500000;
  const variance = targetBudget - totalEstimatedCost;
  const isOverBudget = variance < 0;
  const ratePerSqFt = totalBuiltUpArea > 0 ? Math.round(totalEstimatedCost / totalBuiltUpArea) : 2100;

  const savingsRecommendations = [
    {
      id: 'opt_windows',
      title: 'Standardize Window Profiles',
      savingsAmount: 60000,
      impact: 'Minimal' as const,
      description: 'Switch to premium UPVC 2-track sliding systems for side elevations while retaining casement for front elevation.',
      applied: appliedSavings.includes('opt_windows'),
    },
    {
      id: 'opt_flooring',
      title: 'Optimize Tile Specifications',
      savingsAmount: 75000,
      impact: 'Minimal' as const,
      description: 'Use large format 4×2 ft glazed vitrified tiles in bedrooms instead of imported marble slabs.',
      applied: appliedSavings.includes('opt_flooring'),
    },
    {
      id: 'opt_circulation',
      title: 'Reduce Unused Circulation Passages',
      savingsAmount: 90000,
      impact: 'Architectural' as const,
      description: 'Compact corridor circulation by 45 sq.ft into open-plan living/dining integration.',
      applied: appliedSavings.includes('opt_circulation'),
    },
    {
      id: 'opt_sanitary',
      title: 'Value-Engineer Sanitary Fixtures',
      savingsAmount: 45000,
      impact: 'Minimal' as const,
      description: 'Retain luxury diverters in master bath, use Standard series Jaquar/Cera in secondary bathrooms.',
      applied: appliedSavings.includes('opt_sanitary'),
    },
    {
      id: 'opt_furniture',
      title: 'Phase Loose Furniture Packages',
      savingsAmount: 120000,
      impact: 'Moderate' as const,
      description: 'Execute core built-in wardrobes during civil phase, defer luxury accent loungers & decorative wall paneling.',
      applied: appliedSavings.includes('opt_furniture'),
    },
  ];

  return {
    totalEstimatedCost,
    userBudget: targetBudget,
    variance,
    isOverBudget,
    ratePerSqFt,
    categories,
    savingsRecommendations,
  };
}
