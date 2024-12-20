import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  
  const [error, setError] = useState("");
  
  const [validations, setValidations] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    passwordsMatch: false,
  });
  const [showPassword, setShowPassword] = useState(false)
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    const updatedValidations = {
      minLength: value.length >= 8,
      hasUpperCase: /[A-Z]/.test(value),
      hasLowerCase: /[a-z]/.test(value),
      hasNumber: /[0-9]/.test(value),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      passwordsMatch: value === confirmPassword,
    };

    setValidations(updatedValidations);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    setValidations((prevValidations) => ({
      ...prevValidations,
      passwordsMatch: value === password,
    }));
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          setError("Konum alınamadı. Lütfen tarayıcı ayarlarını kontrol edin.");
          console.error("Location error: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(validations).every(Boolean)) {
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
            latitude,
            longitude,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || "Registration failed. Please try again.");
        }

        if (response.ok) {
          router.push("/login");
        }

        console.log("Registration successful!");
      } catch (error) {
        setError("Registration failed. Please try again later.");
        console.error("Registration error:", error);
      }
    } else {
      setError(
        "Password must meet all the requirements and passwords must match."
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="md:w-1/2 h-64 md:h-auto bg-cover bg-center"
        style={{ backgroundImage: "url('/chef.png')" }}
      ></div>
      <div className="flex items-center justify-center w-full md:w-1/2 p-8">
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type={showPassword ? "text" : "password"}
                placeholder="******************"
                value={password}
                onChange={handlePasswordChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm text-blue-500 mt-2"
              >
                {showPassword ? "Hide" : "Show"} Password
              </button>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
                  error ? "border-red-500" : ""
                }`}
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {error && <p className="text-red-500 text-xs italic">{error}</p>}
              <div className="mt-2">
                <p
                  className={`text-sm ${
                    validations.minLength ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  {validations.minLength && (
                    <p className="text-green-500">Minimum 8 characters met!</p>
                  )}
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
                <p
                  className={`text-sm ${
                    validations.passwordsMatch
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  {validations.passwordsMatch ? "✓" : "✗"} Passwords match
                </p>
              </div>
            </div>
            <div className="mb-6">
              <button
                type="button"
                onClick={handleLocationClick}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Location Al
              </button>
            </div>
            {latitude && longitude && (
              <div className="mb-4">
                <p>Latitude: {latitude}</p>
                <p>Longitude: {longitude}</p>
              </div>
            )}
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Register
              </button>
              <Link href="/login" legacyBehavior>
                <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                  Already have an account? Login
                </a>
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
