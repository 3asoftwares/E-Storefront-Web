'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faClock,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
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
      showToast("Message sent successfully! We'll get back to you soon.", 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="border-b border-gray-200 bg-white/95 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 py-5 xs:px-5 xs:py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="flex w-full flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={process.env.NEXT_PUBLIC_LOGO_URL}
              alt={'3A Softwares'}
              className="w-20 object-contain xs:w-24 sm:w-28"
            />
            <h1 className="mb-2 bg-gradient-to-r from-black to-gray-300 bg-clip-text text-center text-3xl font-extrabold text-transparent xs:mb-3 xs:text-4xl sm:mb-4 sm:text-5xl">
              Contact Us
            </h1>
            <p className="mx-auto max-w-2xl px-2 text-center text-base text-gray-600 xs:text-lg sm:text-xl">
              Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll
              respond as soon as possible.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-3 py-4 xs:px-4 xs:py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-4 xs:gap-5 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg xs:rounded-2xl xs:p-6 xs:shadow-xl sm:p-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900 xs:mb-5 xs:text-2xl sm:mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 xs:gap-5 sm:gap-6">
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
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-transparent focus:ring-2 focus:ring-blue-500 xs:px-4 xs:py-3"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  variant="primary"
                  size="lg"
                  className="min-h-[48px]"
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4 xs:h-5 xs:w-5" />
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>

          <div className="space-y-4 xs:space-y-5 sm:space-y-6 lg:col-span-1">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg xs:rounded-2xl xs:p-5 xs:shadow-xl sm:p-6">
              <h3 className="mb-4 text-lg font-bold text-gray-900 xs:mb-5 xs:text-xl sm:mb-6">
                Contact Information
              </h3>
              <div className="space-y-3 xs:space-y-4">
                <div className="flex items-start gap-3 xs:gap-4">
                  <div className="flex-shrink-0 rounded-lg bg-gradient-to-br from-gray-200 to-gray-200 p-2.5 xs:p-3">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="h-4 w-4 text-gray-600 xs:h-5 xs:w-5"
                    />
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-semibold text-gray-900 xs:text-base">
                      Address
                    </h4>
                    <p className="text-xs text-gray-600 xs:text-sm">
                      167, Dayanand Ward
                      <br />
                      Sagar, Madhya Pradesh 470002
                      <br />
                      India
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 xs:gap-4">
                  <div className="flex-shrink-0 rounded-lg bg-gradient-to-br from-gray-200 to-gray-200 p-2.5 xs:p-3">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="h-4 w-4 text-gray-600 xs:h-5 xs:w-5"
                    />
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-semibold text-gray-900 xs:text-base">Phone</h4>
                    <p className="text-xs text-gray-600 xs:text-sm">+91 70470 26537</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 xs:gap-4">
                  <div className="flex-shrink-0 rounded-lg bg-gradient-to-br from-gray-200 to-gray-200 p-2.5 xs:p-3">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="h-4 w-4 text-gray-600 xs:h-5 xs:w-5"
                    />
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-semibold text-gray-900 xs:text-base">Email</h4>
                    <p className="text-xs text-gray-600 xs:text-sm">support@shophub.com</p>
                    <p className="text-xs text-gray-600 xs:text-sm">sales@shophub.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 xs:gap-4">
                  <div className="flex-shrink-0 rounded-lg bg-gradient-to-br from-gray-200 to-gray-200 p-2.5 xs:p-3">
                    <FontAwesomeIcon
                      icon={faClock}
                      className="h-4 w-4 text-gray-600 xs:h-5 xs:w-5"
                    />
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-semibold text-gray-900 xs:text-base">
                      Business Hours
                    </h4>
                    <p className="text-xs text-gray-600 xs:text-sm">Monday - Friday: 9AM - 6PM</p>
                    <p className="text-xs text-gray-600 xs:text-sm">Saturday: 10AM - 4PM</p>
                    <p className="text-xs text-gray-600 xs:text-sm">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-black to-gray-600 p-4 text-white shadow-lg xs:rounded-2xl xs:p-5 xs:shadow-xl sm:p-6">
              <h3 className="mb-2 text-lg font-bold xs:mb-3 xs:text-xl">Quick Response</h3>
              <p className="mb-3 text-xs text-blue-100 xs:mb-4 xs:text-sm">
                We typically respond to all inquiries within 24 hours during business days.
              </p>
              <div className="rounded-lg bg-white/20 p-2.5 text-xs xs:p-3 xs:text-sm">
                <p className="mb-1 font-semibold">For urgent matters:</p>
                <p className="text-blue-100">Call us at +91 70470 26537</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
