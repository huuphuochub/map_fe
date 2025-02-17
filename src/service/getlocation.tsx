import { rejects } from "assert";
import { error } from "console";
import { resolve } from "path";

export const GetLocation = ():Promise<{latitude:number;longitude:number}> =>{
    return new Promise((resolve,rejects)=>{
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                (position) =>{
                    const latitude= position.coords.latitude;
                    const longitude = position.coords.longitude;
                    resolve({latitude,longitude})
                },
                (error) =>{
                    rejects('lỗi khi lấy vị trí : ' + error.message);
                }
            );
            
        }else{
            rejects('trình duyệt k hỗ trợ vị trí')
        }
    })
}