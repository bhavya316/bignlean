export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002',
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {  
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
  }
}; 
