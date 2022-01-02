import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// ANGULAR MATERIAL MODULES
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TextFieldModule } from '@angular/cdk/text-field';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { UploadComponent } from './pages/upload/upload.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { HeaderComponent } from './components/header/header.component';
import { DocumentDescriptionFormComponent } from './components/document-description-form/document-description-form.component';
import { InserDocumentsService } from './services/inser-documents.service';
import { RowCopyService } from './services/row-copy.service';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { EditDocumentComponent } from './pages/edit-document/edit-document.component';
import { SpanishPaginatorIntl } from './utils/SpanishPaginatorIntl';
import { DownloadDocumentService } from './services/download-document.service';
import { LoginComponent } from './pages/login/login.component';
import { UsersComponent } from './pages/users/users.component';
import { UserDetailsComponent } from './pages/users/user-details/user-details.component';
import { AuthInterceptorService } from './auth.interceptor';
import { AddRowDialogComponent } from './components/add-row-dialog/add-row-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { HotKeyService } from './services/het-keys.service';
import { RevisionConfirmationDialogComponent } from './components/revision-confirmation-dialog/revision-confirmation-dialog.component';
import { DuplicateDocumentDialogComponent } from './components/duplicate-document-dialog/duplicate-document-dialog.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    DocumentsComponent,
    HeaderComponent,
    DocumentDescriptionFormComponent,
    EditDocumentComponent,
    RevisionConfirmationDialogComponent,
    LoginComponent,
    UsersComponent,
    UserDetailsComponent,
    AddRowDialogComponent,
    DuplicateDocumentDialogComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatTooltipModule,
    MatStepperModule,
    MatFormFieldModule,
    HttpClientModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSortModule,
    MatSelectModule,
    MatTabsModule,
    TextFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatListModule,
    MatMenuModule,
    MatSlideToggleModule,
    DragDropModule,
  ],
  providers: [
    InserDocumentsService,
    RowCopyService,
    { provide: MatPaginatorIntl, useClass: SpanishPaginatorIntl },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    DownloadDocumentService,
    HotKeyService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
