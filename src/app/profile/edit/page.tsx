'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { NavigationButtons } from '@/components/features/NavigationButtons';
import { Button } from '@/components/ui/Button';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { useAppSelector } from '@/redux/hooks';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        if (!isAuthenticated || !user) {
          toast.error('Please login first');
          router.push('/auth/login');
          return;
        }

        let firstName = user.first_name || '';
        let lastName = user.last_name || '';

        if (!firstName && !lastName) {
          const fullName = user.full_name || user.name || '';
          const names = fullName.trim().split(' ');
          firstName = names[0] || '';
          lastName = names.slice(1).join(' ') || '';
        }

        setFormData({
          firstName,
          lastName,
          phone: user.phone || '',
        });
      } catch (e) {
        toast.error('Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [router, isAuthenticated, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await api.put(endPointApi.updateUserProfile, {
        first_name: formData.firstName,
        last_name: formData.lastName,
      });

      if (response.data.success) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          userData.first_name = formData.firstName;
          userData.last_name = formData.lastName;
          userData.full_name = `${formData.firstName} ${formData.lastName}`.trim();
          localStorage.setItem('user', JSON.stringify(userData));
        }

        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 
        error.message || 
        'Failed to update profile'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex-1">
          <NavigationButtons />

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mt-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Personal Information</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed focus:ring-0 focus:border-gray-300 outline-none"
                  placeholder="Mobile number cannot be changed"
                />
                <p className="text-xs text-gray-500 mt-1">Phone number cannot be updated</p>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/profile')}
                  className="px-10 py-3"
                >
                  Back to Dashboard
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="px-10 py-3"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
