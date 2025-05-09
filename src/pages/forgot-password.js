import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Şifre sıfırlama işlemi burada gerçekleştirilecek
    console.log('Password reset request for:', email);
    setMessage('If an account with that email exists, a password reset link has been sent.');
  };

  return (
    <div className="flex flex-col md:flex-row items-center min-h-screen bg-gray-100">
      <a href="/" className="block">
  <img
    className="h-16 w-auto animate-spin object-cover rounded-full transform hover:scale-175 transition-transform duration-300 
               ml-4 mt-4" // Sağa ve aşağıya kaydırma
    src="/chef1.png"
    alt="Logo"
  />
</a>
      <Head>
        <title>Forgot Password</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="md:w-1/2 bg-cover bg-center hidden md:block"
           style={{ backgroundImage: "url('/chef.png')" }}>
        {/* Büyük ekranlarda (md ve üzeri), arka plan görseli */}
      </div>
      <div className="w-full h-64 bg-cover bg-center md:hidden"
           style={{ backgroundImage: "url('/chef.png')" }}>
        {/* Küçük ekranlarda (md altı), arka plan görseli */}
      </div>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Forgot Password</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send Password Reset Link
            </button>
          </div>
        </form>
        {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
        <div className="text-center">
          <Link href="/login" legacyBehavior>
            <a className="font-medium text-blue-600 hover:text-blue-500">
              Back to Login
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
