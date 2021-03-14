export interface ResponseUser {
    id: string;
    email: string;
    name: string;
    profileUrl: string | null;
    introduction: string | null;
    nickname: string;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
}
