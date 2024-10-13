import { createContext } from "react";
import { Dispatch } from "react";

const data = {
  userData: null,
  setUserData: null,
};

const UserDataContext = createContext(data);

export default UserDataContext;
