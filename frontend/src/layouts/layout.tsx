// import Footer from "@/components/Footer";
// import Header from "@/components/Header";
// import Hero from "@/components/Hero";

// type Props = {
//   children: React.ReactNode;
//   showHero?: boolean;
// };

// const Layout = ({ children, showHero = false }: Props) => {
//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header/>
//       {showHero && <Hero />}
//       <div className="container mx-auto flex-1 py-10">{children}</div>
//       <Footer />
//     </div>
//   );
// };

// export default Layout;
import React from "react";
import Header from "@/components/Header";
import TopInfoBar from "@/components/TopInfoBar";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <TopInfoBar />
      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
