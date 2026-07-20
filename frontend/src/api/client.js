const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

class ApiClientError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new ApiClientError(
      "Couldn't reach the server. Check your connection and try again.",
      0,
      "NETWORK_ERROR"
    );
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    throw new ApiClientError(
      body?.error?.message || "Something went wrong.",
      res.status,
      body?.error?.code || "UNKNOWN"
    );
  }
  return body;
}

export const api = {
  createGroup: (name, members) =>
    request("/api/groups", { method: "POST", body: JSON.stringify({ name, members }) }),
  listGroups: () => request("/api/groups"),
  getGroup: (groupId) => request(`/api/groups/${groupId}`),
  addMember: (groupId, name) =>
    request(`/api/groups/${groupId}/members`, { method: "POST", body: JSON.stringify({ name }) }),
  listExpenses: (groupId) => request(`/api/expenses/group/${groupId}`),
  addExpense: (payload) => request("/api/expenses", { method: "POST", body: JSON.stringify(payload) }),
  deleteExpense: (expenseId) => request(`/api/expenses/${expenseId}`, { method: "DELETE" }),
  getSettlement: (groupId) => request(`/api/settlements/group/${groupId}`),
};

export { ApiClientError };
