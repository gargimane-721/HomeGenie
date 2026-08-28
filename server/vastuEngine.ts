import { CadRoom, Direction, PlotDetails, VastuItemAnalysis, VastuReport } from '../src/types';

export function calculateDirectionZone(
  x: number,
  y: number,
  plotWidth: number,
  plotLength: number,
  northAngle: number = 0 // degrees clockwise from top
): Direction {
  // Normalize coordinate to [-1, 1] relative to center
  const cx = plotWidth / 2;
  const cy = plotLength / 2;
  const dx = x - cx;
  const dy = -(y - cy); // invert y so up is positive North

  // Calculate angle in degrees (0 = North, 90 = East, 180 = South, 270 = West)
  let angle = Math.atan2(dx, dy) * (180 / Math.PI);
  angle = (angle - northAngle + 360) % 360;

  if (angle >= 337.5 || angle < 22.5) return 'North';
  if (angle >= 22.5 && angle < 67.5) return 'North-East';
  if (angle >= 67.5 && angle < 112.5) return 'East';
  if (angle >= 112.5 && angle < 157.5) return 'South-East';
  if (angle >= 157.5 && angle < 202.5) return 'South';
  if (angle >= 202.5 && angle < 247.5) return 'South-West';
  if (angle >= 247.5 && angle < 292.5) return 'West';
  return 'North-West';
}

interface VastuRule {
  idealZones: Direction[];
  goodZones: Direction[];
  concernZones: Direction[];
  idealDescription: string;
  concernDescription: string;
  remedy: string;
}

const VASTU_RULES: Record<string, VastuRule> = {
  pooja: {
    idealZones: ['North-East', 'East', 'North'],
    goodZones: ['West'],
    concernZones: ['South-West', 'South', 'South-East'],
    idealDescription: 'Pooja room in Ishanya (NE) zone channels highest spiritual solar energy.',
    concernDescription: 'Pooja room in SW or SE can disrupt spiritual harmony and family calm.',
    remedy: 'Place an energizing marble altar on the East wall and maintain warm brass lighting.',
  },
  kitchen: {
    idealZones: ['South-East', 'North-West'],
    goodZones: ['East', 'South'],
    concernZones: ['North-East', 'South-West', 'North'],
    idealDescription: 'Kitchen in Agneya (SE) aligns cooking fire with cosmic Agni element.',
    concernDescription: 'Kitchen in North-East clashes fire with water element, causing unnecessary friction.',
    remedy: 'If SE is unavailable, use NW; ensure cooking hob faces East with a yellow/green marble slab under the stove.',
  },
  master_bedroom: {
    idealZones: ['South-West', 'South'],
    goodZones: ['West'],
    concernZones: ['North-East', 'South-East', 'North-West'],
    idealDescription: 'Master suite in Nairutya (SW) anchors financial stability, grounding and decision-making.',
    concernDescription: 'Master bedroom in NE can create restlessness and lack of rest.',
    remedy: 'Ensure headboard rests against South or West wall and paint room in warm earthen tones.',
  },
  bedroom: {
    idealZones: ['North-West', 'West', 'East', 'South'],
    goodZones: ['North'],
    concernZones: ['North-East', 'South-East'],
    idealDescription: 'Secondary/Children bedrooms in West or NW foster mental agility, study focus and vitality.',
    concernDescription: 'Bedrooms directly over high fire or damp zones require acoustic balancing.',
    remedy: 'Position study table facing East/North with ample daylight.',
  },
  living: {
    idealZones: ['North', 'East', 'North-East', 'North-West'],
    goodZones: ['West'],
    concernZones: ['South-West'],
    idealDescription: 'Living room in North or East invites auspicious social vibrancy and natural morning light.',
    concernDescription: 'Living space in SW should not be hollow or heavily sunk.',
    remedy: 'Keep heavy sofa furniture along South/West walls and open circulation along North/East.',
  },
  dining: {
    idealZones: ['West', 'East', 'North'],
    goodZones: ['South-East', 'North-West'],
    concernZones: ['South-West'],
    idealDescription: 'Dining room in West stimulates healthy digestion, family bonding and prosperity.',
    concernDescription: 'Avoid dining directly facing bathroom doors.',
    remedy: 'Use a square/rectangular wooden dining table and warm 3000K overhead pendant.',
  },
  bathroom: {
    idealZones: ['North-West', 'West', 'South'],
    goodZones: ['East'],
    concernZones: ['North-East', 'South-West'],
    idealDescription: 'Bathrooms in Vayavya (NW) or West ensure clean drainage and positive elimination.',
    concernDescription: 'Bathroom in North-East disrupts purity vortex.',
    remedy: 'Keep exhaust fan running toward West/North and place sea-salt bowl to absorb dampness.',
  },
  staircase: {
    idealZones: ['South', 'South-West', 'West'],
    goodZones: ['North-West'],
    concernZones: ['North-East', 'East'],
    idealDescription: 'Staircase on South or SW adds structural weight where heavy stability is desired.',
    concernDescription: 'Staircase in North-East obstructs light and spiritual flow.',
    remedy: 'Ensure stairs rise clockwise (turning right as you climb).',
  },
  parking: {
    idealZones: ['North-West', 'South-East', 'North'],
    goodZones: ['East', 'West'],
    concernZones: ['North-East', 'South-West'],
    idealDescription: 'Parking in North-West or South-East maintains unobstructed frontage.',
    concernDescription: 'Parking in direct North-East can block morning solar rays.',
    remedy: 'Keep car port canopy lightweight with translucent tensile or polycarbonate roofing.',
  },
  garden: {
    idealZones: ['North-East', 'North', 'East'],
    goodZones: ['North-West'],
    concernZones: ['South-West'],
    idealDescription: 'Garden in North-East maximizes open sky, morning sun absorption and fresh air intake.',
    concernDescription: 'Heavy dense trees in North-East can cast excessive shade.',
    remedy: 'Plant holy basil (Tulsi) and fragrant flowering shrubs in NE; plant heavy fruit trees in SW.',
  },
};

