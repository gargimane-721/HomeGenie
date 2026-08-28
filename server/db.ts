import {
  MaterialItem,
  Project,
  User,
} from '../src/types';
import { INITIAL_MATERIALS } from './materialsCatalog';
import { generateArchitecturalDesign } from './designEngine';

export class HomeGenieDatabase {
  private users: Map<string, User> = new Map();
  private projects: Map<string, Project> = new Map();
  private materials: MaterialItem[] = [...INITIAL_MATERIALS];

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    // Default demo user
    const demoUser: User = {
      id: 'usr_demo_1',
      name: 'Arjun Mehta',
      email: 'arjun.mehta@example.com',
      phone: '+91 98765 43210',
      city: 'Bengaluru, Karnataka',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      unitPreference: 'sqft',
      currency: 'INR',
      vastuPreference: 'Strict',
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    };
    this.users.set(demoUser.id, demoUser);
    this.users.set(demoUser.email, demoUser);

    // Seed realistic sample projects
    const samplePlot1 = {
      length: 50,
      width: 30,
      totalArea: 1500,
      shape: 'Rectangular' as const,
      roadDirection: 'North' as const,
      northDirection: 0,
      location: 'Whitefield, Bengaluru',
      setbacks: { front: 5, rear: 3, left: 3, right: 3 },
    };

