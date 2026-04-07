export function getHistory() {
  return JSON.parse(localStorage.getItem("leaveHistory")) || [];
}

export function saveHistory(data) {
  const history = getHistory();
  history.push(data);
  localStorage.setItem("leaveHistory", JSON.stringify(history));
}
