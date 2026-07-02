import { MessageCircle } from "lucide-react";

export function WhatsAppChatButton() {
  const phone = "919418031050";
  const message = "Hi, I'm interested in your services.";
  const whatsappUrl = `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-background"
    >
      <MessageCircle size={28} fill="white" />
    </a>
  );
}
