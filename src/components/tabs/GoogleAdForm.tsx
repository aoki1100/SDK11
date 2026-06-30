import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Plus,
  Search,
  ChevronDown,
  HelpCircle,
  AlertCircle,
  FolderOpen,
  Globe,
  RefreshCw,
  FileText,
  Sparkles,
  Smartphone,
  Laptop,
  Trash2,
  Settings,
  Copy,
  MoreHorizontal,
  Calendar,
  Layers,
  Link,
  Sliders,
  PlaySquare,
  Image as ImageIcon,
  FileCode
} from 'lucide-react';

interface Material {
  id: string;
  thumbnail: string;
  fileName: string;
  format: string;
  size: string;
  duration: string;
  pushStatus: string;
  pushAccount: string;
  uploadTime: string;
  folderId: string;
}

interface CreativeGroup {
  id: string;
  name: string;
  videos: string[];
  images: string[];
  html5s: string[];
  titles: string[];
  descriptions: string[];
  deepLink: string;
  tag: string;
}

interface RegionGroup {
  id: string;
  name: string;
  selectedRegions: string[];
  excludedRegions: string[];
  isSpecifiedRegion: boolean;
  languageOption: 'all' | 'specified';
  selectedLanguages: string[];
  targetOption: string;
  excludeOption: string;
  selectedTag: string;
  feedOption: string;
}

interface GoogleBudget {
  id: string;
  name: string;
  focusGoal: 'INSTALLS' | 'IN_APP_ACTIONS' | 'IN_APP_ACTION_VALUE';
  targetUserType: 'ALL_USERS' | 'LIKELY_ACTION' | 'LIKELY_HIGH_VALUE';
  bidValue: string; // Target CPI / CPA / ROAS
  bidStrategy: string;
  roasType: string;
  budgetValue: string;
  startDate: string;
  endDate: string;
  scheduleType: 'now' | 'custom';
}

interface GoogleAdFormProps {
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
  googleCampaignType: string;
  setGoogleCampaignType: (v: string) => void;
  googleCampaignSubtype: string;
  setGoogleCampaignSubtype: (v: string) => void;
  googlePlatform: string;
  setGooglePlatform: (v: string) => void;
  googleAccount: string;
  setGoogleAccount: (v: string) => void;
  googleXmpProduct: string;
  setGoogleXmpProduct: (v: string) => void;
  googleApp: string;
  setGoogleApp: (v: string) => void;
  googleCampaignName: string;
  setGoogleCampaignName: (v: string) => void;
  googleCreatedApps: string[];
  setGoogleCreatedApps: React.Dispatch<React.SetStateAction<string[]>>;
  googleRegionGroups: RegionGroup[];
  setGoogleRegionGroups: React.Dispatch<React.SetStateAction<RegionGroup[]>>;
  activeGoogleRegionGroupId: string;
  setActiveGoogleRegionGroupId: (v: string) => void;
  isExistingRegionChecked: boolean;
  setIsExistingRegionChecked: (v: boolean) => void;
  googleRegionSearch: string;
  setGoogleRegionSearch: (v: string) => void;
  googleLanguageDropdownOpen: boolean;
  setGoogleLanguageDropdownOpen: (v: boolean) => void;
  googleAdGroupName: string;
  setGoogleAdGroupName: (v: string) => void;
  isGoogleAdGroupExpanded: boolean;
  setIsGoogleAdGroupExpanded: (v: boolean) => void;
  googleCreativeGroups: CreativeGroup[];
  setGoogleCreativeGroups: React.Dispatch<React.SetStateAction<CreativeGroup[]>>;
  activeGoogleCreativeGroupId: string;
  setActiveGoogleCreativeGroupId: (v: string) => void;
  isExistingCreativeChecked: boolean;
  setIsExistingCreativeChecked: (v: boolean) => void;
  bidStrategy: string;
  setBidStrategy: (v: string) => void;
  roasType: string;
  setRoasType: (v: string) => void;
  budgetValue: string;
  setBudgetValue: (v: string) => void;
  steps: Array<{ id: number; label: string; ref: React.RefObject<HTMLDivElement | null> }>;
}

