import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import About from "@/components/About";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import SweetNotePopup from "@/components/SweetNotePopup"; // Importar o novo componente

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ProductGrid />
        <About />
        <HowItWorks />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
      <SweetNotePopup /> {/* Adicionar o pop-up aqui */}
    </div>
  );
};

export default Index;