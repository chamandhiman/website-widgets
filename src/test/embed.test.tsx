import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  CDN_BASE_DOMAIN,
  CDN_EMBED_BASE_URL,
  getWidgetScriptFileName,
  getWidgetScriptUrl,
  getStandardEmbedSnippet,
  getStandaloneEmbedSnippet,
} from "@/lib/embed";
import { WhatsAppInstallModal } from "@/components/whatsapp/WhatsAppInstallModal";
import { AnnouncementInstallModal } from "@/components/announcement/AnnouncementInstallModal";
import { PopupInstallModal } from "@/components/popup/PopupInstallModal";
import { FaqInstallModal } from "@/components/faq/FaqInstallModal";
import { CountdownInstallModal } from "@/components/countdown/CountdownInstallModal";
import { DEFAULT_WHATSAPP_CONFIG } from "@/lib/whatsapp/types";
import { DEFAULT_ANNOUNCEMENT_CONFIG } from "@/lib/announcement/types";
import { DEFAULT_POPUP_CONFIG } from "@/lib/popup/types";
import { DEFAULT_FAQ_CONFIG } from "@/lib/faq/types";
import { DEFAULT_COUNTDOWN_CONFIG } from "@/lib/countdown/types";

describe("Central Embed URL and Snippet Generator", () => {
  it("uses the exact required base domain and embed path", () => {
    expect(CDN_BASE_DOMAIN).toBe("https://cdn.widgets.webtoolocean.com");
    expect(CDN_EMBED_BASE_URL).toBe("https://cdn.widgets.webtoolocean.com/embed");
    // Ensure no old cdn.webtoolocean.com without .widgets.
    expect(CDN_BASE_DOMAIN).not.toBe("https://cdn.webtoolocean.com");
    expect(CDN_BASE_DOMAIN).not.toContain("cdn.widgets..webtoolocean.com");
  });

  it("maps widget types to existing script filenames accurately", () => {
    expect(getWidgetScriptFileName("whatsapp")).toBe("whatsapp.js");
    expect(getWidgetScriptFileName("whatsapp-chat")).toBe("whatsapp.js");
    expect(getWidgetScriptFileName("announcement")).toBe("announcement-bar.js");
    expect(getWidgetScriptFileName("announcement-bar")).toBe("announcement-bar.js");
    expect(getWidgetScriptFileName("popup")).toBe("popup.js");
    expect(getWidgetScriptFileName("popup-widget")).toBe("popup.js");
    expect(getWidgetScriptFileName("faq")).toBe("faq.js");
    expect(getWidgetScriptFileName("faq-accordion")).toBe("faq.js");
    expect(getWidgetScriptFileName("custom-ticker")).toBe("custom-ticker.js");
  });

  it("generates script URLs for production CDN and local development", () => {
    expect(getWidgetScriptUrl("whatsapp")).toBe(
      "https://cdn.widgets.webtoolocean.com/embed/whatsapp.js"
    );
    expect(getWidgetScriptUrl("announcement-bar")).toBe(
      "https://cdn.widgets.webtoolocean.com/embed/announcement-bar.js"
    );
    expect(getWidgetScriptUrl("popup")).toBe(
      "https://cdn.widgets.webtoolocean.com/embed/popup.js"
    );
    expect(getWidgetScriptUrl("faq")).toBe(
      "https://cdn.widgets.webtoolocean.com/embed/faq.js"
    );

    // Local dev override
    expect(
      getWidgetScriptUrl("whatsapp", {
        hostMode: "local",
        localOrigin: "http://localhost:8082",
      })
    ).toBe("http://localhost:8082/embed/whatsapp.js");
  });

  it("generates standard script snippets conforming to spec", () => {
    const waSnippet = getStandardEmbedSnippet({
      widgetType: "whatsapp",
      widgetId: "wto_5wkatkd",
    });
    expect(waSnippet).toContain('src="https://cdn.widgets.webtoolocean.com/embed/whatsapp.js"');
    expect(waSnippet).toContain('data-widget-id="wto_5wkatkd"');
    expect(waSnippet).toContain("async");

    const barSnippet = getStandardEmbedSnippet({
      widgetType: "announcement-bar",
      widgetId: "wto_bar_123",
    });
    expect(barSnippet).toContain('src="https://cdn.widgets.webtoolocean.com/embed/announcement-bar.js"');
    expect(barSnippet).toContain('data-widget-id="wto_bar_123"');

    const popupSnippet = getStandardEmbedSnippet({
      widgetType: "popup",
      widgetId: "wto_pop_456",
    });
    expect(popupSnippet).toContain('src="https://cdn.widgets.webtoolocean.com/embed/popup.js"');
    expect(popupSnippet).toContain('data-widget-id="wto_pop_456"');

    const faqSnippet = getStandardEmbedSnippet({
      widgetType: "faq",
      widgetId: "wto_faq_789",
    });
    expect(faqSnippet).toContain('src="https://cdn.widgets.webtoolocean.com/embed/faq.js"');
    expect(faqSnippet).toContain('data-widget-id="wto_faq_789"');
  });

  it("generates standalone inline snippets with the proper window config key", () => {
    const waInline = getStandaloneEmbedSnippet({
      widgetType: "whatsapp",
      widgetId: "wto_1",
      config: { phoneNumber: "123" },
    });
    expect(waInline).toContain("window.WTO_WIDGET_CONFIGS");
    expect(waInline).toContain("https://cdn.widgets.webtoolocean.com/embed/whatsapp.js");

    const barInline = getStandaloneEmbedSnippet({
      widgetType: "announcement-bar",
      widgetId: "wto_2",
      config: { text: "Sale" },
    });
    expect(barInline).toContain("window.WTO_ANNOUNCEMENT_CONFIGS");
    expect(barInline).toContain("https://cdn.widgets.webtoolocean.com/embed/announcement-bar.js");

    const popupInline = getStandaloneEmbedSnippet({
      widgetType: "popup",
      widgetId: "wto_3",
      config: { title: "Hello" },
    });
    expect(popupInline).toContain("window.WTO_POPUP_CONFIGS");
    expect(popupInline).toContain("https://cdn.widgets.webtoolocean.com/embed/popup.js");
  });

  it("WhatsAppInstallModal renders the updated cdn.widgets.webtoolocean.com URL", () => {
    render(
      <WhatsAppInstallModal
        open={true}
        onOpenChange={() => {}}
        widgetId="wto_test_wa"
        config={DEFAULT_WHATSAPP_CONFIG}
      />
    );
    expect(
      screen.getByText(/https:\/\/cdn\.widgets\.webtoolocean\.com\/embed\/whatsapp\.js/)
    ).toBeInTheDocument();
  });

  it("AnnouncementInstallModal renders the updated cdn.widgets.webtoolocean.com URL", () => {
    render(
      <AnnouncementInstallModal
        open={true}
        onOpenChange={() => {}}
        widgetId="wto_test_ann"
        config={DEFAULT_ANNOUNCEMENT_CONFIG}
      />
    );
    expect(
      screen.getByText(/https:\/\/cdn\.widgets\.webtoolocean\.com\/embed\/announcement-bar\.js/)
    ).toBeInTheDocument();
  });

  it("PopupInstallModal renders the updated cdn.widgets.webtoolocean.com URL", () => {
    render(
      <PopupInstallModal
        isOpen={true}
        onClose={() => {}}
        widgetId="wto_test_pop"
        config={DEFAULT_POPUP_CONFIG}
      />
    );
    expect(
      screen.getAllByText(/https:\/\/cdn\.widgets\.webtoolocean\.com\/embed\/popup\.js/).length
    ).toBeGreaterThan(0);
  });

  it("FaqInstallModal renders the updated cdn.widgets.webtoolocean.com URL", () => {
    render(
      <FaqInstallModal
        open={true}
        onOpenChange={() => {}}
        widgetId="wto_test_faq"
        config={DEFAULT_FAQ_CONFIG}
      />
    );
    expect(
      screen.getByText(/https:\/\/cdn\.widgets\.webtoolocean\.com\/embed\/faq\.js/)
    ).toBeInTheDocument();
  });

  it("CountdownInstallModal renders simplified modal with standard countdown.js embed script and primary Done button", () => {
    render(
      <CountdownInstallModal
        open={true}
        onOpenChange={() => {}}
        widgetId="wto_test_countdown_123"
        config={DEFAULT_COUNTDOWN_CONFIG}
      />
    );

    // Title & description
    expect(screen.getByText("Install Widget")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Copy this code and paste it into your website page where you want the widget to appear."
      )
    ).toBeInTheDocument();

    // Standard embed script with dynamic widget ID & production CDN
    expect(
      screen.getByText(/https:\/\/cdn\.widgets\.webtoolocean\.com\/embed\/countdown\.js/)
    ).toBeInTheDocument();
    expect(screen.getByText(/data-widget-id="wto_test_countdown_123"/)).toBeInTheDocument();

    // Copy Code & Action Buttons
    expect(screen.getByText("Copy Code")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    const doneButton = screen.getByText("Done");
    expect(doneButton).toBeInTheDocument();
    expect(doneButton.className).toContain("bg-purple-600");

    // Technical clutter removed completely
    expect(screen.queryByText("Script Source:")).toBeNull();
    expect(screen.queryByText("Embed Mode:")).toBeNull();
    expect(screen.queryByText("Select Your Website Platform")).toBeNull();
  });
});

