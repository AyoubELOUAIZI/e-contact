import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Alert from "./Dialogs/Alert";
import SpinerLoading from "./Icons/SpinerLoading";
import Image from "next/image";
import Toast from "./Dialogs/Toast";

const Auth = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const { user, setUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    type: "", //warning //danger
    msg: "",
  });

  //the code the toast message part
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    //navigate to user page if already logged in
    if (user) {
      if (!user?.admin) {
        router.push("/mynotes");
      } else {
        router.push("/dashboard");
      }
    }
  }, []);

  const [isLogin, setLogin] = useState(true);
  const [email, setEmail] = useState("test@gmail.com");//test@gmail.com //admin@example.com
  const [password, setPassword] = useState("000000");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    //validate data depending on signin or signup before trying the api
    // Validate form data
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/api/users/${isLogin ? "signin" : "signup"}`,
        {
          email,
          password,
          fullName,
          confirmPassword,
        },
        {
          withCredentials: true,
        }
      );
      // console.log(response);
      if (response.data) {
        console.log(response.data);
        setAlert(null);
        if (isLogin) {
          setUser(response.data);
          if (!response.data.admin) {
            router.push("/mynotes");
          } else {
            router.push("/dashboard");
          }
        } else {
          setLogin(true);
          setToastMsg(`Thanks ${fullName} Registration successful! Please wait while we verify your account.`);
          setShowToast(true);
          console.log("you should be now in the login form");
        }
      }

      // Add logic to handle successful sign-in/sign-up
    } catch (error) {
      console.log(error);
      if (error?.response?.data) {
        console.error(error.response.data);
        setAlert({
          type: "danger",
          msg: error.response.data,
        });
      }
      // Add logic to handle sign-in/sign-up errors
    }
    setIsLoading(false);
  };

  const validateForm = () => {
    // Regular expression for email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if email is valid
    if (!email || !emailRegex.test(email)) {
      setAlert({
        type: "danger",
        msg: "Please enter a valid email address.",
      });
      return false;
    }

    // Check if password length is at least 6 characters
    if (!password || password.length < 6) {
      setAlert({
        type: "danger",
        msg: "Password must be at least 6 characters long.",
      });
      return false;
    }
    if (!isLogin) {//means it is signup not login/signin

      if (!fullName ) {
        setAlert({
          type: "danger",
          msg: "Full name is required.",
        });
        return false;
      }

      // Check if full name contains both first name and last name
      const names = fullName.trim().split(" ");
      if (names.length < 2) {
        setAlert({
          type: "danger",
          msg: "Please enter both first name and last name.",
        });
        return false;
      }

      // Check if confirm password matches password (for sign-up)
      if (!isLogin && password !== confirmPassword) {
        setAlert({
          type: "danger",
          msg: "Passwords do not match.",
        });
        return false;
      }
    }
    return true;
  };

  return (
    <div>
      {/* toast */}
      <Toast
        setShowToast={setShowToast}
        showToast={showToast}
        toastMsg={toastMsg}
        isError={isError}
        setIsError={setIsError}
      />
      {isLogin && (
        <div className="py-16 md:py-24">
          <form
            onSubmit={handleSubmit}
            className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto  lg:max-w-7xl"
          >
            <div
              className="hidden lg:block lg:w-1/2 bg-cover"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80')",
              }}
            ></div>
            <div className="w-full p-8 lg:w-1/2">
              <div className="flex justify-center items-center">
                <Image
                  src="/g-note-logo.png"
                  width={50}
                  height={100}
                  alt="Logo Image"
                />
                <h2 className="text-2xl font-semibold text-gray-700 text-center">
                  G-Note
                </h2>
              </div>

              <p className="text-xl text-gray-600 text-center">Welcome back!</p>

              <div className="mt-4 flex items-center justify-between">
                <span className="border-b w-1/5 lg:w-1/4"></span>
                <a href="#" className="text-xs text-center text-gray-500 uppercase">
                  Sign in below to access your account
                </a>
                <span className="border-b w-1/5 lg:w-1/4"></span>
              </div>
              <div className="flex justify-center">
                <Alert alert={alert} setAlert={setAlert} />
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email Address
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                  type="email"
                  placeholder="example@example.com"
                />
              </div>
              <div className="mt-4">
                <div className="flex justify-between">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Password
                  </label>
                </div>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                  type="password"
                  placeholder="**********"
                />
              </div>
              <div className="mt-8">
                <button
                  type="submit"
                  className="flex justify-center items-center bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
                >
                  {isLoading && <SpinerLoading />}
                  Sign In
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="border-b w-1/5 md:w-1/4"></span>
                <a
                  onClick={(e) => {
                    setLogin(false);
                    setAlert(null);
                  }}
                  href="#signup"
                  className="text-xs text-gray-500 uppercase"
                >
                  or sign up
                </a>
                <span className="border-b w-1/5 md:w-1/4"></span>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* // the signup */}
      {!isLogin && (
        <div className="py-3 md:py-8">
          <form
            onSubmit={handleSubmit}
            className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto  lg:max-w-7xl"
          >
            <div
              className="hidden lg:block lg:w-1/2 bg-cover"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80')",
              }}
            ></div>
            <div className="w-full p-8 lg:w-1/2">
              <div className="flex justify-center items-center">
                <Image
                  src="/g-note-logo.png"
                  width={50}
                  height={100}
                  alt="Logo Image"
                />
                <h2 className="text-2xl font-semibold text-gray-700 text-center">
                  G-Note
                </h2>
              </div>
              <p className="text-xl text-gray-600 text-center">
                Sign up now to begin your journey!
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="border-b w-1/5 lg:w-1/4"></span>
                <a href="#" className="text-xs text-center text-gray-500 uppercase">
                  Sign up to create your account
                </a>
                <span className="border-b w-1/5 lg:w-1/4"></span>
              </div>
              <div className="flex justify-center">
                <Alert alert={alert} setAlert={setAlert} />
              </div>{" "}
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Full Name
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                  type="text"
                  placeholder="full name"
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email Address
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                  type="email"
                  placeholder="example@example.com"
                />
              </div>
              <div className="mt-4">
                <div className="flex justify-between">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Password
                  </label>
                </div>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                  type="password"
                  placeholder="**********"
                />
              </div>
              <div className="mt-4">
                <div className="flex justify-between">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Confirm Password
                  </label>
                </div>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                  type="password"
                  placeholder="**********"
                />
              </div>
              <div className="mt-8">
                <button
                  type="submit"
                  className="flex justify-center items-center bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
                >
                  {isLoading && <SpinerLoading />}
                  Sign Up
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="border-b w-1/5 md:w-1/4"></span>
                <a
                  onClick={(e) => {
                    setLogin(true);
                    setAlert(null);
                  }}
                  href="#signin"
                  className="text-xs text-gray-500 uppercase"
                >
                  Already have an account
                </a>
                <span className="border-b w-1/5 md:w-1/4"></span>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Auth;
