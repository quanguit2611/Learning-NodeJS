### Callback hell

_ là hiện tượng sử dụng callback trong 1 hàm callback khác. việc chồng chéo callback như vậy khiến cho code hình như 1 hình tam giác. 

_ callback hell khiến code khó nhìn, dễ mất kiểm soát và khó duy trì cấu trúc

### Promise

_ là một giải pháp biến cái hình tam giác đó thành 1 đường thắng :v 

_ promise hiểu đơn giản là khi ta dự tính function sẽ trả về cho ta một value nào đó thì sau đó nếu nó nhận được value đó nó sẽ trả về cho ta

_ promise giúp code nhìn như 1 đường thẳng có quy trình từng bước một, khi promise này trả về một value như mong đợi nó mới gọi tiếp function tiếp theo, nếu như có 1 function nào có lỗi nó sẽ ngay lập tức chuyển tới error handler

_ object promise có 2 parameter là `resolve` và `reject`: resolve lưu value và reject trả về error

_ `then()` là promise trả về value như mong đợi và thực hiện code trong hàm `then()`

_ `catch()` là promise trả về lỗi, chỉ 1 catch ở cuối cùng là được.

### Async/Await

_ Luôn đi chung với nhau 

_ `async` dùng để thông báo là chạy code ở background trong khi phần code còn lại tiếp tục chạy trong event loop => function sẽ không block event loop.

_ `await` dùng để đợi promise. await sẽ dừng code lại cho tới khi nhận được promise mà nó await. nếu promise trả về đúng value thì await chính là kết quả `resolve` ở promise 

_ Async/Await giúp code nhìn giống synch hơn nhưng vẫn giữ được tính async

_ function `async` tự động return promise; value mà ta return từ function `asych` là `resolve` của promise => sau đó nó là 1 promise mà ta dùng `await`

_ Có thể đợi nhiều promise cùng 1 lúc bằng cách lưu các value cần promise vào các biến sau đó dùng `await.Promise.all([promise1, promise2, promise3, ...])`
