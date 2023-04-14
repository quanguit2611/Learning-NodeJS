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

## Xử lý các HTML method request

_ Thay vì dùng Postman như trong bài giảng thì hoppscotch là tool online để test api

_ Như đã đề cập ở trên, chỉ cần thay đổi method chứ không cần thay đổi url ta cũng có thể xử lý các method khác nhau với cùng 1 url. VD: 
```
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});
```

```
app.post('/api/v1/tours', (req, res) => {
  //console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});
```

_ Khi url có tham số (ví dụ như GET 1 object với id riêng biệt) ta chỉ cần thêm `/:<parameter>` sau url. VD:  `'/api/v1/tours/:id'`

Ta có thể yêu cầu nhiều parameter bằng cách tiếp tục thêm `/:<parameter>` vào sau url. VD: `'/api/v1/tours/:id/:x/:y'`. Viết như thế này thì bắt buộc ta phải viết đủ parameter của url tren browser nếu không server sẽ báo lỗi, để tránh tình trạng này ta thêm `?` vào sau mỗi parameter. VD: `'/api/v1/tours/:id?'`=> viết như thế này sẽ dù có hay không thì server cũng không báo lỗi

_ Một số status code quen thuộc:

* 200: OK
* 201: Created
* 204: No content

## Refactor routes

_ Sau khi đã hoàn thiện việc viết api hoàn chỉnh, ta bắt đầu refactor code để cho code dễ đọc, dễ hiểu và dễ chỉnh sửa, hoàn thiện hơn.

1. Tách handler function bên trong route ra ngoài một function để sau đó export nó ra 1 file khác

2. Sau khi đã tách xong thì ta gom các hành động (HTML method) của route đó vào 1 dòng code bằng `app.route()`. VD:

```
app.route('/api/v1/tours').get(getAllTours).post(createTour);
```

## Middleware

_ Tất cả các function xảy ra từ lúc request được gửi tới lúc response được trả về gọi là middleware (kể cả các router)

_ Tất cả các middleware mà ta sử dụng ở trong app được gọi là **middleware stack** và thứ tự trong middleware stack được xác định bằng thứ tự xuất hiện của nó trong đoạn code của chúng ta. Middleware xuất hiện trước được chạy trước và thực hiện tuần tự => **thứ tự middleware trong express là **rất quan trọng**

_ Request-Response cycle là quá trình gọi request, thực thi tất cả các middleware theo thứ tự và gửi response. 

_ Để sử dụng middleware dùng lệnh `app.use(<middleware_name>)`