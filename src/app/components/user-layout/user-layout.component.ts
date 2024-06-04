import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserInfo } from '../../interfaces/user-info';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.scss'
})
export class UserLayoutComponent {
  completed: boolean = false;
  userInfo: UserInfo = {} as UserInfo;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getAuthUser().subscribe({
      next: response => this.userInfo = response,
      error: err => alert(err.message),
      complete: () => this.completed=true,
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
