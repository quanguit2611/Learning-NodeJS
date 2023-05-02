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

_ **Làm ơn đừng có quên `next();` khi tự viết middleware :D**

### Tái cấu trúc code và tạo router riêng biệt cho mỗi resource

_ Quy trình: 
1. Nhận request từ file app.js
2. Dựa vào các route, request sẽ đi tới các router tương ứng
3. Dựa vào route và request, server sẽ thực hiện controller (handler function) tương ứng
4. Cuối cùng thì response sẽ được gửi về cho client và kết thúc request-response cycle

_ Tách thành 2 folder routes và controllers theo đúng mô hình MVC (sẽ đề cập ở các phần sau :v) với folder controllers chứa các hàm xử lý các HTML method request và folder routes chứa url để trỏ tới controller tương úng

### Tách controller
_ Việc tách controller thì có phần đơn giản hơn route một chút vì công việc chủ yếu ở đây là bỏ các handler function HTML method request vào `exports.<function>` để export các function này để router chỉ tới. VD:
```
const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//TOURS FUNCTION HANDLER
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    result: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1; // convert req.params.id từ string sang number
  const tour = tours.find((el) => el.id === id); //nếu không tìm thấy id phù hợp biến tour sẽ trở thành undefined

  // if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
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
};

exports.updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

exports.deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
```

### Tách route

_ Import file controller.js tương ứng và import `express.Router();` để thực hiện việc routing cho app, cuối cùng là export file route.js để import vào app.js

`const <router_name> = express.Router();`

Thay vì dùng app.route() ta thay app bằng `<router_name>` mà ta vừa tạo. VD: 
```
const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
```

**Lưu ý là khi refactor tất nhiên sẽ có những bug như thiếu module, sai đường dẫn, chưa định nghĩa các variable như trước kia, ... nhưng cứ sửa từ từ là ok :D**

**Trong thực tế thì ta nên export file app.js ra một main file mới là server.js, vì app.js sẽ chứa tất cả những gì liên quan tới express ở một file và những gì liên quan tới server ở một file riêng biệt khác (như config database, xử lý error, biến môi trường, ...)**

### Param middleware

_ Là middleware chỉ chạy cho một số parameter nhất định -> khi url có parameter thì param middleware có parameter tương ứng mới được sử dụng. Như trong bài ta có parameter id để lấy dữ liệu cho 1 resource có id tương ứng

_ Việc sử dụng param middleware giúp cho các HTML method function handler chỉ phải thực hiện công việc nó được yêu cầu (như trong bài là các hàm như getTour, getAllTours, ...) mà không lo tới việc validate parameter có gây ra lỗi gì hay không

_ Ưu tiên sử dụng param middleware thay vì hàm javascript thông thường vì làm việc với middleware stack mới là phương châm hoạt động của express

### Chaining multiple middlewares

_ Việc chain các middleware trong route thường để kiểm tra các thông tin trước khi thực hiện bước cuối cùng là thực hiện công việc của route đó để HTML method function handler chỉ phải thực hiện công việc như đúng cái tên của nó

### Serving static files

_ Để sử dụng static file trong express thì gõ lệnh ```app.use(express.static(<tên_đường_dẫn_file_tĩnh>));``` 


### Làm việc với Environment Variables

Sử dụng Environment Variables để set các giá trị cho từng môi trường (dev, product,...)

Trên terminal gõ : `npm install dotenv`

Tạo file config.env để lưu các thông tin cần sử dụng. VD 
```
NODE_ENV=development
PORT=3000
DATABASE=mongodb://quang:<PASSWORD>@ac-h2yobxr-shard-00-00.iuqvijk.mongodb.net:27017,ac-h2yobxr-shard-00-01.iuqvijk.mongodb.net:27017,ac-h2yobxr-shard-00-02.iuqvijk.mongodb.net:27017/natours?ssl=true&replicaSet=atlas-rp6fyl-shard-0&authSource=admin&retryWrites=true&w=majority
DATABASE_PASSWORD=tôi che như phim sex luôn chứ ở đó mà đòi thấy =))
```

Import file .env vào server 
```
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
```

Để truy cập tới các variable trong file env gõ: `process.env.<variable_name>`

# MongoDB và mongoose
## MongoDB

_ Database dạng hướng tài liệu (document-base)

