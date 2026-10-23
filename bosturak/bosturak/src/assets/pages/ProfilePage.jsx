
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Bell } from "lucide-react";

// Hooks
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useMyReviews } from "../../hooks/useMyReviews";

// Components
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileOverview from "../components/profile/ProfileOverview";
import ProfileStats from "../components/profile/ProfileStats";
import ProfileReviews from "../components/profile/ProfileReviews";
import ProfileFavorites from "../components/profile/ProfileFavorites";
import ProfileSettings from "../components/profile/ProfileSettings";

const SECTION_TITLES = {
  overview: "Жеке кабинет",
  reviews: "Менің пікірлерім",
  favorites: "Таңдаулы тұрақтар",
  settings: "Аккаунт баптаулары",
};

function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const requestedSection = searchParams.get("section");

  const activeSection = Object.prototype.hasOwnProperty.call(
    SECTION_TITLES,
    requestedSection
  )
    ? requestedSection
    : "overview";

  function handleSectionChange(section) {
    if (!Object.prototype.hasOwnProperty.call(
      SECTION_TITLES,
      section
    )) {
      return;
    }

    setSearchParams(
      section === "overview" ? {} : { section }
    );
  }

  const {
    user,
    loading: userLoading,
    error: userError,
    refreshUser,
  } = useCurrentUser();

  const {
    reviews,
    loading: reviewsLoading,
    saving: reviewsSaving,
    error: reviewsError,
    refreshReviews,
    editReview,
    removeReview,
  } = useMyReviews();

  const reviewsProps = {
    reviews,
    loading: reviewsLoading,
    saving: reviewsSaving,
    error: reviewsError,
    onRefresh: refreshReviews,
    onEdit: editReview,
    onDelete: removeReview,
  };

  if (userLoading && !user) {
    return (
      <div
        role="status"
        className="
          flex min-h-screen items-center justify-center
          bg-[#f5f6f8] px-6 text-sm text-slate-500
          dark:bg-slate-950 dark:text-slate-300
        "
      >
        Профиль жүктелуде...
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="
          flex min-h-screen flex-col items-center
          justify-center gap-4 bg-[#f5f6f8]
          px-6 dark:bg-slate-950
        "
      >
        <p
          role="alert"
          className="text-center text-sm text-red-500"
        >
          {userError || "Пайдаланушы табылмады."}
        </p>

        <Link
          to="/login"
          className="
            rounded-xl bg-emerald-600 px-5 py-2.5
            text-sm font-semibold text-white
            transition hover:bg-emerald-700
          "
        >
          Кіру бетіне өту
        </Link>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen bg-[#f5f6f8] p-3
        text-slate-900 sm:p-6
        dark:bg-slate-950 dark:text-white
      "
    >
      <div
        className="
          mx-auto max-w-[1500px]
          rounded-[28px] bg-white p-4
          shadow-xl shadow-slate-200/60
          sm:p-6 dark:bg-slate-900
          dark:shadow-none
        "
      >
        <div className="flex flex-col gap-7 lg:flex-row">
          <ProfileSidebar
            user={user}
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
          />

          <main className="min-w-0 flex-1">
            <header
              className="
                mb-7 flex flex-wrap items-center
                justify-between gap-4 rounded-2xl
                bg-[#f6f7f8] px-5 py-4
                dark:bg-slate-800
              "
            >
              <div>
                <p
                  className="
                    text-xs text-slate-500
                    dark:text-slate-400
                  "
                >
                  Oryn / Жеке кабинет
                </p>

                <h1 className="mt-1 text-xl font-bold">
                  {SECTION_TITLES[activeSection]}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/parkings"
                  className="
                    inline-flex items-center gap-2
                    rounded-xl bg-white px-4 py-2.5
                    text-sm font-medium text-slate-700
                    shadow-sm transition
                    hover:text-emerald-600
                    dark:bg-slate-700 dark:text-white
                  "
                >
                  <ArrowLeft size={17} />
                  Тұрақтар
                </Link>

                <span
                  aria-label="Хабарламалар белгішесі"
                  className="
                    flex h-10 w-10 items-center
                    justify-center rounded-xl
                    bg-white text-slate-500
                    dark:bg-slate-700
                    dark:text-slate-300
                  "
                >
                  <Bell size={19} />
                </span>
              </div>
            </header>

            {userError && (
              <div
                role="alert"
                className="
                  mb-6 rounded-xl border border-red-200
                  bg-red-50 p-4 text-sm text-red-600
                  dark:border-red-900
                  dark:bg-red-950/30
                  dark:text-red-400
                "
              >
                {userError}
              </div>
            )}

            {activeSection === "overview" && (
              <div className="space-y-7">
                <ProfileOverview user={user} />

                {reviewsLoading && reviews.length === 0 ? (
                  <div
                    role="status"
                    className="
                      rounded-[20px] border
                      border-slate-100 bg-white
                      p-6 text-sm text-slate-500
                      dark:border-slate-700
                      dark:bg-slate-900
                    "
                  >
                    Статистика жүктелуде...
                  </div>
                ) : (
                  <ProfileStats reviews={reviews} />
                )}

                <ProfileReviews {...reviewsProps} />
              </div>
            )}

            {activeSection === "reviews" && (
              <ProfileReviews {...reviewsProps} />
            )}

            {activeSection === "favorites" && (
              <ProfileFavorites />
            )}

            {activeSection === "settings" && (
              <ProfileSettings
                user={user}
                onProfileUpdated={refreshUser}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
