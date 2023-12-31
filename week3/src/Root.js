import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Mainpage from "./Mainpage";
import Test from "./Test";
import Board from "./Board";
import Questions from "./Questions";
import Profile from "./Profile";
import Signup from "./Signup";
import { UserDataProvider } from "./UserDataContext";

const Root = () => {
  return (
    <UserDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/mainpage" element={<Mainpage />} />
          <Route path="/test" element={<Test />} />
          <Route path="/board" element={<Board />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </UserDataProvider>
  );
};

export default Root;
