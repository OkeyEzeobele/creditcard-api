export default (routePath) => {
  const urlLength = routePath.split('/').length;
  return `/${routePath.split('/')[urlLength - 1]}`;
};
