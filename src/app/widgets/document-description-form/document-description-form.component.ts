import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-document-description-form',
  templateUrl: './document-description-form.component.html',
  styleUrls: ['./document-description-form.component.scss']
})
export class DocumentDescriptionFormComponent implements OnInit {

  @Input() descriptionFormGroup: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
