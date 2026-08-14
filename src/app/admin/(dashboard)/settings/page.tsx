import ChangePasswordForm from "./ChangePasswordForm";

export const metadata = { title: "Settings — Aval Designs Admin" };

export default function AdminSettingsPage() {
  return (
    <div className="px-8 py-8">
      <h1 className="font-display text-2xl font-medium text-charcoal-ink">Settings</h1>

      <div className="mt-8 max-w-md bg-ivory p-6">
        <h2 className="text-sm font-medium text-charcoal-ink">Change Password</h2>
        <p className="mt-1 text-xs text-charcoal-muted">
          Changing your password signs you out everywhere, including this
          device.
        </p>
        <div className="mt-5">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
