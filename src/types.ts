export type Direction =
  | 'North'
  | 'North-East'
  | 'East'
  | 'South-East'
  | 'South'
  | 'South-West'
  | 'West'
  | 'North-West'
  | 'Center';

export type RoadDirection =
  | 'North'
  | 'East'
  | 'South'
  | 'West'
  | 'North-East'
  | 'North-West'
  | 'South-East'
  | 'South-West';

export type ArchitecturalStyle =
  | 'Modern'
  | 'Contemporary'
  | 'Traditional Indian'
  | 'Traditional'
  | 'Minimalist'
  | 'Kerala / Coastal'
  | 'Luxury';

export type QualityTier = 'Economy' | 'Standard' | 'Premium';

export type MaterialCategory =
  | 'Doors'
  | 'Windows'
  | 'Flooring'
  | 'Sanitary'
  | 'Plumbing'
  | 'Electrical'
  | 'Paint'
  | 'Kitchen'
  | 'Hardware'
  | 'Cement'
  | 'Steel';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  avatarUrl?: string;
  unitPreference: 'sqft' | 'sqm';
  currency: 'INR' | 'USD';
  vastuPreference: 'Strict' | 'High' | 'Moderate' | 'Flexible' | 'None';
  createdAt: string;
}

export interface PlotDetails {
  length: number; // in feet
  width: number; // in feet
  totalArea: number; // sq.ft
  shape: 'Rectangular' | 'Square' | 'L-Shaped' | 'Irregular' | 'L-shaped' | 'Corner';
  roadDirection: RoadDirection;
  northDirection: number; // degrees 0-360
  location: string;
  setbacks: {
    front: number;
    rear: number;
    left: number;
    right: number;
  };
}

export interface FamilyRequirements {
  totalMembers: number;
  adults: number;
  children: number;
  elderly: number;
  frequentGuests: boolean;
}

export interface RoomRequirements {
  bedrooms: number;
  masterBedrooms: number;
  childrenRooms: number;
  guestRooms: number;
  bathrooms: number;
  attachedBaths: number;
  kitchen: boolean;
  livingRoom: boolean;
  diningRoom: boolean;
  studyRoom: boolean;
  poojaRoom: boolean;
  storeRoom: boolean;
  utilityRoom: boolean;
  balconies: number;
  terrace: boolean;
  garden: boolean;
  parkingBays: number;
  servantQuarter: boolean;
}

export interface BudgetPreferences {
  totalBudget: number; // in INR (e.g., 3500000 = 35 Lakh)
  civilBudget?: number;
  interiorBudget?: number;
  furnitureBudget?: number;
  targetCostPerSqFt?: number;
}

export interface ProjectPreferences {
  vastuPriority: 'Strict' | 'High' | 'Medium' | 'Low' | 'None';
  naturalLighting: 'Maximized' | 'Standard';
  crossVentilation: 'Maximized' | 'Standard';
  privacyLevel: 'High' | 'Medium' | 'Standard';
  accessibilityForElderly: boolean;
  futureExpansionReady: boolean;
}

export interface CadFurniture {
  id: string;
  roomId: string;
  name: string;
  category:
    | 'bed'
    | 'sofa'
    | 'dining'
    | 'wardrobe'
    | 'tv_unit'
    | 'kitchen_counter'
    | 'mandir'
    | 'sanitary'
    | 'car'
    | 'plant'
    | 'study_desk';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // degrees
}

export interface CadDoor {
  id: string;
  roomId: string;
  x: number;
  y: number;
  width: number;
  swingDirection: 'inward_left' | 'inward_right' | 'outward_left' | 'outward_right';
  wallSide: 'top' | 'bottom' | 'left' | 'right';
  type: 'Main' | 'Internal' | 'Sliding' | 'Flush';
}

export interface CadWindow {
  id: string;
  roomId: string;
  x: number;
  y: number;
  width: number;
  wallSide: 'top' | 'bottom' | 'left' | 'right';
  type: 'Casement' | 'Sliding' | 'Bay' | 'Ventilator';
}

