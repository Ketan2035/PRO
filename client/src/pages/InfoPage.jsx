import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function InfoPage() {
  const location = useLocation();
  
  let title = "Information";
  let content = "Detailed content will be available here soon.";

  if (location.pathname.includes("/contact")) {
    title = "Contact Us & Help Center";
    content = "If you have any questions or need help with a booking, please reach out to our 24/7 support team at support@urbansaathi.com or call us at 1-800-SAATHI.";
  } else if (location.pathname.includes("/about")) {
    title = "About Urban Saathi";
    content = "Urban Saathi is India's leading tech-enabled home services marketplace. We connect customers with trusted, verified professionals for all their home needs. Whether it's cleaning, repairs, or beauty services, we guarantee quality and safety.";
  } else if (location.pathname.includes("/terms")) {
    title = "Terms of Use";
    content = "Welcome to Urban Saathi. By using our platform to book or provide services, you agree to our comprehensive Terms of Use and Service Guarantees. Urban Saathi acts as a marketplace to connect customers with verified professionals.";
  } else if (location.pathname.includes("/privacy")) {
    title = "Privacy Notice";
    content = "We take your privacy seriously. Urban Saathi only collects data necessary to process your bookings, verify professional identities, and improve our platform experience. We never sell your personal data to third parties.";
  }

  return (
    <div className="min-h-[80vh] flex flex-col bg-gray-50">
      <div className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-12">
        <div className="mb-8">
           <Link to="/" className="text-[#007185] hover:text-[#c45500] hover:underline text-sm flex items-center gap-1">
             &lsaquo; Back to Home
           </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-medium text-gray-900 mb-6 border-b pb-4">{title}</h1>
          <div className="text-gray-700 leading-relaxed space-y-4">
             <p>{content}</p>
             <p>This is a placeholder page designed to give you a complete e-commerce experience on Urban Saathi. In a production environment, this page would contain the full legal and operational documentation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
