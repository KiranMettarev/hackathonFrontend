import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageLayout } from './view/layout/pageLayout';
import { PageLayoutService } from './view/layout/pageLayoutService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
   readonly pageLayout = PageLayout;

  constructor(public pageLayoutService: PageLayoutService) {}
  title = 'hackathonFrontend';
}
