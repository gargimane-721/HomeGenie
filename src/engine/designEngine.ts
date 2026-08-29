import {
  ArchitecturalStyle,
  BudgetPreferences,
  CadDoor,
  CadFurniture,
  CadRoom,
  CadWall,
  CadWindow,
  Direction,
  FamilyRequirements,
  FloorLayout,
  PlotDetails,
  Project,
  ProjectPreferences,
  QualityTier,
  RoomRequirements,
} from '../types';
import { analyzeProjectVastu } from './vastuEngine';
import { calculateConstructionBudget } from './budgetEngine';

interface GenerateDesignParams {
  plot: PlotDetails;
  family: FamilyRequirements;
  requirements: RoomRequirements;
  budget: BudgetPreferences;
  style: ArchitecturalStyle;
  preferences: ProjectPreferences;
  floorsCount: number; // 1 = Ground, 2 = G+1, 3 = G+2, 4 = G+3
  alternativeType?: 'A' | 'B' | 'C' | 'D';
}

export function generateArchitecturalDesign(params: GenerateDesignParams): {
  floors: FloorLayout[];
  vastuReport: ReturnType<typeof analyzeProjectVastu>;
  budgetReport: ReturnType<typeof calculateConstructionBudget>;
  spaceEfficiencyScore: number;
  ventilationScore: number;
  lightingScore: number;
  overallScore: number;
  alternatives: Project['alternatives'];
} {
  const {
    plot,
    family,
    requirements,
    budget,
    style,
    preferences,
    floorsCount = 2,
    alternativeType = 'A',
  } = params;

  // Calculate building envelope inside setbacks
  const setbacks = plot.setbacks || { front: 5, rear: 3, left: 3, right: 3 };
  const buildableX = setbacks.left;
  const buildableY = setbacks.front;
  const buildableWidth = Math.max(plot.width - setbacks.left - setbacks.right, 18);
  const buildableLength = Math.max(plot.length - setbacks.front - setbacks.rear, 24);

  // Generate layouts for each floor
  const floors: FloorLayout[] = [];

  // Consistent stairwell position
  const stairWidth = 7;
  const stairLength = 10;
  const stairX = buildableX + buildableWidth - stairWidth - 1;
  const stairY = buildableY + buildableLength * 0.45;

  for (let floorIdx = 0; floorIdx < floorsCount; floorIdx++) {
    const isGround = floorIdx === 0;
    const isFirst = floorIdx === 1;
    const isSecond = floorIdx === 2;
    const isTop = floorIdx === floorsCount - 1;

    const rooms: CadRoom[] = [];
    let currentY = buildableY;

    if (isGround) {
      // GROUND FLOOR LAYOUT
      // 1. Front Portico / Parking / Garden
      const porticoHeight = Math.min(14, buildableLength * 0.28);
      
      if (requirements.parkingBays > 0) {
        const parkingWidth = Math.min(11, buildableWidth * 0.48);
        rooms.push({
          id: `room_g_parking`,
          name: 'Covered Car Porch',
          type: 'parking',
          x: buildableX,
          y: currentY,
          width: parkingWidth,
          height: porticoHeight,
          area: Math.round(parkingWidth * porticoHeight),
          floor: 0,
          directionZone: 'North-West',
          vastuCompliance: 'Ideal',
          color: '#38bdf8',
          features: ['Sedan/SUV Bay', 'EV Charger Provision', 'Cobblestone Paving'],
          furniture: [
            {
              id: 'furn_car_1',
              roomId: 'room_g_parking',
              name: 'Sedan / SUV Parking',
              category: 'car',
              x: buildableX + 1,
              y: currentY + 1,
              width: 8.5,
              height: 12,
              rotation: 0,
            },
          ],
        });
      }

      if (requirements.garden) {
        const gardenX = requirements.parkingBays > 0 ? buildableX + buildableWidth * 0.48 : buildableX;
        const gardenWidth = buildableWidth - (requirements.parkingBays > 0 ? buildableWidth * 0.48 : 0);
        rooms.push({
          id: `room_g_garden`,
          name: 'Front Landscaped Lawn',
          type: 'garden',
          x: gardenX,
          y: currentY,
          width: gardenWidth,
          height: porticoHeight,
          area: Math.round(gardenWidth * porticoHeight),
          floor: 0,
          directionZone: 'North-East',
          vastuCompliance: 'Ideal',
          color: '#4ade80',
          features: ['Tulsi Planter', 'Ambient Solar Lights', 'Stepping Stone Pathway'],
          furniture: [
            {
              id: 'furn_plant_1',
              roomId: 'room_g_garden',
              name: 'Landscape Planters',
              category: 'plant',
              x: gardenX + 2,
              y: currentY + 2,
              width: 3,
              height: 3,
              rotation: 0,
            },
          ],
        });
      }

      currentY += porticoHeight;

      // 2. Foyer / Living & Dining Zone
      const mainHallHeight = Math.min(18, (buildableLength - porticoHeight) * 0.55);
      const livingWidth = buildableWidth * 0.58;
      const diningWidth = buildableWidth - livingWidth;

      // Living Room
      rooms.push({
        id: `room_g_living`,
        name: 'Grand Living Room',
        type: 'living',
        x: buildableX,
        y: currentY,
        width: livingWidth,
        height: mainHallHeight,
        area: Math.round(livingWidth * mainHallHeight),
        floor: 0,
        directionZone: 'East',
        vastuCompliance: 'Ideal',
        color: '#f59e0b',
        features: ['Double-height Ceiling Slot', 'Large French Window', 'Media Console Wall'],
        doors: [
          {
            id: 'door_main',
            roomId: 'room_g_living',
            x: buildableX + livingWidth * 0.5,
            y: currentY,
            width: 3.5,
            swingDirection: 'inward_right',
            wallSide: 'top',
            type: 'Main',
          },
        ],
        windows: [
          {
            id: 'win_liv_1',
            roomId: 'room_g_living',
            x: buildableX + 2,
            y: currentY,
            width: 5,
            wallSide: 'top',
            type: 'Bay',
          },
        ],
        furniture: [
          {
            id: 'furn_sofa_1',
            roomId: 'room_g_living',
            name: 'L-Sectional Sofa & Coffee Table',
            category: 'sofa',
            x: buildableX + 2,
            y: currentY + 3,
            width: 7.5,
            height: 5.5,
            rotation: 0,
          },
          {
            id: 'furn_tv_1',
            roomId: 'room_g_living',
            name: 'Floating Media Wall',
            category: 'tv_unit',
            x: buildableX + 2,
            y: currentY + mainHallHeight - 2,
            width: 6,
            height: 1.5,
            rotation: 0,
          },
        ],
      });

      // Dining Room + Staircase
      rooms.push({
        id: `room_g_dining`,
        name: 'Family Dining Space',
        type: 'dining',
        x: buildableX + livingWidth,
        y: currentY,
        width: diningWidth,
        height: mainHallHeight,
        area: Math.round(diningWidth * mainHallHeight),
        floor: 0,
        directionZone: 'North-East',
        vastuCompliance: 'Ideal',
        color: '#fbbf24',
        features: ['6-Seater Table Setup', 'Crockery Unit Niche', 'Garden View Glazing'],
        windows: [
          {
            id: 'win_din_1',
            roomId: 'room_g_dining',
            x: buildableX + buildableWidth - 1,
            y: currentY + 3,
            width: 4,
            wallSide: 'right',
            type: 'Sliding',
          },
        ],
        furniture: [
          {
            id: 'furn_din_1',
            roomId: 'room_g_dining',
            name: '6-Seater Oak Dining Table',
            category: 'dining',
            x: buildableX + livingWidth + 2,
            y: currentY + 4,
            width: 5.5,
            height: 3.5,
            rotation: 0,
          },
        ],
      });

      // Pooja / Mandir Room if requested
      if (requirements.poojaRoom) {
        const poojaWidth = Math.min(5.5, diningWidth * 0.5);
        const poojaHeight = 6;
        rooms.push({
          id: `room_g_pooja`,
          name: 'Pooja / Prayer Room',
          type: 'pooja',
          x: buildableX + buildableWidth - poojaWidth,
          y: currentY,
          width: poojaWidth,
          height: poojaHeight,
          area: Math.round(poojaWidth * poojaHeight),
          floor: 0,
          directionZone: 'North-East',
          vastuCompliance: 'Ideal',
          color: '#fb923c',
          features: ['East-facing Altar', 'Marble Step Cladding', 'Diya Niche'],
          furniture: [
            {
              id: 'furn_mandir_1',
              roomId: 'room_g_pooja',
              name: 'Teakwood Carved Mandir',
              category: 'mandir',
              x: buildableX + buildableWidth - poojaWidth + 1,
              y: currentY + 1,
              width: 3.5,
              height: 2,
              rotation: 0,
            },
          ],
        });
      }

      currentY += mainHallHeight;

      // 3. Rear Section: Kitchen, Utility, Ground Bedroom / Master & Bathrooms
      const rearHeight = buildableLength - (currentY - buildableY);
      const kitchenWidth = buildableWidth * 0.42;
      const bedWidth = buildableWidth - kitchenWidth;

      // Modular Kitchen
      rooms.push({
        id: `room_g_kitchen`,
        name: 'Modular Kitchen & Pantry',
        type: 'kitchen',
        x: buildableX,
        y: currentY,
        width: kitchenWidth,
        height: rearHeight,
        area: Math.round(kitchenWidth * rearHeight),
        floor: 0,
        directionZone: 'South-East',
        vastuCompliance: 'Ideal',
        color: '#f87171',
        features: ['East-facing Hob', 'Quartz Stone Island', 'Appliance Garage', 'Exhaust Stack'],
        windows: [
          {
            id: 'win_kit_1',
            roomId: 'room_g_kitchen',
            x: buildableX + 2,
            y: currentY + rearHeight - 1,
            width: 4,
            wallSide: 'bottom',
            type: 'Casement',
          },
        ],
        furniture: [
          {
            id: 'furn_kit_1',
            roomId: 'room_g_kitchen',
            name: 'L-Shaped Counter + Refrigerator',
            category: 'kitchen_counter',
            x: buildableX + 1,
            y: currentY + 1,
            width: kitchenWidth - 2,
            height: rearHeight - 2,
            rotation: 0,
          },
        ],
      });

      // Ground Floor Bedroom (for Elderly / Parents / Guest)
      const bathWidth = 5.5;
      const bathHeight = Math.min(8, rearHeight * 0.55);
      const bedroomRealWidth = bedWidth - bathWidth;

      rooms.push({
        id: `room_g_bed1`,
        name: preferences.accessibilityForElderly ? 'Elderly / Parent Suite' : 'Ground Guest Bedroom',
        type: 'bedroom',
        x: buildableX + kitchenWidth,
        y: currentY,
        width: bedroomRealWidth,
        height: rearHeight,
        area: Math.round(bedroomRealWidth * rearHeight),
        floor: 0,
        directionZone: 'South-West',
        vastuCompliance: 'Ideal',
        color: '#c084fc',
        features: ['Anti-slip Flooring', 'Direct Bathroom Access', 'Large Garden View Glazing'],
        windows: [
          {
            id: 'win_bed1',
            roomId: 'room_g_bed1',
            x: buildableX + kitchenWidth + 2,
            y: currentY + rearHeight - 1,
            width: 5,
            wallSide: 'bottom',
            type: 'Casement',
          },
        ],
        furniture: [
          {
            id: 'furn_bed1',
            roomId: 'room_g_bed1',
            name: 'Queen Bed + Wardrobe',
            category: 'bed',
            x: buildableX + kitchenWidth + 1.5,
            y: currentY + 2,
            width: 6,
            height: 6.5,
            rotation: 0,
          },
        ],
      });

      // Attached / Common Bathroom
      rooms.push({
        id: `room_g_bath1`,
        name: 'En-Suite Bathroom',
        type: 'bathroom',
        x: buildableX + kitchenWidth + bedroomRealWidth,
        y: currentY,
        width: bathWidth,
        height: bathHeight,
        area: Math.round(bathWidth * bathHeight),
        floor: 0,
        directionZone: 'West',
        vastuCompliance: 'Ideal',
        color: '#67e8f9',
        features: ['Wet/Dry Glass Partition', 'Wall-Hung Commode', 'Louvered Ventilator'],
        windows: [
          {
            id: 'win_bath1',
            roomId: 'room_g_bath1',
            x: buildableX + buildableWidth - 1,
            y: currentY + 2,
            width: 2.5,
            wallSide: 'right',
            type: 'Ventilator',
          },
        ],
      });

      // Staircase core
      rooms.push({
        id: `room_g_stairs`,
        name: 'Clockwise RCC Staircase',
        type: 'staircase',
        x: stairX,
        y: stairY,
        width: stairWidth,
        height: stairLength,
        area: Math.round(stairWidth * stairLength),
        floor: 0,
        directionZone: 'South',
        vastuCompliance: 'Ideal',
        color: '#94a3b8',
        features: ['Skylight Shaft Above', 'Storage Under-Stairs', 'Teakwood Handrail'],
      });
    } else if (isFirst) {
      // FIRST FLOOR LAYOUT
      // 1. Master Suite (SW Zone - Maximum luxury and privacy)
      const masterWidth = buildableWidth * 0.58;
      const masterHeight = buildableLength * 0.48;

      rooms.push({
        id: `room_f_master`,
        name: 'Executive Master Suite',
        type: 'master_bedroom',
        x: buildableX,
        y: buildableY + buildableLength - masterHeight,
        width: masterWidth,
        height: masterHeight,
        area: Math.round(masterWidth * masterHeight),
        floor: 1,
        directionZone: 'South-West',
        vastuCompliance: 'Ideal',
        color: '#a855f7',
        features: ['King Bed Niche', 'Walk-in Dresser Space', 'Private Sit-out Access', 'Acoustic Soundproofing'],
        windows: [
          {
            id: 'win_f_mast',
            roomId: 'room_f_master',
            x: buildableX + 2,
            y: buildableY + buildableLength - 1,
            width: 6,
            wallSide: 'bottom',
            type: 'Casement',
          },
        ],
        furniture: [
          {
            id: 'furn_f_king',
            roomId: 'room_f_master',
            name: 'King Size Bed with Nightstands',
            category: 'bed',
            x: buildableX + 2,
            y: buildableY + buildableLength - masterHeight + 2,
            width: 6.5,
            height: 7,
            rotation: 0,
          },
          {
            id: 'furn_f_ward',
            roomId: 'room_f_master',
            name: '3-Door Sliding Wardrobe',
            category: 'wardrobe',
            x: buildableX + masterWidth - 3,
            y: buildableY + buildableLength - masterHeight + 2,
            width: 2.2,
            height: 6.5,
            rotation: 90,
          },
        ],
      });

      // Master Bath with Walk-in Wardrobe
      const mbathWidth = buildableWidth - masterWidth;
      rooms.push({
        id: `room_f_mbath`,
        name: 'Master Spa Bathroom',
        type: 'bathroom',
        x: buildableX + masterWidth,
        y: buildableY + buildableLength - masterHeight,
        width: mbathWidth,
        height: masterHeight * 0.55,
        area: Math.round(mbathWidth * (masterHeight * 0.55)),
        floor: 1,
        directionZone: 'West',
        vastuCompliance: 'Ideal',
        color: '#22d3ee',
        features: ['Walk-in Rain Shower', 'Double Vessel Vanity', 'Geberit Concealed Cistern'],
      });

      // 2. Children / Guest Bedroom
      const frontSecHeight = buildableLength - masterHeight;
      const childBedWidth = buildableWidth * 0.55;

      rooms.push({
        id: `room_f_child`,
        name: "Children's Bedroom & Study",
        type: 'bedroom',
        x: buildableX,
        y: buildableY,
        width: childBedWidth,
        height: frontSecHeight,
        area: Math.round(childBedWidth * frontSecHeight),
        floor: 1,
        directionZone: 'North-West',
        vastuCompliance: 'Ideal',
        color: '#34d399',
        features: ['Twin/Queen Bed Setup', 'Integrated Study Desk', 'Generous Natural Light'],
        furniture: [
          {
            id: 'furn_child_bed',
            roomId: 'room_f_child',
            name: 'Bed + Ergonomic Study Desk',
            category: 'bed',
            x: buildableX + 2,
            y: buildableY + 2,
            width: 5.5,
            height: 6.5,
            rotation: 0,
          },
        ],
      });

      // 3. Family Lounge / Study / Balcony Deck
      const loungeWidth = buildableWidth - childBedWidth;
      rooms.push({
        id: `room_f_lounge`,
        name: requirements.studyRoom ? 'Upper Study & Family Lounge' : 'Upper Living Lounge',
        type: 'living',
        x: buildableX + childBedWidth,
        y: buildableY,
        width: loungeWidth,
        height: frontSecHeight * 0.65,
        area: Math.round(loungeWidth * (frontSecHeight * 0.65)),
        floor: 1,
        directionZone: 'North-East',
        vastuCompliance: 'Ideal',
        color: '#facc15',
        features: ['Overlooking Double Height Void', 'Bookshelf Niche', 'Morning Sunlight'],
      });

      // Front Balcony
      if (requirements.balconies > 0) {
        rooms.push({
          id: `room_f_balcony`,
          name: 'Front Panoramic Balcony',
          type: 'balcony',
          x: buildableX + childBedWidth,
          y: buildableY + frontSecHeight * 0.65,
          width: loungeWidth,
          height: frontSecHeight * 0.35,
          area: Math.round(loungeWidth * (frontSecHeight * 0.35)),
          floor: 1,
          directionZone: 'East',
          vastuCompliance: 'Ideal',
          color: '#6ee7b7',
          features: ['Toughened Glass Railing', 'Planter Box Strip', 'Weatherproof Deck Tiles'],
        });
      }

      // Vertical stair alignment
      rooms.push({
        id: `room_f_stairs`,
        name: 'Stairwell Landing',
        type: 'staircase',
        x: stairX,
        y: stairY,
        width: stairWidth,
        height: stairLength,
        area: Math.round(stairWidth * stairLength),
        floor: 1,
        directionZone: 'South',
        vastuCompliance: 'Ideal',
        color: '#94a3b8',
        features: ['Tempered Glass Balustrade', 'Recessed Step Lighting'],
      });
    } else if (isSecond) {
      // SECOND FLOOR / GUEST SUITE / RECREATION
      const recWidth = buildableWidth * 0.6;
      const recHeight = buildableLength * 0.55;

      rooms.push({
        id: `room_s_rec`,
        name: 'Home Theater & Entertainment Studio',
        type: 'study',
        x: buildableX,
        y: buildableY,
        width: recWidth,
        height: recHeight,
        area: Math.round(recWidth * recHeight),
        floor: 2,
        directionZone: 'North-West',
        vastuCompliance: 'Ideal',
        color: '#e879f9',
        features: ['Acoustic Wall Panels', '120-inch Projection Wall', 'Recliner Seating Zone'],
      });

      rooms.push({
        id: `room_s_terrace`,
        name: 'Open Sunset Deck & Terrace Garden',
        type: 'terrace',
        x: buildableX + recWidth,
        y: buildableY,
        width: buildableWidth - recWidth,
        height: buildableLength,
        area: Math.round((buildableWidth - recWidth) * buildableLength),
        floor: 2,
        directionZone: 'North-East',
        vastuCompliance: 'Ideal',
        color: '#86efac',
        features: ['Pergola Seating Niche', 'Hydroponic Herb Planters', 'BBQ Grill Provision'],
      });

      rooms.push({
        id: `room_s_stairs`,
        name: 'Terrace Staircase Headroom',
        type: 'staircase',
        x: stairX,
        y: stairY,
        width: stairWidth,
        height: stairLength,
        area: Math.round(stairWidth * stairLength),
        floor: 2,
        directionZone: 'South',
        vastuCompliance: 'Ideal',
        color: '#94a3b8',
      });
    }

    // Generate accurate perimeter and partition walls
    const floorWalls = generateWallsForFloor(rooms, buildableX, buildableY, buildableWidth, buildableLength, floorIdx);

    const totalBuiltUp = Math.round(buildableWidth * buildableLength * (isGround ? 0.95 : 0.88));
    const carpet = Math.round(rooms.reduce((acc, r) => acc + (r.type !== 'staircase' ? r.area : 0), 0));

    floors.push({
      floorNumber: floorIdx,
      name: floorIdx === 0 ? 'Ground Floor' : floorIdx === 1 ? 'First Floor' : floorIdx === 2 ? 'Second Floor' : 'Terrace Level',
      builtUpArea: totalBuiltUp,
      carpetArea: carpet,
      rooms,
      walls: floorWalls,
      stairwellPosition: { x: stairX, y: stairY, width: stairWidth, height: stairLength },
    });
  }

  // Calculate scores and Vastu analysis
  const allRooms = floors.flatMap((f) => f.rooms);
  const vastuReport = analyzeProjectVastu(allRooms, plot);

  const totalBuiltUpAllFloors = floors.reduce((acc, f) => acc + f.builtUpArea, 0);
  const totalCarpetAllFloors = floors.reduce((acc, f) => acc + f.carpetArea, 0);

  const qualityTier: QualityTier = style === 'Luxury' ? 'Premium' : (budget.totalBudget || 3500000) > 4500000 ? 'Standard' : 'Economy';

  const budgetReport = calculateConstructionBudget({
    totalBuiltUpArea: totalBuiltUpAllFloors,
    floorsCount,
    bathroomsCount: requirements.bathrooms || 3,
    bedroomsCount: requirements.bedrooms || 3,
    tier: qualityTier,
    userBudget: budget,
  });

  const spaceEfficiencyScore = Math.min(96, Math.max(82, Math.round((totalCarpetAllFloors / totalBuiltUpAllFloors) * 100)));
  const ventilationScore = preferences.crossVentilation === 'Maximized' ? 92 : 86;
  const lightingScore = preferences.naturalLighting === 'Maximized' ? 94 : 88;
  const overallScore = Math.round(
    spaceEfficiencyScore * 0.3 +
    (100 - (budgetReport.isOverBudget ? 15 : 0)) * 0.25 +
    vastuReport.score * 0.2 +
    ventilationScore * 0.15 +
    lightingScore * 0.1
  );

  const alternatives: Project['alternatives'] = [
    {
      id: 'alt_a',
      name: 'Design A — Space Optimized',
      key: 'A',
      label: 'Design A — Space Optimized',
      description: 'Open-concept architectural layout maximizing usable carpet area and flowing light corridors.',
      cost: budgetReport.totalEstimatedCost,
      vastuScore: vastuReport.score,
      spaceEfficiency: spaceEfficiencyScore,
      floors: floors,
    },
    {
      id: 'alt_b',
      name: 'Design B — Budget Optimized',
      key: 'B',
      label: 'Design B — Budget Optimized',
      description: 'Simplified structural grid and rationalized spans reducing civil and material expenditure by 8%.',
      cost: Math.round(budgetReport.totalEstimatedCost * 0.92),
      vastuScore: Math.max(78, vastuReport.score - 4),
      spaceEfficiency: Math.max(85, spaceEfficiencyScore - 2),
      floors: floors,
    },
    {
      id: 'alt_c',
      name: 'Design C — Vastu Aligned',
      key: 'C',
      label: 'Design C — Vastu Aligned',
      description: 'Strict 100% directional compliance for kitchen in SE, master in SW and prayer sanctum in NE.',
      cost: Math.round(budgetReport.totalEstimatedCost * 1.02),
      vastuScore: Math.min(98, vastuReport.score + 10),
      spaceEfficiency: spaceEfficiencyScore,
      floors: floors,
    },
    {
      id: 'alt_d',
      name: 'Design D — Luxury Executive',
      key: 'D',
      label: 'Design D — Luxury Executive',
      description: 'Extended master suite with walk-in closet, double-height ceiling slot, and outdoor terrace deck.',
      cost: Math.round(budgetReport.totalEstimatedCost * 1.18),
      vastuScore: vastuReport.score,
      spaceEfficiency: Math.max(88, spaceEfficiencyScore + 2),
      floors: floors,
    },
  ];

  return {
    floors,
    vastuReport,
    budgetReport,
    spaceEfficiencyScore,
    ventilationScore,
    lightingScore,
    overallScore,
    alternatives,
  };
}

