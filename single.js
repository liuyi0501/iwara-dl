const readline = require('readline');
const simulateBrowser = require("./browser.js")
const downloadFile = require('./download');
// 创建 readline 接口实例
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


// 询问下载地址
rl.question('请输入下载地址：', (downloadUrl) => {
    
  // 提取 ID 部分
  const idRegex = /https:\/\/www\.iwara\.tv\/video\/(\w+)/;
  const match = downloadUrl.match(idRegex);
  if (match) {
    const id = match[1];
    console.log(`提取的 ID 为：${id}`);
    simulateBrowser(downloadUrl).then(response=>{
        let resolution = []
        response = JSON.parse(response)
        //console.log(typeof(response))
        response.forEach(item=>{
            resolution.push(item.name)
        })
        
        
        // 数值选项
        let options = resolution;
        
        // 输出选项
        console.log('可选数值：');
        for (let i = 0; i < options.length; i++) {
          console.log(`${i + 1}. ${options[i]}`);
        }
        
        // 提示用户选择
        rl.question('请选择一个分辨率（输入序号）：', (answer) => {
          rl.close();
          const index = parseInt(answer) - 1;
        
          if (index >= 0 && index < options.length) {
            const selectedValue = options[index];
            console.log(`你选择了：${selectedValue}`);
            let url = "https:"+response[index].src["download"]
            let res = selectedValue
            console.log("-----")
            console.log("下载地址："+url+"\nID：" +id+"\n分辨率："+res)
            downloadFile(url, id, res)
          } else {
            console.log('无效的选择');
          }
        });
        
        
    })
  } else {
    console.log('输入的下载地址不符合要求');
  }
});