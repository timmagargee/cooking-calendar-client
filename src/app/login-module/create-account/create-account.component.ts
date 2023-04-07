import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
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
  formData: User = {};
  loading = false;
  submitted = false;

  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private toastService: ToastService
  ) {}

  public onSubmit() {
    this.accountService
      .createAccount(this.formData)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastService.showToast('Registration successful');
          this.router.navigate(['../login'], { relativeTo: this.route });
        },
        error: (error) => {
          this.toastService.showToast(error);
          this.loading = false;
        },
      });
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
