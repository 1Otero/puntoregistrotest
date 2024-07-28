import { Injectable } from '@angular/core';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  saveToken(token:string){
    setCookie('token', token, {expires: 12, path: '/'});
  }

  getToken(){
    const token = getCookie('token');
    return token;
  }

  removeToken(){
    removeCookie('token');
  }

  isValidToken(){
    const token = this.getToken();
    if(!token){
      return false;
    }
    const decodeToken = jwtDecode(token);
    if(decodeToken && decodeToken?.exp){
      const tokenDate = new Date(0);
      tokenDate.setUTCSeconds(decodeToken.exp);
      const today = new Date();
      return tokenDate.getTime() > today.getTime();
    } 
    return false;
  }

  saveTokenUserAssistant(token:string){
    setCookie('tokenUserAssistant', token, {expires: 12, path: '/'});
  }

  getTokenUserAssistant(){
    const token = getCookie('tokenUserAssistant');
    return token;
  }

  removeTokenUserAssistant(){
    removeCookie('tokenUserAssistant');
  }

  isValidTokenUserAssistant(){
    const token = this.getTokenUserAssistant();
    if(!token){
      return false;
    }
    const decodeToken = jwtDecode(token);
    if(decodeToken && decodeToken?.exp){
      const tokenDate = new Date(0);
      tokenDate.setUTCSeconds(decodeToken.exp);
      const today = new Date();
      return tokenDate.getTime() > today.getTime();
    } 
    return false;
  }

}
