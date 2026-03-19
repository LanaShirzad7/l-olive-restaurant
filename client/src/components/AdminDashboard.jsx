/* eslint-disable react-hooks/immutability */
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
      const res = await fetch(`${API_BASE_URL}/api/reservations/all`);

      const contentType = res.headers.get("content-type");
      if (
        !res.ok ||
        !contentType ||
        !contentType.includes("application/json")
      ) {
        throw new Error(
          "The Sanctuary server is currently waking up. Please refresh in a moment.",
        );
      }

      const data = await res.json();
      setReservations(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      console.log("No user found in localStorage, redirecting to login.");
      navigate("/auth");
      return;
    }

    const user = JSON.parse(storedUser);

    if (!user.isAdmin) {
      console.warn("User is not an admin. Redirecting to Home.");
      navigate("/");
    } else {
      fetchReservations();
    }
  }, [navigate]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reservations/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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
      const res = await fetch(`${API_BASE_URL}/api/reservations/${id}`, {
        method: "DELETE",
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
    <div className="min-h-screen pt-32 pb-20 px-6 font-serif bg-gradient-to-b from-[#71824F]/20 to-[#FDFCF0]">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-sm italic rounded-sm text-center">
            {error}
          </div>
        )}

        {/* HEADER */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-sand pb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-earth-medium mb-2 font-sans font-bold">
              Admin Panel
            </p>
            <h1 className="text-6xl text-earth-dark italic leading-tight">
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
              className="bg-earth-dark text-white px-6 py-3 text-[10px] uppercase tracking-widest cursor-pointer hover:bg-earth-medium transition-colors border-none"
            >
              Print Manifest
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white/40 backdrop-blur-md border border-sand shadow-xl rounded-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
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
                  {/* 🎯 ALIGNMENT FIX: Added align-middle */}
                  <td className="p-6 align-middle">
                    <p className="font-bold text-earth-dark italic">
                      {res.userName || "Guest"}
                    </p>
                    <p className="text-[11px] font-sans text-earth-medium">
                      {res.userEmail}
                    </p>
                  </td>

                  {/* 🎯 ALIGNMENT FIX: Added align-middle */}
                  <td className="p-6 align-middle">
                    <p className="text-earth-dark font-sans font-bold text-sm">
                      {res.date}
                    </p>
                    <p className="text-xs text-gray-400 italic">{res.time}</p>
                  </td>

                  {/* 🎯 ALIGNMENT FIX: Added align-middle and fixed the empty area box bug */}
                  <td className="p-6 align-middle">
                    {res.area && (
                      <span className="text-[10px] uppercase font-bold text-earth-medium bg-sand/30 px-2 py-1 inline-block mb-1">
                        {res.area}
                      </span>
                    )}
                    <p className="text-sm font-sans font-bold text-earth-dark">
                      {res.guests} Guests
                    </p>
                  </td>

                  {/* 🎯 ALIGNMENT FIX: Added align-middle */}
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

                  {/* 🎯 ALIGNMENT FIX: Added align-middle */}
                  <td className="p-6 text-right align-middle print:hidden">
                    <div className="flex justify-end items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => updateStatus(res._id, "confirmed")}
                        className="bg-earth-dark text-white px-4 py-2 text-[10px] uppercase font-bold cursor-pointer border-none"
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
