import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Observable } from "rxjs";
import { BlockFileId, File } from "../models/bank";

@Injectable({
  providedIn: "root",
})
export class DocumentService {
  constructor(private httpService: HttpService) {}
  upload(blockid: string, file: FormData): Observable<File> {
    return this.httpService.postFile("file/" + blockid, file);
  }

  download(blockFileId: BlockFileId): Observable<ArrayBuffer> {
    return this.httpService.getFile("file", {
      blockId: blockFileId.blockId,
      fileId: blockFileId.fileId,
    });
  }
  exports(caseId: string): Observable<ArrayBuffer> {
    return this.httpService.getFile("files", {
      caseId,
    });
  }
}
