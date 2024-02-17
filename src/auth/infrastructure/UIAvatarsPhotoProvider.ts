import { injectable } from "inversify";

@injectable()
export class UIAvatarsPhotoProvider {
  async getPhotoUrlByEmail(email: string): Promise<string> {
    return `https://ui-avatars.com/api/?name=${email[0]}&background=A3B6F9&color=fefefe&bold=true`;
  }
}
