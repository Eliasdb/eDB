import { Book } from './book';

export interface User {
  id?: number;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  userName?: string;
  name?: string;
  accessToken?: string;
  books?: Book[];
  favourites?: Book[];
}

export interface FavouriteD {
  favourited: null | boolean;
  id: number | undefined;
}
