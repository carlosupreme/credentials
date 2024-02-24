export class AuthenticationResponse {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly token: string
  ) {}
}
