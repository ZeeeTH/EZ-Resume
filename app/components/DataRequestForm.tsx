"use client"

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface DataRequestFormData {
  name: string;
  email: string;
  requestType: 'access' | 'deletion' | 'portability' | 'rectification';
  description: string;
  verificationMethod: 'email' | 'phone';
  phone?: string;
}

export default function DataRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<DataRequestFormData>();

  const requestType = watch('requestType');
  const verificationMethod = watch('verificationMethod');

  const onSubmit = async (data: DataRequestFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Here you would typically send this to your backend
      // For now, we'll simulate the request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      reset();
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRequestTypeDescription = (type: string) => {
    switch (type) {
      case 'access':
        return 'Request a copy of all personal data we hold about you';
      case 'deletion':
        return 'Request deletion of your personal data (Right to be Forgotten)';
      case 'portability':
        return 'Request your data in a structured, machine-readable format';
      case 'rectification':
        return 'Request correction of inaccurate or incomplete personal data';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6">Data Request Form</h2>
      
      <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <h3 className="text-blue-300 font-semibold mb-2">Your Data Rights</h3>
        <ul className="text-blue-200 text-sm space-y-1">
          <li>• <strong>Access:</strong> Get a copy of all your personal data</li>
          <li>• <strong>Deletion:</strong> Request removal of your personal data</li>
          <li>• <strong>Portability:</strong> Receive your data in a portable format</li>
          <li>• <strong>Rectification:</strong> Correct inaccurate personal data</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Request Type */}
        <div>
          <label className="block text-white font-medium mb-2">
            Request Type *
          </label>
          <select
            {...register('requestType', { required: 'Please select a request type' })}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
          >
            <option value="">Select request type</option>
            <option value="access">Access my personal data</option>
            <option value="deletion">Delete my personal data</option>
            <option value="portability">Portability of my data</option>
            <option value="rectification">Rectify my personal data</option>
          </select>
          {errors.requestType && (
            <p className="text-red-400 text-sm mt-1">{errors.requestType.message}</p>
          )}
          {requestType && (
            <p className="text-gray-300 text-sm mt-2">{getRequestTypeDescription(requestType)}</p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-white font-medium mb-2">
            Full Name *
          </label>
          <input
            type="text"
            {...register('name', { required: 'Name is required' })}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-white font-medium mb-2">
            Email Address *
          </label>
          <input
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address'
              }
            })}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Verification Method */}
        <div>
          <label className="block text-white font-medium mb-2">
            Verification Method *
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="email"
                {...register('verificationMethod', { required: 'Please select a verification method' })}
                className="mr-2 text-purple-600"
              />
              <span className="text-gray-300">Email verification</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="phone"
                {...register('verificationMethod', { required: 'Please select a verification method' })}
                className="mr-2 text-purple-600"
              />
              <span className="text-gray-300">Phone verification</span>
            </label>
          </div>
          {errors.verificationMethod && (
            <p className="text-red-400 text-sm mt-1">{errors.verificationMethod.message}</p>
          )}
        </div>

        {/* Phone Number (conditional) */}
        {verificationMethod === 'phone' && (
          <div>
            <label className="block text-white font-medium mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              {...register('phone', { 
                required: verificationMethod === 'phone' ? 'Phone number is required' : false,
                pattern: {
                  value: /^[\+]?[1-9][\d]{0,15}$/,
                  message: 'Please enter a valid phone number'
                }
              })}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-white font-medium mb-2">
            Additional Details
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            placeholder="Please provide any additional details about your request..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting Request...' : 'Submit Data Request'}
        </button>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <p className="text-green-300">
              Your data request has been submitted successfully. We will respond within 30 days as required by law.
            </p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300">
              There was an error submitting your request. Please try again or contact us directly.
            </p>
          </div>
        )}
      </form>

      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
        <h4 className="text-white font-semibold mb-2">What happens next?</h4>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• We will verify your identity within 3 business days</li>
          <li>• We will process your request within 30 days (GDPR requirement)</li>
          <li>• For access requests, you'll receive your data in a secure format</li>
          <li>• For deletion requests, we'll confirm when your data has been removed</li>
        </ul>
      </div>
    </div>
  );
} 