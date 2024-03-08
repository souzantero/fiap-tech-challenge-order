export type SignUpData = {
  username: string;
  password: string;
  email: string;
};

export interface Authenticator {
  singUp(data: SignUpData): Promise<void>;
}
