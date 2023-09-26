import { ACCESS_TOKEN_KEY } from '../utils/const';

export const headers = {
  Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
};
