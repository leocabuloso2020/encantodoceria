import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import About from "@/components/About";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import SweetNotePopup from "@/components/SweetNotePopup";
import SweetMessagesWall from "@/components/SweetMessagesWall";
import { useEffect } from "react"; // Importar useEffect
import { useLocation } from "react-router-dom"; // Importar useLocation

const Index = () => {
  const location = useLocation(); // Inicializa useLocation

  useEffect(() => {
    // Verifica se há um scrollToId no estado da localização
    if (location.state?.scrollToId) {
      const element = document.getElementById(location.state.scrollToId);
      if (element) {
        // Rola para o elemento
        element.scrollIntoView({ behavior: 'smooth' });
        // Limpa o estado para evitar rolagem repetida em re-renderizações futuras
        // Nota: Isso pode ser feito de forma mais robusta com um custom hook ou
        // limpando o estado da navegação, mas para este caso, a rolagem única é suficiente.
        // O estado será limpo em uma nova navegação ou recarregamento.
      }
    }
  }, [location.state]); // Re-executa o efeito quando o estado da localização muda

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
        <SweetMessagesWall />
      </main>
      <Footer />
      <SweetNotePopup />
    </div>
  );
};

export default Index;