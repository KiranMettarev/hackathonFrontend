import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Subject, takeUntil } from "rxjs";
import { BlockStatus } from "../../../models/type";
import { File, FileState } from "../../../models/bank";
import { CourierService } from "../../../services/courier.service";
import { DocumentService } from "../../../services/documentservice";

@Component({
  selector: "app-upload",
  templateUrl: "./upload.component.html",
  styleUrl: "./upload.component.css",
})
export class UploadComponent {
  constructor(
    private sanitizer: DomSanitizer,
    private documentService: DocumentService,
    private courierService: CourierService,
  ) {}

  @ViewChild("fileInput") fileInput!: ElementRef;

  private destroy$ = new Subject<void>();
  private objectUrl: string | null = null;
  pdfSrc: SafeResourceUrl | null = null;
  @Input() block!: any;
  @Output() fileFlag = new EventEmitter();
  fileDummyClick(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
         this.fileFlag.emit(true)

    // const input = event.target as HTMLInputElement;
    // if (input.files && input.files.length > 0) {
    //   const file = input.files[0];
    //   if (file.type === "application/pdf") {
    //     this.loadFile(file);
    //     const formData = new FormData();
    //     formData.append("file", file);
    //     this.uploadFile(formData);
    //   } else {
    //     alert("Please select a PDF file.");
    //   }
    // }
  }

  loadFile(file: Blob): void {
    const reader = new FileReader();
    reader.onload = () => {
      const unsafePdfUrl = reader.result as ArrayBuffer;
      const blob = new Blob([unsafePdfUrl], { type: "application/pdf" });
      this.objectUrl = URL.createObjectURL(blob);

      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.objectUrl,
      );
    };
    reader.readAsArrayBuffer(file);
  }

  ngOnInit(): void {
    this.viewFile();
  }

  viewFile(): void {
    // if ((this.block.state as FileState)?.file?.id) {
    //   this.documentService
    //     .download({
    //       blockId: this.block.id,
    //       fileId: (this.block.state as FileState)?.file?.id,
    //     })
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe({
    //       next: (file) => {
    //         const files = new Blob([file], { type: "application/pdf" });
    //         this.loadFile(files);
    //       },
    //     });
    // }
  }
  uploadFile(file: FormData): void {
    if (file) {
      this.documentService
        .upload(this.block.id, file)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (file: File) => {
            if (this.block) this.block.state["file"] = file;
            this.courierService.notifyOther({
              file: file,
            });
            this.fileFlag.emit(true)
          },
        });
    }
  }
  setStatus(status: BlockStatus): void {
    // if (this.block?.id && status && this.block?.state) {
    //   this.block.status = status;
    //   this.blockService
    //     .updateBlock({
    //       id: this.block?.id,
    //       status: status,
    //       state: this.block?.state,
    //     })
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe({
    //       next: () => {
    //         alert(`file ${status} successfully `);
    //       },
    //     });
    // }
  }
  public get blockStatus(): typeof BlockStatus {
    return BlockStatus;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
  }
}
