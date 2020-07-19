'use strict';

module.exports = (options, app) => {
  return async function isLogin(ctx, next) {
    await next();
  };
};
