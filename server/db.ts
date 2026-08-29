import {
  MaterialItem,
  Project,
  User,
  Home,
  HomeRoom,
  Appliance,
  MaintenanceTask,
  AIRecommendation,
  EnergyRecord,
  AIConversation,
  AIMessage,
} from '../src/types';
import { INITIAL_MATERIALS } from './materialsCatalog';
import { generateArchitecturalDesign } from './designEngine';

export class HomeGenieDatabase {
  private users: Map<string, User> = new Map();
  private projects: Map<string, Project> = new Map();
  private materials: MaterialItem[] = [...INITIAL_MATERIALS];
  
  // Smart Home Management Collections
  private homes: Map<string, Home> = new Map();
  private rooms: Map<string, HomeRoom> = new Map();
  private appliances: Map<string, Appliance> = new Map();
  private maintenanceTasks: Map<string, MaintenanceTask> = new Map();
  private aiRecommendations: Map<string, AIRecommendation> = new Map();
  private energyRecords: Map<string, EnergyRecord> = new Map();
  private aiConversations: Map<string, AIConversation> = new Map();
  private aiMessages: Map<string, AIMessage[]> = new Map();

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

    // Seed default Smart Home
    const sampleHome: Home = {
      id: 'home_villa_bengaluru',
      user_id: demoUser.id,
      name: 'Palm Meadows Villa 42',
      address: 'Plot 42, Varthur Main Road, Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      postal_code: '560066',
      home_type: 'G+1 Independent Villa',
      description: 'Modern 3BHK sustainable home with smart solar and inverter backup.',
      plot_width: 30,
      plot_length: 50,
      plot_area: 1500,
      created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.homes.set(sampleHome.id, sampleHome);

    // Seed Home Rooms
    const sampleRooms: HomeRoom[] = [
      {
        id: 'room_living',
        home_id: sampleHome.id,
        name: 'Living Room',
        room_type: 'living_room',
        floor: 'Ground Floor',
        description: 'Spacious North-East facing double-height lounge',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'room_kitchen',
        home_id: sampleHome.id,
        name: 'Modular Kitchen',
        room_type: 'kitchen',
        floor: 'Ground Floor',
        description: 'South-East Agneya zone modular kitchen with chimney and induction',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'room_master_bed',
        home_id: sampleHome.id,
        name: 'Master Suite',
        room_type: 'bedroom',
        floor: 'First Floor',
        description: 'South-West Nairutya zone master bedroom with private balcony',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'room_utility',
        home_id: sampleHome.id,
        name: 'Utility & Laundry',
        room_type: 'utility',
        floor: 'Ground Floor',
        description: 'Covered washing and dishwashing zone',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    sampleRooms.forEach((r) => this.rooms.set(r.id, r));

    // Seed Appliances with real-world warranty calculations
    const now = Date.now();
    const sampleAppliances: Appliance[] = [
      {
        id: 'app_hvac_living',
        home_id: sampleHome.id,
        room_id: 'room_living',
        name: 'Daikin 1.5 Ton 5-Star Inverter AC',
        category: 'HVAC / Air Conditioner',
        brand: 'Daikin',
        model: 'FTKM50U',
        serial_number: 'DK-2023-88941',
        purchase_date: '2023-04-10',
        warranty_expiry: new Date(now + 240 * 86400000).toISOString().split('T')[0], // Active
        status: 'active',
        energy_rating: '5-Star BEE',
        power_consumption: 1100,
        notes: 'Pre-filters cleaned 2 months ago. PM 2.5 filter in good condition.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        warranty_status: 'active',
      },
      {
        id: 'app_refrigerator',
        home_id: sampleHome.id,
        room_id: 'room_kitchen',
        name: 'LG 420L Double Door Smart Fridge',
        category: 'Refrigeration',
        brand: 'LG',
        model: 'GL-T432APZY',
        serial_number: 'LG-REF-9921',
        purchase_date: '2022-08-15',
        warranty_expiry: new Date(now + 20 * 86400000).toISOString().split('T')[0], // Expiring soon!
        status: 'active',
        energy_rating: '4-Star',
        power_consumption: 220,
        notes: 'Compressor warranty valid for 10 years.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        warranty_status: 'expiring_soon',
      },
      {
        id: 'app_water_purifier',
        home_id: sampleHome.id,
        room_id: 'room_kitchen',
        name: 'Kent Grand Plus RO Water Purifier',
        category: 'Water Purification',
        brand: 'Kent',
        model: 'Grand Plus UV+UF+TDS',
        serial_number: 'KT-88392-RO',
        purchase_date: '2023-01-20',
        warranty_expiry: '2024-01-20', // Expired
        status: 'needs_maintenance',
        energy_rating: 'A',
        power_consumption: 60,
        notes: 'Filter replacement alarm triggered last week. Sediment filter needs change.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        warranty_status: 'expired',
      },
      {
        id: 'app_washing_machine',
        home_id: sampleHome.id,
        room_id: 'room_utility',
        name: 'Bosch 8kg Front Load Washing Machine',
        category: 'Laundry',
        brand: 'Bosch',
        model: 'WAJ2846SIN',
        serial_number: 'BSH-77402',
        purchase_date: '2023-09-05',
        warranty_expiry: new Date(now + 380 * 86400000).toISOString().split('T')[0],
        status: 'active',
        energy_rating: '5-Star',
        power_consumption: 1800,
        notes: 'Descaling tub run scheduled for next month.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        warranty_status: 'active',
      },
    ];
    sampleAppliances.forEach((a) => this.appliances.set(a.id, a));

    // Seed Maintenance Tasks
    const sampleTasks: MaintenanceTask[] = [
      {
        id: 'task_kent_filter',
        appliance_id: 'app_water_purifier',
        appliance_name: 'Kent Grand Plus RO Water Purifier',
        home_id: sampleHome.id,
        user_id: demoUser.id,
        title: 'Replace RO Carbon & Sediment Filters',
        description: 'Schedule Kent technician visit to change pre-filter candle and TDS check.',
        priority: 'high',
        status: 'pending',
        due_date: new Date(now + 3 * 86400000).toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'task_ac_service',
        appliance_id: 'app_hvac_living',
        appliance_name: 'Daikin 1.5 Ton 5-Star Inverter AC',
        home_id: sampleHome.id,
        user_id: demoUser.id,
        title: 'Pre-Summer Deep Jet Wash & Gas Check',
        description: 'Clean indoor blower coil and outdoor condenser fin unit.',
        priority: 'medium',
        status: 'pending',
        due_date: new Date(now + 14 * 86400000).toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'task_fridge_defrost',
        appliance_id: 'app_refrigerator',
        appliance_name: 'LG 420L Double Door Smart Fridge',
        home_id: sampleHome.id,
        user_id: demoUser.id,
        title: 'Clean Rear Condenser Coils & Door Gasket',
        description: 'Wipe rubber door seal with warm water to prevent cold air leakage.',
        priority: 'low',
        status: 'completed',
        due_date: new Date(now - 5 * 86400000).toISOString().split('T')[0],
        completed_at: new Date(now - 4 * 86400000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    sampleTasks.forEach((t) => this.maintenanceTasks.set(t.id, t));

    // Seed AI Recommendations
    const sampleRecs: AIRecommendation[] = [
      {
        id: 'rec_solar_offset',
        user_id: demoUser.id,
        home_id: sampleHome.id,
        category: 'Energy',
        title: 'Solar Self-Consumption Peak Optimization',
        description: 'Running the Bosch washing machine between 11:30 AM and 2:30 PM will consume 100% free rooftop solar energy, saving approx ₹420/month.',
        priority: 'medium',
        status: 'new',
        created_at: new Date().toISOString(),
      },
      {
        id: 'rec_warranty_alert',
        user_id: demoUser.id,
        home_id: sampleHome.id,
        category: 'Warranty',
        title: 'LG Refrigerator Comprehensive Warranty Expiring',
        description: 'Your 2-year appliance coverage expires in 20 days. Consider booking a preventive health checkup before warranty closure.',
        priority: 'high',
        status: 'new',
        created_at: new Date().toISOString(),
      },
      {
        id: 'rec_filter_maintenance',
        user_id: demoUser.id,
        home_id: sampleHome.id,
        category: 'Maintenance',
        title: 'Water TDS & RO Membrane Health',
        description: 'Replacing sediment filter on time prevents mineral scale deposition on the RO membrane, extending membrane life by 18+ months.',
        priority: 'high',
        status: 'new',
        created_at: new Date().toISOString(),
      },
    ];
    sampleRecs.forEach((r) => this.aiRecommendations.set(r.id, r));

    // Seed Energy Records (Last 7 Days)
    const sampleEnergy: EnergyRecord[] = [
      { id: 'en_1', user_id: demoUser.id, home_id: sampleHome.id, appliance_name: 'Daikin Inverter AC', energy_consumption: 6.8, unit: 'kWh', recorded_at: new Date(now - 6 * 86400000).toISOString() },
      { id: 'en_2', user_id: demoUser.id, home_id: sampleHome.id, appliance_name: 'LG Smart Fridge', energy_consumption: 1.9, unit: 'kWh', recorded_at: new Date(now - 6 * 86400000).toISOString() },
      { id: 'en_3', user_id: demoUser.id, home_id: sampleHome.id, appliance_name: 'Bosch Washer', energy_consumption: 1.2, unit: 'kWh', recorded_at: new Date(now - 5 * 86400000).toISOString() },
      { id: 'en_4', user_id: demoUser.id, home_id: sampleHome.id, appliance_name: 'Daikin Inverter AC', energy_consumption: 7.2, unit: 'kWh', recorded_at: new Date(now - 4 * 86400000).toISOString() },
      { id: 'en_5', user_id: demoUser.id, home_id: sampleHome.id, appliance_name: 'LG Smart Fridge', energy_consumption: 2.1, unit: 'kWh', recorded_at: new Date(now - 3 * 86400000).toISOString() },
      { id: 'en_6', user_id: demoUser.id, home_id: sampleHome.id, appliance_name: 'Daikin Inverter AC', energy_consumption: 6.5, unit: 'kWh', recorded_at: new Date(now - 1 * 86400000).toISOString() },
    ];
    sampleEnergy.forEach((e) => this.energyRecords.set(e.id, e));

    // Seed AI Conversation
    const sampleConvo: AIConversation = {
      id: 'convo_initial',
      user_id: demoUser.id,
      home_id: sampleHome.id,
      title: 'Appliance Health & Energy Audit',
      created_at: new Date(now - 2 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      messages_count: 2,
    };
    this.aiConversations.set(sampleConvo.id, sampleConvo);
    this.aiMessages.set(sampleConvo.id, [
      {
        id: 'msg_1',
        conversation_id: sampleConvo.id,
        user_id: demoUser.id,
        role: 'user',
        content: 'Which of my home appliances need attention or service soon?',
        created_at: new Date(now - 2 * 86400000).toISOString(),
      },
      {
        id: 'msg_2',
        conversation_id: sampleConvo.id,
        user_id: demoUser.id,
        role: 'assistant',
        content: 'Based on your home records at **Palm Meadows Villa 42**:\n\n1. **Kent Grand Plus RO Water Purifier**: Marked *Needs Maintenance* with an overdue sediment filter replacement.\n2. **LG 420L Smart Fridge**: Comprehensive 2-year warranty expires in **20 days** (2026-09-17).\n3. **Daikin 1.5T AC**: Operating in good health, but due for pre-summer jet wash in 2 weeks.',
        created_at: new Date(now - 2 * 86400000 + 4000).toISOString(),
      },
    ]);

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

  // ==========================================
  // SMART HOME & APPLIANCE DATABASE METHODS
  // ==========================================

  // Homes
  getHomes(userId?: string): Home[] {
    const list = Array.from(this.homes.values());
    if (userId) return list.filter((h) => h.user_id === userId);
    return list;
  }

  getHomeById(id: string): Home | undefined {
    const home = this.homes.get(id);
    if (!home) return undefined;
    const rooms = this.getRoomsByHome(id);
    const appliances = this.getAppliancesByHome(id);
    return { ...home, rooms, appliances };
  }

  saveHome(home: Home): Home {
    home.updated_at = new Date().toISOString();
    this.homes.set(home.id, home);
    return home;
  }

  deleteHome(id: string): boolean {
    // Cascade delete rooms, appliances, tasks
    this.getRoomsByHome(id).forEach((r) => this.rooms.delete(r.id));
    this.getAppliancesByHome(id).forEach((a) => this.appliances.delete(a.id));
    this.getMaintenanceTasksByHome(id).forEach((t) => this.maintenanceTasks.delete(t.id));
    return this.homes.delete(id);
  }

  // Rooms
  getRoomsByHome(homeId: string): HomeRoom[] {
    return Array.from(this.rooms.values())
      .filter((r) => r.home_id === homeId)
      .map((r) => ({
        ...r,
        appliances_count: Array.from(this.appliances.values()).filter((a) => a.room_id === r.id).length,
      }));
  }

  saveRoom(room: HomeRoom): HomeRoom {
    room.updated_at = new Date().toISOString();
    this.rooms.set(room.id, room);
    return room;
  }

  deleteRoom(id: string): boolean {
    // Unlink appliances from room
    this.appliances.forEach((app) => {
      if (app.room_id === id) {
        app.room_id = null;
        app.room_name = undefined;
      }
    });
    return this.rooms.delete(id);
  }

  // Appliances
  getAppliancesByHome(homeId: string): Appliance[] {
    const now = new Date();
    return Array.from(this.appliances.values())
      .filter((a) => a.home_id === homeId)
      .map((a) => {
        let warranty_status: Appliance['warranty_status'] = 'unknown';
        if (a.warranty_expiry) {
          const exp = new Date(a.warranty_expiry);
          const diffDays = (exp.getTime() - now.getTime()) / (1000 * 3600 * 24);
          if (diffDays < 0) warranty_status = 'expired';
          else if (diffDays <= 45) warranty_status = 'expiring_soon';
          else warranty_status = 'active';
        }
        const room = a.room_id ? this.rooms.get(a.room_id) : undefined;
        return {
          ...a,
          warranty_status,
          room_name: room?.name,
          maintenance_tasks: this.getMaintenanceTasksByAppliance(a.id),
        };
      });
  }

  getApplianceById(id: string): Appliance | undefined {
    const a = this.appliances.get(id);
    if (!a) return undefined;
    const now = new Date();
    let warranty_status: Appliance['warranty_status'] = 'unknown';
    if (a.warranty_expiry) {
      const exp = new Date(a.warranty_expiry);
      const diffDays = (exp.getTime() - now.getTime()) / (1000 * 3600 * 24);
      if (diffDays < 0) warranty_status = 'expired';
      else if (diffDays <= 45) warranty_status = 'expiring_soon';
      else warranty_status = 'active';
    }
    const room = a.room_id ? this.rooms.get(a.room_id) : undefined;
    return {
      ...a,
      warranty_status,
      room_name: room?.name,
      maintenance_tasks: this.getMaintenanceTasksByAppliance(a.id),
    };
  }

  saveAppliance(appliance: Appliance): Appliance {
    appliance.updated_at = new Date().toISOString();
    this.appliances.set(appliance.id, appliance);
    return this.getApplianceById(appliance.id) || appliance;
  }

  deleteAppliance(id: string): boolean {
    return this.appliances.delete(id);
  }

  // Maintenance Tasks
  getMaintenanceTasksByHome(homeId: string): MaintenanceTask[] {
    return Array.from(this.maintenanceTasks.values())
      .filter((t) => t.home_id === homeId)
      .map((t) => {
        const app = t.appliance_id ? this.appliances.get(t.appliance_id) : undefined;
        return { ...t, appliance_name: app?.name };
      })
      .sort((a, b) => {
        if (a.status === 'completed' && b.status !== 'completed') return 1;
        if (a.status !== 'completed' && b.status === 'completed') return -1;
        return new Date(a.due_date || '').getTime() - new Date(b.due_date || '').getTime();
      });
  }

  getMaintenanceTasksByAppliance(applianceId: string): MaintenanceTask[] {
    return Array.from(this.maintenanceTasks.values()).filter((t) => t.appliance_id === applianceId);
  }

  saveMaintenanceTask(task: MaintenanceTask): MaintenanceTask {
    task.updated_at = new Date().toISOString();
    this.maintenanceTasks.set(task.id, task);
    return task;
  }

  deleteMaintenanceTask(id: string): boolean {
    return this.maintenanceTasks.delete(id);
  }

  // AI Recommendations
  getRecommendations(homeId?: string): AIRecommendation[] {
    const list = Array.from(this.aiRecommendations.values());
    if (homeId) return list.filter((r) => !r.home_id || r.home_id === homeId);
    return list;
  }

  saveRecommendation(rec: AIRecommendation): AIRecommendation {
    this.aiRecommendations.set(rec.id, rec);
    return rec;
  }

  // Energy Records
  getEnergyRecords(homeId: string): EnergyRecord[] {
    return Array.from(this.energyRecords.values())
      .filter((e) => e.home_id === homeId)
      .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime());
  }

  addEnergyRecord(record: EnergyRecord): EnergyRecord {
    this.energyRecords.set(record.id, record);
    return record;
  }

  // AI Conversations & Messages
  getConversations(userId: string): AIConversation[] {
    return Array.from(this.aiConversations.values())
      .filter((c) => c.user_id === userId)
      .map((c) => ({
        ...c,
        messages_count: (this.aiMessages.get(c.id) || []).length,
      }))
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }

  getConversationMessages(conversationId: string): AIMessage[] {
    return this.aiMessages.get(conversationId) || [];
  }

  saveConversation(convo: AIConversation): AIConversation {
    convo.updated_at = new Date().toISOString();
    this.aiConversations.set(convo.id, convo);
    if (!this.aiMessages.has(convo.id)) {
      this.aiMessages.set(convo.id, []);
    }
    return convo;
  }

  addMessage(message: AIMessage): AIMessage {
    const list = this.aiMessages.get(message.conversation_id) || [];
    list.push(message);
    this.aiMessages.set(message.conversation_id, list);
    
    // Update conversation timestamp
    const convo = this.aiConversations.get(message.conversation_id);
    if (convo) {
      convo.updated_at = new Date().toISOString();
      this.aiConversations.set(convo.id, convo);
    }
    return message;
  }
}

export const db = new HomeGenieDatabase();
