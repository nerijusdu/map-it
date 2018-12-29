import { validate } from 'class-validator';
import { HttpError } from '../models';

export default (entity: any) => validate(entity)
  .then((err) => {
    if (err.length > 0) {
      const errors = err.map((x) => ({
        property: x.property,
        errors: Object.keys(x.constraints).map((key) => x.constraints[key])
      }));

      throw new HttpError('Invalid request', 400, errors);
    }
  });
