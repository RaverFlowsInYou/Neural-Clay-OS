export type MemoryStrata = 'EPHEMERAL' | 'STABLE' | 'PERMANENT';

export interface PuttyState {
  id: string;
  strata: MemoryStrata;
  humidity: number; // 0.0 to 1.0 (mapped from Opacity)
  viscosity: number; // 0.0 to 1.0 (based on connections and similarity)
  timestamp: number;
  position: [number, number, number];
  content: string;
  connections: string[]; // Voxel IDs
  createdAt: number;
}

export interface Voxel extends PuttyState {
  opacity: number; // 0.0 to 1.0
  semanticWeight: number;
}

export interface MemoryLayer {
  id: string;
  strata: MemoryStrata;
  voxels: Map<string, Voxel>;
  createdAt: number;
}