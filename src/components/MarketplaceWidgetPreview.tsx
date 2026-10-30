import { useState } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ChevronRight as ArrowRight,
  Plus,
  Minus,
  MessageCircle,
  Megaphone,
  CheckCircle2,
  CalendarDays,
  Send,
  Play,
  Share2,
  Globe,
  Sliders,
  MapPin,
  Code2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketplaceWidgetPreviewProps {
  type: string;
}

export function MarketplaceWidgetPreview({ type }: MarketplaceWidgetPreviewProps) {
  switch (type) {
    case "google-reviews":
      return <GoogleReviewsPreview />;
    case "instagram-feed":
      return <InstagramFeedPreview />;
    case "event-calendar":
      return <EventCalendarPreview />;
    case "logo-carousel":
      return <LogoCarouselPreview />;
    case "faq":
      return <FaqAccordionPreview />;
    case "countdown":
      return <CountdownTimerPreview />;
    case "whatsapp-chat":
      return <WhatsAppChatPreview />;
    case "announcement-bar":
      return <AnnouncementBarPreview />;
    case "popup":
      return <PopupWidgetPreview />;
    case "testimonial-slider":
      return <TestimonialSliderPreview />;
    case "contact-form":
      return <ContactFormPreview />;
    case "facebook-feed":
      return <FacebookFeedPreview />;
    case "social-feed":
      return <SocialFeedPreview />;
    case "youtube-gallery":
      return <YouTubeGalleryPreview />;
    case "accessibility":
      return <AccessibilityPreview />;
    case "language-switcher":
      return <LanguageSwitcherPreview />;
    case "store-locator":
      return <StoreLocatorPreview />;
    case "custom-html":
      return <CustomHtmlPreview />;
    default:
      return <DefaultFallbackPreview type={type} />;
  }
}

