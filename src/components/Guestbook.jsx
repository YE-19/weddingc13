import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, Heart, MessageSquare, Radio, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FloralGarland } from './FloralElements';
import { invitationConfig } from '../data/invitationData';
import { addGuestWish, subscribeToGuestWishes, isFirebaseConfigured } from '../firebase';

export default function Guestbook({ couple }) {
  const [name, setName] = useState('');
  const [wishText, setWishText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Initial wishes fallback from invitationData & localStorage
  const [wishesList, setWishesList] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('wedding_guestbook_wishes') || '[]');
      if (saved && saved.length > 0) return saved;
    } catch {
      // fallback
    }
    return invitationConfig.initialWishes || [];
  });

  // Real-time Firebase subscription
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setIsLive(false);
      return;
    }

    const unsubscribe = subscribeToGuestWishes(
      (realtimeWishes) => {
        setWishesList(realtimeWishes || []);
        setIsLive(true);
      },
      (err) => {
        console.warn('Realtime subscription error:', err);
        setIsLive(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !wishText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (isFirebaseConfigured()) {
        // Save to Firebase Firestore (Shared with everyone in real-time)
        await addGuestWish({
          name: name.trim(),
          message: wishText.trim(),
        });
      } else {
        // Local fallback if Firebase keys are not provided yet
        const newWish = {
          id: 'local-' + Date.now(),
          name: name.trim(),
          wishes: wishText.trim(),
          timestamp: 'الآن',
        };
        const updated = [newWish, ...wishesList];
        setWishesList(updated);
        try {
          localStorage.setItem('wedding_guestbook_wishes', JSON.stringify(updated));
        } catch {
          // ignore localStorage errors
        }
      }

      setIsSubmitted(true);
      setName('');
      setWishText('');

      try {
        confetti({
          particleCount: 60,
          spread: 75,
          origin: { y: 0.7 },
          colors: ['#6B0F23', '#C8B896', '#7B112E', '#D4AF37'],
        });
      } catch (err) {
        console.error(err);
      }

      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (err) {
      console.error('Error saving wish:', err);
      setErrorMessage('حدث خطأ أثناء حفظ التهنئة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="guestbook" className="py-10 sm:py-14 px-4 max-w-md mx-auto text-center">
      {/* Title */}
      <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-[#6B0F23] mb-1">
        دفتر التهاني والتبريكات
      </h2>

      <p className="font-serif text-xs sm:text-sm text-[#6B0F23]/75 tracking-wide mb-3">
        شاركونا أجمل التهاني والدعوات الطيبة لـ {couple?.primary || 'العروسين'}
      </p>

      {/* Live Sync Status Pill */}
      <div className="flex items-center justify-center gap-1.5 mb-6">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-sans ${
            isLive
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-[#6B0F23]/5 text-[#6B0F23]/70 border border-[#6B0F23]/15'
          }`}
        >
          {isLive ? (
            <>
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              <span>مربوط ومباشر لجميع الأجهزة</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 text-[#C8B896]" />
              <span>بانتظار إعداد مفاتيح Firebase للمزامنة المباشرة</span>
            </>
          )}
        </span>
      </div>

      {/* Success Alert */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3.5 rounded-2xl bg-[#6B0F23] text-white flex items-center justify-center gap-2 text-xs font-serif shadow-md overflow-hidden"
          >
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
            <span>شكراً لكم! تم إرسال تهنئتكم وستظهر الآن لجميع الضيوف</span>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 rounded-2xl bg-red-100 text-red-800 border border-red-300 text-xs font-sans"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Form Box Area */}
      <form onSubmit={handleSubmit} className="space-y-3.5 text-right">
        <div>
          <label className="block text-xs font-serif font-bold text-[#6B0F23] mb-1">
            الاسم الكريم
          </label>
          <input
            type="text"
            required
            placeholder="مثال: أحمد وعائلته"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#6B0F23]/20 focus:border-[#7B112E] focus:outline-none text-xs text-[#6B0F23] shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-serif font-bold text-[#6B0F23] mb-1">
            رسالة التهنئة
          </label>
          <textarea
            required
            rows={3}
            placeholder="اكتب تهنئتك ومباركتك للعروسين هنا..."
            value={wishText}
            onChange={(e) => setWishText(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#6B0F23]/20 focus:border-[#7B112E] focus:outline-none text-xs text-[#6B0F23] shadow-xs resize-none"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-full bg-[#6B0F23] hover:bg-[#500A1A] text-white font-serif text-xs tracking-wider font-semibold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
        >
          <Send className="w-3.5 h-3.5 rotate-180" />
          <span>{isSubmitting ? 'جاري الحفظ والإرسال...' : 'إرسال التهنئة'}</span>
        </motion.button>
      </form>

      {/* Live Wishes Feed Section */}
      <div className="mt-8 text-right">
        <div className="flex items-center justify-between mb-4 border-b border-[#6B0F23]/10 pb-2">
          <div className="flex items-center gap-1.5 text-[#6B0F23]">
            <MessageSquare className="w-4 h-4 text-[#7B112E]" />
            <h3 className="font-serif text-sm font-bold">
              تهاني وتبريكات المهنئين
            </h3>
          </div>
          <span className="text-[11px] text-[#6B0F23]/70 font-sans bg-[#FAF8F5] px-2 py-0.5 rounded-full border border-[#6B0F23]/15">
            {wishesList.length} تهنئة
          </span>
        </div>

        {/* Wishes List Cards */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {wishesList.length === 0 ? (
            <p className="text-center text-xs text-[#6B0F23]/60 py-6">
              كن أول من يكتب تهنئة مباركة للعروسين!
            </p>
          ) : (
            wishesList.map((wish, index) => (
              <motion.div
                key={wish.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                className="p-3.5 rounded-2xl bg-white/80 border border-[#6B0F23]/15 shadow-xs text-right relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-3 h-3 text-[#7B112E] fill-[#7B112E]" />
                    <span className="font-serif font-bold text-xs text-[#6B0F23]">
                      {wish.name}
                    </span>
                  </div>
                  {wish.timestamp && (
                    <span className="text-[10px] text-[#6B0F23]/50 font-sans">
                      {wish.timestamp}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6B0F23]/85 font-serif leading-relaxed pr-4">
                  {wish.wishes}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <div className="w-full flex justify-center mt-8">
        <FloralGarland className="w-48 sm:w-56" />
      </div>
    </section>
  );
}
