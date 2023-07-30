import httpStatus from "http-status";

export function successRes(status, message, data) {
  return {
    code: status || 200,
    message, 
    ...data,
  };
}

export function errorRes(status, message) {
  return {
    code : status,
    message: message || httpStatus[`${status}_MESSAGE`],
  };
}

export default {
  successRes,
  errorRes,
};
