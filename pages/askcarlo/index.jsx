import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function AskVelvet() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voices, setVoices] = useState([]);
  const [displayedAnswer, setDisplayedAnswer] = useState('');
  const [pendingAnswer, setPendingAnswer] = useState(null);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
  // Voice support is disabled
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel(); // Ensure nothing is speaking
  }
}, []);


  const speak = () => {
  // Voice is currently disabled
};


  const typeOut = (text, callback) => {
    setDisplayedAnswer('');
    let index = 0;
    const typing = () => {
      if (index <= text.length) {
        setDisplayedAnswer(text.slice(0, index));
        index++;
        setTimeout(typing, 60);
      } else {
        callback();
      }
    };
    typing();
  };

  const handleSubmit = async () => {
    if (!question.trim()) return;
    const newMessages = [...messages, { role: 'user', content: question }];
    setMessages(newMessages);
    setQuestion('');
    setLoading(true);
    setShowBar(true);

    try {
      const res = await fetch('/api/askvelvet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();

      setPendingAnswer(data.answer);

      typeOut(data.answer, () => {
        speak(data.answer);
        setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
        setPendingAnswer(null);
      });

    } catch (err) {
      const errorMsg = { role: 'assistant', content: "Sorry, I wasn’t able to respond just now." };
      setMessages(prev => [...prev, errorMsg]);
    }

    setLoading(false);
    setShowBar(false);
  };

  const VelvetAvatar = () => (
    <div className="relative w-10 h-10 flex-shrink-0 drop-shadow-md">
      <div className="absolute -inset-1 rounded-full border-2 border-pink-300 animate-ping opacity-20 z-0" />
      <div className="absolute inset-0 rounded-full bg-pink-400 opacity-40 blur-xl animate-pulse z-0"></div>
      <div className="relative z-10 w-full h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg flex items-center justify-center text-white font-bold text-sm">
        V
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Velvet – Curtain Advisor</title>
        <meta name="description" content="Ask Velvet your elegant AI curtain expert" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="min-h-screen bg-[#fdfaf6] text-[#222] px-4 py-10 font-[Outfit] antialiased tracking-tight flex justify-center">
        <div className="w-full max-w-2xl bg-white shadow-xl rounded-3xl px-6 py-8 border border-[#f2e6df] ring-2 ring-pink-100 ring-offset-2 ring-offset-[#fdfaf6]">
          <h1 className="text-4xl font-bold text-center text-[#3c3c3c] mb-2 animate-fade-in">
            Meet Velvet
          </h1>
          <p className="text-center text-[#7a7a7a] italic mb-6 text-lg">
            ✨ Curtain consultations, the Velvet way.
          </p>

          {showBar && (
            <div className="w-full bg-pink-200 h-1.5 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-pink-500 animate-pulse" style={{ width: '100%' }} />
            </div>
          )}

          <div className="border border-[#e6e2dd] rounded-xl bg-white shadow-sm max-h-[420px] p-5 overflow-y-auto space-y-6">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && <VelvetAvatar />}
                <div
                  className={`p-5 rounded-3xl max-w-[75%] sm:max-w-[85%] text-[15px] leading-relaxed shadow-md transition ${
                    msg.role === 'user' ? 'bg-[#eae7e0] text-left ml-auto'
                      : 'bg-[#faf9f6] text-left border border-[#e5dfd2] backdrop-blur-sm shadow-[0_0_15px_rgba(255,192,203,0.15)]'
                  }`}
                >
                  <strong className="block mb-1 text-sm text-[#555] font-medium">
                    {msg.role === 'user' ? 'You' : 'Velvet'}:
                  </strong>
                  <div>{msg.content}</div>
                </div>
              </div>
            ))}

            {pendingAnswer && (
  <div className="flex items-start gap-2 justify-start">
    <VelvetAvatar />
    <div className="p-5 rounded-3xl max-w-[75%] sm:max-w-[85%] text-[15px] leading-relaxed shadow-md border border-[#e5dfd2] bg-[#faf9f6] backdrop-blur-sm shadow-[0_0_15px_rgba(255,192,203,0.15)] text-left">
      <strong className="block mb-1 text-sm text-[#555] font-medium">Velvet:</strong>
      <span>
        {displayedAnswer}
        <span className="inline-block w-[1px] h-5 bg-[#555] animate-pulse ml-0.5 align-middle"></span>
      </span>
    </div>
  </div>
)}

            {loading && (
              <div className="flex items-center space-x-2 text-sm text-gray-400 mt-2 ml-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                <span className="ml-2">Velvet is thinking…</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 mt-6 mb-4">
  <textarea
    rows="2"
    className="w-full border border-[#ddd8d2] rounded-xl p-3 focus:outline-none focus:ring focus:border-[#c7bfae]"
    placeholder="Ask something like: 'What’s the best blackout curtain for a bedroom window?'"
    value={question}
    onChange={(e) => setQuestion(e.target.value)}
  ></textarea>
 <button
  onClick={handleSubmit}
  style={{ color: '#ffffff' }} // enforce white text
  className="w-full bg-[#222] py-2.5 rounded-xl hover:bg-[#444] transition-all font-medium tracking-wide shadow-md hover:shadow-lg"
  disabled={loading}
>
  {loading ? 'Thinking…' : 'Ask Velvet'}
</button>
  <a
    href="https://www.curtainsuk.com/pages/book-your-home-visit"
    target="_blank"
    rel="noopener noreferrer"
    className="w-full bg-pink-500 text-white py-2.5 rounded-xl hover:bg-pink-600 transition-all font-medium tracking-wide shadow-md hover:shadow-lg text-center"
  >
    Book Free Home Consultation
  </a>
</div>
        </div>
      </main>
    </>
  );
}

