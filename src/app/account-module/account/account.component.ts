import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subject, of, startWith, switchMap } from 'rxjs';
import { ActionType } from 'src/app/models/enums/action-type';
import { AccountService } from 'src/app/services/account.service';
import { ToastService } from 'src/app/services/toast.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { DialogButtons } from 'src/app/shared/models/dialog-buttons';
import { DialogData, GetDeleteDialog } from 'src/app/shared/models/dialog-data';
import { DialogResult } from 'src/app/shared/models/dialog-result';
import { DayOptions } from 'src/app/utilities/list_constants';
import { stringIsFilled } from 'src/app/utilities/validation_helper';
import { AccountSettingsService } from '../account-setting.service';
import { ChangePasswordDto } from '../models/change-password-dto';
import { UserSettingsDto } from '../models/user-settings-dto';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  @ViewChild('changePassword', { static: true })
  public changePasswordTemplate!: TemplateRef<any>;

  public refreshData = new Subject<void>();
  public settings!: UserSettingsDto;
  public loading = true;
  public isEditing = false;
  public labelWidth = '75px';
  public initialSettings!: UserSettingsDto;
  public dayOptions = DayOptions;
  public overrideRecipeServings = false;

  public usernameErrors: Array<string> = [];

  public changePasswordForm: ChangePasswordDto = {
    oldPassword: '',
    newPassword: '',
  };

  public passwordFormError: string = '';

  public constructor(
    public service: AccountSettingsService,
    private accountService: AccountService,
    private dialogService: DialogService,
    private toastService: ToastService
  ) {}

  public ngOnInit(): void {
    this.refreshData
      .pipe(
        startWith(null),
        switchMap(() => this.service.getSettings())
      )
      .subscribe((x) => {
        this.settings = x;
        this.initialSettings = { ...this.settings };
        this.loading = false;
        this.initializeValues();
      });
  }

  public startEditing(): void {
    this.isEditing = true;
  }

  public onSave(): void {
    if (!this.overrideRecipeServings) {
      this.settings.defaultServings = undefined;
    }

    this.service
      .getDoesUsernameExist(this.settings.username)
      .pipe(
        switchMap((x) => {
          if (x) {
            this.usernameErrors = ['Username Already Exists'];
            return of(undefined);
          } else {
            return this.service.updateSettings(this.settings);
          }
        })
      )
      .subscribe((x: boolean | undefined) => {
        if (typeof x == 'boolean') {
          this.toastService.showActionToast(ActionType.update, x);

          if (x) {
            this.refreshData.next();
            this.isEditing = false;
          }
        }
      });
  }

  public onCancel(): void {
    this.settings = { ...this.initialSettings };
    this.isEditing = false;
    this.usernameErrors = [];
    this.initializeValues();
  }

  public onLogout(): void {
    this.accountService.logout();
  }

  public onUsernameInput(): void {
    this.usernameErrors = [];
  }

  public onChangePassword(): void {
    const dialogData: DialogData = {
      title: 'Update Meal',
      template: this.changePasswordTemplate,
      buttons: DialogButtons.YesCancel,
      width: '400px',
      yesButtonText: 'Save',
      validityCallback: (): boolean => {
        return (
          this.changePasswordForm.oldPassword.trim() != '' &&
          this.changePasswordForm.newPassword != '' &&
          this.changePasswordForm.oldPassword.trim() !=
            this.changePasswordForm.newPassword.trim()
        );
      },
    } as DialogData;

    this.dialogService
      .display(dialogData)
      .pipe(
        switchMap((dialogResult) => {
          if (dialogResult === DialogResult.yes) {
            return this.accountService.changePassword(this.changePasswordForm);
          }
          return of(undefined);
        })
      )
      .subscribe((x) => {
        if (typeof x == 'string') {
          this.passwordFormError = x;
          this.toastService.showActionToast(ActionType.update, false);
          this.onChangePassword();
        } else if (x) {
          this.passwordFormError = '';
          this.toastService.showActionToast(ActionType.update, true);
        }
      });
  }

  public onDelete(): void {
    this.dialogService
      .display(GetDeleteDialog('account'))
      .pipe(
        switchMap((dialogResult) => {
          if (dialogResult === DialogResult.yes) {
            return this.service.deleteUser();
          }
          return of(undefined);
        })
      )
      .subscribe((x) => {
        if (x !== undefined) {
          this.toastService.showActionToast(ActionType.delete, x);
          if (x) {
            this.onLogout();
          }
        }
      });
  }

  public isValid(): boolean {
    return (
      stringIsFilled(this.settings.username) &&
      stringIsFilled(this.settings.firstName) &&
      stringIsFilled(this.settings.lastName) &&
      stringIsFilled(this.settings.email) &&
      (!this.overrideRecipeServings || (this.settings.defaultServings ?? 0) > 0)
    );
  }

  private initializeValues(): void {
    this.overrideRecipeServings = this.settings.defaultServings != undefined;
  }
}
