import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BYPASS_LOGGIN } from '../../shared/constant/context.constants';
import { UserInfo } from '../../interfaces/user-info';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = environment.apiUrl;
  response:any=[];
  error:HttpErrorResponse | undefined;
  completed:boolean=false;

  constructor(private http : HttpClient) { }

  login(authToken : string) : Observable<any> {
    return this.http.get(`${this.url}/user`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        responseType: 'json',
        context: new HttpContext().set(BYPASS_LOGGIN, true)
    });
  }

  logout() : boolean {
    localStorage.removeItem('token');
    return true;
  }

  getAuthUser() : Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.url}/user`, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json',
    })
  }

  getAuthToken() {
    return `Bearer ${localStorage.getItem('token')}`;
  }
}
