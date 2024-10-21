import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { LoginForm } from "../../../models/user-details";
import {
  mobileNumberValidator,
} from "../../../validators/custom-validation";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";


@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit, OnDestroy {
  errorMsg: string = "";
  errorFlag: boolean = false;
  credential: LoginForm = { mobileNumber: "" };
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
  ) {}


  handleOtpChange(otp: string): void {
    console.log('Entered OTP: ', otp);
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
  }

  onSubmit(): void {
    this.isSubmited = true;
    this.credential = this.form.value as LoginForm;
    this.otpSent = true;
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
    console.log(this.otp, "finalOTP-----")
     this.router.navigate(['user']);
  }

  backStep(): void {
    this.otpSent = false
  }
}
