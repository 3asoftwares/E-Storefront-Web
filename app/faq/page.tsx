'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuestionCircle,
  faChevronDown,
  faChevronUp,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { Input, Button } from '@3asoftwares/ui';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: 'How can I track my order?',
    answer:
      "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the Orders page. Click on the order you want to track to see real-time shipping updates.",
    category: 'Orders & Shipping',
  },
  {
    id: 2,
    question: 'What shipping options are available?',
    answer:
      'We offer Standard Shipping (5-7 business days), Express Shipping (2-3 business days), and International Shipping (7-14 business days). Free standard shipping is available on orders over ₹500.',
    category: 'Orders & Shipping',
  },
  {
    id: 3,
    question: 'Can I change or cancel my order?',
    answer:
      'You can modify or cancel your order within 1 hour of placing it by contacting customer support. After this window, orders are processed and cannot be changed. However, you can always return items using our 30-day return policy.',
    category: 'Orders & Shipping',
  },
  {
    id: 4,
    question: 'Do you ship internationally?',
    answer:
      'Yes! We ship to over 100 countries worldwide. International shipping costs and delivery times vary by location. Additional customs fees and import taxes may apply and are the responsibility of the customer.',
    category: 'Orders & Shipping',
  },

  {
    id: 5,
    question: 'What is your return policy?',
    answer:
      'We offer a hassle-free 30-day return policy. Items must be unused, in original condition with tags attached. We provide free return shipping labels for all US domestic returns. Refunds are processed within 3-5 business days of receiving your return.',
    category: 'Returns & Refunds',
  },
  {
    id: 6,
    question: 'How long does it take to get a refund?',
    answer:
      'Once we receive your returned item, refunds are processed within 3-5 business days. Depending on your bank or card issuer, it may take an additional 5-10 business days for the refund to appear on your statement.',
    category: 'Returns & Refunds',
  },
  {
    id: 7,
    question: 'Can I exchange an item?',
    answer:
      "We don't offer direct exchanges. If you need a different size, color, or product, please return the original item for a refund and place a new order. This ensures you get your preferred item faster.",
    category: 'Returns & Refunds',
  },
  {
    id: 8,
    question: 'What items cannot be returned?',
    answer:
      "For hygiene and safety reasons, we cannot accept returns on cosmetics, personal care items, underwear, earrings, perishable goods, and gift cards once they've been opened or used.",
    category: 'Returns & Refunds',
  },

  {
    id: 9,
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and bank transfers. All payments are processed securely with SSL encryption.',
    category: 'Payment & Security',
  },
  {
    id: 10,
    question: 'Is my payment information secure?',
    answer:
      'Absolutely! We use industry-standard SSL encryption to protect your payment information. We never store your full credit card details on our servers. All transactions are processed through secure, PCI-compliant payment gateways.',
    category: 'Payment & Security',
  },
  {
    id: 11,
    question: 'Do you offer payment plans?',
    answer:
      'Yes, we partner with payment providers to offer installment plans on eligible purchases over ₹1,000. You can select this option at checkout and complete the application process in minutes.',
    category: 'Payment & Security',
  },

  {
    id: 12,
    question: 'Do I need an account to place an order?',
    answer:
      'No, you can checkout as a guest. However, creating an account lets you track orders, save addresses, create wishlists, and enjoy faster checkout on future purchases.',
    category: 'Account & Profile',
  },
  {
    id: 13,
    question: 'How do I reset my password?',
    answer:
      'Click "Forgot Password" on the login page and enter your email address. We\'ll send you a link to create a new password. If you don\'t receive the email within a few minutes, check your spam folder or contact support.',
    category: 'Account & Profile',
  },
  {
    id: 14,
    question: 'Can I update my account information?',
    answer:
      'Yes! Log into your account and go to Profile Settings. You can update your name, email, phone number, and saved addresses at any time.',
    category: 'Account & Profile',
  },

  {
    id: 15,
    question: 'Are your products authentic?',
    answer:
      'Yes, all products sold on 3A Softwares are 100% authentic. We work directly with authorized distributors and verified sellers. Every product comes with a guarantee of authenticity.',
    category: 'Products',
  },
  {
    id: 16,
    question: 'How do I know my size?',
    answer:
      "Each product page includes a detailed size guide. You can also check customer reviews for fit information. If you're still unsure, our customer support team is happy to help you choose the right size.",
    category: 'Products',
  },
  {
    id: 17,
    question: 'Can I add items to my wishlist?',
    answer:
      'Yes! Click the heart icon on any product to add it to your wishlist. You can access your wishlist from your account dashboard or the heart icon in the header navigation.',
    category: 'Products',
  },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(faqs.map((faq) => faq.category)))];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="border-b border-gray-200 bg-white/95 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-3 py-6 xs:px-4 xs:py-8 sm:px-6 lg:px-8">
          <div className="flex w-full flex-col items-center text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={process.env.NEXT_PUBLIC_LOGO_URL}
              alt={'3A Softwares'}
              className="w-20 object-contain xs:w-24 sm:w-28"
            />
            <h1 className="mb-3 bg-gradient-to-r from-black to-gray-300 bg-clip-text text-3xl font-extrabold text-transparent xs:mb-4 xs:text-4xl sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mx-auto max-w-2xl px-2 text-base text-gray-600 xs:text-lg sm:text-xl">
              Find answers to common questions about orders, shipping, returns, and more
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-3 py-6 xs:px-4 xs:py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-3 shadow-xl xs:mb-8 xs:rounded-2xl xs:p-4">
          <Input
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={
              <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-gray-400 xs:h-5 xs:w-5" />
            }
            className="mb-0"
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-2 xs:mb-8 xs:gap-3">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? 'primary' : 'outline'}
              size="sm"
              fullWidth={false}
            >
              {category}
            </Button>
          ))}
        </div>

        {filteredFAQs.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-xl xs:rounded-2xl xs:p-10 sm:p-12">
            <FontAwesomeIcon
              icon={faQuestionCircle}
              className="mb-3 h-12 w-12 text-gray-400 xs:mb-4 xs:h-14 xs:w-14 sm:h-16 sm:w-16"
            />
            <h3 className="mb-2 text-lg font-bold text-gray-900 xs:text-xl">No results found</h3>
            <p className="text-sm text-gray-600 xs:text-base">
              Try adjusting your search or category filter
            </p>
          </div>
        ) : (
          <div className="space-y-3 xs:space-y-4">
            {filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg xs:rounded-xl"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="flex min-h-[56px] w-full items-center justify-between px-4 py-4 text-left transition-colors hover:bg-gray-50 xs:min-h-[64px] xs:px-5 xs:py-5 sm:px-6"
                >
                  <div className="flex-1 pr-2 xs:pr-3">
                    <span className="mb-1.5 inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700 xs:mb-2 xs:px-3 xs:py-1">
                      {faq.category}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 xs:text-lg">{faq.question}</h3>
                  </div>
                  <FontAwesomeIcon
                    icon={openId === faq.id ? faChevronUp : faChevronDown}
                    className={`ml-2 h-4 w-4 flex-shrink-0 text-gray-400 transition-transform xs:ml-4 xs:h-5 xs:w-5 ${
                      openId === faq.id ? 'rotate-180 transform' : ''
                    }`}
                  />
                </button>
                {openId === faq.id && (
                  <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 xs:px-5 xs:py-5 sm:px-6">
                    <p className="text-sm leading-relaxed text-gray-600 xs:text-base">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 p-5 text-center text-white shadow-xl xs:mt-10 xs:rounded-2xl xs:p-6 sm:mt-12 sm:p-8">
          <h2 className="mb-2 text-xl font-bold xs:mb-3 xs:text-2xl">Still have questions?</h2>
          <p className="mb-4 text-sm text-purple-100 xs:mb-6 xs:text-base">
            Our customer support team is always here to help you!
          </p>
          <Button
            onClick={() => (window.location.href = '/contact')}
            variant="secondary"
            size="lg"
            fullWidth={false}
            className="min-h-[48px]"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
