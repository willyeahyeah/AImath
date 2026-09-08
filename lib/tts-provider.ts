// Mock TTS Provider
// Returns mock audio URL; real TTS can be added later via server-side API

import { TtsProvider } from '@/types';

export class MockTtsProvider implements TtsProvider {
  async synthesize(opts: { 
    textYue: string; 
    voice?: string 
  }): Promise<{ 
    audioUrl: string; 
    engine: string 
  }> {
    // Mock delay to simulate synthesis
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return a silent audio data URL for MVP
    // In production, this would call a server endpoint with API keys
    return {
      audioUrl: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==',
      engine: 'mock',
    };
  }
}

// Export singleton instance
export const ttsProvider = new MockTtsProvider();
