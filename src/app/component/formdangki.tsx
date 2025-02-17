"use client";

import React, { useState, useEffect } from "react";
import { user } from "../../service/user";
import Image from "next/image";
import { GetLocation } from '../../service/getlocation'
import "./formdangki.css"

export default function FormdangkiFormdangki() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [image, setImage] = useState(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  useEffect(() => {
    GetLocation()
      .then((position) => {
        setLatitude(position.latitude);
        setLongitude(position.longitude);
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  const handleCheckuser = async () => {
    setError(""); // Xóa lỗi cũ trước khi kiểm tra

    // Kiểm tra số điện thoại
    if (!/^\d{10}$/.test(phone)) {
      setError("Số điện thoại không hợp lệ!");
      return;
    }

    // Kiểm tra mật khẩu
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp!");
      return;
    }

    const Formdata = new FormData();
    Formdata.append('sdt', phone);
    Formdata.append('password', password);
    const checkuser = await user.checkuser(Formdata);
    if (checkuser.thongbao === false) {
      setError(checkuser.loi);
    } else {
      setStep(2);
    }
  };

  const handleRegister = async () => {
    setError('');
    if (username.length < 1) {
      setError('Vui lòng điền tên');
      return;
    }

    if (!longitude && !latitude) {
      setError('Vui lòng bật quyền vị trí');
      return;
    }

    const formdata = new FormData();
    formdata.append('sdt', phone);
    formdata.append('password', password);
    formdata.append('username', username);
    formdata.append('file', image || 'https://res.cloudinary.com/dnjakwi6l/image/upload/v1739122182/t%E1%BA%A3i_xu%E1%BB%91ng_kpibdt.png');
    formdata.append('lat', latitude ? latitude.toString() : '');
    formdata.append('lon', longitude ? longitude.toString() : '');

    const response = await user.dangki(formdata);
    console.log(response);
  }
  const handleHuy = async()=>{
    setStep(1)
}
  return (
    <div className="w-full h-lvh bg-gradient-to-b from-[#FF33FF] to-[#003300] flex justify-center items-center">
      {/* Form Đăng Ký Bước 1 */}
      {step === 1 && (
        <div className={`form-container ${step === 1 ? "show" : "hide"} bg-white w-[300px] p-4 rounded-lg`}>
          <h2 className="text-2xl font-bold mb-4 text-black">ĐĂNG KÝ</h2>
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

            <div className="grid text-left text-black mt-2">
              <label>Nhập lại mật khẩu</label>
              <input
                className="rounded-md h-[35px] border p-2"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              className="bg-[#FF33FF] text-white py-2 px-4 rounded-lg hover:bg-[#CC33FF] mt-4 w-full"
              onClick={handleCheckuser}
            >
              Đăng ký
            </button>
            <button
              className="bg-[#ff3333] text-white py-2 px-4 rounded-lg hover:bg-[#f06666] mt-4 w-full"
            >
              Đăng nhập 
            </button>
          </div>
        </div>
      )}

      {/* Form Đăng Ký Bước 2 */}
      {step === 2 && (
        <div className={`form-container ${step === 2 ? "show" : "hide"} bg-white w-[400px] p-4 rounded-lg`}>
          <h2 className="text-2xl font-bold mb-4 text-black">ĐĂNG KÝ</h2>
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <div className="grid text-left text-black">
              <label>Tên của bạn</label>
              <input
                className="rounded-md h-[35px] border p-2"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="grid text-left text-black">
              <label>Chọn ảnh đại diện</label>
              <div className="flex justify-center">
                <Image
                  src={image ? URL.createObjectURL(image) : 'https://res.cloudinary.com/dnjakwi6l/image/upload/v1739122182/t%E1%BA%A3i_xu%E1%BB%91ng_kpibdt.png'}
                  alt="avatar"
                  width={200}
                  height={200}
                  className="rounded-full my-2"
                />
              </div>
              <input
                className="rounded-md h-[35px] border p-2"
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <button
              className="bg-[#FF33FF] text-white py-2 px-4 rounded-lg hover:bg-[#CC33FF] mt-4 w-full"
              onClick={handleRegister}
            >
              Hoàn tất
            </button>
            <button
                   className="bg-[#ff3333] text-white py-2 px-4 rounded-lg hover:bg-[#f06666] mt-4 w-full"
                   onClick={handleHuy}
                 >
                   Quay lai
                 </button>
          </div>
        </div>
      )}
    </div>
  );
}
