import { compose } from 'compose-middleware';
import { errorHandler, notFound } from './middlewares.js';

const middleware = compose([
  notFound,
  errorHandler
]);

export default {
  middleware
};