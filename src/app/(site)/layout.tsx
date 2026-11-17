import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Tracker from "@/components/Tracker";
import { getSiteSettings } from "@/lib/settings";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <>
      <Header phoneDisplay={settings.phoneDisplay} phone={settings.phone} />
      <main className="flex-1">{children}</main>
      <Footer />
      <Tracker />
      <WhatsAppButton
        variant="floating"
        phoneNumber={settings.whatsappNumber}
        message="Hi, I'd like to enquire about your RCC concrete products."
      />
    </>
  );
}
