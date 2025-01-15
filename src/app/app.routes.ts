import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth-guard.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'intranet',
    loadComponent: () =>
      import('./pages/main/main.component').then((m) => m.MainComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () =>
          import('./pages/modules/modules.component').then(
            (m) => m.ModulesComponent
          ),
      },
      {
        path: 'document-type',
        title: 'Documentos',
        loadComponent: () =>
          import('./pages/document-type/document-type.component').then(
            (m) => m.DocumentTypeComponent
          ),
      },
      {
        path: 'taxpayer-type',
        title: 'Contribuyentes',
        loadComponent: () =>
          import('./pages/taxpayer-type/taxpayer-type.component').then(
            (m) => m.TaxpayerTypeComponent
          ),
      },
      {
        path: 'entities',
        title: 'Entidades',
        loadComponent: () =>
          import('./pages/entities/entities.component').then(
            (m) => m.EntitiesComponent
          ),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
