'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Testloaction from "./page/test/page";


// import { GGetLocation } from "@/service/getlocation";

export default function Home() {
  const router = useRouter();

  // useEffect(() =>{
  //   const userdata = localStorage.getItem('user');
  //   if(!userdata){
  //     router.push('/page/login')
  //   }else{
  //     router.push('/page/home')

  //   }
  // })
  return (
    <div>
      <Testloaction/>
      {/* <Formdangki/> */}
      {/* <Formlogin/> */}
      {/* <MapComponent /> */}

    {/* <TestMapComponent/> */}
    </div>
  );
}
