// User.ts (hoặc tên file bạn muốn)
const url = "http://localhost:3001/user/";

class User {
  // Phương thức login
  async checkuser(data: any) {
    console.log(data);
    
    try {
      const response = await fetch(`${url}checkuser`, {
        method: 'POST',
 
        body: data,
      });

      const result = await response.json();
      return result; 
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
    }
  }

  async dangki(data:any) {

    try {
        const reponse = await fetch(`${url}dangki`,{
            method:'POST',
            body:data,
        });
        const result = await reponse.json();
        return result;
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
    }
  }

  async login(data:any){
    try {
      const reponse = await fetch(`${url}login`,{
        method:'POST',
        body:data,
      });
      const result = await reponse.json();
      return result;
    } catch (error) {
      console.error('Lỗi khi đăng nhap:', error);
    }
  }
  async getalluser(){
    try {
      const reponse = await fetch(`${url}getalluser`,{
        method:'GET'
      })
      const result = await reponse.json();
      return result;
    } catch (error) {
      console.log(error);
      
    }
  }
  async updatelocation(data:any){
    try {
      const reponse = await fetch(`${url}updatelocation`,{
        method:'POST',
        body:data,
      })
      const result = await reponse.json();
      return result;
    } catch (error) {
      console.log(error);
      
    }
  }
}

// Xuất đối tượng User để sử dụng ở nơi khác
export const user = new User();
