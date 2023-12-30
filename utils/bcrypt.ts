import { genSalt, hash } from 'bcryptjs';

const ROUNDS = 10;

export const hashPassword = async (password: string) => {
  const salt = await genSalt(ROUNDS);
  const passwordHash = await hash(password, salt);
  return passwordHash;
};
