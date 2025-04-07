import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export const validate = <T extends object>(dtoClass: new () => T, plainObject: object): T => {
  const instance = plainToInstance(dtoClass, plainObject);
  const errors = validateSync(instance);

  if (errors.length) {
    const constraints = errors[0].constraints;
    let message = 'Unknown validation error';

    if (constraints) {
      const key = Object.keys(constraints)[0];
      message = constraints[key];
    }

    throw Error(message);
  }

  return instance;
};
