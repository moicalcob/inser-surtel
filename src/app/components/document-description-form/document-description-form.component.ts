import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-document-description-form',
  templateUrl: './document-description-form.component.html',
  styleUrls: ['./document-description-form.component.scss'],
})
export class DocumentDescriptionFormComponent {
  @Input() descriptionFormGroup: UntypedFormGroup;

  units = [
    {
      text: 'Unidades',
      value: 'uds',
    },
    {
      text: 'Mililítros',
      value: 'ml',
    },
    {
      text: 'Gramos',
      value: 'g',
    },
  ];

  constructor() {}
}
