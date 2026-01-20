'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/lib/hooks/useToast';
import { Button, Input } from '@3asoftwares/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faMapMarkerAlt,
  faHeart,
  faEdit,
  faPlus,
  faCheckCircle,
  faExclamationTriangle,
  faPaperPlane,
  faEnvelope,
  faSpinner,
  faTrash,
  faStar,
  faTicket,
  faClock,
  faComment,
} from '@fortawesome/free-solid-svg-icons';
import { PageHeader } from '@/components';
import { useSendVerificationEmail, useVerifyEmail } from '@/lib/hooks/useEmailVerification';
import { useCurrentUser } from '@/lib/hooks/useAuth';
import { useUpdateProfile } from '@/lib/hooks/useUpdateProfile';
import {
  useAddresses,
  useAddAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  type Address,
} from '@/lib/hooks/useAddresses';
import {
  useMyTickets,
  useCreateTicket,
  type Ticket,
  type CreateTicketInput,
} from '@/lib/hooks/useTickets';

export default function ProfilePage() {
  const router = useRouter();
  const {
    userProfile,
    setUserProfile,
    wishlist,
    removeFromWishlist,
    addItem,
    loadUserFromStorage,
  } = useCartStore();
  const { showToast } = useToast();
  const {
    data: currentUser,
    refetch: refetchUser,
    isLoading: isLoadingUser,
    isFetched,
  } = useCurrentUser();
  const {
    sendVerificationEmail,
    isLoading: isSendingEmail,
    data: sendEmailResult,
  } = useSendVerificationEmail();
  useVerifyEmail();
  const { updateProfile, isLoading: isUpdatingProfile } = useUpdateProfile();

  // Address hooks
  const { data: addresses = [], isLoading: addressesLoading } = useAddresses();
  const { mutateAsync: addAddressMutation, isPending: addingAddress } = useAddAddress();
  const { mutateAsync: deleteAddressMutation, isPending: deletingAddress } = useDeleteAddress();
  const { mutateAsync: setDefaultAddressMutation, isPending: settingDefault } =
    useSetDefaultAddress();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'wishlist' | 'tickets'>(
    'profile'
  );

  // Ticket hooks
  const [ticketPage, setTicketPage] = useState(1);
  const { data: ticketsData, isLoading: ticketsLoading } = useMyTickets(
    ticketPage,
    10,
    activeTab === 'tickets'
  );
  const { mutateAsync: createTicketMutation, isPending: creatingTicket } = useCreateTicket();
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [newTicket, setNewTicket] = useState<Partial<CreateTicketInput>>({
    subject: '',
    description: '',
    category: 'general',
    priority: 'medium',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle client-side hydration
  useEffect(() => {
    setIsHydrated(true);
    // Try to load user from cookies/storage on mount
    if (!userProfile) {
      loadUserFromStorage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch user on mount to get latest data
  useEffect(() => {
    refetchUser();
  }, [refetchUser]);

  // Sync currentUser from auth hook to cart store userProfile
  useEffect(() => {
    if (currentUser && !userProfile) {
      setUserProfile({
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name || currentUser.email.split('@')[0],
        phone: (currentUser as any).phone,
        addresses: [],
      });
    }
  }, [currentUser, userProfile, setUserProfile]);

  // Redirect to login if not authenticated (after hydration and loading is complete)
  useEffect(() => {
    // Wait for client-side hydration and query to complete
    if (!isHydrated || isLoadingUser || !isFetched) {
      return;
    }

    // Only redirect if there's truly no user
    if (!currentUser && !userProfile) {
      router.push('/login?redirect=/profile');
    }
  }, [isHydrated, isLoadingUser, isFetched, currentUser, userProfile, router]);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Sync profile data when user data is available
  useEffect(() => {
    const profile = userProfile || currentUser;
    if (profile && !profileData.email) {
      setProfileData({
        name: profile.name || '',
        email: profile.email || '',
        phone: (profile as any).phone || '',
      });
    }
  }, [userProfile, currentUser, profileData.email]);

  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    name: '',
    mobile: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  // Get emailVerified status from currentUser (GraphQL) which is more up-to-date
  const isEmailVerified = currentUser?.emailVerified ?? false;

  const handleSendVerificationEmail = async () => {
    setVerificationMessage(null);
    try {
      const result = await sendVerificationEmail('storefront');
      if (result.success) {
        setVerificationMessage({ type: 'success', text: result.message });
      } else {
        setVerificationMessage({ type: 'error', text: result.message });
      }
    } catch (error: any) {
      // Extract error message from GraphQL response
      const graphqlError =
        error?.graphQLErrors?.[0]?.message ||
        error?.networkError?.result?.errors?.[0]?.message ||
        error?.message ||
        'Failed to send verification email';
      setVerificationMessage({
        type: 'error',
        text: graphqlError,
      });
    }
  };

  // Show loading while checking authentication or during hydration
  if (!isHydrated || isLoadingUser || !isFetched) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userProfile && !currentUser) {
    // This will trigger the redirect effect
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Use currentUser data if userProfile is not yet synced
  const displayProfile =
    userProfile ||
    (currentUser
      ? {
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.name || currentUser.email.split('@')[0],
          phone: (currentUser as any).phone,
          addresses: [],
        }
      : null);

  if (!displayProfile) {
    return null;
  }

  const handleSaveProfile = async () => {
    setProfileMessage(null);
    setLoading(true);
    try {
      const result = await updateProfile({
        name: profileData.name,
        phone: profileData.phone,
      });
      if (result.success) {
        // Update local state with new data
        if (displayProfile) {
          setUserProfile({
            id: displayProfile.id,
            email: displayProfile.email,
            name: result.user?.name || profileData.name,
            phone: result.user?.phone || profileData.phone,
            addresses: displayProfile.addresses || [],
          });
        }
        setIsEditing(false);
        setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
        // Refetch user to ensure all data is in sync
        refetchUser();
      } else {
        setProfileMessage({ type: 'error', text: result.message || 'Failed to update profile' });
      }
    } catch (error: any) {
      // Extract error message from GraphQL response
      const graphqlError =
        error?.graphQLErrors?.[0]?.message ||
        error?.networkError?.result?.errors?.[0]?.message ||
        error?.message ||
        'Failed to update profile';
      setProfileMessage({
        type: 'error',
        text: graphqlError,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    if (
      !newAddress.name ||
      !newAddress.mobile ||
      !newAddress.street ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.zip
    ) {
      showToast(
        'Please fill in all required fields (Name, Mobile, Street, City, State, ZIP)',
        'error'
      );
      return;
    }

    try {
      const result = await addAddressMutation({
        name: newAddress.name,
        mobile: newAddress.mobile,
        email: newAddress.email || undefined,
        street: newAddress.street,
        city: newAddress.city,
        state: newAddress.state,
        zip: newAddress.zip,
        country: newAddress.country || 'India',
        isDefault: addresses.length === 0,
      });

      if (result?.success) {
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
        setIsAddingAddress(false);
        showToast('Address added successfully!', 'success');
      } else {
        showToast(result?.message || 'Failed to add address', 'error');
      }
    } catch (error: any) {
      // Extract error message from GraphQL response
      const graphqlError =
        error?.graphQLErrors?.[0]?.message ||
        error?.networkError?.result?.errors?.[0]?.message ||
        error?.message ||
        'Failed to add address';
      showToast(graphqlError, 'error');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const result = await deleteAddressMutation(addressId);
      if (result?.success) {
        showToast('Address deleted successfully!', 'success');
      } else {
        showToast(result?.message || 'Failed to delete address', 'error');
      }
    } catch (error: any) {
      // Extract error message from GraphQL response
      const graphqlError =
        error?.graphQLErrors?.[0]?.message ||
        error?.networkError?.result?.errors?.[0]?.message ||
        error?.message ||
        'Failed to delete address';
      showToast(graphqlError, 'error');
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      const result = await setDefaultAddressMutation(addressId);
      if (result?.success) {
        showToast('Default address updated!', 'success');
      } else {
        showToast(result?.message || 'Failed to set default address', 'error');
      }
    } catch (error: any) {
      // Extract error message from GraphQL response
      const graphqlError =
        error?.graphQLErrors?.[0]?.message ||
        error?.networkError?.result?.errors?.[0]?.message ||
        error?.message ||
        'Failed to set default address';
      showToast(graphqlError, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={faUser}
        title="My Account"
        subtitle={
          <span>
            Welcome back, <b>{displayProfile.name}</b>
          </span>
        }
        iconGradient="from-gray-700 to-gray-900"
        titleGradient="from-gray-900 to-black"
      />

      <div className="mx-auto max-w-7xl px-8 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="sticky top-24 overflow-hidden border border-gray-200 bg-white shadow-xl">
              <nav className="flex flex-col">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-3 px-6 py-4 text-left font-semibold transition ${
                    activeTab === 'profile'
                      ? 'border-l-4 border-gray-900 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`flex items-center gap-3 px-6 py-4 text-left font-semibold transition ${
                    activeTab === 'addresses'
                      ? 'border-l-4 border-gray-900 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="h-5 w-5" />
                  Addresses
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`flex items-center gap-3 px-6 py-4 text-left font-semibold transition ${
                    activeTab === 'wishlist'
                      ? 'border-l-4 border-gray-900 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faHeart} className="h-5 w-5" />
                  Wishlist
                </button>
                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`flex items-center gap-3 px-6 py-4 text-left font-semibold transition ${
                    activeTab === 'tickets'
                      ? 'border-l-4 border-gray-900 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faTicket} className="h-5 w-5" />
                  Support Tickets
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
                {/* Profile Update Message */}
                {profileMessage && (
                  <div
                    className={`mb-6 rounded-lg p-4 ${
                      profileMessage.type === 'success'
                        ? 'border border-green-200 bg-green-50 text-green-700'
                        : 'border border-red-200 bg-red-50 text-red-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={
                          profileMessage.type === 'success' ? faCheckCircle : faExclamationTriangle
                        }
                        className="h-4 w-4"
                      />
                      {profileMessage.text}
                    </div>
                  </div>
                )}

                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="primary"
                      size="md"
                      fullWidth={false}
                      className="flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>

                {!isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <p className="mb-1 text-sm text-gray-600">Full Name</p>
                        <p className="text-lg font-semibold text-gray-900">{displayProfile.name}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm text-gray-600">Email</p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-semibold text-gray-900">
                            {displayProfile.email}
                          </p>
                          {isEmailVerified ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                              <FontAwesomeIcon icon={faCheckCircle} className="mr-1 h-3 w-3" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                              <FontAwesomeIcon
                                icon={faExclamationTriangle}
                                className="mr-1 h-3 w-3"
                              />
                              Unverified
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="mb-1 text-sm text-gray-600">Phone</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {displayProfile.phone || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm text-gray-600">Account ID</p>
                        <p className="text-lg font-semibold text-gray-900">{displayProfile.id}</p>
                      </div>
                    </div>

                    {/* Email Verification Section */}
                    {!isEmailVerified && (
                      <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-6">
                        <div className="flex items-start gap-4">
                          <FontAwesomeIcon
                            icon={faExclamationTriangle}
                            className="mt-1 text-xl text-yellow-500"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-yellow-800">Email Not Verified</h3>
                            <p className="mt-1 text-sm text-yellow-700">
                              Please verify your email address to access all features and receive
                              important notifications about your orders.
                            </p>
                            {verificationMessage && (
                              <div
                                className={`mt-3 rounded-lg p-3 text-sm ${
                                  verificationMessage.type === 'success'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {verificationMessage.text}
                              </div>
                            )}
                            <div className="mt-4 flex gap-3">
                              <Button
                                onClick={handleSendVerificationEmail}
                                disabled={isSendingEmail}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                              >
                                {isSendingEmail ? (
                                  <>
                                    <span className="animate-spin">⏳</span>
                                    Sending...
                                  </>
                                ) : (
                                  <>
                                    <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />
                                    Send Verification Email
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Verified Success Message */}
                    {isEmailVerified && (
                      <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-6">
                        <div className="flex items-center gap-4">
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="text-2xl text-green-500"
                          />
                          <div>
                            <h3 className="font-semibold text-green-800">Email Verified</h3>
                            <p className="text-sm text-green-700">
                              Your email address has been verified. You have full access to all
                              features.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <Input
                      type="text"
                      value={profileData.name}
                      onChange={(e: any) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      label="Full Name"
                      className=""
                    />
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e: any) =>
                        setProfileData({ ...profileData, email: e.target.value })
                      }
                      disabled
                      label="Email"
                      className=""
                    />
                    <Input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e: any) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                      label="Phone Number"
                      className=""
                    />

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        variant="primary"
                        className="flex-1"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditing(false);
                          setProfileData({
                            name: displayProfile.name,
                            email: displayProfile.email,
                            phone: displayProfile.phone || '',
                          });
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                  {!isAddingAddress && (
                    <Button
                      onClick={() => setIsAddingAddress(true)}
                      variant="primary"
                      size="md"
                      fullWidth={false}
                      className="flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                      Add Address
                    </Button>
                  )}
                </div>

                {isAddingAddress && (
                  <div className="mb-8 rounded-lg border-2 border-gray-300 bg-gray-50 p-6">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Add New Address</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          size="md"
                          type="text"
                          placeholder="Full Name *"
                          value={newAddress.name || ''}
                          onChange={(e: any) =>
                            setNewAddress({ ...newAddress, name: e.target.value })
                          }
                        />
                        <Input
                          size="md"
                          type="tel"
                          placeholder="Mobile Number *"
                          value={newAddress.mobile || ''}
                          onChange={(e: any) =>
                            setNewAddress({ ...newAddress, mobile: e.target.value })
                          }
                        />
                      </div>
                      <Input
                        size="md"
                        type="email"
                        placeholder="Email Address (Optional)"
                        value={newAddress.email || ''}
                        onChange={(e: any) =>
                          setNewAddress({ ...newAddress, email: e.target.value })
                        }
                      />
                      <Input
                        size="md"
                        type="text"
                        placeholder="Street Address *"
                        value={newAddress.street || ''}
                        onChange={(e: any) =>
                          setNewAddress({ ...newAddress, street: e.target.value })
                        }
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="text"
                          placeholder="City"
                          value={newAddress.city || ''}
                          onChange={(e: any) =>
                            setNewAddress({ ...newAddress, city: e.target.value })
                          }
                        />
                        <Input
                          type="text"
                          placeholder="State"
                          value={newAddress.state || ''}
                          onChange={(e: any) =>
                            setNewAddress({ ...newAddress, state: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="text"
                          placeholder="ZIP Code"
                          value={newAddress.zip || ''}
                          onChange={(e: any) =>
                            setNewAddress({ ...newAddress, zip: e.target.value })
                          }
                        />
                        <Input
                          type="text"
                          placeholder="Country"
                          value={newAddress.country || ''}
                          onChange={(e: any) =>
                            setNewAddress({ ...newAddress, country: e.target.value })
                          }
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={handleAddAddress}
                          disabled={addingAddress}
                          className="flex-1"
                        >
                          {addingAddress ? (
                            <>
                              <FontAwesomeIcon
                                icon={faSpinner}
                                className="mr-2 h-4 w-4 animate-spin"
                              />
                              Adding...
                            </>
                          ) : (
                            'Add Address'
                          )}
                        </Button>
                        <Button
                          onClick={() => setIsAddingAddress(false)}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {addressesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="h-8 w-8 animate-spin text-indigo-600"
                    />
                    <span className="ml-3 text-gray-600">Loading addresses...</span>
                  </div>
                ) : addresses && addresses.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {addresses.map((address: Address) => (
                      <div key={address.id} className="rounded-lg border-2 border-gray-200 p-4">
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            {address.label && (
                              <span className="mb-2 inline-block rounded bg-indigo-100 px-2 py-1 text-xs text-indigo-800">
                                {address.label}
                              </span>
                            )}
                            <p className="font-semibold text-gray-900">
                              {address.name || 'No name'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.mobile && <span className="mr-2">📱 {address.mobile}</span>}
                              {address.email && <span>✉️ {address.email}</span>}
                            </p>
                            <p className="mt-1 text-sm text-gray-700">{address.street}</p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} {address.zip}
                            </p>
                            <p className="text-sm text-gray-600">{address.country}</p>
                          </div>
                          {address.isDefault && (
                            <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                              Default
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2 border-t pt-3">
                          {!address.isDefault && (
                            <Button
                              onClick={() => handleSetDefaultAddress(address.id)}
                              disabled={settingDefault}
                              variant="ghost"
                              size="sm"
                              fullWidth={false}
                            >
                              <FontAwesomeIcon icon={faStar} className="mr-1 h-3 w-3" />
                              Set as Default
                            </Button>
                          )}
                          <Button
                            onClick={() => handleDeleteAddress(address.id)}
                            disabled={deletingAddress}
                            variant="ghost"
                            size="sm"
                            fullWidth={false}
                            className="ml-auto text-red-600 hover:text-red-700"
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="mb-4 text-gray-600">No addresses saved yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="border border-gray-200 bg-white p-8 shadow-xl">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">My Wishlist</h2>
                {wishlist.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="mb-6 inline-block rounded-full bg-gradient-to-br from-gray-100 to-gray-200 p-6">
                      <FontAwesomeIcon icon={faHeart} className="h-16 w-16 text-gray-700" />
                    </div>
                    <p className="mb-4 text-lg text-gray-700">
                      Your wishlist is empty. Start adding your favorites!
                    </p>
                    <Button
                      onClick={() => router.push('/products')}
                      variant="primary"
                      size="lg"
                      fullWidth={false}
                    >
                      Discover Products →
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="mb-4 text-gray-600">
                      {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
                    </p>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {wishlist.map((item) => (
                        <div
                          key={item.productId}
                          className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition-shadow hover:shadow-lg"
                        >
                          <Link href={`/products/${item.productId}`}>
                            <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-gray-200">
                              {item.image ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <FontAwesomeIcon
                                    icon={faHeart}
                                    className="h-12 w-12 text-gray-400"
                                  />
                                </div>
                              )}
                            </div>
                          </Link>
                          <Link
                            href={`/products/${item.productId}`}
                            className="mb-2 line-clamp-2 block font-semibold text-gray-900 hover:text-indigo-600"
                          >
                            {item.name}
                          </Link>
                          <p className="mb-3 text-lg font-bold text-indigo-600">
                            ${item.price.toFixed(2)}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => {
                                addItem({
                                  productId: item.productId,
                                  id: item.productId,
                                  name: item.name,
                                  price: item.price,
                                  quantity: 1,
                                  image: item.image,
                                });
                                showToast('Added to cart!', 'success');
                              }}
                              className="flex-1"
                            >
                              Add to Cart
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                removeFromWishlist(item.productId);
                                showToast('Removed from wishlist', 'info');
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tickets' && (
              <div className="border border-gray-200 bg-white p-8 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Support Tickets</h2>
                  {!isCreatingTicket && (
                    <Button
                      onClick={() => setIsCreatingTicket(true)}
                      variant="primary"
                      size="md"
                      fullWidth={false}
                      className="flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                      Create Ticket
                    </Button>
                  )}
                </div>

                {isCreatingTicket && (
                  <div className="mb-8 rounded-lg border-2 border-gray-300 bg-gray-50 p-6">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Create New Ticket</h3>
                    <div className="space-y-4">
                      <Input
                        size="md"
                        type="text"
                        placeholder="Subject *"
                        value={newTicket.subject || ''}
                        onChange={(e: any) =>
                          setNewTicket({ ...newTicket, subject: e.target.value })
                        }
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Category
                          </label>
                          <select
                            value={newTicket.category || 'general'}
                            onChange={(e) =>
                              setNewTicket({ ...newTicket, category: e.target.value })
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="general">General</option>
                            <option value="order">Order Issue</option>
                            <option value="billing">Billing</option>
                            <option value="technical">Technical</option>
                            <option value="account">Account</option>
                            <option value="feature">Feature Request</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Priority
                          </label>
                          <select
                            value={newTicket.priority || 'medium'}
                            onChange={(e) =>
                              setNewTicket({ ...newTicket, priority: e.target.value })
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Description *
                        </label>
                        <textarea
                          placeholder="Describe your issue in detail..."
                          value={newTicket.description || ''}
                          onChange={(e) =>
                            setNewTicket({ ...newTicket, description: e.target.value })
                          }
                          rows={5}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={async () => {
                            if (!newTicket.subject || !newTicket.description) {
                              showToast('Please fill in subject and description', 'error');
                              return;
                            }
                            try {
                              await createTicketMutation({
                                subject: newTicket.subject,
                                description: newTicket.description,
                                category: newTicket.category || 'general',
                                priority: newTicket.priority || 'medium',
                                customerName: displayProfile?.name || '',
                                customerEmail: displayProfile?.email || '',
                                customerId: displayProfile?.id,
                              });
                              setNewTicket({
                                subject: '',
                                description: '',
                                category: 'general',
                                priority: 'medium',
                              });
                              setIsCreatingTicket(false);
                              showToast('Ticket created successfully!', 'success');
                            } catch (error: any) {
                              // Extract error message from GraphQL response
                              const graphqlError =
                                error?.graphQLErrors?.[0]?.message ||
                                error?.networkError?.result?.errors?.[0]?.message ||
                                error?.message ||
                                'Failed to create ticket';
                              showToast(graphqlError, 'error');
                            }
                          }}
                          disabled={creatingTicket}
                          className="flex-1"
                        >
                          {creatingTicket ? (
                            <>
                              <FontAwesomeIcon
                                icon={faSpinner}
                                className="mr-2 h-4 w-4 animate-spin"
                              />
                              Creating...
                            </>
                          ) : (
                            'Create Ticket'
                          )}
                        </Button>
                        <Button
                          onClick={() => setIsCreatingTicket(false)}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {ticketsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="h-8 w-8 animate-spin text-indigo-600"
                    />
                    <span className="ml-3 text-gray-600">Loading tickets...</span>
                  </div>
                ) : ticketsData?.tickets && ticketsData.tickets.length > 0 ? (
                  <div className="space-y-4">
                    <p className="mb-4 text-gray-600">
                      {ticketsData.pagination.total} ticket(s) found
                    </p>
                    {ticketsData.tickets.map((ticket: Ticket) => (
                      <div
                        key={ticket.id}
                        className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              <span className="font-mono text-xs text-gray-500">
                                #{ticket.ticketId}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                  ticket.status === 'open'
                                    ? 'bg-green-100 text-green-800'
                                    : ticket.status === 'in_progress'
                                      ? 'bg-blue-100 text-blue-800'
                                      : ticket.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : ticket.status === 'resolved'
                                          ? 'bg-purple-100 text-purple-800'
                                          : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {ticket.status.replace('_', ' ')}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                  ticket.priority === 'urgent'
                                    ? 'bg-red-100 text-red-800'
                                    : ticket.priority === 'high'
                                      ? 'bg-orange-100 text-orange-800'
                                      : ticket.priority === 'medium'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {ticket.priority}
                              </span>
                              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
                                {ticket.category}
                              </span>
                            </div>
                            <h4 className="mb-1 font-semibold text-gray-900">{ticket.subject}</h4>
                            <p className="line-clamp-2 text-sm text-gray-600">
                              {ticket.description}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                          <div className="flex items-center text-xs text-gray-500">
                            <FontAwesomeIcon icon={faClock} className="mr-1 h-3 w-3" />
                            {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                          {ticket.resolution && (
                            <span className="flex items-center gap-1 text-xs text-green-600">
                              <FontAwesomeIcon icon={faCheckCircle} className="h-3 w-3" />
                              Resolved
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Pagination */}
                    {ticketsData.pagination.pages > 1 && (
                      <div className="flex justify-center gap-2 pt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setTicketPage((p) => Math.max(1, p - 1))}
                          disabled={ticketPage === 1}
                        >
                          Previous
                        </Button>
                        <span className="flex items-center px-4 text-sm text-gray-600">
                          Page {ticketPage} of {ticketsData.pagination.pages}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setTicketPage((p) => Math.min(ticketsData.pagination.pages, p + 1))
                          }
                          disabled={ticketPage >= ticketsData.pagination.pages}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="mb-6 inline-block rounded-full bg-gradient-to-br from-gray-100 to-gray-200 p-6">
                      <FontAwesomeIcon icon={faTicket} className="h-16 w-16 text-gray-700" />
                    </div>
                    <p className="mb-4 text-lg text-gray-700">
                      No support tickets yet. Need help with something?
                    </p>
                    <Button
                      onClick={() => setIsCreatingTicket(true)}
                      variant="primary"
                      size="lg"
                      fullWidth={false}
                    >
                      Create Your First Ticket
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
