import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { stringIsFilled } from 'src/app/utilities/validation_helper';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  formData: User = {};
  loading = false;
  submitted = false;
  loginError = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit() {}

  public isValid(): boolean {
    return (
      stringIsFilled(this.formData.username) &&
      stringIsFilled(this.formData.password)
    );
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (!this.isValid()) {
      return;
    }

    this.loading = true;
    this.accountService.login(this.formData).subscribe({
      next: () => {
        // get return url from query parameters or default to home page
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: (error) => {
        this.loginError = true;
        this.loading = false;
      },
    });
  }

  public goToAccountCreation() {
    this.router.navigate(['login/create']);
  }
}
