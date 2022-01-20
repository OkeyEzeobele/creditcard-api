import { validationResult } from 'express-validator/check';

import { respondWithWarning } from '../helpers/httpResponse';
import getValidationErrors from '../helpers/getValidationErrors';

export default async function ValidationMiddleware(req, res, next) {
  const errors = getValidationErrors(validationResult(req).array());

  if (Object.keys(errors).length) {
    return respondWithWarning(res, 400, 'Validation Error', errors);
  }
  return next();
}
