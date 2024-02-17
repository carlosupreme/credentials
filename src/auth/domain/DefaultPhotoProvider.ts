export interface DefaultPhotoProvider {
  getPhotoUrlByEmail(email: string): Promise<string>;
}
