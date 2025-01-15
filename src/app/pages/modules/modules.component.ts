import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modules',
  standalone: true,
  imports: [],
  templateUrl: './modules.component.html',
  styleUrl: './modules.component.css'
})
export class ModulesComponent implements OnInit {
  username: string = '';
  roles: string[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    const sessionData = sessionStorage.getItem('user_data');
    if (sessionData) {
      const storedObject = JSON.parse(sessionData);
      const { userPrincipal, authorities } = storedObject;
      const { username } = userPrincipal;
      this.roles = authorities[0];
      this.username = username;
      console.log('roles:', this.roles);
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