export function analyzeProjectVastu(
  rooms: CadRoom[],
  plot: PlotDetails
): VastuReport {
  const items: VastuItemAnalysis[] = [];
  const suggestions: string[] = [];
  let totalScore = 0;
  let evaluatedCount = 0;

  // Zone room registry
  const zoneRoomsMap: Record<Direction, string[]> = {
    'North': [],
    'North-East': [],
    'East': [],
    'South-East': [],
    'South': [],
    'South-West': [],
    'West': [],
    'North-West': [],
    'Center': [],
  };

  rooms.forEach((room) => {
    // Determine room center coordinate
    const roomCenterX = room.x + room.width / 2;
    const roomCenterY = room.y + room.height / 2;
    const actualZone = calculateDirectionZone(
      roomCenterX,
      roomCenterY,
      plot.width,
      plot.length,
      plot.northDirection
    );

    // Update room's calculated zone
    room.directionZone = actualZone;
    zoneRoomsMap[actualZone].push(room.name);

    const ruleKey = room.type;
    const rule = VASTU_RULES[ruleKey];

    if (rule) {
      evaluatedCount++;
      if (rule.idealZones.includes(actualZone)) {
        room.vastuCompliance = 'Ideal';
        totalScore += 100;
        items.push({
          element: room.name,
          zone: rule.idealZones[0],
          actualZone: actualZone,
          status: 'Good',
          comment: `✓ ${room.name} located in ${actualZone} (${rule.idealDescription})`,
        });
      } else if (rule.goodZones.includes(actualZone)) {
        room.vastuCompliance = 'Good';
        totalScore += 80;
        items.push({
          element: room.name,
          zone: rule.idealZones[0],
          actualZone: actualZone,
          status: 'Moderate',
          comment: `✓ ${room.name} in ${actualZone} is compatible and functionally balanced.`,
        });
      } else {
        room.vastuCompliance = 'Challenging';
        totalScore += 50;
        items.push({
          element: room.name,
          zone: rule.idealZones[0],
          actualZone: actualZone,
          status: 'Concern',
          comment: `⚠ ${room.name} in ${actualZone}: ${rule.concernDescription}`,
          remedy: rule.remedy,
        });
        suggestions.push(`Consider relocating ${room.name} towards ${rule.idealZones.join(' or ')}. Remedy: ${rule.remedy}`);
      }
    }
  });

  const finalScore = evaluatedCount > 0 ? Math.round(totalScore / evaluatedCount) : 85;

  let rating: VastuReport['rating'] = 'Good';
  if (finalScore >= 90) rating = 'Superior';
  else if (finalScore >= 75) rating = 'Good';
  else if (finalScore >= 60) rating = 'Moderate';
  else rating = 'Needs Optimization';

  const zoneDetails = (
    ['North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West', 'North', 'Center'] as Direction[]
  ).map((z) => {
    let planet = 'Mercury (Budh)';
    let element = 'Space / Ether';
    let suitable = ['Living', 'Entrance', 'Treasury'];
    let rec = 'Keep clear of clutter and maintain good airflow.';

    if (z === 'North-East') {
      planet = 'Jupiter (Guru) & Shiva';
      element = 'Water';
      suitable = ['Pooja Sanctum', 'Meditation Nook', 'Open Water Feature'];
      rec = 'Ishanya corner: Keep light, pure, and well-illuminated with morning solar rays.';
    } else if (z === 'East') {
      planet = 'Sun (Surya)';
      element = 'Solar / Light';
      suitable = ['Living Hall', 'Study Room', 'Main Verandah'];
      rec = 'Eastern sector: Foster morning vitality with wide casement windows.';
    } else if (z === 'South-East') {
      planet = 'Venus (Shukra) & Agni';
      element = 'Fire';
      suitable = ['Modular Kitchen', 'Electrical Distribution', 'Utility'];
      rec = 'Agneya corner: Align cooking stove to face East for radiant energy.';
    } else if (z === 'South') {
      planet = 'Mars (Mangal) & Yama';
      element = 'Earth';
      suitable = ['Bedrooms', 'Staircase', 'Store Room'];
      rec = 'Southern wall: Keep solid and structurally load-bearing.';
    } else if (z === 'South-West') {
      planet = 'Rahu & Earth';
      element = 'Earth';
      suitable = ['Master Suite', 'Heavy Wardrobes', 'Overhead Tank'];
      rec = 'Nairutya corner: Place master bed headboard against South or West.';
    } else if (z === 'West') {
      planet = 'Saturn (Shani) & Varuna';
      element = 'Air';
      suitable = ['Dining Hall', 'Children Study', 'Overhead Tank'];
      rec = 'Western zone: Excellent for dining and evening relaxation.';
    } else if (z === 'North-West') {
      planet = 'Moon (Chandra) & Vayu';
      element = 'Air';
      suitable = ['Guest Bedroom', 'Powder Bathroom', 'Car Parking'];
      rec = 'Vayavya corner: Balances airflow and movement of guests.';
    } else if (z === 'Center') {
      planet = 'Brahma';
      element = 'Space / Ether';
      suitable = ['Central Hall', 'Courtyard Void', 'Open Circulation'];
      rec = 'Brahmasthan: Keep open, unencumbered by heavy RCC pillars.';
    }

    const present = zoneRoomsMap[z] || [];
    return {
      zone: z,
      element,
      rulingPlanet: planet,
      idealRooms: suitable,
      currentRooms: present,
      isCompliant: present.length === 0 || present.some((r) => suitable.some((s) => r.toLowerCase().includes(s.toLowerCase().split(' ')[0]))),
      recommendations: rec,
    };
  });

  const zoneAnalysis = zoneDetails.map((z) => ({
    zone: z.zone,
    rulingPlanet: z.rulingPlanet || 'Mercury',
    suitableRooms: z.idealRooms,
    presentRooms: z.currentRooms,
    score: z.isCompliant ? 95 : 75,
  }));

  if (suggestions.length === 0) {
    suggestions.push('House orientation and room placements conform harmoniously with standard Vastu principles.');
    suggestions.push('Ensure main entrance threshold remains well-lit and clutter-free.');
  }

  return {
    score: finalScore,
    rating,
    zoneAnalysis,
    zoneDetails,
    items,
    suggestions,
  };
}
