import Hero from "@/components/Hero";
import ClientWrapper from "@/components/ClientWrapper";

export default function Home() {
  return (
    <main className="main">
      <ClientWrapper>
        <Hero />
      </ClientWrapper>
    </main>
  );
}
