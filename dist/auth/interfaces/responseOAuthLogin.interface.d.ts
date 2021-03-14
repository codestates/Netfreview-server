import { ResponseUser } from 'src/users/interfaces/reponseUser.interface';
export interface ResponseOAuthLogin {
    user: ResponseUser;
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}
