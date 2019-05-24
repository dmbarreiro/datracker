export interface AuthData {
    email: string;
    password: string;
    // Need weight and birthdate for creating user document
    // in our database during sign up.
    weight?: number;
    birthdate?: Date;
}
