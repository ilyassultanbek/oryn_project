import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../assets/pages/Home";
import ProtectedRoutes from "./routes/ProtectedRoutes";

const DistrictsPage = lazy(
  () => import("../assets/pages/DistrictsPage")
);

const ParkingsPage = lazy(
  () => import("../assets/pages/ParkingPage")
);

const MapPage = lazy(
  () => import("../assets/pages/MapPage")
);

const About = lazy(
  () => import("../assets/pages/About")
);

const ContactPage = lazy(
  () => import("../assets/pages/ContactPage")
);

const AdminPage = lazy(
  () => import("../assets/pages/AdminPage")
);

const LoginPage = lazy(
  () => import("../assets/pages/LoginPage")
);

const NotFoundPage = lazy(
  () => import("../assets/pages/NotFoundPage")
);

const ParkingDetailsPage = lazy(
  () => import("../assets/pages/ParkingDetailsPage")
);

const ProfilePage = lazy(
  () => import("../assets/pages/ProfilePage")
);

function PageLoading() {
  return (
    <div
      role="status"
      className="flex min-h-screen items-center justify-center
        bg-[#f7f9fc] px-6 text-slate-600
        dark:bg-blue-950 dark:text-slate-300"
    >
      <p>Бет жүктелуде...</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/districts"
            element={<DistrictsPage />}
          />

          <Route
            path="/districts/:districtId"
            element={<DistrictsPage />}
          />

          <Route
            path="/parkings"
            element={<ParkingsPage />}
          />

          <Route
            path="/parkings/:typeId"
            element={<ParkingsPage />}
          />

          <Route path="/map" element={<MapPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoutes adminOnly>
                <AdminPage />
              </ProtectedRoutes>
            }
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />

          <Route path="/parking/:id" element={<ParkingDetailsPage/>}/>

          <Route path="/profile" element={
                                        <ProtectedRoutes>
                                          <ProfilePage />
                                        </ProtectedRoutes>}/>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;




