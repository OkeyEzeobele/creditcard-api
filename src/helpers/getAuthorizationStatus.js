import jwt from 'jsonwebtoken';

const isAdmin = (token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_KEY);
  } catch (e) {
    return null;
  }

  if (!decoded.role) {
    return null;
  }
  return { isAdmin: true, ...decoded };
};

const isAuthorizedUser = (token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_KEY);
  } catch (e) {
    return null;
  }

  if (!decoded.id) {
    return null;
  }
  return { isAuthorized: true, ...decoded };
};

export { isAdmin, isAuthorizedUser };
