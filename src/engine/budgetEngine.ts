import { BudgetPreferences, BudgetReport, CostBreakdownItem, QualityTier } from '../types';

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
      category: 'Civil & Structural Structure',
      description: 'RCC Footing, Plinth beam, Red Clay Brick masonry & Roof Slab',
      amount: civilCost,
      percentage: Math.round((civilCost / totalEstimatedCost) * 100),
      color: '#3b82f6',
    },
    {
      category: 'Flooring, Tiling & Wall Dados',
      description: tier === 'Premium' ? 'Italian Marble & Imported Vitrified 800x1600' : 'Double-Charged Glazed Vitrified 600x1200',
      amount: flooringCost,
      percentage: Math.round((flooringCost / totalEstimatedCost) * 100),
      color: '#10b981',
    },
    {
      category: 'Doors, Windows & Balconies',
      description: 'Teak Main Door, UPVC Soundproof 3-Track Windows & Toughened Glass Railings',
      amount: doorsWindowsCost,
      percentage: Math.round((doorsWindowsCost / totalEstimatedCost) * 100),
      color: '#f59e0b',
    },
    {
      category: 'Electrical & Automation Wiring',
      description: 'Finolex FRLS Copper Cables, Legrand Arteor Modular Switches & Distribution Board',
      amount: electricalCost,
      percentage: Math.round((electricalCost / totalEstimatedCost) * 100),
      color: '#8b5cf6',
    },
    {
      category: 'Plumbing, Drainage & CPVC Pipes',
      description: 'Ashirvad CPVC Hot/Cold Pipes, Supreme SWR Drainage & Overhead Tank',
      amount: plumbingCost,
      percentage: Math.round((plumbingCost / totalEstimatedCost) * 100),
      color: '#06b6d4',
    },
    {
      category: 'Sanitaryware & Bath Fixtures',
      description: tier === 'Premium' ? 'Kohler / Grohe Concealed Diverters & Wall-Hung Toilets' : 'Jaquar / Hindware Single-Piece Suites',
      amount: sanitaryCost,
      percentage: Math.round((sanitaryCost / totalEstimatedCost) * 100),
      color: '#ec4899',
    },
    {
      category: 'Modular Kitchen & Quartz Counter',
      description: 'Marine-grade HDHMR Shutter Units, Blum Soft-Close Tandem Drawers & Hob Chimney',
      amount: kitchenCost,
      percentage: Math.round((kitchenCost / totalEstimatedCost) * 100),
      color: '#f97316',
    },
    {
      category: 'Wall Painting & Waterproofing',
      description: 'Asian Paints Royale Luxury Emulsion + 2-Coat Dr. Fixit Terrace Waterproofing',
      amount: paintingCost,
      percentage: Math.round((paintingCost / totalEstimatedCost) * 100),
      color: '#14b8a6',
    },
    {
      category: 'Built-in Woodwork & Wardrobes',
      description: 'Floor-to-ceiling Wardrobes with Loft Storage and TV Console Paneling',
      amount: furnitureCost,
      percentage: Math.round((furnitureCost / totalEstimatedCost) * 100),
      color: '#6366f1',
    },
    {
      category: 'Contingency & Approvals',
      description: 'Municipal Plan Sanction fees, Site Safety fencing and Material Testing',
      amount: miscCost,
      percentage: Math.round((miscCost / totalEstimatedCost) * 100),
      color: '#64748b',
    },
  ];

  const targetBudget = userBudget.totalBudget || 3500000;
  const costPerSqFt = Math.round(totalEstimatedCost / totalBuiltUpArea);
  const isOverBudget = totalEstimatedCost > targetBudget;
  const variance = targetBudget - totalEstimatedCost;

  const costSavingTips = [
    {
      id: 'opt_windows',
      title: 'Adopt High-Grade UPVC instead of Teak Windows',
      potentialSaving: 60000,
      description: 'Saves approx ₹60,000 with superior acoustic and thermal weatherproofing.',
      applied: appliedSavings.includes('opt_windows'),
    },
    {
      id: 'opt_flooring',
      title: '600x1200 Double Charged Vitrified Tiles in Bedrooms',
      potentialSaving: 75000,
      description: 'Reduces material and laying labor by 35% compared to natural stone.',
      applied: appliedSavings.includes('opt_flooring'),
    },
    {
      id: 'opt_circulation',
      title: 'Streamline Corridor Circulation Geometry',
      potentialSaving: 90000,
      description: 'Eliminates 45 sq.ft of dead passageway space, saving masonry & flooring.',
      applied: appliedSavings.includes('opt_circulation'),
    },
    {
      id: 'opt_sanitary',
      title: 'Standardize Core Bathroom Plumbing Risers',
      potentialSaving: 45000,
      description: 'Stack bathrooms vertically between floors to shorten pipe run lengths.',
      applied: appliedSavings.includes('opt_sanitary'),
    },
  ];

  return {
    totalEstimatedCost,
    costPerSqFt,
    categories,
    costSavingTips,
    tier,
    isOverBudget,
    variance,
  };
}
