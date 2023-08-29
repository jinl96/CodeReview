const axios = require('axios');

// 工具方法：判断字符串中是否含有中文
const haveCNChars = str => {
  const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
  return reg.test(str);
};

// 定义prompt，待定
const prompt = {
  Vue: '下面是一段使用Vue框架写的前端代码，请分析一下它的作用：',
  React: '下面是一段使用React框架写的前端代码，请分析一下它的作用：',
  vanillaJs: '下面是一段使用javascript编写的代码，请分析一下它的作用：',
  android: '下面是一段使用java进行安卓开发而编写的代码，请分析一下它的作用：',
  swift: '下面是一段使用swift进行ios开发而编写的代码，请分析一下它的作用：',
  oc: '下面是一段使用Objective-C进行ios开发而编写的代码，请分析一下它的作用：',
  others: '请分析一下这段代码的作用：',
  translation: '请将下面这段英文翻译成中文：',
};

// 失败重连机制
axios.interceptors.response.use(undefined, async err => {
  const config = err.config;
  // 如果config不存在或未设置retry属性，则拒绝
  if (!config || !config.retry) return Promise.reject(err);

  // 设置对象以跟踪重试次数
  config.__retryCount = config.__retryCount || 0;

  // 如果超过最大重试次数，则拒绝
  if (config.__retryCount >= config.retry) {
    return Promise.reject(err);
  }

  // 增加重试次数
  config.__retryCount += 1;
  console.log(config.__retryCount);

  // 创建新的Promise返回以重新尝试请求
  const backoff = new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, config.retryDelay || 1000);
  });

  await backoff;
  return axios(config);
});

/**
 * 连接chatgpt
 * @param {'Vue' | 'React' | 'vanillaJs' | 'android' | 'swift' | 'oc' | 'others' | 'translation} type 代码类型
 * @param {string} code 代码片段
 * @param {number} temperature
 * @returns {promise<string>}
 */
const connectChatgpt = (type, code, temperature = 0.8) => {
  return new Promise((resolve, reject) => {
    axios({
      url: 'https://frontend.myhexin.com/kingfisher/robot/homeworkChat',
      method: 'post',
      data: {
        content: prompt[type] + code,
        source: 'homework-47-fengjiawang',
        temperature,
        token: '610EE45BF-Qtc2VydmU=',
      },
      // 最大重试3次
      retry: 3,
      // 重试间隔1s
      retryDelay: 1000,
    })
      .then(res => {
        const result = res.data?.data?.res;
        if (!result) {
          resolve('由于未知原因，我无法回答您的问题');
        } else {
          // TODO 判断回答是英文还是中文
          // if (!haveCNChars(result)) {
          //   console.log(prompt.translation + result);
          //   const chinese = await connectChatgpt(prompt.translation, result);
          //   resolve(chinese);
          // } else {
          //   resolve(result);
          // }
          resolve(result);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

module.exports = connectChatgpt;
