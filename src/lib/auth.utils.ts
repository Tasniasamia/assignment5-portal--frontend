export const authRoute=['/login','/register','/forget-password','/verify-email'];

export const isAuthRoute=(path:string)=>{
return    authRoute.some((route)=>route==path)
}

interface RouteConfigType{
    exact:string[];
    pattern:RegExp[];
}


export const adminRoute: RouteConfigType = {
    exact: [],
    pattern: [
      /^\/admin\/dashboard(\/.*)?$/
    ],
  };
  
  export const memberRoute: RouteConfigType = {
    exact: [],
    pattern: [
      /^\/member\/dashboard(\/.*)?$/
    ],
  };

export const commonProtectedRoute:RouteConfigType={
    exact:['/changePassword','/my-profile'],
    pattern:[]
}



export const isMatchRoute=(path:string,routeConfig:RouteConfigType)=>{

    if(routeConfig?.exact?.includes(path)){
     return true;
    }
 
    return routeConfig?.pattern?.some((route)=> route.test(path));
 }

  export const routeOwner=(path:string)=>{
    if(isMatchRoute(path,adminRoute)){
        return 'ADMIN';
    }
    else if(isMatchRoute(path,memberRoute)){
        return 'MEMBER';
    }

    else if(isMatchRoute(path,commonProtectedRoute)){
        return 'COMMON'
    }
    else{
        return null;
    }
  }

export const defaultRoute = (role: string) => {
  const normalized = role?.toUpperCase(); // ← এটাই fix
  if (normalized === "ADMIN") return '/admin/dashboard';
  if (normalized === "MEMBER") return '/member/dashboard';
  return '/';
};

export const isValidRedirect = (path: string, role: string) => {
  const routeowner = routeOwner(path);
  if (routeowner === role?.toUpperCase()) { // ← normalize করো
    return true;
  }
  return false;
};