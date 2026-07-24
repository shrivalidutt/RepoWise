/**
 * Instead of writing the full URL every time:
 *   axios.get('http://localhost:3001/api/arch/owner__repo')
 * 
 * We just write:
 *   apiClient.get('/arch/owner__repo')
 * 
 * The base URL is configured once here.
 */
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 60000, // 60 seconds — some analyses take time
});

export default apiClient;
