import db from '../db';

// helpers
import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import logger from '../helpers/logger';

async function manageDocumentInfo(req, res) {
  const { id: userId } = req.userData;
  const { type } = req.body;

  try {
    const document = await db.document.find({
      where: {
        userId,
        type,
      },
    });
    if (document) {
      await db.revision.create({ userId, type, data: JSON.stringify(document) });
      await document.destroy({ force: true });
      // const updatedDocument = await document.update(req.body, { fields: Object.keys(req.body) });
      // return respondWithSuccess(res, 200, `${type} document updated successfully`, { ...updatedDocument.toJSON() });
    }
    
    const newDocument = await db.document.create({ ...req.body, userId });
    return respondWithSuccess(res, 201, `${type} document added successfully`,
      { ...newDocument.toJSON() });
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default manageDocumentInfo;
