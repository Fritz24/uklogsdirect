import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Helmet } from 'react-helmet-async'

interface Profile {
  id: string;
  full_name: string;
  billing_address: string;
  telephone_no: string;
  join_newsletter: boolean;
  email: string; // Include email as well, though it comes from auth.user
}

export default function AccountPage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else if (!loading) {
      setLoadingProfile(false);
    }
  }, [user, loading]);

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, billing_address, telephone_no, join_newsletter, email')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        throw error;
      }
      
      if (data) {
        setProfile(data as Profile);
      } else {
        // If no profile found but user exists, initialize with user's email
        setProfile({
          id: user!.id,
          full_name: '',
          billing_address: '',
          telephone_no: '',
          join_newsletter: false,
          email: user!.email || ''
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      setFormErrors('Failed to load profile data.');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const inputValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setProfile(prevProfile => {
      if (!prevProfile) return null;
      return {
        ...prevProfile,
        [name]: inputValue,
      };
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors('');
    setSuccessMessage('');
    if (!profile) return;

    try {
      setLoadingProfile(true); // Use loadingProfile for updates too
      const { full_name, billing_address, telephone_no, join_newsletter } = profile;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name,
          billing_address,
          telephone_no,
          join_newsletter,
        })
        .eq('id', user?.id);

      if (error) {
        throw error;
      }
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setFormErrors(error.message || 'Failed to update profile.');
    } finally {
      setLoadingProfile(false);
      setTimeout(() => setSuccessMessage(''), 3000);
      setTimeout(() => setFormErrors(''), 5000);
    }
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Helmet>
          <title>Access Denied - Logs Supply Pro</title>
          <meta name="description" content="Access to this page is denied. Please log in to your Logs Supply Pro account." />
        </Helmet>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">Please log in to view your account details.</p>
          <a href="/login" className="inline-flex items-center bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>My Account - Logs Supply Pro</title>
        <meta name="description" content="Manage your Logs Supply Pro account details, including your profile information and orders." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Account</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          {formErrors && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {formErrors}</span>
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline"> {successMessage}</span>
            </div>
          )}

          {!isEditing ? (
            <div className="space-y-4">
              <p className="text-lg text-gray-800"><span className="font-semibold">Email:</span> {profile?.email || user.email}</p>
              <p className="text-lg text-gray-800"><span className="font-semibold">Full Name:</span> {profile?.full_name || 'Not set'}</p>
              <p className="text-lg text-gray-800"><span className="font-semibold">Billing Address:</span> {profile?.billing_address || 'Not set'}</p>
              <p className="text-lg text-gray-800"><span className="font-semibold">Telephone No.:</span> {profile?.telephone_no || 'Not set'}</p>
              <p className="text-lg text-gray-800"><span className="font-semibold">Newsletter:</span> {profile?.join_newsletter ? 'Yes' : 'No'}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profile?.email || ''}
                  disabled // Email usually not editable via profile page
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={profile?.full_name || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700">Billing Address</label>
                <input
                  type="text"
                  id="billing_address"
                  name="billing_address"
                  value={profile?.billing_address || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label htmlFor="telephoneNo" className="block text-sm font-medium text-gray-700">Telephone No.</label>
                <input
                  type="tel"
                  id="telephone_no"
                  name="telephone_no"
                  value={profile?.telephone_no || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  id="joinNewsletter"
                  name="join_newsletter"
                  type="checkbox"
                  checked={profile?.join_newsletter || false}
                  onChange={handleInputChange}
                  className="form-checkbox h-4 w-4 text-green-600 transition duration-150 ease-in-out"
                />
                <label htmlFor="joinNewsletter" className="ml-2 block text-sm text-gray-900">
                  Join our newsletter
                </label>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingProfile}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 