import { useState, useEffect, Fragment } from "react";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import {
  Send,
  Sparkles,
  Zap,
  Smile,
  Eye
} from "lucide-react";

export const MessageComposer = ({
  leadId,
  draft,
  onDraftChange
}) => {
  const { sendMessage } = useApp();
  const { showToast } = useToast();
  const [text, setText] = useState(draft || "");
  const [showTemplates, setShowTemplates] = useState(false);
  const [reviewDraftOpen, setReviewDraftOpen] = useState(false);
  const [editableDraft, setEditableDraft] = useState("");
  const [enterToSend, setEnterToSend] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setText(draft || "");
  }, [leadId, draft]);

  const handleTextChange = (val) => {
    setText(val);
    if (onDraftChange) {
      onDraftChange(val);
    }
  };

  const quickTemplates = [
    "Here is our bespoke 2026 catalog with dimensions and wood finishes: artisanliving.com/catalog.pdf",
    "We offer complimentary white-glove delivery and setup for all orders over $2,500.",
    "I would love to reserve your preview slot. Would tomorrow at 11:00 AM or 3:00 PM work better for you?"
  ];

  const suggestedAiDraft =
    "Thank you for your interest in our bespoke collection! I have flagged your specifications for priority review.";

  const handleOpenReviewDraft = () => {
    setEditableDraft(suggestedAiDraft);
    setReviewDraftOpen(true);
  };

  const handleApplyDraft = () => {
    handleTextChange(editableDraft);
    setReviewDraftOpen(false);
    showToast("Reviewed AI draft inserted into composer.");
  };

  const handleSend = async () => {
    const messageText = text.trim();
    if (!messageText || isSending) return;
    setIsSending(true);
    try {
      const result = await sendMessage(leadId, messageText, "salesperson");
      if (result?.sendStatus === "failed") {
        throw new Error("WhatsApp could not send the message.");
      }
      handleTextChange("");
      showToast(result?.sendStatus === "sent" ? "WhatsApp message sent." : "Message queued for WhatsApp delivery.", "success");
    } catch (err) {
      showToast(err.message || "Failed to queue WhatsApp message. Your text is still in the composer.", "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && enterToSend) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white border-t border-slate-200 p-3 shrink-0 z-10 space-y-2.5">
      {/* Quick suggestions & snippets toolbar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-0.5 no-scrollbar">
        <button
          type="button"
          onClick={handleOpenReviewDraft}
          className="flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-full transition-colors cursor-pointer shrink-0 truncate max-w-md shadow-2xs"
          title="Review and edit AI suggested response before sending"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="font-semibold text-emerald-900">Review AI Draft:</span>
          <span className="truncate">"{suggestedAiDraft}"</span>
          <Eye className="w-3.5 h-3.5 text-emerald-700 shrink-0 ml-1" />
        </button>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Templates</span>
          </button>

          {showTemplates && (
            <Fragment>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowTemplates(false)}
              />
              <div className="absolute right-0 bottom-full mb-2 w-80 rounded-xl bg-white border border-slate-200 shadow-xl z-30 p-2.5 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Quick Reply Snippets (Canned)
                </div>
                <div className="space-y-1.5 mt-1.5">
                  {quickTemplates.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        handleTextChange(tpl);
                        setShowTemplates(false);
                      }}
                      className="w-full text-left p-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 line-clamp-2"
                    >
                      {tpl}
                    </button>
                  ))}
                </div>
              </div>
            </Fragment>
          )}
        </div>
      </div>

      {/* Textarea container */}
      <div className="relative border border-slate-200 rounded-xl bg-white shadow-2xs focus-within:ring-2 focus-within:ring-emerald-600 focus-within:border-emerald-600 transition-all">
        <textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type WhatsApp reply to customer..."
          rows={2}
          className="w-full text-sm p-3.5 bg-transparent resize-none focus:outline-none text-slate-900 placeholder:text-slate-400 leading-relaxed max-h-32"
        />

        <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
          <div className="flex items-center gap-1.5 text-slate-400">
            <button
              type="button"
              className="p-1.5 rounded-md hover:bg-slate-200/60 hover:text-slate-700 transition-colors cursor-pointer"
              title="Insert greeting emoji"
              aria-label="Insert emoji"
              onClick={() => handleTextChange(text + " 👋")}
            >
              <Smile className="w-4 h-4" />
            </button>
            <label className="flex items-center gap-1.5 ml-2 text-xs text-slate-600 cursor-pointer hidden sm:flex">
              <input
                type="checkbox"
                checked={enterToSend}
                onChange={(e) => setEnterToSend(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Enter to send</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden lg:inline">
              {enterToSend ? "↵ Enter sends · Shift+↵ newline" : "Shift+↵ or click Send"}
            </span>
            <button
              type="button"
              onClick={handleSend}
              disabled={!text.trim() || isSending}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? "Sending…" : "Send"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Review AI Draft Modal */}
      <Modal
        isOpen={reviewDraftOpen}
        onClose={() => setReviewDraftOpen(false)}
        title="Review AI Suggested Reply"
        description="Verify or modify the AI generated response before inserting it into your WhatsApp thread."
        maxWidth="md"
        footer={
          <div className="flex gap-2 justify-end w-full">
            <Button variant="outline" size="sm" onClick={() => setReviewDraftOpen(false)}>
              Discard
            </Button>
            <Button size="sm" onClick={handleApplyDraft}>
              Insert into Composer
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-xs text-emerald-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-xs">AI Context Analysis</p>
              <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                Suggested based on customer inquiry and current lead qualification stage. You can edit this text directly before inserting.
              </p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Draft Message Content
            </label>
            <textarea
              value={editableDraft}
              onChange={(e) => setEditableDraft(e.target.value)}
              rows={4}
              className="w-full text-xs p-3 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700 leading-relaxed font-sans"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
