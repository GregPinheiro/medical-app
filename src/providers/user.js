import React, { createContext, useEffect, useState } from "react";

const initialValues = {
  auth: false,
  name: "",
  token: "",
};
export const UserContext = createContext({});

export const UserProvider = (props) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const userStorage = sessionStorage.getItem("user");

    userStorage ? setUser(JSON.parse(userStorage)) : setUser(initialValues);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
};
