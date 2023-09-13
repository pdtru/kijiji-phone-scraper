const kijiji = require('kijiji-scraper');
const fs = require('fs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const readAreaCode = (value) => {
  readline.close();
  start(value);
};

const savePhoneNumber = (phoneNumber) => {
  fs.appendFile('output.txt', phoneNumber + '\n', function (err, file) {
    if (err) throw err;
    console.log(phoneNumber);
  });
};

const options = {
  maxResults: 1,
};

const toSpaceFormat = (number) => {
  number = number.toString();
  return `${number.substring(0, 3)} ${number.substring(
    3,
    6
  )} ${number.substring(6, 10)}`;
};

const start = async (areaCode) => {
  let current = parseInt(areaCode + '0000000');

  while (true) {
    const params = {
      locationId: 0,
      categoryId: 0,
      q: current,
    };

    let result = await kijiji.search(params, options);

    if (result.length > 0) {
      savePhoneNumber(current);
    } else {
      params.q = toSpaceFormat(current);
      result = await kijiji.search(params, options);
      if (result.length > 0) {
        savePhoneNumber(current);
      }
    }
    current++;
  }
};

readline.question('input 3-digit area code: ', readAreaCode);
