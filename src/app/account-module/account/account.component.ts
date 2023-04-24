import { Component, OnInit } from '@angular/core';
import { AccountSettingsService } from '../account-setting.service';
import { UserSettingsDto } from '../models/user-settings-dto';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  public settings!: UserSettingsDto;
  public loading = true;
  public constructor(public service: AccountSettingsService) {}

  public ngOnInit(): void {
    this.service.getSettings().subscribe((x) => {
      this.settings = x;
      this.loading = false;
    });
  }
}
