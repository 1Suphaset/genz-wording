import React from 'react'

export default function Header() {
    return (
        <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-900">พจนานุกรม</h1>
                    <nav className="flex gap-2">
                        <button className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded transition">หน้าแรก</button>
                        <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition">เกี่ยวกับ</button>
                        <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition">ติดต่อ</button>
                        <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition ml-4">เข้าสู่ระบบ</button>
                        <button className="px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800 rounded transition">สมัครสมาชิก</button>
                    </nav>
                </div>
            </div>
        </header>
    )
}
