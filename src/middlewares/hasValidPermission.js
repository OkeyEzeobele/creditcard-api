import { isAdmin, isAuthorizedUser } from '../helpers/getAuthorizationStatus';

import { respondWithWarning } from '../helpers/httpResponse';

const hasValidPermissions = (req, res, next) => {
  let decoded;
  try {
    const { authorization, token: headerToken } = req.headers;
    const token = (authorization && authorization.split(' ')[1]) || headerToken;
    decoded = isAdmin(token) || isAuthorizedUser(token);

    if (!decoded) {
      return respondWithWarning(res, 401, 'Authorization Failed');
    }

    if (decoded.isAdmin) {
      req.adminData = decoded;
      return next();
    }
    req.userData = decoded;
    return next();
  } catch (error) {
    return respondWithWarning(res, 401, 'Authorization Failed');
  }
};

export default hasValidPermissions;
