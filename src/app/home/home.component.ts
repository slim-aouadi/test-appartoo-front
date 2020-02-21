import { Component, OnInit } from '@angular/core';
import { Dinosaure } from 'src/entities/dinosaure';
import { DinosaureService } from '../services/dinosaure.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [DinosaureService]
})
export class HomeComponent implements OnInit {

  dinosauresList: Dinosaure[];
  connectedDinosaure: Dinosaure;
  friendList: Dinosaure[];
  editedDinosaure: Dinosaure = new Dinosaure();
  editForm: boolean;
  newProfileImage: File;
  size: number;
  file_size: any;
  constructor(private as: AuthenticationService, private ds: DinosaureService, private router: Router) { }

  ngOnInit() {
    this.editForm = false;
    this.connectedDinosaure = JSON.parse(localStorage.getItem('connectedDinosaure'));
    this.ds.getMyFriends().subscribe(data => {
      this.friendList = data;
    })
  }


  onClickFindFriends() {
    this.router.navigate(['find-friends']);
  }
  onClickRemoveFriend(friendToDelete) {
    this.friendList.splice(this.friendList.indexOf(friendToDelete._id), 1);
    this.connectedDinosaure.friends.splice(this.connectedDinosaure.friends.indexOf(friendToDelete._id), 1);
    var formData = new FormData();
    formData.append('data', JSON.stringify(this.connectedDinosaure));
    this.ds.updateDinosaureInformations(formData).subscribe(reponse => {
      localStorage.setItem('connectedDinosaure', JSON.stringify(reponse.data));
    })
  }
  editProfile(event) {
    this.editedDinosaure = {
      ...this.connectedDinosaure
    }
    this.editForm = !this.editForm;
  }
  cancelEditProfile() {
    this.editForm = false;
  }

  uploadImage(event) {
    this.size = event.target.files[0] !== undefined && event.target.files[0].size;
    this.file_size = (this.size / 1024 / 1024).toFixed(2);
    if (this.file_size > 30) {
      event.target.value = null;
      alert("Fichier trop Volumineux , ne doit pas dépasser 30Mo");
    }
    else {
      this.newProfileImage = event.target.files[0]
    }
  }

  saveEdit() {
    this.editForm = false;
    var formdata = new FormData();
    formdata.append('file', this.newProfileImage);
    formdata.append('data', JSON.stringify(this.editedDinosaure))

    this.ds.updateDinosaureInformations(formdata).subscribe(reponse => {
      console.log(reponse.data)
      localStorage.setItem('connectedDinosaure', JSON.stringify(reponse.data));
      this.ngOnInit();
    })
  }

  logout() {
    this.as.logout();
  }

}
