import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { BillState } from "../../../models/kyc";
import { DocRequest } from "../../../models/type";
import { Subject, takeUntil } from "rxjs";
import { FormErrorHandler } from "../../../validators/form-error-handler";
import { DocAPIService } from "../../../services/doc-api.service";
import { ElectricityProvider } from "../../../models/kyc";
import { electricityProviders } from "../../../models/electricityProviders";

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrl: './bill.component.css'
})
export class BillComponent {
  // @Input() block!: Block;
  @Output() callback = new EventEmitter();

  private destroy$ = new Subject<void>();
  electricityBillForm: FormGroup;
  errorMessages: { [key: string]: string } = {};
  electricityProviders: ElectricityProvider[] = [];
  isSubmitted: boolean = false;
  isAlphabetFlag: boolean = false;
  isLoading: boolean = false;
  loadingMsg: boolean = false;

  constructor(
    private fb: FormBuilder,
    private docService: DocAPIService,
  ) {
    this.electricityBillForm = this.fb.group({
      operatorCode: ["", Validators.required],
      customerId: [
        "",
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(13),
          Validators.pattern("^[0-9]*$"),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.electricityProviders = electricityProviders.data;
  }
  back(): void {
    this.callback.emit({ type: "close" });
  }
  getBill(billDetails: DocRequest): void {
    // this.docService
    //   .getBill(billDetails)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (block: Block) => {
    //       this.block = block;
    //       this.isSubmitted = false;
    //       this.callback.emit({
    //         type: "close",
    //         data: (this.block.state as BillState).electricityBill,
    //       });
    //       this.isLoading = false;
    //       this.isLoading = false;
    //     },
    //     error: (error) => {
    //       this.errorMessages = FormErrorHandler.handleServerErrors(
    //         error,
    //         this.electricityBillForm,
    //       );
    //       this.isLoading = false;
    //       this.isLoading = false;
    //     },
    //   });
  }
  fetchBill(): void {
    this.isSubmitted = true;
    Object.keys(this.electricityBillForm.controls).forEach((key) => {
      const control = this.electricityBillForm.get(key);
      if (control && typeof control.value === "string") {
        control.setValue(control.value.trim());
      }
    });
    if (this.electricityBillForm.valid) {
      this.isLoading = true;
      this.isLoading = true;
      const formValue = this.electricityBillForm.getRawValue();
      // const billParam: DocRequest = {
      //   blockId: this.block.id,
      //   ...formValue,
      // };
      // this.getBill(billParam);
    }
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
}

