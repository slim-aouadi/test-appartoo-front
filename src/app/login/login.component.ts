import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Dinosaure } from 'src/entities/dinosaure';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  displayLogin: boolean;
  size: number;
  file_size: any;
  profileImage: File;
  displayRegister: boolean;
  returnUrl: String;

  submitter: boolean;
  dinosaure = new Dinosaure();

  constructor(private fb: FormBuilder, private as: AuthenticationService, private route: ActivatedRoute,
    private router: Router) {
    if (this.as.currentUserValue) {
      this.router.navigate(['home']);
    }
  }

  ngOnInit() {
    localStorage.getItem('currentUser')
    this.displayRegister = false;
    this.displayLogin = true;
    this.submitter = false;
    this.createLoginForm();
    this.createRegisterForm();
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/home';
  }
  createLoginForm() {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  createRegisterForm() {
    this.registerForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      race: ['', Validators.required],
      age: ['', Validators.required],
      famille: ['', Validators.required],
      nourriture: ['', Validators.required],
      profileImage: ['', Validators.required]
    });
  }
  Onsubmit() {
    this.submitter = true;
  }
  showRegister() {
    this.displayLogin = false;
    this.displayRegister = true;
  }
  showLogin() {
    this.displayLogin = true;
    this.displayRegister = false;
  }


  onClickLogin() {
    if (this.loginForm.valid) {
      const dinosaure = this.loginForm.value;
      this.dinosaure = {
        ...this.dinosaure,
        login: dinosaure.login,
        password: dinosaure.password
      };

      this.as.logIn(this.dinosaure)
        .pipe(first())
        .subscribe(
          data => {
            this.router.navigate([this.returnUrl]);
          },
          error => {
            console.log("ERROR LOG IN COMPONENT ")
          });
    }
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


  onClickRegister() {
    if (this.registerForm.valid) {
      const dinosaure = this.registerForm.value;
      this.dinosaure = {
        ...this.dinosaure,
        login: dinosaure.login,
        password: dinosaure.password,
        race: dinosaure.race,
        age: dinosaure.age,
        nourriture: dinosaure.nourriture,
        famille: dinosaure.famille,
        friends: [],
      };
      const formData = new FormData();
      formData.append('file', this.profileImage)
      this.as.register(this.dinosaure).subscribe(data => {
        this.as.uploadFile(formData).pipe(first())
          .subscribe(
            data => {
              this.router.navigate([this.returnUrl]);
            },
            error => {
              console.log("ERROR LOG IN COMPONENT ")
            });
      });

    }
  }
}
