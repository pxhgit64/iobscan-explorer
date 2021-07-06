import axios from 'axios';

export class HttpHelper {

    static async get(url){
        const data = await axios.get(url);
        if(data && data.status === 200){
            return data.data;
        } else {
            console.error('request from server failed:', data);
            return null
        }
    }
}