import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    return (
        <div className="fixed w-full z-50">
            <header className="bg-gradient-to-r from-purple-400 to-pink-400">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1
                            className="text-2xl font-bold text-white cursor-pointer"
                            onClick={() => navigate("/")}
                        >
                            พจนานุกรม
                        </h1>
                    </div>
                </div>
            </header>

            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">

                        {/* LEFT MENU */}
                        <nav className="flex gap-2">
                            <button
                                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded transition"
                                onClick={() => navigate("/")}
                            >
                                ค้นหาแบบทั่วไป
                            </button>

                            <button
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
                                onClick={() => navigate("/alphabet-search")}
                            >
                                ค้นหาตามหมวดอักษร
                            </button>

                            <button
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
                                onClick={() => navigate("/add-word")}
                            >
                                เพิ่มคำศัพท์
                            </button>
                        </nav>

                        {/* RIGHT MENU */}
                        <nav className="flex gap-2">
                            <button
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition ml-4"
                                onClick={() => navigate("/login")}
                            >
                                เข้าสู่ระบบ
                            </button>

                            <button
                                className="px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800 rounded transition"
                                onClick={() => navigate("/register")}
                            >
                                สมัครสมาชิก
                            </button>
                        </nav>

                    </div>
                </div>
            </nav>
        </div>
    );
}
