import { Platform } from "react-native";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// golang api http://localhost:5000/api/auth/sign-in
const url = Platform.OS === "android" ? "http://192.168.1.104:8001" : "http://192.168.1.104:8001"
// const url = Platform.OS === "android" ? "https://sg2tpj-109-68-118-147.ru.tuna.am" : "http://192.168.1.104:8001"

const urlNgixMinio = "http://192.168.1.104:88"

const Api: AxiosInstance = axios.create({ baseURL: url + "/api/v1" });
// const Api: AxiosInstance = axios.create({ baseURL: "http://localhost:5000/api" });
// const Api: AxiosInstance = axios.create({ baseURL: "https://tyq40x-109-68-114-32.ru.tuna.am/api/v1" });
// const Api: AxiosInstance = axios.create({ baseURL: "https://tyq40x-109-68-114-32.ru.tuna.am/api/v1" });

Api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem("token");
  console.log('token');
  console.log(token);
  
  if (token) config.headers.set("Authorization", `Bearer ${token}`);

  return config;
});

Api.interceptors.response.use(
  async (res: AxiosResponse) => res.data,
  async (err: AxiosError) => Promise.reject(err)
);

export { Api, urlNgixMinio };
