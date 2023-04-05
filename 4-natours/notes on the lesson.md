# ExpressJS và RESTful API
## ExpressJS
_ Là một framework được xây dựng trên nền tảng của Nodejs. Expressjs hỗ trợ các method HTTP và middleware tạo ra API dễ sử dụng

## RESTful API
_ REST - Representational States Transfer là xây dựng web API theo hướng logic và dễ sử dụng. Vì API được xây dựng để user sử dụng nên rất việc xây dựng API để user có trải nghiệm dễ dàng và thuận tiện nhất là rất quan trọng

### **Các nguyên tắc khi xây dựng API theo hướng REST**

*Các nguyên tắc sẽ giữ nguyên tiếng Anh (vì để tiếng Anh dễ hiểu hơn tiếng Việt :D)

*Các ví dụ sẽ được lấy từ project natours luôn cho dễ liên kết

1. Separate API to logical **resources**

Resource trong ngữ cảnh của REST là một object có data gắn với nó. Bất kỳ thông tin nào có thể được đặt tên thì có thể là một resource. Lưu ý là resource nên luôn để ở số nhiều.
VD: `tours`, `users`, `reviews`

2. Expose structured, **resource-based URLs**

Để tiếp cận được các resource này thì ta phải có url mà client có thể gửi request tới.
VD: `https://www.natours.com/addNewTour`

`/addNewTour` được gọi là **API endpoint**

Nhưng endpoint như thế này là rất tệ bởi vì nó không tuân theo nguyên tắc thứ 3

3. Use HTTP methods (verb)

Chỉ nên sử dụng HTTP method để thực hiện các hành động lên data

**=> Endpoint chỉ nên chứa resource chứ không chứa các hành động có tương tác với data**

VD:

/addNewTour    ->  HTTP POST /tours    => Create

/getNewTour    ->  HTTP GET /tours     => Read

/updateTour    ->  HTTP PUT /tours hoặc ->  HTTP PATCH /tours    => Update
               
/deleteTour    ->  HTTP DELETE /tours  => Delete

**Một số chú thích**

_ Ta có thể thấy là trong endpoint chỉ có resource và không có động từ vì đã có HTTP method

_ Tuy endpoint giống nhau nhưng sự khác biệt nằm ở HTTP method

_ PUT yêu cầu client gửi toàn bộ object được update, PATCH chỉ gửi phần bị thay đổi của object

_ POST là gửi một resource mới, còn PUT/PATCH update resource có sẵn

_ Các HTTP method tương úng với CRUD. Với những hành động không tương ứng với CRUD thì vẫn có thể tạo ra endpoint đáp ứng request của client

4. Send data as JSON

Ví dụ ta có data trong database như thế này: 

```
{
    "_id": "5",
    "name": "Jonas Schmedtmann",
    "email": "admin@natours.io",
    "role": "admin",
    "active": true,
    "photo": "user-1.jpg",
    "password": "$2a$12$Q0grHjH9PXc6SxivC8m12.2mZJ9BbKcgFpwSG4Y1ZEII8HJVzWeyS"
}
```

Data này được cho một GET request cho url này `https://www.natours.com/users/5` (user có id là 5)

Tất nhiên là ta có thể gửi dữ liệu như thế này cho client, nhưng thường ta sẽ format response một chút trước khi gửi. Cách đơn là dùng JSend: thêm status và bỏ dữ liệu vào object data. (Việc bọc data bằng 1 object mới gọi là **enveloping**, mục đích là để tránh những vấn đề bảo mật)

```
{
    "status": "success",
    "data": {
        "_id": "5",
        "name": "Jonas Schmedtmann",
        "email": "admin@natours.io",
        "role": "admin",
        "active": true,
        "photo": "user-1.jpg",
        "password": "$2a$12$Q0grHjH9PXc6SxivC8m12.2mZJ9BbKcgFpwSG4Y1ZEII8HJVzWeyS"
    }
    
}
```

5. Be stateless

State là một data ở trong app có thể thay đổi theo thời gian

Stateless được hiểu là mọi state được xử lý phía client. Nghĩa là mỗi request phải chứa **tất cả** thông tin cần thiết để xử lý request. Phía server không cần phải nhớ các request trước đó nữa.

VD: `loggedIn`, `currentPage`, ...

Ví dụ `currentPage = 5`

Request

`GET /tours/nextPage`    

```
nextPage = currentPage + 1 // currentPage state trên server
send(nextPage)
``` 

**=> Cần tránh trường hợp này vì server phải nhớ state bên phía server**

Thay vào đó nên sử dụng

`GET /tours/6`

```
send(6)
```

**=> Trường hợp này thì server không cần nhớ gì cả mà chỉ việc load data ở trang 6 cho client**