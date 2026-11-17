import LicenseGate from "../../LicenseGate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LicenseGate>{children}</LicenseGate>;
}