// 1. Google Reviews Preview (matches mockup)
function GoogleReviewsPreview() {
  const reviews = [
    { name: "Priya Sharma", time: "2 days ago", text: "Excellent service and amazing support. Highly recommended!" },
    { name: "Rahul Mehta", time: "1 week ago", text: "Great experience! The team is very professional and helpful." },
    { name: "Anita Verma", time: "2 weeks ago", text: "Very easy to use and perfect for our business. Will definitely use again." },
  ];

  return (
    <div className="relative flex h-full w-full flex-col justify-between p-3 select-none">
      <div className="text-center">
        <h4 className="text-[11px] font-bold tracking-tight text-slate-800">What Our Customers Say</h4>
      </div>

      <div className="relative my-auto flex items-center justify-between gap-1">
        <button type="button" aria-label="Previous review" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white shadow-xs border border-slate-200 text-slate-400 hover:text-slate-600">
          <ChevronLeft className="h-3 w-3" />
        </button>

        <div className="grid grid-cols-3 gap-1.5 flex-1 overflow-hidden">
          {reviews.map((r, i) => (
            <div key={i} className="flex flex-col justify-between rounded-lg border border-slate-100 bg-white p-1.5 shadow-2xs text-[8px]">
              <div className="flex items-center gap-1 mb-1">
                <div className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-blue-100 font-bold text-blue-700 text-[7px]">
                  {r.name[0]}
                </div>
                <div className="truncate">
                  <div className="font-semibold text-slate-800 truncate text-[8px] leading-tight">{r.name}</div>
                  <div className="text-[6.5px] text-slate-400">{r.time}</div>
                </div>
              </div>
              <p className="line-clamp-2 text-[7px] text-slate-500 leading-tight italic mb-1">
                "{r.text}"
              </p>
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="h-2 w-2 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          ))}
        </div>

        <button type="button" aria-label="Next review" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white shadow-xs border border-slate-200 text-slate-400 hover:text-slate-600">
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      <div className="flex justify-center gap-1 mt-0.5">
        <span className="h-1 w-1 rounded-full bg-slate-300" />
        <span className="h-1 w-2 rounded-full bg-blue-500" />
        <span className="h-1 w-1 rounded-full bg-slate-300" />
      </div>
    </div>
  );
}

// 2. Instagram Feed Preview (matches mockup)
function InstagramFeedPreview() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-3 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="grid h-4 w-4 place-items-center rounded-md bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white text-[8px]">
            📸
          </div>
          <span className="text-[11px] font-bold text-slate-800">Follow Us on Instagram</span>
        </div>
        <span className="text-[9px] font-semibold text-blue-600 hover:underline cursor-pointer flex items-center gap-0.5">
          View on Instagram
        </span>
      </div>

      {/* 4 Square Photo Tiles Grid */}
      <div className="grid grid-cols-4 gap-1.5 my-auto">
        <div className="group relative aspect-square overflow-hidden rounded-lg bg-gradient-to-tr from-sky-400 to-emerald-400 shadow-2xs">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=160&q=80')" }} />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
        </div>
        <div className="group relative aspect-square overflow-hidden rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-2xs">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=160&q=80')" }} />
        </div>
        <div className="group relative aspect-square overflow-hidden rounded-lg bg-gradient-to-tr from-amber-400 to-rose-400 shadow-2xs">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=160&q=80')" }} />
        </div>
        <div className="group relative aspect-square overflow-hidden rounded-lg bg-gradient-to-tr from-teal-400 to-cyan-500 shadow-2xs">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=160&q=80')" }} />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-[8px] text-slate-400">
        <span>@yourbrand</span>
        <span>•</span>
        <span>24.5k followers</span>
      </div>
    </div>
  );
}

// 3. Event Calendar Preview (matches mockup)
function EventCalendarPreview() {
  const events = [
    { day: "12", month: "OCT", title: "Web Design Workshop", meta: "Sat, Oct 12, 2024 • 10:00 AM Online Event" },
    { day: "18", month: "OCT", title: "Marketing Strategy Webinar", meta: "Fri, Oct 18, 2024 • 2:00 PM Online Event" },
    { day: "25", month: "OCT", title: "Business Growth Meetup", meta: "Fri, Oct 25, 2024 • 11:00 AM New York, USA" },
  ];

  return (
    <div className="flex h-full w-full flex-col justify-between p-3 select-none">
      <div className="flex items-center justify-between pb-1">
        <h4 className="text-[11px] font-bold text-slate-800">Upcoming Events</h4>
        <span className="text-[9px] font-semibold text-blue-600 flex items-center gap-0.5">
          View All →
        </span>
      </div>

      <div className="space-y-1 my-auto">
        {events.map((e, idx) => (
          <div key={idx} className="flex items-center justify-between rounded-lg border border-slate-100 bg-white p-1.5 shadow-2xs hover:border-slate-200">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 shrink-0 flex-col items-center justify-center rounded-md bg-rose-50 border border-rose-100 text-rose-600 font-bold leading-none">
                <span className="text-[9px]">{e.day}</span>
                <span className="text-[6px] uppercase tracking-wider">{e.month}</span>
              </div>
              <div className="truncate">
                <div className="font-semibold text-slate-800 text-[8.5px] truncate">{e.title}</div>
                <div className="text-[7px] text-slate-400 truncate">{e.meta}</div>
              </div>
            </div>
            <ArrowRight className="h-3 w-3 text-slate-300 shrink-0 ml-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Logo Carousel Preview (matches mockup)
function LogoCarouselPreview() {
  const logos = [
    { name: "Aurora", color: "#3b82f6", bg: "bg-blue-50 text-blue-600" },
    { name: "NextGen", color: "#06b6d4", bg: "bg-cyan-50 text-cyan-600" },
    { name: "Cloudify", color: "#6366f1", bg: "bg-indigo-50 text-indigo-600" },
    { name: "Zenith", color: "#8b5cf6", bg: "bg-purple-50 text-purple-600" },
    { name: "Voltix", color: "#ec4899", bg: "bg-pink-50 text-pink-600" },
  ];

  return (
    <div className="flex h-full w-full flex-col justify-between p-3 select-none">
      <div className="text-center">
        <h4 className="text-[11px] font-bold text-slate-800">Trusted by 10,000+ Fast-Growing Companies</h4>
      </div>

      <div className="relative my-auto flex items-center justify-between gap-1">
        <button type="button" aria-label="Previous logo slide" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white shadow-xs border border-slate-200 text-slate-400">
          <ChevronLeft className="h-3 w-3" />
        </button>

        <div className="grid grid-cols-5 gap-1.5 flex-1">
          {logos.map((l, i) => (
            <div key={i} className="flex flex-col items-center justify-center rounded-lg border border-slate-100 bg-white py-2 px-1 shadow-2xs hover:scale-105 transition-transform">
              <div className={cn("flex h-6 w-6 items-center justify-center rounded-md font-black text-[10px]", l.bg)}>
                {l.name[0]}
              </div>
              <span className="text-[7.5px] font-semibold text-slate-600 mt-1 truncate max-w-full">{l.name}</span>
            </div>
          ))}
        </div>

        <button type="button" aria-label="Next logo slide" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white shadow-xs border border-slate-200 text-slate-400">
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      <div className="flex justify-center gap-1 mt-0.5">
        <span className="h-1 w-1 rounded-full bg-slate-300" />
        <span className="h-1 w-2 rounded-full bg-purple-600" />
        <span className="h-1 w-1 rounded-full bg-slate-300" />
      </div>
    </div>
  );
}

// 5. FAQ Accordion Preview (matches mockup)
function FaqAccordionPreview() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-3 select-none">
      <div className="text-center pb-1">
        <h4 className="text-[11px] font-bold text-slate-800">Frequently Asked Questions</h4>
      </div>

      <div className="space-y-1 my-auto">
        {/* Expanded Top Question */}
        <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-2 shadow-2xs">
          <div className="flex items-center justify-between text-purple-900 font-bold text-[8.5px]">
            <span>How does it work?</span>
            <Minus className="h-2.5 w-2.5 text-purple-600 shrink-0" />
          </div>
          <p className="mt-1 text-[7.5px] text-slate-600 leading-tight">
            It's simple! Choose a design, customize the content, and publish the widget on your website. No coding required.
          </p>
        </div>

        {/* Collapsed Question 2 */}
        <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-2 py-1.5 shadow-2xs text-[8.5px] font-medium text-slate-700">
          <span>Can I customize the design?</span>
          <Plus className="h-2.5 w-2.5 text-slate-400 shrink-0" />
        </div>

        {/* Collapsed Question 3 */}
        <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-2 py-1.5 shadow-2xs text-[8.5px] font-medium text-slate-700">
          <span>Is it mobile responsive?</span>
          <Plus className="h-2.5 w-2.5 text-slate-400 shrink-0" />
        </div>
      </div>
    </div>
  );
}

// 6. Countdown Timer Preview (matches mockup)
function CountdownTimerPreview() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-3 select-none text-center">
      <div>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[7.5px] font-bold text-amber-700">
          ⚡ Limited Time Offer
        </span>
        <h4 className="text-[11px] font-bold text-slate-800 mt-0.5">Special Discount Ends In</h4>
      </div>

      {/* 4 Purple Countdown Boxes */}
      <div className="flex items-center justify-center gap-1.5 my-auto">
        <div className="flex flex-col items-center justify-center rounded-lg bg-gradient-to-b from-[#7c3aed] to-[#6d28d9] text-white px-2.5 py-1 shadow-sm min-w-[34px]">
          <span className="text-xs font-black leading-none">02</span>
          <span className="text-[6.5px] uppercase tracking-wider opacity-80 mt-0.5">Days</span>
        </div>
        <span className="text-purple-600 font-bold text-xs">:</span>
        <div className="flex flex-col items-center justify-center rounded-lg bg-gradient-to-b from-[#7c3aed] to-[#6d28d9] text-white px-2.5 py-1 shadow-sm min-w-[34px]">
          <span className="text-xs font-black leading-none">15</span>
          <span className="text-[6.5px] uppercase tracking-wider opacity-80 mt-0.5">Hours</span>
        </div>
        <span className="text-purple-600 font-bold text-xs">:</span>
        <div className="flex flex-col items-center justify-center rounded-lg bg-gradient-to-b from-[#7c3aed] to-[#6d28d9] text-white px-2.5 py-1 shadow-sm min-w-[34px]">
          <span className="text-xs font-black leading-none">36</span>
          <span className="text-[6.5px] uppercase tracking-wider opacity-80 mt-0.5">Mins</span>
        </div>
        <span className="text-purple-600 font-bold text-xs">:</span>
        <div className="flex flex-col items-center justify-center rounded-lg bg-gradient-to-b from-[#7c3aed] to-[#6d28d9] text-white px-2.5 py-1 shadow-sm min-w-[34px]">
          <span className="text-xs font-black leading-none">12</span>
          <span className="text-[6.5px] uppercase tracking-wider opacity-80 mt-0.5">Secs</span>
        </div>
      </div>

      <div>
        <button type="button" className="rounded-full bg-[#7c3aed] px-3.5 py-1 text-[8.5px] font-bold text-white shadow-xs hover:bg-[#6d28d9] transition-colors">
          Shop Now
        </button>
      </div>
    </div>
  );
}

// 7. WhatsApp Chat Preview
function WhatsAppChatPreview() {
  return (
    <div className="relative flex h-full w-full flex-col justify-between p-3 select-none">
      <div className="flex items-center gap-1.5 pb-1 border-b border-emerald-100">
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-bold text-slate-800">WhatsApp Customer Support</span>
      </div>

      <div className="my-auto space-y-1.5">
        <div className="flex items-start gap-1.5 max-w-[85%]">
          <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-600 text-white text-[8px] font-bold">
            W
          </div>
          <div className="rounded-2xl rounded-tl-xs bg-white border border-slate-100 p-2 shadow-2xs text-[8px] text-slate-700 leading-tight">
            Hi there! 👋 How can our team help you today?
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-[7.5px] text-slate-400">Typical response time: 2 mins</span>
        <div className="flex items-center gap-1 rounded-full bg-emerald-500 text-white px-2.5 py-1 text-[8px] font-bold shadow-xs">
          <MessageCircle className="h-2.5 w-2.5" />
          <span>Start Chat</span>
        </div>
      </div>
    </div>
  );
}

// 8. Announcement Bar Preview
function AnnouncementBarPreview() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-3 select-none">
      <div className="text-center pb-1">
        <span className="text-[10px] font-bold text-slate-800">Top Header Announcement Bar</span>
      </div>

      <div className="my-auto overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 p-2.5 text-white shadow-xs">
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 truncate">
            <span className="rounded-md bg-white/20 px-1 py-0.5 text-[7px] font-bold uppercase tracking-wider">
              NEW
            </span>
            <span className="text-[8.5px] font-medium truncate">
              Spring Sale: 20% Off All Plans with code <b>SPRING20</b>
            </span>
          </div>
          <span className="shrink-0 rounded-md bg-white px-2 py-0.5 text-[7.5px] font-bold text-purple-700 shadow-2xs">
            Claim Offer
          </span>
        </div>
      </div>

      <div className="flex justify-center text-[7.5px] text-slate-400">
        Sticky top bar with countdown timer and link buttons
      </div>
    </div>
  );
}

