import { Component, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss'],
})
export class ImageEditorComponent {
  file: File = null;
  imageChangedEvent: any = '';
  croppedImage: any = '';

  @Output() imageCroppedEvent = new EventEmitter<string>();

  constructor(private matSnackbar: MatSnackBar) {}

  fileChangeEvent(event: any): void {
    const maxAllowedSize = 2 * 1024 * 1024;
    if (event.target.files[0].size > maxAllowedSize) {
      this.matSnackbar.open(
        'Imagen demasiado grande, tamaño máximo de 2MB.',
        null,
        {
          duration: 3000,
        },
      );
      return;
    }
    this.file = event.target.files[0];
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.imageCroppedEvent.emit(this.croppedImage);
  }

  loadImageFailed() {
    this.matSnackbar.open('Imagen inválida', null, {
      duration: 3000,
    });
  }
}
