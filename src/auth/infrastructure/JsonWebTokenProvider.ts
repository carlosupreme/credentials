import { IJWTProvider } from "../domain/IJWTProvider";
import { Claims } from "../domain/value-objects/Claims";
import jwt from "jsonwebtoken";
import JWTSettings from "./config/JWTSettings";
import { injectable } from "inversify";

@injectable()
export class JsonWebTokenProvider implements IJWTProvider {
  generate(payload: Claims): string {
    try {
      return jwt.sign(payload, JWTSettings.SECRET_KEY, {
        expiresIn: JWTSettings.EXPIRES_IN,
      });
    } catch (e) {
      console.log(e);
      return "";
    }
  }

  validate(token: string): Claims | undefined {
    try {
      const verified = jwt.verify(token, JWTSettings.SECRET_KEY);
      return verified as Claims;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }
}