// 9. Popup Widget Preview
function PopupWidgetPreview() {
  return (
    <div className="flex h-full w-full flex-col justify-center p-3 select-none">
      <div className="relative mx-auto w-full max-w-[210px] rounded-xl border border-slate-100 bg-white p-2.5 shadow-md text-center">
        <span className="inline-block rounded-full bg-pink-50 border border-pink-200 px-2 py-0.5 text-[7px] font-bold text-pink-700">
          🎁 Special Offer
        </span>
        <h5 className="mt-1 text-[9.5px] font-bold text-slate-900 leading-tight">
          Get 15% Off Your First Order
        </h5>
        <div className="mt-1.5 flex gap-1">
          <div className="flex-1 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[7.5px] text-slate-400 text-left">
            user@example.com
          </div>
          <button type="button" className="rounded-md bg-purple-600 px-2 py-0.5 text-[7.5px] font-bold text-white">
            Claim
          </button>
        </div>
      </div>
    </div>
  );
}

// 10. Testimonial Slider Preview
function TestimonialSliderPreview() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-3 select-none">
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5 text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-2.5 w-2.5 fill-amber-400" />
          ))}
        </div>
        <span className="text-[7.5px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
          Verified Buyer
        </span>
      </div>

      <blockquote className="my-auto text-[8.5px] text-slate-700 italic leading-snug">
        "This widget increased our customer conversions by 28% in the first two weeks. Super fast setup!"
      </blockquote>

      <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
        <div className="h-5 w-5 rounded-full bg-purple-100 text-purple-700 font-bold grid place-items-center text-[8px]">
          SM
        </div>
        <div>
          <div className="text-[8px] font-bold text-slate-900">Sophia Martinez</div>
          <div className="text-[6.5px] text-slate-400">Head of Growth, Acme Corp</div>
        </div>
      </div>
    </div>
  );
}

