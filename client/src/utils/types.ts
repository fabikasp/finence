export interface AccessToken {
  exp: number;
  sub: string;
}

// TODO: Typüberprüfung übernehmen
export function isAccessToken(object: unknown): object is AccessToken {
  return typeof object === 'object' && !!object && 'exp' in object && 'sub' in object;
}
