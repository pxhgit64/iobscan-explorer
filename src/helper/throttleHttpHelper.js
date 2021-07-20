import axios from 'axios';

export class throttleHttpHelper {
  constructor() {
    this.cacheMap = new Map()
    this.pendingArr = []
    this.arr = []
    this.stackLength = 30
  }
  /*
  * FIXME: 边界情况
  */
  validate = () => {
    if(this.arr.length < this.stackLength){
      return true
    } else {
      return false
    }
  }

  queryCache = (key) => {
    if(this.cacheMap.has(key)){
      return this.cacheMap.get(key)
    } else {
      return null
    }  
  }

  setPending = (key, resolve, reject) => {
    let list = this.pendingArr[key] || (this.pendingArr[key] = []);
    resolve && list.push({ resolve, reject: 'reject!' });
  }

  request = (url, payload) => {
    let { key } = payload
    if(this.validate()){
      if(this.queryCache(key)){
        return this.queryCache(key)
      } else if(this.pendingArr[key]){
        return new Promise((resolve, reject) => {
          this.pendingArr[key].push({ resolve, reject });
        });
      } else {
        this.setPending(key);
        return new Promise((resolve, reject) => {
          this.pendingArr[key].push({ resolve, reject });
          axios.post(url, payload).then(data => {
            if(data && (data.status === 200 || data.status === 201)){
              let list = this.pendingArr[key];
              list.forEach((item) => {
                item.resolve(data.data);
              });
              delete this.pendingArr[key];
              this.cacheMap.set(key, data.data)
            } else {
              console.error('request from server failed:', data);
              return null
            }
          })
        })
      }
    } 
  }
}

const _requestThrottler = new throttleHttpHelper();

export async function requestThrottler(url, payload){
  return await _requestThrottler.request(url, payload)
}