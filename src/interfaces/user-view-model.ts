export interface userViewModel {
    user: {
        id: string;
        email: string;
        isActivated: boolean;
    };
    accessToken: string;
    refreshToken: string;
}
