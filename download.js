const fs = require('fs');
const axios = require('axios');
const path = require('path');

const downloadFile = async (url, id, res)=>{
  const folderPath = `./download/${id}`;
  const filePath = path.join(folderPath, `${res}.mp4`);

  // 创建目标文件夹
  fs.mkdirSync(folderPath, { recursive: true });

  const writer = fs.createWriteStream(filePath);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  const totalSize = parseInt(response.headers['content-length']);
  let downloadedSize = 0;

  response.data.on('data', (chunk) => {
    writer.write(chunk);
    downloadedSize += chunk.length;

    const progress = ((downloadedSize / totalSize) * 100).toFixed(2);
    const speed = (downloadedSize / (1024 * 1024)).toFixed(2);

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Progress: ${progress}% | Downloaded: ${speed} MB`);

    if (downloadedSize === totalSize) {
      writer.end();
      //console.log('\nDownload complete!');
    }
  });

  return await new Promise(resolve=>{
      response.data.on('end', () => {
        writer.end();
        console.log('\nDownload complete!');
        resolve(true)
      });
  })

  response.data.on('error', (error) => {
    console.error('Error occurred during the download:', error);
  });
}
/*
// 使用示例
const url = 'https://example.com/example.mp4';
const id = '123';
const res = '720p';

downloadFile(url, id, res);
*/
module.exports = downloadFile 