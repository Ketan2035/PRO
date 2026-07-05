import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#172337] text-white pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: About */}
          <div>
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">About</h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
              <li><Link to="/about" className="hover:underline">About Us</Link></li>
              <li><Link to="/about" className="hover:underline">Careers</Link></li>
              <li><Link to="/about" className="hover:underline">Urban Saathi Stories</Link></li>
              <li><Link to="/about" className="hover:underline">Press</Link></li>
            </ul>
          </div>

          {/* Column 2: Help */}
          <div>
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">Help</h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link to="/contact" className="hover:underline">Payments</Link></li>
              <li><Link to="/contact" className="hover:underline">Service Guarantees</Link></li>
              <li><Link to="/contact" className="hover:underline">Cancellation & Refunds</Link></li>
              <li><Link to="/contact" className="hover:underline">FAQ</Link></li>
              <li><Link to="/contact" className="hover:underline">Report Infringement</Link></li>
            </ul>
          </div>

          {/* Column 3: Consumer Policy */}
          <div>
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">Consumer Policy</h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link to="/" className="hover:underline">Cancellation & Refunds</Link></li>
              <li><Link to="/terms" className="hover:underline">Terms Of Use</Link></li>
              <li><Link to="/privacy" className="hover:underline">Security</Link></li>
              <li><Link to="/privacy" className="hover:underline">Privacy</Link></li>
              <li><Link to="/" className="hover:underline">Sitemap</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div className="border-l border-gray-700 pl-0 lg:pl-8">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">Mail Us</h3>
            <ul className="flex flex-col gap-2 text-sm text-gray-300 mb-6">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>Urban Saathi Internet Private Limited, <br/> Buildings Alyssa, Begonia & Clove Embassy Tech Village, <br/> Outer Ring Road, Devarabeesanahalli Village, <br/> Bengaluru, 560103, Karnataka, India</span>
              </li>
              <li className="flex items-center gap-2 mt-2">
                <Mail size={16} /> support@urbansaathi.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} /> 044-45614700
              </li>
            </ul>

            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">Social</h3>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-blue-400"><Facebook size={20} /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-blue-400"><Twitter size={20} /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-500"><Instagram size={20} /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-red-500"><Youtube size={20} /></a>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><span className="text-yellow-400">★</span> Become a Professional</span>
            <span className="flex items-center gap-2"><span className="text-yellow-400">★</span> Advertise</span>
            <span className="flex items-center gap-2"><span className="text-yellow-400">★</span> Gift Cards</span>
            <span className="flex items-center gap-2"><span className="text-yellow-400">★</span> Help Center</span>
          </div>
          <p>© 2026 Urban Saathi.com</p>
        </div>
        
      </div>
    </footer>
  );
}