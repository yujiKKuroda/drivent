import { ApplicationError } from '@/protocols';

export function noInputError(): ApplicationError {
  return {
    name: 'noInputError',
    message: 'No input detected',
  };
}
