
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <MainLayout>
      <div className="container max-w-4xl py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p className="mb-4">We collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Personal Information:</strong> Name, email address, and other information you provide when creating an account</li>
                <li><strong>Financial Data:</strong> Budget information, expenses, goals, and portfolio data you enter into our application</li>
                <li><strong>Usage Data:</strong> Information about how you use our service, including login times and feature usage</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, and other technical identifiers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p className="mb-4">We use your information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our financial management services</li>
                <li>To process your financial data and generate insights</li>
                <li>To communicate with you about your account and our services</li>
                <li>To improve our application and develop new features</li>
                <li>To ensure the security and integrity of our services</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Data Storage and Security</h2>
              <p className="mb-4">
                Your data is stored securely using Supabase, which provides enterprise-grade security features including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encryption in transit and at rest</li>
                <li>Regular security audits and monitoring</li>
                <li>Secure data centers with physical security measures</li>
                <li>Regular backups and disaster recovery procedures</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Your Rights Under GDPR</h2>
              <p className="mb-4">If you are a resident of the European Union, you have the following rights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Right of Access:</strong> You can request a copy of your personal data</li>
                <li><strong>Right to Rectification:</strong> You can correct inaccurate personal data</li>
                <li><strong>Right to Erasure:</strong> You can request deletion of your personal data</li>
                <li><strong>Right to Data Portability:</strong> You can request your data in a machine-readable format</li>
                <li><strong>Right to Object:</strong> You can object to certain types of data processing</li>
                <li><strong>Right to Withdraw Consent:</strong> You can withdraw consent for marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Data Sharing</h2>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties, except:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To our trusted service providers who assist in operating our application</li>
                <li>When required by law or to protect our rights</li>
                <li>In the event of a merger, acquisition, or sale of assets (with prior notice)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
              <p>
                We retain your personal data only as long as necessary to provide our services and comply with legal obligations. 
                You can delete your account at any time from your profile settings, which will permanently remove all your data 
                from our systems within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Cookies and Tracking</h2>
              <p>
                We use essential cookies to maintain your session and provide core functionality. We do not use tracking cookies 
                or third-party analytics without your explicit consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Contact Information</h2>
              <p>
                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at:
              </p>
              <p className="mt-2">
                Email: privacy@wealthwise.com<br />
                Address: [Your Company Address]
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "last updated" date.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PrivacyPolicy;