// 11. Contact Form Preview
function ContactFormPreview() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-3 select-none">
      <div className="text-center pb-0.5">
        <h5 className="text-[10px] font-bold text-slate-800">Send Us a Message</h5>
      </div>
      <div className="space-y-1 my-auto">
        <div className="h-5 rounded-md border border-slate-200 bg-white px-2 py-1 text-[7.5px] text-slate-400 flex items-center">
          Your Name
        </div>
        <div className="h-5 rounded-md border border-slate-200 bg-white px-2 py-1 text-[7.5px] text-slate-400 flex items-center">
          Email Address
        </div>
        <div className="h-6 rounded-md border border-slate-200 bg-white px-2 py-1 text-[7.5px] text-slate-400 flex items-center">
          How can we help?
        </div>
      </div>
      <button type="button" className="flex items-center justify-center gap-1 rounded-md bg-purple-600 py-1 text-[7.5px] font-bold text-white shadow-2xs">
        <Send className="h-2.5 w-2.5" />
        Send Message
      </button>
    </div>
  );
}

// 12. Facebook Feed Preview
function FacebookFeedPreview() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-3 select-none">
      <div className="flex items-center gap-1.5 pb-1 border-b border-blue-100">
        <div className="h-5 w-5 rounded-full bg-blue-600 text-white font-bold grid place-items-center text-[9px]">
          f
        </div>
        <div className="truncate">
          <div className="text-[8.5px] font-bold text-slate-900">Company Official Page</div>
          <div className="text-[6.5px] text-slate-400">2 hours ago • 🌍 Public</div>
        </div>
      </div>
      <p className="my-auto text-[8px] text-slate-700 leading-snug line-clamp-2">
        We're thrilled to unveil our new website experience! Thank you to our 100k+ global followers for your continuous support. 🎉
      </p>
      <div className="flex justify-between text-[7px] text-slate-400 pt-1 border-t border-slate-100">
        <span>👍 428 Likes</span>
        <span>💬 52 Comments</span>
        <span>↗️ 19 Shares</span>
      </div>
    </div>
  );
}

