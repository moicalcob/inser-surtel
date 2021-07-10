import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentsComponent } from './components/documents/documents.component';
import { EditDocumentComponent } from './components/edit-document/edit-document.component';
import { UploadComponent } from './components/upload/upload.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: DocumentsComponent
  },
  {
    path: 'upload',
    component: UploadComponent
  },
  {
    path: 'document/:document_id',
    component: EditDocumentComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
