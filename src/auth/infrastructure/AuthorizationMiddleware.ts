import { NextFunction, Request, Response } from "express";
import { IJWTProvider } from "../domain/IJWTProvider";
import { Container } from "inversify";
import { constants } from "../../app/constants";
import PDBuilder from "problem-details-http";
import { container } from "../../app/ioc";
import { interfaces } from "inversify-express-utils";
import { Claims } from "../domain/value-objects/Claims";

class Principal implements interfaces.Principal {
  constructor(public details: Claims) {}

  isAuthenticated(): Promise<boolean> {
    return Promise.resolve(true);
  }

  isResourceOwner(_resourceId: any): Promise<boolean> {
    return Promise.resolve(true);
  }

  isInRole = async (_role: string): Promise<boolean> => {
    return this.details.isAdmin;
  };
}

class AuthorizationMiddleware {
  readonly jwtProvider: IJWTProvider;

  constructor(private container: Container) {
    this.jwtProvider = this.container.get<IJWTProvider>(constants.IJWTProvider);
  }

  admin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const httpContext: interfaces.HttpContext = Reflect.getMetadata(
        "inversify-express-utils:httpcontext",
        req
      );

      if (!(await httpContext.user.isInRole(""))) throw {};

      next();
    } catch (error) {
      const pb = PDBuilder.fromDetail("You cannot use this resource.")
        .status403()
        .build();
      res.status(pb.status).json(pb.toJson());
    }
  };

  authenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let token = "";
      const authorization = req.headers.authorization;

      const httpContext: interfaces.HttpContext = Reflect.getMetadata(
        "inversify-express-utils:httpcontext",
        req
      );

      if (authorization && authorization.toLowerCase().startsWith("bearer")) {
        token = authorization.substring(7);
      }

      const claims = this.jwtProvider.validate(token);

      if (claims == undefined) throw {};

      httpContext.user = new Principal(claims);

      next();
    } catch (error) {
      console.log({ error });
      const pb = PDBuilder.fromDetail(
        "You cannot use this resource. Please authenticate first."
      )
        .status401()
        .build();
      res.status(pb.status).json(pb.toJson());
    }
  };
}

export const authMiddleware = new AuthorizationMiddleware(container);
