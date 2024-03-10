export interface Authorizer {
  authorize(accessToken: string): Promise<string>;
}
