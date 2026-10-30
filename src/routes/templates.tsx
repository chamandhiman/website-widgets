import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/StudioLayout";
import { WIDGETS } from "@/lib/widgets";

const TEMPLATES = [
  { title: "Trust-building reviews", type: "google-reviews", note: "Grid of Google reviews with rating summary." },
  { title: "Support chat button", type: "whatsapp-chat", note: "Floating WhatsApp button, bottom right." },
  { title: "Product FAQ", type: "faq", note: "Shipping and returns questions, ready to edit." },
  { title: "Flash sale countdown", type: "countdown", note: "Bold countdown boxes for promotions." },
  { title: "Customer love wall", type: "testimonial-slider", note: "Showcase customer reviews in an interactive slider." },
  { title: "Partner & client showcase", type: "logo-carousel", note: "Display trusted brands and partner logos in a smooth carousel." },
  { title: "Free shipping banner", type: "announcement-bar", note: "Slim promo bar for the top of your site." },
];

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Widget Templates — WebToolOcean" },
      { name: "description", content: "Start from ready-made widget templates." },
      { property: "og:title", content: "Widget Templates — WebToolOcean" },
      { property: "og:description", content: "Start from ready-made widget templates." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      <PageHeader title="Templates" description="Start from a ready-made setup and make it yours." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TEMPLATES.map((t) => {
          const Icon = WIDGETS.find((w) => w.type === t.type)!.icon;
          return (
            <div key={t.title} className="flex flex-col rounded-2xl border bg-card p-5 shadow-soft">
              <Icon className="mb-3 h-6 w-6 text-primary" />
              <h3 className="font-semibold">{t.title}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{t.note}</p>
              <Button asChild size="sm" className="mt-auto self-start"><Link to="/editor/$type" params={{ type: t.type }}>Use template</Link></Button>
            </div>
          );
        })}
      </div>
    </div>
  ),
});
