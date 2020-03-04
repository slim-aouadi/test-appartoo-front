import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DinosaureService } from '../services/dinosaure.service';
import { Dinosaure } from 'src/entities/dinosaure';
import { AuthenticationService } from '../services/authentication.service';
import { FilterPipe } from '../filter.pipe';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-find-friends',
  templateUrl: './find-friends.component.html',
  styleUrls: ['./find-friends.component.css'],
  providers: [FilterPipe]
})
export class FindFriendsComponent implements OnInit {
  dinosauresList: Dinosaure[];
  updateDinosaure: Dinosaure;
  newUser: Dinosaure;
  addUser: Boolean;
  loginToSearch: string;
  showAddFriend: boolean = false;
  size: number;
  file_size: any;
  addNewUserForm: FormGroup;
  profileImage: File;
  submitter: boolean;
  constructor(private fb: FormBuilder, private as: AuthenticationService, public ngxSmartModalService: NgxSmartModalService, private ds: DinosaureService, private router: Router) { }
  connectedDinosaure: Dinosaure;

  ngOnInit() {
    this.createAddNewUserForm();
    this.submitter = false;
    this.addUser = false;
    this.newUser = new Dinosaure();
    this.connectedDinosaure = JSON.parse(localStorage.getItem('connectedDinosaure'));
    this.ds.getAllDinosaures().subscribe(data => {
      //   this.dinosauresList = data.filter(element => element._id !== this.connectedDinosaure._id);
      this.temporaryList = data;
    })
  }

  createAddNewUserForm() {
    this.addNewUserForm = this.fb.group({
      login: ['', Validators.required],
      race: ['', Validators.required],
      age: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      famille: ['', Validators.required],
      nourriture: ['', Validators.required],
    });
  }

  Onsubmit() {
    this.submitter = true;
  }
  onClickMyProfile() {
    this.router.navigate(['home'])
  }
  temporaryList = [];
  onFilterValueChange() {
    this.showAddFriend = false;
    if (this.loginToSearch) {
      this.temporaryList = this.dinosauresList.filter(data => data.login.includes(this.loginToSearch));
    }
    else {
      this.temporaryList = this.dinosauresList;
    }
  }


  onClickAddFriend(dinosaure) {
    this.temporaryList = this.temporaryList.filter(function (obj) {
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
      this.router.navigate(['/home']);
    })
  }

  uploadImage(event) {
    this.size = event.target.files[0] !== undefined && event.target.files[0].size;
    this.file_size = (this.size / 1024 / 1024).toFixed(2);
    if (this.file_size > 30) {
      event.target.value = null;
      alert("Fichier trop Volumineux , ne doit pas dépasser 30Mo");
    }
    else {
      this.profileImage = event.target.files[0]
    }

  }

  addNewUser() {
    if (this.addNewUserForm.valid) {
      const newDinosaure = this.addNewUserForm.value;
      this.newUser = {
        ...this.newUser,
        login: newDinosaure.login,
        race: newDinosaure.race,
        age: newDinosaure.age,
        nourriture: newDinosaure.nourriture,
        famille: newDinosaure.famille,
      };

      const currentUser = {
        login: this.connectedDinosaure.login,
        race: this.connectedDinosaure.race,
        age: this.connectedDinosaure.age.toString(),
        nourriture: this.connectedDinosaure.nourriture,
        famille: this.connectedDinosaure.famille
      }

      if (JSON.stringify(this.newUser) === JSON.stringify(currentUser)) {

        alert("Vous ne pouvez pas vous ajouter dans votre liste d'amis")
      }
      else if (this.newUser.login == currentUser.login) {
        alert("Veuillez changer de login")
      }
      else {
        this.ds.searchUser(this.newUser).subscribe(response => {
          if (response.data != null) {
            if (this.connectedDinosaure.friends.includes(response.data._id)) {
              alert("Friend exists already in your friend list")

            } else {
              this.onClickAddFriend(response.data);
              alert("Friend Added to your friend list")
            }
          }
          else {
            const formData = new FormData();
            formData.append('file', null)
            this.newUser.password = this.newUser.login
            this.newUser.friends = [];
            formData.append('data', JSON.stringify(this.newUser));
            this.ds.addNewFriend(formData).subscribe(data => {
              this.onClickAddFriend(data.dinosaure);

            })

          }
        })
      }

    }

  }

  showAddFriendForm() {
    this.showAddFriend = true;
  }

  logout() {

    this.as.logout();
  }
}
