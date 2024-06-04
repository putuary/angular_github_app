import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RepositoryDetail } from '../../interfaces/repository-detail';

@Component({
  selector: 'app-repository',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './repository.component.html',
  styleUrl: './repository.component.scss'
})
export class RepositoryComponent {
  userInfo: any={};
  completed: boolean = false;
  userRepositories: any ={};
  repoDetails: RepositoryDetail[]=[];

  imageUrl: string[] =[
    "https://w.wallhaven.cc/full/we/wallhaven-werowr.png",
    "https://w.wallhaven.cc/full/jx/wallhaven-jxlwpm.jpg",
    "https://w.wallhaven.cc/full/2y/wallhaven-2y6wwg.jpg",
    "https://w.wallhaven.cc/full/49/wallhaven-493eq1.jpg",
  ];

  constructor(private authService: AuthService, private userService: UserService){}

  randomImage() {
    return this.imageUrl[Math.floor(Math.random()*(this.imageUrl.length-1))];
  }

  ngOnInit() {
    this.authService.getAuthUser().subscribe({
      next: response => {
        this.userInfo = response;
        console.log(this.userInfo);
        this.getUserRepositories(this.userInfo.login);
      },
      error: err => alert(err.message),
      complete: () => this.completed=true,
    });
  }

  getUserRepositories(userName: string) {
    this.userService.getUserRepositories(userName).subscribe({
      next: response => {this.userRepositories = response
      console.log(this.userRepositories);
      },
      error: err => alert(err.message),
      complete: () => {
        this.completed=true;
        this.getRepoComits(this.userRepositories);
      },
    });
  }

  getRepoComits(repo: any) : void {
    for (let i = 0; i < repo.length; i++) {
      this.userService.getRepoCommits(this.userInfo.login, repo[i].name).subscribe({
        next: response => {
          this.repoDetails.push({repository: repo[i], comit_count: response.length});
        },
        error: err => console.log(err.message),
        complete: () => {
          this.completed = true;
        },
      })
    }
  }
}