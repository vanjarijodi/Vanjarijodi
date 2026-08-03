import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile } from '../types';
import {
  X,
  Send,
  Image,
  Mic,
  Smile,
  CheckCheck,
  PhoneCall,
  Video,
  ShieldCheck,
  MoreVertical
} from 'lucide-react';

export const ChatModal: React.FC<{
  user: UserProfile | null;
  onClose: () => void;
}> = ({ user, onClose }) => {
  const {
    t,
    language,
    currentUser,
    chatMessages,
    sendChatMessage,
    setActiveVideoUser,
    siteConfig,
  } = useApp();

  const [text, setText] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);

  if (!user || !currentUser) return null;

  const isChatDisabledByAdmin = siteConfig?.enableChatGlobal === false;
  const isUserBlockedFromChat = currentUser?.isChatBlocked;

  const currentChatMsgs = chatMessages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.receiverId === user.id) ||
      (m.senderId === user.id && m.receiverId === currentUser.id)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendChatMessage(user.id, text);
    setText('');
  };

  const handleSendImage = () => {
    sendChatMessage(
      user.id,
      'माझ्या बायोडाटाचा फोटो / पत्रिका',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500'
    );
  };

  const handleSendVoice = () => {
    sendChatMessage(
      user.id,
      '🎙️ व्हॉईस मेसेज (०:१५ सेकंद)',
      undefined,
      'voice-sample-url'
    );
  };

  const sampleEmojis = ['🌸', '🙏', '❤️', '😊', '👍', '💐', '✨', '🚩'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl text-white overflow-hidden my-auto h-[600px] flex flex-col">
        
        {/* Chat Header (WhatsApp style) */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-amber-400">
              <img src={user.photos[0]} alt="chat user" className="w-full h-full object-cover" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{user.fullName}</h3>
              <p className="text-[11px] text-emerald-400 font-medium">ऑनलाईन (ऑनलाइन चॅट)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${user.mobile}`}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300"
              title="फोन करा"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
            <button
              onClick={() => {
                onClose();
                setActiveVideoUser(user);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300"
              title="व्हिडिओ कॉल"
            >
              <Video className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
          
          <div className="text-center my-2">
            <span className="text-[10px] bg-slate-800/80 text-amber-300 px-3 py-1 rounded-full border border-amber-500/20">
              🔒 100% एंड-टू-एंड एन्क्रिप्टेड व्हॉट्सॲप संवाद
            </span>
          </div>

          {currentChatMsgs.length === 0 ? (
            <div className="text-center text-xs text-slate-400 py-10">
              <p>संवादाची सुरुवात करा! "जय भगवान बाबा" किंवा "नमस्कार" संदेश पाठवा.</p>
            </div>
          ) : (
            currentChatMsgs.map((msg) => {
              const isMe = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs space-y-1 shadow-md ${
                      isMe
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-tr-none'
                        : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                    }`}
                  >
                    {msg.imageUrl && (
                      <img src={msg.imageUrl} alt="attachment" className="rounded-xl max-h-40 w-full object-cover mb-1" />
                    )}

                    {msg.voiceUrl && (
                      <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg">
                        <Mic className="w-4 h-4 text-amber-300 animate-pulse" />
                        <span className="font-mono text-[11px]">०:१५ व्हॉईस नोट</span>
                      </div>
                    )}

                    <p className="leading-relaxed">{msg.text}</p>
                    
                    <div className="flex items-center justify-end gap-1 text-[10px] opacity-75">
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="w-3.5 h-3.5 text-sky-300" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Emoji Selector Bar */}
        {showEmojis && (
          <div className="p-2 bg-slate-950 border-t border-slate-800 flex gap-2 overflow-x-auto">
            {sampleEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setText((prev) => prev + emoji);
                  setShowEmojis(false);
                }}
                className="text-lg hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Chat Input Bar */}
        {isChatDisabledByAdmin ? (
          <div className="p-4 bg-slate-950 border-t border-amber-500/20 text-center text-xs text-amber-300 font-bold">
            ⚠️ प्रशासकांनी सद्यस्थितीत सदस्यांमधील चॅट सुविधा तात्पुरती बंद केली आहे.
          </div>
        ) : isUserBlockedFromChat ? (
          <div className="p-4 bg-rose-950/80 border-t border-rose-500/30 text-center text-xs text-rose-300 font-bold">
            🚫 तुमच्या खात्याची चॅट सुविधा प्रशासकांनी ब्लॉक केली आहे.
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-amber-500/20 flex items-center gap-2">
            
            <button
              type="button"
              onClick={() => setShowEmojis(!showEmojis)}
              className="p-2 text-slate-400 hover:text-amber-300"
            >
              <Smile className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleSendImage}
              className="p-2 text-slate-400 hover:text-amber-300"
              title="फोटो पाठवा"
            >
              <Image className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleSendVoice}
              className="p-2 text-slate-400 hover:text-amber-300"
              title="व्हॉईस पाठवा"
            >
              <Mic className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder="संदेश टाइप करा..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-amber-500"
            />

            <button
              type="submit"
              className="p-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
