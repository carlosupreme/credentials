export interface DefaultPhotoProvider {
  getPhotoUrlByName(name: string): Promise<string>;
}
