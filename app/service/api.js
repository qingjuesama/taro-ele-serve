'use strict';

const Service = require('egg').Service;
const fs = require('fs');
const { join } = require('path');

const IMGURL = 'http://localhost:4000';

class ApiService extends Service {
  // 获取用户ip
  async ip(query) {
    const { key } = query;
    const ipUrl = 'https://apis.map.qq.com/ws/location/v1/ip';
    const resultIp = await this.ctx.curl(ipUrl, {
      data: {
        key,
      },
      method: 'GET',
    });
    const { lat, lng } = JSON.parse(resultIp.data).result.location;

    // 获取详细地址
    const locationUrl = 'https://apis.map.qq.com/ws/geocoder/v1/';
    const resultLocation = await this.ctx.curl(locationUrl, {
      data: {
        location: `${lat},${lng}`,
        key,
        get_poi: 0,
      },
      method: 'GET',
    });
    const resultJSON = JSON.parse(resultLocation.data);
    const {
      result: {
        formatted_addresses: { recommend },
        address_component: { city },
      },
    } = resultJSON;
    return {
      latitude: lat,
      longitude: lng,
      city,
      recommend,
    };
  }

  // 搜索城市列表
  async city() {
    const url =
      'https://shadow.elemecdn.com/lib/city-list@0.0.3/city_list.json';
    const resultCity = await this.ctx.curl(url);
    return JSON.parse(resultCity.data);
  }

  // 搜索当前城市详细地址
  async address(query) {
    const url = 'https://h5.ele.me/restapi/bgs/poi/search_poi_nearby_alipay';
    const resultAddress = await this.ctx.curl(url, { data: query });
    return JSON.parse(resultAddress.data);
  }

  // 获取首页导航
  async navList(query) {
    const { latitude, longitude } = query;
    const resultNavList = await this.ctx.curl(
      `https://h5.ele.me/restapi/shopping/v2/entries?latitude=${latitude}&longitude=${longitude}&templates[]=main_template&templates[]=favourable_template&templates[]=svip_template&terminal=h5`
    );
    const data = JSON.parse(resultNavList.data);
    if (data.length) {
      const navList = data[1].entries;
      return navList;
    }
  }

  // 注册
  async register(body) {
    const { phone, password } = body;
    const users = this.ctx.helper.getUsers();
    const user = users.find(user => user.phone === phone);
    if (!user) {
      const id = Date.now().toString();
      const userName = '饿了么用户';
      const headImg = `${IMGURL}/public/uploadImg/default-head.png`;
      const address = [];
      const order = [];
      users.push({ id, phone, password, userName, headImg, address, order });
      this.ctx.helper.saveUsers(users);
      return true;
    }
    return false;
  }

  // 登录
  async login(body) {
    const { phone, password } = body;
    const users = this.ctx.helper.getUsers();
    const user = users.find(
      user => user.phone === phone && user.password === password
    );

    if (user) {
      // 生成token
      const token = this.app.jwt.sign(
        {
          phone,
          password,
        },
        this.app.config.jwt.secret,
        {
          expiresIn: '1800s',
        }
      );
      return token;
    }
    return false;
  }

  // 获取用户信息
  async userInfo(phone) {
    const users = this.ctx.helper.getUsers();
    const user = users.find(user => user.phone === phone);

    return {
      phone: user.phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2'),
      userName: user.userName,
      headImg: user.headImg,
      id: user.id,
    };
  }

  // 上传头像
  async uploadHead(file) {
    const { phone } = this.ctx.state.user;
    const imgName = `${file.filename}.${file.mimeType.split('/')[1]}`;
    // 获取用户信息
    const users = this.ctx.helper.getUsers();

    const user = users.find(user => user.phone === phone);
    user.headImg = `${IMGURL}/public/uploadImg/` + imgName;

    fs.writeFileSync(
      join(__dirname, '../data/user.json'),
      JSON.stringify({ users })
    );
    // 读取文件
    const readFile = fs.readFileSync(file.filepath);
    // 写入文件
    fs.writeFileSync(
      join(__dirname, `../public/uploadImg/${imgName}`),
      readFile
    );
    return user.headImg;
  }

