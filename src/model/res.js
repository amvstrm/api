export function successRes(status, message, data) {
  return {
    code: status || 200,
    message, 
    ...data,
  };
}

export function errorRes(status, message) {
  return {
    status,
    message,
  };
}

export default {
  successRes,
  errorRes,
};
