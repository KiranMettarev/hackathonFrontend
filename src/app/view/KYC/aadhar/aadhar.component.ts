import { Component, EventEmitter, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { DocRequest } from "../../../models/type";
import { StringOrNull } from "../../../models/user-details";
import { DocAPIService } from "../../../services/doc-api.service";
import { AdharState } from "../../../models/kyc";
import { interval, Subscription, take } from "rxjs";
import { FormErrorHandler } from "../../../validators/form-error-handler";

@Component({
  selector: 'app-aadhar',
  templateUrl: './aadhar.component.html',
  styleUrl: './aadhar.component.css'
})
export class AadharComponent {
  @Output() callback = new EventEmitter();
  // @Input() block!: Block;
  back(): void {
    this.callback.emit({ type: "close" });
  }
  aadhaarForm!: FormGroup<{ adhaarNumber: FormControl<StringOrNull> }>;
  otpForm!: FormGroup;
  aadhaarDetails!: AdharState;
  otpSent: boolean = false;
  resendOtpEnabled = false;
  countdown = 60;
  countdownSubscription!: Subscription;
  adhaarNumber: StringOrNull = "";
  errorMessages: { [key: string]: string } = {};
  isSubmitted: boolean = false;
  isAlphabetFlag: boolean = false;
  isLoading: boolean = false;
  loadingMsg: boolean = false;
  constructor(
    private fb: FormBuilder,
    private docService: DocAPIService,
  ) {}

  ngOnInit(): void {
    this.aadhaarForm = this.fb.group({
      adhaarNumber: [
        "",
        [Validators.required, Validators.pattern("^[2-9]{1}[0-9]{11}$")],
      ],
    });

    this.otpForm = this.fb.group({
      otp: [
        "",
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
    });
  }

  requestOtp(): void {
    if (this.aadhaarForm.valid) {
      this.isLoading = true;
      this.loadingMsg = true;
      const formValue = this.aadhaarForm.getRawValue();
      this.adhaarNumber = formValue.adhaarNumber;
      const reqParam: any = {
        // blockId: this.block.id,
        ...formValue,
      };

      this.docService.getAadharOTP(reqParam).subscribe(
        () => {
          this.otpSent = true;
          this.isLoading = false;
          this.loadingMsg = false;
          this.startResendOtpTimer();
        },
        (error) => {
          this.errorMessages = FormErrorHandler.handleServerErrors(
            error,
            this.aadhaarForm,
          );
          this.otpSent = false;
          this.isLoading = false;
          this.loadingMsg = false;
        },
      );
    }
  }

  verifyAndFetchDetails(): void {
    this.isSubmitted = true;
    if (this.otpForm.valid) {
      this.isLoading = true;
      this.loadingMsg = true;
      const formValue = this.otpForm.getRawValue();
      const reqParam: DocRequest = {
        // blockId: this.block.id,
        adhaarNumber: this.adhaarNumber,
        ...formValue,
      };
      this.docService.getAadhar(reqParam).subscribe(
        (response) => {
          if (response) {
            this.aadhaarDetails = response.state;
            this.isSubmitted = false;
            this.isLoading = false;
            this.loadingMsg = false;

            this.callback.emit({
              type: "close",
              data: this.aadhaarDetails.aadhar,
            });
          }
        },
        (error) => {
          this.errorMessages = FormErrorHandler.handleServerErrors(
            error,
            this.otpForm,
          );
          this.isLoading = false;
          this.loadingMsg = false;
        },
      );
    }
  }

  startResendOtpTimer(): void {
    this.resendOtpEnabled = false;
    this.countdown = 60;

    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }

    this.countdownSubscription = interval(1000)
      .pipe(take(60))
      .subscribe({
        next: () => {
          this.countdown--;
          if (this.countdown === 0) {
            this.resendOtpEnabled = true;
          }
        },
        complete: () => {
          this.resendOtpEnabled = true;
        },
      });
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

  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }
}