  // 获取用户收货地址
  async userAddress(phone) {
    const users = this.ctx.helper.getUsers();
    const user = users.find(user => user.phone === phone);
    const address = user.address;
    return address;
  }

  // 用户搜索地址
  async useSearchAddress(key, longitude, latitude) {
    const url = 'https://h5.ele.me/restapi/bgs/poi/search_poi_nearby';
    const result = await this.ctx.curl(url, {
      method: 'GET',
      data: {
        keyword: key,
        offset: 0,
        limit: 20,
        longitude,
        latitude,
      },
    });

    return JSON.parse(result.data);
  }

  // 编辑用户收货地址
  async setUserAddress(body) {
    const { id } = body;
    const { phone } = this.ctx.state.user;
    const users = this.ctx.helper.getUsers();
    const user = users.find(user => user.phone === phone);
    const atAddress = user.address.find(address => address.id === id);
    for (const key in body) {
      atAddress[key] = body[key];
    }
    this.ctx.helper.saveUsers(users);
    return atAddress;
  }

  // 用户添加收货地址
  async addUserAddress(body) {
    const { phone } = this.ctx.state.user;
    const newBody = { ...body, id: Date.now().toString() };
    const users = this.ctx.helper.getUsers();
    const user = users.find(user => user.phone === phone);
    user.address.push(newBody);
    this.ctx.helper.saveUsers(users);
    return newBody;
  }

  // 删除用户收货地址
  async delUserAddress(id) {
    const { phone } = this.ctx.state.user;
    const users = this.ctx.helper.getUsers();
    const user = users.find(user => user.phone === phone);
    const index = user.address.findIndex(item => item.id === id);
    const deladdress = user.address.splice(index, 1)[0];
    this.ctx.helper.saveUsers(users);
    return deladdress;
  }

  // 修改用户名
  async setUserName(userName) {
    const { phone } = this.ctx.state.user;
    const users = this.ctx.helper.getUsers();
    const user = users.find(user => user.phone === phone);
    user.userName = userName;
    this.ctx.helper.saveUsers(users);
    return user.userName;
  }

  // 修改用户密码
  async setPassWord({ oldPassWord, newPassWord }) {
    const { phone } = this.ctx.state.user;
    const users = this.ctx.helper.getUsers();
    const user = users.find(user => user.phone === phone);
    if (user.password !== oldPassWord) {
      return false;
    }
    user.password = newPassWord;
    this.ctx.helper.saveUsers(users);
    return true;
  }

  // 获取首页筛选条数据
  async getBatchFilter(query) {
    const { latitude, longitude } = query;
    // const url = 'https://h5.ele.me/pizza/shopping/restaurants/batch_filter';
    // const result = await this.ctx.curl(url, {
    //   data: {
    //     latitude,
    //     longitude,
    //     terminal: 'h5',
    //   },
    //   method: 'GET',
    // });
    // if (JSON.parse(result.data).bar) {
    //   return JSON.parse(result.data);
    // }
    const result = await fs.readFileSync(
      join(__dirname, '../data/filterShops.json')
    );
    return JSON.parse(result);
  }

  // 首页商家列表
  async getMsiteShopList(query) {
    const {
      latitude,
      longitude,
      offset,
      limit,
      sort,
      distance,
      sales,
      serves,
      activity,
      expenditure,
    } = query;

    const getShopsList = await fs.readFileSync(
      join(__dirname, '../data/shops.json')
    );
    let shopList = JSON.parse(getShopsList).items;
    if (distance) {
      shopList = shopList.sort(
        (prev, next) => prev.restaurant.distance - next.restaurant.distance
      );
    }
    if (sales) {
      shopList = shopList.sort(
        (prev, next) =>
          next.restaurant.recent_order_num - prev.restaurant.recent_order_num
      );
    }

    const newShopList = shopList.slice(
      Number(offset),
      Number(offset) + Number(limit)
    );
    return newShopList;
  }

