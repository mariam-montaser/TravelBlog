import { NgModule, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiURL + 'users/';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private token: string;
    private tokenTimer: any;
    private isAuth = false;
    private userId: string;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) { }

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuth;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getUserId() {
        return this.userId;
    }

    autoAuth() {
        const authInfo = this.getAuthInfo();
        if (!authInfo) {
            return;
        }
        const now = new Date();
        const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authInfo.token;
            this.isAuth = true;
            this.setTokenTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }

    }

    createUser(email: string, password: string) {
        const authData: AuthData = { email, password };
        this.http.post(BACKEND_URL + 'signup', authData).subscribe(response => {
            console.log(response);
            this.router.navigate(['/']);
        }, error => {
            console.log(error);
            this.authStatusListener.next(false);

        })
    }

    login(email: string, password: string) {
        const authData: AuthData = { email, password };
        this.http.post<{ token: string, expiresIn: number, userId: string }>(BACKEND_URL + 'login', authData).subscribe(response => {
            console.log(response);
            this.token = response.token;
            if (this.token) {
                const dauration = response.expiresIn;
                this.setTokenTimer(dauration);
                this.isAuth = true;
                this.userId = response.userId;
                this.authStatusListener.next(true);
                const expirationDate = new Date(new Date().getTime() + (dauration * 1000))
                this.saveAuthData(this.token, expirationDate, this.userId);
                // console.log(expirationDate);
                this.router.navigate(['/']);
            }
        }, error => {
            this.authStatusListener.next(false)
        })
    }

    logout() {
        this.token = null;
        this.isAuth = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.userId = null;
        this.router.navigate(['/']);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('expiration', expirationDate.toISOString());
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('expiration');
    }

    private getAuthInfo() {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const expirationDate = localStorage.getItem('expiration');
        if (!token || !expirationDate) {
            return;
        }
        return {
            token,
            userId,
            expirationDate: new Date(expirationDate)
        }
    }

    private setTokenTimer(dauration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, dauration * 1000);
    }
}