import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { HotKeyService } from './services/het-keys.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'INSER';

  constructor(private hotKeyService: HotKeyService) {}

  ngOnInit() {
    this.hotKeyService
      .addShortcut({ keys: 'control.k' })
      .pipe(take(2))
      .subscribe(console.log);
  }
}
