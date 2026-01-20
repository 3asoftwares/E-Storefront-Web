'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useCreateOrder, useAddresses, useAddAddress } from '@/lib/hooks';
import { Button, Input, Radio, ToasterBox } from '@3asoftwares/ui';
import { apolloClient } from '@/lib/apollo/client';
import { GQL_QUERIES } from '@/lib/apollo/queries/queries';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart,
  faLock,
  faShippingFast,
  faCreditCard,
  faBuilding,
  faMobileAlt,
  faTag,
  faCheck,
  faTimes,
  faPlus,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { formatPrice, Logger } from '@3asoftwares/utils/client';
import { PageHeader } from '@/components';

interface Address {
  id: string;
  userId?: string;
  name?: string;
  mobile?: string;
  email?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
  label?: string;
}

interface CouponValidation {
  valid: boolean;
  discount: number;
  discountValue: number;
  finalTotal: number;
  discountType: string | null;
  message: string;
  code: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, userProfile, clearCart } = useCartStore();
  const { mutateAsync: createOrder, isPending: loading } = useCreateOrder();
  const { data: addresses = [], isLoading: addressesLoading } = useAddresses();
  const { mutateAsync: addAddressMutation, isPending: addingAddress } = useAddAddress();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderNotes, setOrderNotes] = useState('');

  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidation | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Toast states
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [showToastBox, setShowToastBox] = useState(false);

  // Address validation states
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  const [newAddress, setNewAddress] = useState({
    name: '',
    mobile: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  // Set default address on load
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddr = addresses.find((a: Address) => a.isDefault);
      setSelectedAddressId(defaultAddr?.id || addresses[0].id);
    }
  }, [addresses]);

  const subtotal = items.reduce(
    (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const shipping = deliveryMethod === 'express' ? 80 : subtotal > 100 ? 0 : 10;
  const discount = appliedCoupon?.valid ? appliedCoupon.discount : 0;
  const total = Math.max(0, subtotal + tax + shipping - discount);

  const showToastMessage = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToastBox(true);
  };

  const validateNewAddress = (): boolean => {
    const errors: Record<string, string> = {};

    if (!newAddress.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!newAddress.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(newAddress.mobile.trim())) {
      errors.mobile = 'Invalid mobile number (10 digits required)';
    }
    if (newAddress.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAddress.email.trim())) {
      errors.email = 'Invalid email address';
    }
    if (!newAddress.street.trim()) {
      errors.street = 'Street address is required';
    }
    if (!newAddress.city.trim()) {
      errors.city = 'City is required';
    }
    if (!newAddress.state.trim()) {
      errors.state = 'State is required';
    }
    if (!newAddress.zip.trim()) {
      errors.zip = 'ZIP code is required';
    } else if (!/^\d{5,6}$/.test(newAddress.zip.trim())) {
      errors.zip = 'Invalid ZIP code';
    }
    if (!newAddress.country.trim()) {
      errors.country = 'Country is required';
    }

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveNewAddress = async () => {
    if (!validateNewAddress()) {
      showToastMessage('Please fill in all address fields correctly', 'error');
      return;
    }

    try {
      const result = await addAddressMutation({
        name: newAddress.name.trim(),
        mobile: newAddress.mobile.trim(),
        email: newAddress.email.trim() || undefined,
        street: newAddress.street.trim(),
        city: newAddress.city.trim(),
        state: newAddress.state.trim(),
        zip: newAddress.zip.trim(),
        country: newAddress.country.trim(),
        isDefault: addresses.length === 0,
      });

      if (result?.success && result?.address) {
        setSelectedAddressId(result.address.id);
        setUseNewAddress(false);
        setNewAddress({
          name: '',
          mobile: '',
          email: '',
          street: '',
          city: '',
          state: '',
          zip: '',
          country: '',
        });
        setAddressErrors({});
        showToastMessage('Address added successfully!', 'success');
      } else {
        showToastMessage(result?.message || 'Failed to add address', 'error');
      }
    } catch (error: any) {
      // Extract error message from GraphQL response
      const graphqlError =
        error?.graphQLErrors?.[0]?.message ||
        error?.networkError?.result?.errors?.[0]?.message ||
        error?.message ||
        'Failed to add address';
      showToastMessage(graphqlError, 'error');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    setCouponError('');

    try {
      const { data } = await apolloClient.query({
        query: GQL_QUERIES.VALIDATE_COUPON_QUERY,
        variables: {
          code: couponCode.trim().toUpperCase(),
          orderTotal: subtotal,
        },
        fetchPolicy: 'network-only',
      });

      if (data?.validateCoupon?.valid) {
        setAppliedCoupon(data.validateCoupon);
        showToastMessage(
          `Coupon applied! You save ${formatPrice(data.validateCoupon.discount)}`,
          'success'
        );
      } else {
        setCouponError(data?.validateCoupon?.message || 'Invalid coupon code');
        setAppliedCoupon(null);
      }
    } catch (error: any) {
      // Extract error message from GraphQL response
      const graphqlError =
        error?.graphQLErrors?.[0]?.message ||
        error?.networkError?.result?.errors?.[0]?.message ||
        error?.message ||
        'Failed to validate coupon. Please try again.';
      setCouponError(graphqlError);
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
    showToastMessage('Coupon removed', 'info');
  };

  const handleSubmitOrder = async () => {
    // Validation checks
    if (!userProfile) {
      showToastMessage('Please log in to place an order', 'error');
      router.push('/login?redirect=/checkout');
      return;
    }

    if (items.length === 0) {
      showToastMessage('Your cart is empty', 'error');
      return;
    }

    // Check if address is selected or new address is being used
    let shippingAddress: Address | null = null;

    if (useNewAddress) {
      // Validate new address
      if (!validateNewAddress()) {
        showToastMessage('Please fill in all address fields correctly', 'error');
        return;
      }
      shippingAddress = {
        id: `temp_${Date.now()}`,
        userId: userProfile.id,
        name: newAddress.name.trim(),
        mobile: newAddress.mobile.trim(),
        email: newAddress.email.trim() || undefined,
        street: newAddress.street.trim(),
        city: newAddress.city.trim(),
        state: newAddress.state.trim(),
        zip: newAddress.zip.trim(),
        country: newAddress.country.trim(),
        isDefault: false,
      };
    } else {
      // Check if an address is selected
      if (!selectedAddressId) {
        showToastMessage('Please select a shipping address or add a new one', 'error');
        return;
      }
      shippingAddress = addresses?.find((a: Address) => a.id === selectedAddressId) || null;

      if (!shippingAddress) {
        showToastMessage('Selected address not found. Please select another address.', 'error');
        return;
      }
    }

    if (!paymentMethod) {
      showToastMessage('Please select a payment method', 'error');
      return;
    }

    try {
      const orderData = {
        customerId: userProfile.id,
        customerEmail: userProfile.email,
        items: items.map((item: any) => ({
          productId: item.productId || item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          sellerId: item.sellerId || '',
          subtotal: item.price * item.quantity,
        })),
        subtotal,
        tax,
        shipping,
        discount,
        total,
        shippingAddress: {
          name: shippingAddress.name,
          mobile: shippingAddress.mobile,
          email: shippingAddress.email,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip: shippingAddress.zip,
          country: shippingAddress.country,
        },
        paymentMethod,
        notes: orderNotes,
        couponCode: appliedCoupon?.valid ? couponCode.trim().toUpperCase() : undefined,
      };

      await createOrder(orderData);
      clearCart();
      showToastMessage('Order placed successfully!', 'success');
      router.push('/orders');
    } catch (error: any) {
      Logger.error('Order creation error', error, 'Checkout');
      // Extract error message from GraphQL response
      const graphqlError =
        error?.graphQLErrors?.[0]?.message ||
        error?.networkError?.result?.errors?.[0]?.message ||
        error?.message ||
        'Error creating order. Please try again.';
      showToastMessage(graphqlError, 'error');
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 px-4">
        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 text-center shadow-lg xs:rounded-2xl xs:p-8 xs:shadow-2xl sm:p-12">
          <div className="mb-4 inline-block rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 p-4 xs:mb-5 xs:p-5 sm:mb-6 sm:p-6">
            <FontAwesomeIcon
              icon={faShoppingCart}
              className="h-10 w-10 text-indigo-600 xs:h-12 xs:w-12 sm:h-16 sm:w-16"
            />
          </div>
          <h1 className="mb-2 text-xl font-extrabold text-gray-900 xs:mb-3 xs:text-2xl sm:text-3xl">
            Cart is Empty
          </h1>
          <p className="mb-6 text-sm text-gray-600 xs:mb-8 xs:text-base sm:text-lg">
            Add items to your cart before checking out.
          </p>
          <Button variant="ghost" onClick={() => router.push('/products')} className="min-h-[48px]">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={faLock}
        title="Secure Checkout"
        subtitle="SSL Encrypted • Safe & Secure"
        iconGradient="from-gray-700 to-gray-900"
        titleGradient="from-gray-900 to-black"
      />
      <div className="mx-auto max-w-7xl px-3 py-4 xs:px-4 xs:py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-4 xs:gap-5 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-4 xs:space-y-5 sm:space-y-6 lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg xs:rounded-2xl xs:p-5 xs:shadow-xl sm:p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 xs:mb-5 xs:text-xl">
                <FontAwesomeIcon icon={faShippingFast} className="text-indigo-600" />
                Shipping Address
              </h2>

              {addressesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="h-6 w-6 animate-spin text-indigo-600"
                  />
                  <span className="ml-2 text-gray-600">Loading addresses...</span>
                </div>
              ) : addresses && addresses.length > 0 && !useNewAddress ? (
                <div className="mb-4 space-y-3">
                  {addresses.map((address: Address) => (
                    <label
                      key={address.id}
                      className="flex cursor-pointer items-start rounded-xl border-2 p-5 transition-all hover:scale-[1.02] hover:bg-indigo-50"
                      style={{
                        borderColor:
                          selectedAddressId === address.id ? 'rgb(99, 102, 241)' : '#e5e7eb',
                        backgroundColor:
                          selectedAddressId === address.id ? 'rgb(238, 242, 255)' : 'white',
                      }}
                      onClick={() => setSelectedAddressId(address.id)}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                        className="mt-1 h-5 w-5 text-indigo-600"
                      />
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">
                          {address.label && (
                            <span className="mr-2 text-indigo-600">[{address.label}]</span>
                          )}
                          {address.name || 'No name'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.mobile && <span className="mr-2">📱 {address.mobile}</span>}
                          {address.email && <span>✉️ {address.email}</span>}
                        </p>
                        <p className="mt-1 text-sm text-gray-700">
                          {address.street}, {address.city}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.state}, {address.zip}, {address.country}
                        </p>
                        {address.isDefault && (
                          <span className="mt-1 inline-block rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                            Default
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                !useNewAddress && (
                  <p className="mb-4 text-gray-500">
                    No saved addresses. Please add a new address.
                  </p>
                )
              )}

              <Button
                onClick={() => setUseNewAddress(!useNewAddress)}
                variant="ghost"
                size="sm"
                fullWidth={false}
                className="mb-4 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                {useNewAddress ? '← Use saved address' : '+ Add new address'}
              </Button>

              {useNewAddress && (
                <div className="space-y-3 border-t pt-4 xs:space-y-4">
                  <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 xs:gap-4">
                    <Input
                      size="md"
                      type="text"
                      placeholder="Full Name *"
                      value={newAddress.name}
                      onChange={(e: any) => setNewAddress({ ...newAddress, name: e.target.value })}
                    />
                    <Input
                      size="md"
                      type="tel"
                      placeholder="Mobile Number *"
                      value={newAddress.mobile}
                      onChange={(e: any) =>
                        setNewAddress({ ...newAddress, mobile: e.target.value })
                      }
                    />
                  </div>
                  <Input
                    size="md"
                    type="email"
                    placeholder="Email Address (Optional)"
                    value={newAddress.email}
                    onChange={(e: any) => setNewAddress({ ...newAddress, email: e.target.value })}
                  />
                  <Input
                    size="md"
                    type="text"
                    placeholder="Street Address *"
                    value={newAddress.street}
                    onChange={(e: any) => setNewAddress({ ...newAddress, street: e.target.value })}
                  />
                  <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 xs:gap-4">
                    <Input
                      type="text"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e: any) => setNewAddress({ ...newAddress, city: e.target.value })}
                    />
                    <Input
                      type="text"
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e: any) => setNewAddress({ ...newAddress, state: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 xs:gap-4">
                    <Input
                      type="text"
                      placeholder="ZIP Code"
                      value={newAddress.zip}
                      onChange={(e: any) => setNewAddress({ ...newAddress, zip: e.target.value })}
                    />
                    <Input
                      type="text"
                      placeholder="Country"
                      value={newAddress.country}
                      onChange={(e: any) =>
                        setNewAddress({ ...newAddress, country: e.target.value })
                      }
                    />
                  </div>

                  {/* Address validation errors */}
                  {Object.keys(addressErrors).length > 0 && (
                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
                      <ul className="space-y-1 text-sm text-red-600">
                        {Object.values(addressErrors).map((error, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Save Address Button */}
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleSaveNewAddress}
                      disabled={addingAddress}
                      className="flex items-center gap-2"
                    >
                      {addingAddress ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                          Save Address
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg bg-white p-4 shadow-md xs:p-5 sm:p-6">
              <Radio
                name="delivery"
                label="Delivery Method"
                value={deliveryMethod}
                onChange={setDeliveryMethod}
                variant="card"
                options={[
                  {
                    value: 'standard',
                    label: 'Standard Delivery',
                    description: `5-7 business days • ${subtotal > 100 ? 'FREE' : '₹100'}`,
                  },
                  {
                    value: 'express',
                    label: 'Express Delivery',
                    description: '2-3 business days • ₹80',
                  },
                ]}
              />
            </div>

            <div className="rounded-lg bg-white p-4 shadow-md xs:p-5 sm:p-6">
              <Radio
                name="payment"
                label="Payment Method"
                value={paymentMethod}
                onChange={setPaymentMethod}
                variant="card"
                options={[
                  {
                    value: 'card',
                    label: 'Credit/Debit Card',
                    icon: <FontAwesomeIcon icon={faCreditCard} />,
                  },
                  {
                    value: 'bank',
                    label: 'Bank Transfer',
                    icon: <FontAwesomeIcon icon={faBuilding} />,
                  },
                  {
                    value: 'upi',
                    label: 'UPI',
                    icon: <FontAwesomeIcon icon={faMobileAlt} />,
                  },
                ]}
              />
            </div>

            <div className="rounded-lg bg-white p-4 shadow-md xs:p-5 sm:p-6">
              <h2 className="mb-3 text-base font-semibold text-gray-900 xs:mb-4 xs:text-lg">
                Order Notes
              </h2>
              <textarea
                value={orderNotes}
                onChange={(e: any) => setOrderNotes(e.target.value)}
                placeholder="Add any special instructions for delivery..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-transparent focus:ring-2 focus:ring-blue-500 xs:px-4 xs:py-3"
                rows={3}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white p-4 shadow-md xs:p-5 sm:p-6 lg:sticky lg:top-24">
              <h2 className="mb-4 text-base font-semibold text-gray-900 xs:mb-6 xs:text-lg">
                Order Summary
              </h2>

              <div className="mb-4 max-h-36 space-y-2 overflow-y-auto border-b pb-4 xs:mb-6 xs:max-h-48 xs:pb-6">
                {items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-xs text-gray-700 xs:text-sm"
                  >
                    <span className="mr-2 line-clamp-1 flex-1">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="whitespace-nowrap font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Code Section */}
              <div className="mb-4 border-b pb-4 xs:mb-6 xs:pb-6">
                <h3 className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-700 xs:mb-3 xs:text-sm">
                  <FontAwesomeIcon icon={faTag} className="text-indigo-600" />
                  Have a coupon?
                </h3>

                {appliedCoupon?.valid ? (
                  <div className="flex justify-between rounded-lg border border-green-200 bg-green-50 p-3">
                    <div className="flex flex-col justify-center text-left">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCheck} size="sm" className="text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          {appliedCoupon.code}
                        </span>
                      </div>
                      <div className="text-xs text-green-600">
                        {appliedCoupon.discountType === 'percentage' ? (
                          <span>
                            {appliedCoupon.discountValue}% off - You save{' '}
                            {formatPrice(appliedCoupon.discount)}
                          </span>
                        ) : (
                          <span>Flat {formatPrice(appliedCoupon.discount)} off</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-sm font-medium text-red-500 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <Input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e: any) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError('');
                        }}
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="whitespace-nowrap"
                      >
                        {couponLoading ? 'Applying...' : 'Apply'}
                      </Button>
                    </div>
                    {couponError && (
                      <p className="flex items-center gap-1 text-xs text-red-500">
                        <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                        {couponError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="mb-4 space-y-2 border-b pb-4 text-xs xs:mb-6 xs:space-y-3 xs:pb-6 xs:text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="font-semibold text-green-600">Free</span>
                  ) : (
                    <span>{formatPrice(shipping)}</span>
                  )}
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (8%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                {appliedCoupon?.valid && discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faTag} className="h-3 w-3" />
                      Discount ({appliedCoupon.code})
                    </span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
              </div>

              <div className="mb-4 flex items-baseline justify-between xs:mb-6">
                <span className="text-sm font-semibold text-gray-700 xs:text-base">Total</span>
                <span className="text-2xl font-bold text-gray-900 xs:text-3xl">
                  {formatPrice(total)}
                </span>
              </div>

              <Button onClick={handleSubmitOrder} disabled={loading} className="min-h-[48px]">
                {loading ? 'Processing...' : 'Place Order'}
              </Button>

              <Button
                variant="ghost"
                className="mt-2 min-h-[44px] !no-underline"
                onClick={() => router.push('/cart')}
              >
                ← Back to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
      {showToastBox && (
        <ToasterBox
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToastBox(false)}
        />
      )}
    </div>
  );
}
