"use client"

import React, { createContext, useContext, useState, useEffect,ReactNode } from 'react';

import  io,{Socket}  from 'socket.io-client';
interface SocketProviderProps {
    children: ReactNode;
  }
type SocketContextType ={
    socket:Socket | null;
    updatelocation:(id_user:string,latitude:number,longitude:number) =>void;
    sendmessage:(id_user:string,message:string,time:string) =>void;
}
const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const userSocket=()=>{
    const context = useContext(SocketContext)
    if(!context){
        throw new Error("useSocket must be used within a SocketProvider");
        
    }
    return context;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
  
    useEffect(() => {
      const sockets = io("http://localhost:3001/");
      setSocket(sockets);
  
      // Dọn dẹp khi component bị unmount
      return () => {
        sockets.disconnect();
      };
    }, []);
  
    // Cập nhật hàm updatelocation để nhận thêm timestamp
    const updatelocation = (id_user: string, latitude: number, longitude: number) => {
      if (socket) {
        socket.emit('updatelocation', id_user, latitude, longitude);
      }
    };
  
    // Hàm gửi tin nhắn
    const sendmessage = (id_user: string, message: string,time:string) => {
      if (socket) {
        socket.emit('sendMessage', id_user, message,time);
      }
    };
  
    return (
      <SocketContext.Provider value={{ socket, updatelocation, sendmessage }}>
        {children}
      </SocketContext.Provider>
    );
  };