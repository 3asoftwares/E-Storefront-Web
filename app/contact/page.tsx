'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt, faClock, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@/lib/hooks/useToast';
import { Button, Input } from '@3asoftwares/ui';

export default function ContactPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white/95 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 py-5 xs:py-6 sm:py-8">
          <div className="flex flex-col items-center w-full">
            <img
              src={process.env.NEXT_PUBLIC_LOGO_URL}
              alt={'3A Softwares'}
              className="object-contain w-20 xs:w-24 sm:w-28"
            />
            <h1 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-300 mb-2 xs:mb-3 sm:mb-4 text-center">
              Contact Us
            </h1>
            <p className="text-base xs:text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto text-center px-2">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as
              soon as possible.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl xs:rounded-2xl shadow-lg xs:shadow-xl p-4 xs:p-6 sm:p-8 border border-gray-200">
              <h2 className="text-xl xs:text-2xl font-bold text-gray-900 mb-4 xs:mb-5 sm:mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 xs:gap-5 sm:gap-6">
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    label="Your Name *"
                    placeholder="John Doe"
                    className=""
                  />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    label="Email Address *"
                    placeholder="john@example.com"
                    className=""
                  />
                </div>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  label="Subject *"
                  placeholder="How can we help you?"
                  className=""
                />
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-3 xs:px-4 py-2.5 xs:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                <Button type="submit" disabled={loading} variant="primary" size="lg" className="min-h-[48px]">
                  <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4 xs:w-5 xs:h-5" />
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-4 xs:space-y-5 sm:space-y-6">
            <div className="bg-white rounded-xl xs:rounded-2xl shadow-lg xs:shadow-xl p-4 xs:p-5 sm:p-6 border border-gray-200">
              <h3 className="text-lg xs:text-xl font-bold text-gray-900 mb-4 xs:mb-5 sm:mb-6">Contact Information</h3>
              <div className="space-y-3 xs:space-y-4">
                <div className="flex items-start gap-3 xs:gap-4">
                  <div className="p-2.5 xs:p-3 bg-gradient-to-br from-gray-200 to-gray-200 rounded-lg flex-shrink-0">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 xs:w-5 xs:h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm xs:text-base">Address</h4>
                    <p className="text-gray-600 text-xs xs:text-sm">
                      167, Dayanand Ward
                      <br />
                      Sagar, Madhya Pradesh 470002
                      <br />
                      India
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 xs:gap-4">
                  <div className="p-2.5 xs:p-3 bg-gradient-to-br from-gray-200 to-gray-200 rounded-lg flex-shrink-0">
                    <FontAwesomeIcon icon={faPhone} className="w-4 h-4 xs:w-5 xs:h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm xs:text-base">Phone</h4>
                    <p className="text-gray-600 text-xs xs:text-sm">+91 70470 26537</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 xs:gap-4">
                  <div className="p-2.5 xs:p-3 bg-gradient-to-br from-gray-200 to-gray-200 rounded-lg flex-shrink-0">
                    <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 xs:w-5 xs:h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm xs:text-base">Email</h4>
                    <p className="text-gray-600 text-xs xs:text-sm">support@shophub.com</p>
                    <p className="text-gray-600 text-xs xs:text-sm">sales@shophub.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 xs:gap-4">
                  <div className="p-2.5 xs:p-3 bg-gradient-to-br from-gray-200 to-gray-200 rounded-lg flex-shrink-0">
                    <FontAwesomeIcon icon={faClock} className="w-4 h-4 xs:w-5 xs:h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm xs:text-base">Business Hours</h4>
                    <p className="text-gray-600 text-xs xs:text-sm">Monday - Friday: 9AM - 6PM</p>
                    <p className="text-gray-600 text-xs xs:text-sm">Saturday: 10AM - 4PM</p>
                    <p className="text-gray-600 text-xs xs:text-sm">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-black to-gray-600 rounded-xl xs:rounded-2xl shadow-lg xs:shadow-xl p-4 xs:p-5 sm:p-6 text-white">
              <h3 className="text-lg xs:text-xl font-bold mb-2 xs:mb-3">Quick Response</h3>
              <p className="text-blue-100 text-xs xs:text-sm mb-3 xs:mb-4">
                We typically respond to all inquiries within 24 hours during business days.
              </p>
              <div className="bg-white/20 rounded-lg p-2.5 xs:p-3 text-xs xs:text-sm">
                <p className="font-semibold mb-1">For urgent matters:</p>
                <p className="text-blue-100">Call us at +91 70470 26537</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
