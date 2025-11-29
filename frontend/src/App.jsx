import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { useState } from "react";
import UploadDocument from "./components/UploadDocument";
import KnowledgeBase from "./components/KnowledgeBase";
import HomePage from "./components/HomePage";
import Register from "./components/Register";
import Login from "./components/Login";
import LocalStorageFiles from "./components/LocalStorageFiles";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  return (
    <Router>
      <div>
        {/* Навигация */}
        <div className="fixed top-0 left-0 w-full bg-blue-600 z-50 flex items-center justify-between px-4 py-3">
          <nav className="flex gap-4">
            <NavLink to="/" className="text-white">Главная</NavLink>
            {isLoggedIn && (
              <NavLink to="/upload" className="text-white">Загрузка документа</NavLink>
            )}
            <NavLink to="/knowledge" className="text-white">База знаний</NavLink>
             {isLoggedIn && (
              <NavLink to="/storage" className="text-white">Локальное хранилище</NavLink>
            )}
          </nav>
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2 text-white">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>{username}</span>
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setUsername("");
                  }}
                  className="ml-2 bg-white-600 px-2 py-1 rounded text-white hover:bg-blue-700"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <NavLink to="/login" className="text-white">Войти</NavLink>
                <NavLink to="/register" className="text-white">Регистрация</NavLink>
              </div>
            )}
          </div>
        </div>

        {/* Контент */}
        <div className="pt-20 px-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {isLoggedIn && (
              <Route path="/upload" element={<UploadDocument />} />
            )}
            <Route path="/knowledge" element={<KnowledgeBase />} />
            <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />} />
            {isLoggedIn && (
              <Route path="/storage" element={<LocalStorageFiles />} />
            )}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
