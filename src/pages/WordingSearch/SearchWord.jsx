import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function DictionarySearch() {
    const API_URL = import.meta.env.VITE_API_URL;

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    const categories = [
        'คำนาม',
        'สรรพนาม',
        'กริยา',
        'คำวิเศษณ์',
        'บุพบท',
        'สันธาน',
        'อุทาน',
    ];

    // ==========================
    //   LOAD FULL RESULT
    // ==========================
    const fetchWords = async (word,categoriesToFetch = selectedCategories) => {
        if (word.trim() === '') return;
        setLoading(true);
        setSuggestions([]); // ปิด suggestion เมื่อค้นหาจริง

        try {
            const params = new URLSearchParams();
            params.append('q', word);

            if (categoriesToFetch.length > 0)
                params.append('categories', categoriesToFetch.join(','));

            const res = await fetch(`${API_URL}/search-words?${params.toString()}`);
            const data = await res.json();
            setResults(data);
        } catch (err) {
            console.error(err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    // ==========================
    //   LOAD SUGGESTIONS
    // ==========================
    const fetchSuggestions = async (text) => {
        if (!text.trim()) {
            setSuggestions([]);
            return;
        }

        try {
            const params = new URLSearchParams();
            params.append('q', text);

            const res = await fetch(`${API_URL}/search-words?${params.toString()}`);
            const data = await res.json();

            setSuggestions(data.slice(0, 5)); // Suggest แค่ 5 รายการ
        } catch (err) {
            console.error(err);
            setSuggestions([]);
        }
    };

    // ==========================
    //  CATEGORY SELECTOR
    // ==========================
    const toggleCategory = (category) => {
        const newCategories = selectedCategories.includes(category)
            ? selectedCategories.filter((c) => c !== category)
            : [...selectedCategories, category];

        setSelectedCategories(newCategories);
        fetchWords(searchTerm,newCategories);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-4xl mx-auto px-6 py-16">

                <div className="text-center mb-12">
                    <h2 className="text-3xl font-light text-gray-900">ค้นหาคำศัพท์</h2>
                </div>

                {/* SEARCH BOX */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 relative">
                    <div className="flex items-center gap-3 mb-6 relative">
                        <div className="flex-1 relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={20}
                            />

                            <input
                                type="text"
                                placeholder="ค้นหาคำศัพท์..."
                                value={searchTerm}
                                onChange={(e) => {
                                    const text = e.target.value;
                                    setSearchTerm(text);
                                    fetchSuggestions(text);
                                }}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl 
                                focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            />

                            {/* SUGGESTION DROPDOWN */}
                            {suggestions.length > 0 && (
                                <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-md z-30">
                                    {suggestions.map((item) => (
                                        <div
                                            key={item.id}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                setSearchTerm(item.word);
                                                setSuggestions([]);
                                                fetchWords(item.word, selectedCategories);
                                            }}
                                        >
                                            {item.word}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => fetchWords(searchTerm, selectedCategories)}
                            disabled={!searchTerm.trim() || loading}
                            className={`
                                bg-gradient-to-r from-purple-400 to-pink-400 text-white font-medium
                                px-6 py-2.5 rounded-xl shadow-md transition-all duration-300
                                ${!searchTerm.trim() || loading
                                    ? 'from-gray-400 to-gray-400 opacity-50 cursor-not-allowed'
                                    : 'hover:brightness-105'}
                            `}
                        >
                            {loading ? 'กำลังค้นหา...' : 'ค้นหา'}
                        </button>
                    </div>

                    {/* CATEGORIES */}
                    <div className="border-t border-gray-200 pt-5">
                        <p className="text-xs font-medium text-gray-500 mb-3">หมวดหมู่</p>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => toggleCategory(category)}
                                    className={`px-3 py-1.5 text-sm rounded-full border transition ${
                                        selectedCategories.includes(category)
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

                {/* FILTER SUMMARY */}
                {selectedCategories.length > 0 && (
                    <div className="mb-4">
                        <span className="text-xs text-gray-500">
                            กรองตาม: {selectedCategories.join(', ')}
                        </span>
                    </div>
                )}

                {/* RESULTS */}
                <div className="space-y-4">
                    {results.map((result) => (
                        <div
                            key={result.id}
                            className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                                        {result.worหd}
                                    </h3>
                                    <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        {result.category}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="border-l-2 border-gray-200 pl-4">
                                    <p className="text-gray-700">{result.meaning}</p>
                                </div>

                                <div className="bg-gray-50 rounded px-4 py-3">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">ตัวอย่าง:</span>{' '}
                                        {result.example}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <button className="text-sm text-gray-600 transition">
                                    แหล่งที่มา {result.source}
                                </button>
                            </div>
                        </div>
                    ))}

                    {results.length === 0 && !loading && (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <p className="text-gray-500">ไม่พบผลลัพธ์ที่ตรงกับการค้นหา</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
