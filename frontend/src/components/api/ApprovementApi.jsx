const API_URL = "http://localhost:8080";

export async function fetchApprovements() {
  const res = await fetch(`${API_URL}/processed`);

  return res.json();
}

// export async function updateApprovement(id, newText) {
//   const res = await fetch(`${API_URL}/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ outputText: newText }),
//   });

//   if (!res.ok) {
//     throw new Error("Ошибка при обновлении ответа");
//   }

//   return res.json();
// }

export async function updateApprovement(id, newText) {
  console.log("Mock updateApprovement called:", { id, newText });

  // имитация сетевого запроса
  await new Promise((resolve) => setTimeout(resolve, 100));

  // всегда возвращаем успех
  return { success: true };
}
