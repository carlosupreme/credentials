import { Response } from "express";
import PDBuilder from "problem-details-http";
import { DomainError } from "../domain/errors/DomainError";
import { AsyncValidator } from "fluentvalidation-ts";
import {
  DomainErrorsToJson,
  JsonToValidationErrors,
} from "../../app/mappings/mapper";
import {
  BaseHttpController,
  HTTP_VERBS_ENUM,
  HandlerDecorator,
  httpMethod,
} from "inversify-express-utils";
import { authMiddleware } from "../../auth/infrastructure/AuthorizationMiddleware";

export const authenticated = (
  method: keyof typeof HTTP_VERBS_ENUM,
  path: string
): HandlerDecorator => {
  return httpMethod(method, path, authMiddleware.authenticated);
};

export const admin = (
  method: keyof typeof HTTP_VERBS_ENUM,
  path: string
): HandlerDecorator => {
  return httpMethod(
    method,
    path,
    authMiddleware.authenticated,
    authMiddleware.admin
  );
};

export class ApiController extends BaseHttpController {
  problem(errors: DomainError[], response: Response): Response {
    const responseErrors = DomainErrorsToJson(errors);
    const problemDetails = PDBuilder.fromDetail(
      "There is an error in your request."
    )
      .extensions({ errors: responseErrors })
      .build();

    return response
      .setHeader("Content-Type", "application/problem+json")
      .status(400)
      .json(problemDetails.toJson());
  }

  unauthorized(response: Response): Response {
    const pb = PDBuilder.fromDetail("You are not authorized.")
      .status401()
      .build();

    return response
      .setHeader("Content-Type", "application/problem+json")
      .status(pb.status)
      .json(pb.toJson());
  }

  async validate<T>(
    validator: AsyncValidator<T>,
    command: T,
    res: Response
  ): Promise<Response | void> {
    const errors = await validator.validateAsync(command);

    if (Object.keys(errors).length > 0)
      return this.problem(JsonToValidationErrors(errors), res);
  }
}
