import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AlphabetDictionary() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [selectedLetter, setSelectedLetter] = useState('ก');
    const [wordList, setWordList] = useState([]);
    const [selectedWord, setSelectedWord] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    const thaiAlphabet = [
        'ก', 'ข', 'ฃ', 'ค', 'ฅ', 'ฆ', 'ง', 'จ', 'ฉ', 'ช', 'ซ', 'ฌ', 'ญ', 'ฎ', 'ฏ', 'ฐ',
        'ฑ', 'ฒ', 'ณ', 'ด', 'ต', 'ถ', 'ท', 'ธ', 'น', 'บ', 'ป', 'ผ', 'ฝ', 'พ', 'ฟ', 'ภ',
        'ม', 'ย', 'ร', 'ล', 'ว', 'ศ', 'ษ', 'ส', 'ห', 'ฬ', 'อ', 'ฮ'
    ];


    const fetchWordsByLetter = async (letter) => {
        const res = await fetch(
            `${API_URL}/search-words?q=${letter}&mode=start`
        );
        const data = await res.json();
        setWordList(data);
    };
    const fetchWordDetail = async (word) => {
        const res = await fetch(
            `${API_URL}/search-words?q=${word}`
        );
        const data = await res.json();
        setSelectedWord(data[0]);
    };


    // Pagination
    const totalPages = Math.ceil(wordList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedWords = wordList.slice(startIndex, startIndex + itemsPerPage);

    const handleLetterClick = (letter) => {
        setSelectedLetter(letter);
        setCurrentPage(1);
        fetchWordsByLetter(letter);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-16">

                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-light text-gray-900">ค้นหาตามหมวดอักษร</h2>
                </div>

                {/* Alphabet */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {thaiAlphabet.map((letter) => (
                            <button
                                key={letter}
                                onClick={() => handleLetterClick(letter)}
                                className={`w-10 h-10 rounded flex items-center justify-center text-sm transition
                                    ${selectedLetter === letter
                                        ? 'bg-purple-400 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                                `}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-3 gap-6">

                    {/* Sidebar */}
                    <div className="col-span-1">
                        <div className="bg-white border rounded-lg overflow-hidden">

                            <div className="bg-purple-300 px-4 py-3">
                                <h2 className="font-medium text-gray-900">
                                    คำที่ขึ้นต้นด้วย "{selectedLetter}"
                                </h2>
                            </div>

                            {loading ? (
                                <div className="p-6 text-center text-gray-500">กำลังโหลด...</div>
                            ) : (
                                <div className="divide-y">
                                    {paginatedWords.length > 0 ? (
                                        paginatedWords.map((word) => (
                                            <button
                                                key={word.id}
                                                onClick={() => fetchWordDetail(word.word)}
                                                className={`w-full px-4 py-3 text-left transition
                                                    ${selectedWord?.id === word.id ? 'bg-gray-100' : 'hover:bg-gray-50'}
                                                `}
                                            >
                                                <div className="font-medium text-gray-900">{word.word}</div>
                                                <div className="text-xs text-gray-500">{word.category}</div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-6 text-center text-gray-500">ไม่มีคำในหมวดนี้</div>
                                    )}
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="border-t flex justify-between items-center px-4 py-3">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-1 disabled:opacity-30"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <span>{currentPage} / {totalPages}</span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-1 disabled:opacity-30"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Word Detail */}
                    <div className="col-span-2">
                        {selectedWord ? (
                            <div
                                key={selectedWord.id}
                                className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                                            {selectedWord.word}
                                        </h3>
                                        <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {selectedWord.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="border-l-2 border-gray-200 pl-4">
                                        <p className="text-gray-700">{selectedWord.meaning}</p>
                                    </div>

                                    <div className="bg-gray-50 rounded px-4 py-3">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">ตัวอย่าง:</span>{' '}
                                            {selectedWord.example}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <button className="text-sm text-gray-600 transition">
                                        แหล่งที่มา {selectedWord.source}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white border rounded-lg p-10 text-center text-gray-500">
                                เลือกคำจากรายการด้านซ้ายเพื่อดูรายละเอียด
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
