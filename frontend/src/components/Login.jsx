// Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsLoggedIn, setUsername }) {
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Здесь можно добавить валидацию или проверку
    setIsLoggedIn(true);
    setUsername(loginName);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate("/");
    }, 0);
  };

  return (
    <div className="max-w-sm mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-bold mb-4">Вход</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Имя пользователя"
          value={loginName}
          onChange={(e) => setLoginName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Войти</button>
      </form>

      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          Вход выполнен успешно!
        </div>
      )}
    </div>
  );
}
