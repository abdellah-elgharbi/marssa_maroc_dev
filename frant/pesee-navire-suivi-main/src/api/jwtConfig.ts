import { get } from 'http';
import { jwtDecode, JwtPayload } from 'jwt-decode';


export default function getUserInfoFromToken(token: string): JwtPayload | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded;
  } catch (error) {
    console.error("Token invalide ou mal formé", error);
    return null;
  }
}


