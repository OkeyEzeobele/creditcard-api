import { respondWithWarning, respondWithSuccess } from '../helpers/httpResponse';
import BevertecApi from '../api/bevertecApi';
import logger from '../helpers/logger';

async function verifyCifNumber(req, res) {
  const { cif } = req.body;

  try {
    const resp = await BevertecApi.resolveCIF(cif);
    if (resp && resp.body && resp.body.apiInfo && resp.body.apiInfo.responseStatus === 'OK') {
      return respondWithSuccess(res, 200, 'success', { accountName: `${resp.body.data.firstName} ${resp.body.data.lastName }`  });
    }

    return respondWithWarning(res, 401, 'error');
  } catch (e) {
    logger.error({
      message: 'An Error Occured',
      error: e,
    });
    return respondWithWarning(res, 500, 'An Error Occured');
  }
}

export default verifyCifNumber;
