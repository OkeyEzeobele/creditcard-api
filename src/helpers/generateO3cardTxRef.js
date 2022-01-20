import cryptoRandomString from 'crypto-random-string';
import moment from 'moment';

const year = moment().format('YY');
const day = moment().format('DDDD');
const options = { length: 7, type: 'numeric' };

export default () => `${year}${day}${cryptoRandomString(options)}`;
