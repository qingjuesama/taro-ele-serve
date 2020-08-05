'use strict';

const Controller = require('egg').Controller;

class ApiController extends Controller {
  // 获取用户ip
  async ip() {
    const { ctx } = this;
    const { query } = ctx;
    const resultIp = await this.service.api.ip(query);
    ctx.body = {
      code: 0,
      data: resultIp,
    };
  }
  // 搜索城市列表
  async city() {
    const { ctx } = this;
    const resultCity = await this.service.api.city();
    ctx.body = {
      code: 0,
      data: resultCity,
    };
  }
  // 搜索当前城市详细地址
  async address() {
    const { ctx } = this;
    const { query } = ctx;
    const resultAddress = await this.service.api.address(query);
    ctx.body = {
      code: 0,
      data: resultAddress,
    };
  }
  // 获取首页导航
  async navList() {
    const { ctx } = this;
    const { query } = ctx;
    const resultNavList = await this.service.api.navList(query);
    ctx.body = {
      code: 0,
      data: resultNavList,
    };
  }
  // 注册
  async register() {
    const { ctx } = this;
    const { body } = ctx.request;
    const userResult = await this.service.api.register(body);
    if (userResult) {
      ctx.body = {
        code: 0,
        message: '注册成功!',
      };
    } else {
      ctx.body = {
        code: 1,
        message: '手机号已存在!',
      };
    }
  }

  // 登录
  async login() {
    const { ctx } = this;
    const { body } = ctx.request;
    const loginResult = await this.service.api.login(body);
    if (loginResult) {
      ctx.body = {
        code: 0,
        message: '登录成功',
        token: loginResult,
      };
    } else {
      ctx.body = {
        code: 1,
        message: '手机号或密码错误',
      };
    }
  }

  // 用户信息
  async userInfo() {
    const { ctx } = this;
    const { phone } = ctx.state.user;
    const userResult = await this.service.api.userInfo(phone);
    ctx.body = {
      code: 0,
      data: userResult,
    };
  }

  // 上传用户头像
  async uploadHead() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    const result = await this.service.api.uploadHead(file);

    ctx.body = {
      code: 0,
      data: {
        headImg: result,
      },
    };
  }

  // 获取用户地址
  async userAddress() {
    const { ctx } = this;
    const { phone } = ctx.state.user;
    const resultAddress = await this.service.api.userAddress(phone);
    ctx.body = {
      code: 0,
      data: resultAddress,
    };
  }

  // 用户搜索地址
  async useSearchAddress() {
    const { ctx } = this;
    const { key, longitude, latitude } = ctx.query;
    const result = await this.service.api.useSearchAddress(
      key,
      longitude,
      latitude
    );

    ctx.body = {
      code: 0,
      data: result,
    };
  }

  // 编辑用户收货地址
  async setUserAddress() {
    const { ctx } = this;
    const { body } = ctx.request;
    const result = await this.service.api.setUserAddress(body);

    ctx.body = {
      code: 0,
      data: result,
    };
  }

  // 添加用户收货地址
  async addUserAddress() {
    const { ctx } = this;
    const { body } = ctx.request;
    const result = await this.service.api.addUserAddress(body);

    ctx.body = {
      code: 0,
      data: result,
    };
  }

  // 删除用户收货地址
  async delUserAddress() {
    const { ctx } = this;
    const { id } = ctx.query;
    const result = await this.service.api.delUserAddress(id);
    ctx.body = {
      code: 0,
      data: result,
    };
  }

  // 修改用户名
  async setUserName() {
    const { ctx } = this;
    const { userName } = ctx.request.body;
    const result = await this.service.api.setUserName(userName);
    ctx.body = {
      code: 0,
      data: result,
    };
  }

  // 修改用户名
  async setPassWord() {
    const { ctx } = this;
    const { oldPassWord, newPassWord } = ctx.request.body;
    const result = await this.service.api.setPassWord({
      oldPassWord,
      newPassWord,
    });
    if (result) {
      ctx.body = {
        code: 0,
        message: '修改密码成功',
      };
    } else {
      ctx.body = {
        code: 1,
        message: '旧密码错误',
      };
    }
  }

  // 获取首页筛选条数据
  async getBatchFilter() {
    const { ctx } = this;
    const { query } = ctx;
    const result = await this.service.api.getBatchFilter(query);
    ctx.body = {
      code: 0,
      data: result,
    };
  }

  // 首页商家列表
  async getMsiteShopList() {
    const { ctx } = this;
    const { query } = ctx;
    const result = await this.service.api.getMsiteShopList(query);
    ctx.body = {
      code: 0,
      data: result,
    };
  }

  // 商家列表头部滑动分类数据
  async getFoodsPage() {
    const { ctx } = this;
    const { query } = ctx;
    const result = await this.service.api.getFoodsPage(query);
    ctx.body = {
      code: 0,
      data: result,
    };
  }
  // 商家列表头部更多分类
  async getFoodsClass() {
    const { ctx } = this;
    const { query } = ctx;
    const result = await this.service.api.getFoodsClass(query);
    ctx.body = {
      code: 0,
      data: result,
    };
  }

  // 商家详情
  async getShop() {
    const { ctx } = this;
    const { query } = ctx;
    const result = await this.service.api.getShop(query);
    ctx.body = {
      code: 0,
      data: result,
    };
  }

  // 商家评价
  async getEstimate() {
    const { ctx } = this;
    const result = await this.service.api.getEstimate();
    ctx.body = {
      code: 0,
      data: result,
    };
  }

  // 商家评价更多内容
  async getRatings() {
    const { ctx } = this;
    const { query } = ctx;
    const result = await this.service.api.getRatings(query);
    ctx.body = {
      code: 0,
      data: result,
    };
  }

  // 商家品牌故事
  async brandStory() {
    const { ctx } = this;
    const result = await this.service.api.brandStory();
    ctx.body = {
      code: 0,
      data: result,
    };
  }

  // 热门搜索
  async hotSearchWords() {
    const { ctx } = this;
    const { query } = ctx;
    const result = await this.service.api.hotSearchWords(query);
    ctx.body = {
      code: 0,
      data: result,
    };
  }

  // 搜索结果
  async typeaHead() {
    const { ctx } = this;
    const { query } = ctx;
    const result = await this.service.api.typeaHead();
    ctx.body = {
      code: 0,
      data: result,
    };
  }

  // 发现 限时抽奖
  async suggest() {
    const { ctx } = this;
    const result = await this.service.api.suggest();
    ctx.body = {
      code: 0,
      data: result,
    };
  }

  // 发现
  async discover() {
    const { ctx } = this;
    const { query } = ctx;
    const result = await this.service.api.discover(query);
    ctx.body = {
      code: 0,
      data: result,
    };
  }

  // 支付
  async pay() {
    const { ctx } = this;
    const { body } = ctx.request;
    const result = await this.service.api.pay(body);
    ctx.body = {
      code: 0,
      date: result,
    };
  }

  // 获取用户订单
  async getOrder() {
    const { ctx } = this;
    const result = await this.service.api.getOrder();
    ctx.body = {
      code: 0,
      data: result,
    };
  }

  // 获取订单详情
  async getOrderDetail() {
    const { ctx } = this;
    const { query } = ctx;
    const result = await this.service.api.getOrderDetail(query);
    ctx.body = {
      code: 0,
      data: result,
    };
  }
}

module.exports = ApiController;
