import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { UserUpdate } from '../../interfaces/user-update';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.apiUrl;

  constructor(private http : HttpClient) { }

  getUserRepositories(userName : string) : Observable<any> {
    return this.http.get(`${this.url}/users/${userName}/repos`, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json',
    });
  }

  getRepoCommits(userName : string, repoName : string) : Observable<any> {
    return this.http.get(`${this.url}/repos/${userName}/${repoName}/commits`, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json',
    });
  }

  updateProfile(userUpdate: UserUpdate) : Observable<any> {
    return this.http.patch(`${this.url}/user`, userUpdate);
  }
}
