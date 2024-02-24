import { injectable } from "inversify";

@injectable()
export class UIAvatarsPhotoProvider {
  async getPhotoUrlByName(name: string): Promise<string> {
    return `https://ui-avatars.com/api/?name=${name[0]}&background=A3B6F9&color=fefefe&bold=true`;
  }
}
