import axios from "axios";
import getToken from "./get-token";

const API_URL = "http://localhost:8080/api/test/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: getToken() });
};

const getModeratorBoard = () => {
  return axios.get(API_URL + "mod", { headers: getToken() });
};

const getAdminBoard = () => {
  return axios.get(API_URL + "admin", { headers: getToken() });
};

const UserService = {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
};

export default UserService;
