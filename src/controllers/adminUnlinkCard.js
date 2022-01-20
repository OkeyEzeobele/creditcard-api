import db from '../db';
// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function unlinkVirtualCard(req, res) {
  const { cifNumber: cif} = req.body;
  try {
    const cifNumber = cif.padStart(8, 0);
    const o3card = await db.O3card.find({ where: { cifNumber } });

    if (!o3card) {
      return respondWithWarning(res, 404, 'Card not in use');
    }else if(o3card.dataValues.type !== 'linked'){
      return respondWithWarning(res, 404, 'Card not linked')
    }else if(o3card.dataValues.type === 'linked'){
      o3card.destroy({ force: true })
    }

    return respondWithSuccess(res, 201, 'Card Unlinked Successfully');
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default unlinkVirtualCard;
