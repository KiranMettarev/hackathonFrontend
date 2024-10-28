import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Analysis, BankStatementAnalysisStatus } from '../../../models/bank';
import { Subject, takeUntil } from 'rxjs';
import { LoadingService } from '../../../services/loadingService';
import { DocAPIService } from '../../../services/doc-api.service';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { StringOrNull } from '../../../models/user-details';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { mobileNumberValidator } from '../../../validators/custom-validation';
export type ConsentResponse = {
  consentHandleId: string;
  url: string;
  status: BankStatementAnalysisStatus;
};
@Component({
  selector: 'app-aa-integration',
  templateUrl: './aa-integration.component.html',
  styleUrl: './aa-integration.component.css',
})
export class AaIntegrationComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('iframe') iframeRef!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  @Input() isError = false;
  @Input() errorMessages: { [key: string]: string } = {};
  @Output() callback = new EventEmitter();
  @Output() aaFetchFlag = new EventEmitter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private timeoutId!: any;
  private destroy$ = new Subject<void>();
  isLoading = false;
  progress = 0;

  isSubmitted: boolean = false;
  isAlphabetFlag: boolean = false;
  formSubmitCall = false;

  constructor(
    private fb: FormBuilder,
    private docAPIService: DocAPIService,
    private loadingService: LoadingService,
    private sanitizer: DomSanitizer
  ) {
    this.contactNoForm = this.fb.group({
      mobNumber: ['', [Validators.required, mobileNumberValidator]],
    });
  }
  showIframe: boolean = false;
  baseUrl!: SafeResourceUrl;
  previousUrl: string = '';
  aaRequestData!: Analysis;
  contactNoForm: FormGroup<{ mobNumber: FormControl<StringOrNull> }>;

  ngOnInit(): void {
    this.loadingService.loadingState
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading) => (this.isLoading = isLoading));

    this.loadingService.progress
      .pipe(takeUntil(this.destroy$))
      .subscribe((progress) => (this.progress = progress));
  }

  ngAfterViewInit(): void {
    if (this.showIframe && this.iframeRef) {
      this.monitorIframeUrlChange();
    }
  }

  giveConsent(): void {
    if (this.contactNoForm.invalid) {
      this.formSubmitCall = true;
      return;
    }

    const mobileNumber = this.f['mobNumber'].value;

    this.docAPIService
      .consentAAData({ mobileNumber: mobileNumber })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (block: any) => {
          console.log('Fetched block:', block);

          const data = block.body;
          this.baseUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            data.url!
          );
          // console.log("Base URL set:", this.baseUrl);
          this.showIframe = true;
          this.previousUrl = this.baseUrl as string;
          setTimeout(() => {
            if (this.iframeRef) {
              this.aaRequestData = data.analysis;
              this.monitorIframeUrlChange();
              this.aaFetchFlag.emit(true);
            }
          }, 100);
        },
        error: (err) => {
          console.error('Error fetching data:', err);
          this.aaFetchFlag.emit(false);
        },
      });
    this.formSubmitCall = false;
  }

  monitorIframeUrlChange(): void {
    const iframe: HTMLIFrameElement = this.iframeRef.nativeElement;
    iframe.onload = () => {
      iframe.onload = () => {
        // console.log("Iframe loaded with URL:", iframe.src);
        if (iframe.src !== this.previousUrl) {
          // console.log("Iframe URL changed:", iframe.src);
          this.closeIframe();
        }
        this.previousUrl = iframe.src;
      };
    };
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

  get f(): { [key: string]: AbstractControl } {
    return this.contactNoForm.controls;
  }

  closeIframe(): void {
    this.showIframe = false;
    this.aaFetchFlag.emit(false);
    this.callback.emit({
      type: 'close',
      // data: this.aaRequestData,
    });
  }

  clearLoadingTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
  back(): void {
    this.callback.emit({ type: 'close' });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
