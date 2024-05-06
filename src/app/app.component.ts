import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AvatarComponent } from './features/avatar/avatar.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AvatarComponent,
    RouterOutlet,
    HttpClientModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'AvaFrontUI';
}
