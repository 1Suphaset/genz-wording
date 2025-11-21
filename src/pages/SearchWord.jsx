import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function DictionarySearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const categories = ['คำนาม', 'กริยา'];

    const toggleCategory = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
        fetchWords();
    };

    const fetchWords = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append("q", searchTerm);
            if (selectedCategories.length > 0) params.append("categories", selectedCategories.join(","));

            const res = await fetch(`http://localhost:8888/.netlify/functions/search-words?${params.toString()}`);
            const data = await res.json();
            setResults(data);
        } catch (err) {
            console.error("Error fetching words:", err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredResults = results; // API ฝั่ง server filter แล้ว ไม่ต้องซ้ำ

    return (
        <div className="min-h-screen bg-gray-50">
          
            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-light text-gray-900">ค้นหาคำศัพท์</h2>
                </div>

                {/* Search Box */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="ค้นหาคำศัพท์..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            />
                        </div>
                        <button
                            className="
        bg-gradient-to-r from-pink-400 to-purple-400
        hover:brightness-105
        text-white font-medium
        px-6 py-2.5
        rounded-xl
        shadow-md
        transition-all duration-300
    "
                            onClick={fetchWords}
                        >
                            {loading ? "กำลังค้นหา..." : "ค้นหา"}
                        </button>
                    </div>

                    {/* Category Filters */}
                    <div className="border-t border-gray-200 pt-5">
                        <p className="text-xs font-medium text-gray-500 mb-3">หมวดหมู่</p>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => toggleCategory(category)}
                                    className={`px-3 py-1.5 text-sm rounded-full border transition ${selectedCategories.includes(category)
                                        ? 'bg-gray-900 text-white border-gray-900'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                        }`}
                                >
                                    {category}
                                    {selectedCategories.includes(category) && (
                                        <X className="inline ml-1" size={12} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Filter Summary */}
                {selectedCategories.length > 0 && (
                    <div className="mb-4">
                        <span className="text-xs text-gray-500">
                            กรองตาม: {selectedCategories.join(', ')}
                        </span>
                    </div>
                )}

                {/* Results */}
                <div className="space-y-4">
                    {filteredResults.map((result) => (
                        <div key={result.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">{result.word}</h3>
                                    <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{result.category}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="border-l-2 border-gray-200 pl-4">
                                    <p className="text-gray-700">{result.meaning}</p>
                                </div>

                                <div className="bg-gray-50 rounded px-4 py-3">
                                    <p className="text-sm text-gray-600"><span className="font-medium">ตัวอย่าง:</span> {result.example}</p>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <button className="text-sm text-gray-600 hover:text-gray-900 transition">ดูรายละเอียดเพิ่มเติม →</button>
                            </div>
                        </div>
                    ))}

                    {filteredResults.length === 0 && !loading && (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <p className="text-gray-500">ไม่พบผลลัพธ์ที่ตรงกับการค้นหา</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
