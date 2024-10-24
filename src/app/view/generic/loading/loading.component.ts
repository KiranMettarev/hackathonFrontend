import { Component, Input } from "@angular/core";

@Component({
 selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {
  @Input() isLoading: boolean = false;
  @Input() progress: number = 0;
  @Input() loadingMsg: boolean = false;
  @Input() msg: string = '';
  @Input() ismsg: boolean = false;
}