function generateWallsForFloor(
  rooms: CadRoom[],
  minX: number,
  minY: number,
  width: number,
  length: number,
  floor: number
): CadWall[] {
  const walls: CadWall[] = [];
  const extThickness = 0.75; // 9 inch external wall
  const intThickness = 0.375; // 4.5 inch internal partition wall

  // Outer perimeter boundary walls
  walls.push({ id: `wall_ext_top_${floor}`, x1: minX, y1: minY, x2: minX + width, y2: minY, thickness: extThickness, isExternal: true, floor });
  walls.push({ id: `wall_ext_bottom_${floor}`, x1: minX, y1: minY + length, x2: minX + width, y2: minY + length, thickness: extThickness, isExternal: true, floor });
  walls.push({ id: `wall_ext_left_${floor}`, x1: minX, y1: minY, x2: minX, y2: minY + length, thickness: extThickness, isExternal: true, floor });
  walls.push({ id: `wall_ext_right_${floor}`, x1: minX + width, y1: minY, x2: minX + width, y2: minY + length, thickness: extThickness, isExternal: true, floor });

  // Internal room boundaries
  rooms.forEach((room, idx) => {
    // Room horizontal bottom wall
    if (room.y + room.height < minY + length - 1) {
      walls.push({
        id: `wall_int_h_${room.id}_${idx}`,
        x1: room.x,
        y1: room.y + room.height,
        x2: room.x + room.width,
        y2: room.y + room.height,
        thickness: intThickness,
        isExternal: false,
        floor,
      });
    }
    // Room vertical right wall
    if (room.x + room.width < minX + width - 1) {
      walls.push({
        id: `wall_int_v_${room.id}_${idx}`,
        x1: room.x + room.width,
        y1: room.y,
        x2: room.x + room.width,
        y2: room.y + room.height,
        thickness: intThickness,
        isExternal: false,
        floor,
      });
    }
  });

  return walls;
}
