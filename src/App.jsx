import { useEffect, useState } from "react";

function App() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    fetch("/.netlify/functions/get-words")
      .then(res => res.json())
      .then(data => setWords(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">คำศัพท์จากฐานข้อมูล</h1>

      {words.length === 0 && <p>กำลังโหลด...</p>}

      <ul className="space-y-4">
        {words.map(item => (
          <li key={item.id} className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold">{item.word}</h2>
            <p><strong>ประเภท:</strong> {item.type}</p>
            <p><strong>ความหมาย:</strong> {item.meaning}</p>
            <p><strong>ตัวอย่าง:</strong> {item.example}</p>
            <p><strong>ที่มา:</strong> {item.source}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
