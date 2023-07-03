const readline = require('readline');
const iwara = require("./browser.js")
const downloadFile = require('./download');
const axios = require("axios")
// 创建 readline 接口实例
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});



async function getVideos(url,page) {
    
    //const currentPage = page==1?1:page-1;
    const newPage = page==1?1:page;

    // 使用正则表达式匹配并替换链接中的 page 参数
    const newUrl = url.replace(/(\?|&)page=\d+(&|$)/, `$1page=${newPage}$2`);
    console.log('New URL:', newUrl);

  try {
    const response = await axios.get(url);
    const { results } = response.data;

    if (results.length > 0) {
      // 当结果不为空时，继续访问下一页
      const nextPage = page + 1;
      const nextPageResults = await getVideos(newUrl, nextPage);

      return [...results, ...nextPageResults];
    } else {
      // 结果为空时，停止递归并返回结果
      return results;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return []; // 返回空数组表示请求失败
  }
}

downloadSingleVideo = async (ids, index, author)=>{
    let downloadUrl = `https://www.iwara.tv/video/${ids[index]}`
    iwara.simulateBrowser(downloadUrl).then(response=>{
        let resolution = []
        response = JSON.parse(response)
        //console.log(typeof(response))
        response.forEach(item=>{
            if(item.name=="Source"){
                resolution.push(item)
            }
        })
        
        //console.log(resolution)
        
        let url = "https:"+resolution[0].src["download"]
        let res = resolution[0].name
        console.log("-----")
        console.log("下载地址："+url+"\nID：" + ids[index] +"\n分辨率："+res)
        downloadFile(url, ids[index], res, author).then((next)=>{
            downloadSingleVideo(ids, ++index, author)
        }).catch((e)=>{
            console.error(e)
            downloadSingleVideo(ids, ++index, author)
        })
        
        
    })
}

// 询问下载地址
rl.question('请输入作者地址：', (downloadUrl) => {
    
  // 提取 ID 部分
  const idRegex = /https:\/\/www\.iwara\.tv\/profile\/(\w+)/;
  const match = downloadUrl.match(idRegex);
  if (match) {
    const id = match[1];
    console.log(`提取的 ID 为：${id}`);
    iwara.getUserVideosLink(`https://www.iwara.tv/profile/${id}/videos`).then((res)=>{
        //console.log("res:",res)
        
        // 调用函数并获取结果
        getVideos(res, 1)
          .then(results => {
            //console.log('All video results:', results);
            
            let ids = []
            
            results.forEach(item=>{
                ids.push(item.id)
            })
            
            console.log("总计：", ids.length)
            
            downloadSingleVideo(ids, 0, id)
            
          })
          .catch(error => {
            console.error('Error:', error);
          });
    })
  } else {
    console.log('输入的下载地址不符合要求');
  }
});