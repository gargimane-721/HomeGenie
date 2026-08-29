import { Project } from '../types';
import { generateArchitecturalDesign } from '../engine/designEngine';

export function generateCompleteProject(input: Partial<Project>): Project {
  const plot = input.plot || {
    width: 30,
    length: 50,
    totalArea: 1500,
    shape: 'Rectangular',
    roadDirection: 'North',
    northDirection: 0,
    location: 'Bengaluru',
    setbacks: {
      front: 5,
      rear: 3,
      left: 3,
      right: 3,
    },
  };

  const family = input.family || {
    totalMembers: 4,
    adults: 3,
    children: 1,
    elderly: 0,
    frequentGuests: false,
  };

  const requirements = input.requirements || {
    bedrooms: 3,
    masterBedrooms: 1,
    childrenRooms: 1,
    guestRooms: 1,
    bathrooms: 3,
    attachedBaths: 2,
    kitchen: true,
    livingRoom: true,
    diningRoom: true,
    studyRoom: false,
    poojaRoom: true,
    storeRoom: true,
    utilityRoom: true,
    balconies: 1,
    terrace: true,
    garden: true,
    parkingBays: 1,
    servantQuarter: false,
  };

  const budget = input.budget || {
    totalBudget: 3800000,
  };

  const style = input.style || 'Modern';

  const preferences = input.preferences || {
    vastuPriority: 'High',
    naturalLighting: 'Maximized',
    crossVentilation: 'Maximized',
    privacyLevel: 'High',
    accessibilityForElderly: false,
    futureExpansionReady: true,
  };

  const totalFloors = input.totalFloors || 2;
  const floorsCount = Math.max(1, Math.min(4, totalFloors));

  // Run the core deterministic architectural design engine
  const designResult = generateArchitecturalDesign({
    plot,
    family,
    requirements,
    budget,
    style,
    preferences,
    floorsCount,
  });

  const projectId = input.id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const projectName = input.name || `${plot.width}' × ${plot.length}' ${style} Villa`;

  const completeProject: Project = {
    id: projectId,
    name: projectName,
    description: `Custom ${style} home tailored for ${family.totalMembers} family members with ${plot.totalArea} sq.ft plot, ${requirements.bedrooms}BHK configuration, and ${totalFloors} floors.`,
    createdAt: input.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    plot,
    family,
    requirements,
    budget,
    style,
    preferences,
    totalFloors,
    floors: designResult.floors,
    vastuReport: designResult.vastuReport,
    budgetReport: designResult.budgetReport,
    spaceEfficiencyScore: designResult.spaceEfficiencyScore,
    ventilationScore: designResult.ventilationScore,
    lightingScore: designResult.lightingScore,
    overallScore: designResult.overallScore,
    alternatives: designResult.alternatives,
    appliedSavings: [],
  };

  return completeProject;
}
