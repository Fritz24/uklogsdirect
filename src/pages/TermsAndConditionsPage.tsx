import React from 'react';

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl"> {/* Adjusted max-w for more content width */}
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-800">
          Terms and Conditions
        </h2>
        <p className="mt-4 text-center text-lg text-gray-700">Welcome to Logs Supply Pro!</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl"> {/* Adjusted max-w for more content width */}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <p className="text-gray-700 leading-relaxed mb-6">
            These Terms and Conditions (“Terms”) govern your use of our website and the purchase of products from Logs Supply Pro (“we,” “us,” or “our”). By accessing or using our site, you agree to these Terms in full. Please read them carefully.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">1. General</h3>
              <p className="text-gray-700 leading-relaxed">
                Logs Supply Pro is an online store that sells logs and other related accessories. By placing an order, you agree to provide accurate information and abide by these Terms.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">2. Orders and Payment</h3>
              <p className="text-gray-700 leading-relaxed">
                All orders are subject to acceptance and availability.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Prices and product availability are subject to change without notice.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Payment must be completed at the time of purchase via the payment methods provided.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to cancel or refuse any order at our discretion.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">3. Shipping and Delivery</h3>
              <p className="text-gray-700 leading-relaxed">
                Delivery times are estimates and may vary due to factors beyond our control.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Risk of loss or damage passes to you upon delivery.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You are responsible for providing accurate shipping information.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">4. Returns and Refunds</h3>
              <p className="text-gray-700 leading-relaxed">
                Returns and refunds are handled in accordance with our Return Policy, available on our website.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Products must be returned in original condition and packaging.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Some items may be non-returnable or subject to restocking fees.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">5. Use of the Website</h3>
              <p className="text-gray-700 leading-relaxed">
                You agree to use our website only for lawful purposes.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You shall not misuse or interfere with the site's operation or security.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Unauthorized use of the website may give rise to a claim for damages.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">6. Intellectual Property</h3>
              <p className="text-gray-700 leading-relaxed">
                All content on the site, including text, images, logos, and designs, are owned by or licensed to Logs Supply Pro.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You may not use, reproduce, or distribute any content without prior written consent.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">7. Limitation of Liability</h3>
              <p className="text-gray-700 leading-relaxed">
                We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the site or products.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our liability is limited to the purchase price of the product in question.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">8. Privacy</h3>
              <p className="text-gray-700 leading-relaxed">
                Your personal information is collected and used as described in our Privacy Policy.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using the site, you consent to the collection and use of your data.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">9. Changes to Terms</h3>
              <p className="text-gray-700 leading-relaxed">
                We may update these Terms at any time without prior notice.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Your continued use of the site after changes indicates your acceptance of the updated Terms.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">10. Governing Law</h3>
              <p className="text-gray-700 leading-relaxed">
                These Terms are governed by the laws of the United Kingdom.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Any disputes will be subject to the exclusive jurisdiction of the courts in the United Kingdom.
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed mt-6">
              If you have any questions about these Terms, please contact us at <a href="mailto:logsupplypro1@gmail.com" className="text-green-600 hover:text-green-500">logsupplypro1@gmail.com</a> or via WhatsApp at <a href="https://wa.me/13308146802" className="text-green-600 hover:text-green-500">+1 330-814-6802</a>.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Thank you for choosing Logs Supply Pro!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 