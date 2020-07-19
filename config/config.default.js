/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1589884353276_6803';

  // add your middleware config here
  config.middleware = [ 'isLogin' ];

  config.cluster = {
    listen: {
      port: 4000,
      // hostname: '127.0.0.1', // 不建议设置 hostname 为 '0.0.0.0'，它将允许来自外部网络和来源的连接，请在知晓风险的情况下使用
      // path: '/var/run/egg.sock',
    },
  };

  config.jwt = {
    secret: 'eleme', // token加密字符串
  };
  // 安全监测
  config.security = {
    csrf: {
      enable: false,
      ignorJSON: true,
    },
    domainWhiteList: [ 'http://localhost:3000', 'http://192.168.1.106:3000' ], // 允许访问接口的白名单
  };
  // 跨域
  config.cors = {
    // origin: 'http://localhost:3000',
    credentials: true,
    // credentials:true, // 跨域携带cookie
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };
  // 上传文件
  config.multipart = {
    mode: 'file',
    fileExtensions: [ '' ],
    fieldSize: '2mb',
  };
  // 异常处理
  config.onerror = {
    // all(err, ctx) {
    //   ctx.status = 500;
    //   ctx.body = {
    //     code: 1,
    //     message: '出错了',
    //   };
    // },
    json(err, ctx) {
      if (ctx.state.user === undefined) {
        ctx.status = 401;
        ctx.body = {
          code: 1,
          message: '请登录',
        };
      } else {
        ctx.status = 500;
        ctx.body = {
          code: 2,
          message: '服务期繁忙',
        };
      }
    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
