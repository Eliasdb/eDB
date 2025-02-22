export interface Post {
  id?: number;
  userId?: number;
  username?: string;
  photoUrl?: string;
  content: string;
  creationDate?: Date;
  comments?: Comment[];
}

export interface Comment {
  postId: number | undefined;
  poster: string;
  content: string;
  photoUrl: string;
}
