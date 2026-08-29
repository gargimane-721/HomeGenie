import { CadRoom, Direction, PlotDetails, VastuItemAnalysis, VastuReport } from '../types';

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
    concernDescription: 'Staircase in NE burdens the sensitive spiritual apex zone.',
    remedy: 'Ensure stairs rise in clockwise direction and maintain high illumination on landings.',
  },
  parking: {
    idealZones: ['North-West', 'South-East'],
    goodZones: ['North', 'East'],
    concernZones: ['North-East', 'South-West'],
    idealDescription: 'Vehicle porch in NW or SE facilitates safe vehicle movement without obstructing prana flow.',
    concernDescription: 'Heavy garage parking in NE blocks magnetic solar energy entry.',
    remedy: 'Maintain low ceiling height on porch and keep driveway clean and well-drained.',
  },
  garden: {
    idealZones: ['North-East', 'North', 'East'],
    goodZones: ['North-West'],
    concernZones: ['South-West', 'South'],
    idealDescription: 'Landscaped open garden in NE invites positive cosmic electromagnetic flux.',
    concernDescription: 'Heavy dense trees in NE block early morning infrared/ultraviolet sunlight.',
    remedy: 'Plant Tulsi and flowering shrubs in NE; locate tall heavy trees strictly along South/West boundaries.',
  },
  study: {
    idealZones: ['North-East', 'North', 'East', 'West'],
    goodZones: ['North-West'],
    concernZones: ['South-West', 'South-East'],
    idealDescription: 'Study in NE or East enhances memory, clarity, and intellectual focus.',
    concernDescription: 'Study in SE leads to agitation and short attention spans.',
    remedy: 'Sit facing East or North while studying or working on laptop.',
  },
};

export function analyzeProjectVastu(rooms: CadRoom[], plot: PlotDetails): VastuReport {
  const items: VastuItemAnalysis[] = [];
  let totalScore = 0;
  let evaluatedCount = 0;

  rooms.forEach((room) => {
    // Determine actual zone based on room center
    const roomCenterX = room.x + room.width / 2;
    const roomCenterY = room.y + room.height / 2;
    const actualZone = calculateDirectionZone(
      roomCenterX,
      roomCenterY,
      plot.width,
      plot.length,
      plot.northDirection || 0
    );

    const rule = VASTU_RULES[room.type];
    if (!rule) return;

    evaluatedCount++;
    let status: VastuItemAnalysis['status'] = 'Moderate';
    let itemScore = 75;

    if (rule.idealZones.includes(actualZone)) {
      status = 'Good';
      itemScore = 100;
    } else if (rule.goodZones.includes(actualZone)) {
      status = 'Good';
      itemScore = 85;
    } else if (rule.concernZones.includes(actualZone)) {
      status = 'Concern';
      itemScore = 45;
    }

    totalScore += itemScore;

    items.push({
      element: room.name,
      zone: rule.idealZones[0],
      actualZone,
      status,
      score: itemScore,
      description: status === 'Good' ? rule.idealDescription : rule.concernDescription,
      remedy: status === 'Concern' ? rule.remedy : undefined,
    });
  });

  const finalScore = evaluatedCount > 0 ? Math.round(totalScore / evaluatedCount) : 85;

  const strengths = items
    .filter((i) => i.status === 'Good')
    .map((i) => `${i.element} perfectly positioned in ${i.actualZone} zone.`);

  const concerns = items
    .filter((i) => i.status === 'Concern')
    .map((i) => `${i.element} in ${i.actualZone} (${i.description})`);

  const recommendations = items
    .filter((i) => i.remedy)
    .map((i) => i.remedy as string);

  return {
    score: Math.min(100, Math.max(50, finalScore)),
    items,
    strengths: strengths.length > 0 ? strengths.slice(0, 4) : ['Main entryway aligned with positive energy flow.'],
    concerns: concerns.slice(0, 3),
    recommendations: recommendations.length > 0 ? recommendations.slice(0, 3) : ['All key rooms align harmoniously with cardinal energies.'],
  };
}