    const sampleDesign1 = generateArchitecturalDesign({
      plot: samplePlot1,
      family: { totalMembers: 4, adults: 2, children: 1, elderly: 1, frequentGuests: true },
      requirements: {
        bedrooms: 3,
        masterBedrooms: 1,
        childrenRooms: 1,
        guestRooms: 1,
        bathrooms: 3,
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
      budget: { totalBudget: 3500000 },
      style: 'Modern',
      preferences: {
        vastuPriority: 'High',
        naturalLighting: 'Maximized',
        crossVentilation: 'Maximized',
        privacyLevel: 'High',
        accessibilityForElderly: true,
        futureExpansionReady: true,
      },
      floorsCount: 2,
    });

    const project1: Project = {
      id: 'proj_30x50_villa',
      userId: demoUser.id,
      name: 'Modern 3BHK G+1 Serene Villa',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Optimized',
      plot: samplePlot1,
      family: { totalMembers: 4, adults: 2, children: 1, elderly: 1, frequentGuests: true },
      requirements: {
        bedrooms: 3,
        masterBedrooms: 1,
        childrenRooms: 1,
        guestRooms: 1,
        bathrooms: 3,
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
      budget: { totalBudget: 3500000 },
      style: 'Modern',
      preferences: {
        vastuPriority: 'High',
        naturalLighting: 'Maximized',
        crossVentilation: 'Maximized',
        privacyLevel: 'High',
        accessibilityForElderly: true,
        futureExpansionReady: true,
      },
      totalFloors: 2,
      floors: sampleDesign1.floors,
      vastuReport: sampleDesign1.vastuReport,
      budgetReport: sampleDesign1.budgetReport,
      spaceEfficiencyScore: sampleDesign1.spaceEfficiencyScore,
      ventilationScore: sampleDesign1.ventilationScore,
      lightingScore: sampleDesign1.lightingScore,
      overallScore: sampleDesign1.overallScore,
      alternatives: sampleDesign1.alternatives,
      selectedAlternative: 'A',
      versions: [
        {
          versionNumber: 1,
          name: 'Version 1: Initial AI Draft',
          timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
          changesSummary: 'Initial layout synthesized based on 30x50 plot specs.',
          estimatedCost: 3620000,
          vastuScore: 84,
          spaceEfficiency: 89,
          designData: { floors: sampleDesign1.floors, plot: samplePlot1 },
        },
        {
          versionNumber: 2,
          name: 'Version 2: Added Front Garden & Covered Porch',
          timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
          changesSummary: 'Integrated landscape lawn in NE and sedan parking bay in NW.',
          estimatedCost: 3580000,
          vastuScore: 87,
          spaceEfficiency: 91,
          designData: { floors: sampleDesign1.floors, plot: samplePlot1 },
        },
        {
          versionNumber: 3,
          name: 'Version 3: Budget Optimized & Vastu Refined',
          timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
          changesSummary: 'Value-engineered window/tile specifications to meet ₹35L budget.',
          estimatedCost: 3385000,
          vastuScore: 87,
          spaceEfficiency: 91,
          designData: { floors: sampleDesign1.floors, plot: samplePlot1 },
        },
      ],
    };

    this.projects.set(project1.id, project1);

    // Project 2: Compact Urban 2BHK
    const samplePlot2 = {
      length: 40,
      width: 25,
      totalArea: 1000,
      shape: 'Rectangular' as const,
      roadDirection: 'East' as const,
      northDirection: 0,
      location: 'Hinjewadi, Pune',
      setbacks: { front: 4, rear: 2.5, left: 2.5, right: 2.5 },
    };

    const sampleDesign2 = generateArchitecturalDesign({
      plot: samplePlot2,
      family: { totalMembers: 3, adults: 2, children: 1, elderly: 0, frequentGuests: false },
      requirements: {
        bedrooms: 2,
        masterBedrooms: 1,
        childrenRooms: 1,
        guestRooms: 0,
        bathrooms: 2,
        attachedBaths: 1,
        kitchen: true,
        livingRoom: true,
        diningRoom: true,
        studyRoom: false,
        poojaRoom: true,
        storeRoom: false,
        utilityRoom: true,
        balconies: 1,
        terrace: true,
        garden: false,
        parkingBays: 1,
        servantQuarter: false,
      },
      budget: { totalBudget: 2400000 },
      style: 'Minimalist',
      preferences: {
        vastuPriority: 'Medium',
        naturalLighting: 'Maximized',
        crossVentilation: 'Maximized',
        privacyLevel: 'Medium',
        accessibilityForElderly: false,
        futureExpansionReady: true,
      },
      floorsCount: 1,
    });

    const project2: Project = {
      id: 'proj_25x40_urban',
      userId: demoUser.id,
      name: 'Compact 2BHK Urban Smart Home',
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
      status: 'Generated',
      plot: samplePlot2,
      family: { totalMembers: 3, adults: 2, children: 1, elderly: 0, frequentGuests: false },
      requirements: {
        bedrooms: 2,
        masterBedrooms: 1,
        childrenRooms: 1,
        guestRooms: 0,
        bathrooms: 2,
        attachedBaths: 1,
        kitchen: true,
        livingRoom: true,
        diningRoom: true,
        studyRoom: false,
        poojaRoom: true,
        storeRoom: false,
        utilityRoom: true,
        balconies: 1,
        terrace: true,
        garden: false,
        parkingBays: 1,
        servantQuarter: false,
      },
      budget: { totalBudget: 2400000 },
      style: 'Minimalist',
      preferences: {
        vastuPriority: 'Medium',
        naturalLighting: 'Maximized',
        crossVentilation: 'Maximized',
        privacyLevel: 'Medium',
        accessibilityForElderly: false,
        futureExpansionReady: true,
      },
      totalFloors: 1,
      floors: sampleDesign2.floors,
      vastuReport: sampleDesign2.vastuReport,
      budgetReport: sampleDesign2.budgetReport,
      spaceEfficiencyScore: sampleDesign2.spaceEfficiencyScore,
      ventilationScore: sampleDesign2.ventilationScore,
      lightingScore: sampleDesign2.lightingScore,
      overallScore: sampleDesign2.overallScore,
      alternatives: sampleDesign2.alternatives,
      selectedAlternative: 'A',
      versions: [
        {
          versionNumber: 1,
          name: 'Version 1: Compact Single Floor Concept',
          timestamp: new Date(Date.now() - 12 * 86400000).toISOString(),
          changesSummary: 'Optimized 2BHK layout for 25x40 plot with open kitchenette.',
          estimatedCost: 2280000,
          vastuScore: 88,
          spaceEfficiency: 93,
          designData: { floors: sampleDesign2.floors, plot: samplePlot2 },
        },
      ],
    };

    this.projects.set(project2.id, project2);
  }

  // Users
  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.get(email);
  }

  saveUser(user: User): User {
    this.users.set(user.id, user);
    this.users.set(user.email, user);
    return user;
  }

  // Projects
  getAllProjects(): Project[] {
    return Array.from(this.projects.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.get(id);
  }

  saveProject(project: Project): Project {
    project.updatedAt = new Date().toISOString();
    this.projects.set(project.id, project);
    return project;
  }

  deleteProject(id: string): boolean {
    return this.projects.delete(id);
  }

  // Materials
  getMaterials(category?: string, query?: string): MaterialItem[] {
    let list = this.materials;
    if (category && category !== 'All') {
      list = list.filter((m) => m.category.toLowerCase() === category.toLowerCase());
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (m) =>
          m.brand.toLowerCase().includes(q) ||
          m.productName.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
      );
    }
    return list;
  }
}

export const db = new HomeGenieDatabase();
