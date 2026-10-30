import { useState } from "react";
import {
  LayoutTemplate,
  Type,
  Sliders,
  Sparkles,
  Check,
  Plus,
  Pencil,
  Trash2,
  Star,
  Quote,
  User,
  Building2,
  Briefcase,
  Link as LinkIcon,
  Image as ImageIcon,
  MessageSquare,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TESTIMONIAL_DESIGNS,
  type TestimonialDesignDefinition,
  type TestimonialItem,
  type TestimonialSliderConfig,
} from "@/lib/testimonial/types";
import { getInitials, getReviewExcerpt } from "@/lib/testimonial/testimonialUtils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TestimonialSliderConfigTabsProps {
  config: TestimonialSliderConfig;
  onChange: <K extends keyof TestimonialSliderConfig>(
    key: K,
    value: TestimonialSliderConfig[K]
  ) => void;
  onSelectDesign: (design: TestimonialDesignDefinition) => void;
  defaultTab?: string;
}

export function TestimonialSliderConfigTabs({
  config,
  onChange,
  onSelectDesign,
  defaultTab = "designs",
}: TestimonialSliderConfigTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Modal State for Add / Edit Testimonial
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<TestimonialItem>>({
    name: "",
    review: "",
    photoUrl: "",
    designation: "",
    company: "",
    rating: 5,
    websiteUrl: "",
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      name: "",
      review: "",
      photoUrl: "",
      designation: "",
      company: "",
      rating: 5,
      websiteUrl: "",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: TestimonialItem) => {
    setEditingId(item.id);
    setForm({ ...item });
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = (config.testimonials || []).filter((t) => t.id !== id);
    onChange("testimonials", updated);
    toast.success("Testimonial removed");
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      toast.error("Reviewer name is required");
      return;
    }
    if (!form.review?.trim()) {
      toast.error("Review text is required");
      return;
    }

    const currentList = config.testimonials || [];

    if (editingId) {
      const updated = currentList.map((t) =>
        t.id === editingId
          ? {
              ...t,
              name: form.name!.trim(),
              review: form.review!.trim(),
              photoUrl: form.photoUrl?.trim() || undefined,
              designation: form.designation?.trim() || undefined,
              company: form.company?.trim() || undefined,
              rating: form.rating ?? 5,
              websiteUrl: form.websiteUrl?.trim() || undefined,
            }
          : t
      );
      onChange("testimonials", updated);
      toast.success("Testimonial updated");
    } else {
      const newItem: TestimonialItem = {
        id: `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: form.name.trim(),
        review: form.review.trim(),
        photoUrl: form.photoUrl?.trim() || undefined,
        designation: form.designation?.trim() || undefined,
        company: form.company?.trim() || undefined,
        rating: form.rating ?? 5,
        websiteUrl: form.websiteUrl?.trim() || undefined,
      };
      onChange("testimonials", [...currentList, newItem]);
      toast.success("Testimonial added");
    }

    setModalOpen(false);
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-border dark:bg-card overflow-hidden">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex h-full flex-col"
      >
        {/* Navigation Tabs Header */}
        <div className="border-b border-slate-200/80 px-4 pt-3 dark:border-border">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100/80 p-1 dark:bg-slate-900">
            <TabsTrigger
              value="designs"
              className="gap-2 data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-xs text-xs font-semibold"
            >
              <LayoutTemplate className="h-3.5 w-3.5" />
              Designs
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="gap-2 data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-xs text-xs font-semibold"
            >
              <Type className="h-3.5 w-3.5" />
              Content
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="gap-2 data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-xs text-xs font-semibold"
            >
              <Sliders className="h-3.5 w-3.5" />
              Preferences
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Designs */}
        <TabsContent
          value="designs"
          className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 m-0"
        >
          <div className="mb-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              Select a Testimonial Design
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose from 6 distinct visual layouts. Your testimonials and settings are preserved.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {TESTIMONIAL_DESIGNS.map((design) => {
              const isSelected = config.designId === design.id;
              return (
                <button
                  key={design.id}
                  type="button"
                  onClick={() => onSelectDesign(design)}
                  className={cn(
                    "group relative flex flex-col text-left rounded-xl border p-3.5 transition-all duration-200 hover:shadow-sm cursor-pointer",
                    isSelected
                      ? "border-purple-600 ring-2 ring-purple-500/20 bg-purple-50/20 dark:bg-purple-950/20"
                      : "border-slate-200 bg-white hover:border-slate-300 dark:border-border dark:bg-card"
                  )}
                >
                  {/* Miniature Visual Preview Canvas */}
                  <div
                    className={cn(
                      "relative h-28 w-full rounded-lg overflow-hidden border border-slate-200/60 p-2.5 flex flex-col justify-between mb-3 bg-gradient-to-br",
                      design.previewBg
                    )}
                  >
                    <DesignMiniaturePreview designId={design.id} />
                    {isSelected && (
                      <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white shadow-xs">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Title & Badge */}
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                      {design.name}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {design.badge}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {design.description}
                  </p>
                </button>
              );
            })}
          </div>
        </TabsContent>

        {/* Tab 2: Content */}
        <TabsContent
          value="content"
          className="flex-1 overflow-y-auto p-4 md:p-5 space-y-6 m-0"
        >
          {/* General Section Heading */}
          <div className="space-y-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-border dark:bg-card/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              General Content
            </h4>
            <div className="space-y-1.5">
              <Label htmlFor="sec-title" className="text-xs font-semibold">
                Section Heading
              </Label>
              <Input
                id="sec-title"
                value={config.title}
                onChange={(e) => onChange("title", e.target.value)}
                placeholder="What Our Customers Say"
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sec-desc" className="text-xs font-semibold">
                Subtitle / Description (optional)
              </Label>
              <Textarea
                id="sec-desc"
                value={config.description || ""}
                onChange={(e) => onChange("description", e.target.value)}
                placeholder="Real stories from our clients around the world."
                rows={2}
                className="text-xs resize-none"
              />
            </div>
          </div>

          {/* Manage Testimonials Header & Add Button */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Manage Testimonials ({config.testimonials.length})
                </h4>
                <p className="text-[11px] text-slate-500">
                  Add, edit, or remove customer feedback.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={handleOpenAdd}
                className="h-8 gap-1.5 text-xs bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Testimonial
              </Button>
            </div>

            {/* Testimonials List */}
            {config.testimonials.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
                No testimonials added yet. Click "Add Testimonial" above.
              </div>
            ) : (
              <div className="space-y-2.5">
                {config.testimonials.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs hover:border-slate-300 transition-colors dark:border-border dark:bg-card"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 font-bold text-xs">
                        {item.photoUrl ? (
                          <img
                            src={item.photoUrl}
                            alt={item.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          getInitials(item.name)
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-900 truncate dark:text-slate-100">
                            {item.name}
                          </span>
                          {item.rating && (
                            <span className="flex items-center text-[10px] text-amber-500 font-semibold gap-0.5">
                              <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                              {item.rating}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          "{getReviewExcerpt(item.review, 60)}"
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(item)}
                        className="h-7 w-7 text-slate-600 hover:text-purple-600"
                        aria-label={`Edit ${item.name}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        className="h-7 w-7 text-slate-400 hover:text-red-600"
                        aria-label={`Delete ${item.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab 3: Preferences */}
        <TabsContent
          value="preferences"
          className="flex-1 overflow-y-auto p-4 md:p-5 space-y-6 m-0"
        >
          {/* Slider Behavior */}
          <div className="space-y-4 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-border dark:bg-card/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Slider Behavior
            </h4>

            {/* Autoplay Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pref-autoplay" className="text-xs font-semibold block">
                  Autoplay Slides
                </Label>
                <span className="text-[11px] text-slate-500">
                  Automatically transition between slides
                </span>
              </div>
              <Switch
                id="pref-autoplay"
                checked={config.autoplay}
                onCheckedChange={(val) => onChange("autoplay", val)}
              />
            </div>

            {/* Autoplay Interval */}
            {config.autoplay && (
              <div className="space-y-2 pt-2 border-t border-slate-200/60">
                <div className="flex justify-between items-center text-xs">
                  <Label htmlFor="pref-interval" className="font-semibold">
                    Autoplay Interval
                  </Label>
                  <span className="text-slate-600 font-mono font-medium">
                    {config.autoplayInterval} seconds
                  </span>
                </div>
                <Slider
                  id="pref-interval"
                  min={2}
                  max={15}
                  step={1}
                  value={[config.autoplayInterval]}
                  onValueChange={([val]) => onChange("autoplayInterval", val ?? 5)}
                />
              </div>
            )}

            {/* Arrows & Dots */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
              <div>
                <Label htmlFor="pref-arrows" className="text-xs font-semibold block">
                  Navigation Arrows
                </Label>
                <span className="text-[11px] text-slate-500">
                  Show left & right arrows
                </span>
              </div>
              <Switch
                id="pref-arrows"
                checked={config.showArrows}
                onCheckedChange={(val) => onChange("showArrows", val)}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
              <div>
                <Label htmlFor="pref-dots" className="text-xs font-semibold block">
                  Pagination Dots
                </Label>
                <span className="text-[11px] text-slate-500">
                  Show bottom dot indicators
                </span>
              </div>
              <Switch
                id="pref-dots"
                checked={config.showDots}
                onCheckedChange={(val) => onChange("showDots", val)}
              />
            </div>

            {/* Desktop Columns */}
            {config.designId !== "quote-focus" && (
              <div className="space-y-2 pt-2 border-t border-slate-200/60">
                <div className="flex justify-between items-center text-xs">
                  <Label htmlFor="pref-columns" className="font-semibold">
                    Visible Cards on Desktop
                  </Label>
                  <span className="text-slate-600 font-mono font-medium">
                    {config.desktopColumns} {config.desktopColumns === 1 ? "card" : "cards"}
                  </span>
                </div>
                <Slider
                  id="pref-columns"
                  min={1}
                  max={3}
                  step={1}
                  value={[config.desktopColumns]}
                  onValueChange={([val]) => onChange("desktopColumns", val ?? 2)}
                />
              </div>
            )}
          </div>

          {/* Display Options */}
          <div className="space-y-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-border dark:bg-card/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Display Elements
            </h4>

            {/* Photos */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pref-photos" className="text-xs font-semibold block">
                  Reviewer Photos / Avatars
                </Label>
                <span className="text-[11px] text-slate-500">
                  Display profile image or initials
                </span>
              </div>
              <Switch
                id="pref-photos"
                checked={config.showPhotos}
                onCheckedChange={(val) => onChange("showPhotos", val)}
              />
            </div>

            {/* Ratings */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
              <div>
                <Label htmlFor="pref-ratings" className="text-xs font-semibold block">
                  Star Ratings
                </Label>
                <span className="text-[11px] text-slate-500">
                  Show star rating score
                </span>
              </div>
              <Switch
                id="pref-ratings"
                checked={config.showRatings}
                onCheckedChange={(val) => onChange("showRatings", val)}
              />
            </div>

            {/* Designation */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
              <div>
                <Label htmlFor="pref-desig" className="text-xs font-semibold block">
                  Designation / Role
                </Label>
                <span className="text-[11px] text-slate-500">
                  Show reviewer's job title
                </span>
              </div>
              <Switch
                id="pref-desig"
                checked={config.showDesignation}
                onCheckedChange={(val) => onChange("showDesignation", val)}
              />
            </div>

            {/* Company */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
              <div>
                <Label htmlFor="pref-company" className="text-xs font-semibold block">
                  Company Name
                </Label>
                <span className="text-[11px] text-slate-500">
                  Show organization name
                </span>
              </div>
              <Switch
                id="pref-company"
                checked={config.showCompany}
                onCheckedChange={(val) => onChange("showCompany", val)}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ================= ADD / EDIT MODAL ================= */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingId ? "Edit Testimonial" : "Add Testimonial"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Provide the reviewer's details and feedback.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveModal} className="space-y-3.5 py-1">
            {/* Reviewer Name */}
            <div className="space-y-1">
              <Label htmlFor="form-name" className="text-xs font-semibold">
                Reviewer Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <Input
                  id="form-name"
                  value={form.name || ""}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Sarah Jenkins"
                  className="h-9 pl-9 text-xs"
                  required
                />
              </div>
            </div>

            {/* Review Text */}
            <div className="space-y-1">
              <Label htmlFor="form-review" className="text-xs font-semibold">
                Review Text <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="form-review"
                value={form.review || ""}
                onChange={(e) => setForm((f) => ({ ...f, review: e.target.value }))}
                placeholder="Share the customer's quote or experience..."
                rows={3}
                className="text-xs resize-none"
                required
              />
            </div>

            {/* Rating */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Star Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, rating: star }))}
                    className="p-1 hover:scale-110 transition-transform"
                    aria-label={`Select ${star} stars`}
                  >
                    <Star
                      className={cn(
                        "h-5 w-5",
                        star <= (form.rating ?? 5)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200 fill-transparent"
                      )}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs text-slate-500 font-medium">
                  {form.rating ?? 5} / 5
                </span>
              </div>
            </div>

            {/* Designation & Company Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="form-desig" className="text-xs font-semibold">
                  Job Title
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    id="form-desig"
                    value={form.designation || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, designation: e.target.value }))
                    }
                    placeholder="e.g. CMO"
                    className="h-9 pl-9 text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="form-comp" className="text-xs font-semibold">
                  Company
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    id="form-comp"
                    value={form.company || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, company: e.target.value }))
                    }
                    placeholder="e.g. TechCorp"
                    className="h-9 pl-9 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Photo URL */}
            <div className="space-y-1">
              <Label htmlFor="form-photo" className="text-xs font-semibold">
                Photo URL (optional)
              </Label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <Input
                  id="form-photo"
                  value={form.photoUrl || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, photoUrl: e.target.value }))
                  }
                  placeholder="https://example.com/avatar.jpg"
                  className="h-9 pl-9 text-xs"
                />
              </div>
            </div>

            {/* Website URL */}
            <div className="space-y-1">
              <Label htmlFor="form-web" className="text-xs font-semibold">
                Reviewer Link / Website (optional)
              </Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <Input
                  id="form-web"
                  value={form.websiteUrl || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, websiteUrl: e.target.value }))
                  }
                  placeholder="https://example.com"
                  className="h-9 pl-9 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs bg-purple-600 hover:bg-purple-700 text-white"
              >
                {editingId ? "Save Changes" : "Add Testimonial"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * Miniature Visual Preview renderer inside Design thumbnails
 */
function DesignMiniaturePreview({
  designId,
}: {
  designId: TestimonialSliderConfig["designId"];
}) {
  if (designId === "modern-cards") {
    return (
      <div className="h-full flex flex-col justify-between p-1.5 bg-white rounded-md shadow-2xs border border-slate-200">
        <div className="flex items-center gap-1">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <div className="h-1.5 w-4/5 rounded bg-slate-300" />
          <div className="h-1.5 w-3/5 rounded bg-slate-200" />
        </div>
        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
          <div className="h-3.5 w-3.5 rounded-full bg-purple-500" />
          <div className="h-1.5 w-12 rounded bg-slate-400" />
        </div>
      </div>
    );
  }

  if (designId === "minimal") {
    return (
      <div className="h-full flex flex-col justify-between p-1.5 bg-slate-50 border-l-2 border-l-purple-600 border border-slate-200 rounded-md">
        <div className="h-1 w-10 bg-amber-400 rounded-sm" />
        <div className="space-y-1">
          <div className="h-1.5 w-full rounded bg-slate-400" />
          <div className="h-1.5 w-2/3 rounded bg-slate-300" />
        </div>
        <div className="flex items-center gap-1 pt-1 border-t border-slate-200">
          <div className="h-3 w-3 rounded-full bg-slate-400" />
          <div className="h-1.5 w-10 rounded bg-slate-500" />
        </div>
      </div>
    );
  }

  if (designId === "elegant") {
    return (
      <div className="h-full flex flex-col justify-between p-1.5 bg-amber-50/60 border border-amber-200 rounded-md">
        <div className="flex justify-between items-center">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            ))}
          </div>
          <div className="h-1 w-6 rounded bg-amber-700/60" />
        </div>
        <div className="space-y-1">
          <div className="h-1.5 w-full rounded bg-amber-950/60" />
          <div className="h-1.5 w-4/5 rounded bg-amber-950/40" />
        </div>
        <div className="flex items-center gap-1.5 pt-1 border-t border-amber-200">
          <div className="h-3.5 w-3.5 rounded-full bg-amber-600" />
          <div className="h-1.5 w-10 rounded bg-amber-900" />
        </div>
      </div>
    );
  }

  if (designId === "dark") {
    return (
      <div className="h-full flex flex-col justify-between p-1.5 bg-slate-900 border border-slate-700 rounded-md">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          ))}
        </div>
        <div className="space-y-1">
          <div className="h-1.5 w-4/5 rounded bg-slate-200" />
          <div className="h-1.5 w-3/5 rounded bg-slate-400" />
        </div>
        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800">
          <div className="h-3.5 w-3.5 rounded-full bg-purple-500" />
          <div className="h-1.5 w-12 rounded bg-slate-300" />
        </div>
      </div>
    );
  }

  if (designId === "quote-focus") {
    return (
      <div className="h-full flex flex-col items-center justify-between p-1.5 bg-white border border-purple-200 rounded-md text-center">
        <div className="h-4 w-4 rounded bg-purple-100 flex items-center justify-center text-purple-600">
          <Quote className="h-2.5 w-2.5" />
        </div>
        <div className="space-y-1 w-full flex flex-col items-center">
          <div className="h-1.5 w-3/4 rounded bg-slate-700" />
          <div className="h-1.5 w-1/2 rounded bg-slate-400" />
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-purple-600" />
          <div className="h-1 w-8 rounded bg-slate-600" />
        </div>
      </div>
    );
  }

  // compact
  return (
    <div className="h-full flex flex-col justify-between p-1.5 bg-white border border-slate-200 rounded-md">
      <div className="flex items-center gap-1">
        <div className="h-3.5 w-3.5 rounded-full bg-emerald-500" />
        <div className="h-1.5 w-12 rounded bg-slate-600" />
        <div className="h-1 w-6 bg-amber-400 rounded-xs ml-auto" />
      </div>
      <div className="space-y-1">
        <div className="h-1.5 w-full rounded bg-slate-400" />
        <div className="h-1.5 w-4/5 rounded bg-slate-300" />
      </div>
    </div>
  );
}
