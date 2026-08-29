import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { generateArchitecturalDesign } from './server/designEngine';
import { analyzeProjectVastu } from './server/vastuEngine';
import { calculateConstructionBudget } from './server/budgetEngine';
import { FURNITURE_CATALOG } from './server/furnitureCatalog';
import {
  processAiPlanModification,
  processHomeGenieChat,
  processApplianceImageAnalysis,
} from './server/geminiService';
import {
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
} from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'HomeGenie Architectural API', timestamp: new Date().toISOString() });
  });

  // --- AUTHENTICATION APIS ---
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, phone, city, password } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      phone: phone || '',
      city: city || 'Bengaluru, India',
      unitPreference: 'sqft',
      currency: 'INR',
      vastuPreference: 'Strict',
      createdAt: new Date().toISOString(),
    };
    db.saveUser(newUser);
    res.json({ user: newUser, token: `hg_token_${newUser.id}` });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email } = req.body;
    const user = db.getUserByEmail(email) || db.getUserById('usr_demo_1');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ user, token: `hg_token_${user.id}` });
  });

  // --- USER PROFILE APIS ---
  app.get('/api/user/profile', (req: Request, res: Response) => {
    const user = db.getUserById('usr_demo_1');
    res.json(user);
  });

  app.put('/api/user/profile', (req: Request, res: Response) => {
    const updates = req.body;
    const existing = db.getUserById('usr_demo_1');
    if (!existing) return res.status(404).json({ error: 'User not found' });
    const updated = { ...existing, ...updates };
    db.saveUser(updated);
    res.json(updated);
  });

  // --- PROJECT MANAGEMENT APIS ---
  app.get('/api/projects', (req: Request, res: Response) => {
    const projects = db.getAllProjects();
    res.json(projects);
  });

  app.get('/api/projects/:id', (req: Request, res: Response) => {
    const project = db.getProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  });

  app.post('/api/projects', (req: Request, res: Response) => {
    const projectData = req.body as Partial<Project>;
    if (!projectData.name || !projectData.plot) {
      return res.status(400).json({ error: 'Project name and plot details are required' });
    }

    const floorsCount = projectData.totalFloors || 2;
    const design = generateArchitecturalDesign({
      plot: projectData.plot!,
      family: projectData.family || { totalMembers: 4, adults: 2, children: 1, elderly: 1, frequentGuests: true },
      requirements: projectData.requirements || {
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
      budget: projectData.budget || { totalBudget: 3500000 },
      style: projectData.style || 'Modern',
      preferences: projectData.preferences || {
        vastuPriority: 'High',
        naturalLighting: 'Maximized',
        crossVentilation: 'Maximized',
        privacyLevel: 'High',
        accessibilityForElderly: true,
        futureExpansionReady: true,
      },
      floorsCount,
    });

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      userId: 'usr_demo_1',
      name: projectData.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Generated',
      plot: projectData.plot!,
      family: projectData.family || { totalMembers: 4, adults: 2, children: 1, elderly: 1, frequentGuests: true },
      requirements: projectData.requirements || {
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
      budget: projectData.budget || { totalBudget: 3500000 },
      style: projectData.style || 'Modern',
      preferences: projectData.preferences || {
        vastuPriority: 'High',
        naturalLighting: 'Maximized',
        crossVentilation: 'Maximized',
        privacyLevel: 'High',
        accessibilityForElderly: true,
        futureExpansionReady: true,
      },
      totalFloors: floorsCount,
      floors: design.floors,
      vastuReport: design.vastuReport,
      budgetReport: design.budgetReport,
      spaceEfficiencyScore: design.spaceEfficiencyScore,
      ventilationScore: design.ventilationScore,
      lightingScore: design.lightingScore,
      overallScore: design.overallScore,
      alternatives: design.alternatives,
      selectedAlternative: 'A',
      versions: [
        {
          versionNumber: 1,
          name: 'Version 1: Initial AI Generation',
          timestamp: new Date().toISOString(),
          changesSummary: 'Initial floor plan and CAD geometry created.',
          estimatedCost: design.budgetReport.totalEstimatedCost,
          vastuScore: design.vastuReport.score,
          spaceEfficiency: design.spaceEfficiencyScore,
          designData: { floors: design.floors, plot: projectData.plot! },
        },
      ],
    };

    db.saveProject(newProject);
    res.status(201).json(newProject);
  });

  app.put('/api/projects/:id', (req: Request, res: Response) => {
    const existing = db.getProjectById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Project not found' });
    const updated = { ...existing, ...req.body, id: existing.id };
    db.saveProject(updated);
    res.json(updated);
  });

  app.delete('/api/projects/:id', (req: Request, res: Response) => {
    const success = db.deleteProject(req.params.id);
    if (!success) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true, message: 'Project deleted' });
  });

  // --- DESIGN GENERATION & OPTIMIZATION APIS ---
  app.post('/api/design/generate', (req: Request, res: Response) => {
    const { plot, family, requirements, budget, style, preferences, floorsCount } = req.body;
    const design = generateArchitecturalDesign({
      plot,
      family,
      requirements,
      budget,
      style,
      preferences,
      floorsCount: floorsCount || 2,
    });
    res.json(design);
  });

  app.post('/api/design/optimize', (req: Request, res: Response) => {
    const { project, targetOptimization } = req.body;
    // Regenerate tailored alternatives
    const design = generateArchitecturalDesign({
      plot: project.plot,
      family: project.family,
      requirements: project.requirements,
      budget: project.budget,
      style: project.style,
      preferences: project.preferences,
      floorsCount: project.totalFloors,
      alternativeType: targetOptimization || 'B',
    });
    res.json(design);
  });

  // --- VASTU APIS ---
  app.post('/api/vastu/analyze', (req: Request, res: Response) => {
    const { rooms, plot } = req.body;
    const report = analyzeProjectVastu(rooms, plot);
    res.json(report);
  });

  app.get('/api/vastu/:projectId', (req: Request, res: Response) => {
    const project = db.getProjectById(req.params.projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project.vastuReport);
  });

  // --- BUDGET & COST ESTIMATION APIS ---
  app.post('/api/budget/calculate', (req: Request, res: Response) => {
    const { totalBuiltUpArea, floorsCount, bathroomsCount, bedroomsCount, tier, userBudget, appliedSavings } = req.body;
    const report = calculateConstructionBudget({
      totalBuiltUpArea,
      floorsCount: floorsCount || 2,
      bathroomsCount: bathroomsCount || 3,
      bedroomsCount: bedroomsCount || 3,
      tier: tier || 'Standard',
      userBudget: userBudget || { totalBudget: 3500000 },
      appliedSavings,
    });
    res.json(report);
  });

  app.post('/api/budget/optimize', (req: Request, res: Response) => {
    const { totalBuiltUpArea, floorsCount, bathroomsCount, bedroomsCount, tier, userBudget, appliedSavings } = req.body;
    const report = calculateConstructionBudget({
      totalBuiltUpArea,
      floorsCount: floorsCount || 2,
      bathroomsCount: bathroomsCount || 3,
      bedroomsCount: bedroomsCount || 3,
      tier: tier || 'Standard',
      userBudget: userBudget || { totalBudget: 3500000 },
      appliedSavings: appliedSavings || ['opt_windows', 'opt_flooring', 'opt_circulation', 'opt_sanitary', 'opt_furniture'],
    });
    res.json(report);
  });

  // --- MATERIALS & BRANDS APIS ---
  app.get('/api/materials', (req: Request, res: Response) => {
    const category = req.query.category as string | undefined;
    const search = req.query.q as string | undefined;
    const materials = db.getMaterials(category, search);
    res.json(materials);
  });

  app.get('/api/materials/compare', (req: Request, res: Response) => {
    const category = (req.query.category as string) || 'Flooring';
    const items = db.getMaterials(category);
    res.json({
      category,
      economy: items.filter((i) => i.qualityLevel === 'Economy'),
      standard: items.filter((i) => i.qualityLevel === 'Standard'),
      premium: items.filter((i) => i.qualityLevel === 'Premium'),
    });
  });

  // --- FURNITURE APIS ---
  app.get('/api/furniture', (req: Request, res: Response) => {
    const roomType = req.query.roomType as string | undefined;
    let list = FURNITURE_CATALOG;
    if (roomType) {
      list = list.filter((f) => f.suitableRooms.includes(roomType));
    }
    res.json(list);
  });

  // --- AI CONVERSATIONAL PLAN MODIFICATION API ---
  app.post('/api/ai/modify-plan', async (req: Request, res: Response) => {
    const { userMessage, project } = req.body;
    if (!userMessage || !project) {
      return res.status(400).json({ error: 'userMessage and project are required' });
    }
    const result = await processAiPlanModification({ userMessage, project });
    res.json(result);
  });

  // --- DESIGN VERSION CONTROL ---
  app.post('/api/projects/:id/versions', (req: Request, res: Response) => {
    const project = db.getProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    const { name, changesSummary } = req.body;

    const newVersionNumber = (project.versions?.length || 0) + 1;
    const newVersion = {
      versionNumber: newVersionNumber,
      name: name || `Version ${newVersionNumber}: Custom Modification`,
      timestamp: new Date().toISOString(),
      changesSummary: changesSummary || 'Updated CAD room geometry & specifications.',
      estimatedCost: project.budgetReport?.totalEstimatedCost || project.budget.totalBudget,
      vastuScore: project.vastuReport?.score || 87,
      spaceEfficiency: project.spaceEfficiencyScore || 91,
      designData: {
        floors: project.floors,
        plot: project.plot,
      },
    };

    project.versions = [...(project.versions || []), newVersion];
    db.saveProject(project);
    res.json(newVersion);
  });

  // Restore project version
  app.post('/api/projects/:id/restore', (req: Request, res: Response) => {
    const project = db.getProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    const { versionNumber } = req.body;
    const targetVersion = project.versions?.find((v) => v.versionNumber === versionNumber);
    if (!targetVersion) return res.status(404).json({ error: 'Version not found' });

    if (targetVersion.designData?.floors) {
      project.floors = targetVersion.designData.floors;
    }
    project.updatedAt = new Date().toISOString();
    db.saveProject(project);
    res.json(project);
  });

  // --- ADDITIONAL SPECIFIED AI AGENT APIS ---
  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    const { message, project } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    const result = await processAiPlanModification({ userMessage: message, project });
    res.json({
      reply: result.reply,
      suggestedAction: result.suggestedAction,
      targetRoomName: result.targetRoomName,
      areaDeltaSqFt: result.areaDeltaSqFt,
      costDeltaInr: result.costDeltaInr,
      technicalAnalysis: result.technicalAnalysis,
    });
  });

  app.post('/api/ai/floor-plan', (req: Request, res: Response) => {
    const { plot, requirements, budget, style, floorsCount, family, preferences } = req.body;
    const design = generateArchitecturalDesign({
      plot: plot || { width: 30, length: 40, unit: 'ft', totalArea: 1200, roadDirection: 'North' },
      family: family || { totalMembers: 4, adults: 2, children: 1, elderly: 1, frequentGuests: true },
      requirements: requirements || { bedrooms: 3, bathrooms: 3, kitchen: true, livingRoom: true, diningRoom: true, balconies: 2 },
      budget: budget || { totalBudget: 3500000 },
      style: style || 'Modern',
      preferences: preferences || { vastuPriority: 'High', naturalLighting: 'Maximized', crossVentilation: 'Maximized', privacyLevel: 'High', accessibilityForElderly: true, futureExpansionReady: true },
      floorsCount: floorsCount || 2,
    });
    res.json(design);
  });

  app.post('/api/ai/sustainability', (req: Request, res: Response) => {
    const { plot, floors, location } = req.body;
    const report = {
      energyScore: 84,
      ventilationScore: 89,
      lightingScore: 92,
      waterScore: 78,
      solarScore: 91,
      materialScore: 86,
      overallScore: 87,
      solarRoofAreaSqft: Math.round((plot?.width || 30) * (plot?.length || 40) * 0.7),
      annualSolarGenerationKwh: 4800,
      annualRainwaterHarvestingLiters: 92000,
      recommendations: [
        'Install 4.5 kW rooftop solar PV system for 85% electricity offset.',
        'Rainwater harvesting storage sump with dual recharge ground pits.',
        'Fly-ash AAC masonry blocks with double glazed UPVC windows.',
        'Optimal North-East orientation for natural daylighting.',
      ],
    };
    res.json(report);
  });

  app.post('/api/ai/boq', (req: Request, res: Response) => {
    const { totalBuiltUpArea, tier } = req.body;
    const area = totalBuiltUpArea || 2200;
    const boq = [
      { category: 'Civil & Structure', material: 'Cement (OPC/PPC 53 Grade)', quantity: Math.round(area * 0.4), unit: 'Bags', rate: 410, estimatedCost: Math.round(area * 0.4 * 410) },
      { category: 'Civil & Structure', material: 'Fe550D TMT Steel Rebars', quantity: Number((area * 0.0038).toFixed(2)), unit: 'MT', rate: 68000, estimatedCost: Math.round(area * 0.0038 * 68000) },
      { category: 'Civil & Structure', material: 'AAC Masonry Blocks (6")', quantity: Math.round(area * 1.8), unit: 'Nos', rate: 72, estimatedCost: Math.round(area * 1.8 * 72) },
      { category: 'Flooring', material: 'Vitrified Glazed Tiles (4x2 ft)', quantity: Math.round(area * 0.85), unit: 'Sq.Ft', rate: 95, estimatedCost: Math.round(area * 0.85 * 95) },
      { category: 'Electrical', material: 'FRLS Copper Wiring & MCBs', quantity: 1, unit: 'Lot', rate: Math.round(area * 140), estimatedCost: Math.round(area * 140) },
      { category: 'Plumbing', material: 'CPVC/SWR Pipes & Sanitaryware', quantity: 1, unit: 'Lot', rate: Math.round(area * 120), estimatedCost: Math.round(area * 120) },
      { category: 'Doors & Windows', material: 'Teak Main Door & UPVC Windows', quantity: 1, unit: 'Lot', rate: Math.round(area * 165), estimatedCost: Math.round(area * 165) },
    ];
    const totalCost = boq.reduce((acc, item) => acc + item.estimatedCost, 0);
    res.json({ items: boq, totalCost, currency: 'INR' });
  });

  // =========================================================
  // SMART HOME, APPLIANCE & MAINTENANCE API ENDPOINTS
  // =========================================================

  // --- HOMES ---
  app.get('/api/homes', (req: Request, res: Response) => {
    const userId = req.query.userId as string | undefined;
    const homes = db.getHomes(userId);
    res.json(homes);
  });

  app.post('/api/homes', (req: Request, res: Response) => {
    const { name, address, city, state, country, postal_code, home_type, description, plot_width, plot_length, user_id } = req.body;
    if (!name) return res.status(400).json({ error: 'Home name is required' });

    const newHome: Home = {
      id: `home_${Date.now()}`,
      user_id: user_id || 'usr_demo_1',
      name,
      address: address || '',
      city: city || 'Bengaluru',
      state: state || 'Karnataka',
      country: country || 'India',
      postal_code: postal_code || '',
      home_type: home_type || 'Independent Villa',
      description: description || '',
      plot_width: plot_width ? Number(plot_width) : 30,
      plot_length: plot_length ? Number(plot_length) : 50,
      plot_area: (plot_width && plot_length) ? Number(plot_width) * Number(plot_length) : 1500,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const saved = db.saveHome(newHome);

    // Auto-create initial default rooms for smooth onboarding
    const defaultRooms = [
      { name: 'Living Room', room_type: 'living_room', floor: 'Ground Floor' },
      { name: 'Modular Kitchen', room_type: 'kitchen', floor: 'Ground Floor' },
      { name: 'Master Bedroom', room_type: 'bedroom', floor: 'First Floor' },
    ];
    defaultRooms.forEach((dr) => {
      db.saveRoom({
        id: `room_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        home_id: saved.id,
        name: dr.name,
        room_type: dr.room_type,
        floor: dr.floor,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    });

    res.status(201).json(db.getHomeById(saved.id));
  });

  app.get('/api/homes/:id', (req: Request, res: Response) => {
    const home = db.getHomeById(req.params.id);
    if (!home) return res.status(404).json({ error: 'Home not found' });
    res.json(home);
  });

  app.patch('/api/homes/:id', (req: Request, res: Response) => {
    const existing = db.getHomeById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Home not found' });
    const updated = db.saveHome({ ...existing, ...req.body });
    res.json(updated);
  });

  app.delete('/api/homes/:id', (req: Request, res: Response) => {
    const deleted = db.deleteHome(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Home not found' });
    res.json({ success: true, message: 'Home deleted successfully' });
  });

  // --- ROOMS ---
  app.get('/api/rooms', (req: Request, res: Response) => {
    const homeId = (req.query.home_id || req.query.homeId) as string;
    if (!homeId) return res.status(400).json({ error: 'home_id query parameter is required' });
    res.json(db.getRoomsByHome(homeId));
  });

  app.post('/api/rooms', (req: Request, res: Response) => {
    const { home_id, name, room_type, floor, description } = req.body;
    if (!home_id || !name) return res.status(400).json({ error: 'home_id and name are required' });

    const newRoom: HomeRoom = {
      id: `room_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      home_id,
      name,
      room_type: room_type || 'other',
      floor: floor || 'Ground Floor',
      description: description || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const saved = db.saveRoom(newRoom);
    res.status(201).json(saved);
  });

  app.patch('/api/rooms/:id', (req: Request, res: Response) => {
    const room = db.getRoomsByHome(req.body.home_id || '').find((r) => r.id === req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    const updated = db.saveRoom({ ...room, ...req.body });
    res.json(updated);
  });

  app.delete('/api/rooms/:id', (req: Request, res: Response) => {
    const deleted = db.deleteRoom(req.params.id);
    res.json({ success: deleted });
  });

  // --- APPLIANCES ---
  app.get('/api/appliances', (req: Request, res: Response) => {
    const homeId = (req.query.home_id || req.query.homeId) as string;
    if (!homeId) {
      // return all appliances across first home if none provided
      const firstHome = db.getHomes()[0];
      if (firstHome) return res.json(db.getAppliancesByHome(firstHome.id));
      return res.json([]);
    }
    res.json(db.getAppliancesByHome(homeId));
  });

  app.get('/api/appliances/:id', (req: Request, res: Response) => {
    const appliance = db.getApplianceById(req.params.id);
    if (!appliance) return res.status(404).json({ error: 'Appliance not found' });
    res.json(appliance);
  });

  app.post('/api/appliances', (req: Request, res: Response) => {
    const { home_id, room_id, name, category, brand, model, serial_number, purchase_date, warranty_expiry, energy_rating, power_consumption, notes } = req.body;
    if (!home_id || !name || !category) {
      return res.status(400).json({ error: 'home_id, name and category are required' });
    }

    const newAppliance: Appliance = {
      id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      home_id,
      room_id: room_id || null,
      name,
      category,
      brand: brand || '',
      model: model || '',
      serial_number: serial_number || '',
      purchase_date: purchase_date || new Date().toISOString().split('T')[0],
      warranty_expiry: warranty_expiry || '',
      status: 'active',
      energy_rating: energy_rating || '3-Star',
      power_consumption: power_consumption ? Number(power_consumption) : 500,
      notes: notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const saved = db.saveAppliance(newAppliance);
    res.status(201).json(saved);
  });

  app.patch('/api/appliances/:id', (req: Request, res: Response) => {
    const existing = db.getApplianceById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Appliance not found' });
    const updated = db.saveAppliance({ ...existing, ...req.body });
    res.json(updated);
  });

  app.delete('/api/appliances/:id', (req: Request, res: Response) => {
    const deleted = db.deleteAppliance(req.params.id);
    res.json({ success: deleted });
  });

  // --- MAINTENANCE TASKS ---
  app.get('/api/maintenance', (req: Request, res: Response) => {
    const homeId = (req.query.home_id || req.query.homeId) as string;
    if (!homeId) {
      const firstHome = db.getHomes()[0];
      if (firstHome) return res.json(db.getMaintenanceTasksByHome(firstHome.id));
      return res.json([]);
    }
    res.json(db.getMaintenanceTasksByHome(homeId));
  });

  app.post('/api/maintenance', (req: Request, res: Response) => {
    const { home_id, appliance_id, title, description, priority, due_date, user_id } = req.body;
    if (!home_id || !title) {
      return res.status(400).json({ error: 'home_id and title are required' });
    }

    const newTask: MaintenanceTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      home_id,
      appliance_id: appliance_id || null,
      user_id: user_id || 'usr_demo_1',
      title,
      description: description || '',
      priority: priority || 'medium',
      status: 'pending',
      due_date: due_date || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const saved = db.saveMaintenanceTask(newTask);
    res.status(201).json(saved);
  });

  app.patch('/api/maintenance/:id', (req: Request, res: Response) => {
    const homeId = req.body.home_id || db.getHomes()[0]?.id || '';
    const existing = db.getMaintenanceTasksByHome(homeId).find((t) => t.id === req.params.id);
    if (!existing) return res.status(404).json({ error: 'Maintenance task not found' });
    const updated = db.saveMaintenanceTask({ ...existing, ...req.body });
    res.json(updated);
  });

  app.post('/api/maintenance/:id/complete', (req: Request, res: Response) => {
    const homeId = req.body.home_id || db.getHomes()[0]?.id || '';
    const existing = db.getMaintenanceTasksByHome(homeId).find((t) => t.id === req.params.id);
    if (!existing) return res.status(404).json({ error: 'Maintenance task not found' });
    const updated = db.saveMaintenanceTask({
      ...existing,
      status: 'completed',
      completed_at: new Date().toISOString(),
    });
    res.json(updated);
  });

  app.delete('/api/maintenance/:id', (req: Request, res: Response) => {
    const deleted = db.deleteMaintenanceTask(req.params.id);
    res.json({ success: deleted });
  });

  // --- ENERGY RECORDS ---
  app.get('/api/energy', (req: Request, res: Response) => {
    const homeId = (req.query.home_id || req.query.homeId) as string || db.getHomes()[0]?.id || '';
    res.json(db.getEnergyRecords(homeId));
  });

  app.post('/api/energy', (req: Request, res: Response) => {
    const { home_id, appliance_id, appliance_name, energy_consumption, user_id } = req.body;
    if (!home_id || energy_consumption === undefined) {
      return res.status(400).json({ error: 'home_id and energy_consumption are required' });
    }
    const newRecord: EnergyRecord = {
      id: `en_${Date.now()}`,
      home_id,
      user_id: user_id || 'usr_demo_1',
      appliance_id: appliance_id || null,
      appliance_name: appliance_name || 'General Device',
      energy_consumption: Number(energy_consumption),
      unit: 'kWh',
      recorded_at: new Date().toISOString(),
    };
    const saved = db.addEnergyRecord(newRecord);
    res.status(201).json(saved);
  });

  // --- AI RECOMMENDATIONS ---
  app.get('/api/ai/recommendations', (req: Request, res: Response) => {
    const homeId = (req.query.home_id || req.query.homeId) as string;
    res.json(db.getRecommendations(homeId));
  });

  app.post('/api/ai/recommendations/:id/status', (req: Request, res: Response) => {
    const { status } = req.body;
    const recs = db.getRecommendations();
    const target = recs.find((r) => r.id === req.params.id);
    if (!target) return res.status(404).json({ error: 'Recommendation not found' });
    target.status = status || 'completed';
    db.saveRecommendation(target);
    res.json(target);
  });

  // --- HOME GENIE SMART ASSISTANT CHAT ---
  app.post('/api/ai/home-chat', async (req: Request, res: Response) => {
    const { message, home_id, user_id, conversation_id } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const targetHomeId = home_id || db.getHomes()[0]?.id || 'home_villa_bengaluru';
    const targetHome = db.getHomeById(targetHomeId);
    const appliances = db.getAppliancesByHome(targetHomeId);
    const tasks = db.getMaintenanceTasksByHome(targetHomeId);
    const energy = db.getEnergyRecords(targetHomeId);

    const convoId = conversation_id || 'convo_initial';
    const history = db.getConversationMessages(convoId);

    // Record user message
    db.addMessage({
      id: `msg_${Date.now()}_u`,
      conversation_id: convoId,
      user_id: user_id || 'usr_demo_1',
      role: 'user',
      content: message,
      created_at: new Date().toISOString(),
    });

    const aiResponse = await processHomeGenieChat({
      userMessage: message,
      home: targetHome,
      appliances,
      maintenanceTasks: tasks,
      energyRecords: energy,
      conversationHistory: history.map((m) => ({ role: m.role, content: m.content })),
    });

    // Record assistant message
    const botMsg: AIMessage = {
      id: `msg_${Date.now()}_a`,
      conversation_id: convoId,
      user_id: user_id || 'usr_demo_1',
      role: 'assistant',
      content: aiResponse.reply,
      metadata: {
        suggestedActions: aiResponse.suggestedActions,
        referencedAppliances: aiResponse.referencedAppliances,
      },
      created_at: new Date().toISOString(),
    };
    db.addMessage(botMsg);

    res.json({
      reply: aiResponse.reply,
      suggestedActions: aiResponse.suggestedActions,
      messageId: botMsg.id,
      conversationId: convoId,
    });
  });

  // --- VISION SCAN (IMAGE ANALYSIS) ---
  app.post('/api/ai/vision-scan', async (req: Request, res: Response) => {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }
    const result = await processApplianceImageAnalysis(imageBase64, mimeType || 'image/jpeg');
    res.json(result);
  });

  // --- DASHBOARD OVERVIEW STATS ---
  app.get('/api/stats/dashboard', (req: Request, res: Response) => {
    const homeId = (req.query.home_id || req.query.homeId) as string || db.getHomes()[0]?.id || '';
    const homes = db.getHomes();
    const rooms = db.getRoomsByHome(homeId);
    const appliances = db.getAppliancesByHome(homeId);
    const tasks = db.getMaintenanceTasksByHome(homeId);
    const recs = db.getRecommendations(homeId);
    const energy = db.getEnergyRecords(homeId);

    const pendingTasks = tasks.filter((t) => t.status !== 'completed');
    const activeWarranties = appliances.filter((a) => a.warranty_status === 'active');
    const expiringWarranties = appliances.filter((a) => a.warranty_status === 'expiring_soon');
    const totalKwh = energy.reduce((sum, e) => sum + (Number(e.energy_consumption) || 0), 0);

    res.json({
      totalHomes: homes.length,
      totalRooms: rooms.length,
      totalAppliances: appliances.length,
      pendingTasksCount: pendingTasks.length,
      activeWarrantiesCount: activeWarranties.length,
      expiringWarrantiesCount: expiringWarranties.length,
      monthlyEstimatedKwh: Number((totalKwh * 4.2).toFixed(1)),
      recommendationsCount: recs.filter((r) => r.status === 'new').length,
    });
  });

  // Upload endpoint
  app.post('/api/upload', (req: Request, res: Response) => {
    res.json({
      success: true,
      fileUrl: '/uploads/sample_plan.png',
      message: 'Plan uploaded successfully. AI Vision scanner ready.',
    });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HomeGenie Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
