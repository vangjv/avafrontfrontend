import { Routes } from '@angular/router';
import { AvatarComponent } from './features/avatar/avatar.component';
import { RestaurantComponent } from './features/restaurant/restaurant.component';
import { AuthenticationComponent } from './features/authentication/authentication.component';
import { SalesComponent } from './features/sales/sales.component';

export const routes: Routes = [
  { path: '', component: AvatarComponent },
  { path: 'restaurant', component: RestaurantComponent },
  { path: 'authentication', component: AuthenticationComponent },
  { path: 'sales', component: SalesComponent }
];
