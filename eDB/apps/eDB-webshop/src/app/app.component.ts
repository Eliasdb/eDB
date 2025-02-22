import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountService } from '@eDB-webshop/client-account';
import { CartService } from '@eDB-webshop/client-cart';
import { Book } from '@eDB-webshop/shared-types';
import { HeaderComponent } from '../components/header/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header [headerBackgroundColour]="headerBackgroundColour" />
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  headerBackgroundColour: string = ' white';
  title = 'Library management';
  showHeaderFooter: boolean = true;
  private accountService = inject(AccountService);
  private cartService = inject(CartService);

  ngOnInit(): void {
    // this.setCurrentUser();
    this.setCart();
    // this.setToken();
    // this.setUserId();
  }

  // setCurrentUser() {
  //   const userString = localStorage.getItem('user');
  //   if (!userString) return;
  //   const user: string = JSON.parse(userString);
  //   this.accountService.setCurrentUser(user);
  // }

  // setUserId() {
  //   const userId = localStorage.getItem('id');
  //   if (!userId) return;
  //   const finalUserId: number = Number(JSON.parse(userId));
  //   this.cartService.setCurrentUserId(finalUserId);
  //   console.log(this.cartService.userId$.getValue());
  //   // localStorage.removeItem('id');
  // }

  // setToken() {
  //   const tokenString = localStorage.getItem('token');
  //   if (!tokenString) return;
  //   const token: string = JSON.parse(tokenString);
  //   this.accountService.setCurrentToken(token);
  //   // localStorage.removeItem('token');
  // }

  setCart() {
    const cartString = localStorage.getItem('cart');
    if (!cartString) return;
    const cart: Book[] = JSON.parse(cartString);
    this.cartService.setCurrentCart(cart);
  }
}
