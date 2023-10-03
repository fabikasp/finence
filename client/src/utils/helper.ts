import jwtDecode from 'jwt-decode';
import { ACCESS_TOKEN_KEY } from './const';
import { assertTrue } from './assert';
import z from 'zod';

const decodedJwtScheme = z.object({
  sub: z.number()
});

type DecodedJwt = z.infer<typeof decodedJwtScheme>;

const isDecodedJwt = (object: unknown): object is DecodedJwt => {
  return decodedJwtScheme.safeParse(object).success;
};

export function getDecodedJwt(): DecodedJwt | undefined {
  try {
    const result = jwtDecode(localStorage.getItem(ACCESS_TOKEN_KEY) ?? '');
    assertTrue(isDecodedJwt(result));

    return result;
  } catch (e) {
    return undefined;
  }
}
