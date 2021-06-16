export const isProduction = (): boolean =>
  ['prod', 'production'].indexOf(
    (process.env.NODE_ENV || 'dev').toLowerCase(),
  ) >= 0;
