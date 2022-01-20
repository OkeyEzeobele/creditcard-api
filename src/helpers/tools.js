const Ziptree = require('ziptree');
const converter = require('json-2-csv');
const q = require('q');
const fs = require('fs');


const exportCsv = (data) => {
  const d = q.defer();

  q.fcall(() => {
    const d2 = q.defer();
    converter.json2csv(data.value, (err, csv) => {
      if (err) throw err;
      d2.resolve(csv);
    }, {
      CHECK_SCHEMA_DIFFERENCES: false,
    });
    return d2.promise;
  }).then((csv) => {
    const d2 = q.defer();

    const file = `${data.key}_${Math.random().toString().slice(-5)}_${Date.now()}.csv`;
    fs.writeFileSync(`${__dirname}/../../files/${file}`, csv);
    console.log(`${__dirname}/../../files/${file} scheduled to delete in ${1 * 60 * 1000} milliseconds`);
    setTimeout(() => {
      fs.unlink(`${__dirname}/../../files/${file}`, () => {});
    }, 1 * 60 * 1000);
    d2.resolve(file);

    return d2.promise;
  }).then((file) => {
    console.log(file);
    d.resolve(file);
  }).catch((err) => {
    d.reject(err);
  });

  return d.promise;
};

const more = () => {

};


export {
  exportCsv,
  more,
};
