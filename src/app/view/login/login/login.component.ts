import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { LoginForm, MobileNumber } from "../../../models/user-details";
import {
  mobileNumberValidator,
} from "../../../validators/custom-validation";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { NgOtpInputComponent } from "ng-otp-input";


@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit, OnDestroy {

   @ViewChild(NgOtpInputComponent, { static: false }) otpInput!: NgOtpInputComponent; 
   
  errorMsg: string = "";
  errorFlag: boolean = false;
  credential: LoginForm = { mobileNumber: "", otp: ""};
  mobileNumber!: MobileNumber ;
  mobileNumberErrorMsg = "";
  passwordErrorMsg = "";
  mobileNumberErrFlg: boolean = false;
  pwdErrFlg: boolean = false;
  hidePassword: boolean = true;
  isSubmited: boolean = false;
  isAlphabetFlag: boolean = false;
  otpSent: boolean = false;
   otpLength: number = 4;
   otp!: string


  private subscription = new Subscription();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}


  handleOtpChange(otp: string): void {
    // console.log('Entered OTP: ', otp);
    this.otp = otp
  }

  form = this.formBuilder.group({
    mobileNumber: ["", [Validators.required, mobileNumberValidator]],
  });

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
     this.otp = ''
      this.subscription.add(
      this.authService.currentLoggedInUser().subscribe({
        next: (userState) => {
          this.router.navigate(['user']);
        },
        error: () => {},
      }),
    );
  }

  onSubmit(): void {
    this.isSubmited = true;
    this.mobileNumber = this.form.value.mobileNumber!;
    this.otpSent = true;

    if (this.form.valid) {
      this.authService.generateOTP(this.mobileNumber).subscribe({
        next: (otp) => {
          console.log(otp, "otp")
          this.autoFillOtp(otp.otp)
          this.credential = {
            mobileNumber : this.mobileNumber,
            otp : otp.otp
          }
        },
        error: ({ error }) => {
          console.log(error, "error---")
          this.errorMsg = error?.data[0].message;
          this.errorFlag = true;
        },
      });
    }
  }

  autoFillOtp(otp: string) {
  if (this.otpInput) {
    this.otpInput.setValue(otp);
  }
}

  onInputChange(): void {
    this.errorFlag = false;
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  isNumberKey(evt: KeyboardEvent): boolean {
    const charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      this.isAlphabetFlag = false;
      return true;
    }
    evt.preventDefault();
    this.isAlphabetFlag = true;
    return false;
  }

  verifyAndFetchDetails(): void {
    // console.log(this.otp, "finalOTP-----")
     this.router.navigate(['user']);

     if (this.form.valid) {
      this.authService.login( this.credential ).subscribe({
        next: (res) => {
          console.log(res, "responce----")
        },
        error: ({ error }) => {
          console.log(error, "error---")
          this.errorMsg = error?.data[0].message;
          this.errorFlag = true;
        },
      });
    }
  }

  backStep(): void {
    this.otpSent = false
  }
}