export interface CadWall {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  thickness: number; // in feet (e.g., 0.75ft for 9 inch, 0.375ft for 4.5 inch)
  isExternal: boolean;
  floor: number;
}

export interface CadRoom {
  id: string;
  name: string;
  type:
    | 'master_bedroom'
    | 'bedroom'
    | 'living'
    | 'dining'
    | 'kitchen'
    | 'bathroom'
    | 'pooja'
    | 'study'
    | 'store'
    | 'utility'
    | 'balcony'
    | 'staircase'
    | 'parking'
    | 'garden'
    | 'corridor'
    | 'terrace';
  x: number; // offset from plot origin in feet
  y: number;
  width: number; // in feet
  height: number; // in feet
  area: number; // sq.ft
  floor: number; // 0 = Ground, 1 = First, 2 = Second, 3 = Terrace
  directionZone: Direction;
  vastuCompliance: 'Ideal' | 'Good' | 'Acceptable' | 'Challenging';
  color: string;
  furniture?: CadFurniture[];
  doors?: CadDoor[];
  windows?: CadWindow[];
  features?: string[];
}

export type Room = CadRoom;

export interface FloorLayout {
  id?: string;
  floorNumber: number;
  name: string;
  builtUpArea: number;
  carpetArea: number;
  rooms: CadRoom[];
  walls: CadWall[];
  stairwellPosition?: { x: number; y: number; width: number; height: number };
}

export type FloorPlan = FloorLayout;

export interface VastuItemAnalysis {
  element: string;
  zone: Direction;
  actualZone: Direction;
  status: 'Good' | 'Moderate' | 'Concern';
  comment: string;
  remedy?: string;
}

export interface VastuZoneAnalysis {
  zone: Direction;
  element?: string;
  rulingPlanet?: string;
  idealRooms: string[];
  currentRooms: string[];
  isCompliant: boolean;
  recommendations: string;
}

export interface VastuReport {
  score: number; // 0 - 100
  rating: 'Superior' | 'Good' | 'Moderate' | 'Needs Optimization';
  zoneAnalysis?: {
    zone: Direction;
    rulingPlanet: string;
    suitableRooms: string[];
    presentRooms: string[];
    score: number;
  }[];
  zoneDetails: VastuZoneAnalysis[];
  items: VastuItemAnalysis[];
  suggestions: string[];
}

export interface CostBreakdownItem {
  category: string;
  cost: number;
  percentage: number;
  tier: QualityTier;
  details: string;
  reducibleAmount?: number;
  optimizationNote?: string;
}

export interface BudgetReport {
  totalEstimatedCost: number;
  userBudget: number;
  variance: number; // positive = under budget, negative = over budget
  isOverBudget: boolean;
  ratePerSqFt: number;
  categories: CostBreakdownItem[];
  savingsRecommendations: {
    id: string;
    title: string;
    savingsAmount: number;
    impact: 'Minimal' | 'Moderate' | 'Architectural';
    description: string;
    applied: boolean;
  }[];
}

export interface MaterialItem {
  id: string;
  category: MaterialCategory;
  brand: string;
  productName: string;
  qualityLevel: QualityTier;
  approxPrice: number;
  priceRange?: { min: number; max: number };
  unit: string;
  durability?: string;
  durabilityYears?: number;
  warrantyYears?: number;
  vastuCompatibility?: string;
  description: string;
  recommendedUse: string;
  isBudgetRecommended?: boolean;
  features?: string[];
}

export interface DesignVersion {
  versionNumber: number;
  name: string;
  timestamp: string;
  changesSummary: string;
  estimatedCost: number;
  vastuScore: number;
  spaceEfficiency: number;
  designData: {
    floors: FloorLayout[];
    plot: PlotDetails;
  };
}

