import { useParams } from "react-router-dom";
import ShareStoryCard from "../components/ShareStoryCard";

export default function ShareStoryPage() {
  const { id } = useParams();
  const shareUrl = `https://tourlife.app/share/${id}`;

  const handleDownload = () => {
    window.print(); // Simple printable version for now
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center py-8 px-4">
      <h1 className="text-lg font-bold mb-4">📲 Share Your Tour</h1>

      <ShareStoryCard tourId={id} />

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400 mb-2">Public Share Link:</p>
        <a
          href={shareUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm underline text-blue-400"
        >
          {shareUrl}
        </a>

        <button
          onClick={handleDownload}
          className="mt-4 px-4 py-2 text-xs bg-white text-black rounded-full"
        >
          📥 Download for Instagram Story
        </button>
      </div>
    </div>
  );
}
