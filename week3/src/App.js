import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Email: ${email}, Password: ${password}`);
  };

  return (
    <div className="container">
      <h1>너 T야?</h1>
      <form onSubmit={handleSubmit}>
        <label>
          이메일:
          <input type="email" value={email} onChange={handleEmailChange} />
        </label>
        <label>
          비밀번호:
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </label>
        <button type="submit">로그인</button>
      </form>
      <button className="register-btn">회원 가입</button>
    </div>
  );
};

export default App;
