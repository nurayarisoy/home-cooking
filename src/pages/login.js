import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validations, setValidations] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    const updatedValidations = {
      minLength: value.length >= 8,
      hasUpperCase: /[A-Z]/.test(value),
      hasLowerCase: /[a-z]/.test(value),
      hasNumber: /[0-9]/.test(value),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    };

    setValidations(updatedValidations);

    const isValid = Object.values(updatedValidations).every(Boolean);
    setError(isValid ? "" : "Password must meet all the requirements.");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(validations).every(Boolean)) {
      // Perform login action
      console.log("Logging in...");
    } else {
      setError("Password must meet all the requirements.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <a href="/" className="block">
  <img
    className="h-16 w-auto animate-spin object-cover rounded-full transform hover:scale-175 transition-transform duration-300 
               ml-4 mt-4" // Sağa ve aşağıya kaydırma
    src="/chef1.png"
    alt="Logo"
  />
</a>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/chef.png')" }}
      >
        {/* You can also use an img tag if preferred */}
        {/* <img src="/path-to-your-image.jpg" alt="Login Image" className="w-full h-full object-cover" /> */}
      </div>
      <div
        className="md:hidden w-full h-64 bg-cover bg-center"
        style={{ backgroundImage: "url('/chef.png')" }}
      >
        {/* Small screen image */}
      </div>
      <div className="flex items-center justify-center w-full md:w-1/2">
        <div className="w-full max-w-md">
          <form
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={handleSubmit}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Username"
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
                  error ? "border-red-500" : ""
                }`}
                id="password"
                type="password"
                placeholder="******************"
                value={password}
                onChange={handlePasswordChange}
              />
              {error && <p className="text-red-500 text-xs italic">{error}</p>}
              <div className="mt-2">
                <p
                  className={`text-sm ${
                    validations.minLength ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  {validations.minLength ? "✓" : "✗"} Minimum 8 characters
                </p>
                <p
                  className={`text-sm ${
                    validations.hasUpperCase
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  {validations.hasUpperCase ? "✓" : "✗"} At least one uppercase
                  letter
                </p>
                <p
                  className={`text-sm ${
                    validations.hasLowerCase
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  {validations.hasLowerCase ? "✓" : "✗"} At least one lowercase
                  letter
                </p>
                <p
                  className={`text-sm ${
                    validations.hasNumber ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  {validations.hasNumber ? "✓" : "✗"} At least one number
                </p>
                <p
                  className={`text-sm ${
                    validations.hasSpecialChar
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  {validations.hasSpecialChar ? "✓" : "✗"} At least one special
                  character
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign In
              </button>
              <Link
                href="/forgot-password"
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              >
                Forgot Password?
              </Link>
            </div>
          </form>
          <p className="text-center text-gray-500 text-xs">
            &copy;2023 Acme Corp. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
