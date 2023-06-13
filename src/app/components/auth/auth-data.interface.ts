export interface AuthData {
    accessToken: string;
    user: {
        id: number;
        email: string;
        name: string;
        username: string;
        phone: string;
        website: string;
        address?: {};
        company?: {};
    };
}
