import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { ShortcutDialogComponent } from './components/shortcut-dialog/shortcut-dialog.component';
import { HotKeyService } from './services/het-keys.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'INSER';

  shortcutDialogOpened = false;

  constructor(
    private hotKeyService: HotKeyService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.hotKeyService.addShortcut({ keys: 'control.k' }).subscribe(() => {
      if (!this.shortcutDialogOpened) {
        this.openShorcutDialog();
      }
    });
  }

  openShorcutDialog() {
    const dialog = this.dialog.open(ShortcutDialogComponent, {
      width: '60vw',
    });
    this.shortcutDialogOpened = true;
    dialog.afterClosed().subscribe(() => {
      this.shortcutDialogOpened = false;
    });
  }
}
