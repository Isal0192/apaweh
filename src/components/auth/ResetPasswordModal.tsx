'use client';

import React, { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { ShieldAlert } from 'lucide-react';
import { resetUserPassword } from '../../app/actions';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !newPassword || !confirmPassword) {
      setError('Lengkapi semua kolom.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Password baru dan konfirmasi tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetUserPassword(username, newPassword);
      if (res.success) {
        setSuccess('Password berhasil direset. Silakan login kembali.');
        setUsername('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(res.error || 'Gagal mereset password.');
      }
    } catch {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Reset Password">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg">
            {success}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
            Username
          </label>
          <input
            type="text"
            required
            disabled={loading}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
            Password Baru
          </label>
          <input
            type="password"
            required
            disabled={loading}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
            Konfirmasi Password Baru
          </label>
          <input
            type="password"
            required
            disabled={loading}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        <div className="text-[11px] text-muted-foreground bg-muted p-2.5 rounded-lg">
          Fitur ini hanya mengubah password berdasarkan username. Pastikan Anda memiliki akses akun yang valid.
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" type="button" onClick={onClose} size="sm" disabled={loading}>
            Tutup
          </Button>
          <Button variant="primary" type="submit" size="sm" disabled={loading}>
            {loading ? 'Memproses...' : 'Reset Password'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
