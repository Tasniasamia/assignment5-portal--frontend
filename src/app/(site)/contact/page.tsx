import React from 'react';
import PageBanner from '@/components/common/banner'
import ContactSection from '@/components/common/contact';
const page = () => {
    return (
        <div>
            <PageBanner title="Contact Us"/>
            <ContactSection/>
        </div>
    );
};

export default page;