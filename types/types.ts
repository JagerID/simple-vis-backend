export interface User {
  id: number;
  email: string;
  role: string;
}

export interface RefreshToken {
  token: string;
  exp: Date;
  userId: number;
}

export interface Vector {
  id: number;
  name: string;
  geom: any;
}
