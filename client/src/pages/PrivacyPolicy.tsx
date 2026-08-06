/* ============================================================
 * Privacy Policy Page — Aura Farming Entertainment
 * Design: Aura Pulse — clean dark page, white text
 * ============================================================ */
import { useEffect } from "react";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.01_285)] text-white pt-24 pb-20">
      <div className="container max-w-3xl mx-auto">
        <div className="mb-10">
          <p
            className="text-xs font-bold tracking-[0.3em] text-[oklch(0.55_0.28_290)] mb-3 uppercase"
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            Legal
          </p>
          <h1
            className="text-5xl font-bold text-white mb-2"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Privacy Policy
          </h1>
          <p className="text-white/40 text-sm">Last updated: 2026 — International Plainfield LLC</p>
        </div>

        <div className="space-y-8 text-white/75 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              1. Introduction
            </h2>
            <p>
              International Plainfield LLC ("we," "our," or "us"), operating as Aura Farming Entertainment,
              is committed to protecting your privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you visit our website and use our services,
              including Shadow'Khan TCG and Dragon Fist X.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              2. Information We Collect
            </h2>
            <p className="mb-3">We may collect the following types of information:</p>
            <ul className="space-y-2 list-none">
              {[
                "Personal identification information (name, email address) when voluntarily submitted via contact forms",
                "Usage data including pages visited, time spent, and browser/device information",
                "Cookies and similar tracking technologies to improve your browsing experience",
                "Any information you provide when contacting us directly",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "oklch(0.55 0.28 290)" }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              3. How We Use Your Information
            </h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="space-y-2 list-none">
              {[
                "Operate, maintain, and improve our website and services",
                "Respond to your inquiries and provide customer support",
                "Send updates, announcements, and promotional materials (with your consent)",
                "Monitor and analyze usage patterns to enhance user experience",
                "Comply with legal obligations",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "oklch(0.55 0.28 290)" }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              4. Cookies
            </h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and
              hold certain information. You can instruct your browser to refuse all cookies or to
              indicate when a cookie is being sent. However, if you do not accept cookies, some
              portions of our website may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              5. Third-Party Links
            </h2>
            <p>
              Our website may contain links to third-party websites, including Shadow'Khan TCG
              (shadowkhantcg.com) and our social media profiles. We are not responsible for the
              privacy practices or content of those sites. We encourage you to review the privacy
              policies of any third-party sites you visit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              6. Data Security
            </h2>
            <p>
              We implement reasonable security measures to protect your personal information.
              However, no method of transmission over the Internet or electronic storage is 100%
              secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              7. Children's Privacy
            </h2>
            <p>
              Our services are not directed to children under the age of 13. We do not knowingly
              collect personal information from children under 13. If you believe we have
              inadvertently collected such information, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              8. Changes to This Policy
            </h2>
            <p>
              We reserve the right to update this Privacy Policy at any time. Changes will be
              posted on this page with an updated revision date. Your continued use of our website
              after any changes constitutes your acceptance of the new policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              9. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-3 p-4 rounded-lg border border-white/10 bg-white/5">
              <p className="font-semibold text-white">International Plainfield LLC</p>
              <p>Operating as: Aura Farming Entertainment</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:business@internationalplayingfield.com"
                  className="text-[oklch(0.72_0.22_140)] hover:underline"
                >
                  business@internationalplayingfield.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
