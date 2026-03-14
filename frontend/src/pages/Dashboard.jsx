import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Check, X, Trash2 } from "lucide-react";
import apiClient from "../api/client";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "PENDING",
  });
  const [notification, setNotification] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const showNotification = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification({ type: "", text: "" }), 3000);
  };

  const fetchTasks = async () => {
    try {
      const { data } = await apiClient.get("/tasks");
      setTasks(data);
    } catch (err) {
      showNotification("error", "Failed to sync registry.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/tasks", form);
      showNotification("success", "Task deployed successfully.");
      setForm({ title: "", description: "", status: "PENDING" });
      fetchTasks();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || "Deployment failed.",
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/tasks/${id}`);
      showNotification("success", "Task eradicated.");
      fetchTasks();
    } catch (err) {
      showNotification("error", "Failed to delete task.");
    }
  };

  const handleStatusToggle = async (task) => {
    try {
      const newStatus = task.status === "PENDING" ? "COMPLETED" : "PENDING";
      await apiClient.put(`/tasks/${task._id}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      showNotification("error", "Status update failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-end border-b-4 border-black pb-6 mb-10">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
            Command Center
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest mt-2 text-gray-500">
            Task Registry
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 font-bold uppercase tracking-wider hover:bg-black hover:text-white border-2 border-black px-4 py-2 transition-colors"
        >
          <LogOut size={16} /> Disconnect
        </button>
      </header>

      {/* Notifications */}
      {notification.text && (
        <div
          className={`fixed top-6 right-6 z-50 p-4 border-2 border-black font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${notification.type === "error" ? "bg-red-400 text-black" : "bg-green-400 text-black"}`}
        >
          {notification.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-6">
            <h2 className="text-xl font-black uppercase tracking-widest border-b-2 border-black pb-4 mb-6">
              Initialize Task
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                  Nomenclature
                </label>
                <input
                  type="text"
                  className="w-full border-2 border-black p-3 focus:outline-none focus:bg-yellow-50 transition-colors"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                  Parameters
                </label>
                <textarea
                  className="w-full border-2 border-black p-3 focus:outline-none focus:bg-yellow-50 transition-colors h-32 resize-none"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white font-bold uppercase tracking-widest py-4 border-2 border-black hover:bg-white hover:text-black active:translate-y-1 active:shadow-none transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-4"
              >
                Execute
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-6">
          {tasks.length === 0 ? (
            <div className="border-4 border-dashed border-black p-12 text-center">
              <p className="font-black uppercase tracking-widest text-xl">
                Registry Empty
              </p>
              <p className="text-sm font-bold uppercase text-gray-500 mt-2">
                Initialize a task to begin
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white border-2 border-black p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform"
              >
                <div className="flex-1">
                  <div className="flex flex-col gap-1 mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 text-[10px] font-black uppercase border-2 border-black ${task.status === "COMPLETED" ? "bg-green-400" : "bg-yellow-400"}`}
                      >
                        {task.status}
                      </span>
                      {task.user?.email && (
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        {task.user.email}eskfh
                        </span>
                      )}
                    </div>
                    <h3
                      className={`text-2xl font-black uppercase tracking-tight mt-1 ${task.status === "COMPLETED" ? "line-through text-gray-400" : ""}`}
                    >
                      {task.title}
                    </h3>
                  </div>
                  {task.description && (
                    <p className="text-sm font-medium text-gray-600 border-l-2 border-black pl-4 py-1 mt-2">
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 sm:flex-col">
                  <button
                    onClick={() => handleStatusToggle(task)}
                    className="p-3 border-2 border-black hover:bg-black hover:text-white transition-colors flex items-center justify-center bg-white"
                    title="Toggle Status"
                  >
                    {task.status === "COMPLETED" ? (
                      <X size={20} />
                    ) : (
                      <Check size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="p-3 border-2 border-black bg-red-400 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center text-black"
                    title="Eradicate"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
