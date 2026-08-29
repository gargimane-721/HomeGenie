import { z } from 'zod';

// Plot schema
export const PlotSchema = z.object({
  width: z.number().min(10, 'Width must be at least 10 ft').max(300),
  length: z.number().min(10, 'Length must be at least 10 ft').max(300),
  unit: z.enum(['ft', 'm']).default('ft'),
  totalArea: z.number().optional(),
  roadDirection: z.enum(['North', 'East', 'South', 'West', 'North-East', 'North-West', 'South-East', 'South-West']).default('North'),
});

// Furniture schema
export const CadFurnitureSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  rotation: z.number().default(0),
});

// Door and Window schemas
export const CadDoorSchema = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  wallId: z.string(),
  swingDirection: z.enum(['inward-left', 'inward-right', 'outward-left', 'outward-right']).default('inward-left'),
});

export const CadWindowSchema = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  wallId: z.string(),
});

// CadRoom schema
export const CadRoomSchema = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  area: z.number(),
  directionZone: z.string().optional(),
  furniture: z.array(CadFurnitureSchema).default([]),
  doors: z.array(CadDoorSchema).default([]),
  windows: z.array(CadWindowSchema).default([]),
});

// CadWall schema
export const CadWallSchema = z.object({
  id: z.string(),
  x1: z.number(),
  y1: z.number(),
  x2: z.number(),
  y2: z.number(),
  thickness: z.number().default(0.75),
  isExternal: z.boolean().default(false),
});

// Floor Layout schema
export const FloorLayoutSchema = z.object({
  floorNumber: z.number(),
  name: z.string(),
  builtUpArea: z.number(),
  rooms: z.array(CadRoomSchema),
  walls: z.array(CadWallSchema),
});

// Home DNA schema
export const HomeDnaSchema = z.object({
  architecture: z.string().default('Modern'),
  familySize: z.number().default(4),
  budget: z.number().default(3500000),
  style: z.string().default('Contemporary'),
  sustainabilityPriority: z.boolean().default(true),
  vastuPreference: z.boolean().default(true),
  petFriendly: z.boolean().default(false),
  climateZone: z.string().default('Tropical / Composite'),
});

// Sustainability Report schema
export const SustainabilityReportSchema = z.object({
  energyScore: z.number().min(0).max(100),
  ventilationScore: z.number().min(0).max(100),
  lightingScore: z.number().min(0).max(100),
  waterScore: z.number().min(0).max(100),
  solarScore: z.number().min(0).max(100),
  materialScore: z.number().min(0).max(100),
  overallScore: z.number().min(0).max(100),
  recommendations: z.array(z.string()),
});

// Complete Project schema
export const ProjectDesignSchema = z.object({
  name: z.string(),
  plot: PlotSchema,
  floors: z.array(FloorLayoutSchema),
  homeDna: HomeDnaSchema.optional(),
  totalBuiltUpArea: z.number().optional(),
});
