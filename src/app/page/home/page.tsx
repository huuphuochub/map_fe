"use client"

import { useState, useEffect, useRef } from 'react';
import L from "leaflet";
import { user } from "../../../service/user";
import { useRouter } from "next/navigation";
// import Testsocket from '@/service/socketio';
import { userSocket } from '@/service/socketio';

import { Userinterface } from "@/app/interface/userinterface";

export default function MapComponent  ()  {
        const router = useRouter();
    
    const dangxuat = async()=>{
        localStorage.removeItem('user');
        router.push('/page/login')

    }
    const {updatelocation} = userSocket();
    const [id_user, setid_user] = useState<Pick<Userinterface, "_id" | "username"> | null>(null);
    const mapRef = useRef<L.Map | null>(null); // Lưu trữ bản đồ
    const markersRef = useRef<Map<string, L.Marker>>(new Map()); // Lưu trữ các marker của người dùng
    const [location,setLoaction] = useState<{latitude:number;longitude:number} | null> (null);
    const [lastlocation,setLastlocation] = useState<{latitude:number;longitude:number} |  null>(null);
    const [users,setUsers] = useState<Userinterface[]>([])
    const [coordinates, setCoordinates] = useState<{ latitude: number | null, longitude: number | null }>({
        latitude: null,
        longitude: null
      });
      const fetchUsers = async () => {
        try {
          const response = await user.getalluser();
          // console.log(response.data);
          
          setUsers(response.data); // Cập nhật state với danh sách users
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu user:", error);
        }
      };
      useEffect(() => {
        const userlocal = localStorage.getItem('user')
        if(userlocal){
          const okuser = JSON.parse(userlocal) as Pick<Userinterface ,'_id' | 'username'>;
          
          setid_user(okuser)
          // console.log(id_user._id);
          
          
          
        }         
    
        fetchUsers(); // Gọi hàm async trong useEffect
        const interval = setInterval(()=>{
            fetchUsers();
        },3000);
        return()=>{
            clearInterval(interval);
        }
        
      }, []);
      useEffect(() => {
        if (users.length > 0 && coordinates.latitude !== null && coordinates.longitude !== null) {
          if (!mapRef.current) { // Kiểm tra nếu bản đồ chưa được khởi tạo
            // Nếu chưa khởi tạo bản đồ thì khởi tạo
            const map = L.map('map').setView([coordinates.latitude, coordinates.longitude], 13);
    
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap contributors',
              maxZoom: 18,
            }).addTo(map);
    
            // Lưu đối tượng bản đồ vào useRef để sử dụng lại
            mapRef.current = map;
          } 
          // thay đổi vị trí bản đồ về trung tâm theo kinh độ vĩ độđộ
          // else {
          //   mapRef.current.setView([coordinates.latitude, coordinates.longitude], 13);
          // }
    
          // Thêm hoặc cập nhật các marker cho mỗi người dùng
          users.forEach((person) => {
            const customIcon = L.icon({
              iconUrl: person.avatar,
              iconSize: [40, 40],
              iconAnchor: [20, 40],
              popupAnchor: [0, -40],
              className: 'rounded-full',
            });
    
            // Kiểm tra nếu marker đã tồn tại trong markersRef, nếu có thì chỉ cần cập nhật vị trí
            if (markersRef.current.has(person._id)) {
              const existingMarker = markersRef.current.get(person._id);
              existingMarker?.setLatLng([person.lat, person.lon]); // Cập nhật vị trí mới
            } else {
              // Nếu chưa có marker, tạo mới và thêm vào bản đồ
              const newMarker = L.marker([person.lat, person.lon], { icon: customIcon })
                .addTo(mapRef.current) // Thêm marker vào bản đồ hiện tại
                .bindPopup(`
                  <div style="text-align: center;">
                    <img src="${person.avatar}" alt="${person.username}" style="width: 100px; height: 100px; border-radius: 50%;" />
                    <p><strong>${person.username}</strong></p>
                    <p>This is ${person.username}'s location!</p>
                  </div>
                `);
    
              // Lưu marker vào markersRef để có thể cập nhật sau
              markersRef.current.set(person._id, newMarker);
            }
          });
        }
      }, [coordinates, users]); 

      function getDistance(lat1:number,lon1:number,lat2:number,lon2:number):number{
        const R = 6371e3;
        const tr1 = (lat1 * Math.PI)/180;
        const tr2 = (lat2 * Math.PI)/180;
        const tg1 = ((lat2 - lat1) * Math.PI) /180;
        const tg2 = ((lon2 - lon1) * Math.PI) /180;
    
    
        const a = 
        Math.sin(tg1/2) * Math.sin(tg1/2) + Math.cos(tr1) * Math.cos(tr2) * Math.sin(tg2 / 2) * Math.sin(tg2 / 2);
        const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
        return R *c;
      }

      useEffect(() => {
        if(!navigator.geolocation){
          alert('vui long bat vi tri');
        }
        // Lấy vị trí của người dùng khi lần đầu render component
       const watchid = navigator.geolocation.watchPosition(
        (position)=>{
          const {latitude,longitude} = position.coords;
        setCoordinates({ latitude, longitude }); // Cập nhật vị trí người dùng

        const newLocation = {latitude,longitude};
        if(location && lastlocation){
          const chenhlech = getDistance(lastlocation.latitude,lastlocation.longitude,latitude,longitude);
          // console.log(chenhlech);
          
          if (updatelocation && chenhlech > 1 && id_user) {
            updatelocation(id_user._id, latitude, longitude);
            console.log('da gui vi tri');
            
          } else {
            // console.error('updatelocation or id_user is not available');
            // console.log('ng dunng k di ch');
            
          }
        }
        setLastlocation(newLocation);
        setLoaction(newLocation);
        }
       )
        return() =>{
          navigator.geolocation.clearWatch(watchid)

        }
      });

  return (
    <div>
      
      <div id="map" style={{ height: '90vh', width: '100%', border: '1px solid black' }}></div>
      <div id="coordinates" style={{ marginTop: '20px' }} className="flex gap-4">
        <div>
        <p><strong>Latitude:</strong> {coordinates.latitude ? coordinates.latitude : 'Đang tải...'}</p>
        <p><strong>Longitude:</strong> {coordinates.longitude ? coordinates.longitude : 'Đang tải...'}</p>
        </div>
        <button onClick={dangxuat}>dang xuat</button>
      </div>
    </div>
  );
};