// 13. Social Feed Preview
function SocialFeedPreview() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-3 select-none">
      <div className="flex items-center justify-between pb-1">
        <span className="text-[10px] font-bold text-slate-800">Unified Social Feed</span>
        <div className="flex gap-1 text-[8px]">
          <span className="text-blue-500 font-bold">X</span>
          <span className="text-rose-500 font-bold">IG</span>
          <span className="text-red-600 font-bold">YT</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5 my-auto">
        <div className="aspect-square rounded-lg bg-sky-100 p-1 flex flex-col justify-between text-[6.5px] text-slate-700">
          <span className="font-bold text-sky-600">@tweet</span>
          <span className="line-clamp-3">Excited to announce our newest update!</span>
        </div>
        <div className="aspect-square rounded-lg bg-gradient-to-tr from-amber-200 to-rose-300 p-1 flex items-end">
          <span className="text-[6.5px] font-bold text-white">❤️ 1.2k</span>
        </div>
        <div className="aspect-square rounded-lg bg-red-100 p-1 flex flex-col items-center justify-center text-red-600">
          <Play className="h-4 w-4" />
          <span className="text-[6px] font-bold mt-0.5">Watch</span>
        </div>
      </div>
      <div className="text-center text-[7.5px] text-slate-400">All channels aggregated in 1 live feed</div>
    </div>
  );
}

// 14. YouTube Gallery Preview
function YouTubeGalleryPreview() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-3 select-none">
      <div className="relative aspect-video w-full rounded-lg bg-slate-900 overflow-hidden shadow-2xs flex items-center justify-center">
        <div className="grid h-7 w-7 place-items-center rounded-full bg-red-600 text-white shadow-md">
          <Play className="h-3.5 w-3.5 fill-white ml-0.5" />
        </div>
        <div className="absolute bottom-1 right-1 rounded-sm bg-black/80 px-1 py-0.2 text-[6.5px] text-white font-mono">
          14:20
        </div>
      </div>
      <div className="pt-1">
        <div className="text-[8.5px] font-bold text-slate-800 truncate">Getting Started with Website Widgets 2026</div>
        <div className="text-[7px] text-slate-400">12.4K views • 3 days ago</div>
      </div>
    </div>
  );
}

