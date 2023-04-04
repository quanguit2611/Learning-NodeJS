const fs = require('fs');
const superagent = require('superagent');

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('Can not find file !');
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('Can not write file !');
      resolve('success');
    });
  });
};

const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`, 'utf-8');
    console.log(`Breed: ${data}`);

    const res1Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
    const imgs = all.map((el) => el.body.message);
    console.log(imgs);

    await writeFilePro('dog-img.txt', imgs.join('\n'));
    console.log('random image saved to file !');
  } catch (err) {
    console.error(err);
    throw err;
  }
  return '2: READY';
};

(async () => {
  try {
    console.log('1: Will get dog pics :D');
    const x = await getDogPic();
    console.log(x);
    console.log('3: Done getting pic');
  } catch (err) {
    console.error('ERROR !!!');
  }
})(); // IIFE. định nghĩa hàm trong () đầu tiên sau đó gọi hàm bằng () thứ hai

/*  xài promise để console.log theo thứ tự
console.log('1: Will get dog pics :D');
getDogPic()
  .then((x) => {
    console.log(x);
    console.log('3: Done getting pic');
  })
  .catch((err) => {
    console.error('ERROR !!!');
  });
*/

//Sử dụng promise với then() và catch(), không dùng async/await
/*
readFilePro(`${__dirname}/dog.txt`, 'utf-8')
  .then((data) => {
    console.log(`Breed: ${data}`);

    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);
    return writeFilePro('dog-img.txt', res.body.message);
  })
  .then(() => {
    console.log('random image saved to file !');
  })
  .catch((err) => {
    console.error(err);
  });
*/
