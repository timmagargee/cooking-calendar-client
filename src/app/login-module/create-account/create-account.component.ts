import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { ToastService } from 'src/app/services/toast.service';
import { stringIsFilled } from 'src/app/utilities/validation_helper';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
})
export class CreateAccountComponent {
  public formData: User = {};
  public loading = false;
  public submitted = false;
  public usernameErrors: Array<string> = [];

  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private toastService: ToastService
  ) {}

  public onSubmit() {
    this.accountService.createAccount(this.formData).subscribe((x) => {
      if (typeof x == 'boolean') {
        this.toastService.showToast('Registration successful');
        this.router.navigate(['home']);
      } else {
        this.usernameErrors = [x];
        this.loading = false;
      }
    });
  }

  public onUsernameInput(): void {
    this.usernameErrors = [];
  }

  public isValid(): boolean {
    return (
      stringIsFilled(this.formData.username) &&
      stringIsFilled(this.formData.password) &&
      stringIsFilled(this.formData.firstName) &&
      stringIsFilled(this.formData.lastName) &&
      stringIsFilled(this.formData.email)
    );
  }
}
