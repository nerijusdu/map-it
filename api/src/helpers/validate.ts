import { validate } from 'class-validator';
import { HttpError } from '../models';
import resources from '../resources';

export default async (entity: any) => {
  const err = await validate(entity);
  if (err.length > 0) {
    const errors = err.map((x) => ({
      property: x.property,
      errors: Object.keys(x.constraints).map((key) => x.constraints[key])
    }));

    throw new HttpError(resources.Generic_ValidationError, 400, errors);
  }
};
