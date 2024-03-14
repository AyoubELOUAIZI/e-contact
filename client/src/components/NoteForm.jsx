import React, { useEffect, useState } from "react";
import axios from "axios";
import CloseIcon from "./Icons/CloseIcon";

const NoteForm = ({
  openForm,
  setOpenForm,
  noteToUpdate,
  fetchNotes,
  userId,
  // for toast
  showToast,
  setShowToast,
  toastMsg,
  setToastMsg,
  isError,
  setIsError,
}) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    // Update subject and body state when noteToUpdate changes
    if (noteToUpdate) {
      setSubject(noteToUpdate.subject);
      setBody(noteToUpdate.body);
    } else {
      // Reset subject and body when noteToUpdate is null (for adding new note)
      setSubject("");
      setBody("");
    }
  }, [noteToUpdate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const noteData = {
      idNote: noteToUpdate ? noteToUpdate.idNote : 0,
      subject: subject,
      body: body,
      ownerId: userId,
    };

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      console.log("🚀 ~ handleSubmit ~ baseUrl:", baseUrl);
      if (!baseUrl) {
        console.error("Base URL not defined in .env file");
        return;
      }
      let res;
      if (noteToUpdate) {
        res = await axios.put(`${baseUrl}/api/notes`, noteData, {
          withCredentials: true,
        });
        if (res.status >= 200 && res.status < 300) {
          // Request successful
          fetchNotes(); // Assuming fetchNotes is a function to reload notes
          console.log("note updated successfuly:", res.data);
          setToastMsg("note updated successfuly");
        } else {
          // Request failed
          console.error("Request failed:", res.statusText);

          setIsError(true);
          setToastMsg("Error to add new note");
        }
      } else {
        res = await axios.post(`${baseUrl}/api/notes`, noteData, {
          withCredentials: true,
        });
        if (res.status >= 200 && res.status < 300) {
          // Request successful
          fetchNotes(); // Assuming fetchNotes is a function to reload notes
          console.log("new note add successfuly:", res.data);
          setToastMsg("new note add successfuly");
        } else {
          // Request failed
          console.error("Request failed:", res.statusText);

          setIsError(true);
          setToastMsg("Error to add new note");
        }
      }
      setShowToast(true);
      console.log("res");
      console.log(res);

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
              <div className="absolute inset-0 bg-gray-500 opacity-20"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
              {/*-------------------------  */}
              <form onSubmit={handleSubmit} className="max-w-lg mx-auto pb-5">
                <div className="mb-5">
                  <label
                    htmlFor="subject"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your note subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter note subject..."
                    value={subject}
                    onChange={(e) => {
                      if (e.target.value.length <= 30) {
                        setSubject(e.target.value);
                      } else {
                        setIsError(true);
                        setToastMsg(
                          "The maximum number of characters of note subject is 30."
                        );
                        setShowToast(true);
                      }
                    }}
                    required
                  />
                  <p className="flex justify-end text-sm text-gray-900 dark:text-white">
                    {subject.length}/30
                  </p>
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="body"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your note body
                  </label>
                  <textarea
                    id="body"
                    rows="8"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter note body..."
                    value={body}
                    onChange={(e) => {
                      if (e.target.value.length <= 400) {
                        setBody(e.target.value);
                      } else {
                        console.log("kdsjfkd");
                        setIsError(true);
                        setToastMsg(
                          "The maximum number of characters of note body is 400."
                        );
                        setShowToast(true);
                      }
                    }}
                    required
                  ></textarea>
                  <p className="flex justify-end text-sm text-gray-900 dark:text-white">
                    {body.length}/400
                  </p>
                </div>
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    {noteToUpdate ? "Update" : "Submit"}
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

export default NoteForm;
