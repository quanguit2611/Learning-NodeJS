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
DATABASE_PASSWORD=password
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

Compass là UI thay thế cho terminal khi làm việc với mongoDB. Phần cài đặt khá là đơn giản nên là khỏi note :D. Mongo Compass cho phép người dùng thêm document trực tiếp từ interface nên khá là tiện.

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

Sau khi đã có database url ta bắt đầu dùng mongoose để kết nối (trong ví dụ thì DB chính là database url)
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

Console hiện ra dòng `DB connection successfully established` là thành công !

## Cấu trúc code theo mô hình MVC
### Mô hình MVC
Hình dưới đây mô tả cấu trúc MVC lấy ví dụ là app của chúng ta

![MVC architecture in our code](./notes-img/MVC%20architecture.png)

1. Sau khi client gửi request, request sẽ đi qua router (mỗi router dùng để xủ lý 1 resource riêng biệt). 

2. Router sẽ đưa request tới handler function để thực hiện đúng yêu cầu của request trong controller (mỗi controller cũng chỉ xử lý 1 resource). 

3. Sau đó, tùy vào request mà controller sẽ phải tương tác với model, ví dụ lấy document từ mongodb hay tạo document mới (mỗi model cũng sẽ chỉ đại diện cho 1 resource). 

4. Sau khi lấy xong dữ liệu, controller có thể gửi response về cho client. Trong trường hợp cần render website, sau khi lấy xong dữ liệu controller sẽ chọn 1 template và truyền data vào trong template đó và template được render sẽ được controller gửi về cho client. 
Lớp view thường chứa 1 view template cho 1 page 

### Application logic vs Business logic
Mục đích của việc áp dụng mô hình MVC là để tách **Application logic** và **Business logic**

Hình bên dưới là một so sánh giữa 2 kiểu logic chúng ta cần xử lý khi code
![Application logic vs Business logic](./notes-img/Application%20logic%20vs%20Business%20logic.png)

Hiểu một cách đơn giản thì application logic là kiểu xử lý logic để cho app **CHẠY ĐƯỢC**,còn business logic là kiểu xử lý logic liên quan tới chuyện kinh doanh

Application logic quan tâm nhiều đến việc quản lý request-response và các vấn đề về mặt kĩ thuật (technical). Application logic là cầu nối giữa Model và View. Ví dụ: show tour và bán tour du lịch

Business logic giải quyết các vấn đề về chuyện kinh doanh, liên quan trực tiếp tới những gì mà doanh nghiệp cần. Ví dụ: tạo tour mới trong database, kiểm tra password của user, validate dữ liệu nhập vào, ...

Tất nhiên chuyện phân tách 2 kiểu vấn đề logic này hoàn toàn là bất khả thi nhưng tốt nhất là để controller xử lý các vấn đề về application logic và model xử lý các vấn đề về business logic.

Quy tắc **fat model/thin controller**: đẩy các vấn đề cần giải quyết nhiều hết mức có thể cho model để model xử lý các business logic và dùng controller với mục đích chủ yếu là quản lý các request và response cho app

## Tạo document từ app (không dùng Compass)
Từ mô hình MVC ở trên, app của chúng ta nên có 1 folder riêng để lưu model cho các resource. VD: resource tour được lưu trong file tourModels.js ở folder models
```
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
```

Như đã đề cập ở phần Mongoose, Schema là cách ta định hình cấu trúc dữ liệu cho model. Để tạo schema ta gõ: 
```
const <Schema_name> = new mongoose.Schema({
  field1: {
    options: ...
  },
  field2: {
    options: ...
  }
})
```

## Các thao tác CRUD với Document

Để nhắc lại thì các thao tác CRUD sẽ được áp dụng ở controller. Ví dụ sau là từ controller của tour (nằm trong file tourController.js)

1. Create
```
exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // newTour.save();

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
```

**Một số chú thích về code:**

_ Để tạo document mới gõ: `<Model_name>.create()`. Hàm `create()` sẽ trả về promise nên để có thể truy cập tới file document ta phải dùng `.then()` phía sau hoặc **dùng async/await**

_ Và tất nhiên là khi sử dụng async/await thì phải có try catch để bắt error

2. Read

Read all:
```
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find()

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
```
Tương tự phía trên thì `find()` cũng trả về promise 

Read one:
```
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //Tour.findOne({ _id: req.params.id })

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
```

3. Update

```
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};
```

4. Delete

```
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};
```

**Một thói quen tốt là khi thực hiện delete thì không nên lưu gì cả**

## Viết script để load data từ file json local lên mongodb
Script này là hoàn toàn độc lập với app và ta chạy nó trên terminal

```
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

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

//READ JSON FILE AND CONVERT TO JAVASCRIPT OBJECT
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//IMPORT DATA TO DATABASE
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

//DETELE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
```

Ta chạy script này trên terminal và dùng `process.argv` để chọn option là import hoặc delete data. `process.argv` trả một array chứa các argument vậy nên khi ta thêm argument `--import` hoặc `--delete` thì script sẽ chạy function tương ứng

Ở terminal ta gõ đoạn code sau:

`node dev-data/data/import-dev-data.js --import` -> nhập

hoặc

`node dev-data/data/import-dev-data.js --delete` -> xóa

## Thêm các chức năng cho API: filter, sort, limit fields, paginate

Đoạn code sau là khi ta thêm các chức năng này vào controller
```
exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    // BUILD QUERY
    // 1a) Filtering

    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    // 1b) Advance filtering

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt _id');
    }

    // 3) Field limiting

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 4) Pagination

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    // ex: page=2&limit=10
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
       const numTours = await Tour.countDocuments();
       if (skip >= numTours) throw new Error('This page does not exist');
    }

    // EXECUTE QUERY
    /* According to our class definition: 
    1. query is the mongoose query hence Tour.find()
    2. queryString is the express string hence req.query  */
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
```

Sau khi code chạy không có lỗi, ta bắt đầu refactor code để tái sử dụng các function, trong trường hợp này là file apiFeatures.js lưu ở thư mục utils

Code apiFeatures.js
```
class APIFeatures {
  constructor(query, queryString) {
    //query : mongoose query, queryString : express query string
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // BUILD QUERY
    // 1a) Filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    // 1b) Advance filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // 2) Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt _id');
    }

    return this;
  }

  limitFields() {
    // 3) Field limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // 4) Pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    // ex: page=2&limit=10
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
```

Việc refactor code như thế này giúp việc kiểm soát code dễ dàng hơn và code nhìn cũng sẽ clean hơn rất nhiều

```
const APIFeatures = require('../utils/apiFeatures');

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    // EXECUTE QUERY
    /* According to our class definition: 
    1. query is the mongoose query hence Tour.find()
    2. queryString is the express string hence req.query  */
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
```