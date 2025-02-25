export interface CartItem {
  id: number;
  photoUrl: string;
  customerId: number;
  title: string;
  author: string;
  status: string;
  addedDate: Date;
  publishedDate: Date;
  lastLoanedDate: Date;
}
