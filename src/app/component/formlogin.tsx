"use client"

import React, { useState, useEffect } from "react";
import {user} from "../../service/user"
import Image from "next/image";
import { useRouter } from "next/navigation";


import {GetLocation} from '../../service/getlocation'


export default function FormLogin(){
    const router = useRouter();
  
      const [error, setError] = useState("");
      const [password, setPassword] = useState("");
        const [phone, setPhone] = useState("");
          const [ latitude,setLatitude] = useState<number | null>(null);
          const [longitude,setLongitude] = useState<number | null>(null);
  useEffect(() => {
    // Gọi dịch vụ để lấy vị trí
    GetLocation()
      .then((position) => {
        // Xử lý kết quả
        setLatitude(position.latitude);
        setLongitude(position.longitude);
        // console.log(position.latitude,position.longitude);
        
      })
      .catch((err) => {
        // Xử lý lỗi
        setError(err);
      });
  }, []);          
      const handleHuy = async()=>{

      }
      const handleLogin = async() =>{
        setError('');
        if (!/^\d{10}$/.test(phone)) {
            setError("Số điện thoại không hợp lệ!");
            return;
          }
          if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
          }
          if(!longitude && latitude){
            alert('vui long bat vi tri');
            return;
          }

          const formdata = new FormData()
          formdata.append('sdt',phone);
          formdata.append('password',password);
          formdata.append('lat',latitude ? latitude.toString() :'');
          formdata.append('lon',longitude ? longitude.toString() : '');

          const reponse =await user.login(formdata);
        
          if(reponse.thongbao === true){
            console.log('dang nhap thanh cong');
            const userdata = {username:reponse.data.username,_id:reponse.data._id}
            localStorage.setItem('user',JSON.stringify(userdata));
            router.push('/page/home')

          }else if(reponse.thongbao=== false){
            console.log(reponse.loi);
            
          }
      }
    
    return(
         <div className="w-full h-lvh bg-gradient-to-b from-[#FF33FF] to-[#003300] flex justify-center items-center">
              <div className="text-center w-[350px] border border-black p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-black">ĐĂNG NHẬP</h2>
        
                {/* Hiển thị lỗi nếu có */}
                {error && <p className="text-red-500">{error}</p>}
        
                <div>
                <div className="grid text-left text-black">
                   <label>Số điện thoại</label>
                   <input
                     className="rounded-md h-[35px] border p-2"
                     type="text"
                     value={phone}
                     onChange={(e) => setPhone(e.target.value)}
                   />
                 </div>
         
                 <div className="grid text-left text-black mt-2">
                   <label>Mật khẩu</label>
                   <input
                     className="rounded-md h-[35px] border p-2"
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                   />
                 </div>
         

         
                 {/* Button Đăng ký */}
                 <button
                   className="bg-[#FF33FF] text-white py-2 px-4 rounded-lg hover:bg-[#CC33FF] mt-4 w-full"
                   onClick={handleLogin}
                 >
                   Đăng ký
                 </button>
                 <button
                   className="bg-[#ff3333] text-white py-2 px-4 rounded-lg hover:bg-[#f06666] mt-4 w-full"
                   onClick={handleHuy}

                 >
                   Hủy
                 </button>
                </div>

              </div>
            </div>
    )
}