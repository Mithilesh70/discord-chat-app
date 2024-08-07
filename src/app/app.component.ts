import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoaderService } from './core/service/loader.service';
import { LoaderComponent } from './shared/ui-component/loader/loader.component';
import { ChatService } from './core/service/chat.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Employee Management';
  constructor(
    public loaderService: LoaderService,
    private chatService: ChatService
  ) {}
  ngOnInit(): void {
    this.chatService.startConnection();
  }
}
