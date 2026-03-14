import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import api from "../utils/axios"; // 👈 Express backend için axios instance

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // 👈 bunu ekle


  // Konum alma
 

  const handleSubmit = async (e) => {
    e.preventDefault();

  console.log("Gönderilen data:", { username, email, password });
    try {
      const response = await api.post("/api/register", {
        username,
        email,
        password,
        
      });

      alert(response.data.message);
      router.push("/welcome"); // ✅ başarılı kayıt sonrası yönlendir
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || "Kayıt sırasında bir hata oluştu.";
      alert(errorMsg);
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Link href="/" className="absolute top-4 left-4 z-10">
        <img
          className="h-16 w-16 animate-spin object-cover rounded-full transform hover:scale-110 transition-transform duration-300"
          src="/chef1.png"
          alt="Logo"
        />
      </Link>

      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/chef.png')" }}
      ></div>

      <div
        className="md:hidden w-full h-64 bg-cover bg-center"
        style={{ backgroundImage: "url('/chef.png')" }}
      ></div>

      <div className="flex flex-col justify-center items-center md:w-1/2 w-full p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-2 gap-4">
           
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
