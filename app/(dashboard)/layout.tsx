import Sidebar from "./components/sidebar";
import "./globals.css";


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <div
    >
      <div className="min-h-full flex">
        <Sidebar/>
        <div>
        {children}
        </div>
        </div>
    </div>
  );
}
