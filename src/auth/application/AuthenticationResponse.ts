export class AuthenticationResponse {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly photo: string,
    readonly token: string
  ) {}
}
