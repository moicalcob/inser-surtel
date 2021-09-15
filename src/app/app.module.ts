import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

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


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { UploadComponent } from './components/upload/upload.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { HeaderComponent } from './widgets/header/header.component';
import { DocumentDescriptionFormComponent } from './widgets/document-description-form/document-description-form.component';
import { IngresDocumentsService } from './services/ingres-documents.service';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { EditDocumentComponent } from './components/edit-document/edit-document.component';
import { SpanishPaginatorIntl } from './utils/SpanishPaginatorIntl';

@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    DocumentsComponent,
    HeaderComponent,
    DocumentDescriptionFormComponent,
    EditDocumentComponent
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
    MatSortModule,
    MatTabsModule
  ],
  providers: [IngresDocumentsService, { provide: MatPaginatorIntl, useClass: SpanishPaginatorIntl }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
