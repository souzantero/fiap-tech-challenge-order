export type SignUpData = {
  username: string;
  password: string;
  email: string;
};

export interface Authenticator {
  signUp(data: SignUpData): Promise<void>;
}
