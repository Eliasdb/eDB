import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  imports: [RouterLink],
  template: `
    <h1 style="margin-top: 16rem;">Welcome to the Admin Home Page!!!!!</h1>
    <a routerLink="/dashboard">To dashboard</a>
  `,
})
export class AdminHomeComponent {}
