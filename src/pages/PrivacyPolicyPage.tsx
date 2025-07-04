import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-800">
          Privacy Policy
        </h2>
        <p className="mt-4 text-center text-lg text-gray-700">Your privacy is important to us.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <p className="text-gray-700 leading-relaxed mb-6">
            This Privacy Policy describes how Logs Supply Pro collects, uses, and discloses your personal information when you visit or make a purchase from our website.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Information We Collect</h3>
              <p className="text-gray-700 leading-relaxed">
                We collect personal information you provide directly to us, such as when you create an account, place an order, sign up for our newsletter, or contact us. This may include your name, email address, shipping address, billing address, phone number, and payment information.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                We also automatically collect certain information when you access or use our website, such as your IP address, browser type, operating system, referring URLs, pages viewed, and the dates and times of your visits.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">2. How We Use Your Information</h3>
              <p className="text-gray-700 leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed ml-4">
                <li>Process your orders and manage your account.</li>
                <li>Communicate with you about your orders, products, services, and promotions.</li>
                <li>Improve our website, products, and services.</li>
                <li>Personalize your experience on our website.</li>
                <li>Detect and prevent fraud and other illegal activities.</li>
                <li>Comply with legal obligations.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">3. Sharing Your Information</h3>
              <p className="text-gray-700 leading-relaxed">
                We may share your personal information with third-party service providers who perform services on our behalf, such as payment processing, shipping, data analysis, email delivery, and marketing assistance. These service providers are obligated to protect your information and use it only for the purposes for which it was disclosed.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                We may also disclose your information if required by law, in response to a court order, or to protect our rights or the safety of others.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">4. Data Security</h3>
              <p className="text-gray-700 leading-relaxed">
                We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">5. Your Choices</h3>
              <p className="text-gray-700 leading-relaxed">
                You can access, update, or delete your personal information by logging into your account. You may also opt-out of receiving promotional emails from us by following the unsubscribe instructions in those emails.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">6. Changes to This Privacy Policy</h3>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">7. Contact Us</h3>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at <a href="mailto:logsupplypro1@gmail.com" className="text-green-600 hover:text-green-500">logsupplypro1@gmail.com</a>.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
} 