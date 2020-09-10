import axios from 'axios';
export default axios.create({
  baseURL: `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

