import React from 'react';
import PageBanner from '@/components/common/banner'
import AboutSection from '@/components/common/about';
import ContactSection from '@/components/common/contact';

const page = () => {
    return (
        <div>
            <PageBanner title="About" />
            <AboutSection/>
            <ContactSection/>
        </div>
    );
};

export default page;