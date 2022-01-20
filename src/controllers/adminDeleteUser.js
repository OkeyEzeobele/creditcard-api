import db from '../db';
// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function deleteUser(req, res) {
  const { userEmail: email} = req.body;
  try {
    
    const o3User = await db.user.findOne({ where: { email } });

    if (!o3User) {
      return respondWithWarning(res, 404, 'Account does not Exist!');
    }else if(o3User){
      o3User.destroy({ force: true })
    }

    return respondWithSuccess(res, 201, 'User Deleted');
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default deleteUser;
