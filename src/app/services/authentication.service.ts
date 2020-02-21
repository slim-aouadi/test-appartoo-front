import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Dinosaure } from 'src/entities/dinosaure';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<Dinosaure>;
  public currentUser: Observable<Dinosaure>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<Dinosaure>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Dinosaure {
    return this.currentUserSubject.value;
  }



  logIn(dinosaure) {
    return this.http.post<any>(`${environment.apiUrl}/dinosaure/login`, dinosaure)
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('connectedDinosaure', JSON.stringify(user.user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {

    localStorage.removeItem('currentUser');
    localStorage.removeItem('connectedDinosaure');
    this.currentUserSubject.next(null);
    location.reload();
  }

  register(dinosaure) {
    return this.http.post<Dinosaure>(`${environment.apiUrl}/dinosaure/register`, dinosaure)
  }
  uploadFile(profileImage) {
    return this.http.post<any>(`${environment.apiUrl}/dinosaure/uploadProfileImage`, profileImage).pipe(map(user => {
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('connectedDinosaure', JSON.stringify(user.user));
      this.currentUserSubject.next(user);
      return user;
    }))
  }



}
