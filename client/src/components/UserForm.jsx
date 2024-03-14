import React, { useEffect, useState } from "react";
import axios from "axios";
import CloseIcon from "./Icons/CloseIcon";

const UserForm = ({
  openForm,
  setOpenForm,
  userToUpdate,
  fetchAllUsers,
  // for toast
  showToast,
  setShowToast,
  toastMsg,
  setToastMsg,
  isError,
  setIsError,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Update form fields when userToUpdate changes
    if (userToUpdate) {
      setEmail(userToUpdate.email);
      setPassword(userToUpdate.password);
      setFullName(userToUpdate.fullName);
      setIsAdmin(userToUpdate.admin);
      setIsVerified(userToUpdate.subscribed);
    } else {
      // Reset form fields when userToUpdate is null (for adding new user)
      setEmail("");
      setPassword("");
      setFullName("");
      setIsAdmin(false);
      setIsVerified(false);
    }
  }, [userToUpdate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      id: userToUpdate ? userToUpdate.id : 0,
      email: email,
      password: password,
      fullName: fullName,
      admin: isAdmin,
      subscribed: isVerified,
    };

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl) {
        console.error("Base URL not defined in .env file");
        return;
      }

      let res;
      if (userToUpdate) {
        // Update existing user
        res = await axios.put(`${baseUrl}/api/users`, userData,{
          withCredentials: true,
        });
        if (res.status >= 200 && res.status < 300) {
          // Request successful
          fetchAllUsers(); // Assuming fetchAllUsers is a function to reload users
          setToastMsg("User updated successfully");
        } else {
          // Request failed
          setIsError(true);
          setToastMsg("Error updating user");
        }
      } else {
        // Add new user
        res = await axios.post(`${baseUrl}/api/users/add`, userData, {
          withCredentials: true,
        });
        if (res.status >= 200 && res.status < 300) {
          // Request successful
          fetchAllUsers(); // Assuming fetchAllUsers is a function to reload users
          setToastMsg("User added successfully");
        } else {
          // Request failed
          setIsError(true);
          setToastMsg("Error adding user");
        }
      }

      setShowToast(true);
      setOpenForm(false); // Close form after successful submission
    } catch (error) {
      console.error("Error:", error);
      // Handle error if necessary
    }
  };

  return (
    <div>
      {openForm && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
              {/*-------------------------  */}

              <form onSubmit={handleSubmit} className="max-w-sm mx-auto pb-5">
                <div className="mb-5">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Enter email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Enter password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="fullName"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Enter full name..."
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    User Roles
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isAdmin"
                      className="text-blue-500 border-gray-300 rounded-sm focus:ring-blue-500"
                      checked={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                    />
                    <label
                      htmlFor="isAdmin"
                      className="ml-2 text-sm text-gray-900 cursor-pointer"
                    >
                      Admin
                    </label>
                  </div>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="isVerified"
                      className="text-blue-500 border-gray-300 rounded-sm focus:ring-blue-500"
                      checked={isVerified}
                      onChange={(e) => setIsVerified(e.target.checked)}
                    />
                    <label
                      htmlFor="isVerified"
                      className="ml-2 text-sm text-gray-900 cursor-pointer"
                    >
                      Verified
                    </label>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
                  >
                    {userToUpdate ? "Update" : "Add"}
                  </button>
                  <div onClick={(e) => setOpenForm(false)}>
                    <CloseIcon />
                  </div>
                </div>
              </form>
              {/*  */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserForm;
