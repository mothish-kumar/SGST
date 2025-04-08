import React from 'react'
import HeroSection from '../components/HeroSection'
import AboutUsComponent from '../components/AboutUsComponent'
import HowItWorksComponent from '../components/HowItWorksCmponent'
import TestimonialComponent from '../components/TestimonialComponent'
import ContactSection from '../components/ContactSection'

const LandingPage = () => {
  return (
    <div>
       <HeroSection/>
       <AboutUsComponent/>
       <HowItWorksComponent/>
       <TestimonialComponent/>
       <ContactSection/>
    </div>
  )
}

export default LandingPage