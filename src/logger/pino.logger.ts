import pino from 'pino';
import pretty from 'pino-pretty';

const stream = pretty({
  colorize: true,
  sync: true, // <-- Про эту настройку ниже
});

const logger = pino(stream);

export default logger;
