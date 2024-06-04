import { Routes } from '@angular/router';
import { UserLayoutComponent } from './components/user-layout/user-layout.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        title: "Login Customer | Github App",
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    },
    {
        path: '',
        component: UserLayoutComponent,
        canActivateChild: [authGuard],
        children: [
            {
                path: '',
                title: "Dashboard | Github App",
                loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
            },
            {
                path: 'profile',
                title: "Profile Pengguna | Github App",
                loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
            },
            {
                path: 'repository',
                title: "Repository Pengguna | Github App",
                loadComponent: () => import('./components/repository/repository.component').then(m => m.RepositoryComponent),
            }
        ]
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];
