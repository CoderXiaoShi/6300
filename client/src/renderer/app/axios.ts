import axios from 'axios';
const instance = axios.create();

instance.defaults.baseURL = (import.meta.env.VITE_URL_ROOT as string)

instance.interceptors.request.use((config: any) => {
  config.params = {
    ...config.params || {},
  }
  return config;
});

export default instance
