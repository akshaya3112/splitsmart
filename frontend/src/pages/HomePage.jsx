import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Receipt, ArrowRight } from "lucide-react";
import CreateGroupModal from "../components/CreateGroupModal";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto px-8 py-24 text-center animate-slide-up">
      <div className="w-16 h-16 rounded-2xl bg-settle-bg flex items-center justify-center mx-auto mb-6">
        <Receipt size={28} className="text-settle-dim" strokeWidth={1.75} />
      </div>
      <h1 className="font-display font-bold text-3xl text-ink tracking-tight">
        Settle up in fewer transactions
      </h1>
      <p className="text-ink/50 mt-3 leading-relaxed">
        Split hostel and roommate expenses, then let SplitSmart work out the smallest
        possible set of payments to zero every balance in the group.
      </p>
      <button
        onClick={() => setShowModal(true)}
        className="mt-8 inline-flex items-center gap-2 bg-ink text-white rounded-xl px-6 py-3 text-sm font-semibold hover:bg-ink-soft transition shadow-card"
      >
        Create your first group <ArrowRight size={15} />
      </button>

      {showModal && (
        <CreateGroupModal onClose={() => setShowModal(false)} onCreated={(id) => navigate(`/groups/${id}`)} />
      )}
    </div>
  );
}
