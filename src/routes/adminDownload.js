import path from 'path';

// Middleware
// import isAdmin from '../middlewares/isAdmin';

export default (router) => {
  router.get('/api/v1/admin-download/:filename', (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/../../files/${req.params.filename}`));
  });
};
