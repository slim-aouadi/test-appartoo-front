import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DinosaureService } from '../services/dinosaure.service';
import { Dinosaure } from 'src/entities/dinosaure';
import { AuthenticationService } from '../services/authentication.service';
import { FilterPipe } from '../filter.pipe';

@Component({
  selector: 'app-find-friends',
  templateUrl: './find-friends.component.html',
  styleUrls: ['./find-friends.component.css'],
  providers: [FilterPipe]
})
export class FindFriendsComponent implements OnInit {
  dinosauresList: Dinosaure[];
  updateDinosaure: Dinosaure;
  newFriend: Dinosaure;
  constructor(private as: AuthenticationService, private ds: DinosaureService, private router: Router) { }
  connectedDinosaure: Dinosaure;

  ngOnInit() {
    this.connectedDinosaure = JSON.parse(localStorage.getItem('connectedDinosaure'));
    this.ds.getAllDinosaures().subscribe(data => {
      this.dinosauresList = data.filter(element => element._id !== this.connectedDinosaure._id);
    })

  }

  onClickMyProfile() {
    this.router.navigate(['home'])
  }
  onClickAddFriend(dinosaure) {
    this.dinosauresList = this.dinosauresList.filter(function (obj) {
      return obj._id !== dinosaure._id;
    });
    this.connectedDinosaure = {
      ...this.connectedDinosaure,
      friends: [...this.connectedDinosaure.friends, dinosaure._id]
    }
    var formData = new FormData();
    formData.append('data', JSON.stringify(this.connectedDinosaure));
    this.ds.updateDinosaureInformations(formData).subscribe(reponse => {
      localStorage.setItem('connectedDinosaure', JSON.stringify(reponse.data));
    })
  }
  logout() {

    this.as.logout();
  }
}
