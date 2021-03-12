import { User } from 'src/entity/User.entity';

export interface ResponseWithTokenSignin {
  data: {
    accessToken: string;
  };
  user: User;
  message: string;
}
