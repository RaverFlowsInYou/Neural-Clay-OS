import { GoogleGenerativeAI } from '@google/generative-ai';
import { Voxel, MemoryStrata } from '../types/index';

type VoxelType = 'CONCEPT' | 'RELATION' | 'ATTRIBUTE' | 'EVENT';

interface DecomposedVoxel {
  id: string;
  content: string;
  voxelType: VoxelType;
  position: [number, number, number];
  connections: string[];
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private modelName = 'gemini-1.5-flash';

  constructor(apiKey: string | undefined) {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required to initialise GeminiService');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Decomposes a complex thought into semantic voxels using Gemini.
   * Each voxel represents an atomic semantic unit with a 3-D position
   * derived from the model's embedding-like decomposition.
   */
  async decomposeAndVectorize(thought: string): Promise<DecomposedVoxel[]> {
    const model = this.genAI.getGenerativeModel({ model: this.modelName });

    const prompt = `
You are a semantic decomposition engine for the Neural-Clay-OS system.
Break the following thought into atomic semantic units (voxels).

For each voxel, return a JSON array where every element has:
- "content": the atomic concept (string)
- "voxelType": one of "CONCEPT" | "RELATION" | "ATTRIBUTE" | "EVENT"
- "position": [x, y, z] — three floats between -1.0 and 1.0 representing semantic coordinates
- "connections": [] — empty array (connections are resolved later)

Return ONLY valid JSON — no markdown, no explanation.

Thought: "${thought}"
    `.trim();

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    let parsed: Omit<DecomposedVoxel, 'id'>[];
    try {
      // Strip any accidental markdown code fences
      const clean = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      parsed = JSON.parse(clean);
    } catch {
      console.error('[GeminiService] Failed to parse model response:', text);
      return [];
    }

    const now = Date.now();
    return parsed.map((v, i) => ({
      ...v,
      id: `voxel_${now}_${i}_${Math.random().toString(36).slice(2, 6)}`,
    }));
  }

  /**
   * Converts a DecomposedVoxel into a full Voxel ready for MemoryService.
   */
  toVoxel(decomposed: DecomposedVoxel, strata: MemoryStrata = 'EPHEMERAL'): Omit<Voxel, 'id' | 'createdAt' | 'opacity'> {
    const now = Date.now();
    return {
      strata,
      humidity: 1.0,
      viscosity: 0.0,
      timestamp: now,
      position: decomposed.position,
      content: decomposed.content,
      connections: decomposed.connections,
      semanticWeight: 1.0,
    };
  }
}
