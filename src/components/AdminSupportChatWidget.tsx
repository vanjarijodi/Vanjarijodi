import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { uploadToCloudinary, validateFileSize } from '../utils/cloudinary';
import { MessageCircle, X, Send, Paperclip, ShieldCheck, UserCheck, CheckCheck, Loader2, Move } from 'lucide-react';

export const AdminSupportChatWidget: React.FC = () => {
  const {
    adminSupportMessages,
    sendAdminSupportMessage,
    currentUser,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorMobile, setVisitorMobile] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ url: string; name: string } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Dragging State for Floating Widget
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialPos = useRef<{ x: number; y: number }>({ x: 20, y: 20 });

  const currentUserId = currentUser ? currentUser.id : 'visitor-guest';

  // Filter messages relevant for this user/guest
  const userMessages = adminSupportMessages.filter(
    (m) => m.senderId === currentUserId || (currentUserId === 'visitor-guest' && m.senderId === 'visitor-guest')
  );

  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStartPos.current = { x: clientX, y: clientY };
    initialPos.current = { ...position };
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaX = dragStartPos.current.x - clientX;
    const deltaY = dragStartPos.current.y - clientY;

    setPosition({
      x: Math.max(10, Math.min(window.innerWidth - 80, initialPos.current.x + deltaX)),
      y: Math.max(10, Math.min(window.innerHeight - 80, initialPos.current.y + deltaY)),
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (file) {
      const val = validateFileSize(file);
      if (!val.valid) {
        setFileError(val.errorMsg || 'फाईलचा आकार ६०० KB पेक्षा लहान असावा.');
        return;
      }

      setIsUploadingFile(true);
      const res = await uploadToCloudinary(file, 'vanjarijodi_support_attachments');
      setIsUploadingFile(false);

      if (res.success && res.url) {
        setAttachedFile({ url: res.url, name: file.name });
      } else {
        setFileError(res.error || 'फाईल अपलोड करण्यात समस्या आली.');
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() && !attachedFile) return;

    sendAdminSupportMessage(
      messageText.trim(),
      attachedFile?.url,
      attachedFile?.name,
      visitorMobile,
      visitorName
    );

    setMessageText('');
    setAttachedFile(null);
  };

  return (
    <div
      style={{ right: `${position.x}px`, bottom: `${position.y}px` }}
      className="fixed z-40 touch-none select-none"
    >
      {/* Floating Trigger Button */}
      {!isOpen && (
        <div className="relative group">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="flex items-center gap-2 px-4 py-3 bg-[#A71930] hover:bg-[#800C1E] text-white font-extrabold rounded-full shadow-2xl border-2 border-amber-300 transition-all active:scale-95 cursor-grab active:cursor-grabbing"
          >
            <div className="relative">
              <MessageCircle className="w-6 h-6 text-amber-300" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <span className="text-xs sm:text-sm tracking-wide">मदत व संपर्क</span>
            <Move className="w-3.5 h-3.5 text-amber-300/70 ml-1 hidden sm:inline-block" />
          </button>
        </div>
      )}

      {/* Chat Box Popup */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[520px] bg-[#FFFDF5] border-2 border-amber-300 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800 animate-in fade-in slide-in-from-bottom-5">
          {/* Draggable Header */}
          <div
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="bg-gradient-to-r from-[#A71930] to-[#800C1E] p-4 text-white flex items-center justify-between border-b border-amber-300 cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-2xl border border-amber-300/30">
                <ShieldCheck className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="font-black text-sm text-amber-100 flex items-center gap-1.5">
                  वंजारी जोडी ॲडमिन सपोर्ट
                </h3>
                <p className="text-[11px] text-amber-200">थेट प्रशासकाशी संवाद साधू शकता (Move Widget)</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Visitor Name/Mobile Inputs if not logged in */}
          {!currentUser && (
            <div className="bg-amber-50 p-3 border-b border-amber-200 space-y-2">
              <p className="text-[11px] font-bold text-slate-700">
                शीघ्र मदतीसाठी तुमचे नाव व मोबाईल नंबर टाका:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="तुमचे नाव"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#A71930]"
                />
                <input
                  type="tel"
                  placeholder="मोबाईल नंबर"
                  value={visitorMobile}
                  onChange={(e) => setVisitorMobile(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#A71930]"
                />
              </div>
            </div>
          )}

          {/* Chat Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FFFDF5]">
            <div className="text-center my-2">
              <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black rounded-full shadow-sm">
                ॥ श्री संत भगवान बाबा प्रसन्न ॥
              </span>
            </div>

            {userMessages.length === 0 ? (
              <div className="text-center py-8 text-slate-500 space-y-2">
                <MessageCircle className="w-10 h-10 text-amber-400 mx-auto opacity-70" />
                <p className="text-xs font-bold text-slate-700">नमस्कार! मी तुम्हाला काय मदत करू शकतो?</p>
                <p className="text-[11px] text-slate-500">
                  काही अडचण असल्यास किंवा बायोडाटा सबमिट करायचा असल्यास इथे मेसेज किंवा फाईल पाठवा.
                </p>
              </div>
            ) : (
              userMessages.map((m) => {
                const isUser = m.senderRole === 'user';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs font-medium shadow-sm ${
                        isUser
                          ? 'bg-[#A71930] text-white rounded-br-none border border-amber-300'
                          : 'bg-white text-slate-800 border-2 border-amber-200 rounded-bl-none'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>
                      
                      {m.fileUrl && (
                        <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-1.5">
                          <Paperclip className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                          <a
                            href={m.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-[11px] font-bold truncate max-w-[180px]"
                          >
                            {m.fileName || 'जोडलेली फाईल पहा'}
                          </a>
                        </div>
                      )}
                      
                      <div className="mt-1 flex items-center justify-end gap-1 text-[9px] opacity-80">
                        <span>{m.timestamp}</span>
                        {isUser && <CheckCheck className="w-3 h-3 text-amber-200" />}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Attached File Preview Bar */}
          {attachedFile && (
            <div className="px-3 py-1.5 bg-amber-100 border-t border-amber-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 truncate max-w-[220px] flex items-center gap-1">
                <Paperclip className="w-3.5 h-3.5 text-[#A71930]" />
                {attachedFile.name}
              </span>
              <button
                type="button"
                onClick={() => setAttachedFile(null)}
                className="text-rose-700 font-black hover:underline cursor-pointer"
              >
                काढून टाका
              </button>
            </div>
          )}

          {fileError && (
            <div className="px-3 py-1 bg-rose-100 text-rose-800 text-[11px] font-bold">
              {fileError}
            </div>
          )}

          {/* Input Footer */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-amber-200 flex items-center gap-2">
            <label className="p-2 bg-amber-100 hover:bg-amber-200 text-[#A71930] rounded-xl cursor-pointer transition-colors shadow-sm" title="फोटो किंवा PDF जोडा">
              {isUploadingFile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
              <input
                type="file"
                accept="image/*,.pdf"
                disabled={isUploadingFile}
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <input
              type="text"
              placeholder="इथे मेसेज लिहा..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-amber-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#A71930]"
            />

            <button
              type="submit"
              disabled={(!messageText.trim() && !attachedFile) || isUploadingFile}
              className="p-2 bg-[#A71930] hover:bg-[#800C1E] disabled:opacity-40 text-white rounded-xl shadow transition-all shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
