'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, jwt } = app;
  // 获取ip地址
  router.get('/api/ip', controller.api.ip);
  // 搜索城市列表
  router.get('/api/city', controller.api.city);
  // 搜索当前城市详细地址
  router.get('/api/address', controller.api.address);
  // 获取首页导航
  router.get('/api/navlist', controller.api.navList);
  // 注册
  router.post('/api/register', controller.api.register);
  // 登录
  router.post('/api/login', controller.api.login);
  // 用户信息
  router.get('/api/userinfo', jwt, controller.api.userInfo);
  // 上传用户头像
  router.post('/api/uploadHead', jwt, controller.api.uploadHead);
  // 获取用户收货地址
  router.get('/api/userAddress', jwt, controller.api.userAddress);
  // 用户搜索地址
  router.get('/api/useSearchAddress', jwt, controller.api.useSearchAddress);
  // 编辑用户收货地址
  router.post('/api/setUserAddress', jwt, controller.api.setUserAddress);
  // 添加用户收货地址
  router.post('/api/addUserAddress', jwt, controller.api.addUserAddress);
  // 删除用户收货地址
  router.get('/api/delUserAddress', jwt, controller.api.delUserAddress);
  // 修改用户名
  router.post('/api/setUserName', jwt, controller.api.setUserName);
  // 修改用户密码
  router.post('/api/setPassWord', jwt, controller.api.setPassWord);
  // 获取首页筛选条数据
  router.get('/api/getBatchFilter', jwt, controller.api.getBatchFilter);
  // 获取首页商品列表
  router.get('/api/getMsiteShopList', jwt, controller.api.getMsiteShopList);
  // 商家列表头部滑动分类数据
  router.get('/api/getFoodsPage', jwt, controller.api.getFoodsPage);
  // 商家列表头部更多分类
  router.get('/api/getFoodsClass', jwt, controller.api.getFoodsClass);
  // 商家详情
  router.get('/api/getShop', jwt, controller.api.getShop);
  // 商家评价
  router.get('/api/getEstimate', jwt, controller.api.getEstimate);
  // 商家评价更多
  router.get('/api/getRatings', jwt, controller.api.getRatings);
  // 商家品牌故事
  router.get('/api/brandStory', jwt, controller.api.brandStory);
  // 热门搜索
  router.get('/api/hotSearchWords', jwt, controller.api.hotSearchWords);
  // 搜索结果
  router.get('/api/typeaHead', jwt, controller.api.typeaHead);
  // 发现 限时抽奖
  router.get('/api/suggest', controller.api.suggest);
  // 发现
  router.get('/api/discover', controller.api.discover);
  // 支付
  router.post('/api/pay', jwt, controller.api.pay);
  // 订单列表
  router.get('/api/getOrder', jwt, controller.api.getOrder);
  // 订单详情
  router.get('/api/getOrderDetail', jwt, controller.api.getOrderDetail);
};
