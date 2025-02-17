// Định nghĩa interface cho User
export interface Userinterface {
    _id: string;
    sdt:string;
    username: string;
    avatar: string;  // Đảm bảo rằng mỗi user có thuộc tính avatar
    lat: number;
    lon: number;
  }
  