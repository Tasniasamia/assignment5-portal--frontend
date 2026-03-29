import UpdateProfile from '@/components/modules/auth/updateProfileForm';
import { getUserInfo } from '@/service/auth.service';
import React from 'react';

const MyProfile = async() => {
      const data=await getUserInfo();
    
    return (
        <div>
            <UpdateProfile data={data}/>
        </div>
    );
};

export default MyProfile;