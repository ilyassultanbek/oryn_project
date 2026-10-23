
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  ShieldCheck,
  LogOut,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";

import {
  updateProfile,
  changePassword,
} from "../../../services/profileService";

import { logoutUser } from "../../../services/authService";

function ProfileSettings({ user, onProfileUpdated }) {
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPasswords, setShowPasswords] = useState(false);

  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user?.name, user?.email]);

  async function handleProfileSubmit(event) {
    event.preventDefault();

    setProfileError("");
    setProfileMessage("");

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (
      normalizedName.length < 2 ||
      normalizedName.length > 100
    ) {
      setProfileError("Аты-жөні 2–100 таңба болуы керек.");
      return;
    }

    if (
      normalizedEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
      setProfileError("Email форматы дұрыс емес.");
      return;
    }

    setProfileSaving(true);

    try {
      await updateProfile({
        name: normalizedName,
        email: normalizedEmail,
      });

      await onProfileUpdated();

      setProfileMessage("Жеке мәліметтер сәтті жаңартылды.");
    } catch (error) {
      setProfileError(
        error.message || "Мәліметтерді сақтау мүмкін болмады."
      );
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();

    setPasswordError("");
    setPasswordMessage("");

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPasswordError("Барлық өрісті толтырыңыз.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Жаңа құпиясөздер сәйкес келмейді.");
      return;
    }

    if (
      newPassword.length < 8 ||
      !newPassword.trim() ||
      new TextEncoder().encode(newPassword).length > 72
    ) {
      setPasswordError(
        "Құпиясөз кемінде 8 таңба, ең көбі 72 UTF-8 байт болуы керек."
      );
      return;
    }

    setPasswordSaving(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordMessage("Құпиясөз сәтті өзгертілді.");
    } catch (error) {
      setPasswordError(
        error.message || "Құпиясөзді өзгерту мүмкін болмады."
      );
    } finally {
      setPasswordSaving(false);
    }
  }

  async function handleLogout() {
    setLogoutError("");
    setLoggingOut(true);

    try {
      await logoutUser();
      navigate("/login", { replace: true });
    } catch (error) {
      setLogoutError(
        error.message || "Жүйеден шығу мүмкін болмады."
      );
    } finally {
      setLoggingOut(false);
    }
  }

  const inputClass = `
    w-full rounded-xl border border-slate-200
    bg-white px-4 py-3 text-sm text-slate-900
    outline-none transition
    focus:border-emerald-500 focus:ring-2
    focus:ring-emerald-500/10
    dark:border-slate-700 dark:bg-slate-800
    dark:text-white
  `;

  const cardClass = `
    rounded-[22px] border border-slate-100
    bg-white p-6 shadow-sm
    dark:border-slate-700 dark:bg-slate-900
  `;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Аккаунт баптаулары
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Жеке мәліметтеріңіз бен аккаунт қауіпсіздігін басқарыңыз.
        </p>
      </div>

      {/* Personal information */}
      <section className={cardClass}>
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950">
            <UserRound size={21} />
          </div>

          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              Жеке ақпарат
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Аты-жөніңіз бен email мекенжайын өзгертіңіз.
            </p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="settings-name"
              className="mb-2 block text-sm font-medium"
            >
              Аты-жөні
            </label>

            <input
              id="settings-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={100}
              autoComplete="name"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="settings-email"
              className="mb-2 block text-sm font-medium"
            >
              Электрондық пошта
            </label>

            <input
              id="settings-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={254}
              autoComplete="email"
              required
              className={inputClass}
            />
          </div>

          {profileError && (
            <p role="alert" className="text-sm text-red-500">
              {profileError}
            </p>
          )}

          {profileMessage && (
            <p role="status" className="text-sm text-emerald-600">
              {profileMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={profileSaving}
            className="
              inline-flex items-center gap-2 rounded-xl
              bg-emerald-600 px-5 py-3 text-sm
              font-semibold text-white transition
              hover:bg-emerald-700 disabled:opacity-50
            "
          >
            <Save size={17} />
            {profileSaving ? "Сақталуда..." : "Өзгерістерді сақтау"}
          </button>
        </form>
      </section>

      {/* Password */}
      <section className={cardClass}>
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950">
            <ShieldCheck size={21} />
          </div>

          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              Құпиясөзді өзгерту
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Аккаунтыңызды қорғау үшін қауіпсіз құпиясөз қолданыңыз.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {[
            {
              id: "current-password",
              label: "Ағымдағы құпиясөз",
              value: currentPassword,
              setter: setCurrentPassword,
              autoComplete: "current-password",
            },
            {
              id: "new-password",
              label: "Жаңа құпиясөз",
              value: newPassword,
              setter: setNewPassword,
              autoComplete: "new-password",
            },
            {
              id: "confirm-password",
              label: "Жаңа құпиясөзді растау",
              value: confirmPassword,
              setter: setConfirmPassword,
              autoComplete: "new-password",
            },
          ].map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className="mb-2 block text-sm font-medium"
              >
                {field.label}
              </label>

              <input
                id={field.id}
                type={showPasswords ? "text" : "password"}
                value={field.value}
                onChange={(event) =>
                  field.setter(event.target.value)
                }
                autoComplete={field.autoComplete}
                required
                className={inputClass}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() => setShowPasswords((value) => !value)}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 dark:text-slate-400"
          >
            {showPasswords ? <EyeOff size={17} /> : <Eye size={17} />}
            {showPasswords ? "Құпиясөзді жасыру" : "Құпиясөзді көрсету"}
          </button>

          {passwordError && (
            <p role="alert" className="text-sm text-red-500">
              {passwordError}
            </p>
          )}

          {passwordMessage && (
            <p role="status" className="text-sm text-emerald-600">
              {passwordMessage}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={passwordSaving}
              className="
                inline-flex items-center gap-2 rounded-xl
                bg-emerald-600 px-5 py-3 text-sm
                font-semibold text-white transition
                hover:bg-emerald-700 disabled:opacity-50
              "
            >
              <ShieldCheck size={17} />
              {passwordSaving
                ? "Жаңартылуда..."
                : "Құпиясөзді жаңарту"}
            </button>
          </div>
        </form>
      </section>

      {/* Logout */}
      <section className={cardClass}>
        <h3 className="font-bold text-slate-900 dark:text-white">
          Аккаунттан шығу
        </h3>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Жүйеден шыққаннан кейін жеке кабинетке кіру үшін
          қайта авторизациядан өту қажет.
        </p>

        {logoutError && (
          <p role="alert" className="mt-3 text-sm text-red-500">
            {logoutError}
          </p>
        )}

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="
            mt-5 inline-flex items-center gap-2
            rounded-xl border border-red-200
            bg-red-50 px-5 py-3 text-sm
            font-semibold text-red-600 transition
            hover:bg-red-100 disabled:opacity-50
            dark:border-red-900 dark:bg-red-950/30
            dark:text-red-400
          "
        >
          <LogOut size={17} />
          {loggingOut ? "Шығуда..." : "Аккаунттан шығу"}
        </button>
      </section>
    </div>
  );
}

export default ProfileSettings;
