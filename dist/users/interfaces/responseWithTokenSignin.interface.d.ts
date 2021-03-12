export interface ResponseWithTokenSignin {
    data: {
        accessToken: string;
    };
    user: {
        id: string;
        profileUrl: string;
    };
    message: string;
}
