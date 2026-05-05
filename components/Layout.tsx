
import React, { useState, useRef, useEffect } from 'react';
import { ViewState, UserRole, User } from '../types';
import QuickCreateMenu from './QuickCreateMenu';
import MobileNav from './MobileNav';
import MobileHeader from './MobileHeader';
import { X } from 'lucide-react';

interface LayoutProps {
  currentView: ViewState;
  currentSubView?: string | null;
  setView: (view: ViewState, subView?: string) => void;
  children: React.ReactNode;
  onAddClick: () => void; // Fallback for mobile FAB
  onQuickAction: (action: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  showBack?: boolean;
  onBack?: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  currentView,
  currentSubView,
  setView,
  children,
  onAddClick,
  onQuickAction,
  currentUser,
  onLogout,
  showBack = false,
  onBack
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const handleNavClick = (view: ViewState, subView?: string) => {
    if (view === ViewState.Staff) {
      setView(ViewState.Workforce, subView);
    } else {
      setView(view, subView);
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  interface NavItem {
    id: ViewState;
    label: string;
    icon: string;
    roles: string[];
    subView?: string;
  }

  interface NavCategory {
    label: string;
    icon?: string;
    items: NavItem[];
  }

  // Define Categorized Nav Items
  const NAV_CATEGORIES: NavCategory[] = [
    {
      label: 'Core Farm',
      items: [
        { id: ViewState.Dashboard, icon: 'fa-tachometer-alt', label: 'Dashboard', roles: [] },
      ]
    },
    {
      label: 'Livestock Management',
      icon: 'fa-piggy-bank',
      items: [
        { id: ViewState.Pigs, icon: 'fa-database', label: 'Pig Database', roles: ['Farm Manager', 'Herdsman', 'Veterinarian'] },
        { id: ViewState.Vet, icon: 'fa-user-md', label: 'Vet & Medical', roles: ['Farm Manager', 'Veterinarian'] },
        { id: ViewState.AI_Tools, subView: 'Breeding', icon: 'fa-venus-mars', label: 'Breeding AI', roles: ['Farm Manager', 'Veterinarian'] },
        { id: ViewState.AI_Tools, subView: 'Optimizer', icon: 'fa-balance-scale', label: 'Slaughter Optimizer', roles: ['Farm Manager', 'Veterinarian'] },
        { id: ViewState.Genetics, icon: 'fa-dna', label: 'Lineage Explorer', roles: ['Farm Manager', 'Veterinarian'] },
      ]
    },
    {
      label: 'Crops & Horticulture',
      icon: 'fa-seedling',
      items: [
        { id: ViewState.Crops, icon: 'fa-leaf', label: 'Manage Crops', roles: ['Farm Manager', 'General Worker'] },
      ]
    },
    {
      label: 'Sales & CRM',
      icon: 'fa-handshake',
      items: [
        { id: ViewState.CRM, icon: 'fa-users', label: 'CRM Dashboard', roles: ['Farm Manager'] },
        { id: ViewState.POS, icon: 'fa-cash-register', label: 'Farm POS', roles: ['Farm Manager', 'General Worker'] },
        { id: ViewState.Workforce, icon: 'fa-users-gear', label: 'Workforce Hub', roles: ['Farm Manager'] },
        { id: ViewState.CRM, subView: 'Wholesale', icon: 'fa-store', label: 'Wholesale Portal', roles: ['Farm Manager'] },
        { id: ViewState.CRM, subView: 'Zimbabwe', icon: 'fa-globe-africa', label: 'Zim Intelligence Hub', roles: ['Farm Manager'] },
        { id: ViewState.CRM, subView: 'Orders', icon: 'fa-shopping-basket', label: 'Order History', roles: ['Farm Manager'] },
      ]
    },
    {
      label: 'Financial Management',
      icon: 'fa-chart-pie',
      items: [
        { id: ViewState.Finance, icon: 'fa-file-invoice-dollar', label: 'Financial Management', roles: ['Farm Manager'] },
        { id: ViewState.Procurement, icon: 'fa-shield-halved', label: 'Inflation Shield', roles: ['Farm Manager', 'Veterinarian'] },
        { id: ViewState.Finance, subView: 'Logger', icon: 'fa-plus-circle', label: 'Record Transaction', roles: ['Farm Manager'] },
        { id: ViewState.Finance, subView: 'Batch', icon: 'fa-layer-group', label: 'Batch Profitability', roles: ['Farm Manager'] },
        { id: ViewState.Finance, subView: 'Forecast', icon: 'fa-chart-line', label: 'Cash Flow Forecast', roles: ['Farm Manager'] },
        { id: ViewState.Finance, subView: 'Budget', icon: 'fa-tasks', label: 'Budget Analysis', roles: ['Farm Manager'] },
        { id: ViewState.Finance, subView: 'Loans', icon: 'fa-university', label: 'Loans & Debt', roles: ['Farm Manager'] },
      ]
    },
    {
      label: 'Intelligent Farm',
      icon: 'fa-brain',
      items: [
        { id: ViewState.AI_Tools, subView: 'Chat', icon: 'fa-comments', label: 'Smart Assistant', roles: ['Farm Manager', 'Veterinarian'] },
        { id: ViewState.AI_Tools, subView: 'Critical', icon: 'fa-exclamation-triangle', label: 'Critical Watch', roles: ['Farm Manager', 'Veterinarian'] },
      ]
    },
    {
      label: 'Operations',
      icon: 'fa-clipboard-list',
      items: [
        { id: ViewState.Operations, subView: 'Tasks', icon: 'fa-check-double', label: 'Daily Tasks', roles: ['Farm Manager', 'Herdsman', 'Veterinarian', 'General Worker'] },
        { id: ViewState.Calendar, icon: 'fa-calendar-alt', label: 'Farm Calendar', roles: ['Farm Manager', 'Herdsman', 'Veterinarian'] },
        { id: ViewState.Operations, subView: 'Feed', icon: 'fa-utensils', label: 'Feeding Log', roles: ['Farm Manager', 'Herdsman', 'General Worker'] },
        { id: ViewState.Vet, icon: 'fa-heartbeat', label: 'Health Record', roles: ['Farm Manager', 'Veterinarian'] },
        { id: ViewState.PrecisionFeeding, icon: 'fa-calculator', label: 'Precision Feeding', roles: ['Farm Manager', 'Herdsman', 'Veterinarian'] },
        { id: ViewState.PrecisionAg, icon: 'fa-satellite', label: 'Precision Hub', roles: ['Farm Manager', 'Herdsman', 'Veterinarian'] },
        { id: ViewState.FarrowingWatch, icon: 'fa-stopwatch-20', label: 'Farrowing Watch', roles: ['Farm Manager', 'Herdsman', 'Veterinarian'] },
      ]
    },
    {
      label: 'Assets & Logistics',
      icon: 'fa-tractor',
      items: [
        { id: ViewState.Machinery, icon: 'fa-truck-monster', label: 'Machinery Manager', roles: ['Farm Manager', 'Herdsman'] },
        { id: ViewState.Logistics, icon: 'fa-shipping-fast', label: 'Supply Chain Hub', roles: ['Farm Manager'] },
      ]
    },
    {
      label: 'Infrastructure',
      icon: 'fa-building',
      items: [
        { id: ViewState.Energy, icon: 'fa-bolt', label: 'Energy & Solar Hub', roles: ['Farm Manager', 'Herdsman'] },
      ]
    },
    {
      label: 'Operational Security',
      icon: 'fa-shield-virus',
      items: [
        { id: ViewState.Staff, icon: 'fa-id-card', label: 'Staff & Labor', roles: ['Farm Manager'] },
        { id: ViewState.Biosecurity, icon: 'fa-user-shield', label: 'Active Defense', roles: ['Farm Manager', 'Herdsman', 'Veterinarian', 'General Worker'] },
        { id: ViewState.Automation, icon: 'fa-robot', label: 'Auto-Workflows', roles: ['Veterinarian'] },
      ]
    },
    {
      label: 'System Settings',
      icon: 'fa-cog',
      items: [
        { id: ViewState.Settings, icon: 'fa-user-cog', label: 'Account & Users', roles: ['Farm Manager'] },
      ]
    }
  ];

  const canAccess = (requiredRoles: string[]) => {
    if (!currentUser) return false;
    if (requiredRoles.length === 0) return true;
    return requiredRoles.includes(currentUser.role);
  };

  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const getCategoryColor = (label: string) => 'text-ecomattGreen';

  const getCategoryBg = (label: string) => 'bg-ecomattGreen/10';

  return (
    <div className="min-h-screen bg-grayBg flex flex-col md:flex-row overflow-hidden h-screen">

      {/* Mobile Header */}
      <MobileHeader
        currentView={currentView}
        currentSubView={currentSubView}
        onBack={() => onBack ? onBack() : handleNavClick(ViewState.Dashboard)}
        showBack={showBack}
        onOpenSidebar={() => setMobileSidebarOpen(true)}
        onOpenNotifications={() => setShowNotifications(true)}
        currentUser={currentUser}
      />

      {/* Mobile Sidebar Overlay/Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-[60] bg-ecomattBlack/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute right-0 top-0 bottom-0 w-[80%] bg-ecomattBlack shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-ecomattBlack z-10">
              <h2 className="text-lg font-black text-white tracking-tighter uppercase">All Modules</h2>
              <button onClick={() => setMobileSidebarOpen(false)} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-8 pb-32">
              {NAV_CATEGORIES.map((category, idx) => {
                const accessibleItems = category.items.filter(item => canAccess(item.roles));
                if (accessibleItems.length === 0) return null;
                return (
                  <div key={idx} className="space-y-4">
                    <h3 className="text-[11px] font-black text-ecomattGreen uppercase tracking-[0.3em] px-2 opacity-80">{category.label}</h3>
                    <div className="space-y-2">
                      {accessibleItems.map(item => {
                        const isActive = currentView === item.id && (item.subView === (currentSubView || undefined));
                        return (
                          <button
                            key={item.id + (item.subView || '')}
                            onClick={() => {
                              handleNavClick(item.id, item.subView);
                              setMobileSidebarOpen(false);
                            }}
                            className={`flex items-center gap-4 w-full p-4 rounded-2xl text-[12px] font-black uppercase text-left transition-all active:scale-[0.98] ${isActive
                              ? 'bg-ecomattGreen text-white shadow-lg shadow-green-900/40'
                              : 'bg-white/5 text-gray-300 hover:bg-white/10'
                              }`}
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-white/5'}`}>
                              <i className={`fas ${item.icon} text-sm`}></i>
                            </div>
                            <span className="flex-1 font-bold">{item.label}</span>
                            {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-72 bg-ecomattBlack text-white flex-col h-screen sticky top-0 z-30 shadow-2xl">
        {/* Brand */}
        <div className="p-6 flex items-center gap-3 border-b border-gray-800 shrink-0">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden p-1 shadow-sm">
            <img src="ecomatt_logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight uppercase">Ecomatt<span className="text-ecomattGreen">Farm</span></h1>
            <p className="text-[10px] text-white font-bold uppercase tracking-widest bg-blue-600 px-2 py-0.5 rounded mt-1 inline-block uppercase">Enterprise v12.0</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 no-scrollbar sidebar-scroll">
          {NAV_CATEGORIES.map((category, idx) => {
            const accessibleItems = category.items.filter(item => canAccess(item.roles));
            if (accessibleItems.length === 0) return null;

            // If it's the first category (Core), render directly
            if (category.label === 'Core Farm') {
              return (
                <div key={idx} className="mb-4 p-1 border border-ecomattGreen/20 rounded-2xl bg-white/5 shadow-sm">
                  {accessibleItems.map(item => (
                    <button
                      key={item.id + (item.subView || '')}
                      onClick={() => handleNavClick(item.id, item.subView)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold uppercase text-left transition-all duration-300 relative group ${currentView === item.id && !item.subView
                        ? 'glass-nav text-ecomattGreen shadow-[0_0_20px_rgba(39,205,0,0.15)] scale-[1.02]'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      {currentView === item.id && !item.subView && (
                        <div className="nav-indicator h-6 top-1/2 -translate-y-1/2"></div>
                      )}
                      <i className={`fas ${item.icon} w-5 text-center transition-transform group-hover:scale-110`}></i> {item.label}
                    </button>
                  ))}
                </div>
              );
            }

            const isOpen = openCategory === category.label;

            return (
              <div key={idx} className={`space-y-1 mb-2 border border-ecomattGreen/10 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-white/5 border-ecomattGreen/30 shadow-md' : 'bg-transparent'}`}>
                <button
                  onClick={() => setOpenCategory(isOpen ? null : category.label)}
                  className={`w-full flex items-center justify-between px-4 py-3 font-bold uppercase text-left transition-all group ${isOpen ? 'text-white' : 'text-gray-500 hover:text-300'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <i className={`fas ${category.icon || 'fa-folder'} w-5 text-center transition-all duration-300 ${isOpen ? getCategoryColor(category.label) : 'group-hover:text-white'}`}></i>
                    <span className={`text-sm font-bold uppercase tracking-wider transition-colors ${isOpen ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>{category.label}</span>
                  </div>
                  <i className={`fas fa-chevron-right text-[10px] transition-transform duration-300 ${isOpen ? 'rotate-90 ' + getCategoryColor(category.label) : ''}`}></i>
                </button>

                {isOpen && (
                  <div className="mx-2 mb-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {accessibleItems.map(item => {
                      const isActive = currentView === item.id && (item.subView === (currentSubView || undefined));
                      return (
                        <button
                          key={item.id + (item.subView || '')}
                          onClick={() => handleNavClick(item.id, item.subView)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold uppercase text-left transition-all duration-300 relative group ${isActive
                            ? `${getCategoryColor(category.label)} ${getCategoryBg(category.label)} glass-nav`
                            : 'text-gray-400 hover:text-white hover:translate-x-1'
                            }`}
                        >
                          {isActive && <div className={`nav-indicator h-4 top-1/2 -translate-y-1/2 ${getCategoryBg(category.label).replace('/10', '')}`}></div>}
                          <i className={`fas ${item.icon} text-[10px] transition-transform duration-300 group-hover:scale-125`}></i> {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile Small (Sidebar) */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 p-2 rounded-lg transition" onClick={() => setShowUserMenu(!showUserMenu)}>
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase">
              {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate text-white uppercase">{currentUser?.name || 'User'}</p>
              <p className="text-[10px] text-ecomattGreen font-bold uppercase">● {currentUser?.role || 'Guest'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Global Header Bar - Desktop Only */}
        <header className="hidden md:flex h-16 bg-white border-b border-gray-200 items-center justify-between px-8 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black text-ecomattBlack uppercase tracking-widest">
              {currentSubView || currentView}
            </h2>
            <div className="h-4 w-[1px] bg-gray-200 mx-2"></div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Farm Management System v2.0</p>
          </div>

          <div className="flex items-center gap-6">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 transition relative"
              >
                <i className="fas fa-bell"></i>
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>

            {/* Quick Action Button */}
            <QuickCreateMenu onAction={onQuickAction} />

            {/* Logout */}
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100 uppercase"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 relative">
          {children}
        </main>
      </div>

      <MobileNav
        currentView={currentView}
        currentSubView={currentSubView}
        setView={setView}
        onOpenMore={() => setMobileSidebarOpen(true)}
      />

    </div>
  );
};

export default Layout;
