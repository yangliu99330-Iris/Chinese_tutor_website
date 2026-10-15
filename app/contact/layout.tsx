import JsonLd from "@/components/seo/JsonLd";
import { contactJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Miss Yang | Ask a Question or Book a Lesson",
  description:
    "Get in touch with Miss Yang by email, WhatsApp or WeChat, or book a Mandarin or Chinese dance lesson online directly.",
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={contactJsonLd()} />
      {children}
    </>
  );
}
