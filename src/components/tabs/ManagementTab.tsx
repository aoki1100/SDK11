import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { AdAccount } from '../../types';
import { ChannelSidebar } from '../layout/ChannelSidebar';
import {
  Link2,
  Search,
  Plus,
  RefreshCw,
  Trash2,
  X,
  Smartphone,
  ShieldCheck,
  Building,
  User,
  AlertTriangle
} from 'lucide-react';

export const ManagementTab: React.FC = () => {
  const {
    accounts,
    addAccount,
    removeAccount,
    activeChannel
  } = useApp();

  const channelLabel = activeChannel === 'tiktok' ? 'TikTok' : activeChannel === 'facebook' ? 'Facebook' : 'Google';
  const associateLabel = activeChannel === 'tiktok' ? '关联 TikTok 商业博主识别号' : activeChannel === 'facebook' ? '关联 Facebook 商务主页 / 广告主认证ID' : '关联 Google 广告客户 ID (CID)';
  const associatePlaceholder = activeChannel === 'tiktok' ? '例如: 用户476036120960' : activeChannel === 'facebook' ? '例如: 主页 page_302819' : '例如: 客户 102-381-1928';
  const apiLabel = activeChannel === 'tiktok' ? 'TikTok Business Center Server API' : activeChannel === 'facebook' ? 'Facebook Graph Ads Marketing API' : 'Google Ads API Google-gRPC Gateway';

  // Sub Tab Selector
  const [mgmtTab, setMgmtTab] = useState<'tiktok_users' | 'ad_accounts'>('ad_accounts');

  // Filters State
  const [searchTerms, setSearchTerms] = useState('');
  const [selectedTikTokAccount, setSelectedTikTokAccount] = useState('');

  // Row selection state
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);

  // Add Account Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccId, setNewAccId] = useState('');
  const [newAccName, setNewAccName] = useState('');
  const [newEntity, setNewEntity] = useState('');
  const [newTikTokAcc, setNewTikTokAcc] = useState('');

  // Rotation states for refresh indicator
  const [isRotating, setIsRotating] = useState(false);

  const handleRefresh = () => {
    setIsRotating(true);
    setTimeout(() => {
      setIsRotating(false);
      alert(`所有关联广告账户状态同步完毕，连接通路符合 ${apiLabel}。`);
    }, 850);
  };

  const handleAddAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccId.trim() || !newAccName.trim()) return;

    addAccount({
      id: newAccId.trim(),
      name: newAccName.trim(),
      entity: newEntity.trim() || '-',
      tiktokAccount: newTikTokAcc.trim() || `用户${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      status: '正常'
    });

    // Reset fields
    setNewAccId('');
    setNewAccName('');
    setNewEntity('');
    setNewTikTokAcc('');
    setShowAddModal(false);
  };

  // Filter connected accounts
  const filteredAccounts = accounts.filter(acc => {
    if ((acc.channel || 'tiktok') !== activeChannel) return false;
    if (searchTerms) {
      const query = searchTerms.toLowerCase();
      const inId = acc.id.toLowerCase().includes(query);
      const inName = acc.name.toLowerCase().includes(query);
      const inEntity = acc.entity.toLowerCase().includes(query);
      if (!inId && !inName && !inEntity) return false;
    }
    if (selectedTikTokAccount && acc.tiktokAccount !== selectedTikTokAccount) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-48px)] bg-slate-50 text-slate-800 text-xs">

      {/* Left sidebar - Channel layout */}
      <ChannelSidebar />

      {/* Management content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header tab selectors */}
        <div className="bg-white border-b border-slate-200 px-6 h-12 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-8 h-full select-none">
            <button
              id="mgmt-tab-tiktok-users"
              onClick={() => setMgmtTab('tiktok_users')}
              className={`h-full px-2 font-medium border-b-2 flex items-center gap-1 cursor-pointer transition-all ${mgmtTab === 'tiktok_users' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {channelLabel}用户
            </button>
            <button
              id="mgmt-tab-ad-accounts"
              onClick={() => setMgmtTab('ad_accounts')}
              className={`h-full px-2 font-medium border-b-2 flex items-center gap-1 cursor-pointer transition-all ${mgmtTab === 'ad_accounts' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              广告账户
            </button>
          </div>
        </div>

        {mgmtTab === 'tiktok_users' ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-white text-slate-400 gap-3">
            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100">
               <Smartphone className="w-7 h-7" />
             </div>
             <div>
               <p className="font-semibold text-slate-700">外部关联 {channelLabel} APP 商业号列表</p>
               <p className="text-xs text-slate-450 mt-1 max-w-sm">此处展示绑定的原生 {channelLabel} 营销/发布主页，绑定后可推送素材进行原生发布代投。</p>
             </div>
             <button
               id="mgmt-user-add-link"
               onClick={() => alert(`${channelLabel} Business OAuth 绑定需打开外部浏览器弹窗。已进入极速模拟。`)}
               className="mt-2 text-xs font-semibold px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded cursor-pointer"
             >
               + 联动绑定 {channelLabel} 博主/主页账号
             </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Filter controls based on Screenshot 3 */}
            <div className="bg-white border-b border-slate-100 p-4 shrink-0 flex flex-wrap items-center justify-between select-none gap-2">
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Search inputs */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    id="search-account-input"
                    type="text"
                    placeholder="搜索 账户ID/名称/主体"
                    value={searchTerms}
                    onChange={e => setSearchTerms(e.target.value)}
                    className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs w-56 focus:outline-hidden focus:border-blue-500 focus:bg-white text-slate-700"
                  />
                </div>

                {/* TikTok channel account filters */}
                <select
                  id="tiktok-user-filter"
                  value={selectedTikTokAccount}
                  onChange={e => setSelectedTikTokAccount(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 focus:outline-hidden focus:border-blue-500 w-44 font-mono"
                >
                  <option value="">{activeChannel === 'tiktok' ? 'TikTok账号' : activeChannel === 'facebook' ? 'Facebook主页' : 'Google账号'}</option>
                  {accounts.filter(acc => (acc.channel || 'tiktok') === activeChannel).map(acc => (
                    <option key={acc.id} value={acc.tiktokAccount}>{acc.tiktokAccount}</option>
                  ))}
                </select>

                <button
                  id="mgmt-query-btn"
                  onClick={() => alert('已完成广告账目筛选')}
                  className="px-4 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold rounded cursor-pointer"
                >
                  查询
                </button>

                {(searchTerms || selectedTikTokAccount) && (
                  <button
                    id="mgmt-reset-btn"
                    onClick={() => {
                      setSearchTerms('');
                      setSelectedTikTokAccount('');
                    }}
                    className="px-3 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs rounded cursor-pointer"
                  >
                    重置
                  </button>
                )}
              </div>
            </div>

            {/* Subaction button row */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2">
                <button
                  id="open-add-acc-btn"
                  onClick={() => setShowAddModal(true)}
                  className="px-3.5 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[11px] font-semibold rounded cursor-pointer flex items-center gap-1 font-mono"
                >
                  <Plus className="w-3.5 h-3.5" /> 添加账户
                </button>

                <button
                  id="batch-unbind-btn"
                  disabled={selectedAccountIds.length === 0}
                  onClick={() => {
                    if (confirm(`确认要解绑这 ${selectedAccountIds.length} 个广告账户吗?`)) {
                      selectedAccountIds.forEach(id => removeAccount(id));
                      setSelectedAccountIds([]);
                    }
                  }}
                  className={`px-3.5 py-1.5 border text-[11px] font-semibold rounded transition-all flex items-center gap-1
                    ${selectedAccountIds.length > 0
                      ? 'border-rose-300 text-rose-600 hover:bg-rose-50 cursor-pointer'
                      : 'border-slate-200 text-slate-400 bg-slate-100 cursor-not-allowed'
                    }`}
                >
                  <Trash2 className="w-3.5 h-3.5" /> 批量解除 ({selectedAccountIds.length})
                </button>
              </div>

              <button
                id="refresh-accs-btn"
                onClick={handleRefresh}
                className="p-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 rounded flex items-center justify-center cursor-pointer transition-colors"
                title="刷新账户同步状态"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto p-4">
              <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium select-none">
                      <th className="p-3 w-10 text-center">
                        <input
                          type="checkbox"
                          className="rounded text-blue-600"
                          checked={selectedAccountIds.length === filteredAccounts.length && filteredAccounts.length > 0}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedAccountIds(filteredAccounts.map(a => a.id));
                            } else {
                              setSelectedAccountIds([]);
                            }
                          }}
                        />
                      </th>
                      <th className="p-3">广告账户ID</th>
                      <th className="p-3">广告账户名称</th>
                      <th className="p-3">主体</th>
                      <th className="p-3">{activeChannel === 'tiktok' ? 'TikTok账号' : activeChannel === 'facebook' ? 'Facebook主页' : 'Google登入CID'}</th>
                      <th className="p-3 text-center w-24">状态</th>
                      <th className="p-3 text-center w-48">创建时间</th>
                      <th className="p-3 text-center w-24">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAccounts.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-10 text-center text-slate-400">
                          {`暂无关联的 ${channelLabel} 广告账户信息，请点击上方按钮添加。`}
                        </td>
                      </tr>
                    ) : (
                      filteredAccounts.map(acc => {
                        const isChecked = selectedAccountIds.includes(acc.id);
                        return (
                          <tr key={acc.id} className={`hover:bg-slate-50 transition-colors ${isChecked ? 'bg-blue-25/50' : ''}`}>
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={e => {
                                  if (e.target.checked) {
                                    setSelectedAccountIds(prev => [...prev, acc.id]);
                                  } else {
                                    setSelectedAccountIds(prev => prev.filter(aid => aid !== acc.id));
                                  }
                                }}
                                className="rounded text-blue-600"
                              />
                            </td>
                            <td className="p-3 font-mono text-slate-600 select-all font-semibold break-all">{acc.id}</td>
                            <td className="p-3 font-bold text-slate-900">{acc.name}</td>
                            <td className="p-3 text-slate-500 font-medium">{acc.entity}</td>
                            <td className="p-3 text-slate-650 font-mono text-slate-600 font-medium">{acc.tiktokAccount}</td>
                            <td className="p-3 text-center">
                              <span className={`inline-flex px-2 py-0.5 text-[10px] rounded-[3px] font-semibold select-none ${acc.status === '正常' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
                                {acc.status}
                              </span>
                            </td>
                            <td className="p-3 text-slate-400 font-mono text-[11px] text-center">{acc.createdAt}</td>
                            <td className="p-3 text-center">
                              <button
                                id={`unbind-acc-${acc.id}`}
                                onClick={() => {
                                  if (confirm(`深度警示：解绑该账户 [${acc.name}] 后，所有同步的素材、在投广告草稿将暂时在本地隐藏，您确认解除关联吗？`)) {
                                    removeAccount(acc.id);
                                    setSelectedAccountIds(prev => prev.filter(aid => aid !== acc.id));
                                  }
                                }}
                                className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 font-semibold cursor-pointer px-2 py-1 rounded"
                              >
                                解除
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ADD AD ACCOUNT PROPOSAL MODAL */}
      {showAddModal && (
        <div id="add-acc-modal" className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50">
          <form onSubmit={handleAddAccountSubmit} className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-[#0c1a30] text-white px-5 py-3.5 flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-sky-400" /> {`联动绑定 ${channelLabel} 广告账户`}
              </span>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white cursor-pointer select-none">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-4 text-left">
              <div>
                <label className="block text-slate-650 font-semibold mb-1">广告账户 ID *</label>
                <input
                  id="add-acc-id-input"
                  type="text"
                  placeholder="例如: 759815223087939600"
                  required
                  value={newAccId}
                  onChange={e => setNewAccId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden focus:border-blue-500 font-mono font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-650 font-semibold mb-1">广告账户名称 *</label>
                <input
                  id="add-acc-name-input"
                  type="text"
                  placeholder="例如: 广告账户-mini-0时区-02"
                  required
                  value={newAccName}
                  onChange={e => setNewAccName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden focus:border-blue-500 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-650 font-semibold mb-1">投放企业/主体名称</label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="公司全称 (例如: 数独网络科技有限公司)"
                    value={newEntity}
                    onChange={e => setNewEntity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-650 font-semibold mb-1">{associateLabel}</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder={associatePlaceholder}
                    value={newTikTokAcc}
                    onChange={e => setNewTikTokAcc(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 text-[10px] leading-relaxed">
                <ShieldCheck className="w-5 h-5 shrink-0 text-blue-500 mt-0.5" />
                <span>系统将通过 {apiLabel} 会话检查安全证书，并在完成握手后获取该账户的投放权限。</span>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded text-xs cursor-pointer hover:bg-slate-100"
              >
                取消
              </button>
              <button
                id="add-acc-submit-btn"
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer"
              >
                授权并绑定
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
