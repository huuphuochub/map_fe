"use client"

import { useState, useEffect, useRef } from 'react';

export default function Testloaction(){
  const [location,setLoaction] = useState<{latitude:number;longitude:number} | null> (null);
  const [lastlocation,setLastlocation] = useState<{latitude:number;longitude:number} |  null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [coordinates, setCoordinates] = useState<{ latitude: number | null, longitude: number | null }>({
    latitude: null,
    longitude: null
  });

  const dangxuat = async()=>{
    localStorage.removeItem('user');

  }
  useEffect(()=>{
    if(!navigator.geolocation){
      alert('vui long bat vi tri');
      return;
    }
    const watchid = navigator.geolocation.watchPosition(
      (position)=>{
        // console.log("Vị trí cập nhật:", position.coords.latitude, position.coords.longitude);

        const {latitude,longitude} = position.coords;
        setCoordinates({ latitude, longitude }); // Cập nhật vị trí người dùng

        const newLocation = {latitude,longitude};

        if(location && lastlocation ){
          const chenhlech = getDistance(lastlocation.latitude,lastlocation.longitude,latitude,longitude);

          if(chenhlech > 10){
            setIsMoving(true);
            // console.log(chenhlech);
            
            console.log('nguoi dung di chuyen');
            
          }else{
            setIsMoving(false);
            // console.log('nguoi dung k di chuyen');
            // console.log(chenhlech);
            
            
          }
        };
        setLastlocation(newLocation);
        setLoaction(newLocation);
        
      }
    )
    return()=>{
      navigator.geolocation.clearWatch(watchid)
    }
  })

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

  return(
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
  )
}