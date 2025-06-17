import { useState } from "react";
import axios from "axios";

type TResponse = {
  role: string;
  content: string;
};

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<TResponse[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);

    try {
      // Send last 6 message history
      const history = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/api/chat",
        { message, history }
      );

      setError("");
      setMessages([
        ...messages,
        { role: "user", content: message },
        { role: "assistant", content: response.data.reply },
      ]);
      setMessage("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Something went wrong!");
      } else {
        setError("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto h-full">
      <p className="text-sm text-gray-700 mb-2 italic font-semibold">
        TheraBot is an AI therapist trained only for emotional support. Please
        do not ask technical or code-related questions.
      </p>
      <div className="p-4 bg-white shadow-md rounded-lg">
        <div className="max-h-[80vh] h-[70vh] overflow-y-auto p-2">
          {messages.map((msg, index) => (
            <p
              key={index}
              className={
                msg.role === "user" ? "text-blue-600" : "text-gray-600"
              }
            >
              <strong>{msg.role === "user" ? "You" : "TheraBot"}:</strong>{" "}
              {msg.content}
            </p>
          ))}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          maxLength={200}
          className="w-full p-2 border border-blue-300 rounded mt-2 text-gray-700"
        />
        <div className="text-sm text-gray-500 text-right mt-1">
          {message.length}/200
        </div>
        {error && (
          <p className="my-2 text-red-700 p-2 bg-red-100 rounded">⚠️ {error}</p>
        )}
        <button
          onClick={sendMessage}
          className="w-full mt-2 p-2 bg-blue-500 text-white rounded font-semibold cursor-pointer"
          disabled={loading}
        >
          {loading ? "Sending" : "Send"}
        </button>
      </div>
    </div>
  );
}
