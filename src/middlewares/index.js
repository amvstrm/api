import { compose } from 'compose-middleware';
import { errorHandler, notFound, methodNotAllowed, badrequest } from './middlewares.js';

const middleware = compose([
  notFound,
  methodNotAllowed,
  badrequest,
  errorHandler
]);

export default {
  middleware
};