export interface ProjectAlternative {
  id: string;
  key?: 'A' | 'B' | 'C' | 'D';
  name: string;
  label?: string;
  description: string;
  cost: number;
  vastuScore: number;
  spaceEfficiency: number;
  floors: FloorLayout[];
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  status: 'Draft' | 'Generated' | 'Optimized' | 'Completed';
  plot: PlotDetails;
  family: FamilyRequirements;
  requirements: RoomRequirements;
  budget: BudgetPreferences;
  style: ArchitecturalStyle;
  preferences: ProjectPreferences;
  totalFloors: number; // 1 = Ground, 2 = G+1, 3 = G+2, 4 = G+3
  floors: FloorLayout[];
  vastuReport: VastuReport;
  budgetReport: BudgetReport;
  spaceEfficiencyScore: number;
  ventilationScore: number;
  lightingScore: number;
  overallScore: number;
  versions: DesignVersion[];
  selectedAlternative?: string;
  alternatives?: ProjectAlternative[];
}

// =======================================================
// SMART HOME MANAGEMENT & APPLIANCE TYPES (SUPABASE SCHEMA)
// =======================================================

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone?: string | null;
  timezone?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    unit?: 'sqft' | 'sqm';
    currency?: 'INR' | 'USD';
    vastu?: boolean;
    sustainability?: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface Home {
  id: string;
  user_id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  home_type?: string;
  description?: string;
  plot_width?: number;
  plot_length?: number;
  plot_area?: number;
  created_at: string;
  updated_at: string;
  rooms?: HomeRoom[];
  appliances?: Appliance[];
}

export interface HomeRoom {
  id: string;
  home_id: string;
  name: string;
  room_type: string;
  floor?: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  appliances_count?: number;
}

export type ApplianceStatus = 'active' | 'needs_maintenance' | 'in_repair' | 'inactive';
export type WarrantyStatus = 'active' | 'expiring_soon' | 'expired' | 'unknown';

export interface Appliance {
  id: string;
  home_id: string;
  room_id?: string | null;
  room_name?: string;
  name: string;
  category: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  purchase_date?: string;
  warranty_expiry?: string;
  status: ApplianceStatus;
  energy_rating?: string;
  power_consumption?: number; // in Watts
  notes?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  images?: ApplianceImage[];
  maintenance_tasks?: MaintenanceTask[];
  warranty_status?: WarrantyStatus;
}

export interface ApplianceImage {
  id: string;
  appliance_id: string;
  user_id: string;
  storage_path: string;
  public_url?: string;
  caption?: string;
  ai_analysis?: {
    category?: string;
    brand?: string;
    model?: string;
    status_assessment?: string;
    maintenance_advice?: string;
    confidence?: number;
    error_codes?: string[];
  };
  created_at: string;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface MaintenanceTask {
  id: string;
  appliance_id?: string | null;
  appliance_name?: string;
  home_id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date?: string;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIConversation {
  id: string;
  user_id: string;
  home_id?: string | null;
  title: string;
  created_at: string;
  updated_at: string;
  messages_count?: number;
}

export interface AIMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: {
    suggestedActions?: string[];
    referencedAppliances?: string[];
    technicalContext?: string;
  };
  created_at: string;
}

export interface AIRecommendation {
  id: string;
  user_id: string;
  home_id?: string | null;
  category: 'Energy' | 'Maintenance' | 'Warranty' | 'Safety' | 'General';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'viewed' | 'completed' | 'dismissed';
  metadata?: Record<string, any>;
  created_at: string;
}

export interface EnergyRecord {
  id: string;
  user_id: string;
  home_id: string;
  appliance_id?: string | null;
  appliance_name?: string;
  recorded_at: string;
  energy_consumption: number; // in kWh
  unit: string;
  metadata?: Record<string, any>;
}

export interface HomeDashboardStats {
  totalHomes: number;
  totalRooms: number;
  totalAppliances: number;
  pendingTasksCount: number;
  activeWarrantiesCount: number;
  expiringWarrantiesCount: number;
  monthlyEstimatedKwh: number;
  recommendationsCount: number;
}

