/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🎯 CHANGED BACK TO LOCALHOST
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reservations/all`);
      const data = await res.json();
      setReservations(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
      setReservations([]);
      setLoading(false);
    }
  };

  const sendNotificationToUser = (title, message) => {
    const existingNotes = JSON.parse(
      localStorage.getItem("notifications") || "[]",
    );
    const newNote = {
      title,
      message,
      date:
        new Date().toLocaleDateString() +
        " " +
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
    };
    localStorage.setItem(
      "notifications",
      JSON.stringify([newNote, ...existingNotes]),
    );
    window.dispatchEvent(new Event("update-notifications"));
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reservations/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchReservations();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const deleteReservation = async (id, date) => {
    const confirmed = window.confirm(
      "Purge this reservation? This action is permanent.",
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/reservations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReservations((prev) => prev.filter((r) => r._id !== id));
        sendNotificationToUser(
          "Sanctuary Update",
          `Your reservation for ${date} has been released back to our archives.`,
        );
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // 🎯 PRINT MANIFEST FUNCTION
  const handlePrintManifest = () => {
    window.print();
  };

  // 🎯 STATS CALCULATION
  const stats = {
    total: reservations.length,
    pending: reservations.filter((r) => r.status === "pending" || !r.status)
      .length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    declined: reservations.filter((r) => r.status === "declined").length,
  };

  if (loading)
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center italic text-earth-dark font-serif text-xl">
        Opening Console...
      </div>
    );

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 font-serif bg-gradient-to-b from-[#71824F]/20 to-[#FDFCF0]">
      <div className="max-w-7xl mx-auto">
        {/* --- HEADER & STATS --- */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-sand pb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-earth-medium mb-2 font-sans font-bold print:hidden">
              Admin Dashboard
            </p>
            <h1 className="text-6xl text-earth-dark italic leading-tight">
              Reservations
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-end">
            <div className="flex gap-8 print:hidden">
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
              <div className="text-center">
                <p className="text-[9px] uppercase tracking-widest text-gray-400 font-sans font-bold mb-1">
                  Confirmed
                </p>
                <p className="text-2xl text-earth-dark font-sans">
                  {stats.confirmed}
                </p>
              </div>
            </div>

            {/* 🎯 PRINT BUTTON */}
            <button
              onClick={handlePrintManifest}
              className="print:hidden bg-earth-dark text-cream px-6 py-3 text-[10px] uppercase tracking-widest cursor-pointer shadow-md hover:bg-earth-medium transition-colors border-none"
            >
              <i className="fas fa-print mr-2"></i> Print Nightly Manifest
            </button>
          </div>
        </div>

        {/* --- LIST --- */}
        <div className="bg-white/40 backdrop-blur-md border border-sand shadow-xl rounded-sm overflow-hidden print:shadow-none print:border-none print:bg-white print:backdrop-blur-none print:overflow-visible">
          {" "}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-earth-dark text-white uppercase text-[10px] tracking-[0.3em] font-sans print:bg-gray-200 print:text-black">
                <th className="p-6">Guest Details</th>
                <th className="p-6">Booking Info</th>
                <th className="p-6">Requests & Area</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right print:hidden">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/50 print:divide-gray-300">
              {reservations.map((res) => (
                <tr
                  key={res._id}
                  className="hover:bg-white/60 transition-colors group print:break-inside-avoid"
                >
                  <td className="p-6">
                    <p className="font-bold text-earth-dark text-lg italic print:text-black">
                      {res.userName || "Guest"}
                    </p>
                    <p className="text-[11px] font-sans text-earth-medium tracking-wider print:text-gray-600">
                      {res.userEmail}
                    </p>
                  </td>
                  <td className="p-6">
                    <p className="text-earth-dark font-sans font-bold text-sm uppercase print:text-black">
                      {res.date}
                    </p>
                    <p className="text-xs text-gray-500 italic mt-1">
                      {res.time}
                    </p>
                  </td>
                  <td className="p-6">
                    <span className="text-[10px] uppercase font-bold text-earth-medium tracking-widest bg-sand/30 px-2 py-1 print:border print:border-gray-300 print:bg-transparent">
                      {res.area || "Main Sanctuary"}
                    </span>
                    <p className="text-sm font-sans font-bold text-earth-dark mt-2 print:text-black">
                      {res.guests} Guests
                    </p>
                  </td>
                  <td className="p-6">
                    <span
                      className={`px-3 py-1 text-[9px] font-bold uppercase rounded-full print:border print:bg-transparent ${
                        res.status === "confirmed"
                          ? "bg-green-100 text-green-800 print:border-green-800"
                          : res.status === "declined"
                            ? "bg-red-100 text-red-800 print:border-red-800"
                            : "bg-orange-100 text-orange-800 print:border-orange-800"
                      }`}
                    >
                      {res.status || "Pending"}
                    </span>
                  </td>
                  <td className="p-6 text-right print:hidden">
                    <div className="flex justify-end items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => updateStatus(res._id, "confirmed")}
                        className="bg-earth-dark text-white px-5 py-2 text-[10px] uppercase font-bold cursor-pointer border-none"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(res._id, "declined")}
                        className="bg-transparent border border-red-800/30 text-red-800 px-5 py-2 text-[10px] uppercase font-bold cursor-pointer"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => deleteReservation(res._id, res.date)}
                        className="text-gray-300 hover:text-red-600 transition-colors bg-transparent border-none cursor-pointer p-2"
                      >
                        <i className="fas fa-trash-alt text-sm"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reservations.length === 0 && (
            <div className="py-20 text-center italic text-gray-400 font-serif">
              No records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
