import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { ShieldCheck, User2, Settings2, Info, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, systemUsers, currentUser, setCurrentUser, systemRoles } = useApp();
  const [showDropdown, setShowDropdown] = useState(false);

  const tabsConfig = [
    { id: 'promotion' as const, label: '推广' },
    { id: 'creatives' as const, label: '素材' },
    { id: 'management' as const, label: '管理' },
    { id: 'logs' as const, label: '日志' },
    { id: 'settings' as const, label: '系统管理' }
  ];

  const getRoleTabs = (role: string): string[] => {
    const matchedRole = systemRoles.find(r => r.name === role);
    if (matchedRole) {
      return matchedRole.tabs;
    }
    const r = role || '';
    if (r === '超级管理员' || r === '管理员' || r === 'admin' || r === '超级系统管理员') {
      return ['promotion', 'creatives', 'management', 'logs', 'settings'];
    }
    if (r === '广告投放专家') {
      return ['promotion', 'creatives', 'logs'];
    }
    if (r === '创意设计师') {
      return ['creatives', 'logs'];
    }
    if (r === '媒介运营专员' || r === '账号关系专员' || r === '媒介运营') {
      return ['management', 'logs'];
    }
    return ['logs']; // default safety tab
  };

  const allowedTabIds = getRoleTabs(currentUser.role);
  const allowedTabs = tabsConfig.filter(t => allowedTabIds.includes(t.id));

  // Auto redirect active tab if forbidden
  if (!allowedTabIds.includes(activeTab)) {
    setTimeout(() => {
      if (allowedTabIds.length > 0) {
        setActiveTab(allowedTabIds[0] as any);
      }
    }, 0);
  }

  return (
    <header className="relative bg-[#0c1a30] text-slate-100 flex items-center justify-between px-6 h-12 border-b border-[#132c54] select-none z-50">
      {/* Logo Area */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1d4ed8] text-white font-bold text-sm tracking-wide rounded shadow-sm">
          <span className="text-white bg-transparent">AD</span>
          <span className="text-xs font-mono font-medium opacity-90 px-1 bg-[#0f172a] rounded">Beta</span>
        </div>
        <span className="font-semibold text-[15px] text-white tracking-wider font-sans">AdTool Beta</span>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="flex h-full pl-8 mr-auto">
        {allowedTabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              id={`nav-tab-${tab.id}`}
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setShowDropdown(false);
              }}
              className={`relative px-6 flex items-center justify-center text-sm font-medium transition-all duration-200 h-full cursor-pointer
                ${isActive 
                  ? 'bg-[#182a4d] text-white border-b-2 border-[#3b82f6]' 
                  : 'text-slate-300 hover:text-white hover:bg-[#132442]'
                }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* User Actions */}
      <div className="relative">
        <button 
          id="user-profile-menu-btn"
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 hover:bg-[#132442] px-3 py-1.5 rounded-md transition-all cursor-pointer text-sm"
        >
          <div className="w-6 h-6 rounded-full bg-[#3b82f6] text-white flex items-center justify-center font-bold text-xs capitalize">
            {currentUser.username ? currentUser.username[0] : 'U'}
          </div>
          <span className="text-slate-300 hover:text-white transition-colors">{currentUser.nickname}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {showDropdown && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute right-0 mt-1 w-64 bg-[#111e35] border border-[#1e3a6a] rounded-lg shadow-xl py-1 text-slate-200 z-50 overflow-hidden text-xs">
              <div className="px-4 py-2 border-b border-[#1e3a6a] bg-[#0c1322]">
                <p className="font-semibold text-slate-100 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3b82f6]" /> {currentUser.nickname}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">角色: {currentUser.role}</p>
                <p className="text-[10px] text-blue-400 mt-0.5 font-semibold">企业: {currentUser.enterprise || '雨果跨境'}</p>
                <p className="text-[10px] text-emerald-400 mt-0.5 font-mono">
                  渠道权限: {currentUser.authorizedChannels ? currentUser.authorizedChannels.join(', ').toUpperCase() : '无'}
                </p>
              </div>
              <div className="py-1 border-b border-[#1e3a6a]">
                <button
                  id="user-profile-btn"
                  onClick={() => { setActiveTab('settings'); setShowDropdown(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-[#182e56] flex items-center gap-2 text-slate-300"
                >
                  <User2 className="w-3.5 h-3.5 text-slate-400" /> 用户权限管理
                </button>
              </div>

              {/* Quick Switch for Testing */}
              <div className="bg-[#090f1a]">
                <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 border-b border-[#1e3a6a] uppercase tracking-wider">
                  切换用户 (测试各级隔离)
                </div>
                <div className="max-h-56 overflow-y-auto divide-y divide-[#1e3a6a]/30">
                  {systemUsers.map(user => {
                    const isSelected = user.username === currentUser.username;
                    return (
                      <button
                        key={user.username}
                        onClick={() => {
                          setCurrentUser(user);
                          setShowDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-[#182e56] flex flex-col gap-0.5 transition-colors border-l-2 text-left ${isSelected ? 'border-blue-500 bg-[#142642]' : 'border-transparent'}`}
                      >
                        <div className="flex justify-between items-center w-full gap-1">
                          <span className="font-semibold text-slate-200 truncate">{user.nickname}</span>
                          <span className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded shrink-0">{user.role}</span>
                        </div>
                        <div className="flex justify-between items-center text-[9px] text-slate-400 w-full mt-0.5">
                          <span className="truncate max-w-[120px] text-blue-300">企业: {user.enterprise || '雨果跨境'}</span>
                          <span className="text-[8px] text-emerald-400 shrink-0">({user.authorizedChannels ? user.authorizedChannels.join(', ').toUpperCase() : 'None'})</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-[#1e3a6a]">
                <div className="px-4 py-1.5 text-[10px] text-slate-400 font-mono flex items-center gap-1 bg-[#090f1a]">
                  <Info className="w-3 h-3 text-slate-400" /> Build 2026.06.29-LTS
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
