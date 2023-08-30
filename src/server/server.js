const axios = require("axios");

// 失败重连机制
axios.interceptors.response.use(undefined, async err => {
  const config = err.config;
  // 如果config不存在或未设置retry属性，则拒绝
  if (!config || !config.retry) {
    return Promise.reject(err);
  }

  // 设置对象以跟踪重试次数
  config.__retryCount = config.__retryCount || 0;

  // 如果超过最大重试次数，则拒绝
  if (config.__retryCount >= config.retry) {
    return Promise.reject(err);
  }

  // 增加重试次数
  config.__retryCount += 1;

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
 * @param {'vue' | 'react' | 'js' | 'java' | 'kotlin' | 'swift' | 'oc' | 'others'} type 代码类型
 * @param {string} code 代码片段
 * @param {number} temperature 默认0.8
 * @returns {promise<string>}
 */
const connectChatgpt = (type, code, temperature = 0.8) => {
  return new Promise((resolve, reject) => {
    axios.get("https://testfund.10jqka.com.cn/pack-upload/fengjw/prompt.json").then(res => {
      const prompt = res.data;
      let codeType;
      if (prompt.hasOwnProperty(type)) {
        codeType = type;
      } else {
        codeType = "others";
      }
      axios({
        url: "https://frontend.myhexin.com/kingfisher/robot/homeworkChat",
        method: "post",
        data: {
          content: prompt[codeType].start + code + prompt[codeType].end,
          source: "homework-47-fengjiawang",
          temperature,
          token: "610EE45BF-Qtc2VydmU=",
        },
        // 最大重试3次
        retry: 3,
        // 重试间隔1s
        retryDelay: 1000,
      })
        .then(res => {
          const result = res.data?.data?.res;
          if (!result) {
            resolve("由于未知原因，我无法回答您的问题");
          } else {
            resolve(result);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  });
};

module.exports = connectChatgpt;
