export const NavbarMobile: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around text-gray-600">
        <a href="#home" className="p-2">
          <i className="fas fa-home"></i>
        </a>
        <a href="#profits" className="p-2">
          <i className="fas fa-wallet"></i>
        </a>
        <a href="#inventory" className="p-2">
          <i className="fas fa-boxes"></i>
        </a>
        <a href="#settings" className="p-2">
          <i className="fas fa-user-cog"></i>
        </a>
      </div>
    </nav>
  );
};
