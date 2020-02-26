import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dinosaure } from 'src/entities/dinosaure';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DinosaureService {

  constructor(private http: HttpClient) {

  }

  getAllDinosaures() {
    return this.http.get<Dinosaure[]>(`${environment.apiUrl}/dinosaure/`);
  }
  getMyFriends() {
    return this.http.get<Dinosaure[]>(`${environment.apiUrl}/dinosaure/getFriends`);
  }

  updateDinosaureInformations(updatedDinosaure) {
    return this.http.put<Dinosaure>(`${environment.apiUrl}/dinosaure/update/`, updatedDinosaure);
  }

  addNewFriend(newFriend) {
    return this.http.post<Dinosaure>(`${environment.apiUrl}/dinosaure/newUser/`, newFriend);
  }


}
