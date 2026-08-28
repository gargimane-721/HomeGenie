import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { generateArchitecturalDesign } from './server/designEngine';
import { analyzeProjectVastu } from './server/vastuEngine';
import { calculateConstructionBudget } from './server/budgetEngine';
import { FURNITURE_CATALOG } from './server/furnitureCatalog';
import { processAiPlanModification } from './server/geminiService';
import { Project, User } from './src/types';

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
