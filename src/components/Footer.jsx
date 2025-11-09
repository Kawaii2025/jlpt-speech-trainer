function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center justify-center md:justify-start">
              <i className="fa fa-language text-primary text-xl mr-2"></i>
              <span className="font-bold">日语听力练习</span>
            </div>
            <p className="text-neutral-400 text-sm mt-2 text-center md:text-left">
              提升你的日语听力能力
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">
              <i className="fa fa-github text-xl"></i>
            </a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">
              <i className="fa fa-twitter text-xl"></i>
            </a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">
              <i className="fa fa-envelope text-xl"></i>
            </a>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-6 pt-6 text-center text-neutral-500 text-sm">
          &copy; 2023 日语听力练习 | 一个帮助你提升日语听力的工具
        </div>
      </div>
    </footer>
  );
}

export default Footer;
