import PageBanner from '@/components/common/banner';
import VerifiedEmailForm from '@/components/modules/auth/verifyEmailForm';
import React from 'react';

const ForgetPassword = () => {
    return (
        <div>
            <PageBanner title="Verify Email"/>
            <VerifiedEmailForm/>
        </div>
    );
};

export default ForgetPassword;