import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-white px-4">
      <h1 className="text-5xl font-extrabold text-blue-800 text-center mb-8">
        Анализ научных статей
      </h1>

      <div className="max-w-4xl w-full bg-white p-6 rounded-2xl shadow-lg space-y-6 text-lg text-gray-800">
        <p>
          Добро пожаловать в интеллектуальный сервис для анализа научных текстов. Здесь вы можете загружать документы в формате PDF и получать их краткое содержание с помощью современных языковых моделей.
        </p>

        <p>
          Вы можете сохранять документы в личное локальное хранилище или делиться ими через общую базу знаний. Все аннотации автоматически генерируются и упрощают процесс анализа больших текстов.
        </p>

        <p>
          Зарегистрируйтесь, чтобы получить доступ к расширенным возможностям: загрузка и просмотр документов, генерация аннотаций, добавление в базы и многое другое.
        </p>

        <div className="flex justify-end gap-4 pt-2">
          <button
            className="bg-blue-600 text-white px-6 py-3 text-lg font-medium rounded-xl shadow hover:bg-blue-700 transition"
            onClick={() => navigate("/register")}
          >
            Зарегистрироваться
          </button>
          <button
            className="bg-white text-blue-600 border border-blue-600 px-6 py-3 text-lg font-medium rounded-xl shadow hover:bg-blue-50 transition"
            onClick={() => navigate("/login")}
          >
            Войти
          </button>
        </div>
      </div>
    </div>
  );
}
