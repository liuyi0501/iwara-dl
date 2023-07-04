const puppeteer = require('puppeteer');

const simulateBrowser = async (url) => {
  const browser = await puppeteer.launch({
      headless: 'new', 
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  })

  const page = await browser.newPage();

      // 设置加载超时时间为 10 秒
  const timeout = 10000;
  let isLoaded = false;

  // 监听页面加载完成事件
  page.on('load', () => {
    isLoaded = true;
    console.log('Page loaded successfully');
  });


  //const cookie = '_ga=GA1.2.625096767.1677324435; _ga_PK7DE1RR8V=GS1.1.1677336011.4.1.1677340420.0.0.0; _pk_id.1.602d=24ecf42c9d82b2b8.1687684164.; _gid=GA1.2.721396868.1688346987; _pk_ses.1.602d=1; _gat_gtag_UA_37410039_11=1';
  
  await page.goto(url);
  //await page.setCookie(...parseCookies(cookie));
  //await page.waitForTimeout(5000);
  
    return await new Promise( async (resolve)=>{
        page.on('response', response => {
            const url = response.url();
            if (url.includes('https://files.iwara.tv/file/') && response.request().method() !== 'OPTIONS') {
              console.log('Intercepted Response:', url);
              response.text().then(body => {
                //console.log('Response Body:', body);
                resolve(body)
              });
            }
        });
        
        // 等待加载完成或超时
          await Promise.race([
            new Promise(resolve => setTimeout(() => resolve(), timeout)),
            new Promise(resolve => page.once('load', () => resolve()))
          ]);
        
          if (!isLoaded) {
            // 如果超时，执行刷新操作
            console.log('Loading timeout. Refreshing page...');
            await page.reload();
          }
        
    })
  
  
  
  // 等待页面加载完成（可以根据需要调整等待时间）
  

  //const dropdownContent = await page.$eval('.page-video__bottom', element => element.innerHTML);
  //console.log(dropdownContent);

  await browser.close();
};

const parseCookies = cookieString => {
  return cookieString
    .split(';')
    .map(cookie => {
      const [name, value] = cookie.split('=');
      return { name: name.trim(), value: value.trim() };
    });
};



const getUserVideosLink = async (url) => {
  const browser = await puppeteer.launch({
      headless: 'new', 
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  })

  const page = await browser.newPage();

  //const cookie = '_ga=GA1.2.625096767.1677324435; _ga_PK7DE1RR8V=GS1.1.1677336011.4.1.1677340420.0.0.0; _pk_id.1.602d=24ecf42c9d82b2b8.1687684164.; _gid=GA1.2.721396868.1688346987; _pk_ses.1.602d=1; _gat_gtag_UA_37410039_11=1';
  
  await page.goto(url);
  //await page.setCookie(...parseCookies(cookie));
  //await page.waitForTimeout(5000);
  
    return await new Promise(async (resolve)=>{
        page.on('response', response => {
            const url = response.url();
            if (url.includes('https://api.iwara.tv/videos') && response.request().method() !== 'OPTIONS') {
              //console.log('Intercepted Response:', url);
              resolve(url)
            }
        });
          
        
        
        
    })
  
  
  
  // 等待页面加载完成（可以根据需要调整等待时间）
  

  //const dropdownContent = await page.$eval('.page-video__bottom', element => element.innerHTML);
  //console.log(dropdownContent);

  await browser.close();
};



const getAllVideo = async (url) => {
  const browser = await puppeteer.launch({
      headless: 'new', 
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  })

  const page = await browser.newPage();

  //const cookie = '_ga=GA1.2.625096767.1677324435; _ga_PK7DE1RR8V=GS1.1.1677336011.4.1.1677340420.0.0.0; _pk_id.1.602d=24ecf42c9d82b2b8.1687684164.; _gid=GA1.2.721396868.1688346987; _pk_ses.1.602d=1; _gat_gtag_UA_37410039_11=1';
  
  await page.goto(url);
  //await page.setCookie(...parseCookies(cookie));
  //await page.waitForTimeout(5000);
    await page.waitForSelector('.page-post__body');
    await page.waitForTimeout(5000);
    // 获取 class="page-post__body" 元素的 HTML 内容
  const htmlContent = await page.$eval('.page-post__body', element => element.innerHTML);
    
    console.log(htmlContent)
    
  // 使用正则表达式匹配链接
  const videoIDRegex = /\/video\/([^"'\s]+)/g;
  const videoIDs = [];
  let match;

  while ((match = videoIDRegex.exec(htmlContent)) !== null) {
    const videoID = match[1];
    videoIDs.push(videoID);
  }

  return videoIDs
  
  
  
  // 等待页面加载完成（可以根据需要调整等待时间）
  

  //const dropdownContent = await page.$eval('.page-video__bottom', element => element.innerHTML);
  //console.log(dropdownContent);

  await browser.close();
};


iwara = {
    simulateBrowser,
    getUserVideosLink,
    getAllVideo
}
/*
simulateBrowser("https://www.iwara.tv/video/G3X3J7CgiTS7VK")
    .then((response)=>{
        console.log("--------------")
        console.log(response)
    })
    .catch(error => {
    console.error(error);
  });
*/
module.exports = iwara

