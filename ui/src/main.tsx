import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import Home from "./pages/home/Home.tsx";
import NotFound from "./pages/not-found/NotFound.tsx";
import Users from './pages/users/Users.tsx';
import User from './pages/users/User.tsx';
import NewUser from './pages/users/NewUser.tsx';
import EditUser from './pages/users/EditUser.tsx';

const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("Root element not present");

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />

          <Route path="users">
            <Route index element={<Users />} />

            <Route path="new" element={<NewUser />} />

            <Route path=":userId">
              <Route index element={<User />} />

              <Route path="edit" element={<EditUser />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

    </BrowserRouter>
  </StrictMode>
);