// 15. Accessibility Preview
function AccessibilityPreview() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-3 select-none">
      <div className="flex items-center justify-between pb-1">
        <span className="text-[10px] font-bold text-slate-800">Accessibility Controls</span>
        <span className="text-[7.5px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">ADA Ready</span>
      </div>
      <div className="grid grid-cols-2 gap-1.5 my-auto text-[7.5px]">
        <div className="rounded-md border border-slate-200 bg-white p-1 text-center font-semibold text-slate-700">
          High Contrast
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-1 text-center font-semibold text-slate-700">
          Larger Text
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-1 text-center font-semibold text-slate-700">
          Highlight Links
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-1 text-center font-semibold text-slate-700">
          Dyslexic Font
        </div>
      </div>
      <div className="text-center text-[7.5px] text-slate-400">One-click compliance panel for visitors</div>
    </div>
  );
}

// 16. Language Switcher Preview
function LanguageSwitcherPreview() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-3 select-none">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-800">
          <Globe className="h-3 w-3 text-purple-600" />
          <span>Language Selector</span>
        </div>
      </div>
      <div className="space-y-1 my-auto">
        <div className="flex items-center justify-between rounded-md border border-purple-200 bg-purple-50/70 px-2 py-1 text-[8px] font-bold text-purple-900">
          <span>🇺🇸 English (US)</span>
          <CheckCircle2 className="h-3 w-3 text-purple-600" />
        </div>
        <div className="flex items-center justify-between rounded-md border border-slate-100 bg-white px-2 py-1 text-[8px] text-slate-700">
          <span>🇪🇸 Español</span>
        </div>
        <div className="flex items-center justify-between rounded-md border border-slate-100 bg-white px-2 py-1 text-[8px] text-slate-700">
          <span>🇫🇷 Français</span>
        </div>
      </div>
      <div className="text-center text-[7.5px] text-slate-400">Automatic visitor language detection</div>
    </div>
  );
}

// 17. Store Locator Preview
function StoreLocatorPreview() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-3 select-none">
      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-800 pb-1">
        <MapPin className="h-3 w-3 text-emerald-600" />
        <span>Store Locator</span>
      </div>
      <div className="my-auto rounded-lg border border-slate-100 bg-white p-1.5 shadow-2xs">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[8.5px] font-bold text-slate-900">Downtown Flagship Store</div>
            <div className="text-[7px] text-slate-500">742 Evergreen Terrace</div>
            <div className="text-[6.5px] text-emerald-600 font-semibold mt-0.5">● Open until 9:00 PM</div>
          </div>
          <span className="text-[7.5px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-md">
            1.2 mi
          </span>
        </div>
      </div>
      <div className="text-center text-[7.5px] text-slate-400">Interactive map with directions & hours</div>
    </div>
  );
}

// 18. Custom HTML Preview
function CustomHtmlPreview() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-3 select-none font-mono">
      <div className="flex items-center justify-between pb-1 font-sans">
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-800">
          <Code2 className="h-3 w-3 text-purple-600" />
          <span>Custom Code Snippet</span>
        </div>
      </div>
      <div className="my-auto rounded-lg bg-slate-900 p-2 text-[7px] text-slate-300 leading-relaxed shadow-2xs">
        <div className="text-pink-400">&lt;div class="banner"&gt;</div>
        <div className="pl-2 text-cyan-300">&lt;h2&gt;Hello World!&lt;/h2&gt;</div>
        <div className="pl-2 text-amber-300">&lt;script src="..."&gt;&lt;/script&gt;</div>
        <div className="text-pink-400">&lt;/div&gt;</div>
      </div>
      <div className="text-center text-[7.5px] text-slate-400 font-sans">Full raw HTML, CSS, and JS embedding</div>
    </div>
  );
}

function DefaultFallbackPreview({ type }: { type: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-3 text-center">
      <Sparkles className="h-6 w-6 text-purple-500 mb-1" />
      <span className="text-xs font-bold text-slate-800">{type}</span>
    </div>
  );
}

