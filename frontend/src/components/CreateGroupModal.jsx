import { useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import Modal from "./Modal";
import ErrorBanner from "./ErrorBanner";
import { api, ApiClientError } from "../api/client";

export default function CreateGroupModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [members, setMembers] = useState(["", ""]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateMember(idx, value) {
    setMembers((m) => m.map((v, i) => (i === idx ? value : v)));
  }
  function addMemberField() {
    setMembers((m) => [...m, ""]);
  }
  function removeMemberField(idx) {
    setMembers((m) => m.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const cleanMembers = members.map((m) => m.trim()).filter(Boolean);
    if (!name.trim()) return setError("Give your group a name.");
    if (cleanMembers.length < 2) return setError("Add at least 2 members to split expenses between.");

    setSubmitting(true);
    try {
      const { group } = await api.createGroup(name.trim(), cleanMembers);
      onCreated(group.id);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Couldn't create the group. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title="New group" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

        <div>
          <label className="text-xs font-medium text-ink/50 uppercase tracking-wide">Group name</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Hostel 4B"
            maxLength={80}
            className="mt-1.5 w-full rounded-xl border border-ink/10 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-settle/40 focus:border-settle"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-ink/50 uppercase tracking-wide">Members</label>
          <div className="mt-1.5 space-y-2">
            {members.map((m, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={m}
                  onChange={(e) => updateMember(idx, e.target.value)}
                  placeholder={`Member ${idx + 1}`}
                  maxLength={60}
                  className="flex-1 rounded-xl border border-ink/10 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-settle/40 focus:border-settle"
                />
                {members.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeMemberField(idx)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-ink/30 hover:text-owe hover:bg-owe-bg shrink-0"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addMemberField}
            className="mt-2 flex items-center gap-1.5 text-sm font-medium text-settle-dim hover:text-settle"
          >
            <Plus size={15} /> Add member
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-ink text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-ink-soft transition disabled:opacity-60"
        >
          {submitting && <Loader2 size={15} className="animate-spin" />}
          Create group
        </button>
      </form>
    </Modal>
  );
}
