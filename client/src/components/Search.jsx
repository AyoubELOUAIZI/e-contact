import React from "react";
import SpinerLoading from "./Icons/SpinerLoading";
const Search = ({
  searchWord,
  setsearchWord,
  showSelect,
  placeholderText,
  setStartSearch,
  isLoading,
  userFilter,
  setUserFilter
}) => {
  return (
    <div>
      <div class="flex flex-col md:flex-row gap-3">
        <div class="flex">
          <input
            value={searchWord}
            onChange={(e) => {
              setsearchWord(e.target.value);
            }}
            type="text"
            placeholder={placeholderText}
            class="w-full md:w-80 px-3 h-10 rounded-l border-2 border-sky-500 focus:outline-none focus:border-sky-500"
          />
          <button
            onClick={(e) => {
              setStartSearch(true);
            }}
            class=" flex justify-around items-center bg-sky-500 text-white hover:bg-sky-600 rounded-r px-2 md:px-3 py-0 md:py-1"
          >
            {isLoading && <SpinerLoading />}
            Search
          </button>
        </div>
        {showSelect && (
          <>
            <select
           onChange={(e) =>
            setUserFilter({ ...userFilter, role: e.target.value })
          }
              id="role"
              name="role"
              class="w-full h-10 border-2 border-sky-500 focus:outline-none focus:border-sky-500 text-sky-500 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
            >
              <option value="All" selected>
                All Roles
              </option>
              <option value="admin">Administrator</option>
              <option value="client">Client</option>
            </select>
            <select
             onChange={(e) =>
              setUserFilter({ ...userFilter, isSubscribed: e.target.value })
            }
              id="subscription"
              name="subscription"
              class="w-full h-10 border-2 border-sky-500 focus:outline-none focus:border-sky-500 text-sky-500 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
            >
              <option value="All" selected>
                All Subscriptions
              </option>
              <option value="subscribed">Subscribed</option>
              <option value="unsubscribed">Unsubscribed</option>
            </select>
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
