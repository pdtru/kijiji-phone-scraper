const kijiji = require('kijiji-scraper');
const fs = require('fs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

class App {
  options = {
    minResults: -1,
    maxResults: 40,
  };

  params = {
    locationId: 0,
    categoryId: 0,
    q: '',
  };

  start = async () => {
    readline.question('Set maximum number of results ', this.readMaxResults);
  };

  readMaxResults = (value) => {
    this.options.maxResults = parseInt(value);
    readline.question('input 3-digit area code: ', this.readAreaCode);
  };

  readAreaCode = (value) => {
    this.params.q = value;
    this.scrape();
    readline.close();
  };

  scrape = async () => {
    console.log('Searching please wait...');
    let result = await kijiji.search(this.params, this.options);

    for (let i = 0; i < result.length; i++) {
      const currentAd = result[i];
      const foundNumbers = /(?:[-+() ]*\d){10,13}/g.exec(currentAd.description);
      if (foundNumbers)
        for (let j = 0; j < foundNumbers.length; j++) {
          this.savePhoneNumber(foundNumbers[j]);
          console.log(foundNumbers[j]);
        }
    }
    console.log('Program Finished');
  };

  savePhoneNumber = (phoneNumber) => {
    fs.appendFile('output.txt', phoneNumber + '\n', function (err, file) {
      if (err) throw err;
    });
  };
}

const app = new App();

app.start();
