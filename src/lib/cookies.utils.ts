import { cookies } from "next/headers";

export const setCookie = async (
  name: string,
  value: string,
  maxAgeInSecods: number
) => {
  try {
    const cookieStore = await cookies();
   cookieStore.set(name, value, {
      httpOnly: true,
      maxAge: maxAgeInSecods,
      path: "/",
      sameSite: "strict",
    });

  } catch (error:any) {
    return {
        success:false,
        message:`Set Cookie failed: ${error?.message}`
    }
  }
};


export const getCookie=async(name:string)=>{
    try{
        const cookieStore = await cookies();
    return await cookieStore.get(name);

    }
    catch (error:any) {
        return {
            success:false,
            message:`get Cookie failed: ${error?.message}`
        }
    }
}

export const deleteCookie=async(name:string)=>{
    try{
        const cookieStore = await cookies();
     await cookieStore.delete(name);

    }
    catch (error:any) {
        return {
            success:false,
            message:`delete Cookie failed: ${error?.message}`
        }
    }
}