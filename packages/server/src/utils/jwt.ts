import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';

const privateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY as string;

export function signJwt(
  payload: JwtPayload,
  options: SignOptions = {}
) {
  return jwt.sign(payload, privateKey, {
    ...(options && options),
  });
}

export function verifyJwt(
  token: string,
) {
  return jwt.verify(token, privateKey);
}
