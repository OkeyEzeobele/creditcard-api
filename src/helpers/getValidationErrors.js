
const getValidationErrors = (errors) => {
  let prevPropertyValidated;

  const errorMessages = {}

  errors.filter((error) => {
    if(error.param !== prevPropertyValidated) {
      prevPropertyValidated = error.param;
      return error;
    }
  }).map((error) => {
    errorMessages[error.param] = error.msg
  });

  return errorMessages;
};

export default getValidationErrors;