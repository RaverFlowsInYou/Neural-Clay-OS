import { Voxel, MemoryLayer, MemoryStrata, PuttyState } from '../types/index';

const DECAY_WINDOW_MS = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
const VISCOSITY_THRESHOLD = 0.8;
const GRAVITY_STRENGTH = 0.1;

const STRATA_DECAY_RATES: Record<MemoryStrata, number> = {
  EPHEMERAL: 1.0,   // full decay over 48H
  STABLE: 0.5,      // half decay over 48H
  PERMANENT: 0.0,   // no decay — fixed opacity of 0.8
};

const PERMANENT_OPACITY = 0.8;

export class MemoryService {
  private layers: Map<string, MemoryLayer> = new Map();

  // ─── Layer Management ────────────────────────────────────────────────────

  createLayer(strata: MemoryStrata): MemoryLayer {
    const layer: MemoryLayer = {
      id: `layer_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      strata,
      voxels: new Map(),
      createdAt: Date.now(),
    };
    this.layers.set(layer.id, layer);
    return layer;
  }

  getLayer(layerId: string): MemoryLayer | undefined {
    return this.layers.get(layerId);
  }

  // ─── Voxel Management ────────────────────────────────────────────────────

  addVoxel(layerId: string, partial: Omit<Voxel, 'id' | 'createdAt' | 'opacity'>): Voxel | null {
    const layer = this.layers.get(layerId);
    if (!layer) return null;

    const now = Date.now();
    const voxel: Voxel = {
      ...partial,
      id: `voxel_${now}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: now,
      timestamp: now,
      opacity: 1.0,
    };

    layer.voxels.set(voxel.id, voxel);
    return voxel;
  }

  // ─── Opacity / Decay ─────────────────────────────────────────────────────

  /**
   * Calculates the current opacity of a voxel based on its strata and age.
   *
   * EPHEMERAL : opacity = 1.0 - elapsed / 48H
   * STABLE    : opacity = 1.0 - (elapsed / 48H) * 0.5
   * PERMANENT : opacity = 0.8 (constant)
   */
  calculateOpacity(voxel: Voxel, now: number): number {
    if (voxel.strata === 'PERMANENT') return PERMANENT_OPACITY;

    const elapsed = now - voxel.createdAt;
    const decayRate = STRATA_DECAY_RATES[voxel.strata];
    const opacity = 1.0 - (elapsed / DECAY_WINDOW_MS) * decayRate;
    return Math.max(0, opacity);
  }

  /**
   * Scans all voxels in a layer, updates their opacity, and prunes any
   * EPHEMERAL voxels whose opacity has reached 0.
   */
  checkMemoryDecay(layerId: string, now: number): { pruned: string[]; updated: string[] } {
    const layer = this.layers.get(layerId);
    if (!layer) return { pruned: [], updated: [] };

    const pruned: string[] = [];
    const updated: string[] = [];

    for (const [id, voxel] of layer.voxels) {
      const opacity = this.calculateOpacity(voxel, now);
      voxel.opacity = opacity;
      voxel.humidity = opacity; // humidity mirrors opacity

      if (opacity <= 0 && voxel.strata === 'EPHEMERAL') {
        layer.voxels.delete(id);
        pruned.push(id);
      } else {
        updated.push(id);
      }
    }

    return { pruned, updated };
  }

  // ─── Viscosity Promotion ─────────────────────────────────────────────────

  /**
   * Computes cosine similarity between two position vectors.
   */
  private cosineSimilarity(a: [number, number, number], b: [number, number, number]): number {
    const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const magA = Math.sqrt(a[0] ** 2 + a[1] ** 2 + a[2] ** 2);
    const magB = Math.sqrt(b[0] ** 2 + b[1] ** 2 + b[2] ** 2);
    if (magA === 0 || magB === 0) return 0;
    return dot / (magA * magB);
  }

  /**
   * Checks all EPHEMERAL voxels in a layer against existing STABLE/PERMANENT
   * voxels. If similarity > 0.8, promotes the voxel to STABLE, applies
   * gravitational attraction, and creates a connection.
   */
  applyViscosityPromotion(layerId: string): string[] {
    const layer = this.layers.get(layerId);
    if (!layer) return [];

    const promoted: string[] = [];
    const stableVoxels = [...layer.voxels.values()].filter(
      (v) => v.strata === 'STABLE' || v.strata === 'PERMANENT'
    );

    for (const voxel of layer.voxels.values()) {
      if (voxel.strata !== 'EPHEMERAL') continue;

      for (const stable of stableVoxels) {
        const similarity = this.cosineSimilarity(voxel.position, stable.position);
        if (similarity > VISCOSITY_THRESHOLD) {
          // Promote
          voxel.strata = 'STABLE';

          // Gravitational attraction — shift position 10% toward the similar voxel
          voxel.position = [
            voxel.position[0] + (stable.position[0] - voxel.position[0]) * GRAVITY_STRENGTH,
            voxel.position[1] + (stable.position[1] - voxel.position[1]) * GRAVITY_STRENGTH,
            voxel.position[2] + (stable.position[2] - voxel.position[2]) * GRAVITY_STRENGTH,
          ];

          // Connect
          if (!voxel.connections.includes(stable.id)) {
            voxel.connections.push(stable.id);
          }
          if (!stable.connections.includes(voxel.id)) {
            stable.connections.push(voxel.id);
          }

          promoted.push(voxel.id);
          break; // one promotion per voxel per pass
        }
      }
    }

    return promoted;
  }

  // ─── Health Check ─────────────────────────────────────────────────────────

  healthCheck(now: number): {
    totalLayers: number;
    totalVoxels: number;
    averageOpacity: number;
    strataCounts: Record<MemoryStrata, number>;
  } {
    let totalVoxels = 0;
    let opacitySum = 0;
    const strataCounts: Record<MemoryStrata, number> = {
      EPHEMERAL: 0,
      STABLE: 0,
      PERMANENT: 0,
    };

    for (const layer of this.layers.values()) {
      for (const voxel of layer.voxels.values()) {
        totalVoxels++;
        const opacity = this.calculateOpacity(voxel, now);
        opacitySum += opacity;
        strataCounts[voxel.strata]++;
      }
    }

    return {
      totalLayers: this.layers.size,
      totalVoxels,
      averageOpacity: totalVoxels > 0 ? opacitySum / totalVoxels : 0,
      strataCounts,
    };
  }
}
