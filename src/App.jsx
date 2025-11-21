import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate, Outlet, useLocation } from "react-router-dom";
import "./index.css";
import { GuestLayout } from "./Layouts/Layout";
import SearchWord from "./pages/SearchWord";

export default function AppRouter() {
  return (
    <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<GuestLayout><SearchWord /></GuestLayout>} />

          </Routes>
        </Suspense>
    </BrowserRouter>
  );
}