import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate, Outlet, useLocation } from "react-router-dom";
import "./index.css";
import { GuestLayout } from "./Layouts/Layout";
import SearchWord from "./pages/WordingSearch/SearchWord";
import AlphabetSearch from "./pages/AlphabetSearch/SearchAlphabet";
export default function AppRouter() {
  return (
    <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<GuestLayout><SearchWord /></GuestLayout>} />
            <Route path="/alphabet-search" element={<GuestLayout><AlphabetSearch /></GuestLayout>} />
          </Routes>
        </Suspense>
    </BrowserRouter>
  );
}