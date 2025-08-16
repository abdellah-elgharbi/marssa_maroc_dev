import { Pesage, Pesee, Prestation } from '../types/types';
import { AxiosResponse } from 'axios';
import api from './axiosClient';
import { useNavigate } from 'react-router-dom';
const API_URL = "http://localhost:8080";

import getUserInfoFromToken  from "./jwtConfig";
import { User } from 'lucide-react';


export async function login(username, password) {
    try {
        const res = await api.post(`${API_URL}/auth/login`, { username, password });
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        console.log(res.data)
       const UserInfo = getUserInfoFromToken(localStorage.getItem("accessToken"))
       localStorage.setItem("userRole",UserInfo["scope"]
       )
       console.log(UserInfo)

        return UserInfo;
    } catch (err) {
        console.error("Erreur de login :", err);
        throw err;
    }
}

export async function getNewAccessToken() {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("Pas de refresh token en localStorage");
    }

    const res = await api.post(`${API_URL}/auth/getToken`, { refreshToken :refreshToken  });
    const newAccessToken = res.data.accessToken;
    console.log(res.data)
    localStorage.setItem("accessToken", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Erreur lors du refresh token", error);
    return null;
  }
}



