import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentsComponent } from './pages/documents/documents.component';
import { EditDocumentComponent } from './pages/edit-document/edit-document.component';
import { LoginComponent } from './pages/login/login.component';
import { UploadComponent } from './pages/upload/upload.component';
import { UserDetailsComponent } from './pages/users/user-details/user-details.component';
import { UsersComponent } from './pages/users/users.component';
import { LoggedGuard } from './logged.guard';
import { LoginGuard } from './login.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoggedGuard],
  },
  {
    path: 'home',
    component: DocumentsComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'upload',
    component: UploadComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'document/:document_id',
    component: EditDocumentComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'users',
    canActivate: [LoginGuard],
    children: [
      {
        path: '',
        component: UsersComponent,
      },
      {
        path: ':user_id',
        component: UserDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
