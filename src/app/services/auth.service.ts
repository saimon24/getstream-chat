import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, switchMap, BehaviorSubject, tap, take } from 'rxjs';
import jwt_decode from 'jwt-decode';

export const USER_STORAGE_KEY = 'usertoken';

export interface UserData {
  token: string;
  id: string;
  stream_token: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: BehaviorSubject<UserData | null | undefined> =
    new BehaviorSubject<UserData | null | undefined>(undefined);

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  loadUser() {
    const token = localStorage.getItem(USER_STORAGE_KEY);

    if (token) {
      const decoded: any = jwt_decode(token);

      this.http
        .post(`${window.location.origin}/.netlify/functions/get_token`, {
          id: decoded.sub,
        })
        .subscribe((res: any) => {
          const userData = {
            token,
            id: decoded.sub,
            stream_token: res.token,
          };
          this.user.next(userData);
        });
    } else {
      this.user.next(null);
    }
  }

  register(email: string, password: string) {
    return this.http
      .post('https://api.developbetterapps.com/users', {
        email,
        password,
      })
      .pipe(
        switchMap((res: any) => {
          return this.http.post(
            `${window.location.origin}/.netlify/functions/signup`,
            {
              email: res.email,
              id: res._id,
            }
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post('https://api.developbetterapps.com/auth', {
        email,
        password,
      })
      .pipe(
        map((res: any) => {
          localStorage.setItem(USER_STORAGE_KEY, res.token);

          const decoded: any = jwt_decode(res.token);
          const userData = {
            token: res.token,
            id: decoded.sub,
            stream_token: '',
          };
          this.user.next(userData);
          return userData;
        }),
        switchMap((res: UserData) => {
          return this.http.post(
            `${window.location.origin}/.netlify/functions/get_token`,
            {
              id: res.id,
            }
          );
        }),
        tap((res: any) => {
          let userValue = this.user.getValue();
          userValue!.stream_token = res.token;
          this.user.next(userValue);
        })
      );
  }

  async signOut() {
    localStorage.removeItem(USER_STORAGE_KEY);

    this.http
      .post(`${window.location.origin}/.netlify/functions/revoke_token`, {
        id: this.getCurrentUserId(),
      })
      .pipe(take(1))
      .subscribe();

    this.user.next(null);
  }

  getCurrentUser() {
    return this.user.asObservable();
  }

  getCurrentUserId() {
    return this.user.getValue()!.id;
  }
}
