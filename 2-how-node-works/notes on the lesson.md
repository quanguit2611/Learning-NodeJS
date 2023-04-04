### Sequence of instructions in nodejs

Initialize Program -> Execute Top-level code -> Require modules -> Register event callbacks -> START EVENT LOOP

### Event loop
```
const fs = require("fs");
const crypto = require("crypto");

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 4;

setTimeout(() => console.log("Timer 1 finished"), 0);
setImmediate(() => console.log("Immediate 1 finished"));

fs.readFile("test-file.txt", () => {
  console.log("I/O finished");
  console.log("-----------------");

  setTimeout(() => console.log("Timer 2 finished"), 0);
  setTimeout(() => console.log("Timer 3 finished"), 3000);
  setImmediate(() => console.log("Immediate 2 finished"));

  process.nextTick(() => console.log("Process.nextTick"));

  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password 1 encrypted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password 2 encrypted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password 3 encrypted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password 4 encrypted");
  });
});

console.log("hello from the top level code !");
```
Kết quả trả về của đoạn code trên:
```
hello from the top level code !
Timer 1 finished
Immediate 1 finished
I/O finished
-----------------
Process.nextTick
Immediate 2 finished
Timer 2 finished
1333 Password 4 encrypted
1431 Password 3 encrypted
1521 Password 1 encrypted
1559 Password 2 encrypted
Timer 3 finished
```
Một số giải thích về đoạn code:

_ Đầu tiên node sẽ chạy code top-level ở đây là `console.log("hello from the top level code !");`

_ Hai function setTimeout() và setImmediate() đầu tiên không nằm trong event loop chạy đầu tiên

_ process.nextTick() xảy ra ngay lập tức còn setImmediate() không xảy ra ngay mà xảy ra mỗi một "tick"

=> thứ tự output xuất hiện trên màn hình: `process.nextTick()` -> `setImmediate()` -> `setTimeout(0)`, -> encrypt password hoặc `setTimeout(3)` tùy thuộc vào thời gian

_ `process.env.UV_THREADPOOL_SIZE = 4;` đây là số thread pool mặc định và có thể điều chỉnh được tùy muốn

* Một trường hợp nếu không sử dụng async của function encrypt
```
hello from the top level code !
Timer 1 finished
Immediate 1 finished
I/O finished
-----------------
1253 Password 1 encrypted
2491 Password 2 encrypted
3698 Password 3 encrypted
4941 Password 4 encrypted
Process.nextTick
Immediate 2 finished
Timer 2 finished
Timer 3 finished
```
Có thể thấy rằng nếu chạy sync thì function encrypt chạy trước cả process.nextTick và setImmediate

### Event
_ Đối với các event thông thường trong 1 app nodejs thì chỉ cần listen vì các module thường sẽ có những event emmiter riêng của nó. Chỉ khi cần emit event của bản thân tự tạo ra thì mới dùng không thì chỉ cần tập trung vào event listen

### Stream 
_ Đọc data bằng `const readable = fs.createReadStream()` load data lên server bằng `readable.pipe(res)` 

_ Ngoại trừ trường hợp cần làm thủ công stream thì dùng pipe là tối ưu nhất

### Import và Export module
_ Có 2 cách export module:
* Dùng module.exports = (parameters here) => { coding here ...}
* Dùng trực tiếp object exports. Ví dụ: `exports.add = (a, b) => a + b;`

_ Import module
* Với module.exports:
```
const <module_name> = require('<module_directory>');
const <variable_name> = new <module_name>();
```

* Với sử dụng trực tiếp exports:
```
const <module_name> = require('<module_directory>');
```
hoặc sử dụng trực tiếp tên function được định nghĩa với object exports
```
const { <exports_function1>, <exports_function2>} = require('<module_directory>');
```

_ Caching: khi require module, nó sẽ được cache lại, mỗi lần call mới sẽ lấy kết quả từ cache ra chứ không gọi mới nữa
