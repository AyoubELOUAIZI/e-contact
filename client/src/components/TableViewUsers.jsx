"use client";
import React, { useEffect, useState } from "react";
import DeleteIcon from "./Icons/DeleteIcon";
import UpdateIcon from "./Icons/UpdateIcon";
import VerifiedUserIcon from "./Icons/VerifiedUserIcon";
import UserForm from "./UserForm";
import AuthContext from "@/contexts/AuthContext";
import axios from "axios";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import ConfirmationDialog from "./Dialogs/ConfirmationDialog";
import Toast from "./Dialogs/Toast";
import AddUserIcon from "./Icons/AddUserIcon";
import UnverifiedUser from "./Icons/UnverifiedUser";
import Search from "./Search";

const TableViewUsers = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  //!this state is for the currect authenticated user witch is the admin in this case
  const { user } = useContext(AuthContext);
  //!the user means the user from the list of users in the table
  const [Users, setUsers] = useState(null);
  const [AllUsers, setAllUsers] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [UserToUpdate, setUserToUpdate] = useState(null);
  const [idUserToDelete, setidUserToDelete] = useState(null);
  const [confirmDeleteUser, setConfirmDelete] = useState(false);
  //the code the toast message part
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isError, setIsError] = useState(false);
  // for search
  const [searchWord, setsearchWord] = useState("");
  const [startSearch, setStartSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userFilter, setUserFilter] = useState({
    role: "All",
    isSubscribed: "All",
  });

  const formatDateTime = (dateTimeString) => {
    const dateParts = dateTimeString.split(/[-T:Z]/); // Split the date string
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    const hour = dateParts[3]; //why the hour is send from the backend with -1 maybe serialization
    const minute = dateParts[4];

    // Construct the formatted date string
    const formattedDate = `${year}-${month}-${day} ${hour}:${minute}`;

    return formattedDate;
  };

  function handleUpdateUser(UserToUpdate) {
    console.log(UserToUpdate);
    setUserToUpdate(UserToUpdate);
    setOpenForm(true);
  }

  function handleAddUser() {
    setUserToUpdate(null);
    setOpenForm(true);
  }

  function fetchAllUsers() {
    // Retrieve the Users for the user
    axios
      .get(`${baseUrl}/api/users`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setUsers(response.data);
        setAllUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Users:", error);
      });
  }
  useEffect(() => {
    if (!user || !user?.admin) {
      //virify this later
      router.push("/auth");
      return;
    } else {
      fetchAllUsers();
    }
  }, [user]);

  const handleOpenModal = () => {
    document.getElementById("modelConfirm").style.display = "block";
    document.getElementsByTagName("body")[0].classList.add("overflow-y-hidden");
  };

  function handleDeleteUser(id) {
    console.log("handleDeleteUser function starts");
    // Display confirmation dialog before deleting
    // Here you can implement your confirmation dialog logic
    // For example:
    // setOpenConfirmationDialog(true); // Show confirmation dialog
    // When confirmed, proceed with deletion

    // Proceeding with deletion without confirmation dialog for now
    axios
      .delete(`${baseUrl}/api/users/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 204 || response.status === 200) {
          console.log("User deleted successfully");
          setToastMsg("User deleted successfully");
          setShowToast(true);

          // Fetch Users again after deletion
          fetchAllUsers();
        } else {
          console.error("Unexpected response while deleting User:", response);
        }
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error(
            "Error deleting User. Server responded with status code:",
            error.response.status
          );
        } else if (error.request) {
          // The request was made but no response was received
          console.error(
            "Error deleting User. No response received from server."
          );
        } else {
          // Something happened in setting up the request that triggered an error
          console.error("Error deleting User:", error.message);
        }
      });
  }

  function startHandleDeleteUser(User) {
    setidUserToDelete(User.id);
    handleOpenModal();
  }

  useEffect(() => {
    console.log("the use effect is starting for delete User ...");
    if (confirmDeleteUser === true && idUserToDelete != null) {
      console.log(confirmDeleteUser);
      console.log("not to delete is : " + idUserToDelete);
      handleDeleteUser(idUserToDelete);
    }
    setConfirmDelete(false);
    setidUserToDelete(null);
  }, [confirmDeleteUser]);

  // code for searching users
  const searchUsers = async (keyword) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/api/users/search?keyword=${keyword}`,
        {
          withCredentials: true,
        }
      );
      return response.data; // Assuming your API returns the list of users
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error; // Re-throwing the error for handling at the caller's end
    }
  };

  // Trigger search when startSearch changes
  useEffect(() => {
    console.log("it should try to start search");
    if (!startSearch) {
      return; // Do nothing if startSearch is false
    }

    if (!searchWord) {
      setIsError(true);
      setToastMsg("Please enter a keyword and try again");
      setShowToast(true);
      setStartSearch(false);
      return;
    }

    // Fetch users based on searchWord
    searchUsers(searchWord)
      .then((users) => {
        console.log("Fetched users:", users);
        if (users.length > 0) {
          setUsers(users);
          setAllUsers(users);
          setToastMsg(
            `${users.length} users have been found for the keyword 💦🔎${searchWord}🔎💦.`
          );
          setShowToast(true);
        } else {
          setToastMsg("No users found for the given keyword");
          setShowToast(true);
        }
        // Reset startSearch after fetching users
        console.log("the search closed for now.");
      })
      .catch((error) => {
        console.error("Failed to fetch users:", error);
        // Handle error gracefully, e.g., display an error message to the user
        if (error.response?.data) {
          setIsError(true);
          setToastMsg(error.response.data);
          setShowToast(true);
        }
      })
      .finally(() => {
        setIsLoading(false);
        setStartSearch(false);
      });
  }, [startSearch]); // Run this effect whenever startSearch changes

  useEffect(() => {
    if (!AllUsers) {
      return;
    }

    const filteredUsers = AllUsers.filter((user) => {
      const isAdminMatch =
        userFilter.role === "All" ||
        (user.admin && userFilter.role === "admin") ||
        (!user.admin && userFilter.role === "client");

      // Check if isSubscribed filter is set to "All" or matches the user's subscription status
      const isSubscribedMatch =
        userFilter.isSubscribed === "All" ||
        (user.subscribed && userFilter.isSubscribed === "subscribed") ||
        (!user.subscribed && userFilter.isSubscribed === "unsubscribed");

      // Return true if both isAdminMatch and isSubscribedMatch are true
      return isAdminMatch && isSubscribedMatch;
    });

    // Now filteredUsers contains the filtered list of users based on the userFilter criteria
    console.log(filteredUsers);
    setUsers(filteredUsers);
  }, [AllUsers, userFilter]);

  return (
    <div>
      <ConfirmationDialog
        message={"Are you sure you want to delete this user?"}
        setConfirmDelete={setConfirmDelete}
      />
      <Toast
        setShowToast={setShowToast}
        showToast={showToast}
        toastMsg={toastMsg}
        isError={isError}
        setIsError={setIsError}
      />
      <div className="p-5 min-h-screen bg-gray-100">
        <div className="flex items-end justify-between">
          <div className="flex items-center">
            <h1 className="text-xl mb-2">List users</h1>
            <div
              className="border-slate-500 border m-1"
              onClick={(e) => {
                handleAddUser();
              }}
            >
              <AddUserIcon />
            </div>
          </div>
          <div className="mb-2 mr-1">
            <Search
              searchWord={searchWord}
              setsearchWord={setsearchWord}
              showSelect={true}
              placeholderText={"Search users ..."}
              setStartSearch={setStartSearch}
              isLoading={isLoading}
              userFilter={userFilter}
              setUserFilter={setUserFilter}
            />
          </div>
        </div>
        <UserForm
          openForm={openForm}
          setOpenForm={setOpenForm}
          userToUpdate={UserToUpdate}
          fetchAllUsers={fetchAllUsers}
          userId={user?.id}
          // for toast
          setShowToast={setShowToast}
          showToast={showToast}
          toastMsg={toastMsg}
          setToastMsg={setToastMsg}
          isError={isError}
          setIsError={setIsError}
        />
        {/* for large screen we use this */}
        <div className="overflow-auto rounded-lg shadow hidden md:block">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                  Full name
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-left">
                  Email
                </th>
                <th className="w-24 p-3  text-sm font-semibold tracking-wide text-center">
                  Role
                </th>
                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                  Verified
                </th>
                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                  Created At
                </th>
                <th className="w-16 p-3 text-sm font-semibold tracking-wide text-left">
                  Edit
                </th>
                <th className="w-16 p-3 text-sm font-semibold tracking-wide text-left">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Users && Users?.map((user) => (
                <tr className="bg-white" key={user?.id}>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    <a
                      href="#"
                      className="font-bold text-blue-500 hover:underline"
                    >
                      {user?.fullName}
                    </a>
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {user?.email}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {user?.admin ? (
                      <span className="p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">
                        Admin
                      </span>
                    ) : (
                      <span className="p-1.5 text-xs font-medium uppercase tracking-wider text-orange-800 bg-orange-200 rounded-lg bg-opacity-50">
                        client
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-sm text-gray-700  whitespace-nowrap">
                    {/* <span className="p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50"> */}
                    {user?.subscribed ? (
                      <VerifiedUserIcon />
                    ) : (
                      <UnverifiedUser />
                    )}
                    {/* </span> */}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {formatDateTime(user?.createdAt)}
                  </td>
                  <td className="p-3 text-sm  text-gray-700 whitespace-nowrap">
                    <div onClick={(e) => handleUpdateUser(user)}>
                      <UpdateIcon />
                    </div>
                  </td>
                  <td className="p-3 text-sm flex justify-center  text-gray-700 whitespace-nowrap">
                    <div
                      onClick={(e) => {
                        startHandleDeleteUser(user);
                      }}
                    >
                      <DeleteIcon />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* for the midiam screen we use this  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {Users && Users?.map((user) => (
            <div key={user?.id}>
              <div className="bg-white space-y-3 p-4 rounded-lg shadow">
                <div className="flex items-center space-x-2 text-sm">
                  <div>
                    <a
                      href="#"
                      className="text-blue-500 font-bold hover:underline"
                    >
                      {user?.fullName}
                    </a>
                  </div>
                  <div className="text-gray-500">
                    {formatDateTime(user?.createdAt)}
                  </div>
                  <div onClick={(e) => handleUpdateUser(user)}>
                    <UpdateIcon />
                  </div>
                </div>
                <div className="text-sm text-gray-700 flex">
                  {user?.email}
                  {user?.admin ? (
                    <span className="p-1.5 ml-1 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">
                      Admin
                    </span>
                  ) : (
                    <span className="p-1.5 ml-1 text-xs font-medium uppercase tracking-wider text-orange-800 bg-orange-200 rounded-lg bg-opacity-50">
                      client
                    </span>
                  )}
                  {user?.subscribed ? <VerifiedUserIcon /> : <UnverifiedUser />}
                </div>
                <div className="text-sm font-medium text-black">
                  <div
                    onClick={(e) => {
                      startHandleDeleteUser(user);
                    }}
                  >
                    <DeleteIcon />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableViewUsers;
