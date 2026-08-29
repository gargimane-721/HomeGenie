import {
  CadRoom,
  Direction,
  PlotDetails,
  VastuItemAnalysis,
  VastuReport,
  VastuZoneAnalysis,
} from '../types';

export function calculateDirectionZone(
  x: number,
  y: number,
  plotWidth: number,
  plotLength: number,
  northAngle: number = 0 // degrees clockwise from top (0 = North at top)
): Direction {
  const cx = plotWidth / 2;
  const cy = plotLength / 2;
  const dx = x - cx;
  const dy = -(y - cy); // Invert y so positive is towards top (North)

  // Check if point is in central 25% Brahmasthan zone
  const distFromCenter = Math.sqrt(dx * dx + dy * dy);
  const maxRadius = Math.sqrt(cx * cx + cy * cy);
  if (distFromCenter < maxRadius * 0.22) {
    return 'Center';
  }

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
    goodZones: ['West', 'Center'],
    concernZones: ['South-West', 'South', 'South-East'],
    idealDescription: 'Pooja sanctum in Ishanya (NE) channels pure cosmic vitality and spiritual solar energy.',
    concernDescription: 'Pooja room in SW or SE can disrupt spiritual harmony and create domestic stress.',
    remedy: 'Place an energizing marble altar along East wall, maintain warm brass lighting, and keep zone immaculately pure.',
  },
  kitchen: {
    idealZones: ['South-East', 'North-West'],
    goodZones: ['East', 'South'],
    concernZones: ['North-East', 'South-West', 'North', 'Center'],
    idealDescription: 'Kitchen in Agneya (SE) aligns cooking fire with cosmic Agni element for health and vitality.',
    concernDescription: 'Kitchen in North-East clashes fire with water element, creating health and financial friction.',
    remedy: 'Ensure cooking burner faces East; place a polished yellow/green marble slab under the stove as an elemental buffer.',
  },
  master_bedroom: {
    idealZones: ['South-West', 'South'],
    goodZones: ['West'],
    concernZones: ['North-East', 'South-East', 'North-West', 'Center'],
    idealDescription: 'Master suite in Nairutya (SW) anchors financial stability, sound leadership, and grounding.',
    concernDescription: 'Master bedroom in NE can create mental restlessness, insomnia, and diluted focus.',
    remedy: 'Ensure bed headboard rests firmly against South or West wall, and decorate in warm grounding earthen/beige hues.',
  },
  bedroom: {
    idealZones: ['North-West', 'West', 'East', 'South'],
    goodZones: ['North'],
    concernZones: ['North-East', 'South-East', 'Center'],
    idealDescription: 'Secondary/Children bedrooms in West or NW foster agility, academic focus, and vibrant rest.',
    concernDescription: 'Bedrooms placed directly in high heat or damp areas require acoustic and thermal insulation.',
    remedy: 'Position study desk facing East or North; position bed with head towards South or East for revitalizing sleep.',
  },
  living: {
    idealZones: ['North', 'East', 'North-East', 'North-West'],
    goodZones: ['West', 'Center'],
    concernZones: ['South-West'],
    idealDescription: 'Living hall in North or East invites auspicious social vibrancy, prosperity, and natural morning light.',
    concernDescription: 'Living space in South-West should not feature sunken floors or heavy hollow voids.',
    remedy: 'Place heavy sofa seating along South and West walls; keep North and East sectors spacious and luminous.',
  },
  dining: {
    idealZones: ['West', 'East', 'North'],
    goodZones: ['South-East', 'North-West'],
    concernZones: ['South-West', 'North-East'],
    idealDescription: 'Dining area in West stimulates healthy digestion, family bonding, nourishment, and abundance.',
    concernDescription: 'Dining area directly facing bathroom doors can disturb digestive calm.',
    remedy: 'Use a square or rectangular solid wood dining table; hang a warm 3000K overhead pendant fixture.',
  },
  bathroom: {
    idealZones: ['North-West', 'West', 'South'],
    goodZones: ['East', 'South-East'],
    concernZones: ['North-East', 'South-West', 'Center'],
    idealDescription: 'Bathrooms in Vayavya (NW) or West ensure clean drainage, positive elimination, and hygienic airflow.',
    concernDescription: 'Bathroom in North-East directly violates the spiritual vortex of Ishanya.',
    remedy: 'Keep exhaust ventilation directed outward; keep doors closed, and place a small bowl of natural sea salt to absorb negative ions.',
  },
  study: {
    idealZones: ['North-East', 'North', 'East', 'West'],
    goodZones: ['North-West'],
    concernZones: ['South-West', 'South-East', 'Center'],
    idealDescription: 'Study/Library in NE or East enhances cognitive clarity, concentration, and academic distinction.',
    concernDescription: 'Study in South-East can cause mental fatigue and restless concentration.',
    remedy: 'Sit facing East or North while working; keep desk surface organized and brightly illuminated.',
  },
  staircase: {
    idealZones: ['South', 'South-West', 'West'],
    goodZones: ['North-West', 'South-East'],
    concernZones: ['North-East', 'North', 'East', 'Center'],
    idealDescription: 'Staircase in South or SW adds structural stability and mass where anchoring weight is recommended.',
    concernDescription: 'Heavy concrete staircase in NE burdens the sensitive spiritual apex of the home.',
    remedy: 'Ensure stairs rise in a clockwise direction; maintain warm ambient illumination on all landings.',
  },
  parking: {
    idealZones: ['North-West', 'South-East', 'North'],
    goodZones: ['East', 'West'],
    concernZones: ['North-East', 'South-West'],
    idealDescription: 'Vehicle porch in NW or SE facilitates smooth transit without obstructing cosmic prana flow.',
    concernDescription: 'Heavy enclosed garage in North-East blocks morning electromagnetic and solar ingress.',
    remedy: 'Keep canopy roof lightweight with translucent panels and maintain clean, level driveway flooring.',
  },
  garden: {
    idealZones: ['North-East', 'North', 'East'],
    goodZones: ['North-West'],
    concernZones: ['South-West', 'South'],
    idealDescription: 'Open landscaped green in NE invites positive cosmic energy and fresh morning air.',
    concernDescription: 'Overly dense, towering trees in NE cast permanent shadows, blocking morning infrared light.',
    remedy: 'Plant holy basil (Tulsi) and light flowering shrubs in NE; locate tall timber trees strictly along South and West perimeters.',
  },
  balcony: {
    idealZones: ['North-East', 'North', 'East'],
    goodZones: ['North-West', 'West'],
    concernZones: ['South-West', 'South'],
    idealDescription: 'Balcony on North or East allows cooling breezes and invigorating morning sunshine.',
    concernDescription: 'Massive open balconies in SW can create ungrounded instability.',
    remedy: 'Install planters with green foliage and ensure clean glass/railing drainage.',
  },
  utility: {
    idealZones: ['South-East', 'North-West'],
    goodZones: ['South', 'West'],
    concernZones: ['North-East', 'Center'],
    idealDescription: 'Utility and laundry area in SE or NW supports mechanical functions and wet drainage effectively.',
    concernDescription: 'Utility sink placed in North-East creates unnecessary dampness in the sacred sector.',
    remedy: 'Ensure washing machine drains swiftly and keep detergent storage neat and concealed.',
  },
  store: {
    idealZones: ['South-West', 'South', 'West'],
    goodZones: ['North-West'],
    concernZones: ['North-East', 'North', 'Center'],
    idealDescription: 'Store room in SW or South provides heavy, stable storage that anchors building massing.',
    concernDescription: 'Store room in North-East creates heavy clutter in the zone of illumination.',
    remedy: 'Keep shelves organized on South and West walls; avoid storing heavy junk in the northeast corner of the room.',
  },
};

