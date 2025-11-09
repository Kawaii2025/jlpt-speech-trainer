import { useState, useEffect } from 'react';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`bg-white shadow-sm sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-2 shadow' : 'py-4 shadow-sm'
      }`}
      id="navbar"
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <i className="fa fa-language text-primary text-2xl"></i>
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            日语听力练习
          </h1>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-primary font-medium hover:text-primary/80 transition-colors">
            首页
          </a>
          <a href="#" className="text-neutral-700 hover:text-primary transition-colors">
            练习历史
          </a>
          <a href="#" className="text-neutral-700 hover:text-primary transition-colors">
            学习资源
          </a>
          <a href="#" className="text-neutral-700 hover:text-primary transition-colors">
            关于
          </a>
        </nav>
        <button
          className="md:hidden text-neutral-700 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <i className="fa fa-bars text-xl"></i>
        </button>
      </div>
      
      {/* 移动端菜单 */}
      <div 
        className={`md:hidden bg-white shadow-md absolute w-full ${
          mobileMenuOpen ? '' : 'hidden'
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
          <a href="#" className="text-primary font-medium py-2 hover:bg-gray-50 px-2 rounded">
            首页
          </a>
          <a href="#" className="text-neutral-700 py-2 hover:bg-gray-50 px-2 rounded">
            练习历史
          </a>
          <a href="#" className="text-neutral-700 py-2 hover:bg-gray-50 px-2 rounded">
            学习资源
          </a>
          <a href="#" className="text-neutral-700 py-2 hover:bg-gray-50 px-2 rounded">
            关于
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;
