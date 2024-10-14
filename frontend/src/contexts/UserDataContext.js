import { createContext } from "react";

const data = {
  userData: null,
  setUserData: null,
};

const UserDataContext = createContext(data);

export default UserDataContext;