const ZONE_DEFINITIONS: {
  zone: Direction;
  element: string;
  rulingPlanet: string;
  idealRooms: string[];
  recommendations: string;
}[] = [
  {
    zone: 'North-East',
    element: 'Water',
    rulingPlanet: 'Jupiter (Guru) & Shiva',
    idealRooms: ['Pooja Sanctum', 'Meditation Corner', 'Open Garden / Verandah', 'Study Room'],
    recommendations: 'Ishanya Apex: Keep light, clutter-free, and well-lit to welcome morning cosmic vitality.',
  },
  {
    zone: 'East',
    element: 'Solar / Light',
    rulingPlanet: 'Sun (Surya) & Indra',
    idealRooms: ['Living Hall', 'Main Entrance', 'Balcony / Verandah', 'Study Area'],
    recommendations: 'Solar Portal: Incorporate wide casement windows for early morning ultraviolet/infrared health benefits.',
  },
  {
    zone: 'South-East',
    element: 'Fire',
    rulingPlanet: 'Venus (Shukra) & Agni',
    idealRooms: ['Modular Kitchen', 'Electrical Panel / Inverter', 'Utility / Laundry'],
    recommendations: 'Agneya Zone: Align cooktop so the cook faces East. Excellent for heat-generating appliances.',
  },
  {
    zone: 'South',
    element: 'Earth',
    rulingPlanet: 'Mars (Mangal) & Yama',
    idealRooms: ['Bedrooms', 'Staircase', 'Store Room', 'Wardrobes'],
    recommendations: 'Stability Sector: Build thick masonry walls and solid structural elements for enduring strength.',
  },
  {
    zone: 'South-West',
    element: 'Earth',
    rulingPlanet: 'Rahu & Earth (Prithvi)',
    idealRooms: ['Master Bedroom', 'Heavy Wardrobes / Safe', 'Overhead Water Tank (Roof)'],
    recommendations: 'Nairutya Anchor: Highest and heaviest corner of the home. Anchors prosperity and family authority.',
  },
  {
    zone: 'West',
    element: 'Air / Water',
    rulingPlanet: 'Saturn (Shani) & Varuna',
    idealRooms: ['Dining Room', 'Children Bedroom', 'Study Room', 'Toilets'],
    recommendations: 'Varun Sector: Ideal for family dining and study spaces that flourish under afternoon breezes.',
  },
  {
    zone: 'North-West',
    element: 'Air',
    rulingPlanet: 'Moon (Chandra) & Vayu',
    idealRooms: ['Guest Bedroom', 'Powder Room / Bath', 'Car Parking Porch', 'Utility'],
    recommendations: 'Vayavya Zone: Promotes movement and social harmony. Well suited for guest rooms and vehicle movement.',
  },
  {
    zone: 'North',
    element: 'Water',
    rulingPlanet: 'Mercury (Budh) & Kuber',
    idealRooms: ['Living Room', 'Home Office / Study', 'Entrance Foyer', 'Open Lawn'],
    recommendations: 'Kuber Portal: Magnetic wealth corridor. Keep spacious, open, and cleanly ventilated.',
  },
  {
    zone: 'Center',
    element: 'Space / Ether',
    rulingPlanet: 'Brahma (Creation Core)',
    idealRooms: ['Central Living Hall', 'Courtyard Void', 'Circulation Lobby'],
    recommendations: 'Brahmasthan: The energetic heart of the house. Must remain open, light, and free of heavy pillars or toilets.',
  },
];

