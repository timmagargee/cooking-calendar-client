import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { ToastService } from 'src/app/services/toast.service';
import { stringIsFilled } from 'src/app/utilities/validation_helper';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  formData: User = {};
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private toastService: ToastService
  ) {}

  public isValid(): boolean {
    return (
      stringIsFilled(this.formData.username) &&
      stringIsFilled(this.formData.password)
    );
  }

  onSubmit() {
    // stop here if form is invalid
    if (!this.isValid()) {
      return;
    }

    this.loading = true;
    this.accountService.login(this.formData).subscribe((x) => {
      if (x) {
        // get return url from query parameters or default to home page
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      } else {
        this.toastService.showToast('Username/Password does not exist');
      }
      this.loading = false;
    });
  }

  public goToAccountCreation() {
    this.router.navigate(['login/create']);
  }
}
