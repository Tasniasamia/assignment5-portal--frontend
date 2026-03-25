import jwt, { JwtPayload } from 'jsonwebtoken'
import { setCookie } from './cookies.utils';


export const getRemaingSecondsToken=(token:string,jwtSecret:string):number=>{

if(!token || !jwtSecret){ return 0;}
const tokenPayload=jwtSecret?jwt.verify(token,jwtSecret) as JwtPayload:jwt.decode(token) as JwtPayload

if(!tokenPayload || (tokenPayload && !tokenPayload?.exp)){
    return 0;
}
const remainingSecods=(tokenPayload?.exp as any)- Math.floor(Date.now()/1000)

return remainingSecods>0?remainingSecods:0


}


export const setTokenInCookie = async (
    name: string,
    token: string,
    secret?: string
  ) => {
    let maxAgeInSeconds = 24 * 60 * 60;
  
    if (secret && token.split(".").length === 3) {
      maxAgeInSeconds =
        getRemaingSecondsToken(token, secret) ||
        24 * 60 * 60;
    }
  
    await setCookie(name, token, maxAgeInSeconds);
  };


  export const isWillExpiredSoon=(accessToken:string,time=300)=>{
    const remainingTime=getRemaingSecondsToken(accessToken,process.env.ACCESS_TOKEN_SECRET as string);
    return remainingTime>0 && remainingTime<=time;
  }

  export const isExpired=(accessToken:string,time=300)=>{
  const remainingTime=getRemaingSecondsToken(accessToken,process.env.ACCESS_TOKEN_SECRET as string);
   return remainingTime === 0;
  }
