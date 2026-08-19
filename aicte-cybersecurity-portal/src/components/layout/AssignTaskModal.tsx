import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { UserCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AssignTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetEntity: string;
  issueDescription: string;
  onAssigned: (technician: string, team: string) => void;
}

export const AssignTaskModal: React.FC<AssignTaskModalProps> = ({
  isOpen,
  onClose,
  targetEntity,
  issueDescription,
  onAssigned,
}) => {
  const [selectedTech, setSelectedTech] = useState('Vikram Patel (Network Operations)');
  const [selectedTeam, setSelectedTeam] = useState('Infrastructure Team');
  const [priority, setPriority] = useState('Critical');
  const [notes, setNotes] = useState('Investigate high CPU spike and check container resource limits.');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onAssigned(selectedTech, selectedTeam);
      setSubmitted(false);
      onClose();
    }, 800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Technician Dispatch"
      subtitle={`Create and dispatch an operational ticket for ${targetEntity}`}
      maxWidth="max-w-lg"
    >
      {submitted ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">Task Successfully Assigned!</h4>
          <p className="text-xs text-slate-400">
            Dispatched to <span className="text-cyan-300 font-semibold">{selectedTech}</span>. Notification sent to ITSM platform.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
              <ShieldAlert className="w-3.5 h-3.5" /> Target: {targetEntity}
            </div>
            <p className="text-xs text-slate-300">{issueDescription}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Assigned Team
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="Infrastructure Team">Infrastructure Team (DCIM)</option>
              <option value="Cybersecurity SOC">Cybersecurity SOC Team</option>
              <option value="Network & Firewall Ops">Network & Firewall Ops</option>
              <option value="IT Asset & Licensing">IT Asset & Licensing Team</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Select Primary Technician
            </label>
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="Vikram Patel">Vikram Patel (Sr. Network Operations Tech)</option>
              <option value="Rahul Joshi">Rahul Joshi (Infrastructure Specialist)</option>
              <option value="Riya Shah">Riya Shah (Security Analyst)</option>
              <option value="Aarav Mehta">Aarav Mehta (Lead Administrator)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Dispatch Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Critical', 'High', 'Medium'].map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    priority === p
                      ? p === 'Critical'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                        : p === 'High'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                      : 'border-slate-800 text-slate-400 hover:bg-slate-850'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Action Instructions / Remediation Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              placeholder="Add specific instructions for the technician..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" icon={<UserCheck className="w-4 h-4" />}>
              Dispatch Technician
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
