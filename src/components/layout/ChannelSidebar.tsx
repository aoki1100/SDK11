import React from 'react';
import { useApp } from '../AppContext';

export const ChannelSidebar: React.FC = () => {
  const { activeChannel, setActiveChannel, currentUser, activeTab, systemRoles } = useApp();

  const isSuper = currentUser.role === '超级管理员' || currentUser.role === '管理员' || currentUser.username === 'admin';
  
  // Find current user's role channels for this active tab
  const matchedRole = systemRoles.find(r => r.name === currentUser.role);
  const roleTabChannels = matchedRole?.tabChannels?.[activeTab] || ['tiktok', 'facebook', 'google'];

  // Base user authorized channels
  const userAuthorizedChannels = currentUser.authorizedChannels || [];

  // Allowed channels is the intersection of user authorized channels and role's tab channels
  const allowedChannels = isSuper 
    ? roleTabChannels 
    : userAuthorizedChannels.filter(ch => roleTabChannels.includes(ch as any));

  const channels = [
    {
      id: 'tiktok' as const,
      label: 'TikTok',
      colorClass: 'text-sky-400',
      activeBg: 'bg-[#142642] border-[#22457a]',
      icon: (
        <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center relative overflow-hidden shadow-md">
          <div className="text-white font-extrabold font-mono select-none tracking-tighter text-base relative">
            <span className="text-cyan-400 absolute -left-0.5 -top-0.5">TT</span>
            <span className="text-rose-400 absolute left-0.5 top-0.5">TT</span>
            <span className="text-white relative z-10">TT</span>
          </div>
        </div>
      ),
    },
    {
      id: 'facebook' as const,
      label: 'Facebook',
      colorClass: 'text-blue-400',
      activeBg: 'bg-[#152e5a] border-[#2552a1]',
      icon: (
        <div className="w-10 h-10 rounded-lg bg-[#1877F2] flex items-center justify-center shadow-md">
          <span className="text-white font-black text-xl font-sans tracking-tight">f</span>
        </div>
      ),
    },
    {
      id: 'google' as const,
      label: 'Google',
      colorClass: 'text-emerald-400',
      activeBg: 'bg-[#10344d] border-[#1f5982]',
      icon: (
        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-md">
          <span className="font-extrabold text-lg select-none font-sans flex items-center">
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335] -ml-0.5">o</span>
            <span className="text-[#FBBC05] -ml-0.5">o</span>
          </span>
        </div>
      ),
    }
  ];

  return (
    <div className="w-[74px] bg-[#0c1322] border-r border-[#192b4a] flex flex-col items-center py-5 gap-5 select-none shrink-0 h-full">
      {channels.map((ch) => {
        const isAllowed = allowedChannels.includes(ch.id);
        const isActive = activeChannel === ch.id;

        if (!isAllowed && isActive) {
          // Auto switch to first allowed channel if current active is forbidden
          setTimeout(() => {
            if (allowedChannels.length > 0) {
              setActiveChannel(allowedChannels[0] as any);
            }
          }, 0);
        }

        return (
          <div
            key={ch.id}
            onClick={() => {
              if (!isAllowed) {
                alert(`二级渠道管理：您当前所属企业账号没有 ${ch.label} 渠道的权限！`);
                return;
              }
              setActiveChannel(ch.id);
            }}
            className={`flex flex-col items-center gap-1.5 p-1.5 rounded-lg cursor-pointer group transition-all border w-[62px] text-center relative
              ${!isAllowed ? 'opacity-35 cursor-not-allowed' : ''}
              ${isActive && isAllowed
                ? `${ch.activeBg} text-white shadow-lg` 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#142642]/30'}`}
          >
            <div className="transform group-hover:scale-105 transition-transform">
              {ch.icon}
            </div>
            <span className={`text-[10px] scale-90 font-bold tracking-wider font-sans truncate w-full ${isActive && isAllowed ? ch.colorClass : 'text-slate-400'}`}>
              {ch.label}
            </span>
            {!isAllowed && (
              <div className="absolute top-1 right-1 bg-slate-900 border border-slate-700 p-0.5 rounded-full text-rose-400">
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
