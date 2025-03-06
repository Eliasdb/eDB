// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';

// @Component({
//   selector: 'app-auth-callback',
//   template: `<p>Logging in...</p>`,
// })
// export class AuthCallbackComponent implements OnInit {
//   constructor(
//     private route: ActivatedRoute,
//     private http: HttpClient,
//     private router: Router,
//   ) {}

//   ngOnInit() {
//     const code = this.route.snapshot.queryParams['code'];

//     if (!code) {
//       console.error('No authorization code found.');
//       this.router.navigate(['/login']);
//       return;
//     }

//     console.log('Authorization Code:', code);

//     // Prepare request body as Form URL Encoded
//     const body = new HttpParams()
//       .set('client_id', 'edb-app')
//       .set('client_secret', 'q2TAcbE7PzfUZCebXoumCuZj0afRTfyb') // Store securely in env
//       .set('grant_type', 'authorization_code')
//       .set('code', code) // ✅ Use dynamic code from URL
//       .set('redirect_uri', 'http://localhost:4200/callback');

//     // Exchange authorization code for access token
//     this.http
//       .post('/realms/EDB/protocol/openid-connect/token', body.toString(), {
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         withCredentials: true,
//       })
//       .subscribe({
//         next: (response: any) => {
//           console.log('✅ Token Exchange Successful:', response);

//           // Store the access token (can use localStorage or sessionStorage)
//           localStorage.setItem('access_token', response.access_token);

//           // Redirect to home/dashboard
//           this.router.navigate(['/']);
//         },
//         error: (error) => {
//           console.error('❌ Token Exchange Failed:', error);
//           this.router.navigate(['/login']);
//         },
//       });
//   }
// }
