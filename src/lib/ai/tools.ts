import { FloorLayout, PlotDetails, Project } from '../../types';
import { analyzeProjectSustainability } from './sustainability-agent';
import { calculateConstructionBudget } from '../../../server/budgetEngine';
import { analyzeProjectVastu } from '../../../server/vastuEngine';
import { generateArchitecturalDesign } from '../../../server/designEngine';

export interface AiHomeAgentContext {
  project?: Project;
  plot?: PlotDetails;
  homeDna?: Record<string, any>;
}

export const AiHomeAgentTools = {
  // 1. Plot Analysis
  analyzePlot(plot: PlotDetails) {
    const area = plot.width * plot.length;
    const setbacks = {
      front: Math.max(5, Math.round(plot.length * 0.12)),
      rear: Math.max(3, Math.round(plot.length * 0.08)),
      left: Math.max(3, Math.round(plot.width * 0.08)),
      right: Math.max(3, Math.round(plot.width * 0.08)),
    };
    const maxGroundCoverage = (plot.width - setbacks.left - setbacks.right) * (plot.length - setbacks.front - setbacks.rear);
    return {
      plotArea: area,
      setbacks,
      maxGroundCoverage,
      farRatio: 1.75,
      roadOrientation: plot.roadDirection || 'North',
    };
  },

  // 2. Floor Plan Generation
  generateFloorPlan(params: {
    plot: PlotDetails;
    floorsCount?: number;
    bedrooms?: number;
    budget?: number;
    style?: 'Modern' | 'Contemporary' | 'Traditional Indian' | 'Traditional' | 'Minimalist' | 'Kerala / Coastal' | 'Luxury';
  }) {
    return generateArchitecturalDesign({
      plot: params.plot,
      floorsCount: params.floorsCount || 2,
      family: { totalMembers: 4, adults: 2, children: 1, elderly: 1, frequentGuests: true },
      preferences: {
        vastuPriority: 'High',
        naturalLighting: 'Maximized',
        crossVentilation: 'Maximized',
        privacyLevel: 'High',
        accessibilityForElderly: true,
        futureExpansionReady: true,
      },
      requirements: {
        bedrooms: params.bedrooms || 3,
        masterBedrooms: 1,
        childrenRooms: 1,
        guestRooms: (params.bedrooms || 3) > 2 ? 1 : 0,
        bathrooms: (params.bedrooms || 3) + 1,
        attachedBaths: 2,
        kitchen: true,
        livingRoom: true,
        diningRoom: true,
        studyRoom: true,
        poojaRoom: true,
        storeRoom: true,
        utilityRoom: true,
        balconies: 2,
        terrace: true,
        garden: true,
        parkingBays: 1,
        servantQuarter: false,
      },
      budget: { totalBudget: params.budget || 3500000 },
      style: params.style || 'Modern',
    });
  },

  // 3. Sustainability Engine Tool
  analyzeSustainability(plot: PlotDetails, floors: FloorLayout[], location?: string) {
    return analyzeProjectSustainability(plot, floors, location);
  },

  // 4. Vastu Shastra Tool
  analyzeVastu(plot: PlotDetails, floors: FloorLayout[]) {
    const allRooms = floors.flatMap((f) => f.rooms);
    return analyzeProjectVastu(allRooms, plot);
  },

  // 5. Budget & Cost Engine Tool
  calculateBudget(plot: PlotDetails, floors: FloorLayout[], tier: 'Economy' | 'Standard' | 'Premium' = 'Standard') {
    const totalArea = floors.reduce((acc, f) => acc + f.builtUpArea, 0);
    const bedroomCount = floors.flatMap(f => f.rooms).filter(r => r.type.includes('bedroom')).length || 3;
    const bathroomCount = floors.flatMap(f => f.rooms).filter(r => r.type === 'bathroom').length || 3;

    return calculateConstructionBudget({
      totalBuiltUpArea: totalArea,
      floorsCount: floors.length,
      bedroomsCount: bedroomCount,
      bathroomsCount: bathroomCount,
      tier: tier,
      userBudget: { totalBudget: 3500000 },
    });
  },
};
