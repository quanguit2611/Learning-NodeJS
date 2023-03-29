# Một số note về section giới thiệu về nodejs và npm:

## 1. NodeJS sử dụng rất nhiều callback nên nắm kỹ phần này

## 2. Read and write file

_ nếu muốn chỉ folder hiện tại thì nên dùng biến `${__dirname}` thay vì `.`

### Synchronous way, blocking 

_ readFileSync dùng để đọc file:

```
const <biến_lưu_data_đọc> = fs.readFileSync('<đường_dẫn_tới_file>', 'utf-8');
console.log(<biến_lưu_data_đọc>);
```

### Asynchronous way, non-blocking
_ writeFileSync dùng để ghi file

ES6 + string bằng cách: `string + ${<variable_name>}`

```
const <biến_lưu_data_ghi> = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync('<đường_dẫn_tới_file>', <biến_lưu_data_ghi>);
console.log('File written!');
```

_ một ví dụ sử dụng nhiều callback
```
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
    if(err) return console.log('ERROR');

    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        console.log(data2);
        fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
            console.log(data3);

            fs.writeFile('./txt/final.txt',  `${data2}\n${data3}`,'utf-8', err => {
                console.log('your file has been written');
            });
        });
    });
});
```

### 3. Thứ tự require module: core > third party > self

### 4. SERVER

_ Code tạo một server đơn giản:

```
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-type': text/html});
    res.end();
})

server.listen(8000, '127.0.0.1', () => {
  console.log('listening to requests on port 8000');
});
```

_ Để tạo routing cho server thì cách đơn giản là dùng if else:
```
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    //Product page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    //Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});
```

### 5. Các package và dependencies

_ cài nodemon global để tiện cho việc code vì khi có nodemon thì chỉ cần lưu thay đổi là server tự reset không phải reset tay nữa

_ có các package nên cài global và có các package nên dùng locla

_ khi upload project lên github thì nên xóa folder node_modules vì rất nhiều file và khi người khác tải project của mình về thì chỉ cần gõ lệnh `npm install` ở terminal là có thể tải được folder node_modules


