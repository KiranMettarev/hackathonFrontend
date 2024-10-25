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
} from "@angular/core";
import {
  Analysis,
  BankState,
  BankStatementAnalysisStatus,
} from "../../../models/bank";
import { Subject, takeUntil } from "rxjs";
import { LoadingService } from "../../../services/loadingService";
import { DocAPIService } from "../../../services/doc-api.service";
import ApexCharts from "apexcharts";

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { StringOrNull } from "../../../models/user-details";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { mobileNumberValidator } from "../../../validators/custom-validation";
export type ConsentResponse = {
  consentHandleId: string;
  url: string;
  status: BankStatementAnalysisStatus;
};
@Component({
  selector: "app-aa-integration",
  templateUrl: "./aa-integration.component.html",
  styleUrl: "./aa-integration.component.css",
})
export class AaIntegrationComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild("iframe") iframeRef!: ElementRef;

  // @Input() block!: Block;
  @Input() isError = false;
  @Output() callback = new EventEmitter();
  @Output() aaFetchFlag = new EventEmitter();

  @ViewChild("fileInput") fileInput!: ElementRef;
  @Input() errorMessages: { [key: string]: string } = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private timeoutId!: any;
  private destroy$ = new Subject<void>();
  isLoading = false;
  progress = 0;

  isSubmitted: boolean = false;
  isAlphabetFlag: boolean = false;
  formSubmitCall = false;
  options:any = {};
  chart: any;

  constructor(
    private fb: FormBuilder,
    private docAPIService: DocAPIService,
    private loadingService: LoadingService,
    private sanitizer: DomSanitizer,
  ) {
    this.contactNoForm = this.fb.group({
      mobNumber: ["", [Validators.required, mobileNumberValidator]],
    });
  }
  showIframe: boolean = false;
  baseUrl!: SafeResourceUrl;
  previousUrl: string = "";
  aaRequestData!: Analysis;
  contactNoForm: FormGroup<{ mobNumber: FormControl<StringOrNull> }>;

  ngOnInit(): void {
     
    this.loadingService.loadingState
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading) => (this.isLoading = isLoading));

    this.loadingService.progress
      .pipe(takeUntil(this.destroy$))
      .subscribe((progress) => (this.progress = progress));

  //  setTimeout(() => {
  //      this.initChartData()
  //  }, 1000);
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

    const mobileNumber = this.f["mobNumber"].value;

    // this.docAPIService
    //   .getAA({
    //     // blockId: this.block.id,
    //     mobileNumber: mobileNumber,
    //   })
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (block: any) => {
    //       console.log("Fetched block:", block);
    //       const data = block.state as BankState;
    //       this.baseUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    //         data.analysis.url!,
    //       );
    //       console.log("Base URL set:", this.baseUrl);
    //       this.showIframe = true;
    //       this.previousUrl = this.baseUrl as string;
    //       setTimeout(() => {
    //         if (this.iframeRef) {
    //           this.aaRequestData = data.analysis;
    //           this.monitorIframeUrlChange();
    //         }
    //       }, 100);
    //     },
    //     error: (err) => {
    //       console.error("Error fetching data:", err);
    //     },
    //   });
// --------------------------------

    this.docAPIService
      .consentAAData({ mobileNumber: mobileNumber })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (block: any) => {

          console.log("Fetched block:", block);

          const data = block.body;
          this.baseUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            data.url!,
          );
          console.log("Base URL set:", this.baseUrl);
          this.showIframe = true;
          this.previousUrl = this.baseUrl as string;
          setTimeout(() => {
            if (this.iframeRef) {
              this.aaRequestData = data.analysis;
              this.monitorIframeUrlChange();
               this.aaFetchFlag.emit(true)
            }
          }, 100);
        },
        error: (err) => {
          console.error("Error fetching data:", err);
          this.aaFetchFlag.emit(false)
        },
      });
    this.formSubmitCall = false;
  }

  monitorIframeUrlChange(): void {
    const iframe: HTMLIFrameElement = this.iframeRef.nativeElement;
    iframe.onload = () => {
      iframe.onload = () => {
        console.log("Iframe loaded with URL:", iframe.src);
        if (iframe.src !== this.previousUrl) {
          console.log("Iframe URL changed:", iframe.src);
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
    this.aaFetchFlag.emit(false)
    this.callback.emit({
      type: "close",
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
    this.callback.emit({ type: "close" });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  // initChartData(): void {
  //   console.error('Chart Load Call')
  //   this.options = {
  //     series: [{
  //       name: 'Total Debit',
  //       data: ['81578.5', '81862.14', '705768.97', '279885.39','78501.18', '144600.03', '0']
  //     },{
  //         name: 'Total Credit',
  //         data: ['81703.25', '130483', '949453', '1819','65811', '228708', '306']
  //     },{
  //       name: 'Average Monthly Balances',
  //       data: ['604.57', '49225.43', '292909.46', '14843.07','2152.89', '86260.86', '86566.86']
  //   }],
  //     chart: {
  //     height: '400px',
  //     width: '350px',
  //     // type: 'line',
  //     type: 'area',
  //     zoom: {
  //       enabled: false
  //     },
  //     toolbar: {
  //       show: true,
  //       tools: {
  //         download: false,
  //         selection:false,
  //         pan:false,
  //         reset:false,
  //         zoom:false,
  //       }
  //     }
  //     },
  //     dataLabels: {
  //       enabled: false
  //     },
      
  //     stroke: {
  //       //  curve: 'straight',
  //       curve:'smooth',
  //       show:true,
  //       width: 2,
  //     },
  //     markers: {
  //       size: 4,
  //       colors: '#fff',
  //       strokeColors: ['#008ffb','#00e396','#feb019'],
  //       strokeWidth: 2,
  //       strokeOpacity: 0.9,
  //       strokeDashArray: 0,
  //       fillOpacity: 1,
  //       discrete: [],
  //       shape: "circle",
  //       offsetX: 0,
  //       offsetY: 0,
  //       onClick: undefined,
  //       onDblClick: undefined,
  //       showNullDataPoints: true,
  //       hover: {
  //         size: undefined,
  //         sizeOffset: 2
  //       }
  //   },
  //     title: {
  //       text: '',
  //       align: 'left'
  //     },
  //     grid: {
  //       strokeDashArray: 4,
  //       xaxis: {
  //           lines: {
  //               show: false
  //           }
  //       },
  //       row: {
  //         opacity: 0.5
  //       },
  //     },
  //     legend: { show: true,position:'top',horizontalAlign:'right' },
  //     xaxis: {
  //       labels: {
  //         rotate: 0
  //       },
  //       categories: ["Oct 2022", "Nov 2022", "Dec 2022", "Jan 2023","Feb 2023", "Mar 2023", "Apr 2023"],  
  //     },
  //     tooltip: {
  //       // y: {
  //       //   formatter: (value:any) => { if(value != null || value != undefined){return value + '$' }}
  //       // },
  //     }
  //   };
  //       this.chart = new ApexCharts(document.querySelector("#chartnew"), this.options);
  //       this.chart.render();
  // }
}