export const GoogleAdForm: React.FC<GoogleAdFormProps> = ({
  materials,
  setMaterials,
  googleCampaignType,
  setGoogleCampaignType,
  googleCampaignSubtype,
  setGoogleCampaignSubtype,
  googlePlatform,
  setGooglePlatform,
  googleAccount,
  setGoogleAccount,
  googleXmpProduct,
  setGoogleXmpProduct,
  googleApp,
  setGoogleApp,
  googleCampaignName,
  setGoogleCampaignName,
  googleCreatedApps,
  setGoogleCreatedApps,
  googleRegionGroups,
  setGoogleRegionGroups,
  activeGoogleRegionGroupId,
  setActiveGoogleRegionGroupId,
  isExistingRegionChecked,
  setIsExistingRegionChecked,
  googleRegionSearch,
  setGoogleRegionSearch,
  googleLanguageDropdownOpen,
  setGoogleLanguageDropdownOpen,
  googleAdGroupName,
  setGoogleAdGroupName,
  isGoogleAdGroupExpanded,
  setIsGoogleAdGroupExpanded,
  googleCreativeGroups,
  setGoogleCreativeGroups,
  activeGoogleCreativeGroupId,
  setActiveGoogleCreativeGroupId,
  isExistingCreativeChecked,
  setIsExistingCreativeChecked,
  bidStrategy,
  setBidStrategy,
  roasType,
  setRoasType,
  budgetValue,
  setBudgetValue,
  steps
}) => {
  // Google Channel Configuration States
  const [googleChannelGenMode, setGoogleChannelGenMode] = useState<'auto' | 'manual'>('auto');
  const [googleChannelSharingMode, setGoogleChannelSharingMode] = useState<'shared' | 'independent'>('shared');
  const [googleChannelGame, setGoogleChannelGame] = useState<string>('0');
  const [googleChannelPlatform, setGoogleChannelPlatform] = useState<string>('0');
  const [googleChannelSource, setGoogleChannelSource] = useState<string>('');
  const [googleChannelRegion, setGoogleChannelRegion] = useState<string>('');
  const [googleChannelRegionTouched, setGoogleChannelRegionTouched] = useState(false);
  const [googleChannelPitcher, setGoogleChannelPitcher] = useState<string>('');
  const [googleChannelLabel, setGoogleChannelLabel] = useState<string>('');
  const [googleChannelRemark, setGoogleChannelRemark] = useState<string>('');
  const [googleChannelManualCode, setGoogleChannelManualCode] = useState<string>('');
  const [googleChannelConfigured, setGoogleChannelConfigured] = useState(false);

  // Binding Object State for Creative Group
  const [googleCreativeBindings, setGoogleCreativeBindings] = useState<Record<string, string>>({
    'cg1': 'all'
  });
  const [isGoogleBindingRulesModalOpen, setIsGoogleBindingRulesModalOpen] = useState(false);
  const [googleBindingRulesActiveTab, setGoogleBindingRulesActiveTab] = useState<'account' | 'region'>('account');
  const [tempGoogleBindings, setTempGoogleBindings] = useState<Record<string, string>>({});
  const [googleCheckedRowIds, setGoogleCheckedRowIds] = useState<string[]>([]);

  useEffect(() => {
    if (isGoogleBindingRulesModalOpen) {
      setTempGoogleBindings(googleCreativeBindings);
      setGoogleCheckedRowIds([]);
    }
  }, [isGoogleBindingRulesModalOpen]);

  const getGoogleBoundLabel = (cgId: string) => {
    const val = googleCreativeBindings[cgId];
    if (!val || val === 'all' || val === 'none') {
      return '请选择';
    }
    // Check if it's an account
    if (val === '雨果-PA-01' || val === '雨果-GridMaster-01' || val === '雨果-GridMaster-02' || val === '雨果-GridMaster-03') {
      return `广告账户 (${val})`;
    }
    // Check if it's a region group
    const rg = googleRegionGroups.find(r => r.id === val);
    if (rg) {
      return `地区 (${rg.name})`;
    }
    return val;
  };

  // Google tab duplication/menu/modal states
  const [googleTabMenuOpenId, setGoogleTabMenuOpenId] = useState<string | null>(null);
  const [googleTabMenuType, setGoogleTabMenuType] = useState<'region' | 'budget' | 'creative' | null>(null);
  const [googleTabMenuCoords, setGoogleTabMenuCoords] = useState<{ top: number; left: number } | null>(null);

  const [googleGroupActionModal, setGoogleGroupActionModal] = useState<{
    type: 'rename' | 'batch_duplicate' | 'delete' | null;
    groupType: 'region' | 'budget' | 'creative' | null;
    targetId: string | null;
    targetName: string;
    inputValue: string;
  }>({
    type: null,
    groupType: null,
    targetId: null,
    targetName: '',
    inputValue: ''
  });

  // ---- 1. Region Group Helpers ----
  const handleAddRegionGroup = () => {
    const newId = `rg_${Date.now()}`;
    const newIndex = googleRegionGroups.length + 1;
    setGoogleRegionGroups(prev => [...prev, {
      id: newId,
      name: `地区组${newIndex}`,
      selectedRegions: [],
      excludedRegions: [],
      isSpecifiedRegion: false,
      languageOption: 'all',
      selectedLanguages: [],
      targetOption: 'target_presence_interest',
      excludeOption: '',
      selectedTag: '',
      feedOption: 'auto'
    }]);
    setActiveGoogleRegionGroupId(newId);
  };

  const handleDuplicateRegionGroup = (id: string) => {
    const source = googleRegionGroups.find(rg => rg.id === id);
    if (!source) return;
    const nextId = `rg_${Date.now()}_copy`;
    setGoogleRegionGroups(prev => {
      const index = prev.findIndex(rg => rg.id === id);
      const copy = {
        ...source,
        id: nextId,
        name: `${source.name} - 副本`,
        selectedRegions: [...source.selectedRegions],
        excludedRegions: [...source.excludedRegions],
        selectedLanguages: [...source.selectedLanguages]
      };
      const result = [...prev];
      result.splice(index + 1, 0, copy);
      return result;
    });
    setActiveGoogleRegionGroupId(nextId);
  };

  const handleBatchDuplicateRegionGroup = (id: string, count: number) => {
    if (isNaN(count) || count <= 0) return;
    const source = googleRegionGroups.find(rg => rg.id === id);
    if (!source) return;
    const now = Date.now();
    setGoogleRegionGroups(prev => {
      const index = prev.findIndex(rg => rg.id === id);
      const copies = [];
      for (let i = 1; i <= count; i++) {
        copies.push({
          ...source,
          id: `rg_${now}_copy_${i}`,
          name: `${source.name} - 副本${i}`,
          selectedRegions: [...source.selectedRegions],
          excludedRegions: [...source.excludedRegions],
          selectedLanguages: [...source.selectedLanguages]
        });
      }
      const result = [...prev];
      result.splice(index + 1, 0, ...copies);
      return result;
    });
  };

  const handleDeleteRegionGroup = (id: string) => {
    if (googleRegionGroups.length <= 1) {
      alert('必须保留至少一个地区组！');
      return;
    }
    const filtered = googleRegionGroups.filter(rg => rg.id !== id);
    setGoogleRegionGroups(filtered);
    if (activeGoogleRegionGroupId === id) {
      setActiveGoogleRegionGroupId(filtered[0].id);
    }
  };

  // ---- 2. Budget Helpers ----
  const handleAddBudget = () => {
    const newId = `gb_${Date.now()}`;
    const newIndex = googleBudgets.length + 1;
    setGoogleBudgets(prev => [...prev, {
      id: newId,
      name: `出价和预算${newIndex}`,
      focusGoal: 'INSTALLS',
      targetUserType: 'ALL_USERS',
      bidValue: '1.50',
      bidStrategy: 'Highest value',
      roasType: 'Day 0 ROAS',
      budgetValue: '100.00',
      startDate: '2026-06-25',
      endDate: '',
      scheduleType: 'now'
    }]);
    setActiveGoogleBudgetId(newId);
  };

  const handleDuplicateBudget = (id: string) => {
    const source = googleBudgets.find(b => b.id === id);
    if (!source) return;
    const nextId = `gb_${Date.now()}_copy`;
    setGoogleBudgets(prev => {
      const index = prev.findIndex(b => b.id === id);
      const copy = {
        ...source,
        id: nextId,
        name: `${source.name} - 副本`
      };
      const result = [...prev];
      result.splice(index + 1, 0, copy);
      return result;
    });
    setActiveGoogleBudgetId(nextId);
  };

  const handleBatchDuplicateBudget = (id: string, count: number) => {
    if (isNaN(count) || count <= 0) return;
    const source = googleBudgets.find(b => b.id === id);
    if (!source) return;
    const now = Date.now();
    setGoogleBudgets(prev => {
      const index = prev.findIndex(b => b.id === id);
      const copies = [];
      for (let i = 1; i <= count; i++) {
        copies.push({
          ...source,
          id: `gb_${now}_copy_${i}`,
          name: `${source.name} - 副本${i}`
        });
      }
      const result = [...prev];
      result.splice(index + 1, 0, ...copies);
      return result;
    });
  };

  const handleDeleteBudget = (id: string) => {
    if (googleBudgets.length <= 1) {
      alert('必须保留至少一个出价和预算配置！');
      return;
    }
    const filtered = googleBudgets.filter(b => b.id !== id);
    setGoogleBudgets(filtered);
    if (activeGoogleBudgetId === id) {
      setActiveGoogleBudgetId(filtered[0].id);
    }
  };

  // ---- 3. Creative Group Helpers ----
  const handleAddCreativeGroup = () => {
    const newId = `cg_${Date.now()}`;
    const newIndex = googleCreativeGroups.length + 1;
    setGoogleCreativeGroups(prev => [...prev, {
      id: newId,
      name: `创意组${newIndex}`,
      videos: [],
      images: [],
      html5s: [],
      titles: ['', ''],
      descriptions: [''],
      deepLink: '',
      tag: ''
    }]);
    setActiveGoogleCreativeGroupId(newId);
  };

  const handleDuplicateCreativeGroup = (id: string) => {
    const source = googleCreativeGroups.find(cg => cg.id === id);
    if (!source) return;
    const nextId = `cg_${Date.now()}_copy`;
    setGoogleCreativeGroups(prev => {
      const index = prev.findIndex(cg => cg.id === id);
      const copy = {
        ...source,
        id: nextId,
        name: `${source.name} - 副本`,
        videos: [...source.videos],
        images: [...source.images],
        html5s: [...source.html5s],
        titles: [...source.titles],
        descriptions: [...source.descriptions]
      };
      const result = [...prev];
      result.splice(index + 1, 0, copy);
      return result;
    });
    setActiveGoogleCreativeGroupId(nextId);
  };

  const handleBatchDuplicateCreativeGroup = (id: string, count: number) => {
    if (isNaN(count) || count <= 0) return;
    const source = googleCreativeGroups.find(cg => cg.id === id);
    if (!source) return;
    const now = Date.now();
    setGoogleCreativeGroups(prev => {
      const index = prev.findIndex(cg => cg.id === id);
      const copies = [];
      for (let i = 1; i <= count; i++) {
        copies.push({
          ...source,
          id: `cg_${now}_copy_${i}`,
          name: `${source.name} - 副本${i}`,
          videos: [...source.videos],
          images: [...source.images],
          html5s: [...source.html5s],
          titles: [...source.titles],
          descriptions: [...source.descriptions]
        });
      }
      const result = [...prev];
      result.splice(index + 1, 0, ...copies);
      return result;
    });
  };

  const handleDeleteCreativeGroup = (id: string) => {
    if (googleCreativeGroups.length <= 1) {
      alert('必须保留至少一个创意组！');
      return;
    }
    const filtered = googleCreativeGroups.filter(cg => cg.id !== id);
    setGoogleCreativeGroups(filtered);
    if (activeGoogleCreativeGroupId === id) {
      setActiveGoogleCreativeGroupId(filtered[0].id);
    }
  };

  // App Selection / Register Modal
  const [isCreateAppModalOpen, setIsCreateAppModalOpen] = useState(false);
  const [createAppTab, setCreateAppTab] = useState<'search' | 'enter'>('search');
  const [searchStore, setSearchStore] = useState<'gp' | 'ios'>('gp');
  const [searchCountry, setSearchCountry] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom manual enter fields
  const [createAppPlatform, setCreateAppPlatform] = useState<'android' | 'ios'>('android');
  const [createAppName, setCreateAppName] = useState('');
  const [createAppPackage, setCreateAppPackage] = useState('');

  // Sample mock games list for interactive search
  const mockGamesList = [
    { name: 'Perfect Avenger - Idle games', package: 'com.pg.avenger.gp', store: 'gp', icon: '🎮' },
    { name: 'Clash of Clans', package: 'com.supercell.clashofclans', store: 'gp', icon: '🏰' },
    { name: 'Mobile Legends: Bang Bang', package: 'com.moonton.mobilelegends', store: 'gp', icon: '⚔️' },
    { name: 'Monopoly Go!', package: 'com.scopely.monopolygo', store: 'ios', icon: '🎲' },
    { name: 'Subway Surfers', package: 'com.kiloo.subwaysurfers', store: 'gp', icon: '🏃' },
    { name: 'Piano Tiles 2', package: 'com.piano.tiles2.gp', store: 'gp', icon: '🎹' },
    { name: 'Shadow Fight 3', package: 'com.nekki.shadowfight3', store: 'ios', icon: '🥋' }
  ];

  // Material Picker States
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerTargetType, setPickerTargetType] = useState<'video' | 'image' | 'html5'>('video');
  const [selectedPickerIds, setSelectedPickerIds] = useState<string[]>([]);
  const [pickerFolderFilter, setPickerFolderFilter] = useState('all');

  // Copywriting Template Picker
  const [isCopywritingOpen, setIsCopywritingOpen] = useState(false);
  const [copywritingTargetIndex, setCopywritingTargetIndex] = useState<number>(-1);
  const [copywritingType, setCopywritingType] = useState<'title' | 'description'>('title');

  // Campaign General Settings
  const [campaignStatus, setCampaignStatus] = useState<'ENABLED' | 'PAUSED'>('ENABLED');

  // Google Budgets list
  const [googleBudgets, setGoogleBudgets] = useState<GoogleBudget[]>([
    {
      id: 'gb1',
      name: '出价和预算1',
      focusGoal: 'INSTALLS',
      targetUserType: 'ALL_USERS',
      bidValue: '1.50',
      bidStrategy: 'Highest value',
      roasType: 'Day 0 ROAS',
      budgetValue: '100.00',
      startDate: '2026-06-25',
      endDate: '',
      scheduleType: 'now'
    }
  ]);
  const [activeGoogleBudgetId, setActiveGoogleBudgetId] = useState('gb1');
  const [isExistingBudgetChecked, setIsExistingBudgetChecked] = useState(false);

  const activeBudget = googleBudgets.find(b => b.id === activeGoogleBudgetId) || googleBudgets[0];

  // Sync active budget back to parent component props
  useEffect(() => {
    if (activeBudget) {
      setBudgetValue(activeBudget.budgetValue);
      setBidStrategy(activeBudget.bidStrategy);
      setRoasType(activeBudget.roasType);
    }
  }, [activeGoogleBudgetId, activeBudget, setBudgetValue, setBidStrategy, setRoasType]);

  const updateActiveBudget = (patches: Partial<GoogleBudget>) => {
    setGoogleBudgets(prev => prev.map(b => b.id === activeGoogleBudgetId ? { ...b, ...patches } : b));
  };

  // Google Network Placement
  const [searchNetwork, setSearchNetwork] = useState(true);
  const [playNetwork, setPlayNetwork] = useState(true);
  const [youtubeNetwork, setYouTubeNetwork] = useState(true);
  const [displayNetwork, setDisplayNetwork] = useState(true);
  const [discoverNetwork, setDiscoverNetwork] = useState(true);

  // Advanced tracking params
  const [trackingTemplate, setTrackingTemplate] = useState('{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}');
  const [finalUrl, setFinalUrl] = useState('');
  const [clickTracker, setClickTracker] = useState('');
  const [impressionTracker, setImpressionTracker] = useState('');
  const [attributionProvider, setAttributionProvider] = useState('AppsFlyer');

  // Copywriting Library (Internal mock)
  const copywritingLibrary = {
    title: [
      '极速开箱割草，激爽无限！',
      '全新策略塔防，怪兽克星！',
      '指尖节奏连击，根本停不下来！',
      '正版续作重磅来袭，爆率拉满！',
      '2026年度必玩黑马手游，限时送百抽！',
      '一键登录秒玩，休闲解压神作！',
      '高智商挑战，突破极限脑力！'
    ],
    description: [
      '休闲轻松挂机，睡觉也能自动闯关升级，爆率高达99.9%！',
      '百种特色技能任意搭配，酷炫组合引爆全场，现在下载送专属绝版神装！',
      '完美适配各种设备，极致流畅无卡顿，千万玩家同台竞技！',
      '全新二次元魔幻MMORPG巨作，殿堂级声优倾情加盟！',
      '烧脑关卡等你来战，唯有最强大脑才能顺利通关，快来下载挑战吧！'
    ]
  };

  const currentRegionGroup = googleRegionGroups.find(rg => rg.id === activeGoogleRegionGroupId) || googleRegionGroups[0];
  const currentCreativeGroup = googleCreativeGroups.find(cg => cg.id === activeGoogleCreativeGroupId) || googleCreativeGroups[0];

  const updateActiveRG = (patches: Partial<RegionGroup>) => {
    setGoogleRegionGroups(prev => prev.map(g => g.id === activeGoogleRegionGroupId ? { ...g, ...patches } : g));
  };

  const updateActiveCG = (patches: Partial<CreativeGroup>) => {
    setGoogleCreativeGroups(prev => prev.map(g => g.id === activeGoogleCreativeGroupId ? { ...g, ...patches } : g));
  };

  // Sync Bidding when Focus goal changes
  const handleFocusGoalChange = (val: 'INSTALLS' | 'IN_APP_ACTIONS' | 'IN_APP_ACTION_VALUE') => {
    let defaultBid = '1.50';
    let defaultUserType: 'ALL_USERS' | 'LIKELY_ACTION' | 'LIKELY_HIGH_VALUE' = 'ALL_USERS';

    if (val === 'INSTALLS') {
      defaultBid = '1.50';
      defaultUserType = 'ALL_USERS';
    } else if (val === 'IN_APP_ACTIONS') {
      defaultBid = '12.00';
      defaultUserType = 'LIKELY_ACTION';
    } else {
      defaultBid = '120'; // 120% ROAS
      defaultUserType = 'LIKELY_HIGH_VALUE';
    }

    updateActiveBudget({
      focusGoal: val,
      bidValue: defaultBid,
      targetUserType: defaultUserType
    });
  };

  // Open Material Picker
  const handleOpenMaterialPicker = (type: 'video' | 'image' | 'html5') => {
    setPickerTargetType(type);
    setIsPickerOpen(true);
    if (type === 'video') {
      setSelectedPickerIds(currentCreativeGroup.videos);
    } else if (type === 'image') {
      setSelectedPickerIds(currentCreativeGroup.images);
    } else {
      setSelectedPickerIds(currentCreativeGroup.html5s);
    }
  };

  const handleApplyPickerSelection = () => {
    if (pickerTargetType === 'video') {
      updateActiveCG({ videos: selectedPickerIds });
    } else if (pickerTargetType === 'image') {
      updateActiveCG({ images: selectedPickerIds });
    } else {
      updateActiveCG({ html5s: selectedPickerIds });
    }
    setIsPickerOpen(false);
  };

  // Copywriting Template Picker
  const handleOpenCopywriting = (type: 'title' | 'description', index: number) => {
    setCopywritingType(type);
    setCopywritingTargetIndex(index);
    setIsCopywritingOpen(true);
  };

  const handleApplyCopywritingText = (text: string) => {
    if (copywritingType === 'title') {
      const nextTitles = [...currentCreativeGroup.titles];
      nextTitles[copywritingTargetIndex] = text;
      updateActiveCG({ titles: nextTitles });
    } else {
      const nextDescs = [...currentCreativeGroup.descriptions];
      nextDescs[copywritingTargetIndex] = text;
      updateActiveCG({ descriptions: nextDescs });
    }
    setIsCopywritingOpen(false);
  };

  return (
    <div className="space-y-6 font-sans text-slate-850 text-xs">
      
      {/* 1. 基础设置 (Basic attributes) */}
      <div ref={steps[0].ref} id="google-basic-setup" className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-all">
        <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-blue-600 rounded-2xs inline-block"></span>
            <span>基础设置</span>
          </div>
          <button 
            type="button" 
            onClick={() => alert('Google Ads API 元数据同步成功！')}
            className="text-blue-600 font-bold hover:underline cursor-pointer"
          >
            同步最新接口配置
          </button>
        </h3>

        <div className="space-y-4">
          
          {/* Row 1: 广告系列类型 */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="text-slate-500 font-semibold">广告系列类型</span>
            <div className="flex gap-2">
              <button
                type="button"
                className="px-3.5 py-1.5 border border-blue-500 bg-blue-50 text-blue-600 font-bold rounded text-xs shadow-3xs"
              >
                应用
              </button>
            </div>
          </div>

          {/* Row 2: 广告系列子类型 */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="text-slate-500 font-semibold">广告系列子类型</span>
            <div className="flex gap-2">
              <button
                type="button"
                className="px-3.5 py-1.5 border border-blue-500 bg-blue-50 text-blue-600 font-bold rounded text-xs shadow-3xs"
              >
                应用安装
              </button>
              <button
                type="button"
                disabled
                className="px-3.5 py-1.5 border border-slate-200 bg-slate-50 text-slate-300 font-bold rounded text-xs cursor-not-allowed opacity-60"
              >
                应用互动
              </button>
              <button
                type="button"
                disabled
                className="px-3.5 py-1.5 border border-slate-200 bg-slate-50 text-slate-300 font-bold rounded text-xs cursor-not-allowed opacity-60"
              >
                预注册
              </button>
            </div>
          </div>

          {/* Row 3: 投放平台 */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="text-slate-500 font-semibold">投放平台</span>
            <div className="flex gap-2">
              {[
                { id: 'android', label: 'Android' },
                { id: 'ios', label: 'iOS' }
              ].map(plat => (
                <button
                  key={plat.id}
                  type="button"
                  onClick={() => setGooglePlatform(plat.id)}
                  className={`px-5 py-1.5 border font-bold rounded text-xs transition-colors cursor-pointer ${
                    googlePlatform === plat.id
                      ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {plat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 4: 广告账户 (Google CID) */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="text-slate-500 font-semibold">广告账户 <span className="text-rose-500 font-bold">*</span></span>
            <div className="relative max-w-sm w-full">
              <select
                value={googleAccount}
                onChange={e => setGoogleAccount(e.target.value)}
                className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
              >
                <option value="雨果-Perfect Avenger-04(916-221-5079)">雨果-PA-01</option>
                <option value="雨果-GridMaster-01">雨果-GridMaster-01 (759-815-2230)</option>
                <option value="雨果-GridMaster-02">雨果-GridMaster-02 (412-581-9960)</option>
                <option value="雨果-GridMaster-03">雨果-GridMaster-03 (302-186-7739)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Row 5: 关联应用 */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="text-slate-500 font-semibold">应用 <span className="text-rose-500 font-bold">*</span></span>
            <div className="flex gap-2 items-center max-w-sm w-full">
              <div className="relative flex-1">
                <select
                  value={googleApp}
                  onChange={e => setGoogleApp(e.target.value)}
                  className={`w-full bg-white border border-slate-205 rounded px-3 py-2 pr-10 text-xs focus:outline-hidden appearance-none cursor-pointer ${!googleApp ? 'text-slate-400' : 'text-slate-800 font-bold'}`}
                >
                  <option value="com.pg.avenger.gp">Perfect Avenger - Idle games (ios.kb.perfect.avenger)</option>
                  <option value="com.pg.avenger.gp">Perfect Avenger - Idle games (ios.kb.perfect.avenger)</option>
                  {googleCreatedApps.map((app, i) => (
                    <option key={i} value={app}>{app}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
              <button
                type="button"
                onClick={() => {
                  setCreateAppTab('search');
                  setIsCreateAppModalOpen(true);
                }}
                className="text-blue-600 hover:text-blue-800 font-bold shrink-0 text-xs ml-1 cursor-pointer flex items-center gap-0.5"
              >
                <span>创建应用</span>
              </button>
            </div>
          </div>

          {/* Row 6: 广告系列名称 */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start">
            <span className="text-slate-500 font-semibold pt-1.5">广告系列名称 <span className="text-rose-500 font-bold">*</span></span>
            <div className="max-w-xl w-full">
              <input
                type="text"
                value={googleCampaignName || '_{创意组名称}_{广告系列子类型}_'}
                onChange={e => setGoogleCampaignName(e.target.value)}
                className="w-full bg-white border border-slate-250 rounded px-3.5 py-2 text-xs text-slate-850 font-bold focus:outline-hidden focus:border-blue-500"
              />
              <div className="mt-2 flex flex-wrap gap-1.5 select-none items-center">
                {[
                  { label: '渠道号', value: '_{渠道号}_' },
                  { label: '项目名称', value: '_{项目名称}_' },
                  { label: '地区组名称', value: '_{地区组名称}_' },
                  { label: '跑法', value: '_{跑法}_' },
                  { label: '创意组名称', value: '_{创意组名称}_' },
                  { label: '创建日期(yyyymmdd)', value: '_{创建日期(yyyymmdd)}_' },
                  { label: '创建时间(HH:mm:ss)', value: '_{创建时间(HH:mm:ss)}_' },
                  { label: '开始日期(yyyymmdd)', value: '_{开始日期(yyyymmdd)}_' }
                ].map(tag => (
                  <button
                    key={tag.label}
                    type="button"
                    onClick={() => {
                      setGoogleCampaignName(prev => prev + tag.value);
                    }}
                    className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 1.5 渠道号配置 */}
      <div ref={steps[3].ref} id="google-channel-setup" className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-all">
        <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-4 flex items-center justify-between font-sans">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-blue-600 rounded-2xs inline-block"></span>
            <span className="text-sm font-bold text-slate-800">渠道号配置</span>
          </div>
          {googleChannelConfigured ? (
            <span className="text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-sm animate-fade-in">✓ 已配置</span>
          ) : (
            <span className="text-amber-600 text-[10px] font-bold bg-amber-50 px-2 py-0.5 rounded-sm">待配置</span>
          )}
        </h3>

        <div className="space-y-4 font-sans text-xs">
          {/* 方式 选择 */}
          <div className="flex items-center gap-6 select-none font-bold py-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input 
                type="radio" 
                name="google_chan_gen" 
                checked={googleChannelGenMode === 'auto'} 
                onChange={() => {
                  setGoogleChannelGenMode('auto');
                  setGoogleChannelConfigured(false);
                }}
                className="text-blue-600 focus:ring-0 h-3.5 w-3.5 cursor-pointer" 
              />
              <span className={`${googleChannelGenMode === 'auto' ? 'text-blue-600' : ''}`}>配置生成</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input 
                type="radio" 
                name="google_chan_gen" 
                checked={googleChannelGenMode === 'manual'} 
                onChange={() => {
                  setGoogleChannelGenMode('manual');
                  setGoogleChannelConfigured(false);
                }}
                className="text-blue-600 focus:ring-0 h-3.5 w-3.5 cursor-pointer" 
              />
              <span className={`${googleChannelGenMode === 'manual' ? 'text-blue-600' : ''}`}>手动输入</span>
            </label>
          </div>

          {/* 渠道号生成方式 */}
          <div className="space-y-1.5 pt-1">
            <span className="block text-slate-400 font-bold text-[11px]">渠道号生成方式</span>
            <div className="flex items-center gap-6 select-none font-bold">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input 
                  type="radio" 
                  name="google_chan_way" 
                  checked={googleChannelSharingMode === 'shared'} 
                  onChange={() => setGoogleChannelSharingMode('shared')}
                  className="text-blue-600 focus:ring-0 h-3.5 w-3.5 cursor-pointer" 
                />
                <span className={`${googleChannelSharingMode === 'shared' ? 'text-blue-600' : ''}`}>所有广告组共用</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input 
                  type="radio" 
                  name="google_chan_way" 
                  checked={googleChannelSharingMode === 'independent'} 
                  onChange={() => setGoogleChannelSharingMode('independent')}
                  className="text-blue-600 focus:ring-0 h-3.5 w-3.5 cursor-pointer" 
                />
                <span className={`${googleChannelSharingMode === 'independent' ? 'text-blue-600' : ''}`}>每个广告组独立生成</span>
              </label>
            </div>
          </div>

          {/* Mode: auto (配置生成) */}
          {googleChannelGenMode === 'auto' && (
            <div className="space-y-3.5 max-w-xl pt-2 animate-fade-in">
              {/* 游戏 */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  游戏 <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <select
                    value={googleChannelGame}
                    onChange={e => {
                      setGoogleChannelGame(e.target.value);
                      if (e.target.value !== '0') {
                        setGoogleChannelSource('Google Ads');
                      } else {
                        setGoogleChannelSource('');
                      }
                    }}
                    className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                  >
                    <option value="0">0</option>
                    <option value="1">开箱割草传奇1</option>
                    <option value="2">极简数字华容道</option>
                    <option value="3">消消乐大冒险</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* 投放平台 */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  投放平台 <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <select
                    value={googleChannelPlatform}
                    onChange={e => setGoogleChannelPlatform(e.target.value)}
                    className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                  >
                    <option value="0">0</option>
                    <option value="gg_ac">Google 应用程序系列 (AC Ads)</option>
                    <option value="gg_search">Google 搜索和展示系列</option>
                    <option value="gg_pmax">Google 效果最大化系列 (PMax)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* 渠道 */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  渠道 <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  {googleChannelGame === '0' ? (
                    <select
                      disabled
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-400 focus:outline-hidden appearance-none cursor-not-allowed text-center"
                    >
                      <option value="">请先选择游戏</option>
                    </select>
                  ) : (
                    <select
                      value={googleChannelSource}
                      onChange={e => setGoogleChannelSource(e.target.value)}
                      className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                    >
                      <option value="Google Ads">Google Ads</option>
                      <option value="YouTube Ads">YouTube Ads</option>
                      <option value="Google Search">Google Search</option>
                      <option value="Google Play Store">Google Play Store</option>
                    </select>
                  )}
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* 投放地区 */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  投放地区 <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <select
                    value={googleChannelRegion}
                    onChange={e => {
                      setGoogleChannelRegion(e.target.value);
                      setGoogleChannelRegionTouched(true);
                      if (e.target.value) {
                        setGoogleChannelConfigured(true);
                      } else {
                        setGoogleChannelConfigured(false);
                      }
                    }}
                    className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                  >
                    <option value="">请选择投放地区</option>
                    <option value="US">北美地区 (美国/加拿大)</option>
                    <option value="SEA">东南亚地区 (新加坡/泰国)</option>
                    <option value="TW">港澳台地区 (中国台湾)</option>
                    <option value="EU">欧洲地区 (英国/德国/法国)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
                {(!googleChannelRegion || !googleChannelRegionTouched) && (
                  <div className="text-rose-500 font-bold text-[10.5px] mt-1.5 flex items-center gap-1 animate-pulse">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>请选择投放地区</span>
                  </div>
                )}
              </div>

              {/* 投手 */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  投手 <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <span className={`font-bold ${googleChannelPitcher ? 'text-slate-800 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded' : 'text-slate-400'}`}>
                    {googleChannelPitcher || '未选择投手'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const names = ['投手张三', '投手李四', '投手王五'];
                      const picked = names[Math.floor(Math.random() * names.length)] + ` (${Math.floor(100 + Math.random() * 900)})`;
                      setGoogleChannelPitcher(picked);
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-250 hover:border-slate-350 hover:bg-slate-50 text-slate-700 font-bold rounded-sm cursor-pointer transition-colors"
                  >
                    选择投手
                  </button>
                  {googleChannelPitcher && (
                    <button 
                      type="button" 
                      onClick={() => setGoogleChannelPitcher('')}
                      className="text-slate-400 hover:text-slate-600 font-bold"
                    >
                      清除
                    </button>
                  )}
                </div>
              </div>

              {/* 标签 */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">标签</label>
                <div className="flex items-center gap-3">
                  {googleChannelLabel ? (
                    <span className="font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded flex items-center gap-1">
                      <span>{googleChannelLabel}</span>
                      <button 
                        type="button" 
                        onClick={() => setGoogleChannelLabel('')}
                        className="hover:bg-blue-100 p-0.5 rounded-full w-4 h-4 flex items-center justify-center text-[9px] text-blue-500"
                      >
                        ✕
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const tags = ['GG-TEST-CAMP', 'GLOBAL-ADV', 'SUMMER-SPECIAL'];
                        const picked = tags[Math.floor(Math.random() * tags.length)];
                        setGoogleChannelLabel(picked);
                      }}
                      className="px-3 py-1.5 bg-white border border-slate-250 hover:border-slate-350 hover:bg-slate-50 text-slate-700 font-bold rounded-sm cursor-pointer transition-colors"
                    >
                      选择标签
                    </button>
                  )}
                </div>
              </div>

              {/* 备注 */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">备注</label>
                <textarea
                  value={googleChannelRemark}
                  onChange={e => setGoogleChannelRemark(e.target.value)}
                  placeholder="请输入备注信息"
                  rows={3}
                  className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Mode: manual (手动输入) */}
          {googleChannelGenMode === 'manual' && (
            <div className="space-y-3.5 max-w-xl pt-2 animate-fade-in">
              {/* 游戏 */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  游戏 <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <select
                    value={googleChannelGame}
                    onChange={e => {
                      setGoogleChannelGame(e.target.value);
                      if (e.target.value === '0') {
                        setGoogleChannelManualCode('');
                      }
                    }}
                    className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                  >
                    <option value="0">0</option>
                    <option value="1">开箱割草传奇1</option>
                    <option value="2">极简数字华容道</option>
                    <option value="3">消消乐大冒险</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* 渠道号 */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  渠道号 <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  {googleChannelGame === '0' ? (
                    <select
                      disabled
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-400 focus:outline-hidden appearance-none cursor-not-allowed text-center"
                    >
                      <option value="">请先选择游戏</option>
                    </select>
                  ) : (
                    <select
                      value={googleChannelManualCode}
                      onChange={e => {
                        setGoogleChannelManualCode(e.target.value);
                      }}
                      className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                    >
                      <option value="">请选择渠道号</option>
                      <option value="CHAN_GG_01">CHAN_GG_01 (200192)</option>
                      <option value="CHAN_GG_02">CHAN_GG_02 (200193)</option>
                      <option value="CHAN_GG_03">CHAN_GG_03 (200194)</option>
                    </select>
                  )}
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Blue Confirm Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (googleChannelGame === '0') {
                      alert('请选择具体游戏后再进行确认！');
                      return;
                    }
                    if (!googleChannelManualCode) {
                      alert('请选择渠道号后再进行确认！');
                      return;
                    }
                    setGoogleChannelConfigured(true);
                    alert(`渠道号配置成功！已绑定游戏并同步手动输入渠道号 [${googleChannelManualCode}]`);
                  }}
                  className="px-5 py-2 bg-[#2563eb] hover:bg-blue-700 text-white font-extrabold rounded-sm shadow-3xs transition-all cursor-pointer text-xs"
                >
                  确认
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. 地区组 (Region Group) */}
      <div ref={steps[4].ref} id="google-region-group" className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-all">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-blue-600 rounded-2xs inline-block"></span>
            <h3 className="text-xs font-bold text-slate-900 inline-block">地区组</h3>
          </div>
          
          <div className="flex items-center gap-2 select-none">
            <span 
              className="text-slate-400 font-bold hover:text-slate-600 text-[11px] cursor-pointer px-1" 
              onClick={() => alert('已开启批量操作选项')}
            >
              批量操作 ▾
            </span>
            <span 
              className="text-slate-400 font-bold hover:text-slate-600 text-[11px] cursor-pointer pl-1 pr-3" 
              onClick={() => {
                if (confirm('确定要清空地区组配置吗？')) {
                  setGoogleRegionGroups([{
                    id: 'rg1',
                    name: '地区组1',
                    selectedRegions: [],
                    excludedRegions: [],
                    isSpecifiedRegion: false,
                    languageOption: 'all',
                    selectedLanguages: [],
                    targetOption: 'target_presence_interest',
                    excludeOption: '',
                    selectedTag: '',
                    feedOption: 'auto'
                  }]);
                }
              }}
            >
              清空
            </span>
            <button
              type="button"
              onClick={handleAddRegionGroup}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10.5px] font-bold rounded transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
            >
              <span>+ 新增</span>
            </button>
            <span className="text-slate-400 text-xs font-mono font-bold select-none ml-1">
              {googleRegionGroups.findIndex(g => g.id === activeGoogleRegionGroupId) + 1}/{googleRegionGroups.length}
            </span>
          </div>
        </div>

        {/* Tabs line */}
        <div className="flex items-center justify-between border-b border-slate-200 mb-4 select-none pr-3">
          <div className="flex gap-1.5 overflow-x-auto max-w-full pb-px">
            {googleRegionGroups.map((rg, idx) => (
              <span
                key={rg.id}
                onClick={() => setActiveGoogleRegionGroupId(rg.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1 border text-xs font-bold rounded-t-md transition-all cursor-pointer ${
                  activeGoogleRegionGroupId === rg.id
                    ? 'border-blue-600 text-blue-600 bg-slate-50/50 font-bold border-b-2 border-b-blue-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/30'
                }`}
              >
                <span>🌍 {rg.name}</span>
                <span 
                  className="text-[11px] opacity-70 hover:opacity-100 pl-1 font-bold cursor-pointer inline-block w-4 h-4 text-center leading-4 hover:bg-black/10 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveGoogleRegionGroupId(rg.id);
                    const rect = e.currentTarget.getBoundingClientRect();
                    setGoogleTabMenuCoords({
                      top: rect.bottom + 4,
                      left: rect.left
                    });
                    setGoogleTabMenuOpenId(googleTabMenuOpenId === rg.id ? null : rg.id);
                    setGoogleTabMenuType('region');
                  }}
                  title="地区组操作"
                >
                  ⋮
                </span>
              </span>
            ))}
          </div>
          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-600 select-none">
            <input
              type="checkbox"
              checked={isExistingRegionChecked}
              onChange={e => setIsExistingRegionChecked(e.target.checked)}
              className="rounded text-blue-600 focus:ring-0"
            />
            <span>选择已有地区组</span>
          </label>
        </div>

        {/* Region Group Settings Form */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-start">
          
          <div className="space-y-4">
            
            {/* Row 1: 地区选择 */}
            <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
              <span className="text-slate-500 font-semibold">地区</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateActiveRG({ isSpecifiedRegion: false, selectedRegions: [], excludedRegions: [] })}
                  className={`px-4 py-1.5 border font-bold text-xs rounded transition-all cursor-pointer ${
                    !currentRegionGroup.isSpecifiedRegion
                      ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  不限
                </button>
                <button
                  type="button"
                  onClick={() => updateActiveRG({ isSpecifiedRegion: true })}
                  className={`px-4 py-1.5 border font-bold text-xs rounded transition-all cursor-pointer ${
                    currentRegionGroup.isSpecifiedRegion
                      ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  指定
                </button>
              </div>
            </div>

            {/* Row 2: 语言 */}
            <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
              <span className="text-slate-500 font-semibold">语言</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateActiveRG({ languageOption: 'all', selectedLanguages: [] })}
                  className={`px-4 py-1.5 border font-bold text-xs rounded transition-all cursor-pointer ${
                    currentRegionGroup.languageOption === 'all'
                      ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  不限
                </button>
                <button
                  type="button"
                  onClick={() => updateActiveRG({ languageOption: 'specified' })}
                  className={`px-4 py-1.5 border font-bold text-xs rounded transition-all cursor-pointer ${
                    currentRegionGroup.languageOption === 'specified'
                      ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  指定
                </button>
              </div>
            </div>

            {currentRegionGroup.languageOption === 'specified' && (
              <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                <span className="text-slate-500 font-semibold">选择适用语言</span>
                <div className="relative max-w-xs w-full">
                  <div
                    onClick={() => setGoogleLanguageDropdownOpen(!googleLanguageDropdownOpen)}
                    className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-1.5 pr-10 text-xs font-bold text-slate-800 cursor-pointer flex justify-between items-center h-8 shadow-3xs select-none"
                  >
                    <span>
                      {currentRegionGroup.selectedLanguages.length > 0 
                        ? currentRegionGroup.selectedLanguages.join(', ') 
                        : '请选择语言'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>

                  {googleLanguageDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded shadow-lg z-50 p-2 max-h-[180px] overflow-y-auto">
                      {['中文(简体)', '中文(繁体)', '英语', '日语', '韩语', '德语', '法语', '印尼语', '越南语', '西班牙语', '葡萄牙语'].map(lang => {
                        const isChecked = currentRegionGroup.selectedLanguages.includes(lang);
                        return (
                          <label key={lang} className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer font-semibold text-slate-700">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                const updated = isChecked
                                  ? currentRegionGroup.selectedLanguages.filter(l => l !== lang)
                                  : [...currentRegionGroup.selectedLanguages, lang];
                                updateActiveRG({ selectedLanguages: updated });
                              }}
                              className="rounded text-blue-600 focus:ring-0"
                            />
                            <span>{lang}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Row 3: 目标定位 */}
            <div className="grid grid-cols-[100px_1fr] gap-4 items-start pt-1">
              <span className="text-slate-500 font-semibold pt-1">目标</span>
              <div className="space-y-3 max-w-xl">
                <label className="flex items-start gap-2 cursor-pointer select-none text-slate-700">
                  <input
                    type="radio"
                    name={`region_target_${currentRegionGroup.id}`}
                    checked={currentRegionGroup.targetOption === 'target_presence_interest'}
                    onChange={() => updateActiveRG({ targetOption: 'target_presence_interest' })}
                    className="mt-1 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="font-semibold leading-relaxed">
                    所在地或兴趣：位于您定位到的地理位置、经常前往这些位置或对这些位置表现出兴趣的用户（推荐）
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer select-none text-slate-750">
                  <input
                    type="radio"
                    name={`region_target_${currentRegionGroup.id}`}
                    checked={currentRegionGroup.targetOption === 'target_presence'}
                    onChange={() => updateActiveRG({ targetOption: 'target_presence' })}
                    className="mt-1 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="font-semibold leading-relaxed">
                    所在地：位于您定位到的地理位置或经常前往这些位置的用户
                  </span>
                </label>
              </div>
            </div>

            {/* Row 4: 排除定位 */}
            <div className="grid grid-cols-[100px_1fr] gap-4 items-start pt-1">
              <span className="text-slate-500 font-semibold pt-1">排除</span>
              <div className="space-y-3 max-w-xl">
                <label className="flex items-start gap-2 cursor-pointer select-none text-slate-700">
                  <input
                    type="radio"
                    name={`region_exclude_${currentRegionGroup.id}`}
                    checked={currentRegionGroup.excludeOption === 'exclude_presence'}
                    onChange={() => updateActiveRG({ excludeOption: 'exclude_presence' })}
                    className="mt-1 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="font-semibold leading-relaxed">
                    所在地：位于您排除的地理位置的用户（推荐）
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer select-none text-slate-700">
                  <input
                    type="radio"
                    name={`region_exclude_${currentRegionGroup.id}`}
                    checked={currentRegionGroup.excludeOption === 'exclude_presence_interest'}
                    onChange={() => updateActiveRG({ excludeOption: 'exclude_presence_interest' })}
                    className="mt-1 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="font-semibold leading-relaxed">
                    所在地或兴趣：位于您排除的地理位置、经常前往这些位置或对 these locations 表现出兴趣的用户
                  </span>
                </label>
              </div>
            </div>

            {/* Row 5: 标签 */}
            <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
              <span className="text-slate-500 font-semibold flex items-center gap-1">
                <span>标签</span>
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              </span>
              <div className="relative max-w-xs w-full">
                <select
                  value={currentRegionGroup.selectedTag || ''}
                  onChange={e => updateActiveRG({ selectedTag: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 pr-10 text-xs focus:outline-hidden appearance-none cursor-pointer text-slate-800 font-bold"
                >
                  <option value="">请选择</option>
                  <option value="T1">T1 高价值地区</option>
                  <option value="T2">T2 常规地区</option>
                  <option value="T3">T3 低成本地区</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 pointer-events-none" />
              </div>
            </div>

            {/* Row 6: 地区组名称 */}
            <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
              <span className="text-slate-500 font-semibold">地区组名称</span>
              <div className="flex items-center gap-3 max-w-xs w-full">
                <input
                  type="text"
                  value={currentRegionGroup.name}
                  onChange={e => updateActiveRG({ name: e.target.value })}
                  className="flex-1 bg-white border border-slate-250 rounded px-3 py-1.5 font-bold text-slate-900 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-400 font-mono font-bold select-none shrink-0">
                  {currentRegionGroup.name.length}/20
                </span>
              </div>
            </div>

            {/* Row 7: 保存为地区组按钮 */}
            <div className="grid grid-cols-[100px_1fr] gap-4 items-center pt-2">
              <div />
              <div>
                <button
                  type="button"
                  onClick={() => alert(`成功保存地区组 "${currentRegionGroup.name}"！`)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs transition-colors shadow-2xs cursor-pointer"
                >
                  保存为地区组
                </button>
              </div>
            </div>

          </div>

          {/* Right Panel: Specifying and searching countries */}
          {currentRegionGroup.isSpecifiedRegion && (
            <div className="bg-white border border-slate-200 rounded p-4 space-y-4 shadow-sm animate-fade-in">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-blue-600 font-extrabold text-xs">国家和地区选择</span>
                <span className="text-[10px] text-blue-600 hover:underline cursor-pointer" onClick={() => {
                  updateActiveRG({
                    selectedRegions: ['美国', '加拿大', '英国', '澳大利亚', '德国', '法国', '日本', '韩国'],
                    excludedRegions: []
                  });
                }}>一键套用 T1 地区</span>
              </div>

              <div className="space-y-3">
                
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="检索并定位目标区域..."
                    value={googleRegionSearch}
                    onChange={e => setGoogleRegionSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded pl-8 pr-3 py-1.5 text-[11px] focus:outline-hidden text-slate-800 placeholder-slate-400 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Left Column: search results */}
                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto border border-slate-100 p-2 rounded bg-slate-50/30">
                    <span className="text-[9.5px] text-slate-400 block font-bold mb-1 border-b pb-1 select-none">可选国家/地区</span>
                    {[
                      { name: '美国', english: 'United States' },
                      { name: '日本', english: 'Japan' },
                      { name: '韩国', english: 'South Korea' },
                      { name: '新加坡', english: 'Singapore' },
                      { name: '加拿大', english: 'Canada' },
                      { name: '英国', english: 'United Kingdom' },
                      { name: '德国', english: 'Germany' },
                      { name: '法国', english: 'France' },
                      { name: '巴西', english: 'Brazil' },
                      { name: '印度尼西亚', english: 'Indonesia' },
                      { name: '越南', english: 'Vietnam' }
                    ].filter(c => c.name.includes(googleRegionSearch) || c.english.toLowerCase().includes(googleRegionSearch.toLowerCase())).map(c => {
                      const isIncluded = currentRegionGroup.selectedRegions.includes(c.name);
                      const isExcluded = currentRegionGroup.excludedRegions.includes(c.name);

                      return (
                        <div key={c.name} className="flex items-center justify-between py-1 px-1 border border-slate-100 bg-white rounded-sm">
                          <div>
                            <span className="text-[10.5px] font-bold text-slate-800 block">{c.name}</span>
                            <span className="text-[8.5px] text-slate-400 block truncate w-24 font-mono">{c.english}</span>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                if (isIncluded) {
                                  updateActiveRG({ selectedRegions: currentRegionGroup.selectedRegions.filter(r => r !== c.name) });
                                } else {
                                  updateActiveRG({
                                    selectedRegions: [...currentRegionGroup.selectedRegions, c.name],
                                    excludedRegions: currentRegionGroup.excludedRegions.filter(r => r !== c.name)
                                  });
                                }
                              }}
                              className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold cursor-pointer ${
                                isIncluded ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600'
                              }`}
                            >
                              添加
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (isExcluded) {
                                  updateActiveRG({ excludedRegions: currentRegionGroup.excludedRegions.filter(r => r !== c.name) });
                                } else {
                                  updateActiveRG({
                                    excludedRegions: [...currentRegionGroup.excludedRegions, c.name],
                                    selectedRegions: currentRegionGroup.selectedRegions.filter(r => r !== c.name)
                                  });
                                }
                              }}
                              className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold cursor-pointer ${
                                isExcluded ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600'
                              }`}
                            >
                              排除
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column: selected */}
                  <div className="space-y-3.5">
                    
                    {/* Included lists */}
                    <div className="space-y-1">
                      <span className="text-[9.5px] text-slate-400 block font-bold border-b pb-1 select-none">已包含 ({currentRegionGroup.selectedRegions.length})</span>
                      <div className="max-h-[100px] overflow-y-auto space-y-1">
                        {currentRegionGroup.selectedRegions.length === 0 ? (
                          <span className="text-[9.5px] text-slate-400 block italic py-2">暂无包含地区</span>
                        ) : (
                          currentRegionGroup.selectedRegions.map(name => (
                            <div key={name} className="flex items-center justify-between bg-blue-50/50 p-1 border border-blue-100 rounded">
                              <span className="text-[10px] font-bold text-slate-700">{name}</span>
                              <div className="flex gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateActiveRG({
                                      selectedRegions: currentRegionGroup.selectedRegions.filter(r => r !== name),
                                      excludedRegions: [...currentRegionGroup.excludedRegions, name]
                                    });
                                  }}
                                  className="text-[9px] text-rose-500 font-bold hover:underline"
                                >
                                  排除
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateActiveRG({ selectedRegions: currentRegionGroup.selectedRegions.filter(r => r !== name) })}
                                  className="text-[9px] text-slate-400 font-bold hover:text-slate-600"
                                >
                                  删除
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Excluded lists */}
                    <div className="space-y-1">
                      <span className="text-[9.5px] text-slate-400 block font-bold border-b pb-1 select-none">已排除 ({currentRegionGroup.excludedRegions.length})</span>
                      <div className="max-h-[100px] overflow-y-auto space-y-1">
                        {currentRegionGroup.excludedRegions.length === 0 ? (
                          <span className="text-[9.5px] text-slate-400 block italic py-2">暂无排除地区</span>
                        ) : (
                          currentRegionGroup.excludedRegions.map(name => (
                            <div key={name} className="flex items-center justify-between bg-rose-50/50 p-1 border border-rose-100 rounded">
                              <span className="text-[10px] font-bold text-slate-700">{name}</span>
                              <div className="flex gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateActiveRG({
                                      excludedRegions: currentRegionGroup.excludedRegions.filter(r => r !== name),
                                      selectedRegions: [...currentRegionGroup.selectedRegions, name]
                                    });
                                  }}
                                  className="text-[9px] text-blue-500 font-bold hover:underline"
                                >
                                  添加
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateActiveRG({ excludedRegions: currentRegionGroup.excludedRegions.filter(r => r !== name) })}
                                  className="text-[9px] text-slate-400 font-bold hover:text-slate-600"
                                >
                                  删除
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>
                </div>

              </div>
              
              <div className="text-right">
                <span className="text-[10px] text-blue-500 hover:underline cursor-pointer font-bold" onClick={() => setIsCreateAppModalOpen(true)}>
                  批量导入/排除
                </span>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* 3. 出价和预算 (Bidding & Budget) */}
      <div ref={steps[7].ref} id="google-bidding-budget" className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-all">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-blue-600 rounded-2xs inline-block"></span>
            <h3 className="text-xs font-bold text-slate-900 inline-block">出价和预算</h3>
          </div>
          
          <div className="flex items-center gap-2 select-none">
            <span 
              className="text-slate-400 font-bold hover:text-slate-600 text-[11px] cursor-pointer px-1" 
              onClick={() => alert('已开启预算批量操作')}
            >
              批量操作 ▾
            </span>
            <span 
              className="text-slate-400 font-bold hover:text-slate-600 text-[11px] cursor-pointer pl-1 pr-3" 
              onClick={() => {
                if (confirm('确定清空出价预算选项吗？')) {
                  setGoogleBudgets([{
                    id: 'gb1',
                    name: '出价和预算1',
                    focusGoal: 'INSTALLS',
                    targetUserType: 'ALL_USERS',
                    bidValue: '1.50',
                    bidStrategy: 'Highest value',
                    roasType: 'Day 0 ROAS',
                    budgetValue: '100.00',
                    startDate: '2026-06-25',
                    endDate: '',
                    scheduleType: 'now'
                  }]);
                }
              }}
            >
              清空
            </span>
            <button
              type="button"
              onClick={handleAddBudget}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10.5px] font-bold rounded transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
            >
              <span>+ 新增</span>
            </button>
            <span className="text-slate-400 text-xs font-mono font-bold select-none ml-1">
              {googleBudgets.findIndex(b => b.id === activeGoogleBudgetId) + 1}/{googleBudgets.length}
            </span>
          </div>
        </div>

        {/* Tabs Selection line */}
        <div className="flex items-center justify-between border-b border-slate-200 mb-4 select-none pr-3">
          <div className="flex gap-1.5 overflow-x-auto max-w-full pb-px">
            {googleBudgets.map((gb, idx) => (
              <span
                key={gb.id}
                onClick={() => setActiveGoogleBudgetId(gb.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1 border text-xs font-bold rounded-t-md transition-all cursor-pointer ${
                  activeGoogleBudgetId === gb.id
                    ? 'border-blue-600 text-blue-600 bg-slate-50/50 font-bold border-b-2 border-b-blue-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/30'
                }`}
              >
                <span>💰 {gb.name}</span>
                <span 
                  className="text-[11px] opacity-70 hover:opacity-100 pl-1 font-bold cursor-pointer inline-block w-4 h-4 text-center leading-4 hover:bg-black/10 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveGoogleBudgetId(gb.id);
                    const rect = e.currentTarget.getBoundingClientRect();
                    setGoogleTabMenuCoords({
                      top: rect.bottom + 4,
                      left: rect.left
                    });
                    setGoogleTabMenuOpenId(googleTabMenuOpenId === gb.id ? null : gb.id);
                    setGoogleTabMenuType('budget');
                  }}
                  title="出价和预算操作"
                >
                  ⋮
                </span>
              </span>
            ))}
          </div>
          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-600 select-none">
            <input
              type="checkbox"
              checked={isExistingBudgetChecked}
              onChange={e => setIsExistingBudgetChecked(e.target.checked)}
              className="rounded text-blue-600 focus:ring-0"
            />
            <span>选择已有出价预算</span>
          </label>
        </div>

        <div className="space-y-4 bg-slate-50/50 p-4 rounded-lg border border-slate-200">
          
          <div className="space-y-4 max-w-3xl">
            
            {/* Row 1: 您希望着重实现的目标是什么 / 优化方向 */}
            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
              <span className="text-slate-500 font-semibold">您希望着重实现的目标是什么</span>
              <div className="flex gap-2 w-full">
                {[
                  { id: 'INSTALLS', label: '安装量' },
                  { id: 'IN_APP_ACTIONS', label: '应用内操作次数' },
                  { id: 'IN_APP_ACTION_VALUE', label: '应用内操作价值' }
                ].map(goal => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => handleFocusGoalChange(goal.id as any)}
                    className={`px-3.5 py-1.5 border font-bold text-xs rounded transition-colors cursor-pointer text-center flex-1 ${
                      activeBudget.focusGoal === goal.id
                        ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {goal.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: 您希望如何跟踪安装次数 * */}
            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
              <span className="text-slate-500 font-semibold">您希望如何跟踪安装次数 <span className="text-rose-500 font-bold">*</span></span>
              <div className="relative max-w-sm w-full">
                <select
                  className="w-full bg-white border border-slate-250 rounded px-3 py-1.5 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="">请选择</option>
                  <option value="firebase">Google Analytics for Firebase (推荐)</option>
                  <option value="play_store">Google Play 商店安装归因</option>
                  <option value="third_party">第三方应用归因跟踪</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Row 3 (Conditional 1): 您希望定位哪类用户 (Shown only for INSTALLS) */}
            {activeBudget.focusGoal === 'INSTALLS' && (
              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center animate-fade-in">
                <span className="text-slate-500 font-semibold">您希望定位哪类用户</span>
                <div className="relative max-w-sm w-full">
                  <select
                    value={activeBudget.targetUserType}
                    onChange={e => updateActiveBudget({ targetUserType: e.target.value as any })}
                    className="w-full bg-white border border-slate-250 rounded px-3 py-1.5 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                  >
                    <option value="ALL_USERS">所有用户</option>
                    <option value="LIKELY_ACTION">有可能执行应用内操作的用户</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Row 3 (Conditional 2): 哪些转化操作对您最为重要 (Shown for IN_APP_ACTIONS and IN_APP_ACTION_VALUE) */}
            {(activeBudget.focusGoal === 'IN_APP_ACTIONS' || activeBudget.focusGoal === 'IN_APP_ACTION_VALUE') && (
              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center animate-fade-in">
                <span className="text-slate-500 font-semibold">哪些转化操作对您最为重要 <span className="text-rose-500 font-bold">*</span></span>
                <div className="relative max-w-sm w-full">
                  <select
                    className="w-full bg-white border border-slate-250 rounded px-3 py-1.5 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                    defaultValue=""
                  >
                    <option value="">请选择</option>
                    <option value="purchase">in_app_purchase (付费买入事件)</option>
                    <option value="registration">sign_up (注册成功事件)</option>
                    <option value="tutorial">tutorial_complete (新手教程完成事件)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Row 4: 日预算 */}
            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center border-t border-slate-100 pt-3">
              <span className="text-slate-500 font-semibold">日预算 <span className="text-rose-500 font-bold">*</span></span>
              <div className="flex items-center gap-3 max-w-sm w-full">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={activeBudget.budgetValue}
                    onChange={e => updateActiveBudget({ budgetValue: e.target.value })}
                    className="w-full bg-white border border-slate-250 rounded px-3.5 py-1.5 text-xs text-slate-800 font-bold font-mono focus:outline-hidden focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-2 text-slate-400 font-bold text-[10px]">USD</span>
                </div>
                <label className="flex items-center gap-1 cursor-pointer text-xs font-bold text-slate-600 select-none shrink-0">
                  <input
                    type="checkbox"
                    className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span>分地区预算</span>
                </label>
              </div>
            </div>

            {/* Row 5 (Bidding Customization based on target goal) */}
            {activeBudget.focusGoal === 'INSTALLS' && (
              <>
                {/* Outbid options for INSTALLS */}
                <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
                  <span className="text-slate-500 font-semibold">出价 <span className="text-rose-500 font-bold">*</span></span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="px-3.5 py-1.5 border border-blue-500 bg-blue-50 text-blue-600 font-bold rounded text-xs shadow-3xs"
                    >
                      目标每次操作费用
                    </button>
                    <button
                      type="button"
                      disabled
                      className="px-3.5 py-1.5 border border-slate-200 bg-slate-50 text-slate-400 font-bold rounded text-xs cursor-not-allowed"
                    >
                      尽可能提高转化次数
                    </button>
                  </div>
                </div>

                {/* Sub row input for Target CPA / Install */}
                <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
                  <div />
                  <div className="flex items-center gap-3 max-w-sm w-full">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="0.00"
                        value={activeBudget.bidValue}
                        onChange={e => updateActiveBudget({ bidValue: e.target.value })}
                        className="w-full bg-white border border-slate-250 rounded px-3.5 py-1.5 text-xs text-slate-850 font-bold font-mono focus:outline-hidden"
                      />
                      <span className="absolute right-3 top-2 text-slate-400 font-bold text-[10px]">USD</span>
                    </div>
                    <label className="flex items-center gap-1 cursor-pointer text-xs font-bold text-slate-600 select-none shrink-0">
                      <input
                        type="checkbox"
                        className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                      />
                      <span>分地区出价</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {activeBudget.focusGoal === 'IN_APP_ACTIONS' && (
              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
                <span className="text-slate-500 font-semibold">出价 <span className="text-rose-500 font-bold">*</span></span>
                <div className="flex items-center gap-3 max-w-sm w-full">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="0.00"
                      value={activeBudget.bidValue}
                      onChange={e => updateActiveBudget({ bidValue: e.target.value })}
                      className="w-full bg-white border border-slate-250 rounded px-3.5 py-1.5 text-xs text-slate-850 font-bold font-mono focus:outline-hidden"
                    />
                    <span className="absolute right-3 top-2 text-slate-400 font-bold text-[10px]">USD</span>
                  </div>
                  <label className="flex items-center gap-1 cursor-pointer text-xs font-bold text-slate-600 select-none shrink-0">
                    <input
                      type="checkbox"
                      className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>分地区出价</span>
                  </label>
                </div>
              </div>
            )}

            {activeBudget.focusGoal === 'IN_APP_ACTION_VALUE' && (
              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
                <span className="text-slate-500 font-semibold">tROAS % <span className="text-rose-500 font-bold">*</span></span>
                <div className="flex items-center gap-3 max-w-sm w-full">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="0.00"
                      value={activeBudget.bidValue}
                      onChange={e => updateActiveBudget({ bidValue: e.target.value })}
                      className="w-full bg-white border border-slate-250 rounded px-3.5 py-1.5 text-xs text-slate-850 font-bold font-mono focus:outline-hidden"
                    />
                    <span className="absolute right-3 top-2 text-slate-400 font-bold text-[10px]">%</span>
                  </div>
                  <label className="flex items-center gap-1 cursor-pointer text-xs font-bold text-slate-600 select-none shrink-0">
                    <input
                      type="checkbox"
                      className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>分地区ROAS</span>
                  </label>
                </div>
              </div>
            )}

            {/* Row 6: 开始时间 */}
            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center pt-2">
              <span className="text-slate-500 font-semibold">开始时间 <span className="text-rose-500 font-bold">*</span></span>
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={() => updateActiveBudget({ scheduleType: 'now' })}
                  className={`px-4 py-1.5 border font-bold text-xs rounded transition-all cursor-pointer ${
                    activeBudget.scheduleType === 'now'
                      ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  现在开始
                </button>
                <button
                  type="button"
                  onClick={() => updateActiveBudget({ scheduleType: 'custom' })}
                  className={`px-4 py-1.5 border font-bold text-xs rounded transition-all cursor-pointer ${
                    activeBudget.scheduleType === 'custom'
                      ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  自定义
                </button>
                {activeBudget.scheduleType === 'custom' && (
                  <input
                    type="date"
                    value={activeBudget.startDate}
                    onChange={e => updateActiveBudget({ startDate: e.target.value })}
                    className="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 font-bold ml-2 animate-fade-in focus:outline-hidden"
                  />
                )}
              </div>
            </div>

            {/* Row 7: 结束时间 */}
            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
              <span className="text-slate-500 font-semibold">结束时间 <span className="text-rose-500 font-bold">*</span></span>
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={() => updateActiveBudget({ endDate: '' })}
                  className={`px-4 py-1.5 border font-bold text-xs rounded transition-all cursor-pointer ${
                    activeBudget.endDate === ''
                      ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  长期
                </button>
                <button
                  type="button"
                  onClick={() => updateActiveBudget({ endDate: '2026-12-31' })}
                  className={`px-4 py-1.5 border font-bold text-xs rounded transition-all cursor-pointer ${
                    activeBudget.endDate !== ''
                      ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  自定义
                </button>
                {activeBudget.endDate !== '' && (
                  <input
                    type="date"
                    value={activeBudget.endDate}
                    onChange={e => updateActiveBudget({ endDate: e.target.value })}
                    className="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 font-bold ml-2 animate-fade-in focus:outline-hidden"
                  />
                )}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 4. 广告组 (Ad Group) */}
      <div ref={steps[2].ref} id="google-ad-group" className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-all">
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5 mb-4">
          <span className="w-1.5 h-3.5 bg-blue-600 rounded-2xs inline-block"></span>
          <h3 className="text-xs font-bold text-slate-900 inline-block">广告组</h3>
        </div>

        <div className="space-y-4">
          
          {/* Row 1: 广告组名称 */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">广告组名称 <span className="text-rose-500">*</span></label>
            <input
              type="text"
              placeholder="DG_Perfect Avenger - Idle games_20260625"
              value={googleAdGroupName}
              onChange={e => setGoogleAdGroupName(e.target.value)}
              className="w-full max-w-lg bg-white border border-slate-250 rounded px-3.5 py-2 text-xs focus:outline-hidden focus:border-blue-500 font-bold"
            />

            <div className="mt-2.5 flex flex-wrap gap-2 select-none items-center">
              {[
                { label: '渠道号', value: '_{渠道号}_' },
                { label: '项目名称', value: '_{项目名称}_' },
                { label: '地区组名称', value: '_{地区组名称}_' },
                { label: '跑法', value: '_{跑法}_' },
                { label: '创意组名称', value: '_{创意组名称}_' },
                { label: '创建日期(yyyymmdd)', value: '_{创建日期(yyyymmdd)}_' },
                { label: '创建时间(HH:mm:ss)', value: '_{创建时间(HH:mm:ss)}_' },
                { label: '开始日期(yyyymmdd)', value: '_{开始日期(yyyymmdd)}_' }
              ].map(badge => (
                <button
                  key={badge.label}
                  type="button"
                  onClick={() => setGoogleAdGroupName(prev => prev + badge.value)}
                  className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  {badge.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setGoogleAdGroupName('')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-[11px] font-bold text-slate-500 transition-colors cursor-pointer"
              >
                清空
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 5. 创意组 (Creative / Asset Groups) */}
      <div ref={steps[9].ref} id="google-creative-group" className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-all">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-blue-600 rounded-2xs inline-block"></span>
            <h3 className="text-xs font-bold text-slate-900 inline-block">创意组</h3>
          </div>
          
          <div className="flex items-center gap-2 select-none">
            <span 
              className="text-slate-400 font-bold hover:text-slate-600 text-[11px] cursor-pointer px-1" 
              onClick={() => alert('创意批量重命名已开启')}
            >
              批量操作 ▾
            </span>
            <span 
              className="text-slate-400 font-bold hover:text-slate-600 text-[11px] cursor-pointer pl-1 pr-3" 
              onClick={() => {
                if (confirm('确定要清空该创意组中所有素材、标题和描述吗？')) {
                  setGoogleCreativeGroups([{
                    id: 'cg1',
                    name: '创意组1',
                    videos: [],
                    images: [],
                    html5s: [],
                    titles: ['', ''],
                    descriptions: [''],
                    deepLink: '',
                    tag: ''
                  }]);
                }
              }}
            >
              清空
            </span>
            <button
              type="button"
              onClick={handleAddCreativeGroup}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10.5px] font-bold rounded transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
            >
              <span>+ 新增</span>
            </button>
            <span className="text-slate-400 text-xs font-mono font-bold select-none ml-1">
              {googleCreativeGroups.findIndex(g => g.id === activeGoogleCreativeGroupId) + 1}/{googleCreativeGroups.length}
            </span>
          </div>
        </div>

        {/* Tabs Selection */}
        <div className="flex items-center justify-between border-b border-slate-200 mb-4 select-none pr-3">
          <div className="flex gap-1.5 overflow-x-auto max-w-full pb-px">
            {googleCreativeGroups.map((cg, idx) => (
              <span
                key={cg.id}
                onClick={() => setActiveGoogleCreativeGroupId(cg.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1 border text-xs font-bold rounded-t-md transition-all cursor-pointer ${
                  activeGoogleCreativeGroupId === cg.id
                    ? 'border-blue-600 text-blue-600 bg-slate-50/50 font-bold border-b-2 border-b-blue-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/30'
                }`}
              >
                <span>📦 {cg.name}</span>
                <span 
                  className="text-[11px] opacity-70 hover:opacity-100 pl-1 font-bold cursor-pointer inline-block w-4 h-4 text-center leading-4 hover:bg-black/10 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveGoogleCreativeGroupId(cg.id);
                    const rect = e.currentTarget.getBoundingClientRect();
                    setGoogleTabMenuCoords({
                      top: rect.bottom + 4,
                      left: rect.left
                    });
                    setGoogleTabMenuOpenId(googleTabMenuOpenId === cg.id ? null : cg.id);
                    setGoogleTabMenuType('creative');
                  }}
                  title="创意组操作"
                >
                  ⋮
                </span>
              </span>
            ))}
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-600 select-none">
            <input
              type="checkbox"
              checked={isExistingCreativeChecked}
              onChange={e => setIsExistingCreativeChecked(e.target.checked)}
              className="rounded text-blue-600 focus:ring-0"
            />
            <span>选择已有创意组</span>
          </label>
        </div>

        {/* Assets Inputs Area */}
        <div className="space-y-4 bg-slate-50/30 p-4 rounded-lg border border-slate-150">
          
          {/* Row 0: Binding Object */}
          <div className="grid grid-cols-[120px_1fr] md:grid-cols-[145px_1fr] gap-4 items-start border-b border-dashed border-slate-200 pb-3.5">
            <span className="text-slate-500 font-semibold flex items-center gap-0.5 pt-0.5 text-xs">
              <span>绑定对象</span>
              <span className="text-rose-500 font-bold">*</span>
            </span>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-800">{getGoogleBoundLabel(activeGoogleCreativeGroupId)}</span>
                <button
                  type="button"
                  onClick={() => setIsGoogleBindingRulesModalOpen(true)}
                  className="text-slate-400 hover:text-blue-600 transition-colors text-xs p-0.5 cursor-pointer"
                  title="修改绑定"
                >
                  ✏️
                </button>
              </div>
              {getGoogleBoundLabel(activeGoogleCreativeGroupId) === '请选择' && (
                <div className="text-rose-500 font-bold text-[10.5px]">请选择绑定对象</div>
              )}
            </div>
          </div>

          {/* Row 1: Videos (Max 20) */}
          <div className="grid grid-cols-[120px_1fr] md:grid-cols-[145px_1fr] gap-4 items-center border-b border-dashed border-slate-200 pb-3.5 pt-1">
            <span className="text-slate-500 font-semibold text-xs">视频</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleOpenMaterialPicker('video')}
                className="px-3 py-1 bg-white border border-slate-250 hover:bg-slate-50 text-slate-850 font-bold rounded text-xs cursor-pointer flex items-center gap-1.5 shadow-3xs"
              >
                <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>添加素材</span>
              </button>
              <span className="text-slate-400 font-mono font-bold text-xs">
                ({currentCreativeGroup.videos.length} / 20)
              </span>
              {currentCreativeGroup.videos.length > 0 && (
                <button 
                  type="button" 
                  className="text-blue-600 font-bold hover:underline text-xs" 
                  onClick={() => updateActiveCG({ videos: [] })}
                >
                  清除
                </button>
              )}
            </div>
          </div>

          {currentCreativeGroup.videos.length > 0 && (
            <div className="grid grid-cols-[120px_1fr] md:grid-cols-[145px_1fr] gap-4">
              <div />
              <div className="flex flex-wrap gap-1.5">
                {currentCreativeGroup.videos.map((vid, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded font-mono text-[11px] select-text">
                    <span className="text-slate-400">🎥</span>
                    <span>{vid}</span>
                    <button
                      type="button"
                      onClick={() => updateActiveCG({ videos: currentCreativeGroup.videos.filter(v => v !== vid) })}
                      className="text-rose-500 hover:text-rose-700 font-extrabold ml-1"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Row 2: Images (Max 20) */}
          <div className="grid grid-cols-[120px_1fr] md:grid-cols-[145px_1fr] gap-4 items-center border-b border-dashed border-slate-200 py-3.5">
            <span className="text-slate-500 font-semibold text-xs">图片</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleOpenMaterialPicker('image')}
                className="px-3 py-1 bg-white border border-slate-250 hover:bg-slate-50 text-slate-850 font-bold rounded text-xs cursor-pointer flex items-center gap-1.5 shadow-3xs"
              >
                <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>添加素材</span>
              </button>
              <span className="text-slate-400 font-mono font-bold text-xs">
                ({currentCreativeGroup.images.length} / 20)
              </span>
              {currentCreativeGroup.images.length > 0 && (
                <button 
                  type="button" 
                  className="text-blue-600 font-bold hover:underline text-xs" 
                  onClick={() => updateActiveCG({ images: [] })}
                >
                  清除
                </button>
              )}
            </div>
          </div>

          {currentCreativeGroup.images.length > 0 && (
            <div className="grid grid-cols-[120px_1fr] md:grid-cols-[145px_1fr] gap-4">
              <div />
              <div className="flex flex-wrap gap-1.5">
                {currentCreativeGroup.images.map((img, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded font-mono text-[11px] select-text">
                    <span className="text-slate-400">🖼️</span>
                    <span>{img}</span>
                    <button
                      type="button"
                      onClick={() => updateActiveCG({ images: currentCreativeGroup.images.filter(v => v !== img) })}
                      className="text-rose-500 hover:text-rose-700 font-extrabold ml-1"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Row 3: HTML5 (Max 20) */}
          <div className="grid grid-cols-[120px_1fr] md:grid-cols-[145px_1fr] gap-4 items-center border-b border-dashed border-slate-200 py-3.5">
            <span className="text-slate-500 font-semibold text-xs">HTML5</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleOpenMaterialPicker('html5')}
                className="px-3 py-1 bg-white border border-slate-250 hover:bg-slate-50 text-slate-850 font-bold rounded text-xs cursor-pointer flex items-center gap-1.5 shadow-3xs"
              >
                <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>添加素材</span>
              </button>
              <span className="text-slate-400 font-mono font-bold text-xs">
                ({currentCreativeGroup.html5s.length} / 20)
              </span>
              {currentCreativeGroup.html5s.length > 0 && (
                <button 
                  type="button" 
                  className="text-blue-600 font-bold hover:underline text-xs" 
                  onClick={() => updateActiveCG({ html5s: [] })}
                >
                  清除
                </button>
              )}
            </div>
          </div>

          {currentCreativeGroup.html5s.length > 0 && (
            <div className="grid grid-cols-[120px_1fr] md:grid-cols-[145px_1fr] gap-4">
              <div />
              <div className="flex flex-wrap gap-1.5">
                {currentCreativeGroup.html5s.map((h5, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded font-mono text-[11px] select-text">
                    <span className="text-slate-400">📦</span>
                    <span>{h5}</span>
                    <button
                      type="button"
                      onClick={() => updateActiveCG({ html5s: currentCreativeGroup.html5s.filter(v => v !== h5) })}
                      className="text-rose-500 hover:text-rose-700 font-extrabold ml-1"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Row 4: Titles (2 to 5) */}
          <div className="grid grid-cols-[120px_1fr] md:grid-cols-[145px_1fr] gap-4 items-start border-b border-dashed border-slate-200 py-3.5">
            <span className="text-slate-500 font-semibold flex items-center gap-0.5 pt-1 text-xs">
              <span>标题</span>
              <span className="text-rose-500 font-bold">*</span>
            </span>
            <div className="space-y-3 max-w-xl w-full">
              {/* Control buttons */}
              <div className="flex items-center gap-2 select-none">
                <button
                  type="button"
                  onClick={() => {
                    const nextTitles = [...currentCreativeGroup.titles];
                    nextTitles[0] = copywritingLibrary.title[0];
                    updateActiveCG({ titles: nextTitles });
                  }}
                  className="px-2.5 py-1 bg-white border border-slate-250 hover:bg-slate-50 text-slate-750 font-bold rounded text-[11px] cursor-pointer shadow-3xs transition-all"
                >
                  选文案
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateActiveCG({ titles: [...copywritingLibrary.title.slice(0, 5)] });
                  }}
                  className="px-2.5 py-1 bg-white border border-slate-250 hover:bg-slate-50 text-slate-750 font-bold rounded text-[11px] cursor-pointer shadow-3xs transition-all"
                >
                  批量添加文案
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const shuffled = [...copywritingLibrary.title].sort(() => 0.5 - Math.random());
                    updateActiveCG({ titles: shuffled.slice(0, 3) });
                  }}
                  className="px-2.5 py-1 bg-white border border-slate-250 hover:bg-slate-50 text-slate-750 font-bold rounded text-[11px] cursor-pointer shadow-3xs transition-all"
                >
                  系统推荐
                </button>
                <span className="text-slate-400 font-mono font-bold text-[11px] ml-1">
                  ({currentCreativeGroup.titles.length} / 5)
                </span>
              </div>

              {/* Input fields */}
              <div className="space-y-3.5">
                {currentCreativeGroup.titles.map((title, tIdx) => (
                  <div key={tIdx} className="space-y-1">
                    <div className="flex items-center gap-2 select-text">
                      <span className="font-mono text-[10px] text-slate-400 w-12 shrink-0">标题 {tIdx + 1}</span>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="请输入标题"
                          value={title}
                          onChange={e => {
                            const nextTitles = [...currentCreativeGroup.titles];
                            nextTitles[tIdx] = e.target.value.slice(0, 30);
                            updateActiveCG({ titles: nextTitles });
                          }}
                          className="w-full bg-white border rounded px-3 py-1.5 pr-14 text-xs font-semibold text-slate-800 focus:outline-hidden"
                          style={{ borderColor: title.trim() ? '#cbd5e1' : '#f87171' }}
                        />
                        <span className="absolute right-3 top-2 text-[10px] font-mono text-slate-400 select-none">
                          {title.length} / 30
                        </span>
                      </div>
                      
                      {currentCreativeGroup.titles.length > 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            updateActiveCG({ titles: currentCreativeGroup.titles.filter((_, i) => i !== tIdx) });
                          }}
                          className="text-rose-500 hover:text-rose-750 font-extrabold text-[11px] px-1 shrink-0 cursor-pointer"
                        >
                          删除
                        </button>
                      )}
                    </div>
                    {!title.trim() && (
                      <div className="text-rose-500 font-bold text-[10.5px] pl-14">请输入标题</div>
                    )}
                  </div>
                ))}
              </div>

              {currentCreativeGroup.titles.length < 5 && (
                <button
                  type="button"
                  onClick={() => {
                    updateActiveCG({ titles: [...currentCreativeGroup.titles, ''] });
                  }}
                  className="px-2 py-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-[10px] rounded cursor-pointer flex items-center gap-0.5 max-w-max"
                >
                  <Plus className="w-3 h-3" />
                  <span>新增标题</span>
                </button>
              )}
            </div>
          </div>

          {/* Row 5: Descriptions (1 to 5) */}
          <div className="grid grid-cols-[120px_1fr] md:grid-cols-[145px_1fr] gap-4 items-start border-b border-dashed border-slate-200 py-3.5">
            <span className="text-slate-500 font-semibold flex items-center gap-0.5 pt-1 text-xs">
              <span>描述</span>
              <span className="text-rose-500 font-bold">*</span>
            </span>
            <div className="space-y-3 max-w-xl w-full">
              {/* Control buttons */}
              <div className="flex items-center gap-2 select-none">
                <button
                  type="button"
                  onClick={() => {
                    const nextDescs = [...currentCreativeGroup.descriptions];
                    nextDescs[0] = copywritingLibrary.description[0];
                    updateActiveCG({ descriptions: nextDescs });
                  }}
                  className="px-2.5 py-1 bg-white border border-slate-250 hover:bg-slate-50 text-slate-750 font-bold rounded text-[11px] cursor-pointer shadow-3xs transition-all"
                >
                  选文案
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateActiveCG({ descriptions: [...copywritingLibrary.description.slice(0, 5)] });
                  }}
                  className="px-2.5 py-1 bg-white border border-slate-250 hover:bg-slate-50 text-slate-750 font-bold rounded text-[11px] cursor-pointer shadow-3xs transition-all"
                >
                  批量添加文案
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const shuffled = [...copywritingLibrary.description].sort(() => 0.5 - Math.random());
                    updateActiveCG({ descriptions: shuffled.slice(0, 3) });
                  }}
                  className="px-2.5 py-1 bg-white border border-slate-250 hover:bg-slate-50 text-slate-750 font-bold rounded text-[11px] cursor-pointer shadow-3xs transition-all"
                >
                  系统推荐
                </button>
                <span className="text-slate-400 font-mono font-bold text-[11px] ml-1">
                  ({currentCreativeGroup.descriptions.length} / 5)
                </span>
              </div>

              {/* Input fields */}
              <div className="space-y-3.5">
                {currentCreativeGroup.descriptions.map((desc, dIdx) => (
                  <div key={dIdx} className="space-y-1">
                    <div className="flex items-center gap-2 select-text">
                      <span className="font-mono text-[10px] text-slate-400 w-12 shrink-0">描述 {dIdx + 1}</span>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="请输入描述"
                          value={desc}
                          onChange={e => {
                            const nextDescs = [...currentCreativeGroup.descriptions];
                            nextDescs[dIdx] = e.target.value.slice(0, 90);
                            updateActiveCG({ descriptions: nextDescs });
                          }}
                          className="w-full bg-white border rounded px-3 py-1.5 pr-14 text-xs font-semibold text-slate-800 focus:outline-hidden"
                          style={{ borderColor: desc.trim() ? '#cbd5e1' : '#f87171' }}
                        />
                        <span className="absolute right-3 top-2 text-[10px] font-mono text-slate-400 select-none">
                          {desc.length} / 90
                        </span>
                      </div>
                      
                      {currentCreativeGroup.descriptions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            updateActiveCG({ descriptions: currentCreativeGroup.descriptions.filter((_, i) => i !== dIdx) });
                          }}
                          className="text-rose-500 hover:text-rose-750 font-extrabold text-[11px] px-1 shrink-0 cursor-pointer"
                        >
                          删除
                        </button>
                      )}
                    </div>
                    {!desc.trim() && (
                      <div className="text-rose-500 font-bold text-[10.5px] pl-14">请输入描述</div>
                    )}
                  </div>
                ))}
              </div>

              {currentCreativeGroup.descriptions.length < 5 && (
                <button
                  type="button"
                  onClick={() => {
                    updateActiveCG({ descriptions: [...currentCreativeGroup.descriptions, ''] });
                  }}
                  className="px-2 py-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-[10px] rounded cursor-pointer flex items-center gap-0.5 max-w-max"
                >
                  <Plus className="w-3 h-3" />
                  <span>新增描述</span>
                </button>
              )}
            </div>
          </div>

          {/* Row 6: App Deep Link Dropdown */}
          <div className="grid grid-cols-[120px_1fr] md:grid-cols-[145px_1fr] gap-4 items-center border-b border-dashed border-slate-200 py-3.5">
            <span className="text-slate-500 font-semibold text-xs">应用深层链接</span>
            <div className="relative max-w-xs w-full">
              <select
                value={currentCreativeGroup.deepLink || ''}
                onChange={e => updateActiveCG({ deepLink: e.target.value })}
                className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-1.5 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
              >
                <option value="">请选择</option>
                <option value="applink://moonton.mobilelegends/open">开箱割草 - 主包</option>
                <option value="applink://moonton.mobilelegends/event_page">极速开箱 - 活动页</option>
                <option value="applink://moonton.mobilelegends/shop_page">休闲解压 - 商店页</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 pointer-events-none" />
            </div>
          </div>

          {/* Row 7: Tag Select Dropdown (标签②) */}
          <div className="grid grid-cols-[120px_1fr] md:grid-cols-[145px_1fr] gap-4 items-center border-b border-dashed border-slate-200 py-3.5 animate-fade-in">
            <span className="text-slate-500 font-semibold flex items-center gap-0.5 text-xs">
              <span>标签②</span>
            </span>
            <div className="relative max-w-xs w-full">
              <select
                value={currentCreativeGroup.tag || ''}
                onChange={e => updateActiveCG({ tag: e.target.value })}
                className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-1.5 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
              >
                <option value="">请选择</option>
                <option value="T1">T1 高价值标签</option>
                <option value="T2">T2 常规属性标签</option>
                <option value="T3">T3 核心付费标签</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 pointer-events-none" />
            </div>
          </div>

          {/* Row 8: Creative Group Name Input */}
          <div className="grid grid-cols-[120px_1fr] md:grid-cols-[145px_1fr] gap-4 items-center border-b border-dashed border-slate-200 py-3.5">
            <span className="text-slate-500 font-semibold text-xs">创意组名称</span>
            <div className="flex items-center gap-3 max-w-sm w-full">
              <input
                type="text"
                value={currentCreativeGroup.name}
                onChange={e => updateActiveCG({ name: e.target.value })}
                className="flex-1 bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-1.5 font-bold text-slate-900 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-400 font-mono font-bold select-none shrink-0 border-l border-slate-200 pl-2">
                {currentCreativeGroup.name.length} / 100
              </span>
            </div>
          </div>

          {/* Row 9: Save Button */}
          <div className="grid grid-cols-[120px_1fr] md:grid-cols-[145px_1fr] gap-4 items-center pt-3">
            <div />
            <div>
              <button
                type="button"
                onClick={() => {
                  if (getGoogleBoundLabel(activeGoogleCreativeGroupId) === '请选择') {
                    alert('请先选择绑定对象！');
                    return;
                  }
                  if (currentCreativeGroup.titles.some(t => !t.trim()) || currentCreativeGroup.descriptions.some(d => !d.trim())) {
                    alert('请填写所有必填字段（带有红框/警告的标题或描述）！');
                    return;
                  }
                  alert(`创意组 "${currentCreativeGroup.name}" 保存成功！`);
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-md shadow-3xs cursor-pointer text-xs transition-colors"
              >
                保存创意组
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* --- Upgraded high fidelity "选择应用" / "注册应用" Modal --- */}
      {isCreateAppModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 animate-fade-in select-none">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-xl w-full overflow-hidden">
            
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-150 px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">选择应用</span>
              <button 
                type="button" 
                onClick={() => setIsCreateAppModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-200 text-xs font-bold select-none bg-slate-50/50">
              <button
                type="button"
                onClick={() => setCreateAppTab('search')}
                className={`flex-1 py-3 text-center transition-all ${
                  createAppTab === 'search'
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-white'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                }`}
              >
                搜索
              </button>
              <button
                type="button"
                onClick={() => setCreateAppTab('enter')}
                className={`flex-1 py-3 text-center transition-all ${
                  createAppTab === 'enter'
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-white'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                }`}
              >
                录入
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs font-sans min-h-[280px]">
              {createAppTab === 'search' ? (
                <div className="space-y-4 animate-fade-in">
                  
                  {/* Search filters */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase">应用商店</label>
                      <select
                        value={searchStore}
                        onChange={e => setSearchStore(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:outline-hidden font-semibold cursor-pointer"
                      >
                        <option value="gp">Google Play (Android)</option>
                        <option value="ios">Apple App Store (iOS)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase">国家/地区</label>
                      <select
                        value={searchCountry}
                        onChange={e => setSearchCountry(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:outline-hidden font-semibold cursor-pointer"
                      >
                        <option value="all">不限</option>
                        <option value="us">美国 (United States)</option>
                        <option value="jp">日本 (Japan)</option>
                        <option value="kr">韩国 (South Korea)</option>
                        <option value="cn">中国 (China)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase">应用名称/包名/发行商</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="请输入关键词..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className="w-full bg-white border border-slate-250 rounded pl-3 pr-8 py-1.5 focus:outline-hidden focus:border-blue-500 font-semibold"
                        />
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* List of matching apps */}
                  <div className="space-y-2 max-h-[160px] overflow-y-auto border border-slate-150 rounded p-2 bg-slate-50/50">
                    <span className="text-[10px] text-slate-400 block font-bold mb-1 select-none">搜索推荐结果</span>
                    {mockGamesList
                      .filter(g => {
                        if (g.store !== searchStore) return false;
                        if (searchQuery.trim() !== '') {
                          return g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.package.toLowerCase().includes(searchQuery.toLowerCase());
                        }
                        return true;
                      })
                      .map(g => (
                        <div key={g.package} className="flex items-center justify-between p-2 border border-slate-100 bg-white rounded-md hover:border-blue-400 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{g.icon}</span>
                            <div>
                              <span className="font-bold text-slate-800 block">{g.name}</span>
                              <span className="text-[9.5px] font-mono text-slate-400 block">{g.package}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const entry = `${g.package} (${g.name})`;
                              if (!googleCreatedApps.includes(entry) && g.package !== 'com.pg.avenger.gp') {
                                setGoogleCreatedApps(prev => [...prev, entry]);
                              }
                              setGoogleApp(g.package === 'com.pg.avenger.gp' ? 'com.pg.avenger.gp' : entry);
                              setIsCreateAppModalOpen(false);
                              alert(`已成功选择应用: ${g.name}`);
                            }}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-[10px] cursor-pointer shadow-3xs"
                          >
                            选择
                          </button>
                        </div>
                      ))}
                  </div>

                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  
                  <div className="space-y-1">
                    <span className="block font-bold text-slate-700">应用商店平台</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCreateAppPlatform('android')}
                        className={`flex-1 py-2 border font-bold rounded text-center transition-all cursor-pointer ${
                          createAppPlatform === 'android'
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Google Play (Android)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCreateAppPlatform('ios')}
                        className={`flex-1 py-2 border font-bold rounded text-center transition-all cursor-pointer ${
                          createAppPlatform === 'ios'
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Apple App Store (iOS)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="block font-bold text-slate-700">应用显示名称</span>
                    <input
                      type="text"
                      value={createAppName}
                      onChange={e => setCreateAppName(e.target.value)}
                      placeholder="例如: 王者对决国际版"
                      className="w-full bg-white border border-slate-250 rounded px-3 py-2 focus:outline-hidden focus:border-blue-500 font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="block font-bold text-slate-700">
                      {createAppPlatform === 'android' ? '应用唯一包名 (Package Name)' : 'Apple App Store ID / 10位数字'}
                    </span>
                    <input
                      type="text"
                      value={createAppPackage}
                      onChange={e => setCreateAppPackage(e.target.value)}
                      placeholder={createAppPlatform === 'android' ? '例如: com.moonton.mobilelegends' : '例如: 1542751371'}
                      className="w-full bg-white border border-slate-250 rounded px-3 py-2 focus:outline-hidden focus:border-blue-500 font-mono"
                    />
                  </div>

                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-150 px-4 py-2.5 flex justify-end gap-2 text-xs font-sans font-bold">
              <button
                type="button"
                onClick={() => setIsCreateAppModalOpen(false)}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 rounded cursor-pointer"
              >
                取消
              </button>
              {createAppTab === 'enter' && (
                <button
                  type="button"
                  onClick={() => {
                    if (!createAppName.trim() || !createAppPackage.trim()) {
                      alert('请完整填写应用显示名称及包名！');
                      return;
                    }
                    const entry = `${createAppPackage} (${createAppName})`;
                    setGoogleCreatedApps(prev => [...prev, entry]);
                    setGoogleApp(entry);
                    setIsCreateAppModalOpen(false);
                    setCreateAppName('');
                    setCreateAppPackage('');
                    alert(`成功关联并选择应用: ${entry}`);
                  }}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-2xs cursor-pointer"
                >
                  确认关联
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* --- Internal Modal 2: Material Picker (素材库选取) --- */}
      {isPickerOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 animate-fade-in select-none">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-3xl w-full flex flex-col h-[520px]">
            
            <div className="bg-slate-50 border-b border-slate-150 px-4 py-3 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-900">
                  选择本地推送之 {pickerTargetType === 'video' ? '视频' : pickerTargetType === 'image' ? '图片' : 'HTML5'} 素材
                </span>
                <span className="text-[10px] text-slate-400 font-bold ml-2">最多可选 20 个素材</span>
              </div>
              <button 
                type="button" 
                onClick={() => setIsPickerOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4">
              
              {/* Folders List Side */}
              <div className="border-r border-slate-150 pr-2 space-y-1">
                <span className="text-[10px] uppercase text-slate-400 block font-bold mb-1.5 tracking-wider">素材文件夹</span>
                <button
                  type="button"
                  onClick={() => setPickerFolderFilter('all')}
                  className={`w-full text-left px-2 py-1.5 rounded font-bold text-xs flex items-center gap-1.5 ${
                    pickerFolderFilter === 'all' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>全部素材 ({materials.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPickerFolderFilter('uncategorized')}
                  className={`w-full text-left px-2 py-1.5 rounded font-bold text-xs flex items-center gap-1.5 ${
                    pickerFolderFilter === 'uncategorized' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span>未分类素材</span>
                </button>
              </div>

              {/* Grid content of materials */}
              <div className="space-y-2 flex flex-col h-full">
                
                <div className="flex-1 overflow-y-auto pr-1">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {materials
                      .filter(m => {
                        // Type filter
                        if (pickerTargetType === 'video' && m.format !== 'mp4') return false;
                        if (pickerTargetType === 'image' && (m.format !== 'png' && m.format !== 'jpg')) return false;
                        if (pickerTargetType === 'html5' && m.format !== 'zip') return false;
                        
                        // Folder filter
                        if (pickerFolderFilter !== 'all') {
                          return m.folderId === pickerFolderFilter;
                        }
                        return true;
                      })
                      .map(m => {
                        const isSelected = selectedPickerIds.includes(m.fileName);
                        return (
                          <div 
                            key={m.id}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedPickerIds(prev => prev.filter(name => name !== m.fileName));
                              } else {
                                if (selectedPickerIds.length >= 20) {
                                  alert('同一组上限选择20个素材');
                                  return;
                                }
                                setSelectedPickerIds(prev => [...prev, m.fileName]);
                              }
                            }}
                            className={`border rounded-md overflow-hidden cursor-pointer transition-all flex flex-col hover:shadow-xs ${
                              isSelected ? 'border-blue-500 ring-2 ring-blue-100 bg-blue-50/20' : 'border-slate-200'
                            }`}
                          >
                            <div className="aspect-video w-full bg-slate-100 relative">
                              <img 
                                src={m.thumbnail} 
                                alt={m.fileName}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute right-1 bottom-1 bg-slate-900/70 text-white font-mono text-[9px] px-1 rounded">
                                {m.format.toUpperCase()}
                              </span>
                              {isSelected && (
                                <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                                  <div className="bg-blue-600 text-white rounded-full p-1 shadow-sm">
                                    <Check className="w-4 h-4" />
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="p-2 text-[10.5px]">
                              <span className="block truncate font-bold text-slate-700" title={m.fileName}>
                                {m.fileName}
                              </span>
                              <span className="block text-[9.5px] text-slate-400 font-semibold font-mono mt-0.5">
                                {m.size} • {m.uploadTime.slice(5, 16)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Counter indicator bar */}
                <div className="border-t border-slate-150 pt-2 flex items-center justify-between text-slate-400 font-bold text-[10px]">
                  <span>已勾选素材: {selectedPickerIds.length} / 20 个</span>
                  <button 
                    type="button" 
                    onClick={() => setSelectedPickerIds([])}
                    className="text-rose-500 hover:underline cursor-pointer font-bold"
                  >
                    取消全部选择
                  </button>
                </div>

              </div>

            </div>

            <div className="bg-slate-50 border-t border-slate-150 px-4 py-2.5 flex justify-end gap-2 text-xs font-sans font-bold">
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="px-4 py-1.5 border border-slate-300 text-slate-755 bg-white hover:bg-slate-50 rounded cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleApplyPickerSelection}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-2xs cursor-pointer"
              >
                应用已选素材 ({selectedPickerIds.length})
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- Internal Modal 3: Copywriting Picker (灵感文案库) --- */}
      {isCopywritingOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 animate-fade-in select-none">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-150 px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">
                AI 爆量灵感文案库 ({copywritingType === 'title' ? '标题库' : '描述库'})
              </span>
              <button 
                type="button" 
                onClick={() => setIsCopywritingOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 max-h-[360px] overflow-y-auto space-y-2 text-xs font-sans">
              <span className="text-[10px] text-slate-400 font-bold block mb-2">点击以下高曝光转化率文案，直接覆盖填入：</span>
              {(copywritingType === 'title' ? copywritingLibrary.title : copywritingLibrary.description).map((text, idx) => (
                <div
                  key={idx}
                  onClick={() => handleApplyCopywritingText(text)}
                  className="p-3 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/25 rounded-md cursor-pointer transition-colors text-slate-700 font-semibold"
                >
                  {text}
                </div>
              ))}
            </div>
            <div className="bg-slate-50 border-t border-slate-150 px-4 py-2.5 flex justify-end gap-2 text-xs font-sans font-bold">
              <button
                type="button"
                onClick={() => setIsCopywritingOpen(false)}
                className="px-4 py-1.5 border border-slate-300 text-slate-755 bg-white hover:bg-slate-50 rounded cursor-pointer"
              >
                返回
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global/Fixed Dropdown Menu for Google Tab Actions */}
      {googleTabMenuOpenId && googleTabMenuCoords && (
        <>
          <div 
            className="fixed inset-0 z-45 bg-transparent cursor-default" 
            onClick={(e) => {
              e.stopPropagation();
              setGoogleTabMenuOpenId(null);
              setGoogleTabMenuCoords(null);
            }}
          ></div>
          <div 
            className="fixed bg-white border border-slate-200 shadow-md rounded py-1 w-32 z-50 text-slate-700 text-xs font-medium animate-fade-in select-none"
            style={{
              top: `${googleTabMenuCoords.top}px`,
              left: `${googleTabMenuCoords.left}px`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                const id = googleTabMenuOpenId;
                const type = googleTabMenuType;
                if (type === 'region') {
                  handleDuplicateRegionGroup(id);
                } else if (type === 'budget') {
                  handleDuplicateBudget(id);
                } else if (type === 'creative') {
                  handleDuplicateCreativeGroup(id);
                }
                setGoogleTabMenuOpenId(null);
                setGoogleTabMenuCoords(null);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs flex items-center gap-1.5 font-semibold text-slate-700 transition-colors"
            >
              <span>复制</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const id = googleTabMenuOpenId;
                const type = googleTabMenuType;
                let targetName = '';
                if (type === 'region') {
                  targetName = googleRegionGroups.find(x => x.id === id)?.name || '';
                } else if (type === 'budget') {
                  targetName = googleBudgets.find(x => x.id === id)?.name || '';
                } else if (type === 'creative') {
                  targetName = googleCreativeGroups.find(x => x.id === id)?.name || '';
                }
                setGoogleGroupActionModal({
                  type: 'batch_duplicate',
                  groupType: type,
                  targetId: id,
                  targetName,
                  inputValue: '3'
                });
                setGoogleTabMenuOpenId(null);
                setGoogleTabMenuCoords(null);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs flex items-center gap-1.5 font-semibold text-slate-700 transition-colors"
            >
              <span>批量复制</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const id = googleTabMenuOpenId;
                const type = googleTabMenuType;
                let targetName = '';
                if (type === 'region') {
                  targetName = googleRegionGroups.find(x => x.id === id)?.name || '';
                } else if (type === 'budget') {
                  targetName = googleBudgets.find(x => x.id === id)?.name || '';
                } else if (type === 'creative') {
                  targetName = googleCreativeGroups.find(x => x.id === id)?.name || '';
                }
                setGoogleGroupActionModal({
                  type: 'rename',
                  groupType: type,
                  targetId: id,
                  targetName,
                  inputValue: targetName
                });
                setGoogleTabMenuOpenId(null);
                setGoogleTabMenuCoords(null);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs flex items-center gap-1.5 font-semibold text-slate-700 transition-colors"
            >
              <span>重命名</span>
            </button>
            <div className="border-t border-slate-100 my-1"></div>
            <button
              type="button"
              onClick={() => {
                const id = googleTabMenuOpenId;
                const type = googleTabMenuType;
                let targetName = '';
                if (type === 'region') {
                  targetName = googleRegionGroups.find(x => x.id === id)?.name || '';
                } else if (type === 'budget') {
                  targetName = googleBudgets.find(x => x.id === id)?.name || '';
                } else if (type === 'creative') {
                  targetName = googleCreativeGroups.find(x => x.id === id)?.name || '';
                }
                setGoogleGroupActionModal({
                  type: 'delete',
                  groupType: type,
                  targetId: id,
                  targetName,
                  inputValue: ''
                });
                setGoogleTabMenuOpenId(null);
                setGoogleTabMenuCoords(null);
              }}
              className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 cursor-pointer text-xs flex items-center gap-1.5 font-bold transition-colors"
            >
              <span>删除</span>
            </button>
          </div>
        </>
      )}

      {/* Unified Action Modal Dialog for Google Ads Groups */}
      {googleGroupActionModal.type && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 animate-fade-in select-none">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-sm w-full overflow-hidden">
            
            <div className="bg-slate-50 border-b border-slate-150 px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">
                {googleGroupActionModal.type === 'rename' && '重命名'}
                {googleGroupActionModal.type === 'batch_duplicate' && '批量复制'}
                {googleGroupActionModal.type === 'delete' && '确认删除'}
                {googleGroupActionModal.groupType === 'region' && '地区组'}
                {googleGroupActionModal.groupType === 'budget' && '出价和预算'}
                {googleGroupActionModal.groupType === 'creative' && '创意组'}
              </span>
              <button 
                type="button" 
                onClick={() => setGoogleGroupActionModal(prev => ({ ...prev, type: null }))}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3.5 text-xs font-sans">
              {googleGroupActionModal.type === 'rename' && (
                <div className="space-y-1">
                  <span className="block font-bold text-slate-600">新名称</span>
                  <input
                    type="text"
                    value={googleGroupActionModal.inputValue}
                    onChange={e => setGoogleGroupActionModal(prev => ({ ...prev, inputValue: e.target.value }))}
                    className="w-full bg-white border border-slate-250 rounded px-3 py-1.5 focus:outline-hidden focus:border-blue-500 font-bold text-slate-800"
                    placeholder="请输入新名称"
                    autoFocus
                  />
                </div>
              )}

              {googleGroupActionModal.type === 'batch_duplicate' && (
                <div className="space-y-1">
                  <span className="block font-bold text-slate-600">复制份数</span>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={googleGroupActionModal.inputValue}
                    onChange={e => setGoogleGroupActionModal(prev => ({ ...prev, inputValue: e.target.value }))}
                    className="w-full bg-white border border-slate-250 rounded px-3 py-1.5 focus:outline-hidden focus:border-blue-500 font-bold text-slate-800"
                    placeholder="请输入1-50之间的数字"
                    autoFocus
                  />
                </div>
              )}

              {googleGroupActionModal.type === 'delete' && (
                <div className="py-2 text-slate-600 font-semibold leading-relaxed">
                  确定要删除吗？「<span className="text-slate-900 font-extrabold">{googleGroupActionModal.targetName}</span>」将会被永久移除。
                </div>
              )}
            </div>

            <div className="bg-slate-50 border-t border-slate-150 px-4 py-2.5 flex justify-end gap-2 text-xs font-sans font-bold">
              <button
                type="button"
                onClick={() => setGoogleGroupActionModal(prev => ({ ...prev, type: null }))}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 rounded cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  const { type, groupType, targetId, inputValue } = googleGroupActionModal;
                  if (!targetId || !groupType) return;

                  if (type === 'rename') {
                    if (!inputValue.trim()) {
                      alert('名称不能为空！');
                      return;
                    }
                    if (groupType === 'region') {
                      setGoogleRegionGroups(prev => prev.map(rg => rg.id === targetId ? { ...rg, name: inputValue.trim() } : rg));
                    } else if (groupType === 'budget') {
                      setGoogleBudgets(prev => prev.map(b => b.id === targetId ? { ...b, name: inputValue.trim() } : b));
                    } else if (groupType === 'creative') {
                      setGoogleCreativeGroups(prev => prev.map(cg => cg.id === targetId ? { ...cg, name: inputValue.trim() } : cg));
                    }
                  } else if (type === 'batch_duplicate') {
                    const count = parseInt(inputValue);
                    if (isNaN(count) || count <= 0 || count > 50) {
                      alert('请输入有效的复制份数 (1-50)！');
                      return;
                    }
                    if (groupType === 'region') {
                      handleBatchDuplicateRegionGroup(targetId, count);
                    } else if (groupType === 'budget') {
                      handleBatchDuplicateBudget(targetId, count);
                    } else if (groupType === 'creative') {
                      handleBatchDuplicateCreativeGroup(targetId, count);
                    }
                  } else if (type === 'delete') {
                    if (groupType === 'region') {
                      handleDeleteRegionGroup(targetId);
                    } else if (groupType === 'budget') {
                      handleDeleteBudget(targetId);
                    } else if (groupType === 'creative') {
                      handleDeleteCreativeGroup(targetId);
                    }
                  }

                  setGoogleGroupActionModal(prev => ({ ...prev, type: null }));
                }}
                className={`px-4 py-1.5 text-white rounded shadow-2xs cursor-pointer ${
                  googleGroupActionModal.type === 'delete' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                确定
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Google 绑定规则弹窗 */}
      {isGoogleBindingRulesModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-55 p-4 font-sans select-none animate-fade-in text-slate-800">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50 rounded-t-lg">
              <span className="text-sm font-extrabold text-slate-800">绑定规则</span>
              <button 
                onClick={() => setIsGoogleBindingRulesModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 text-xs flex-1 overflow-y-auto">
              {/* Row 1: 绑定对象 */}
              <div className="flex items-center gap-6">
                <span className="font-bold text-slate-500 w-16 text-left">绑定对象</span>
                <div className="flex items-center border border-slate-200 rounded-md bg-slate-100/50 p-0.5">
                  {[
                    { id: 'account', label: '广告账户' },
                    { id: 'region', label: '地区' }
                  ].map(tab => {
                    const isActive = googleBindingRulesActiveTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setGoogleBindingRulesActiveTab(tab.id as any)}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-white text-blue-600 shadow-xs border border-blue-100' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 2: 绑定规则 */}
              <div className="flex items-center gap-6 relative">
                <span className="font-bold text-slate-500 w-16 text-left">绑定规则</span>
                <div className="relative">
                  <select
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) return;
                      if (googleCheckedRowIds.length === 0) {
                        alert('请先勾选需要批量设置的行！');
                        e.target.value = '';
                        return;
                      }
                      setTempGoogleBindings(prev => {
                        const next = { ...prev };
                        googleCheckedRowIds.forEach(id => {
                          next[id] = val;
                        });
                        return next;
                      });
                      alert(`已成功将所选的 ${googleCheckedRowIds.length} 个项目批量绑定！`);
                      e.target.value = '';
                    }}
                    className="bg-white border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:outline-hidden rounded px-3 py-1.5 text-xs font-bold text-slate-600 cursor-pointer"
                  >
                    <option value="">批量设置</option>
                    <option value="all">请选择</option>
                    {googleBindingRulesActiveTab === 'account' && (
                      <>
                        <option value="雨果-PA-01">雨果-PA-01</option>
                        <option value="雨果-GridMaster-01">雨果-GridMaster-01</option>
                        <option value="雨果-GridMaster-02">雨果-GridMaster-02</option>
                        <option value="雨果-GridMaster-03">雨果-GridMaster-03</option>
                      </>
                    )}
                    {googleBindingRulesActiveTab === 'region' && googleRegionGroups.map(rg => (
                      <option key={rg.id} value={rg.id}>{rg.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table Container */}
              <div className="border border-slate-150 rounded-lg overflow-hidden bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-150">
                      <th className="px-4 py-3 w-12">
                        <input
                          type="checkbox"
                          checked={
                            googleCheckedRowIds.length === googleCreativeGroups.length && googleCreativeGroups.length > 0
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              const ids = googleCreativeGroups.map(cg => cg.id);
                              setGoogleCheckedRowIds(ids);
                            } else {
                              setGoogleCheckedRowIds([]);
                            }
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </th>
                      <th className="px-4 py-3 font-extrabold w-1/2">创意组</th>
                      <th className="px-4 py-3 font-extrabold w-1/2">绑定对象</th>
                    </tr>
                  </thead>
                  <tbody>
                    {googleCreativeGroups.map(cg => (
                      <tr key={cg.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={googleCheckedRowIds.includes(cg.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setGoogleCheckedRowIds(prev => [...prev, cg.id]);
                              } else {
                                setGoogleCheckedRowIds(prev => prev.filter(id => id !== cg.id));
                              }
                            }}
                            className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3 font-bold">{cg.name}</td>
                        <td className="px-4 py-3">
                          <select
                            value={tempGoogleBindings[cg.id] || 'all'}
                            onChange={(e) => {
                              const val = e.target.value;
                              setTempGoogleBindings(prev => ({ ...prev, [cg.id]: val }));
                            }}
                            className="bg-white border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:outline-hidden rounded px-2.5 py-1.5 text-xs font-bold w-full max-w-xs cursor-pointer text-slate-700"
                          >
                            <option value="all">请选择</option>
                            {googleBindingRulesActiveTab === 'account' && (
                              <>
                                <option value="雨果-PA-01">雨果-PA-01</option>
                                <option value="雨果-GridMaster-01">雨果-GridMaster-01</option>
                                <option value="雨果-GridMaster-02">雨果-GridMaster-02</option>
                                <option value="雨果-GridMaster-03">雨果-GridMaster-03</option>
                              </>
                            )}
                            {googleBindingRulesActiveTab === 'region' && googleRegionGroups.map(r => (
                              <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-150 flex justify-end gap-2 bg-slate-50 rounded-b-lg text-xs font-bold">
              <button
                type="button"
                onClick={() => setIsGoogleBindingRulesModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 rounded cursor-pointer transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  setGoogleCreativeBindings(tempGoogleBindings);
                  setIsGoogleBindingRulesModalOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
