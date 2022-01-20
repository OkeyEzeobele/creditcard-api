import bcrypt from 'bcrypt-nodejs';

const encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const encryptCard = (cardNumber) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(cardNumber, salt);
};

const trimCharacters = (string) => {
  const text = string || '';
  const m = /[a-zA-Z0-9 ]/gm;
  const p = text.match(m);
  return (p) ? p.join('') : string;
};

const trimNumbers = (string) => {
  const text = string || '';
  const m = /[0-9]/gm;
  const p = text.match(m);
  return (p) ? p.join('') : string;
};

const padString = (padChr, size, stringToPad) => {
  var padLength = size - stringToPad.toString().length;
  var padding = padChr.repeat(size);
  if (padLength < 0) {
    padLength = 0;
  }
  return padding.slice(0, padLength) + stringToPad;
};

const randomString = (length, format = '1aA') => {
  format = format.toString();
  var result = '';
  var chars = '';
  var base = {
    1: '0123456789',
    a: 'abcdefghijklmnopqrstuvwxyz',
    A: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    S: '!@#$%^&*()_+{}:?><|~`',
    X: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
  };

  for (var x in format) {
    chars += base[format[x]];
  }

  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};


const verifyPassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

export { encryptPassword, padString, verifyPassword, encryptCard, randomString, trimCharacters, trimNumbers };
