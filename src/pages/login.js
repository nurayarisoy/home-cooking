import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import api from "../utils/axios"; // Backend axios instance

export default function Login() {
  const router = useRouter();
 const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
    setError(
      Object.values(updatedValidations).every(Boolean)
        ? ""
        : "Password must meet all the requirements."
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Object.values(validations).every(Boolean)) {
      setError("Password must meet all the requirements.");
      return;
    }

    try {
      const response = await api.post("/api/login", { email, password }); 
      alert(response.data.message);

      // ✅ Başarılı girişte kochen sayfasına yönlendir
      router.push("/kochen");
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed";
      setError(msg);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Link href="/" className="block">
        <img
          className="h-16 w-auto animate-spin object-cover rounded-full transform hover:scale-175 transition-transform duration-300 ml-4 mt-4"
          src="/chef1.png"
          alt="Logo"
        />
      </Link>

      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/chef.png')" }}
      ></div>

      <div
        className="md:hidden w-full h-64 bg-cover bg-center"
        style={{ backgroundImage: "url('/chef.png')" }}
      ></div>

      <div className="flex items-center justify-center w-full md:w-1/2">
        <div className="w-full max-w-md">
          <form className="bg-blackshadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                id="name"
                type="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="******************"
                value={password}
                onChange={handlePasswordChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
                  error ? "border-red-500" : ""
                }`}
              />
              {error && <p className="text-red-500 text-xs italic">{error}</p>}
              <div className="mt-2">
                <p className={`text-sm ${validations.minLength ? "text-green-500" : "text-gray-500"}`}>
                  {validations.minLength ? "✓" : "✗"} Minimum 8 characters
                </p>
                <p className={`text-sm ${validations.hasUpperCase ? "text-green-500" : "text-gray-500"}`}>
                  {validations.hasUpperCase ? "✓" : "✗"} At least one uppercase letter
                </p>
                <p className={`text-sm ${validations.hasLowerCase ? "text-green-500" : "text-gray-500"}`}>
                  {validations.hasLowerCase ? "✓" : "✗"} At least one lowercase letter
                </p>
                <p className={`text-sm ${validations.hasNumber ? "text-green-500" : "text-gray-500"}`}>
                  {validations.hasNumber ? "✓" : "✗"} At least one number
                </p>
                <p className={`text-sm ${validations.hasSpecialChar ? "text-green-500" : "text-gray-500"}`}>
                  {validations.hasSpecialChar ? "✓" : "✗"} At least one special character
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
          <p className="text-center text-gray-500 text-xs">&copy;2023 Acme Corp. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
