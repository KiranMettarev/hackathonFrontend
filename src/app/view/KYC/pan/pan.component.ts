import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { DocRequest } from "../../../models/type";
import { FormErrorHandler } from "../../../validators/form-error-handler";


import { Subject, takeUntil } from "rxjs";
import { PanState } from "../../../models/kyc";
import { DocAPIService } from "../../../services/doc-api.service";

@Component({
  selector: 'app-pan',
  templateUrl: './pan.component.html',
  styleUrl: './pan.component.css'
})
export class PanComponent {
  @Output() callback = new EventEmitter();
  @Output() panInfo = new EventEmitter();

  private destroy$ = new Subject<void>();
  errorMessages: { [key: string]: string } = {};
  isSubmitted: boolean = false;
  isLoading: boolean = false;
  loadingMsg: boolean = false;
  panForm: FormGroup;
  panDetails!: PanState
  constructor(
    private fb: FormBuilder,
    private docService: DocAPIService,
  ) {
    this.panForm = this.fb.group({
      panNumber: [
        "",
        // [Validators.required, Validators.pattern("[A-Z]{5}[0-9]{4}[A-Z]{1}")],
        [Validators.required],
      ],
    });
  }

  ngOnInit(): void {
    this.panForm.controls["panNumber"].valueChanges.subscribe((value) => {
      const uppercasedValue = value.toUpperCase();
      if (value !== uppercasedValue) {
        this.panForm.controls["panNumber"].setValue(uppercasedValue, {
          emitEvent: false,
        });
      }
    });
  }

  back(): void {
    this.callback.emit({ type: "close" });
  }
  getPanDetails(reqParam: DocRequest): void {
    // this.docService
    //   .getPanDetails(reqParam)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (block: Block) => {
    //       this.block = block;
    //       this.isSubmitted = false;
    //       this.callback.emit({
    //         type: "close",
    //         data: (this.block.state as PanState).pan,
    //       });
    //       this.isLoading = false;
    //       this.loadingMsg = false;
    //     },
    //     error: (error) => {
    //       this.errorMessages = FormErrorHandler.handleServerErrors(
    //         error,
    //         this.panForm,
    //       );
    //       this.isLoading = false;
    //       this.loadingMsg = false;
    //     },
    //   });
  }
  fetchDetails(): void {
    this.isSubmitted = true;
    Object.keys(this.panForm.controls).forEach((key) => {
      const control = this.panForm.get(key);
      if (control && typeof control.value === "string") {
        control.setValue(control.value.trim());
      }
    });
    if (this.panForm.valid) {
      this.isLoading = true;
      this.loadingMsg = true;
      const formValue = this.panForm.getRawValue();
      // const reqParam: DocRequest = {
      //   blockId: this.block.id,
      //   ...formValue,
      // };
      // this.getPanDetails(reqParam);
    }
  }
panNumber!: string 

  fetchPan(){
    const formValue = this.panForm.getRawValue();
      this.panNumber = formValue.panNumber;
      const panObj = {
         'panNumber': this.panNumber
      }

    this.docService.getPanDetails( panObj ).subscribe(
      (response) => {
        if (response) {
          this.panDetails = response.data.state.pan;
          this.panInfo.emit(this.panDetails)
          this.callback.emit({
            type: "close",
          });
        }
      },
      (error) => {
        console.log(error, "errorrrrrrrrrrr");
      },
    );
  }
}

