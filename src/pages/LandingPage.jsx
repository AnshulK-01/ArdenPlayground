import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/landing.css';
import HeroSection from './landing/HeroSection';
import AboutSection from './landing/AboutSection';
import KleenesSection from './landing/KleenesSection';
import ArdensSection from './landing/ArdensSection';
import HowItWorks from './landing/HowItWorks';
import FeaturesSection from './landing/FeaturesSection';
import AISection from './landing/AISection';
import ArdenDemo from './landing/ArdenDemo';
import CTASection from './landing/CTASection';
import Footer from './landing/Footer';

export default function LandingPage() {
  const navigate = useNavigate();
  const launch = () => navigate('/app');

  return (
    <div className="landing-page">
      <HeroSection onLaunch={launch} />
      <div className="section-divider" />
      <AboutSection />
      <div className="section-divider" />
      <KleenesSection />
      <div className="section-divider" />
      <ArdensSection />
      <div className="section-divider" />
      <HowItWorks />
      <div className="section-divider" />
      <FeaturesSection />
      <div className="section-divider" />
      <AISection />
      <div className="section-divider" />
      <ArdenDemo />
      <div className="section-divider" />
      <CTASection onLaunch={launch} />
      <Footer />
    </div>
  );
}
