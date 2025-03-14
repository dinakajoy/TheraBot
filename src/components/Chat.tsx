import { useState } from "react";
import axios from "axios";

type TResponse = {
  role: string;
  content: string;
}

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<TResponse[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);

    try {
      const response = await axios.post("/api/chat", { message });
      setError("");
      setMessages([...messages, { role: "user", content: message }, { role: "assistant", content: response.data.reply }]);
      setMessage("");
      setLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Something went wrong!");
      } else {
        setError("Unexpected error occurred.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
      <div className="h-[80vh] overflow-y-auto p-2">
        {messages.map((msg, index) => (
          <p key={index} className={msg.role === "user" ? "text-blue-600" : "text-gray-600"}>
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="w-full p-2 border border-blue-300 rounded mt-2 text-gray-700"
      />
      <button onClick={sendMessage} className="w-full mt-2 p-2 bg-blue-500 text-white rounded font-semibold cursor-pointer" disabled={loading}>{loading ? 'Sending' : 'Send'}</button>
      {error && <p className="my-2 text-red-700 p-2 bg-red-100 rounded">Error: {error}</p>}
    </div>
  );
}
