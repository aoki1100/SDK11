import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { SystemUser, SystemRole, Enterprise } from '../../types';
import { ChannelSidebar } from '../layout/ChannelSidebar';
import {
  Users,
  ShieldAlert,
  Menu,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  UserCheck,
  Sliders,
  Settings,
  HelpCircle,
  Building2,
  ShieldCheck,
  Key
} from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const {
    systemUsers,
    setSystemUsers,
    addSystemUser,
    deleteSystemUser,
    addLog,
    systemRoles,
    setSystemRoles,
    enterprises,
    setEnterprises
  } = useApp();

  // Settings subtab: users, roles, menu, enterprises
  const [subSetTab, setSubSetTab] = useState<'users' | 'roles' | 'menu' | 'enterprises'>('users');

  // Input states for New/Edit System User
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  
  const [inUsername, setInUsername] = useState('');
  const [inNickname, setInNickname] = useState('');
  const [inRole, setInRole] = useState(() => systemRoles[0]?.name || '超级管理员');
  const [inStatus, setInStatus] = useState<'正常' | '停用'>('正常');
  const [inEnterprise, setInEnterprise] = useState(() => enterprises[0]?.name || '雨果跨境');
  const [inChannels, setInChannels] = useState<string[]>(['tiktok', 'facebook', 'google']);

  // Modals for Role and Enterprise
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showEnterpriseModal, setShowEnterpriseModal] = useState(false);

  // Input states for New Custom Role
  const [inRoleName, setInRoleName] = useState('');
  const [inRoleCode, setInRoleCode] = useState('');
  const [inRoleDesc, setInRoleDesc] = useState('');
  const [inRoleTabs, setInRoleTabs] = useState<('promotion' | 'creatives' | 'management' | 'logs' | 'settings')[]>(['promotion', 'logs']);
  const [inRoleTabChannels, setInRoleTabChannels] = useState<Record<string, ('tiktok' | 'facebook' | 'google')[]>>({
    promotion: ['tiktok', 'facebook', 'google'],
    creatives: ['tiktok', 'facebook', 'google'],
    management: ['tiktok', 'facebook', 'google'],
    logs: ['tiktok', 'facebook', 'google']
  });

  // Input states for New Enterprise
  const [inEntName, setInEntName] = useState('');
  const [inEntDesc, setInEntDesc] = useState('');
  const [inEntStatus, setInEntStatus] = useState<'正常' | '停用'>('正常');

  // Static menus tree representation
  const [menus, setMenus] = useState([
    { id: 'm1', name: '推广 (Campaigns)', path: '/promotion', icon: 'TT', status: '正常', seq: 1 },
    { id: 'm2', name: '素材 (Creatives)', path: '/creatives', icon: 'Folder', status: '正常', seq: 2 },
    { id: 'm3', name: '管理 (Accounts)', path: '/management', icon: 'Link2', status: '正常', seq: 3 },
    { id: 'm4', name: '日志 (Logs)', path: '/logs', icon: 'FileText', status: '正常', seq: 4 },
    { id: 'm5', name: '系统管理 (Systems)', path: '/settings', icon: 'Settings', status: '正常', seq: 5 }
  ]);

  // Handle submit addition
  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inUsername.trim()) return;

    const existing = systemUsers.find(u => u.username.toLowerCase() === inUsername.toLowerCase());
    if (existing) {
      alert('用户名已存在，请换一个用户名！');
      return;
    }

    const newUser: SystemUser = {
      username: inUsername.toLowerCase().trim(),
      nickname: inNickname.trim() || inUsername.trim(),
      role: inRole,
      status: inStatus,
      enterprise: inEnterprise,
      authorizedChannels: inChannels,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    addSystemUser(newUser);

    // Reset fields
    setInUsername('');
    setInNickname('');
    setInRole(systemRoles[0]?.name || '超级管理员');
    setInStatus('正常');
    setInEnterprise(enterprises[0]?.name || '雨果跨境');
    setInChannels(['tiktok', 'facebook', 'google']);
    setShowUserModal(false);
  };

  const handleEnterpriseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inEntName.trim()) return;

    const existing = enterprises.find(ent => ent.name.toLowerCase() === inEntName.trim().toLowerCase());
    if (existing) {
      alert('该企业主体已存在，请勿重复添加！');
      return;
    }

    const newEnt: Enterprise = {
      id: `ent_${Date.now()}`,
      name: inEntName.trim(),
      status: inEntStatus,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      desc: inEntDesc.trim() || '自主手动新建企业主体'
    };

    setEnterprises(prev => [...prev, newEnt]);
    addLog('系统', `新建企业主体: ${inEntName.trim()}`, 'system', '成功');

    // Reset fields
    setInEntName('');
    setInEntDesc('');
    setInEntStatus('正常');
    setShowEnterpriseModal(false);
  };

  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inRoleName.trim() || !inRoleCode.trim()) return;

    const existingName = systemRoles.find(r => r.name.toLowerCase() === inRoleName.trim().toLowerCase());
    const existingCode = systemRoles.find(r => r.code.toLowerCase() === inRoleCode.trim().toLowerCase());
    if (existingName || existingCode) {
      alert('角色名称或角色代码已存在，请换一个！');
      return;
    }

    if (inRoleTabs.length === 0) {
      alert('请至少为该角色选择一项可访问的Tab模块权限！');
      return;
    }

    const newRole: SystemRole = {
      id: `r_${Date.now()}`,
      name: inRoleName.trim(),
      code: inRoleCode.trim().toLowerCase(),
      desc: inRoleDesc.trim() || '手动新建自定义角色',
      tabs: inRoleTabs,
      tabChannels: inRoleTabChannels,
      isStatic: false
    };

    setSystemRoles(prev => [...prev, newRole]);
    addLog('系统', `新建系统角色: ${inRoleName.trim()} (${inRoleCode.trim()})`, 'system', '成功');

    // Reset fields
    setInRoleName('');
    setInRoleCode('');
    setInRoleDesc('');
    setInRoleTabs(['promotion', 'logs']);
    setInRoleTabChannels({
      promotion: ['tiktok', 'facebook', 'google'],
      creatives: ['tiktok', 'facebook', 'google'],
      management: ['tiktok', 'facebook', 'google'],
      logs: ['tiktok', 'facebook', 'google']
    });
    setShowRoleModal(false);
  };

  const deleteEnterprise = (id: string, name: string) => {
    const hasUsers = systemUsers.some(u => u.enterprise === name);
    if (hasUsers) {
      alert(`无法删除：当前企业 [${name}] 下仍有绑定的协作者用户，请先解除这些用户的企业绑定！`);
      return;
    }
    setEnterprises(prev => prev.filter(ent => ent.id !== id));
    addLog('删除', `删除企业主体: ${name}`, 'system', '成功');
  };

  const deleteRole = (id: string, name: string) => {
    const hasUsers = systemUsers.some(u => u.role === name);
    if (hasUsers) {
      alert(`无法删除：系统当前仍有用户属于 [${name}] 角色，请先修改这些用户的角色赋予！`);
      return;
    }
    setSystemRoles(prev => prev.filter(r => r.id !== id));
    addLog('删除', `删除系统角色: ${name}`, 'system', '成功');
  };

  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setSystemUsers(prev => prev.map(u => u.username === editingUser.username ? editingUser : u));
    addLog('编辑', `配置系统用户 [${editingUser.username}] 状态/角色`, 'system', '成功');
    setEditingUser(null);
  };

  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-48px)] bg-slate-50 text-slate-800 text-xs">

      {/* Settings management shell */}
      <div className="flex-1 flex flex-col overflow-hidden text-xs">
        
        {/* Sub Navigation headers matching business specs */}
        <div className="bg-white border-b border-slate-200 px-6 h-12 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-8 h-full select-none">
            <button
              id="settings-tab-users"
              onClick={() => setSubSetTab('users')}
              className={`h-full px-2 font-medium border-b-2 flex items-center gap-1 cursor-pointer transition-all ${subSetTab === 'users' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              用户管理
            </button>
            <button
              id="settings-tab-roles"
              onClick={() => setSubSetTab('roles')}
              className={`h-full px-2 font-medium border-b-2 flex items-center gap-1 cursor-pointer transition-all ${subSetTab === 'roles' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              角色管理
            </button>
            <button
              id="settings-tab-enterprises"
              onClick={() => setSubSetTab('enterprises')}
              className={`h-full px-2 font-medium border-b-2 flex items-center gap-1 cursor-pointer transition-all ${subSetTab === 'enterprises' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              企业管理
            </button>
            <button
              id="settings-tab-menu"
              onClick={() => setSubSetTab('menu')}
              className={`h-full px-2 font-medium border-b-2 flex items-center gap-1 cursor-pointer transition-all ${subSetTab === 'menu' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              菜单管理
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            {subSetTab === 'users' && (
              <button
                id="open-add-user-modal"
                onClick={() => setShowUserModal(true)}
                className="px-3.5 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[11px] font-semibold rounded cursor-pointer flex items-center gap-1 font-mono"
              >
                <Plus className="w-3.5 h-3.5" /> 新建系统用户
              </button>
            )}
            {subSetTab === 'roles' && (
              <button
                id="open-add-role-modal"
                onClick={() => setShowRoleModal(true)}
                className="px-3.5 py-1.5 bg-[#10b981] hover:bg-[#059669] text-white text-[11px] font-semibold rounded cursor-pointer flex items-center gap-1 font-mono"
              >
                <Plus className="w-3.5 h-3.5" /> 新建系统角色
              </button>
            )}
            {subSetTab === 'enterprises' && (
              <button
                id="open-add-enterprise-modal"
                onClick={() => setShowEnterpriseModal(true)}
                className="px-3.5 py-1.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[11px] font-semibold rounded cursor-pointer flex items-center gap-1 font-mono"
              >
                <Plus className="w-3.5 h-3.5" /> 新建企业主体
              </button>
            )}
          </div>
        </div>

        {/* Dynamic page render depending on system tab */}
        <div className="flex-1 overflow-auto p-4">
          
          {/* Sub Tab index 1: User management */}
          {subSetTab === 'users' && (
            <div className="flex flex-col gap-4">
              {/* 三级权限体系说明卡片 */}
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-4 flex gap-3 text-slate-800">
                <ShieldAlert className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1.5">
                  <h4 className="font-bold text-emerald-900 text-[13px] flex items-center gap-1.5">
                    三级全维度权限隔离控制台 <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">超级管理员特权</span>
                  </h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    当前控制台已激活<strong>企业隔离、渠道授权、角色分权</strong>三重机制，可在新建或编辑协作者时赋予特定范围的权限能力：
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-1 font-sans text-[11px]">
                    <div className="bg-white/80 border border-emerald-100 p-2.5 rounded shadow-2xs">
                      <span className="font-bold text-emerald-800 flex items-center gap-1 mb-1">
                        <span className="bg-emerald-600 text-white w-4 h-4 rounded-full flex items-center justify-center font-mono text-[9px]">1</span>
                        一级企业权限 (企业隔离)
                      </span>
                      <span className="text-slate-600">相同企业的用户采用互相查看当前企业下的渠道，创建广告数据。跨企业数据实现底层完全隔离。</span>
                    </div>
                    <div className="bg-white/80 border border-emerald-100 p-2.5 rounded shadow-2xs">
                      <span className="font-bold text-emerald-800 flex items-center gap-1 mb-1">
                        <span className="bg-emerald-600 text-white w-4 h-4 rounded-full flex items-center justify-center font-mono text-[9px]">2</span>
                        二级渠道管理 (渠道鉴权)
                      </span>
                      <span className="text-slate-600">相同企业下，用户必须拥有对应渠道的权限才能查看和创建对应的广告数据。侧边栏及按钮会自动适配。</span>
                    </div>
                    <div className="bg-white/80 border border-emerald-100 p-2.5 rounded shadow-2xs">
                      <span className="font-bold text-emerald-800 flex items-center gap-1 mb-1">
                        <span className="bg-emerald-600 text-white w-4 h-4 rounded-full flex items-center justify-center font-mono text-[9px]">3</span>
                        三级角色管理 (Tab分权)
                      </span>
                      <span className="text-slate-600">不同的角色拥有不同Tab查看和编辑的权限（推广、素材、管理、日志、系统管理），可在上方下拉菜单进行切换。</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium select-none">
                      <th className="p-3 pl-5">用户名</th>
                      <th className="p-3">昵称</th>
                      <th className="p-3">角色</th>
                      <th className="p-3">企业</th>
                      <th className="p-3">授权渠道</th>
                      <th className="p-3 text-center">状态</th>
                      <th className="p-3 text-center">创建时间</th>
                      <th className="p-3 text-center w-36">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {systemUsers.map(user => (
                      <tr key={user.username} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 pl-5 font-bold text-slate-900 select-all font-mono">{user.username}</td>
                        <td className="p-3 text-slate-700 font-medium">{user.nickname}</td>
                        <td className="p-3">
                          <span className="inline-flex px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-[10px] font-semibold font-mono">
                            {user.role}
                          </span>
                        </td>
                        <td className="p-3 text-slate-700 font-medium">{user.enterprise || '雨果跨境'}</td>
                        <td className="p-3">
                          <div className="flex gap-1 flex-wrap">
                            {user.authorizedChannels && user.authorizedChannels.length > 0 ? (
                              user.authorizedChannels.map(ch => (
                                <span key={ch} className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] uppercase font-mono font-bold">
                                  {ch}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 font-mono text-[10px]">-</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`inline-flex px-2 py-0.5 text-[10px] rounded font-semibold select-none
                            ${user.status === '正常' ? 'bg-emerald-50 text-emerald-600 border border-emerald-25' : 'bg-rose-50 text-rose-500 border border-rose-200'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400 font-mono text-[11px] text-center">{user.createdAt}</td>
                        <td className="p-3 text-center flex items-center justify-center gap-3">
                          <button
                            id={`edit-user-${user.username}`}
                            onClick={() => setEditingUser(user)}
                            className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                          >
                            编辑
                          </button>
                          
                          <button
                            id={`delete-user-${user.username}`}
                            disabled={user.username === 'admin'}
                            onClick={() => {
                              if (user.username === 'admin') return;
                              if (confirm(`深度警告：您确认彻底删除此系统协作者账户 [${user.username}] 吗？`)) {
                                deleteSystemUser(user.username);
                              }
                            }}
                            className={`font-semibold rounded px-1
                              ${user.username === 'admin' 
                                ? 'text-slate-350 cursor-not-allowed opacity-40' 
                                : 'text-rose-600 hover:text-rose-800 hover:bg-rose-50 cursor-pointer'
                              }`}
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub Tab index 2: Roles privileges setter */}
          {subSetTab === 'roles' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-150">
              {systemRoles.map(role => {
                const memberCount = systemUsers.filter(u => u.role === role.name).length;
                return (
                  <div key={role.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs hover:shadow transition-all flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{role.name}</span>
                        <span className="ml-2 font-mono text-[10px] text-slate-400 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded uppercase">
                          {role.code}
                        </span>
                        {role.isStatic && (
                          <span className="ml-1.5 text-[9px] bg-slate-100 text-slate-500 border border-slate-200 rounded px-1 font-mono">
                            内置
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-semibold">
                          成员数: {memberCount} 人
                        </span>
                        {!role.isStatic && (
                          <button
                            id={`delete-role-${role.id}`}
                            onClick={() => {
                              if (confirm(`深度警告：您确认要彻底删除自定义角色 [${role.name}] 吗？`)) {
                                deleteRole(role.id, role.name);
                              }
                            }}
                            className="text-rose-500 hover:text-rose-700 p-0.5 rounded hover:bg-rose-50 cursor-pointer"
                            title="删除自定义角色"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-500 font-sans text-[11px] leading-relaxed min-h-8">
                      {role.desc}
                    </p>

                    <div className="bg-slate-50 rounded p-3 text-[10px] border border-slate-100 mt-auto">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2">
                        <span className="font-semibold text-slate-700">模块页面查看与编辑权限:</span>
                        <span className="text-[9px] text-slate-400">（在菜单栏显示）</span>
                      </div>
                      <div className="flex flex-col gap-2 font-mono text-slate-500">
                        {[
                          { id: 'promotion', name: '推广 (Campaigns)' },
                          { id: 'creatives', name: '素材 (Creatives)' },
                          { id: 'management', name: '管理 (Accounts)' },
                          { id: 'logs', name: '日志 (Logs)' },
                          { id: 'settings', name: '系统管理 (Systems)' }
                        ].map(t => {
                          const isChecked = role.tabs.includes(t.id as any);
                          return (
                            <div key={t.id} className="border border-slate-200/60 rounded p-1.5 bg-white shadow-3xs flex flex-col gap-1">
                              <label className={`flex items-center gap-1.5 ${role.isStatic ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}>
                                <input
                                  type="checkbox"
                                  className="rounded text-blue-600 focus:ring-0"
                                  checked={isChecked}
                                  disabled={role.isStatic}
                                  onChange={() => {
                                    if (role.isStatic) return;
                                    const updatedTabs = isChecked
                                      ? role.tabs.filter(tabId => tabId !== t.id)
                                      : [...role.tabs, t.id as any];
                                    setSystemRoles(prev => prev.map(r => r.id === role.id ? { ...r, tabs: updatedTabs } : r));
                                    addLog('编辑', `配置角色 [${role.name}] 的 [${t.name}] 模块权限`, 'system', '成功');
                                  }}
                                />
                                <span className={isChecked ? 'text-slate-800 font-bold' : 'text-slate-400'}>{t.name}</span>
                              </label>

                              {isChecked && t.id !== 'settings' && (
                                <div className="pl-5 flex flex-wrap items-center gap-2 mt-0.5 border-t border-slate-50 pt-1">
                                  {['tiktok', 'facebook', 'google'].map(channel => {
                                    const roleChannels = role.tabChannels?.[t.id] || ['tiktok', 'facebook', 'google'];
                                    const hasChannel = roleChannels.includes(channel as any);
                                    return (
                                      <label key={channel} className={`flex items-center gap-1 text-[9px] select-none ${role.isStatic ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
                                        <input
                                          type="checkbox"
                                          className="rounded text-emerald-600 focus:ring-0 scale-75"
                                          checked={hasChannel}
                                          disabled={role.isStatic}
                                          onChange={() => {
                                            if (role.isStatic) return;
                                            const currentChannels = role.tabChannels?.[t.id] || ['tiktok', 'facebook', 'google'];
                                            const updatedChannels = hasChannel
                                              ? currentChannels.filter(c => c !== channel)
                                              : [...currentChannels, channel as any];
                                            const updatedTabChannels = {
                                              ...(role.tabChannels || {}),
                                              [t.id]: updatedChannels
                                            };
                                            setSystemRoles(prev => prev.map(r => r.id === role.id ? { ...r, tabChannels: updatedTabChannels } : r));
                                            addLog('编辑', `配置角色 [${role.name}] 的 [${t.name}] 模块 [${channel.toUpperCase()}] 渠道权限`, 'system', '成功');
                                          }}
                                        />
                                        <span className={hasChannel ? 'text-[#059669] font-extrabold' : 'text-slate-400 capitalize'}>
                                          {channel === 'tiktok' ? 'TikTok' : channel === 'facebook' ? 'Facebook' : 'Google'}
                                        </span>
                                      </label>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sub Tab index 4: Enterprises management */}
          {subSetTab === 'enterprises' && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-150">
              {/* 企业隔离权限体系说明卡片 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 text-slate-800">
                <Building2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1.5">
                  <h4 className="font-bold text-blue-900 text-[13px] flex items-center gap-1.5">
                    企业层级深度物理数据隔离面板
                  </h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    当前列表呈现系统内注册的独立经营实体。<strong>同一企业下的所有协作者可以互通查看同一企业的广告账户、素材和数据；不同企业下的数据实现底层完全物理隔离。</strong>
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium select-none">
                      <th className="p-3 pl-5">企业编号</th>
                      <th className="p-3">企业主体名称</th>
                      <th className="p-3">企业简介</th>
                      <th className="p-3 text-center">绑定协作者</th>
                      <th className="p-3 text-center">运营状态</th>
                      <th className="p-3 text-center">注册时间</th>
                      <th className="p-3 text-center w-36">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {enterprises.map(ent => {
                      const memberCount = systemUsers.filter(u => u.enterprise === ent.name).length;
                      const isDefaultEnt = ent.name === '雨果跨境' || ent.name === '大侠数码' || ent.name === '天域互娱';
                      return (
                        <tr key={ent.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 pl-5 font-bold font-mono text-slate-500 select-all">{ent.id}</td>
                          <td className="p-3 text-slate-900 font-bold text-xs">{ent.name}</td>
                          <td className="p-3 text-slate-500 max-w-xs truncate" title={ent.desc}>{ent.desc || '-'}</td>
                          <td className="p-3 text-center font-bold text-slate-700">{memberCount} 人</td>
                          <td className="p-3 text-center">
                            <span className={`inline-flex px-2 py-0.5 text-[10px] rounded font-semibold select-none border
                              ${ent.status === '正常' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-500 border-rose-200'}`}>
                              {ent.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400 font-mono text-[11px] text-center">{ent.createdAt}</td>
                          <td className="p-3 text-center">
                            <button
                              id={`delete-ent-${ent.id}`}
                              disabled={isDefaultEnt}
                              onClick={() => {
                                if (confirm(`您确认删除企业主体 [${ent.name}] 吗？\n删除后不可恢复。`)) {
                                  deleteEnterprise(ent.id, ent.name);
                                }
                              }}
                              className={`font-semibold rounded px-2.5 py-1 text-xs
                                ${isDefaultEnt 
                                  ? 'text-slate-350 cursor-not-allowed opacity-45 bg-slate-100' 
                                  : 'text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 transition-all cursor-pointer'
                                }`}
                            >
                              删除
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub Tab index 3: Menu configurations */}
          {subSetTab === 'menu' && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-slate-650">
                <span className="font-bold flex items-center gap-1.5">
                  <Menu className="w-4 h-4 text-slate-500" /> 主控台全站路由
                </span>
                <span className="text-[10px] text-slate-400">控制全站导航呈现与层级序列</span>
              </div>

              <div className="p-4 flex flex-col gap-2.5">
                {menus.map((m, index) => (
                  <div key={m.id} className="flex items-center justify-between p-3 border border-slate-100 rounded bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center font-bold font-mono text-[10px] text-slate-500">
                        {index + 1}
                      </span>
                      <div>
                        <span className="font-semibold text-slate-800 text-xs">{m.name}</span>
                        <span className="ml-3 font-mono text-[10px] text-slate-400">{m.path}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-[10px] text-slate-400">
                        排序权重: <b>{m.seq * 10}</b>
                      </div>
                      <span className="inline-flex px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 text-[9px] rounded font-semibold uppercase">
                        {m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* CREATE SYSTEM USER MODAL */}
      {showUserModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50">
          <form onSubmit={handleUserSubmit} className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150 text-xs">
            <div className="bg-[#0c1a30] text-white px-5 py-3.5 flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-sky-400" /> 新建系统协作者用户
              </span>
              <button type="button" onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-white cursor-pointer select-none">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-4 text-left">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">登录账户名称 *</label>
                <input
                  id="user-username-input"
                  type="text"
                  placeholder="仅支持字母、数字或下划线 (如 operator02)"
                  required
                  value={inUsername}
                  onChange={e => setInUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden focus:border-blue-500 font-mono font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">中文显示昵称 *</label>
                <input
                  id="user-nickname-input"
                  type="text"
                  placeholder="展现个人昵称 (如 投放设计-张三)"
                  required
                  value={inNickname}
                  onChange={e => setInNickname(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden focus:border-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">一级企业权限 (所属企业) *</label>
                <select
                  value={inEnterprise}
                  onChange={e => setInEnterprise(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden text-slate-800"
                >
                  {enterprises.map(ent => (
                    <option key={ent.id} value={ent.name}>{ent.name}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">相同企业的用户采用互相查看当前企业下的渠道、创建广告数据</p>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">二级渠道管理 (授权渠道) *</label>
                <div className="flex gap-4 bg-slate-50 border border-slate-300 rounded px-3 py-2">
                  {['tiktok', 'facebook', 'google'].map(ch => {
                    const checked = inChannels.includes(ch);
                    return (
                      <label key={ch} className="flex items-center gap-1.5 cursor-pointer font-bold capitalize select-none text-slate-700">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            if (checked) {
                              setInChannels(inChannels.filter(c => c !== ch));
                            } else {
                              setInChannels([...inChannels, ch]);
                            }
                          }}
                          className="rounded text-blue-600 focus:ring-0"
                        />
                        <span>{ch}</span>
                      </label>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">拥有对应渠道的权限才能查看和创建对应的广告数据</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">赋予特权角色 *</label>
                  <select
                    value={inRole}
                    onChange={e => setInRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden text-slate-800"
                  >
                    {systemRoles.map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">登入授权状态 *</label>
                  <select
                    value={inStatus}
                    onChange={e => setInStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden"
                  >
                    <option value="正常">正常 (Active)</option>
                    <option value="停用">停用 (Frozen)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowUserModal(false)}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded text-xs cursor-pointer hover:bg-slate-100"
              >
                取消
              </button>
              <button
                id="user-add-submit-btn"
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer"
              >
                确认创建
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT SYSTEM USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50">
          <form onSubmit={handleEditUserSubmit} className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150 text-xs">
            <div className="bg-[#0c1a30] text-white px-5 py-3.5 flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5">
                <Edit className="w-4 h-4 text-sky-400" /> 编辑系统协作者: {editingUser.username}
              </span>
              <button type="button" onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white cursor-pointer select-none">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-4 text-left">
              <div>
                <label className="block text-slate-605 text-slate-500 font-semibold mb-1">登录名</label>
                <input
                  type="text"
                  disabled
                  value={editingUser.username}
                  className="w-full bg-slate-100 border border-slate-200 text-slate-400 rounded px-3 py-2 text-xs font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">中文显示昵称 *</label>
                <input
                  id="edit-user-nickname-input"
                  type="text"
                  required
                  value={editingUser.nickname}
                  onChange={e => setEditingUser({ ...editingUser, nickname: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden focus:border-blue-500 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">一级企业权限 (所属企业) *</label>
                <select
                  value={editingUser.enterprise || '雨果跨境'}
                  onChange={e => setEditingUser({ ...editingUser, enterprise: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden text-slate-800"
                >
                  {enterprises.map(ent => (
                    <option key={ent.id} value={ent.name}>{ent.name}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">相同企业的用户采用互相查看当前企业下的渠道、创建广告数据</p>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">二级渠道管理 (授权渠道) *</label>
                <div className="flex gap-4 bg-slate-50 border border-slate-300 rounded px-3 py-2">
                  {['tiktok', 'facebook', 'google'].map(ch => {
                    const currentChannels = editingUser.authorizedChannels || [];
                    const checked = currentChannels.includes(ch);
                    return (
                      <label key={ch} className="flex items-center gap-1.5 cursor-pointer font-bold capitalize select-none text-slate-700">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const nextChannels = checked
                              ? currentChannels.filter(c => c !== ch)
                              : [...currentChannels, ch];
                            setEditingUser({ ...editingUser, authorizedChannels: nextChannels });
                          }}
                          className="rounded text-blue-600 focus:ring-0"
                        />
                        <span>{ch}</span>
                      </label>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">拥有对应渠道的权限才能查看和创建对应的广告数据</p>
              </div>

               <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">特殊角色权能 *</label>
                  <select
                    value={editingUser.role}
                    onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden text-slate-800"
                  >
                    {systemRoles.map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">账号使用状态 *</label>
                  <select
                    value={editingUser.status}
                    onChange={e => setEditingUser({ ...editingUser, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden"
                  >
                    <option value="正常">正常 (Active)</option>
                    <option value="停用">停用 (Frozen)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded text-xs cursor-pointer hover:bg-slate-100"
              >
                取消
              </button>
              <button
                id="edit-user-submit-btn"
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer"
              >
                应用更新
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE CUSTOM ROLE MODAL */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50">
          <form onSubmit={handleRoleSubmit} className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150 text-xs text-slate-800">
            <div className="bg-[#10b981] text-white px-5 py-3.5 flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-200" /> 手动添加自定义系统身份
              </span>
              <button type="button" onClick={() => setShowRoleModal(false)} className="text-emerald-100 hover:text-white cursor-pointer select-none">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-4 text-left">
              <div>
                <label className="block text-slate-650 font-semibold mb-1">身份/角色名称 *</label>
                <input
                  id="role-name-input"
                  type="text"
                  placeholder="如: 媒介优化总监, 商务拓展专员"
                  required
                  value={inRoleName}
                  onChange={e => setInRoleName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-500 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-650 font-semibold mb-1">角色唯一标识码 *</label>
                <input
                  id="role-code-input"
                  type="text"
                  placeholder="仅限字母下划线 (如: media_director)"
                  required
                  value={inRoleCode}
                  onChange={e => setInRoleCode(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-500 font-mono font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-650 font-semibold mb-1">身份角色职能描述</label>
                <textarea
                  placeholder="请简单描述当前角色所负责的业务权能"
                  value={inRoleDesc}
                  onChange={e => setInRoleDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-500 h-16 resize-none text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-650 font-semibold mb-1">绑定对应Tab菜单权限 *</label>
                <div className="flex flex-col gap-2.5 bg-slate-50 border border-slate-300 rounded p-3">
                  {[
                    { id: 'promotion', name: '推广 (Campaigns)' },
                    { id: 'creatives', name: '素材 (Creatives)' },
                    { id: 'management', name: '管理 (Accounts)' },
                    { id: 'logs', name: '日志 (Logs)' },
                    { id: 'settings', name: '系统管理 (Systems)' }
                  ].map(tab => {
                    const checked = inRoleTabs.includes(tab.id as any);
                    return (
                      <div key={tab.id} className="flex flex-col gap-1.5 border border-slate-200/50 rounded p-2 bg-white/75">
                        <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800 select-none">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              if (checked) {
                                setInRoleTabs(inRoleTabs.filter(t => t !== tab.id));
                              } else {
                                setInRoleTabs([...inRoleTabs, tab.id as any]);
                              }
                            }}
                            className="rounded text-emerald-600 focus:ring-0"
                          />
                          <span>{tab.name}</span>
                        </label>

                        {checked && tab.id !== 'settings' && (
                          <div className="pl-6 flex items-center gap-4 py-1 border-t border-slate-100 mt-1">
                            {['tiktok', 'facebook', 'google'].map(channel => {
                              const currentChannels = inRoleTabChannels[tab.id] || ['tiktok', 'facebook', 'google'];
                              const isChanChecked = currentChannels.includes(channel as any);
                              return (
                                <label key={channel} className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={isChanChecked}
                                    onChange={() => {
                                      const updated = isChanChecked
                                        ? currentChannels.filter(c => c !== channel)
                                        : [...currentChannels, channel as any];
                                      setInRoleTabChannels({
                                        ...inRoleTabChannels,
                                        [tab.id]: updated
                                      });
                                    }}
                                    className="rounded text-emerald-600 focus:ring-0 scale-90"
                                  />
                                  <span className="capitalize">{channel === 'tiktok' ? 'TikTok' : channel === 'facebook' ? 'Facebook' : 'Google'}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">控制该身份拥有的主Tab切换权限（推广，素材，管理，日志，系统）及所属渠道范围</p>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded text-xs cursor-pointer hover:bg-slate-100"
              >
                取消
              </button>
              <button
                id="role-add-submit-btn"
                type="submit"
                className="px-4 py-1.5 bg-[#10b981] hover:bg-[#059669] text-white rounded text-xs font-semibold cursor-pointer"
              >
                确认创建角色
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE ENTERPRISE MODAL */}
      {showEnterpriseModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50">
          <form onSubmit={handleEnterpriseSubmit} className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150 text-xs text-slate-800">
            <div className="bg-[#3b82f6] text-white px-5 py-3.5 flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-200" /> 手动添加全新企业主体
              </span>
              <button type="button" onClick={() => setShowEnterpriseModal(false)} className="text-blue-100 hover:text-white cursor-pointer select-none">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-4 text-left">
              <div>
                <label className="block text-slate-650 font-semibold mb-1">企业主体全称 *</label>
                <input
                  id="enterprise-name-input"
                  type="text"
                  placeholder="如: 深圳市天行健数码科技有限公司"
                  required
                  value={inEntName}
                  onChange={e => setInEntName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden focus:border-blue-500 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-650 font-semibold mb-1">企业经营介绍/备注</label>
                <textarea
                  placeholder="简述企业主体所属行业或子账号范围等备注信息"
                  value={inEntDesc}
                  onChange={e => setInEntDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden focus:border-blue-500 h-20 resize-none text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-650 font-semibold mb-1">主体正常启用状态 *</label>
                <select
                  value={inEntStatus}
                  onChange={e => setInEntStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden text-slate-850 text-slate-800"
                >
                  <option value="正常">正常运行 (Active)</option>
                  <option value="停用">冻结/停用 (Suspended)</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">停用后该企业主体将不接受新的协作者帐号绑定</p>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEnterpriseModal(false)}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded text-xs cursor-pointer hover:bg-slate-100"
              >
                取消
              </button>
              <button
                id="enterprise-add-submit-btn"
                type="submit"
                className="px-4 py-1.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded text-xs font-semibold cursor-pointer"
              >
                确认创建企业
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