export function analyzeProjectVastu(rooms: CadRoom[], plot: PlotDetails): VastuReport {
  const items: VastuItemAnalysis[] = [];
  const suggestions: string[] = [];
  let totalScore = 0;
  let evaluatedCount = 0;

  // Zone room registry mapping
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
      plot.northDirection || 0
    );

    // Save zone on room object
    room.directionZone = actualZone;
    if (zoneRoomsMap[actualZone]) {
      zoneRoomsMap[actualZone].push(room.name);
    }

    const ruleKey = room.type;
    const rule = VASTU_RULES[ruleKey];

    if (rule) {
      evaluatedCount++;
      let status: VastuItemAnalysis['status'] = 'Moderate';
      let itemScore = 75;
      let comment = `✓ ${room.name} placed in ${actualZone}.`;

      if (rule.idealZones.includes(actualZone)) {
        status = 'Good';
        itemScore = 100;
        room.vastuCompliance = 'Ideal';
        comment = `✓ ${room.name} is ideally placed in ${actualZone} (${rule.idealDescription})`;
      } else if (rule.goodZones.includes(actualZone)) {
        status = 'Good';
        itemScore = 85;
        room.vastuCompliance = 'Good';
        comment = `✓ ${room.name} in ${actualZone} is auspicious and functionally balanced.`;
      } else if (rule.concernZones.includes(actualZone)) {
        status = 'Concern';
        itemScore = 45;
        room.vastuCompliance = 'Challenging';
        comment = `⚠ ${room.name} in ${actualZone}: ${rule.concernDescription}`;
        suggestions.push(`Consider aligning ${room.name} toward ${rule.idealZones.join(' or ')}. Remedy: ${rule.remedy}`);
      }

      totalScore += itemScore;

      items.push({
        element: room.name,
        zone: rule.idealZones[0],
        actualZone,
        status,
        score: itemScore,
        comment,
        description: status === 'Good' ? rule.idealDescription : rule.concernDescription,
        remedy: status === 'Concern' ? rule.remedy : undefined,
      });
    }
  });

  const finalScore = evaluatedCount > 0 ? Math.round(totalScore / evaluatedCount) : 88;

  let rating: VastuReport['rating'] = 'Good';
  if (finalScore >= 90) rating = 'Superior';
  else if (finalScore >= 75) rating = 'Good';
  else if (finalScore >= 60) rating = 'Moderate';
  else rating = 'Needs Optimization';

  // Construct all 9 zone details guaranteed
  const zoneDetails: VastuZoneAnalysis[] = ZONE_DEFINITIONS.map((def) => {
    const present = zoneRoomsMap[def.zone] || [];
    
    // Check if any placed room matches ideal room categories
    const isCompliant =
      present.length === 0 ||
      present.some((roomName) => {
        const lowerName = roomName.toLowerCase();
        return def.idealRooms.some((ideal) => {
          const keyword = ideal.toLowerCase().split(' ')[0];
          return lowerName.includes(keyword);
        });
      });

    return {
      zone: def.zone,
      element: def.element,
      rulingPlanet: def.rulingPlanet,
      idealRooms: def.idealRooms,
      currentRooms: present,
      isCompliant,
      recommendations: def.recommendations,
      score: isCompliant ? 95 : 75,
    };
  });

  const zoneAnalysis = zoneDetails.map((z) => ({
    zone: z.zone,
    rulingPlanet: z.rulingPlanet || 'Mercury',
    suitableRooms: z.idealRooms,
    presentRooms: z.currentRooms,
    score: z.score || (z.isCompliant ? 95 : 75),
  }));

  const strengths = items
    .filter((i) => i.status === 'Good')
    .map((i) => `${i.element} in ${i.actualZone} (${i.description || i.comment})`);

  const concerns = items
    .filter((i) => i.status === 'Concern')
    .map((i) => `${i.element} in ${i.actualZone}: ${i.description || i.comment}`);

  const recommendations = items
    .filter((i) => i.remedy)
    .map((i) => `${i.element}: ${i.remedy}`);

  if (suggestions.length === 0) {
    suggestions.push('Main entrance and interior spatial layout conform harmoniously with standard Vastu orientations.');
    suggestions.push('Ensure central core (Brahmasthan) remains open for positive energy circulation.');
  }

  return {
    score: Math.min(100, Math.max(50, finalScore)),
    rating,
    zoneAnalysis,
    zoneDetails,
    items,
    suggestions,
    strengths: strengths.length > 0 ? strengths.slice(0, 6) : ['Directional cosmic energy paths are well-balanced.'],
    concerns: concerns.slice(0, 4),
    recommendations: recommendations.length > 0 ? recommendations.slice(0, 4) : ['All critical room placements observe Vedic principles.'],
  };
}

