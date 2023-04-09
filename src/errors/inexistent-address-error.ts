import { ApplicationError } from '@/protocols';

export function inexistentAddressError(): ApplicationError {
  return {
    name: 'InexistentAddressError',
    message: 'This address does not exist!',
  };
}
