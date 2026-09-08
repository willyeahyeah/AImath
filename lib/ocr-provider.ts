// Mock OCR Provider
// Returns fixture data for testing; real OCR adapter can be added later

import { OcrProvider } from '@/types';

export class MockOcrProvider implements OcrProvider {
  async recognize(image: Blob): Promise<{ 
    text: string; 
    confidence: number; 
    engine: "mock" | "tesseract" | "cloud" 
  }> {
    // Mock delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 500));

    // For MVP vertical slice, always return 1/2+1/3
    return {
      text: '1/2+1/3',
      confidence: 0.95,
      engine: 'mock',
    };
  }
}

// Export singleton instance
export const ocrProvider = new MockOcrProvider();
