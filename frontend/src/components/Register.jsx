import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register({ setIsLoggedIn, setUsername }) {
  const [registerName, setRegisterName] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Здесь можно добавить реальную регистрацию
    setIsLoggedIn(true);
    setUsername(registerName);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate("/");
    }, 0);
  };

  return (
    <div className="max-w-sm mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-bold mb-4">Регистрация</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Имя пользователя"
          value={registerName}
          onChange={(e) => setRegisterName(e.target.value)}
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
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Зарегистрироваться</button>
      </form>

      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          Регистрация успешна!
        </div>
      )}
    </div>
  );
}
