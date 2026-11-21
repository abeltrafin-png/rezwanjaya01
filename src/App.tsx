import { useState } from 'react';
import { TabRoute, BlangkoProduct, DigitalTheme, PortfolioItem } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { SpecModal } from './components/SpecModal';
import { DigitalDemoModal } from './components/DigitalDemoModal';
import { PortfolioModal } from './components/PortfolioModal';
import { HomeView } from './views/HomeView';
import { CatalogView } from './views/CatalogView';
import { PricingView } from './views/PricingView';
import { CompanyView } from './views/CompanyView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabRoute>('beranda');
  const [selectedProduct, setSelectedProduct] = useState<BlangkoProduct | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<DigitalTheme | null>(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioItem | null>(null);
  const [catalogSearch, setCatalogSearch] = useState<string>('');

  const handleOpenProductSpec = (product: BlangkoProduct) => {
    setSelectedProduct(product);
  };

  const handleOpenDigitalDemo = (theme: DigitalTheme) => {
    setSelectedTheme(theme);
  };

  const handleOpenPortfolioModal = (item: PortfolioItem) => {
    setSelectedPortfolio(item);
  };

  const handleSearchFromHome = (query: string) => {
    setCatalogSearch(query);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF8] text-[#151d1a]">
      {/* Persistent Global Navigation */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main View Display */}
      <main className="flex-1 w-full">
        {currentTab === 'beranda' && (
          <HomeView
            setCurrentTab={setCurrentTab}
            onOpenProductSpec={handleOpenProductSpec}
            onSearchCatalog={handleSearchFromHome}
          />
        )}

        {currentTab === 'katalog' && (
          <CatalogView
            onOpenProductSpec={handleOpenProductSpec}
            onOpenDigitalDemo={handleOpenDigitalDemo}
            initialSearchQuery={catalogSearch}
          />
        )}

        {currentTab === 'harga' && <PricingView />}

        {currentTab === 'perusahaan' && (
          <CompanyView onOpenPortfolioModal={handleOpenPortfolioModal} />
        )}
      </main>

      {/* Persistent Global Footer */}
      <Footer setCurrentTab={setCurrentTab} />

      {/* Persistent Floating WhatsApp CTA Widget */}
      <FloatingWhatsApp />

      {/* Specification Modal */}
      <SpecModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Digital Wedding Theme Smartphone Simulator Modal */}
      <DigitalDemoModal
        theme={selectedTheme}
        onClose={() => setSelectedTheme(null)}
      />

      {/* Portfolio Item Detail Modal */}
      <PortfolioModal
        item={selectedPortfolio}
        onClose={() => setSelectedPortfolio(null)}
      />
    </div>
  );
}
