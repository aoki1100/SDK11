import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Campaign, AdGroup, Ad, Draft } from '../../types';
import { Search, Play, Pause, Edit, Plus, Check, X, Sliders, ChevronRight, Folder, RefreshCw, FileText, ChevronDown } from 'lucide-react';
import { AdCreatorFullScreen } from './AdCreatorFullScreen';
import { ChannelSidebar } from '../layout/ChannelSidebar';

export const PromotionTab: React.FC = () => {
  const {
    campaigns,
    setCampaigns,
    adGroups,
    setAdGroups,
    ads,
    setAds,
    drafts,
    setDrafts,
    accounts,
    materials,
    createCampaign,
    deleteCampaign,
    addLog,
    activeChannel
  } = useApp();

  // Sub tabs: campaigns, adGroups, ads, drafts
  const [subTab, setSubTab] = useState<'campaigns' | 'adgroups' | 'ads' | 'drafts'>('campaigns');

  // New customized creation modals (Dialog 1 & Dialog 2)
  const [showCampaignInitModal, setShowCampaignInitModal] = useState(false);
  const [initObjective, setInitObjective] = useState('应用推广');
  const [initType, setInitType] = useState('小程序');
  const [showFullPageAdCreator, setShowFullPageAdCreator] = useState(false);

  // Synchronize initType based on activeChannel
  useEffect(() => {
    if (activeChannel === 'facebook' || activeChannel === 'google') {
      setInitType('常规应用');
    } else {
      setInitType('小程序');
    }
  }, [activeChannel]);

  // Track activeChannel changes while showFullPageAdCreator is open
  const prevChannelRef = React.useRef(activeChannel);

  useEffect(() => {
    if (showFullPageAdCreator && prevChannelRef.current === 'facebook' && activeChannel !== 'facebook') {
      setShowFullPageAdCreator(false);
      setSubTab('campaigns');
    }
    prevChannelRef.current = activeChannel;
  }, [activeChannel, showFullPageAdCreator]);

  // Query filters
  const [searchName, setSearchName] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Selected for multi action
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<string[]>([]);

  // Helper to determine bid type display label
  const getBidTypeLabel = (campaign: Campaign) => {
    if (campaign.bidType) return campaign.bidType;
    const channel = campaign.channel || 'tiktok';
    if (channel === 'google') {
      return '最大化转化次数';
    } else if (channel === 'facebook') {
      return 'Lowest cost';
    } else {
      return 'oCPM';
    }
  };

  // Editing states
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  // New Ad Wizard Modal States
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  // Wizard fields
  const [wizCampaignName, setWizCampaignName] = useState('csgo_SA');
  const [wizAccountId, setWizAccountId] = useState('');
  const [wizObjective, setWizObjective] = useState('应用推广');
  const [wizType, setWizType] = useState<'Smart+' | 'Standard'>('Smart+');
  const [wizBudgetMode, setWizBudgetMode] = useState<'动态日预算' | '不限'>('动态日预算');
  const [wizBudget, setWizBudget] = useState(20);
  const [wizBudgetOpt, setWizBudgetOpt] = useState(true);

  // Group Settings (Step 2)
  const [wizGroupName, setWizGroupName] = useState('Placements_Global_Group_01');
  const [wizPlacement, setWizPlacement] = useState('TikTok, Pangle');
  const [wizLocation, setWizLocation] = useState('Saudi Arabia');

  // Ad Settings (Step 3)
  const [wizAdName, setWizAdName] = useState('csgo_unboxing_video_v1');
  const [wizCopywriting, setWizCopywriting] = useState('Unlock premium crates! Code CSGO50 for free roll.');
  const [wizSelectedCreatives, setWizSelectedCreatives] = useState<string[]>([]);

  // Trigger toasts
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToastMsg = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleBudgetOptimization = (id: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        const newVal = !c.budgetOptimization;
        addLog('编辑', `更改推广系列 [${c.campaignName}] 预算优化为: ${newVal ? '开启' : '关闭'}`, 'campaign', '成功');
        return { ...c, budgetOptimization: newVal };
      }
      return c;
    }));
    showToastMsg('预算优化状态更改成功');
  };

  const handleToggleStatus = (id: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        const newStatus = c.status1 === '已启用' ? '未启用' as const : '已启用' as const;
        const subStatus = newStatus === '已启用' ? '进行中' as const : '已暂停' as const;
        addLog('编辑', `切换推广系列 [${c.campaignName}] 状态为: ${newStatus}`, 'campaign', '成功');
        return { ...c, status1: newStatus, status2: subStatus };
      }
      return c;
    }));
    showToastMsg('广告系列状态更新成功');
  };

  const handleSaveCampaignEdit = () => {
    if (!editingCampaign) return;
    setCampaigns(prev => prev.map(c => (c.id === editingCampaign.id ? editingCampaign : c)));
    addLog('编辑', `更新推广系列参数: ${editingCampaign.campaignName}`, 'campaign', '成功');
    showToastMsg('推广系列编辑成功');
    setEditingCampaign(null);
  };

  // Submit Wizard
  const handleWizardSubmit = (isDraft: boolean) => {
    const acc = accounts.find(a => a.id === wizAccountId) || accounts[0];
    const advertiserId = acc ? acc.id : '759815223087939600';
    const advertiserName = acc ? acc.name : '数独-雨果-mini-0时区-01';

    const campaignObj = {
      advertiserId,
      advertiserName,
      campaignName: wizCampaignName,
      objective: wizObjective,
      type: wizType,
      budgetMode: wizBudgetMode === '不限' ? '不限' as const : '动态日预算' as const,
      budget: wizBudgetMode === '不限' ? 0 : wizBudget,
      budgetOptimization: wizBudgetOpt,
      roas: '-',
      status1: isDraft ? '未启用' as const : '已启用' as const,
      status2: isDraft ? '已暂停' as const : '进行中' as const
    };

    const groupObj = {
      adGroupName: wizGroupName,
      placement: wizPlacement,
      targetLocation: wizLocation,
      budget: wizBudget,
      status: isDraft ? '暂停' as const : '开启' as const
    };

    createCampaign(
      campaignObj,
      groupObj,
      wizAdName,
      wizCopywriting,
      wizSelectedCreatives
    );

    showToastMsg(isDraft ? '广告设定已成功保存至草稿箱' : '广告系列发布成功，已提交审核！');
    setShowWizard(false);
    setWizardStep(1);
    
    // Clear selections
    setWizCampaignName('csgo_SA');
    setWizGroupName('Placements_Global_Group_01');
    setWizAdName('csgo_unboxing_video_v1');
    setWizSelectedCreatives([]);
  };

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(c => {
    if ((c.channel || 'tiktok') !== activeChannel) return false;
    if (searchName && !c.campaignName.toLowerCase().includes(searchName.toLowerCase())) return false;
    if (selectedAccount && c.advertiserId !== selectedAccount) return false;
    if (selectedStatus && c.status1 !== selectedStatus) return false;
    return true;
  });

  const filteredAdGroups = adGroups.filter(g => {
    const comp = campaigns.find(c => c.id === g.campaignId);
    const belongsToChannel = comp ? (comp.channel || 'tiktok') : 'tiktok';
    if (belongsToChannel !== activeChannel) return false;
    if (searchName && !g.adGroupName.toLowerCase().includes(searchName.toLowerCase())) return false;
    if (selectedAccount) return false; // AdGroup has simplified search in this local mock
    return true;
  });

  const filteredAds = ads.filter(a => {
    const grp = adGroups.find(g => g.id === a.groupId);
    const comp = grp ? campaigns.find(c => c.id === grp.campaignId) : null;
    const belongsToChannel = comp ? (comp.channel || 'tiktok') : 'tiktok';
    if (belongsToChannel !== activeChannel) return false;
    if (searchName && !a.adName.toLowerCase().includes(searchName.toLowerCase())) return false;
    return true;
  });

  const filteredDrafts = drafts.filter(d => {
    if ((d.channel || 'tiktok') !== activeChannel) return false;
    if (searchName && !d.campaignName.toLowerCase().includes(searchName.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-48px)] bg-slate-50 text-slate-800 font-sans">
      
      {/* Toast Alert */}
      {toast && (
        <div id="toast-notification" className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-white transition-all text-xs font-medium duration-300 ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
          {toast.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      {/* Left sidebar - Channel layout */}
      <ChannelSidebar />

      {/* Main Promotion content panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Sub Header tabs and Create Ads btn */}
        <div className="bg-white border-b border-slate-200 px-6 h-12 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-8 h-full">
            <button
              id="subtab-campaigns"
              onClick={() => setSubTab('campaigns')}
              className={`h-full px-2 text-sm font-medium border-b-2 flex items-center gap-1 transition-all cursor-pointer ${subTab === 'campaigns' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              推广系列
            </button>
            <button
              id="subtab-adgroups"
              onClick={() => setSubTab('adgroups')}
              className={`h-full px-2 text-sm font-medium border-b-2 flex items-center gap-1 transition-all cursor-pointer ${subTab === 'adgroups' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              广告组
            </button>
            <button
              id="subtab-ads"
              onClick={() => setSubTab('ads')}
              className={`h-full px-2 text-sm font-medium border-b-2 flex items-center gap-1 transition-all cursor-pointer ${subTab === 'ads' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              广告
            </button>
            <button
              id="subtab-drafts"
              onClick={() => setSubTab('drafts')}
              className={`h-full px-2 text-sm font-medium border-b-2 flex items-center gap-1 transition-all cursor-pointer ${subTab === 'drafts' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              草稿箱
            </button>
          </div>

          <button
            id="create-promotion-btn"
            onClick={() => {
              if (accounts.length === 0) {
                showToastMsg('请先在管理菜单中添加广告账户！', 'error');
                return;
              }
              setShowCampaignInitModal(true);
            }}
            className="px-4 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold rounded shadow-md flex items-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 transition-all font-mono"
          >
            <Plus className="w-3.5 h-3.5" /> 创建广告
          </button>
        </div>

        {/* Filter bar exactly matching Screenshot 1 */}
        <div className="bg-white border-b border-slate-100 p-4 shrink-0 flex flex-wrap items-center gap-2">
          
          {/* Input text filter */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              id="search-name-input"
              type="text"
              placeholder={subTab === 'campaigns' ? "搜索推广系列名称" : subTab === 'adgroups' ? "搜索广告组名称" : subTab === 'ads' ? "搜索广告名称" : "搜索草稿名称"}
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs w-52 focus:outline-hidden focus:border-blue-500 focus:bg-white text-slate-700 placeholder:text-slate-400"
            />
          </div>

          {/* Ad account dropdown filter */}
          <select
            id="account-select-filter"
            value={selectedAccount}
            onChange={e => setSelectedAccount(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 focus:outline-hidden focus:border-blue-500 font-mono w-48"
          >
            <option value="">全部广告账户</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>{acc.name}</option>
            ))}
          </select>

          {/* Tier-1 Status selector */}
          <select
            id="status-select-filter"
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 focus:outline-hidden focus:border-blue-500 w-36"
          >
            <option value="">一级状态</option>
            <option value="已启用">已启用 (Active)</option>
            <option value="未启用">未启用 (Disabled)</option>
          </select>

          {/* Buttons */}
          <button
            id="filter-query-btn"
            onClick={() => {
              showToastMsg('搜索已完成');
            }}
            className="px-4 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold rounded cursor-pointer flex items-center gap-1"
          >
            <Search className="w-3.5 h-3.5" /> 查询
          </button>

          {(searchName || selectedAccount || selectedStatus) && (
            <button
              id="filter-reset-btn"
              onClick={() => {
                setSearchName('');
                setSelectedAccount('');
                setSelectedStatus('');
              }}
              className="px-3 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs rounded cursor-pointer"
            >
              重置
            </button>
          )}
        </div>

        {/* Content body containing tables */}
        <div className="flex-1 overflow-auto p-4">
          <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
            
            {/* Tab view 1: Campaigns */}
            {subTab === 'campaigns' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium select-none">
                      <th className="p-3 w-10 text-center">
                        <input
                          type="checkbox"
                          className="rounded text-blue-600 border-slate-300"
                          checked={selectedCampaignIds.length === filteredCampaigns.length && filteredCampaigns.length > 0}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedCampaignIds(filteredCampaigns.map(c => c.id));
                            } else {
                              setSelectedCampaignIds([]);
                            }
                          }}
                        />
                      </th>
                      <th className="p-3">系列ID</th>
                      <th className="p-3">广告主ID</th>
                      <th className="p-3 text-ellipsis max-w-[120px] overflow-hidden whitespace-nowrap">广告主名称</th>
                      <th className="p-3 font-semibold text-slate-700">系列名称</th>
                      <th className="p-3">推广目标</th>
                      <th className="p-3 w-16 text-center">类型</th>
                      <th className="p-3">预算模式</th>
                      <th className="p-3 text-right">预算</th>
                      <th className="p-3 text-center">预算优化</th>
                      <th className="p-3 text-center">出价类型</th>
                      <th className="p-2 text-center w-12">ROAS</th>
                      <th className="p-3 text-center w-20">一级状态</th>
                      <th className="p-3 text-center w-20">二级状态</th>
                      <th className="p-3 text-center w-36">创建时间</th>
                      <th className="p-3 text-center w-28">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCampaigns.length === 0 ? (
                      <tr>
                        <td colSpan={16} className="text-center p-10 text-slate-400 text-xs">
                          暂无符合条件的推广系列数据
                        </td>
                      </tr>
                    ) : (
                      filteredCampaigns.map(campaign => {
                        const isSelected = selectedCampaignIds.includes(campaign.id);
                        return (
                          <tr key={campaign.id} className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-25/50' : ''}`}>
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={e => {
                                  if (e.target.checked) {
                                    setSelectedCampaignIds(prev => [...prev, campaign.id]);
                                  } else {
                                    setSelectedCampaignIds(prev => prev.filter(tid => tid !== campaign.id));
                                  }
                                }}
                                className="rounded text-blue-600 border-slate-300"
                              />
                            </td>
                            <td className="p-3 font-mono text-slate-500 scale-95 origin-left">{campaign.id}</td>
                            <td className="p-3 font-mono text-slate-400">{campaign.advertiserId}</td>
                            <td className="p-3 text-slate-600 truncate max-w-[140px]" title={campaign.advertiserName}>
                              {campaign.advertiserName}
                            </td>
                            <td className="p-3 font-medium text-slate-900">{campaign.campaignName}</td>
                            <td className="p-3 text-slate-600">{campaign.objective}</td>
                            <td className="p-3 text-center">
                              <span className="inline-block px-1.5 py-0.5 bg-orange-50 text-orange-600 border border-orange-200 rounded-[3px] text-[10px] font-semibold tracking-wide">
                                {campaign.type}
                              </span>
                            </td>
                            <td className="p-3 text-slate-600">{campaign.budgetMode}</td>
                            <td className="p-3 text-right font-semibold text-slate-800">
                              {campaign.budget > 0 ? campaign.budget.toFixed(2) : '-'}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => handleToggleBudgetOptimization(campaign.id)}
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-all ${campaign.budgetOptimization ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}
                              >
                                {campaign.budgetOptimization ? '开' : '关'}
                              </button>
                            </td>
                            <td className="p-3 text-center">
                              <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-150 rounded text-[10.5px] font-bold">
                                {getBidTypeLabel(campaign)}
                              </span>
                            </td>
                            <td className="p-2 text-center text-slate-400">{campaign.roas}</td>
                            <td className="p-3 text-center">
                              <span className={`inline-flex px-2 py-0.5 text-[10px] rounded-[3px] font-semibold select-none ${campaign.status1 === '已启用' ? 'bg-emerald-55 bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-orange-50 text-amber-600 border border-amber-200'}`}>
                                {campaign.status1}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <span className={`inline-flex px-2 py-0.5 text-[10px] rounded-[3px] font-semibold select-none ${campaign.status2 === '进行中' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                {campaign.status2}
                              </span>
                            </td>
                            <td className="p-3 text-slate-400 font-mono text-[11px] text-center">{campaign.createdAt}</td>
                            <td className="p-3 text-center flex items-center justify-center gap-3">
                              <button
                                onClick={() => setEditingCampaign(campaign)}
                                className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                              >
                                编辑
                              </button>
                              <button
                                onClick={() => handleToggleStatus(campaign.id)}
                                className={`font-semibold cursor-pointer ${campaign.status1 === '已启用' ? 'text-amber-600 hover:text-amber-800' : 'text-emerald-600 hover:text-emerald-800'}`}
                              >
                                {campaign.status1 === '已启用' ? '关闭' : '开启'}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab view 2: Ad Groups */}
            {subTab === 'adgroups' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                      <th className="p-3 w-10 text-center">
                        <input type="checkbox" className="rounded border-slate-300" />
                      </th>
                      <th className="p-3">广告组ID</th>
                      <th className="p-3">关联系列</th>
                      <th className="p-3">广告组名称</th>
                      <th className="p-3">投放位置</th>
                      <th className="p-3">目标地区</th>
                      <th className="p-3 text-right">预算</th>
                      <th className="p-3 text-center">状态</th>
                      <th className="p-3 text-center">创建时间</th>
                      <th className="p-3 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAdGroups.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center p-10 text-slate-400">
                          暂无广告组，请点击上方创建广告增加
                        </td>
                      </tr>
                    ) : (
                      filteredAdGroups.map(group => (
                        <tr key={group.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 text-center"><input type="checkbox" className="rounded" /></td>
                          <td className="p-3 font-mono text-slate-500">{group.id}</td>
                          <td className="p-3 text-slate-600">{group.campaignName}</td>
                          <td className="p-3 font-medium text-slate-800">{group.adGroupName}</td>
                          <td className="p-3 text-slate-600">{group.placement}</td>
                          <td className="p-3 text-slate-600">{group.targetLocation}</td>
                          <td className="p-3 text-right font-medium">{group.budget.toFixed(2)}</td>
                          <td className="p-3 text-center">
                            <span className={`inline-flex px-2 py-0.5 text-[10px] rounded-[3px] font-semibold ${group.status === '开启' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                              {group.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400 font-mono text-[11px] text-center">{group.createdAt}</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                setAdGroups(prev => prev.map(g => g.id === group.id ? { ...g, status: g.status === '开启' ? '暂停' : '开启' } : g));
                                showToastMsg('广告组状态已更新');
                              }}
                              className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                            >
                              变更状态
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab view 3: Ads */}
            {subTab === 'ads' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                      <th className="p-3 w-10 text-center">
                        <input type="checkbox" className="rounded border-slate-300" />
                      </th>
                      <th className="p-3">广告ID</th>
                      <th className="p-3">关联广告组</th>
                      <th className="p-3">广告名称</th>
                      <th className="p-3 max-w-[200px]">创意文案</th>
                      <th className="p-3 text-center">绑定的素材数</th>
                      <th className="p-3 text-center">状态</th>
                      <th className="p-3 text-center">创建时间</th>
                      <th className="p-3 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAds.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center p-10 text-slate-400">
                          暂无推广广告，请点击上方创建广告
                        </td>
                      </tr>
                    ) : (
                      filteredAds.map(ad => (
                        <tr key={ad.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 text-center"><input type="checkbox" className="rounded" /></td>
                          <td className="p-3 font-mono text-slate-500">{ad.id}</td>
                          <td className="p-3 text-slate-600">{ad.groupName}</td>
                          <td className="p-3 font-medium text-slate-850">{ad.adName}</td>
                          <td className="p-3 text-slate-600 truncate max-w-[200px]" title={ad.copywriting}>{ad.copywriting}</td>
                          <td className="p-3 text-center font-semibold text-blue-600 font-mono">{ad.creativeIds.length} 个</td>
                          <td className="p-3 text-center">
                            <span className={`inline-flex px-2 py-0.5 text-[10px] rounded-[3px] font-semibold ${ad.status === '开启' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                              {ad.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400 font-mono text-[11px] text-center">{ad.createdAt}</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                setAds(prev => prev.map(a => a.id === ad.id ? { ...a, status: a.status === '开启' ? '暂停' : '开启' } : a));
                                showToastMsg('广告状态已更新');
                              }}
                              className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                            >
                              变更状态
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab view 4: Drafts */}
            {subTab === 'drafts' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                      <th className="p-3">草稿ID</th>
                      <th className="p-3">推广系列</th>
                      <th className="p-3 font-medium">广告组名称</th>
                      <th className="p-3 font-medium">广告名称</th>
                      <th className="p-3 text-right">预算</th>
                      <th className="p-3 text-center">关联素材数</th>
                      <th className="p-3 text-center">草稿状态</th>
                      <th className="p-3 text-center">最后操作时间</th>
                      <th className="p-3 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDrafts.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center p-10 text-slate-400">
                          暂无草稿系列
                        </td>
                      </tr>
                    ) : (
                      filteredDrafts.map(draft => (
                        <tr key={draft.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-mono text-slate-600 text-left font-semibold">{draft.id}</td>
                          <td className="p-3 text-slate-600">{draft.campaignName}</td>
                          <td className="p-3 text-slate-800">{draft.adGroupName}</td>
                          <td className="p-3 text-slate-800">{draft.adName}</td>
                          <td className="p-3 text-right font-medium text-slate-700">{draft.budget.toFixed(2)}</td>
                          <td className="p-3 text-center font-semibold text-indigo-600 font-mono">{draft.creativeCount}</td>
                          <td className="p-3 text-center">
                            <span className="inline-flex px-2 py-0.5 text-[10px] bg-amber-50 text-amber-600 border border-amber-200 rounded-[3px] font-semibold select-none pr-3 animate-pulse">
                              ● {draft.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400 font-mono text-[11px] text-center">{draft.updatedAt}</td>
                          <td className="p-3 text-center flex items-center justify-center gap-2">
                            <button
                              id={`publish-draft-${draft.id}`}
                              onClick={() => {
                                // Simulate publishing
                                setDrafts(prev => prev.filter(d => d.id !== draft.id));
                                addLog('发布', `正式发布草稿内容: ${draft.id}`, 'draft', '成功');
                                showToastMsg('草稿已成功转化为线上广告！');
                              }}
                              className="text-emerald-600 hover:text-emerald-800 font-semibold cursor-pointer"
                            >
                              发布
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              id={`delete-draft-${draft.id}`}
                              onClick={() => {
                                setDrafts(prev => prev.filter(d => d.id !== draft.id));
                                addLog('删除', `废弃草稿: ${draft.id}`, 'draft', '成功');
                                showToastMsg('草稿文件已删除');
                              }}
                              className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                            >
                              删除
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Editing Campaign Modal */}
      {editingCampaign && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 text-xs">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <span className="font-semibold text-sm">编辑推广系列 ID: {editingCampaign.id}</span>
              <button onClick={() => setEditingCampaign(null)} className="text-slate-400 hover:text-white cursor-pointer select-none">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-slate-600 font-medium mb-1.5">推广系列名称 *</label>
                <input
                  id="edit-campaign-name"
                  type="text"
                  value={editingCampaign.campaignName}
                  onChange={e => setEditingCampaign({ ...editingCampaign, campaignName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-medium mb-1.5">广告主 ID *</label>
                  <input
                    type="text"
                    value={editingCampaign.advertiserId}
                    onChange={e => setEditingCampaign({ ...editingCampaign, advertiserId: e.target.value })}
                    className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-2 text-xs font-mono text-slate-500 cursor-not-allowed"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1.5">广告类型 *</label>
                  <select
                    value={editingCampaign.type}
                    onChange={e => setEditingCampaign({ ...editingCampaign, type: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden"
                  >
                    <option value="Smart+">Smart+ (TikTok 自动化智能)</option>
                    <option value="Standard">Standard (普通手动投放)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-medium mb-1.5">推广目标</label>
                  <input
                    type="text"
                    value={editingCampaign.objective}
                    className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-2 text-xs text-slate-500 cursor-not-allowed font-medium"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1.5">出价类型 *</label>
                  <select
                    value={editingCampaign.bidType || (editingCampaign.channel === 'google' ? '最大化转化次数' : editingCampaign.channel === 'facebook' ? 'Lowest cost' : 'oCPM')}
                    onChange={e => setEditingCampaign({ ...editingCampaign, bidType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden font-medium text-slate-800"
                  >
                    {(editingCampaign.channel === 'google') && (
                      <>
                        <option value="最大化转化次数">最大化转化次数</option>
                        <option value="每次转化费用 (tCPA)">每次转化费用 (tCPA)</option>
                        <option value="每次安装费用 (tCPI)">每次安装费用 (tCPI)</option>
                        <option value="最大化转化价值">最大化转化价值</option>
                      </>
                    )}
                    {(editingCampaign.channel === 'facebook') && (
                      <>
                        <option value="Lowest cost">Lowest cost</option>
                        <option value="Cost cap">Cost cap出价限制</option>
                        <option value="Highest value">Highest value</option>
                      </>
                    )}
                    {(!editingCampaign.channel || editingCampaign.channel === 'tiktok') && (
                      <>
                        <option value="oCPM">oCPM</option>
                        <option value="CPC">CPC</option>
                        <option value="CPA">CPA</option>
                        <option value="CPM">CPM</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-medium mb-1.5">预算模式 *</label>
                  <select
                    value={editingCampaign.budgetMode}
                    onChange={e => setEditingCampaign({ ...editingCampaign, budgetMode: e.target.value as any, budget: e.target.value === '不限' ? 0 : editingCampaign.budget })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden"
                  >
                    <option value="动态日预算">动态日预算</option>
                    <option value="不限">不限</option>
                    <option value="指定预算">指定预算</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1.5">预估预算金额 (USD)</label>
                  <input
                    type="number"
                    disabled={editingCampaign.budgetMode === '不限'}
                    value={editingCampaign.budget}
                    onChange={e => setEditingCampaign({ ...editingCampaign, budget: Number(e.target.value) })}
                    className={`w-full border rounded px-3 py-2 text-xs focus:outline-hidden text-right font-semibold ${editingCampaign.budgetMode === '不限' ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-slate-50 border-slate-300 focus:border-blue-500'}`}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800">预算优化已开启</span>
                  <p className="text-[10px] text-slate-400">系统将根据广告表现智联调配预算，提升整体 ROAS</p>
                </div>
                <button
                  onClick={() => setEditingCampaign({ ...editingCampaign, budgetOptimization: !editingCampaign.budgetOptimization })}
                  className={`px-3 py-1 text-[11px] rounded font-semibold cursor-pointer select-none transition-all ${editingCampaign.budgetOptimization ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}
                >
                  {editingCampaign.budgetOptimization ? '已启用 开' : '未启用 关'}
                </button>
              </div>

            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setEditingCampaign(null)}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded text-xs cursor-pointer hover:bg-slate-100"
              >
                取消
              </button>
              <button
                onClick={handleSaveCampaignEdit}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE AD WIZARD MODAL */}
      {showWizard && (
        <div id="create-ad-wizard" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 overflow-y-auto py-10">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in duration-200 flex flex-col text-xs my-auto max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-[#0c1a30] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div>
                <span className="text-sm font-bold tracking-wider text-sky-400 font-mono">TIKTOK 推广服务新建向导</span>
                <p className="text-[10px] text-slate-400 mt-0.5">创建包含：推广系列、广告创意组、创意素材和发布设置</p>
              </div>
              <button onClick={() => setShowWizard(false)} className="text-slate-400 hover:text-white cursor-pointer select-none">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper tracker */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 shrink-0 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${wizardStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
                <span className={`font-semibold ${wizardStep === 1 ? 'text-blue-600' : 'text-slate-500'}`}>新建推广系列</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${wizardStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
                <span className={`font-semibold ${wizardStep === 2 ? 'text-blue-600' : 'text-slate-500'}`}>推广广告位与地区设置</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${wizardStep >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
                <span className={`font-semibold ${wizardStep === 3 ? 'text-blue-600' : 'text-slate-500'}`}>推广广告创意与素材</span>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
              
              {/* STEP 1: Campaign info */}
              {wizardStep === 1 && (
                <div className="flex flex-col gap-4 animate-in slide-in-from-right-4 duration-150">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">投放广告账户 *</label>
                      <select
                        id="wiz-account-select"
                        value={wizAccountId}
                        onChange={e => setWizAccountId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden focus:border-blue-500 font-mono"
                      >
                        {accounts.map(acc => (
                          <option key={acc.id} value={acc.id}>{acc.name} ({acc.id})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">推广模块 *</label>
                      <select
                        value={wizObjective}
                        onChange={e => setWizObjective(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden"
                      >
                        <option value="应用推广">应用推广 (App Install & Engagement)</option>
                        <option value="提升品牌知名度">提升品牌知名度 (Brand Awareness)</option>
                        <option value="访问阻尼网页">网站流量/访问 (Traffic)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1.5">推广系列名称 *</label>
                    <input
                      id="wiz-campaign-name-input"
                      type="text"
                      placeholder="例如: csgo_SA"
                      value={wizCampaignName}
                      onChange={e => setWizCampaignName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">系列投放机制 *</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setWizType('Smart+')}
                          className={`flex-1 py-2 rounded text-xs font-semibold border cursor-pointer ${wizType === 'Smart+' ? 'bg-orange-50 text-orange-600 border-orange-300' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                        >
                          Smart+ 智能系统
                        </button>
                        <button
                          type="button"
                          onClick={() => setWizType('Standard')}
                          className={`flex-1 py-2 rounded text-xs font-semibold border cursor-pointer ${wizType === 'Standard' ? 'bg-blue-55 bg-blue-55/10 text-blue-600 border-blue-200' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                        >
                          Standard 常规投放
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">预算分配模式 *</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setWizBudgetMode('动态日预算')}
                          className={`flex-1 py-2 rounded text-xs font-semibold border cursor-pointer ${wizBudgetMode === '动态日预算' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                        >
                          动态日预算
                        </button>
                        <button
                          type="button"
                          onClick={() => setWizBudgetMode('不限')}
                          className={`flex-1 py-2 rounded text-xs font-semibold border cursor-pointer ${wizBudgetMode === '不限' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                        >
                          不限预算
                        </button>
                      </div>
                    </div>
                  </div>

                  {wizBudgetMode === '动态日预算' && (
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5 font-mono">日滚动预算额度 (USD) *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 font-semibold text-slate-400">$</span>
                        <input
                          id="wiz-budget-input"
                          type="number"
                          value={wizBudget}
                          onChange={e => setWizBudget(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-300 rounded pl-7 pr-3 py-2 text-xs focus:outline-hidden focus:border-blue-500 font-bold text-slate-800"
                        />
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800 text-xs">CBO 智能预算调控 (推荐)</span>
                      <p className="text-[10px] text-slate-400">自动在各条分组广告中调配预算，最大化转化次数</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setWizBudgetOpt(!wizBudgetOpt)}
                      className={`px-3 py-1 text-[11px] font-semibold border rounded-sm transition-all cursor-pointer ${wizBudgetOpt ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-200 text-slate-600 border-slate-300'}`}
                    >
                      {wizBudgetOpt ? '已开启' : '已关闭'}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Ad Group information */}
              {wizardStep === 2 && (
                <div className="flex flex-col gap-4 animate-in slide-in-from-right-4 duration-150">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1.5">创意广告组名称 *</label>
                    <input
                      id="wiz-group-name-input"
                      type="text"
                      value={wizGroupName}
                      onChange={e => setWizGroupName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1.5">投放版位选择 (Placements) *</label>
                    <div className="grid grid-cols-3 gap-3">
                      <div
                        onClick={() => setWizPlacement('TikTok, Pangle')}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${wizPlacement.includes('Pangle') ? 'border-blue-500 bg-blue-25/50' : 'border-slate-200 hover:bg-slate-55 hover:bg-slate-50'}`}
                      >
                        <span className="font-semibold block text-slate-800">全部版位</span>
                        <span className="text-[10px] text-slate-400">TikTok 与 智能穿孔网 (Pangle)</span>
                      </div>
                      
                      <div
                        onClick={() => setWizPlacement('TikTok Only')}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${wizPlacement === 'TikTok Only' ? 'border-blue-500 bg-blue-25/50' : 'border-slate-200 hover:bg-slate-55 hover:bg-slate-50'}`}
                      >
                        <span className="font-semibold block text-slate-800">仅限 TikTok</span>
                        <span className="text-[10px] text-slate-400">仅在 TikTok 信息流中投放</span>
                      </div>

                      <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed select-none">
                        <span className="font-semibold block text-slate-400">搜索广告网络</span>
                        <span className="text-[10px] text-slate-400">搜寻结果展示（TikTok Search Ads API）</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1.5">目标投放国家 / 地缘地区 *</label>
                    <select
                      value={wizLocation}
                      onChange={e => setWizLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden focus:border-blue-500"
                    >
                      <option value="Saudi Arabia">沙特阿拉伯 (Saudi Arabia)</option>
                      <option value="Taiwan">中国台湾 (Taiwan, Province of China)</option>
                      <option value="Japan">日本 (Japan)</option>
                      <option value="United States">美国 (United States)</option>
                      <option value="Global Placements">全球投放 (Global)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 3: Ad settings and materials */}
              {wizardStep === 3 && (
                <div className="flex flex-col gap-4 animate-in slide-in-from-right-4 duration-150">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">广告名称 *</label>
                      <input
                        id="wiz-ad-name-input"
                        type="text"
                        value={wizAdName}
                        onChange={e => setWizAdName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden focus:border-blue-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">创意文案 (Copywriting) *</label>
                      <input
                        type="text"
                        value={wizCopywriting}
                        onChange={e => setWizCopywriting(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-slate-600 font-semibold">选择创意素材 (可多选) *</label>
                      <span className="text-[10px] text-indigo-600 font-semibold uppercase">已选择 {wizSelectedCreatives.length} 个本地文件</span>
                    </div>

                    <div className="grid grid-cols-4 gap-3 max-h-56 overflow-y-auto p-1.5 bg-slate-100/60 rounded border border-slate-200">
                      {materials.map(mat => {
                        const isPicked = wizSelectedCreatives.includes(mat.id);
                        return (
                          <div
                            id={`wiz-creative-item-${mat.id}`}
                            key={mat.id}
                            onClick={() => {
                              if (isPicked) {
                                setWizSelectedCreatives(prev => prev.filter(mid => mid !== mat.id));
                              } else {
                                setWizSelectedCreatives(prev => [...prev, mat.id]);
                              }
                            }}
                            className={`relative rounded border p-1 bg-white cursor-pointer select-none transition-all ${isPicked ? 'ring-2 ring-blue-500 border-transparent shadow' : 'border-slate-200 hover:border-slate-300'}`}
                          >
                            <img
                              referrerPolicy="no-referrer"
                              src={mat.thumbnail}
                              alt={mat.fileName}
                              className="w-full h-20 object-cover rounded-sm mb-1.5"
                            />
                            {isPicked && (
                              <div className="absolute top-2 right-2 bg-blue-600 text-white p-0.5 rounded-full z-10">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                            <div className="px-1 text-[10px] leading-tight text-slate-700 truncate" title={mat.fileName}>
                              {mat.fileName}
                            </div>
                            <div className="px-1 text-[9px] text-slate-400 font-mono mt-0.5 flex justify-between items-center">
                              <span>{mat.size}</span>
                              <span className="bg-slate-100 px-1 rounded text-slate-500">{mat.format}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer containing step controllers */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (wizardStep > 1) {
                    setWizardStep(prev => prev - 1);
                  } else {
                    setShowWizard(false);
                  }
                }}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded text-xs cursor-pointer hover:bg-slate-100 font-medium"
              >
                {wizardStep === 1 ? '取消' : '上一步'}
              </button>

              <div className="flex items-center gap-2">
                {wizardStep < 3 ? (
                  <button
                    id="wiz-next-step-btn"
                    type="button"
                    onClick={() => setWizardStep(prev => prev + 1)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer"
                  >
                    下一步
                  </button>
                ) : (
                  <>
                    <button
                      id="wiz-save-draft-btn"
                      type="button"
                      onClick={() => handleWizardSubmit(true)}
                      className="px-4 py-1.5 border border-[#3b82f6] text-blue-600 hover:bg-slate-100 rounded text-xs font-semibold cursor-pointer"
                    >
                      保存草稿
                    </button>
                    <button
                      id="wiz-publish-btn"
                      type="button"
                      onClick={() => handleWizardSubmit(false)}
                      className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer flex items-center gap-1"
                    >
                      立即发布
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* DIALOG 1: CAMPAIGN INITIAL POPUP (IMAGE 1) */}
      {showCampaignInitModal && (
        <div id="campaign-init-modal" className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-155 p-6 flex flex-col gap-5 text-left text-xs">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-1 select-none">
              <span className="font-bold text-slate-800 text-sm">创建广告</span>
              <button 
                type="button"
                onClick={() => setShowCampaignInitModal(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Input Groups */}
            <div className="space-y-4">
              <div>
                <label className="block text-slate-500 font-bold mb-1.5 select-none text-[11px]">推广目标</label>
                <div className="relative">
                  <select
                    id="init-objective-select"
                    value={initObjective}
                    onChange={e => setInitObjective(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-slate-200 hover:bg-slate-105 text-slate-800 font-bold font-sans px-4 py-2.5 rounded text-xs focus:outline-hidden cursor-pointer appearance-none pr-10"
                  >
                    <option value="应用推广">应用推广</option>
                    <option value="品牌曝光">品牌曝光</option>
                    <option value="落地页引流">落地页引流</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1.5 select-none text-[11px]">推广系列类型</label>
                <div className="relative">
                  <select
                    id="init-type-select"
                    value={initType}
                    onChange={e => setInitType(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-slate-200 hover:bg-slate-105 text-slate-800 font-bold font-sans px-4 py-2.5 rounded text-xs focus:outline-hidden cursor-pointer appearance-none pr-10"
                  >
                    {activeChannel !== 'facebook' && activeChannel !== 'google' && (
                      <option value="小程序">小程序</option>
                    )}
                    <option value="常规应用">常规应用</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 mt-2 select-none">
              <button
                type="button"
                onClick={() => setShowCampaignInitModal(false)}
                className="px-5 py-2 border border-slate-200 text-slate-600 font-semibold bg-white rounded hover:bg-slate-50 transition-colors text-xs cursor-pointer"
              >
                取消
              </button>
              
              <button
                id="init-confirm-btn"
                type="button"
                onClick={() => {
                  setShowCampaignInitModal(false);
                  setShowFullPageAdCreator(true);
                }}
                className="px-5 py-2 bg-[#3b82f6] hover:bg-blue-650 hover:bg-blue-600 text-white font-bold rounded shadow-xs transition-colors text-xs cursor-pointer"
              >
                确认
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DIALOG 2: FULLPAGE AD CREATOR SHEETS (IMAGE 2) */}
      {showFullPageAdCreator && (
        <AdCreatorFullScreen
          onClose={() => setShowFullPageAdCreator(false)}
          onSuccess={(msg) => {
            showToastMsg(msg, 'success');
          }}
          initialObjective={initObjective}
          initialType={initType}
        />
      )}
    </div>
  );
};
