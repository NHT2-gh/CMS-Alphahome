import axios, {
  type AxiosError,
  type AxiosResponse,
  type AxiosRequestConfig,
} from "axios";
import { HOST_API } from "../../global-config";
// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });
// Add a request interceptor for things like authentication tokens
axiosInstance.interceptors.request.use(
  async (config) => {
    // You can add common headers or other request configurations here
    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common error patterns
axiosInstance.interceptors.response.use(
  async (res) => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("Authentication failed - 401 response received");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// -----------------------------------------------------------------------------

export const fetcher = async <T>(
  args: string | [string, AxiosRequestConfig]
): Promise<T> => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const defaultConfig: AxiosRequestConfig = { method: "GET", ...config };
  const res: AxiosResponse<T> = await axiosInstance.request<T>({
    url,
    ...defaultConfig,
  });

  return res.data;
};

// ----------------------------------------------------------------------
