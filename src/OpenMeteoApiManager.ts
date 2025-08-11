// OpenMeteo API rate limiting and request management
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status?: number;
}

class OpenMeteoApiManager {
  private static instance: OpenMeteoApiManager;
  private requestQueue: Array<() => Promise<unknown>> = [];
  private isProcessing = false;
  private lastRequestTime = 0;
  private minDelay = 1000; // Minimum 1 second between requests

  static getInstance(): OpenMeteoApiManager {
    if (!OpenMeteoApiManager.instance) {
      OpenMeteoApiManager.instance = new OpenMeteoApiManager();
    }
    return OpenMeteoApiManager.instance;
  }

  async makeRequest<T>(url: string): Promise<ApiResponse<T>> {
    return new Promise((resolve) => {
      const requestFn = async () => {
        try {
          // Ensure minimum delay between requests
          const now = Date.now();
          const timeSinceLastRequest = now - this.lastRequestTime;
          if (timeSinceLastRequest < this.minDelay) {
            await new Promise(r => setTimeout(r, this.minDelay - timeSinceLastRequest));
          }

          console.log(`OpenMeteo API Request: ${url}`);
          this.lastRequestTime = Date.now();

          const response = await fetch(url);

          if (response.status === 429) {
            resolve({
              data: null,
              error: "Rate limit exceeded. Please wait a moment and try again.",
              status: 429
            });
            return;
          }

          if (!response.ok) {
            resolve({
              data: null,
              error: `API Error: ${response.status} ${response.statusText}`,
              status: response.status
            });
            return;
          }

          const data = await response.json();
          console.log('OpenMeteo API Response received');
          resolve({
            data,
            error: null,
            status: response.status
          });
        } catch (error) {
          console.error('OpenMeteo API Error:', error);
          resolve({
            data: null,
            error: error instanceof Error ? error.message : "Network error occurred",
            status: undefined
          });
        }
      };

      this.requestQueue.push(requestFn);
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing) return;

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const requestFn = this.requestQueue.shift();
      if (requestFn) {
        await requestFn();
      }
    }

    this.isProcessing = false;
  }

  // Method to clear queue if needed
  clearQueue() {
    this.requestQueue = [];
  }
}

export default OpenMeteoApiManager;
export type { ApiResponse };
