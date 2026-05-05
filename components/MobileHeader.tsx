import React from 'react';
import { ViewState } from '../types';
import { ArrowLeft, Menu, Bell, User } from 'lucide-react';

interface MobileHeaderProps {
    currentView: ViewState;
    currentSubView?: string | null;
    onBack: () => void;
    showBack: boolean;
    onOpenSidebar: () => void;
    onOpenNotifications: () => void;
    currentUser: any;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
    currentView,
    currentSubView,
    onBack,
    showBack,
    onOpenSidebar,
    onOpenNotifications,
    currentUser
}) => {
    return (
        <header className="md:hidden h-16 bg-ecomattBlack border-b border-white/5 flex items-center justify-between px-4 sticky top-0 z-50">
            <div className="flex items-center gap-3">
                {showBack ? (
                    <button
                        onClick={onBack}
                        className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white active:scale-90 transition"
                    >
                        <ArrowLeft size={20} />
                    </button>
                ) : (
                    <button
                        onClick={onOpenSidebar}
                        className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white active:scale-90 transition"
                    >
                        <Menu size={20} />
                    </button>
                )}

                <div className="flex-1 min-w-0 flex items-center gap-2">
                    {!showBack && (
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden p-1 shrink-0 shadow-inner">
                            <img src="ecomatt_logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-base font-black text-white tracking-tight leading-tight truncate">
                            {showBack ? (currentSubView || currentView) : 'Ecomatt Farm'}
                        </h1>
                        {!showBack && (
                            <p className="text-[10px] text-ecomattGreen font-bold uppercase tracking-wider mt-0.5 truncate">
                                ● {currentUser?.role}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onOpenNotifications}
                    className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 relative"
                >
                    <Bell size={18} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-ecomattBlack"></span>
                </button>
                <div className="w-10 h-10 bg-ecomattGreen/20 border border-ecomattGreen/30 rounded-xl flex items-center justify-center text-ecomattGreen text-xs font-black">
                    {currentUser?.name?.charAt(0) || 'U'}
                </div>
            </div>
        </header>
    );
};

export default MobileHeader;
