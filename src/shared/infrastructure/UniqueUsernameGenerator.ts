import { inject, injectable } from "inversify";
import { UsernameGenerator } from "../domain/UsernameGenerator";
import { generateUsername } from "unique-username-generator";
import { Username } from "../domain/value-objects/Username";
import { constants } from "../../app/constants";
import { StudentRepository } from "../../student/domain/StudentRepository";

@injectable()
export class UniqueUsernameGenerator implements UsernameGenerator {
  constructor(
    @inject(constants.StudentRepository)
    private studentRepository: StudentRepository
  ) {}

  async randomUniqueAsync(): Promise<Username> {
    let generated;
    do {
      generated = generateUsername("", 4, 25);
    } while (!(await this.isValid(generated)));

    return new Username(generated);
  }

  private async isValid(username: string): Promise<boolean> {
    return (
      (await this.studentRepository.usernameIsUnique(username)) &&
      Username.isValid(username)
    );
  }
}