  // 商家列表头部滑动分类数据
  async getFoodsPage(query) {
    const { latitude, longitude, entry_id } = query;
    const url = 'https://h5.ele.me/restapi/shopping/v2/foods_page/sift_factors';
    const result = await this.ctx.curl(url, {
      data: {
        entry_id,
        latitude,
        longitude,
        terminal: 'h5',
      },
    });
    const data = JSON.parse(result.data);

    return data;
  }

  // 商家列表头部更多分类
  async getFoodsClass(query) {
    const { latitude, longitude } = query;
    const url = 'https://h5.ele.me/restapi/shopping/v2/restaurant/category';
    const result = await this.ctx.curl(url, {
      data: {
        latitude,
        longitude,
      },
    });
    const data = JSON.parse(result.data);
    return data;
  }

  // 商家详情
  async getShop(query) {
    const { id } = query;
    let shops = await fs.readFileSync(join(__dirname, '../data/shop.json'));
    shops = JSON.parse(shops);
    const shop = shops.find(item => item.rst.id === id);
    if (shop) {
      return shop;
    }
    if (!shop) {
      return shops[0];
    }
  }

  // 商家评价
  async getEstimate() {
    const estimate = await fs.readFileSync(
      join(__dirname, '../data/comments.json')
    );

    return JSON.parse(estimate);
  }

  // 商家评价更多内容
  async getRatings(query) {
    const { name, offset, limit } = query;
    let ratings = await fs.readFileSync(
      join(__dirname, '../data/ratings.json')
    );
    ratings = JSON.parse(ratings);
    ratings = ratings.find(rating => rating.name === name);

    ratings = ratings.ratings.slice(
      Number(offset),
      Number(offset) + Number(limit)
    );

    return ratings;
  }

  // 商家品牌故事
  async brandStory() {
    const dataJSON = await fs.readFileSync(
      join(__dirname, '../data/brandStory.json')
    );
    return JSON.parse(dataJSON);
  }

  // 热门搜索
  async hotSearchWords(query) {
    const url = 'https://h5.ele.me/restapi/swarm/v2/hot_search_words';
    const { latitude, longitude } = query;
    let result = await this.ctx.curl(url, {
      data: {
        latitude,
        longitude,
      },
      method: 'GET',
    });
    result = JSON.parse(result.data);
    return result;
  }

  // 搜索结果
  async typeaHead() {
    let searchData = await fs.readFileSync(
      join(__dirname, '../data/search.json')
    );
    searchData = JSON.parse(searchData);

    return searchData;
  }

  // 发现 限时抽奖
  async suggest() {
    const url = 'https://h5.ele.me/restapi/member/gifts/suggest';
    const result = await this.ctx.curl(url, { method: 'GET' });
    return JSON.parse(result.data);
  }

  // 发现
  async discover(query) {
    const { latitude, longitude } = query;
    const url = 'https://h5.ele.me/restapi/member/v1/discover';
    const result = await this.ctx.curl(url, {
      data: { platform: 1, block_index: 0, latitude, longitude },
      method: 'GET',
    });
    return JSON.parse(result.data);
  }

  // 支付
  async pay(body) {
    const { phone } = this.ctx.state.user;
    const createTime = Date.now();
    const orderNum = 'ON' + createTime;
    const users = this.ctx.helper.getUsers();
    const user = users.find(u => u.phone === phone);
    const foods = JSON.parse(body.foods);
    const address = JSON.parse(body.address);
    user.order.unshift({ ...body, foods, address, orderNum, createTime });
    this.ctx.helper.saveUsers(users);
    return 'ok';
  }

  // 获取用户订单
  async getOrder() {
    const { phone } = this.ctx.state.user;
    const users = this.ctx.helper.getUsers();
    const user = users.find(u => u.phone === phone);
    const order = user.order;
    return order;
  }

  // 获取订单详情
  async getOrderDetail(query) {
    const { id } = query;
    const { phone } = this.ctx.state.user;
    const users = this.ctx.helper.getUsers();
    const user = users.find(u => u.phone === phone);
    const orderItem = user.order.find(o => o.orderNum === id);
    return orderItem;
  }
}

module.exports = ApiService;
