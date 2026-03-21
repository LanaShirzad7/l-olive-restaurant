/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

  const fetchReservations = async () => {
    try {
      // 🎯 SECURE: Using sessionStorage
      const token = sessionStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/reservations/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401 || res.status === 403) {
        throw new Error("Unauthorized Access. Please log in again.");
      }

      const contentType = res.headers.get("content-type");
      if (
        !res.ok ||
        !contentType ||
        !contentType.includes("application/json")
      ) {
        throw new Error("Could not connect to the Sanctuary server.");
      }

      const data = await res.json();
      setReservations(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.message === "Failed to fetch"
          ? "Connection Refused: Is your backend server running on port 5005?"
          : err.message,
      );
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 🎯 SECURE: Using sessionStorage
    const storedUser = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/auth");
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.email !== "lana.shirzad@gmail.com") {
      navigate("/");
    } else {
      fetchReservations();
    }
  }, [navigate]);

  const updateStatus = async (id, status) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/reservations/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        fetchReservations();
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const deleteReservation = async (id, date) => {
    if (!window.confirm(`Purge reservation for ${date}?`)) return;

    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/reservations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setReservations((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const stats = {
    total: reservations.length,
    pending: reservations.filter((r) => r.status === "pending" || !r.status)
      .length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center italic text-earth-dark font-serif text-xl">
        Accessing Sanctuary Records...
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 font-serif bg-linear-to-b from-[#71824F]/20 to-[#FDFCF0]">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 p-6 bg-white border-l-4 border-red-600 shadow-md text-red-800 rounded-sm flex items-center gap-4">
            <i className="fas fa-exclamation-triangle"></i>
            <div>
              <p className="font-bold uppercase text-[10px] tracking-widest">
                System Error
              </p>
              <p className="italic text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-sand pb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-earth-medium mb-2 font-sans font-bold">
              Admin Panel
            </p>
            <h1 className="text-4xl md:text-6xl text-earth-dark italic leading-tight">
              Manifest
            </h1>
          </div>

          <div className="flex gap-8 items-end print:hidden">
            <div className="text-center">
              <p className="text-[9px] uppercase tracking-widest text-gray-400 font-sans font-bold mb-1">
                Total
              </p>
              <p className="text-2xl text-earth-dark font-sans">
                {stats.total}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[9px] uppercase tracking-widest text-gray-400 font-sans font-bold mb-1">
                Pending
              </p>
              <p className="text-2xl text-earth-medium animate-pulse font-sans">
                {stats.pending}
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="bg-earth-dark text-white px-6 py-3 text-[10px] uppercase tracking-widest cursor-pointer hover:bg-earth-medium transition-colors border-none hidden md:block"
            >
              Print Manifest
            </button>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-md border border-sand shadow-xl rounded-sm overflow-x-auto">
          <table className="w-full min-w-225 text-left border-collapse">
            <thead>
              <tr className="bg-earth-dark text-white uppercase text-[10px] tracking-[0.3em] font-sans">
                <th className="p-6">Guest</th>
                <th className="p-6">Booking</th>
                <th className="p-6">Area</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right print:hidden">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/50">
              {reservations.map((res) => (
                <tr
                  key={res._id}
                  className="hover:bg-white/60 transition-colors group"
                >
                  <td className="p-6 align-middle">
                    <p className="font-bold text-earth-dark italic">
                      {res.userName || "Guest"}
                    </p>
                    <p className="text-[11px] font-sans text-earth-medium">
                      {res.userEmail}
                    </p>
                  </td>
                  <td className="p-6 align-middle">
                    <p className="text-earth-dark font-sans font-bold text-sm">
                      {res.date}
                    </p>
                    <p className="text-xs text-gray-400 italic">{res.time}</p>
                  </td>
                  <td className="p-6 align-middle">
                    <span className="text-[10px] uppercase font-bold text-earth-medium bg-sand/30 px-2 py-1 inline-block mb-1">
                      {res.area || "Main Sanctuary"}
                    </span>
                    <p className="text-sm font-sans font-bold text-earth-dark">
                      {res.guests} Guests
                    </p>
                  </td>
                  <td className="p-6 align-middle">
                    <span
                      className={`px-3 py-1 text-[9px] font-bold uppercase rounded-full inline-block ${
                        res.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : res.status === "declined"
                            ? "bg-red-100 text-red-800"
                            : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {res.status || "Pending"}
                    </span>
                  </td>
                  <td className="p-6 text-right align-middle print:hidden">
                    <div className="flex justify-end items-center gap-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => updateStatus(res._id, "confirmed")}
                        className="bg-earth-dark text-white px-4 py-2 text-[10px] uppercase font-bold cursor-pointer border-none shadow-md"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(res._id, "declined")}
                        className="bg-transparent border border-red-800/30 text-red-800 px-4 py-2 text-[10px] uppercase font-bold cursor-pointer"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => deleteReservation(res._id, res.date)}
                        className="text-gray-300 hover:text-red-600 cursor-pointer bg-transparent border-none p-2"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reservations.length === 0 && !error && (
            <div className="py-20 text-center italic text-gray-400">
              No records in the manifest.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
