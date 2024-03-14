"use client";
import "./navbar.css";
import Image from "next/image";
import Link from "next/link";
import AuthContext from "@/contexts/AuthContext";
import { useContext } from "react";
import axios  from "axios";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);

  function handleHumburgerClicked() {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const links = document.querySelectorAll(".nav-links li");
    console.log("the animation should be staring...");
    navLinks.classList.toggle("open");
    links.forEach((link) => {
      link.classList.toggle("fade");
    });
    //Hamburger Animation
    hamburger.classList.toggle("toggle");
  }

  async function logout() {
    console.log("the logout start")
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      // Make a POST request to the /signout endpoint to remove the cookies
      const res = await axios.get(`${baseUrl}/api/users/signout`, {
        withCredentials: true,
      });
      if (res) {
        console.log(res);
        // After successfully logging out, set the user to null or perform any other necessary actions
        setUser(null);
      }
    } catch (error) {
      // Handle any errors that occur during the logout process
      console.error("Error logging out:", error);
    }
  }

  return (
    <div>
      <nav>
        <Link
          href="/"
          className="flex items-center mb-0 sm:mb-0 space-x-1 rtl:space-x-reverse logo"
        >
          <Image
            src="/g-note-logo.png"
            width={40}
            height={100}
            alt="Logo Image"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            G-Note
          </span>
        </Link>
        <div className="hamburger" onClick={() => handleHumburgerClicked()}>
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
        </div>
        <ul className="nav-links">
          {user && (
            <li>
              <div
                style={{
                  backgroundColor: "rgb(23, 39, 78)",
                  color: "#fff",
                  padding: "10px",
                  borderRadius: "5px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  textAlign: "center",
                  margin: "2vw",
                }}
              >
                <p
                  style={{ fontSize: "1.2em", fontWeight: "bold", margin: "0" }}
                >
                  Welcome, {user.fullName}!
                </p>
                {!user?.admin && (
                  <p style={{ fontSize: "0.8em", margin: "0" }}>
                    We&apos;re glad to have you here.
                  </p>
                )}
                {user?.admin && (
                  <p style={{ fontSize: "0.8em", margin: "0" }}>
                    You&apos;re authenticated as an Admin.
                  </p>
                )}
              </div>
            </li>
          )}

          {user && !user?.admin && (
            <li>
              <Link href="/mynotes">My Notes</Link>
            </li>
          )}
          {user?.admin && (
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
          )}
          {!user && (
            <Link href="/auth">
              <div className="login-button">Login</div>
            </Link>
          )}
          {user && (
            <Link href="/auth">
              <div
                className="login-button"
                onClick={(e) => {
                  logout();
                }}
              >
                Sign out
              </div>
            </Link>
          )}
          {/* <li>
            <Link href="#">Services</Link>
          </li>
          <li>
            <Link href="#">Contact Us</Link>
          </li> */}
          {/* <li>
            <button className="login-button" href="#">
              Login
            </button>
          </li>
          <li>
            <button className="join-button" href="#">
              Join
            </button>
          </li> */}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