_ Mỗi database chứa các **collection** (giống như table bên sql)

_ Mỗi collection chứa các **document** (giống như row bên sql)

### Những key feature của mongoDB

_ Document based: lưu data trong các document (data lưu dưới dạng cặp field-value)

_ Scalable (khả năng mở rộng): dễ lưu trữ data khi số lượng user và data tăng lên

_ Flexible (linh động): document không yêu cầu data schema nên muốn lưu data như thế nào cũng được và cũng dễ thay đổi dữ liệu

_ Performant (hoạt động hiệu quả): các tính năng như embedded data model, indexing, sharding, flexible documents, native duplication, ... giúp mongo

_ Open source và free cho người mới sử dụng

### So sánh giữa data dược lưu dưới dạng document và trong database dạng quan hệ

Hình bên dưới là so sánh giữa 2 bên

![Document vs relational database](./notes-img/document%20vs%20relational%20database.png)

### Mongo Compass

Compass là UI thay thế cho terminal khi làm việc với mongoDB. Phần cài đặt khá là đơn giản nên là khỏi note :D (nối mongoose với app express mới bú (✖╭╮✖) )

### Mongo Atlas

Dùng Atlas để tạo project và database trên mạng (không lưu database ở local):

1. Tạo tài khoản trên atlas (đăng nhập bằng google không tới 30s)

2. Sau khi tạo tài khoản sẽ có trang project hiện lên, nhấn vào nút create project bên tay phải màn hình
![Create new project](./notes-img/create%20new%20project.png)

3. Sau đó tạo tên project, bỏ qua bước thêm member (vì làm éo gì có ai :D) và nhấn Create Project
![Name the project](./notes-img/name%20the%20project.png)
![Create project](./notes-img/create%20project.png)

4. Sau khi tạo xong project xong, user sẽ được chuyển tới trang tạo database (hay lúc trước gọi là cluster)
![Create database](./notes-img/create%20database.png)

5. Sau đó user sẽ được chuyển tới trang setup cấu hình cho database của mình (nhớ chọn free không mất tiền oan mình không chịu trách nhiệm đâu à nha) và nhấn create
![Choose free option and create your database](./notes-img/free%20database.png)

6. Sau đó mongo sẽ dẫn tới trang quickstart để tạo user và thiết lập các địa chỉ ip được kết nối tới database vừa mới tạo

**Lưu ý: lưu password và user lại vào file config.env để kết nối express app và mongodb**
![Create user for database](./notes-img/create%20user.png)
![Add IP address](./notes-img/add%20ip%20address.png)

### Mongoose

Mongoose là thư viện Object Data Modeling của MongoDB và Node.js và có mức trừu tượng cao hơn driver MongoDB (na ná Node.js với Express.js)

Các tính năng: tạo schema để model data và tạo quan hệ, validate data dễ dàng, API truy vấn đơn giản, cung cấp các middleware, ...

Mongoose Schema: dùng để model data bằng cách mô tả cấu trúc dữ liệu, các giá trị mặc định và các validator

Mongoose Model: một wrapper cho schema, dùng cho các thao tác CRUD với dữ liệu

**Kết nối database với mongoose**

1. Ở trang chủ của project, nhấn connect
![Connect database](./notes-img/connect%20db.png)

2. Nhấn vào drivers
![Connect via drivers](./notes-img/connect%20via%20drivers.png)

3. Vì chỗ này bug nên sẽ chia làm 2 cách, nếu cách thứ nhất chạy rồi thì thôi nhưng nếu không chạy thì chuyển qua cách thứ 2 <br>
Cách 1: chọn driver là node.js version 4.1 or later sau đó copy connection string và dán nó vào biến lưu database url (hoặc như trong bài là lưu vào biến môi trường ở file config)
![Cách thứ nhất](./notes-img/choice%20no1.png)
Cách 2: chọn driver là node.js nhưng version sẽ là 2.2.12 or later sau đó làm tương tự
![Cách thứ hai](./notes-img/choice%20no2.png)

Sau khi đã có database url ta bắt đầu dùng mongoose để kết nối
```
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('DB connection successfully established');
  })
  .catch((err) => {
    console.log('DB connection error');
    console.log(err);
  });
```

Console hiện ra dòng `DB connection successfully established` là thành công (còn không là "cook")




