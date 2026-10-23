
import { useState } from "react";

import { useAdminParkings } from "../../hooks/useAdminParkings";
import { useAdminMessages } from "../../hooks/useAdminMessages";
import { useAdminReviews } from "../../hooks/useAdminReviews";
import { useHeaderAuth } from "../../hooks/useHeaderAuth";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminEmptySection from "../components/admin/AdminEmptySection";

import ParkingsPanel from "../components/admin/ParkingsPanel";
import AdminMapPanel from "../components/admin/AdminMapPanel";
import AdminUsersPanel from "../components/admin/AdminUsersPanel";
import AdminOwnersPanel from "../components/admin/AdminOwnersPanel";
import AdminOccupancyPanel from "../components/admin/AdminOccupancyPanel";
import MessagesPanel from "../components/admin/MessagesPanel";
import AdminReviewsPanel from "../components/admin/AdminReviewsPanel";
import AdminAnalyticsPanel from "../components/admin/AdminAnalyticsPanel";

import { adminSections } from "../components/admin/adminSections";

function AdminPage() {
  const [tab, setTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const parkingAdmin = useAdminParkings();
  const messageAdmin = useAdminMessages();
  const reviewsAdmin = useAdminReviews();

  const {
    user,
    loading: authLoading,
    isLoggingOut,
    error: authError,
    handleLogout,
  } = useHeaderAuth();

  const currentSection =
    adminSections.find(
      (section) => section.id === tab
    ) ?? adminSections[0];

  const notice =
    tab === "parkings"
      ? parkingAdmin.notice
      : tab === "messages"
        ? messageAdmin.notice
        : tab === "reviews"
          ? reviewsAdmin.notice
          : null;

  function changeTab(nextTab) {
    const sectionExists = adminSections.some(
      (section) => section.id === nextTab
    );

    if (!sectionExists) return;

    setTab(nextTab);

    parkingAdmin.clearNotice();

    if (nextTab === "messages") {
      messageAdmin.refresh();
    }

    if (nextTab === "reviews") {
      reviewsAdmin.refresh();
    }
  }

  function handleEditParking(parking) {
    changeTab("parkings");
    parkingAdmin.openEditForm(parking);
  }

  function renderContent() {
    switch (tab) {
      case "dashboard":
        return (
          <AdminDashboard
            parkingAdmin={parkingAdmin}
            messageAdmin={messageAdmin}
            onTabChange={changeTab}
          />
        );

      case "parkings":
        return (
          <ParkingsPanel
            admin={parkingAdmin}
          />
        );

      case "map":
        return (
          <AdminMapPanel
            onEditParking={handleEditParking}
          />
        );

      case "users":
        return (
          <AdminUsersPanel
            currentUserId={user?.id}
          />
        );

      case "owners":
        return <AdminOwnersPanel />;

      case "occupancy":
        return <AdminOccupancyPanel />;

      case "messages":
        return (
          <MessagesPanel
            messages={messageAdmin.messages}
            error={messageAdmin.error}
            newCount={messageAdmin.newCount}
            loading={messageAdmin.loading}
            saving={messageAdmin.saving}
            onRefresh={messageAdmin.refresh}
            onStatusChange={messageAdmin.changeStatus}
            onDelete={messageAdmin.removeMessage}
          />
        );

      case "reviews":
        return (
          <AdminReviewsPanel
            reviews={reviewsAdmin.reviews}
            stats={reviewsAdmin.stats}
            loading={reviewsAdmin.loading}
            saving={reviewsAdmin.saving}
            error={reviewsAdmin.error}
            onRefresh={reviewsAdmin.refresh}
            onStatusChange={reviewsAdmin.changeStatus}
            onDelete={reviewsAdmin.removeReview}
          />
        );

      case "analytics":
        return <AdminAnalyticsPanel />;

      default:
        return (
          <AdminEmptySection
            section={currentSection}
            onTabChange={changeTab}
          />
        );
    }
  }

  return (
    <div
      className="
        min-h-screen
        bg-[#f2f3f3]
        font-sans
        text-[#182523]
        [background-image:radial-gradient(ellipse_at_top_left,#e4eef4,transparent_55%),radial-gradient(ellipse_at_top_right,#f6eddf,transparent_55%)]
        [&_h1]:font-sans
        [&_h2]:font-sans
        [&_h3]:font-sans
        [&_p]:font-sans
      "
    >
      <div
        className={`
          mx-auto
          max-w-[1800px]
          lg:grid
          lg:gap-5
          lg:p-4
          ${
            collapsed
              ? "lg:grid-cols-[76px_minmax(0,1fr)]"
              : "lg:grid-cols-[250px_minmax(0,1fr)]"
          }
        `}
      >
        <AdminSidebar
          activeTab={tab}
          onTabChange={changeTab}
          newMessagesCount={
            messageAdmin.error
              ? 0
              : messageAdmin.newCount
          }
          collapsed={collapsed}
          onToggleCollapse={() =>
            setCollapsed((current) => !current)
          }
        />

        <div className="min-w-0">
          <AdminHeader
            sectionLabel={currentSection.label}
            user={user}
            authLoading={authLoading}
            isLoggingOut={isLoggingOut}
            onLogout={handleLogout}
          />

          <main className="min-w-0 px-5 py-6 lg:px-3 lg:py-7">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {currentSection.label}
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {currentSection.description}
              </p>
            </div>

            {authError && (
              <p
                role="alert"
                className="
                  mt-5
                  rounded-2xl
                  bg-red-50
                  p-4
                  text-sm
                  text-red-700
                "
              >
                {authError}
              </p>
            )}

            {notice && (
              <p
                role={notice.error ? "alert" : "status"}
                className={`
                  mt-5 rounded-2xl p-4 text-sm
                  ${
                    notice.error
                      ? "bg-red-50 text-red-800"
                      : "bg-emerald-50 text-emerald-800"
                  }
                `}
              >
                {notice.text}
              </p>
            )}

            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
