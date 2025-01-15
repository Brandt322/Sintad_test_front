import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from '@core/loader/loader.component';
import { LoaderService } from '@core/loader/loader.service';
import { ToastComponent } from '@core/toast/toast.component';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent, CommonModule, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'sintad_test_front';

  constructor(public loader: LoaderService) { }

  ngOnInit(): void {
    initFlowbite();
  }
}
