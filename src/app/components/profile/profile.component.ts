import { Component } from '@angular/core';
import { UserInfo } from '../../interfaces/user-info';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserUpdate } from '../../interfaces/user-update';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  completed: boolean = false;
  userInfo: UserInfo = {} as UserInfo;
  userRepositories: any = [];
  formGroup: FormGroup = new FormGroup({});

  constructor(private authService: AuthService, private userService: UserService) {}
  
  ngOnChanges() {
    this.initForm();
  }


  initForm() {
    this.formGroup = new FormGroup({
      name: new FormControl(this.userInfo.name, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
      blog: new FormControl(this.userInfo.blog, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
      company: new FormControl(this.userInfo.company, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
      location: new FormControl(this.userInfo.location, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
      bio: new FormControl(this.userInfo.bio, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
    })
  }

  ngOnInit() {
    this.authService.getAuthUser().subscribe({
      next: response => {
        this.userInfo = response;
        console.log(this.userInfo);
      },
      error: err => alert(err.message),
      complete: () => this.completed=true,
    });
  }

  updateProfile() {
    if(!this.formGroup.valid) {
      alert('Please enter a valid input');
      return;
    }

    const userUpdate : UserUpdate = {
      name: this.formGroup.value.name as string,
      blog: this.formGroup.value.blog as string,
      company: this.formGroup.value.company as string,
      location: this.formGroup.value.location as string,
      bio: this.formGroup.value.bio as string,
    } as UserUpdate;
    console.log(userUpdate);

    this.userService.updateProfile(userUpdate).subscribe({
      next: response => console.log(response),
      error: err => alert(err.message),
      complete: () => {
        this.completed=true,
        alert('Profile Updated')
        this.ngOnInit()
      },
    })
  }
}
