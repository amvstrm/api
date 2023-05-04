import { compose } from 'compose-middleware';
import { errorHandler, notFound, interServerr } from './middlewares.js';

export default {
  notFound,
  errorHandler,
  interServerr
};