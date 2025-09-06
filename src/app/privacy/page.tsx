export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
      
      <div className="text-gray-300 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-red-400 mb-4">Information We Collect</h2>
          <h3 className="text-lg font-semibold text-white mb-2">Information you provide directly:</h3>
          <ul className="list-disc ml-6 space-y-1 mb-4">
            <li>Account information (name, email address, password)</li>
            <li>Profile information and preferences</li>
            <li>Chat messages and comments</li>
            <li>Subscription and payment information</li>
            <li>Contact form submissions and support requests</li>
          </ul>
          <h3 className="text-lg font-semibold text-white mb-2">Information from third-party services:</h3>
          <ul className="list-disc ml-6 space-y-1 mb-4">
            <li>Google/YouTube: Basic profile information (name, email, profile picture)</li>
            <li>Facebook: Basic profile information (name, email, profile picture)</li>
            <li>Payment processors: Transaction details and billing information</li>
          </ul>
          <h3 className="text-lg font-semibold text-white mb-2">Automatically collected information:</h3>
          <ul className="list-disc ml-6 space-y-1">
            <li>Device and browser information</li>
            <li>IP address and location data</li>
            <li>Usage patterns and preferences</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-red-400 mb-4">How We Use Your Information</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>To provide and maintain our streaming and podcast services</li>
            <li>To process your subscription and payments</li>
            <li>To communicate with you about your account or our services</li>
            <li>To improve our website and user experience</li>
            <li>To ensure the security of our platform</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-red-400 mb-4">Authentication & Social Login</h2>
          <p className="mb-4">
            We use secure authentication services including Google, Facebook, and other social 
            media platforms. When you sign in with these services:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>We only receive basic profile information (name, email, profile picture)</li>
            <li>We do not store your social media passwords</li>
            <li>You can revoke our access to your social accounts at any time</li>
            <li>We use OAuth 2.0 protocols for secure authentication</li>
            <li>Your social media activity is not tracked or monitored</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-red-400 mb-4">Cookies and Tracking</h2>
          <p className="mb-4">We use cookies and similar technologies to:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Keep you signed in to your account</li>
            <li>Remember your preferences and settings</li>
            <li>Analyze website traffic and usage patterns</li>
            <li>Provide personalized content and recommendations</li>
          </ul>
          <p className="mt-4">
            You can control cookies through your browser settings, but disabling them may 
            affect website functionality.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-red-400 mb-4">Data Retention</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Account information: Retained while your account is active</li>
            <li>Chat messages: Retained for moderation and user experience purposes</li>
            <li>Payment information: Retained as required by law and payment processors</li>
            <li>Analytics data: Aggregated and anonymized data may be retained indefinitely</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-red-400 mb-4">Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Delete your account and associated data</li>
            <li>Export your data</li>
            <li>Opt out of marketing communications</li>
            <li>Withdraw consent for data processing</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-red-400 mb-4">Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction. All passwords 
            are encrypted using industry-standard hashing algorithms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-red-400 mb-4">Chat & User Content</h2>
          <p>
            Messages sent in our live chat are stored to maintain chat history and ensure 
            moderation. Please be mindful that chat messages may be visible to other users 
            and our moderation team.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-red-400 mb-4">Third-Party Services</h2>
          <p>
            Our website may integrate with third-party services like YouTube, Shopify, and 
            payment processors. These services have their own privacy policies, and we 
            encourage you to review them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-red-400 mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us through 
            our website or email us directly.
          </p>
        </section>

        <div className="text-sm text-gray-400 mt-8 pt-8 border-t border-gray-700">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
