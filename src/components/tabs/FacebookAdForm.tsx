import React, { useState, useRef, useEffect } from 'react';
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
  ChevronRight,
  Info,
  Video,
  Image,
  FolderPlus
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
  customProductPageId?: string;
}

interface FbBudget {
  id: string;
  name: string;
  optGoal: 'clicks' | 'installs' | 'events' | 'value';
  valueRuleSet: string;
  attributionMethod: string;
  attribution: string;
  billingEvent: string;
  scheduleType: 'now' | 'custom';
  groupSpendingLimitMin: string;
  groupSpendingLimitMax: string;
  bidControl: string;
  minRoas: string;
  bidStrategy: string;
  eventAllocation: 'unified' | 'account';
  appEvent: string;
  conversionEvent: string;
  startDate: string;
  endDate: string;
}

interface FacebookAdFormProps {
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
  fbAdAccount: string;
  setFbAdAccount: (v: string) => void;
  fbXmpProduct: string;
  setFbXmpProduct: (v: string) => void;
  fbCampaignName: string;
  setFbCampaignName: (v: string) => void;
  fbAdGroupName: string;
  setFbAdGroupName: (v: string) => void;
  fbDailyBudget: string;
  setFbDailyBudget: (v: string) => void;
  fbCreativeGroups: CreativeGroup[];
  setFbCreativeGroups: React.Dispatch<React.SetStateAction<CreativeGroup[]>>;
  activeFbCreativeGroupId: string;
  setActiveFbCreativeGroupId: (v: string) => void;
  isFbMaterialPickerOpen: boolean;
  setIsFbMaterialPickerOpen: (v: boolean) => void;
  fbMaterialPickerType: 'video' | 'image' | 'html5';
  setFbMaterialPickerType: (v: 'video' | 'image' | 'html5') => void;
  fbActiveCreativeGroupIdForPicker: string;
  setFbActiveCreativeGroupIdForPicker: (v: string) => void;
  fbRegionGroups: any[];
  setFbRegionGroups: React.Dispatch<React.SetStateAction<any[]>>;
  activeFbRegionGroupId: string;
  setActiveFbRegionGroupId: (v: string) => void;
  fbTargetingPackages: any[];
  setFbTargetingPackages: React.Dispatch<React.SetStateAction<any[]>>;
  activeFbTargetingPackageId: string;
  setActiveFbTargetingPackageId: (v: string) => void;
  fbBudgets: FbBudget[];
  setFbBudgets: React.Dispatch<React.SetStateAction<FbBudget[]>>;
  activeFbBudgetId: string;
  setActiveFbBudgetId: (v: string) => void;
  steps: Array<{ id: number; label: string; ref: React.RefObject<HTMLDivElement | null> }>;
}

const ALL_SUB_PLACEMENTS = [
  { id: 'fb_feed', label: 'Facebook 动态', platform: 'facebook', category: 'feeds' },
  { id: 'instagram_feed', label: 'Instagram 主页动态', platform: 'instagram', category: 'feeds' },
  { id: 'fb_marketplace', label: 'Facebook Marketplace', platform: 'facebook', category: 'feeds' },
  { id: 'fb_video_feed', label: 'Facebook 视频动态', platform: 'facebook', category: 'feeds' },
  { id: 'fb_right_column', label: 'Facebook 右栏', platform: 'facebook', category: 'feeds' },
  { id: 'instagram_explore', label: 'Instagram 发现', platform: 'instagram', category: 'feeds' },
  { id: 'instagram_explore_home', label: 'Instagram 发现首页', platform: 'instagram', category: 'feeds' },
  { id: 'messenger_inbox', label: 'Messenger 收件箱', platform: 'messenger', category: 'feeds' },
  { id: 'fb_businesses', label: '发现 Facebook 商家', platform: 'facebook', category: 'feeds' },
  { id: 'instagram_profile', label: 'Instagram 个人主页动态', platform: 'instagram', category: 'feeds' },

  { id: 'instagram_stories', label: 'Instagram 快拍', platform: 'instagram', category: 'stories_reels' },
  { id: 'fb_stories', label: 'Facebook 快拍', platform: 'facebook', category: 'stories_reels' },
  { id: 'messenger_stories', label: 'Messenger 快拍', platform: 'messenger', category: 'stories_reels' },
  { id: 'instagram_reels', label: 'Instagram Reels', platform: 'instagram', category: 'stories_reels' },
  { id: 'fb_reels', label: 'Facebook Reels', platform: 'facebook', category: 'stories_reels' },

  { id: 'fb_instream_video', label: 'Facebook 插播视频广告', platform: 'facebook', category: 'instream' },
  { id: 'fb_reels_overlay', label: 'Facebook Reels 叠加广告', platform: 'facebook', category: 'instream' },
  { id: 'instagram_reels_overlay', label: 'Instagram Reels 叠加广告', platform: 'instagram', category: 'instream' },

  { id: 'fb_search', label: 'Facebook 搜索结果', platform: 'facebook', category: 'search' },
  { id: 'instagram_search', label: 'Instagram 搜索结果', platform: 'instagram', category: 'search' },

  { id: 'an_native', label: 'Audience Network 原生、横幅和插屏广告', platform: 'audience_network', category: 'apps_sites' },
  { id: 'an_rewarded', label: 'Audience Network 激励视频广告', platform: 'audience_network', category: 'apps_sites' },
  { id: 'threads_feed', label: 'Threads 动态', platform: 'threads', category: 'feeds' }
];

const PLACEMENT_CATEGORIES = [
  { id: 'feeds', label: '动态' },
  { id: 'stories_reels', label: '快拍和 Reels' },
  { id: 'instream', label: '视频和 Reels 插播广告' },
  { id: 'search', label: '搜索结果' },
  { id: 'apps_sites', label: '应用和网站' }
];

const MOCK_CUSTOM_AUDIENCES = [
  { id: 'ca1', name: '购买用户_LAL_1%', type: 'lookalike' },
  { id: 'ca2', name: '活跃用户_180天', type: 'custom_aud' },
  { id: 'ca3', name: '浏览商品_30天', type: 'custom_aud' },
  { id: 'ca4', name: '应用启动用户_14天', type: 'custom_aud' },
  { id: 'ca5', name: '高价值充值用户_LAL_2%', type: 'lookalike' },
  { id: 'ca6', name: '已流失用户_召回', type: 'custom_aud' }
];

export const FacebookAdForm: React.FC<FacebookAdFormProps> = ({
  materials,
  setMaterials,
  fbAdAccount,
  setFbAdAccount,
  fbXmpProduct,
  setFbXmpProduct,
  fbCampaignName,
  setFbCampaignName,
  fbAdGroupName,
  setFbAdGroupName,
  fbDailyBudget,
  setFbDailyBudget,
  fbCreativeGroups,
  setFbCreativeGroups,
  activeFbCreativeGroupId,
  setActiveFbCreativeGroupId,
  isFbMaterialPickerOpen,
  setIsFbMaterialPickerOpen,
  fbMaterialPickerType,
  setFbMaterialPickerType,
  fbActiveCreativeGroupIdForPicker,
  setFbActiveCreativeGroupIdForPicker,
  fbRegionGroups,
  setFbRegionGroups,
  activeFbRegionGroupId,
  setActiveFbRegionGroupId,
  fbTargetingPackages,
  setFbTargetingPackages,
  activeFbTargetingPackageId,
  setActiveFbTargetingPackageId,
  fbBudgets,
  setFbBudgets,
  activeFbBudgetId,
  setActiveFbBudgetId,
  steps
}) => {
  // 1. 基础设置
  const [fbCampaignType, setFbCampaignType] = useState<'app' | 'web'>('app');
  const [fbCampaignSubtype, setFbCampaignSubtype] = useState<'app_install' | 'app_event' | 'pre_register'>('app_install');
  const [fbPlatform, setFbPlatform] = useState<'android' | 'ios'>('android');
  
  // Accounts (Single-select list to match Image 1)
  const [fbAdAccountsDropdownOpen, setFbAdAccountsDropdownOpen] = useState(false);
  const fbAdAccountsList = [
    'HoleDrop-雨果-01',
    '丽莲-Pixel (984179864117084)',
    '账户 A - 001 (984179864117001)',
    '账户 B - 002 (984179864117002)'
  ];

  // FB Personal Accounts
  const [fbPersonalAccount, setFbPersonalAccount] = useState({ name: 'Bob Ze', id: '984179884117084' });
  const [fbPersonalAccountDropdownOpen, setFbPersonalAccountDropdownOpen] = useState(false);
  const personalAccountsList = [
    { name: 'Bob Ze', id: '984179884117084' },
    { name: 'Alice Smith', id: '984179884117085' },
    { name: 'John Doe', id: '984179884117086' }
  ];

  // XMP Products (removed from Basic, but kept in code for compatibility/internal variables)
  const [fbProductSearchQuery, setFbProductSearchQuery] = useState('');
  const [fbProductDropdownOpen, setFbProductDropdownOpen] = useState(false);
  const productsList = [
    '三消游戏 - Candy Crush Clone',
    'SLG - 王国纪元',
    '卡牌 - 炉石传说'
  ];

  // 2. 广告系列
  const [fbCampaignStatus, setFbCampaignStatus] = useState(true);
  const [fbCampaignExtraHintsOpen, setFbCampaignExtraHintsOpen] = useState(false);
  const [fbSpecialCatDropdownOpen, setFbSpecialCatDropdownOpen] = useState(false);
  const [fbSpecialCatSelected, setFbSpecialCatSelected] = useState<string[]>([]);
  const specialCategories = [
    '金融产品和服务（旧称"信贷"）',
    '就业',
    '住房',
    '社会议题、选举或政治'
  ];

  // 特殊广告地区 (Dual Panel)
  const [fbSpecialRegions, setFbSpecialRegions] = useState<string[]>([]);
  const [fbSpecialRegionsExclude, setFbSpecialRegionsExclude] = useState<string[]>([]);
  const [fbSpecialRegionTab, setFbSpecialRegionTab] = useState<'include' | 'exclude'>('include');
  const [fbSpecialRegionSearch, setFbSpecialRegionSearch] = useState('');
  const availableSpecialRegions = ['美国', '加拿大', '英国', '澳大利亚'];

  const [fbIos14Campaign, setFbIos14Campaign] = useState(false);
  const [fbCboEnabled, setFbCboEnabled] = useState(false);
  const [fbCampaignBudgetType, setFbCampaignBudgetType] = useState<'daily' | 'lifetime'>('daily');
  const [fbCampaignBidStrategy, setFbCampaignBidStrategy] = useState('highest_volume');
  const [fbCampaignPacing, setFbCampaignPacing] = useState('standard');
  const [fbCampaignSchedule, setFbCampaignSchedule] = useState('all_time');
  const [fbCampaignSpendingLimitType, setFbCampaignSpendingLimitType] = useState<'none' | 'custom'>('none');
  const [fbCampaignSpendingLimit, setFbCampaignSpendingLimit] = useState('1000');

  // 3. 广告组
  const [fbAdGroupStatus, setFbAdGroupStatus] = useState(true);
  const [fbAdGroupExtraHintsOpen, setFbAdGroupExtraHintsOpen] = useState(false);

  // 3.5 渠道号配置 State Variables
  const [fbChannelGenMode, setFbChannelGenMode] = useState<'auto' | 'manual'>('auto');
  const [fbChannelSharingMode, setFbChannelSharingMode] = useState<'shared' | 'independent'>('shared');
  const [fbChannelGame, setFbChannelGame] = useState<string>('0');
  const [fbChannelPlatform, setFbChannelPlatform] = useState<string>('0');
  const [fbChannelSource, setFbChannelSource] = useState<string>('');
  const [fbChannelRegion, setFbChannelRegion] = useState<string>('');
  const [fbChannelRegionTouched, setFbChannelRegionTouched] = useState(false);
  const [fbChannelPitcher, setFbChannelPitcher] = useState<string>('');
  const [fbChannelLabel, setFbChannelLabel] = useState<string>('');
  const [fbChannelRemark, setFbChannelRemark] = useState<string>('');
  const [fbChannelManualCode, setFbChannelManualCode] = useState<string>('');
  const [fbChannelConfigured, setFbChannelConfigured] = useState(false);
  const [fbStore, setFbStore] = useState('google_play');
  const [fbAppPackage, setFbAppPackage] = useState('com.example.app1');
  const [fbApp, setFbApp] = useState({
    name: 'Spiritland: Catch & Battle',
    id: '4570438213179764',
    platform: 'android'
  });
  const [fbAppDropdownOpen, setFbAppDropdownOpen] = useState(false);
  const fbAppsList = [
    { name: 'Spiritland: Catch & Battle', id: '4570438213179764', platform: 'android' },
    { name: 'Perfect Avenger: Idle games', id: '3489128391238912', platform: 'android' },
    { name: 'Candy Crush Clone: Saga', id: '1290381023812903', platform: 'ios' }
  ];
  const [fbPlacementSetting, setFbPlacementSetting] = useState<'adv_plus' | 'manual'>('adv_plus');
  const [fbPlatformsSelected, setFbPlatformsSelected] = useState<string[]>(['facebook', 'messenger', 'instagram', 'audience_network']);
  const [fbPlacementsChecked, setFbPlacementsChecked] = useState<string[]>([
    'fb_feed', 'instagram_feed', 'fb_marketplace', 'fb_video_feed', 'fb_right_column',
    'instagram_explore', 'instagram_explore_home', 'messenger_inbox', 'fb_businesses',
    'instagram_profile', 'instagram_stories', 'fb_stories', 'messenger_stories',
    'instagram_reels', 'fb_reels', 'fb_instream_video', 'fb_reels_overlay',
    'instagram_reels_overlay', 'fb_search', 'instagram_search', 'an_native', 'an_rewarded',
    'threads_feed'
  ]);
  const [fbActivePlacementCategory, setFbActivePlacementCategory] = useState<string>('feeds');

  // Custom Audience helper states
  const [customAudienceLeftTab, setCustomAudienceLeftTab] = useState<'all' | 'lookalike' | 'custom_aud'>('all');
  const [customAudienceLeftSearch, setCustomAudienceLeftSearch] = useState('');
  const [customAudienceRightTab, setCustomAudienceRightTab] = useState<'target' | 'exclude'>('target');

  // 4. 地区组 (Lifted to AdCreatorFullScreen)
  const [fbTabMenuOpenId, setFbTabMenuOpenId] = useState<string | null>(null);
  const [fbTabMenuCoords, setFbTabMenuCoords] = useState<{ top: number; left: number } | null>(null);
  const [isFbExistingRegionChecked, setIsFbExistingRegionChecked] = useState(false);
  const [fbRegionDualTab, setFbRegionDualTab] = useState<'include' | 'exclude'>('include');
  const [fbRegionSearch, setFbRegionSearch] = useState('');
  const availableRegions = ['美国', '加拿大', '英国', '澳大利亚', '新加坡', '泰国', '巴西', '台湾地区', '德国', '法国', '欧盟地区'];

  // 选择已有地区组弹窗 & 批量操作状态
  const [isFbExistingRegionModalOpen, setIsFbExistingRegionModalOpen] = useState(false);
  const [fbTemplateSearch, setFbTemplateSearch] = useState('');
  const [fbTemplateTag, setFbTemplateTag] = useState('');
  const [fbSelectedTemplateId, setFbSelectedTemplateId] = useState<string | null>(null);
  
  const [isFbBatchOpsDropdownOpen, setIsFbBatchOpsDropdownOpen] = useState(false);
  const [isFbBatchImportModalOpen, setIsFbBatchImportModalOpen] = useState(false);
  const [fbBatchImportText, setFbBatchImportText] = useState('');
  const [fbBatchImportTargetType, setFbBatchImportTargetType] = useState<'selectedRegions' | 'excludedRegions'>('selectedRegions');
  
  const [isFbBatchSettingsModalOpen, setIsFbBatchSettingsModalOpen] = useState(false);
  const [fbBatchSettingsTargetOption, setFbBatchSettingsTargetOption] = useState('此位置或对其感兴趣的用户(推荐)');
  const [fbBatchSettingsLanguageOption, setFbBatchSettingsLanguageOption] = useState<'all' | 'specified'>('all');
  const [fbBatchSettingsTag, setFbBatchSettingsTag] = useState('');

  // Custom modal for Region Group actions (Rename, Batch copy, Delete confirm)
  const [fbRegionGroupActionModal, setFbRegionGroupActionModal] = useState<{
    type: 'rename' | 'batch_duplicate' | 'delete' | null;
    targetId: string | null;
    targetName: string;
    inputValue: string;
  }>({
    type: null,
    targetId: null,
    targetName: '',
    inputValue: ''
  });

  // 绑定规则相关状态
  const [isFbBindingRulesModalOpen, setIsFbBindingRulesModalOpen] = useState(false);
  const [fbBindingRulesModule, setFbBindingRulesModule] = useState<'region' | 'targeting' | 'budget' | 'creative'>('budget');
  const [fbBindingRulesActiveTab, setFbBindingRulesActiveTab] = useState<'account' | 'region' | 'targeting'>('region');
  const [fbBudgetBindings, setFbBudgetBindings] = useState<Record<string, string>>({
    'b1': 'all'
  });
  const [fbTargetingBindings, setFbTargetingBindings] = useState<Record<string, string>>({
    'tp1': 'all'
  });
  const [fbRegionBindings, setFbRegionBindings] = useState<Record<string, string>>({
    'rg1': 'all'
  });
  const [fbCreativeBindings, setFbCreativeBindings] = useState<Record<string, string>>({
    'cg1': 'all'
  });
  const [tempBindings, setTempBindings] = useState<Record<string, string>>({});
  const [checkedRowIds, setCheckedRowIds] = useState<string[]>([]);

  useEffect(() => {
    if (isFbBindingRulesModalOpen) {
      const source = fbBindingRulesModule === 'budget' 
        ? fbBudgetBindings 
        : (fbBindingRulesModule === 'targeting' 
            ? fbTargetingBindings 
            : (fbBindingRulesModule === 'creative' ? fbCreativeBindings : fbRegionBindings));
      setTempBindings(source);
      setCheckedRowIds([]);
    }
  }, [isFbBindingRulesModalOpen, fbBindingRulesModule]);

  const getBoundLabel = (id: string, module: 'budget' | 'targeting' | 'region' | 'creative') => {
    const bindings = module === 'budget' 
      ? fbBudgetBindings 
      : (module === 'targeting' 
          ? fbTargetingBindings 
          : (module === 'creative' ? fbCreativeBindings : fbRegionBindings));
    const val = bindings[id] || 'all';
    if (val === 'all') {
      if (module === 'region') return '广告账户 (全部)';
      return '地区 (全部)';
    }
    if (module === 'region') {
      if (val === 'account_1') return '广告账户1';
      if (val === 'account_2') return '广告账户2';
      return `广告账户 (特定)`;
    }
    const rg = fbRegionGroups.find((r: any) => r.id === val);
    return rg ? `地区 (${rg.name})` : '地区 (全部)';
  };

  // Built-in region group templates for selection
  const fbRegionGroupTemplates = [
    {
      id: 'tmpl_1',
      name: '亚太高转化地区组 (SG, TH, TW, AU)',
      regions: ['新加坡', '泰国', '台湾地区', '澳大利亚'],
      tag: '亚太',
      createdAt: '2026-06-22 14:15:30'
    },
    {
      id: 'tmpl_2',
      name: '欧美主要国家组 (US, CA, UK, DE, FR)',
      regions: ['美国', '加拿大', '英国', '德国', '法国'],
      tag: '欧美',
      createdAt: '2026-06-20 10:30:12'
    },
    {
      id: 'tmpl_3',
      name: '拉美成长市场组 (BR, MX)',
      regions: ['巴西', '泰国'],
      tag: '拉美',
      createdAt: '2026-06-19 09:12:00'
    },
    {
      id: 'tmpl_4',
      name: '全球开放测试地区组',
      regions: ['iTunes App Store 开放国家/地区 地区'],
      tag: '全球',
      createdAt: '2026-06-23 18:00:00'
    }
  ];

  // Special Region Beneficiary and Sponsors (Taiwan, Australia, Singapore, Thailand/Brazil, EU)
  const [fbSpecifiedRegionFinance, setFbSpecifiedRegionFinance] = useState('');
  const [fbBeneficiaryTaiwan, setFbBeneficiaryTaiwan] = useState('');
  const [fbSponsorTaiwan, setFbSponsorTaiwan] = useState('');
  const [fbBeneficiaryAustralia, setFbBeneficiaryAustralia] = useState('');
  const [fbSponsorAustralia, setFbSponsorAustralia] = useState('');
  const [fbBeneficiarySingapore, setFbBeneficiarySingapore] = useState('');
  const [fbSponsorSingapore, setFbSponsorSingapore] = useState('');
  const [fbBeneficiaryThailand, setFbBeneficiaryThailand] = useState('');
  const [fbSponsorThailand, setFbSponsorThailand] = useState('');
  const [fbBeneficiaryEU, setFbBeneficiaryEU] = useState('');
  const [fbSponsorEU, setFbSponsorEU] = useState('');
  const [fbRegionTag, setFbRegionTag] = useState('');

  // 5. 定向包 (Lifted to AdCreatorFullScreen)
  const [isFbExistingTargetingChecked, setIsFbExistingTargetingChecked] = useState(false);
  const [fbAdvantageAudienceEnabled, setFbAdvantageAudienceEnabled] = useState(true);

  // 6. 出价和预算 (Lifted to AdCreatorFullScreen)

  const currentFbBudget = fbBudgets.find(b => b.id === activeFbBudgetId) || fbBudgets[0];

  const fbOptGoal = currentFbBudget.optGoal;
  const setFbOptGoal = (v: 'clicks' | 'installs' | 'events' | 'value') => {
    setFbBudgets(prev => prev.map(b => b.id === activeFbBudgetId ? { ...b, optGoal: v } : b));
  };

  const fbValueRuleSet = currentFbBudget.valueRuleSet;
  const setFbValueRuleSet = (v: string) => {
    setFbBudgets(prev => prev.map(b => b.id === activeFbBudgetId ? { ...b, valueRuleSet: v } : b));
  };

  const fbAttributionMethod = currentFbBudget.attributionMethod;
  const setFbAttributionMethod = (v: string) => {
    setFbBudgets(prev => prev.map(b => b.id === activeFbBudgetId ? { ...b, attributionMethod: v } : b));
  };

  const fbAttribution = currentFbBudget.attribution;
  const setFbAttribution = (v: string) => {
    setFbBudgets(prev => prev.map(b => b.id === activeFbBudgetId ? { ...b, attribution: v } : b));
  };

  const fbBillingEvent = currentFbBudget.billingEvent;
  const setFbBillingEvent = (v: string) => {
    setFbBudgets(prev => prev.map(b => b.id === activeFbBudgetId ? { ...b, billingEvent: v } : b));
  };

  const fbScheduleType = currentFbBudget.scheduleType;
  const setFbScheduleType = (v: 'now' | 'custom') => {
    setFbBudgets(prev => prev.map(b => b.id === activeFbBudgetId ? { ...b, scheduleType: v } : b));
  };

  const fbGroupSpendingLimitMin = currentFbBudget.groupSpendingLimitMin;
  const setFbGroupSpendingLimitMin = (v: string) => {
    setFbBudgets(prev => prev.map(b => b.id === activeFbBudgetId ? { ...b, groupSpendingLimitMin: v } : b));
  };

  const fbGroupSpendingLimitMax = currentFbBudget.groupSpendingLimitMax;
  const setFbGroupSpendingLimitMax = (v: string) => {
    setFbBudgets(prev => prev.map(b => b.id === activeFbBudgetId ? { ...b, groupSpendingLimitMax: v } : b));
  };

  const fbBidControl = currentFbBudget.bidControl;
  const setFbBidControl = (v: string) => {
    setFbBudgets(prev => prev.map(b => b.id === activeFbBudgetId ? { ...b, bidControl: v } : b));
  };

  const fbMinRoas = currentFbBudget.minRoas;
  const setFbMinRoas = (v: string) => {
    setFbBudgets(prev => prev.map(b => b.id === activeFbBudgetId ? { ...b, minRoas: v } : b));
  };

  const fbBidStrategy = currentFbBudget.bidStrategy;
  const setFbBidStrategy = (v: string) => {
    setFbBudgets(prev => prev.map(b => b.id === activeFbBudgetId ? { ...b, bidStrategy: v } : b));
  };

  const fbEventAllocation = currentFbBudget.eventAllocation;
  const setFbEventAllocation = (v: 'unified' | 'account') => {
    setFbBudgets(prev => prev.map(b => b.id === activeFbBudgetId ? { ...b, eventAllocation: v } : b));
  };

  const fbAppEvent = currentFbBudget.appEvent;
  const setFbAppEvent = (v: string) => {
    setFbBudgets(prev => prev.map(b => b.id === activeFbBudgetId ? { ...b, appEvent: v } : b));
  };

  const fbConversionEvent = currentFbBudget.conversionEvent;
  const setFbConversionEvent = (v: string) => {
    setFbBudgets(prev => prev.map(b => b.id === activeFbBudgetId ? { ...b, conversionEvent: v } : b));
  };

  const fbStartDate = currentFbBudget.startDate;
  const setFbStartDate = (v: string) => {
    setFbBudgets(prev => prev.map(b => b.id === activeFbBudgetId ? { ...b, startDate: v } : b));
  };

  const fbEndDate = currentFbBudget.endDate;
  const setFbEndDate = (v: string) => {
    setFbBudgets(prev => prev.map(b => b.id === activeFbBudgetId ? { ...b, endDate: v } : b));
  };

  // Custom states for menus/actions across multiple modules
  const [fbTargetingPackageMenuOpenId, setFbTargetingPackageMenuOpenId] = useState<string | null>(null);
  const [fbTargetingPackageMenuCoords, setFbTargetingPackageMenuCoords] = useState<{ top: number; left: number } | null>(null);

  const [fbBudgetMenuOpenId, setFbBudgetMenuOpenId] = useState<string | null>(null);
  const [fbBudgetMenuCoords, setFbBudgetMenuCoords] = useState<{ top: number; left: number } | null>(null);

  const [fbCreativeGroupMenuOpenId, setFbCreativeGroupMenuOpenId] = useState<string | null>(null);
  const [fbCreativeGroupMenuCoords, setFbCreativeGroupMenuCoords] = useState<{ top: number; left: number } | null>(null);

  const [fbGenericActionModal, setFbGenericActionModal] = useState<{
    module: 'targeting_package' | 'budget' | 'creative_group' | null;
    type: 'rename' | 'batch_duplicate' | 'delete' | null;
    targetId: string | null;
    targetName: string;
    inputValue: string;
  }>({
    module: null,
    type: null,
    targetId: null,
    targetName: '',
    inputValue: ''
  });

  // 7. 广告设置
  const [fbAdName, setFbAdName] = useState('Ad-Perfect Avenger-Idle games');
  const [fbAdStatus, setFbAdStatus] = useState(true);
  const [fbPageType, setFbPageType] = useState('all_pages');
  const [fbPageSelected, setFbPageSelected] = useState('');
  const [fbUsePageAsAdIdentity, setFbUsePageAsAdIdentity] = useState(true);
  const [fbMultiAdvertiserAds, setFbMultiAdvertiserAds] = useState(false);
  const [fbWebsiteEventTracking, setFbWebsiteEventTracking] = useState('');

  // 8. 创意组 (Tabs synced with prop)
  const [isFbExistingCreativeChecked, setIsFbExistingCreativeChecked] = useState(false);
  const [fbDynamicCreative, setFbDynamicCreative] = useState(false);
  const [fbCreativeTypes, setFbCreativeTypes] = useState<('create' | 'existing')[]>(['create']);
  const [fbFormatsSelected, setFbFormatsSelected] = useState<('flexible' | 'single' | 'carousel')[]>(['flexible']);
  const [fbCreativeDestination, setFbCreativeDestination] = useState<'app' | 'playable'>('app');
  const [fbCreativeSettingMethod, setFbCreativeSettingMethod] = useState<'group' | 'material'>('group');
  const [fbCollaborativeAds, setFbCollaborativeAds] = useState(false);
  const [fbExistingPostId, setFbExistingPostId] = useState('');
  const [fbMultiLanguageEnabled, setFbMultiLanguageEnabled] = useState(false);
  const [fbOptimizeCreativePerUser, setFbOptimizeCreativePerUser] = useState(true);
  const [fbCreativeTagSelected, setFbCreativeTagSelected] = useState('');

  // Helper inserts
  const insertVarCampaign = (variable: string) => {
    setFbCampaignName(prev => prev + variable);
  };
  const insertVarAdGroup = (variable: string) => {
    setFbAdGroupName(prev => prev + variable);
  };

  const handleAddRegionGroup = () => {
    const nextId = `rg_${Date.now()}`;
    const nextNum = fbRegionGroups.length + 1;
    setFbRegionGroups(prev => [
      ...prev,
      {
        id: nextId,
        name: `地区组${nextNum}`,
        selectedRegions: [],
        excludedRegions: [],
        isSpecifiedRegion: false,
        languageOption: 'all',
        selectedLanguages: [],
        targetOption: '此位置或对其感兴趣的用户(推荐)',
        excludeOption: '此位置或对其感兴趣的用户(推荐)',
        selectedTag: ''
      }
    ]);
    setActiveFbRegionGroupId(nextId);
  };

  const handleDuplicateRegionGroup = (id: string) => {
    const source = fbRegionGroups.find(rg => rg.id === id);
    if (!source) return;
    const nextId = `rg_${Date.now()}_copy`;
    setFbRegionGroups(prev => {
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
    setActiveFbRegionGroupId(nextId);
  };

  const handleBatchDuplicateRegionGroup = (id: string, count: number) => {
    if (isNaN(count) || count <= 0) return;
    const source = fbRegionGroups.find(rg => rg.id === id);
    if (!source) return;
    
    const now = Date.now();
    setFbRegionGroups(prev => {
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
    if (fbRegionGroups.length <= 1) {
      alert('必须保留至少一个地区组！');
      return;
    }
    const filtered = fbRegionGroups.filter(rg => rg.id !== id);
    setFbRegionGroups(filtered);
    if (activeFbRegionGroupId === id) {
      setActiveFbRegionGroupId(filtered[0].id);
    }
  };

  const handleAddTargetingPackage = () => {
    const nextId = `tp_${Date.now()}`;
    const nextNum = fbTargetingPackages.length + 1;
    setFbTargetingPackages(prev => [
      ...prev,
      {
        id: nextId,
        name: `定向包${nextNum}`,
        customAudienceType: 'all',
        customAudiences: [],
        customAudiencesTarget: [],
        customAudiencesExclude: [],
        minAge: '18',
        suggestedAge: '24',
        ageMinVal: '18',
        ageMaxVal: '65',
        gender: 'all',
        detailedTargeting: 'all',
        languages: [],
        includedDevices: [],
        excludedDevices: [],
        osVersion: 'all',
        wifiOnly: false,
        tag: ''
      }
    ]);
    setActiveFbTargetingPackageId(nextId);
  };

  const handleAddCreativeGroup = () => {
    const nextId = `cg_${Date.now()}`;
    const nextNum = fbCreativeGroups.length + 1;
    setFbCreativeGroups(prev => [
      ...prev,
      {
        id: nextId,
        name: `创意组${nextNum}`,
        videos: [],
        images: [],
        html5s: [],
        titles: ['', ''],
        descriptions: [''],
        deepLink: '',
        tag: '',
        customProductPageId: ''
      }
    ]);
    setActiveFbCreativeGroupId(nextId);
  };

  const handleDuplicateTargetingPackage = (id: string) => {
    const source = fbTargetingPackages.find(tp => tp.id === id);
    if (!source) return;
    const nextId = `tp_${Date.now()}_copy`;
    setFbTargetingPackages(prev => {
      const index = prev.findIndex(tp => tp.id === id);
      const copy = {
        ...source,
        id: nextId,
        name: `${source.name} - 副本`,
        customAudiences: [...(source.customAudiences || [])],
        customAudiencesTarget: [...(source.customAudiencesTarget || [])],
        customAudiencesExclude: [...(source.customAudiencesExclude || [])],
        languages: [...(source.languages || [])],
        includedDevices: [...(source.includedDevices || [])],
        excludedDevices: [...(source.excludedDevices || [])]
      };
      const result = [...prev];
      result.splice(index + 1, 0, copy);
      return result;
    });
    setActiveFbTargetingPackageId(nextId);
  };

  const handleBatchDuplicateTargetingPackage = (id: string, count: number) => {
    if (isNaN(count) || count <= 0) return;
    const source = fbTargetingPackages.find(tp => tp.id === id);
    if (!source) return;
    
    const now = Date.now();
    setFbTargetingPackages(prev => {
      const index = prev.findIndex(tp => tp.id === id);
      const copies = [];
      for (let i = 1; i <= count; i++) {
        copies.push({
          ...source,
          id: `tp_${now}_copy_${i}`,
          name: `${source.name} - 副本${i}`,
          customAudiences: [...(source.customAudiences || [])],
          customAudiencesTarget: [...(source.customAudiencesTarget || [])],
          customAudiencesExclude: [...(source.customAudiencesExclude || [])],
          languages: [...(source.languages || [])],
          includedDevices: [...(source.includedDevices || [])],
          excludedDevices: [...(source.excludedDevices || [])]
        });
      }
      const result = [...prev];
      result.splice(index + 1, 0, ...copies);
      return result;
    });
  };

  const handleDeleteTargetingPackage = (id: string) => {
    if (fbTargetingPackages.length <= 1) {
      alert('必须保留至少一个定向包！');
      return;
    }
    const filtered = fbTargetingPackages.filter(tp => tp.id !== id);
    setFbTargetingPackages(filtered);
    if (activeFbTargetingPackageId === id) {
      setActiveFbTargetingPackageId(filtered[0].id);
    }
  };

  const handleAddBudget = () => {
    const nextId = `b_${Date.now()}`;
    const nextNum = fbBudgets.length + 1;
    setFbBudgets(prev => [
      ...prev,
      {
        id: nextId,
        name: `出价和预算${nextNum}`,
        optGoal: 'installs',
        valueRuleSet: '',
        attributionMethod: 'all_events',
        attribution: '1d_click',
        billingEvent: 'impressions',
        scheduleType: 'now',
        groupSpendingLimitMin: '',
        groupSpendingLimitMax: '',
        bidControl: '',
        minRoas: '1.50',
        bidStrategy: 'highest_volume',
        eventAllocation: 'unified',
        appEvent: '',
        conversionEvent: 'purchase',
        startDate: '2026-06-24T00:00',
        endDate: '2026-12-31T23:59'
      }
    ]);
    setActiveFbBudgetId(nextId);
  };

  const handleDuplicateBudget = (id: string) => {
    const source = fbBudgets.find(b => b.id === id);
    if (!source) return;
    const nextId = `b_${Date.now()}_copy`;
    setFbBudgets(prev => {
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
    setActiveFbBudgetId(nextId);
  };

  const handleBatchDuplicateBudget = (id: string, count: number) => {
    if (isNaN(count) || count <= 0) return;
    const source = fbBudgets.find(b => b.id === id);
    if (!source) return;
    
    const now = Date.now();
    setFbBudgets(prev => {
      const index = prev.findIndex(b => b.id === id);
      const copies = [];
      for (let i = 1; i <= count; i++) {
        copies.push({
          ...source,
          id: `b_${now}_copy_${i}`,
          name: `${source.name} - 副本${i}`
        });
      }
      const result = [...prev];
      result.splice(index + 1, 0, ...copies);
      return result;
    });
  };

  const handleDeleteBudget = (id: string) => {
    if (fbBudgets.length <= 1) {
      alert('必须保留至少一个出价和预算配置！');
      return;
    }
    const filtered = fbBudgets.filter(b => b.id !== id);
    setFbBudgets(filtered);
    if (activeFbBudgetId === id) {
      setActiveFbBudgetId(filtered[0].id);
    }
  };

  const handleDuplicateCreativeGroup = (id: string) => {
    const source = fbCreativeGroups.find(cg => cg.id === id);
    if (!source) return;
    const nextId = `cg_${Date.now()}_copy`;
    setFbCreativeGroups(prev => {
      const index = prev.findIndex(cg => cg.id === id);
      const copy = {
        ...source,
        id: nextId,
        name: `${source.name} - 副本`,
        videos: [...(source.videos || [])],
        images: [...(source.images || [])],
        html5s: [...(source.html5s || [])],
        titles: [...(source.titles || [])],
        descriptions: [...(source.descriptions || [])]
      };
      const result = [...prev];
      result.splice(index + 1, 0, copy);
      return result;
    });
    setActiveFbCreativeGroupId(nextId);
  };

  const handleBatchDuplicateCreativeGroup = (id: string, count: number) => {
    if (isNaN(count) || count <= 0) return;
    const source = fbCreativeGroups.find(cg => cg.id === id);
    if (!source) return;
    
    const now = Date.now();
    setFbCreativeGroups(prev => {
      const index = prev.findIndex(cg => cg.id === id);
      const copies = [];
      for (let i = 1; i <= count; i++) {
        copies.push({
          ...source,
          id: `cg_${now}_copy_${i}`,
          name: `${source.name} - 副本${i}`,
          videos: [...(source.videos || [])],
          images: [...(source.images || [])],
          html5s: [...(source.html5s || [])],
          titles: [...(source.titles || [])],
          descriptions: [...(source.descriptions || [])]
        });
      }
      const result = [...prev];
      result.splice(index + 1, 0, ...copies);
      return result;
    });
  };

  const handleDeleteCreativeGroup = (id: string) => {
    if (fbCreativeGroups.length <= 1) {
      alert('必须保留至少一个创意组！');
      return;
    }
    const filtered = fbCreativeGroups.filter(cg => cg.id !== id);
    setFbCreativeGroups(filtered);
    if (activeFbCreativeGroupId === id) {
      setActiveFbCreativeGroupId(filtered[0].id);
    }
  };

  const currentRegionGroup = fbRegionGroups.find(rg => rg.id === activeFbRegionGroupId) || fbRegionGroups[0];
  const currentTargetingPackage = fbTargetingPackages.find(tp => tp.id === activeFbTargetingPackageId) || fbTargetingPackages[0];
  const currentCreativeGroup = fbCreativeGroups.find(cg => cg.id === activeFbCreativeGroupId) || fbCreativeGroups[0];

  return (
    <div className="space-y-6 font-sans text-slate-800 text-xs select-none">
      
      {/* 1. 基础设置 */}
      <div ref={steps[0].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-300 transition-all">
        <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-4 flex items-center justify-between font-sans">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-blue-600 rounded-2xs inline-block"></span>
            <span className="text-sm font-bold text-slate-800">基础设置</span>
          </div>
          <button 
            type="button" 
            onClick={() => alert('Facebook 接口元数据同步成功！')}
            className="text-blue-600 font-bold hover:underline font-sans text-xs"
          >
            同步元数据
          </button>
        </h3>

        <div className="space-y-4">
          {/* Ad Goal (广告目标) */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">广告目标</span>
            <div>
              <span className="px-3 py-1 bg-blue-50 border border-blue-500 rounded-full font-bold text-blue-600 text-xs inline-block">
                应用推广
              </span>
            </div>
          </div>

          {/* Ad Account (广告账户) */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">广告账户 <span className="text-rose-500 font-bold">*</span></span>
            <div className="relative max-w-sm w-full">
              <div 
                onClick={() => setFbAdAccountsDropdownOpen(!fbAdAccountsDropdownOpen)}
                className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 text-xs font-bold text-slate-800 cursor-pointer flex justify-between items-center"
              >
                <span className="truncate">{fbAdAccount || '请选择广告账户'}</span>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

              {fbAdAccountsDropdownOpen && (
                <div className="absolute left-0 right-0 top-10 bg-white border border-slate-200 shadow-lg rounded z-40 p-2 max-h-56 overflow-y-auto">
                  <div className="space-y-1">
                    {fbAdAccountsList.map(acc => (
                      <div 
                        key={acc}
                        onClick={() => {
                          setFbAdAccount(acc);
                          setFbAdAccountsDropdownOpen(false);
                        }}
                        className={`px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer font-bold text-xs ${fbAdAccount === acc ? 'bg-blue-50/50 text-blue-600' : 'text-slate-700'}`}
                      >
                        {acc}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FB Personal Account (FB个人号) */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">FB 个人号 <span className="text-rose-500 font-bold">*</span></span>
            <div className="relative max-w-sm w-full">
              <div 
                onClick={() => setFbPersonalAccountDropdownOpen(!fbPersonalAccountDropdownOpen)}
                className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-1.5 text-xs font-bold text-slate-800 cursor-pointer flex justify-between items-center"
              >
                <div className="flex flex-col text-left">
                  <span className="font-bold text-slate-800">{fbPersonalAccount.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {fbPersonalAccount.id}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

              {fbPersonalAccountDropdownOpen && (
                <div className="absolute left-0 right-0 top-12 bg-white border border-slate-200 shadow-lg rounded z-40 p-2 max-h-56 overflow-y-auto">
                  <div className="space-y-1">
                    {personalAccountsList.map(pa => (
                      <div 
                        key={pa.id}
                        onClick={() => {
                          setFbPersonalAccount(pa);
                          setFbPersonalAccountDropdownOpen(false);
                        }}
                        className={`px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer flex flex-col text-left ${fbPersonalAccount.id === pa.id ? 'bg-blue-50/50 text-blue-600' : ''}`}
                      >
                        <span className="font-bold text-xs text-slate-800">{pa.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {pa.id}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. 广告系列 */}
      <div ref={steps[1].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-300 transition-all">
        <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-blue-600 rounded-2xs inline-block"></span>
            <span>2. 广告系列设置 (Campaign)</span>
          </div>
          <span className="text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-sm">✓ 已配置</span>
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start">
            <span className="font-bold text-slate-700 pt-2">广告系列名称 <span className="text-rose-500">*</span></span>
            <div className="space-y-2 w-full">
              <input 
                type="text" 
                value={fbCampaignName}
                onChange={e => setFbCampaignName(e.target.value)}
                placeholder="请输入广告系列名称"
                className="w-full max-w-xl bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 text-xs font-bold focus:outline-hidden focus:border-blue-500"
              />
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  '{项目名称}',
                  '{地区组名称}',
                  '{跑法}',
                  '{创意组名称}',
                  '{创建日期(yyyymmdd)}',
                  '{创建时间(HH:mm:ss)}',
                  '{开始日期(yyyymmdd)}'
                ].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => insertVarCampaign(tag)}
                    className="px-3 py-1.5 border border-sky-200 bg-sky-50/40 text-sky-600 hover:bg-sky-100/50 rounded-sm font-semibold text-[11px] cursor-pointer transition-all"
                  >
                    {tag.replace(/[{}]/g, '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">广告系列状态</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFbCampaignStatus(!fbCampaignStatus)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${fbCampaignStatus ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${fbCampaignStatus ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </button>
              <span className="font-bold">{fbCampaignStatus ? '开启' : '关闭'}</span>
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start">
            <span className="font-bold text-slate-700 pt-2">特殊广告类别</span>
            <div className="relative max-w-sm w-full">
              <div 
                onClick={() => setFbSpecialCatDropdownOpen(!fbSpecialCatDropdownOpen)}
                className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 text-xs font-bold text-slate-800 cursor-pointer flex justify-between items-center"
              >
                <span className="truncate">
                  {fbSpecialCatSelected.length > 0 ? fbSpecialCatSelected.join(', ') : '请选择'}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

              {fbSpecialCatDropdownOpen && (
                <div className="absolute left-0 right-0 top-10 bg-white border border-slate-200 shadow-lg rounded z-40 p-2">
                  <div className="space-y-1.5">
                    {specialCategories.map(cat => {
                      const isChecked = fbSpecialCatSelected.includes(cat);
                      return (
                        <label key={cat} className="flex items-center gap-2 px-2 py-1 hover:bg-slate-50 rounded cursor-pointer font-semibold">
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setFbSpecialCatSelected(prev => prev.filter(c => c !== cat));
                              } else {
                                setFbSpecialCatSelected(prev => [...prev, cat]);
                              }
                            }}
                            className="rounded text-blue-600"
                          />
                          <span>{cat}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {fbSpecialCatSelected.length > 0 && (
            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start bg-rose-50/20 p-4 border border-rose-100 rounded">
              <span className="font-bold text-rose-800 pt-2">特殊广告地区 <span className="text-rose-500">*</span></span>
              <div className="space-y-3 w-full">
                <div className="grid grid-cols-2 gap-4 max-w-xl">
                  {/* Left Column */}
                  <div className="border border-slate-200 rounded bg-white">
                    <div className="bg-slate-50 px-2 py-1.5 border-b border-slate-200 font-bold text-slate-600">
                      地区选项 (Countries)
                    </div>
                    <div className="p-2 border-b border-slate-100">
                      <input 
                        type="text" 
                        placeholder="🔍 搜索国家/地区..." 
                        value={fbSpecialRegionSearch}
                        onChange={e => setFbSpecialRegionSearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px]"
                      />
                    </div>
                    <div className="max-h-32 overflow-y-auto p-1.5 space-y-1">
                      {availableSpecialRegions
                        .filter(r => r.includes(fbSpecialRegionSearch))
                        .map(reg => {
                          const isAdded = fbSpecialRegions.includes(reg) || fbSpecialRegionsExclude.includes(reg);
                          return (
                            <button
                              key={reg}
                              type="button"
                              disabled={isAdded}
                              onClick={() => {
                                if (fbSpecialRegionTab === 'include') {
                                  setFbSpecialRegions(prev => [...prev, reg]);
                                } else {
                                  setFbSpecialRegionsExclude(prev => [...prev, reg]);
                                }
                              }}
                              className={`w-full text-left px-2 py-1 rounded font-semibold text-[11px] flex justify-between items-center ${
                                isAdded ? 'text-slate-400 bg-slate-50 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span>{reg}</span>
                              <span className="text-blue-600 text-[10px] font-bold">+ 添加</span>
                            </button>
                          );
                        })}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="border border-slate-200 rounded bg-white flex flex-col justify-between">
                    <div>
                      <div className="bg-slate-50 px-2 py-1 border-b border-slate-200 flex justify-between items-center font-bold text-slate-600">
                        <span>已选地区</span>
                        <button 
                          type="button" 
                          onClick={() => {
                            setFbSpecialRegions([]);
                            setFbSpecialRegionsExclude([]);
                          }}
                          className="text-[10px] text-blue-600 font-bold hover:underline"
                        >
                          清除
                        </button>
                      </div>
                      <div className="flex border-b border-slate-150">
                        <button
                          type="button"
                          onClick={() => setFbSpecialRegionTab('include')}
                          className={`flex-1 text-center py-1 font-bold ${fbSpecialRegionTab === 'include' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' : 'text-slate-500'}`}
                        >
                          定向 ({fbSpecialRegions.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setFbSpecialRegionTab('exclude')}
                          className={`flex-1 text-center py-1 font-bold ${fbSpecialRegionTab === 'exclude' ? 'bg-rose-50 text-rose-600 border-b-2 border-rose-500' : 'text-slate-500'}`}
                        >
                          排除 ({fbSpecialRegionsExclude.length})
                        </button>
                      </div>
                      <div className="p-2 space-y-1.5 max-h-24 overflow-y-auto">
                        {fbSpecialRegionTab === 'include' ? (
                          fbSpecialRegions.length === 0 ? (
                            <span className="text-[10px] text-slate-400 block text-center py-4">暂无定向地区</span>
                          ) : (
                            fbSpecialRegions.map(r => (
                              <div key={r} className="flex justify-between items-center bg-blue-50 text-blue-700 rounded px-2 py-0.5 font-bold text-[10.5px]">
                                <span>{r}</span>
                                <button type="button" onClick={() => setFbSpecialRegions(prev => prev.filter(x => x !== r))} className="text-slate-400 hover:text-blue-700">✕</button>
                              </div>
                            ))
                          )
                        ) : (
                          fbSpecialRegionsExclude.length === 0 ? (
                            <span className="text-[10px] text-slate-400 block text-center py-4">暂无排除地区</span>
                          ) : (
                            fbSpecialRegionsExclude.map(r => (
                              <div key={r} className="flex justify-between items-center bg-rose-50 text-rose-700 rounded px-2 py-0.5 font-bold text-[10.5px]">
                                <span>{r}</span>
                                <button type="button" onClick={() => setFbSpecialRegionsExclude(prev => prev.filter(x => x !== r))} className="text-slate-400 hover:text-rose-700">✕</button>
                              </div>
                            ))
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">iOS 14+ 广告系列</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFbIos14Campaign(!fbIos14Campaign)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${fbIos14Campaign ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${fbIos14Campaign ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </button>
              <span className="font-bold">{fbIos14Campaign ? '开启' : '关闭'}</span>
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <span>赋能型广告系列预算优化</span>
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help shrink-0" />
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFbCboEnabled(!fbCboEnabled)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${fbCboEnabled ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${fbCboEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>

          {fbCboEnabled && (
            <>
              {/* 广告系列预算 */}
              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start animate-fade-in">
                <span className="font-bold text-slate-700 pt-1.5">广告系列预算</span>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFbCampaignBudgetType('daily');
                        setFbCampaignSchedule('all_time');
                      }}
                      className={`px-4 py-1.5 border font-bold rounded text-xs cursor-pointer ${
                        fbCampaignBudgetType === 'daily'
                          ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      单日预算
                    </button>
                    <button
                      type="button"
                      onClick={() => setFbCampaignBudgetType('lifetime')}
                      className={`px-4 py-1.5 border font-bold rounded text-xs cursor-pointer ${
                        fbCampaignBudgetType === 'lifetime'
                          ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      总预算
                    </button>
                  </div>

                  <div className="flex items-center max-w-xs mt-2">
                    <input
                      type="text"
                      placeholder="请输入"
                      value={fbDailyBudget}
                      onChange={e => setFbDailyBudget(e.target.value)}
                      className="w-full bg-white border border-slate-200 border-r-0 hover:border-slate-350 focus:border-blue-500 rounded-l px-3 py-1.5 text-xs font-bold focus:outline-hidden"
                    />
                    <span className="bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-bold px-3.5 py-1.5 rounded-r shrink-0">
                      USD
                    </span>
                  </div>
                </div>
              </div>

              {/* 广告系列竞价策略 */}
              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start animate-fade-in">
                <span className="font-bold text-slate-700 pt-1.5">广告系列竞价策略</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'highest_volume', label: '最高数量' },
                    { id: 'cost_per_result', label: '单次成效费用目标' },
                    { id: 'bid_cap', label: '竞价上限' },
                    { id: 'roas', label: '广告花费回报目标' }
                  ].map(strat => (
                    <button
                      key={strat.id}
                      type="button"
                      onClick={() => {
                        setFbCampaignBidStrategy(strat.id);
                        if (strat.id !== 'bid_cap') {
                          setFbCampaignPacing('standard');
                        }
                      }}
                      className={`px-4 py-1.5 border font-bold rounded text-xs cursor-pointer transition-colors ${
                        fbCampaignBidStrategy === strat.id
                          ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {strat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 投放时段 */}
              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center animate-fade-in">
                <span className="font-bold text-slate-700">投放时段</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFbCampaignSchedule('all_time')}
                    className={`px-4 py-1.5 border font-bold rounded text-xs cursor-pointer ${
                      fbCampaignSchedule === 'all_time'
                        ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    全天投放广告
                  </button>
                  <button
                    type="button"
                    disabled={fbCampaignBudgetType !== 'lifetime'}
                    onClick={() => setFbCampaignSchedule('custom')}
                    className={`px-4 py-1.5 border font-bold rounded text-xs transition-all ${
                      fbCampaignBudgetType !== 'lifetime'
                        ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                        : fbCampaignSchedule === 'custom'
                          ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs cursor-pointer'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 cursor-pointer'
                    }`}
                    title={fbCampaignBudgetType !== 'lifetime' ? "只有选择总预算时，才能选择分时间段投放" : undefined}
                  >
                    分时间段投放
                  </button>
                </div>
              </div>

              {/* 投放类型 */}
              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center animate-fade-in">
                <span className="font-bold text-slate-700">投放类型</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFbCampaignPacing('standard')}
                    className={`px-4 py-1.5 border font-bold rounded text-xs cursor-pointer ${
                      fbCampaignPacing === 'standard'
                        ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    匀速
                  </button>
                  <button
                    type="button"
                    disabled={fbCampaignBidStrategy !== 'bid_cap'}
                    onClick={() => setFbCampaignPacing('accelerated')}
                    className={`px-4 py-1.5 border font-bold rounded text-xs transition-all ${
                      fbCampaignBidStrategy !== 'bid_cap'
                        ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                        : fbCampaignPacing === 'accelerated'
                          ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs cursor-pointer'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                    title={fbCampaignBidStrategy !== 'bid_cap' ? "只有选择竞价上限时，才能选择加速投放" : undefined}
                  >
                    加速
                  </button>
                </div>
              </div>
            </>
          )}

          {/* 广告系列花费限额 (始终作为一级字段展示在最底部) */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start">
            <span className="font-bold text-slate-700 flex items-center gap-1 pt-1.5">
              <span>广告系列花费限额</span>
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help shrink-0" />
            </span>
            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFbCampaignSpendingLimitType('none')}
                  className={`px-4 py-1.5 border font-bold rounded text-xs cursor-pointer transition-colors ${
                    fbCampaignSpendingLimitType === 'none'
                      ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  不限
                </button>
                <button
                  type="button"
                  onClick={() => setFbCampaignSpendingLimitType('custom')}
                  className={`px-4 py-1.5 border font-bold rounded text-xs cursor-pointer transition-colors ${
                    fbCampaignSpendingLimitType === 'custom'
                      ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  自定义
                </button>
              </div>

              {fbCampaignSpendingLimitType === 'custom' && (
                <div className="flex items-center max-w-xs mt-2 animate-fade-in">
                  <input
                    type="text"
                    placeholder="请输入"
                    value={fbCampaignSpendingLimit}
                    onChange={e => setFbCampaignSpendingLimit(e.target.value)}
                    className="w-full bg-white border border-slate-200 border-r-0 hover:border-slate-350 focus:border-blue-500 rounded-l px-3 py-1.5 text-xs font-bold focus:outline-hidden"
                  />
                  <span className="bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-bold px-3.5 py-1.5 rounded-r shrink-0">
                    USD
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 底部花费限额提示 */}
          <div className="pt-2">
            <div className="flex items-start gap-2.5 text-[11px] text-amber-600 font-bold bg-amber-50/40 border border-amber-100 p-3 rounded-md max-w-2xl animate-fade-in">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>花费限额不是预算，如需设置广告系列预算请开启赋能型广告系列预算优化 (CBO)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 投放内容 */}
      <div ref={steps[2].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-300 transition-all">
        <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-4 flex items-center justify-between font-sans">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-blue-600 rounded-2xs inline-block"></span>
            <span className="text-sm font-bold text-slate-800">投放内容</span>
          </div>
          <span className="text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-sm">✓ 已配置</span>
        </h3>

        <div className="space-y-4 font-sans text-xs">
          {/* Ad Group Name */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start">
            <span className="font-bold text-slate-700 pt-2">广告组名称 <span className="text-rose-500">*</span></span>
            <div className="space-y-2 w-full">
              <input 
                type="text" 
                value={fbAdGroupName}
                onChange={e => setFbAdGroupName(e.target.value)}
                placeholder="请输入广告组名称"
                className="w-full max-w-xl bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 text-xs font-bold focus:outline-hidden focus:border-blue-500"
              />
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  '{项目名称}',
                  '{地区组名称}',
                  '{跑法}',
                  '{创意组名称}',
                  '{创建日期(yyyymmdd)}',
                  '{创建时间(HH:mm:ss)}',
                  '{开始日期(yyyymmdd)}'
                ].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => insertVarAdGroup(tag)}
                    className="px-3 py-1.5 border border-sky-200 bg-sky-50/40 text-sky-600 hover:bg-sky-100/50 rounded-sm font-semibold text-[11px] cursor-pointer transition-all"
                  >
                    {tag.replace(/[{}]/g, '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ad Group Status */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">广告组状态</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFbAdGroupStatus(!fbAdGroupStatus)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${fbAdGroupStatus ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${fbAdGroupStatus ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>

          {/* App Store (移动应用商店) */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">移动应用商店</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'google_play', label: 'Google Play' },
                { id: 'app_store', label: 'App Store' }
              ].map(store => (
                <button
                  key={store.id}
                  type="button"
                  onClick={() => setFbStore(store.id)}
                  className={`px-3 py-1.5 border font-bold rounded-sm text-xs cursor-pointer ${
                    fbStore === store.id ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs' : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  {store.label}
                </button>
              ))}
            </div>
          </div>

          {/* App Picker (应用) */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">应用 <span className="text-rose-500">*</span></span>
            <div className="relative max-w-sm w-full">
              <div 
                onClick={() => setFbAppDropdownOpen(!fbAppDropdownOpen)}
                className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-1.5 text-xs font-bold text-slate-800 cursor-pointer flex justify-between items-center"
              >
                <div className="flex items-center gap-2 text-left">
                  {/* Little Android/Apple icon next to App Name */}
                  <span className="text-emerald-500 text-sm">🤖</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{fbApp.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-medium">{fbApp.id}</span>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

              {fbAppDropdownOpen && (
                <div className="absolute left-0 right-0 top-12 bg-white border border-slate-200 shadow-lg rounded z-40 p-2 max-h-56 overflow-y-auto">
                  <div className="space-y-1">
                    {fbAppsList.map(app => (
                      <div 
                        key={app.id}
                        onClick={() => {
                          setFbApp(app);
                          setFbAppDropdownOpen(false);
                        }}
                        className={`px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer flex items-center gap-2 text-left ${fbApp.id === app.id ? 'bg-blue-50/50 text-blue-600' : ''}`}
                      >
                        <span className="text-emerald-500 text-sm">🤖</span>
                        <div className="flex flex-col">
                          <span className="font-bold text-xs text-slate-800">{app.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono font-medium">{app.id}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3.5 渠道号配置 */}
      <div ref={steps[3].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-300 transition-all">
        <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-4 flex items-center justify-between font-sans">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-blue-600 rounded-2xs inline-block"></span>
            <span className="text-sm font-bold text-slate-800">渠道号配置</span>
          </div>
          {fbChannelConfigured ? (
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
                name="fb_chan_gen" 
                checked={fbChannelGenMode === 'auto'} 
                onChange={() => {
                  setFbChannelGenMode('auto');
                  setFbChannelConfigured(false);
                }}
                className="text-blue-600 focus:ring-0 h-3.5 w-3.5 cursor-pointer" 
              />
              <span className={`${fbChannelGenMode === 'auto' ? 'text-blue-600' : ''}`}>配置生成</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input 
                type="radio" 
                name="fb_chan_gen" 
                checked={fbChannelGenMode === 'manual'} 
                onChange={() => {
                  setFbChannelGenMode('manual');
                  setFbChannelConfigured(false);
                }}
                className="text-blue-600 focus:ring-0 h-3.5 w-3.5 cursor-pointer" 
              />
              <span className={`${fbChannelGenMode === 'manual' ? 'text-blue-600' : ''}`}>手动输入</span>
            </label>
          </div>

          {/* 渠道号生成方式 */}
          <div className="space-y-1.5 pt-1">
            <span className="block text-slate-400 font-bold text-[11px]">渠道号生成方式</span>
            <div className="flex items-center gap-6 select-none font-bold">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input 
                  type="radio" 
                  name="fb_chan_way" 
                  checked={fbChannelSharingMode === 'shared'} 
                  onChange={() => setFbChannelSharingMode('shared')}
                  className="text-blue-600 focus:ring-0 h-3.5 w-3.5 cursor-pointer" 
                />
                <span className={`${fbChannelSharingMode === 'shared' ? 'text-blue-600' : ''}`}>所有广告组共用</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input 
                  type="radio" 
                  name="fb_chan_way" 
                  checked={fbChannelSharingMode === 'independent'} 
                  onChange={() => setFbChannelSharingMode('independent')}
                  className="text-blue-600 focus:ring-0 h-3.5 w-3.5 cursor-pointer" 
                />
                <span className={`${fbChannelSharingMode === 'independent' ? 'text-blue-600' : ''}`}>每个广告组独立生成</span>
              </label>
            </div>
          </div>

          {/* Mode: auto (配置生成) */}
          {fbChannelGenMode === 'auto' && (
            <div className="space-y-3.5 max-w-xl pt-2 animate-fade-in">
              {/* 游戏 */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  游戏 <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <select
                    value={fbChannelGame}
                    onChange={e => {
                      setFbChannelGame(e.target.value);
                      if (e.target.value !== '0') {
                        setFbChannelSource('Facebook Ads');
                      } else {
                        setFbChannelSource('');
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
                    value={fbChannelPlatform}
                    onChange={e => setFbChannelPlatform(e.target.value)}
                    className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                  >
                    <option value="0">0</option>
                    <option value="fb_feed">Facebook Feed/主页广告</option>
                    <option value="fb_carousel">Facebook 轮播/精品全屏</option>
                    <option value="fb_video">Facebook 视频/图片直投</option>
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
                  {fbChannelGame === '0' ? (
                    <select
                      disabled
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-400 focus:outline-hidden appearance-none cursor-not-allowed"
                    >
                      <option value="">请先选择游戏</option>
                    </select>
                  ) : (
                    <select
                      value={fbChannelSource}
                      onChange={e => setFbChannelSource(e.target.value)}
                      className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                    >
                      <option value="Facebook Ads">Facebook Ads</option>
                      <option value="Instagram Ads">Instagram Ads</option>
                      <option value="Audience Network">Audience Network</option>
                      <option value="Messenger Ads">Messenger Ads</option>
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
                    value={fbChannelRegion}
                    onChange={e => {
                      setFbChannelRegion(e.target.value);
                      setFbChannelRegionTouched(true);
                      if (e.target.value) {
                        setFbChannelConfigured(true);
                      } else {
                        setFbChannelConfigured(false);
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
                {(!fbChannelRegion || !fbChannelRegionTouched) && (
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
                  <span className={`font-bold ${fbChannelPitcher ? 'text-slate-800 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded' : 'text-slate-400'}`}>
                    {fbChannelPitcher || '未选择投手'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const names = ['投手张三', '投手李四', '投手王五'];
                      const picked = names[Math.floor(Math.random() * names.length)] + ` (${Math.floor(100 + Math.random() * 900)})`;
                      setFbChannelPitcher(picked);
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-250 hover:border-slate-350 hover:bg-slate-50 text-slate-700 font-bold rounded-sm cursor-pointer transition-colors"
                  >
                    选择投手
                  </button>
                  {fbChannelPitcher && (
                    <button 
                      type="button" 
                      onClick={() => setFbChannelPitcher('')}
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
                  {fbChannelLabel ? (
                    <span className="font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded flex items-center gap-1">
                      <span>{fbChannelLabel}</span>
                      <button 
                        type="button" 
                        onClick={() => setFbChannelLabel('')}
                        className="hover:bg-blue-100 p-0.5 rounded-full w-4 h-4 flex items-center justify-center text-[9px] text-blue-500"
                      >
                        ✕
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const tags = ['FB-TEST-CAMP', 'GLOBAL-ADV', 'SUMMER-SPECIAL'];
                        const picked = tags[Math.floor(Math.random() * tags.length)];
                        setFbChannelLabel(picked);
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
                  value={fbChannelRemark}
                  onChange={e => setFbChannelRemark(e.target.value)}
                  placeholder="请输入备注信息"
                  rows={3}
                  className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Mode: manual (手动输入) */}
          {fbChannelGenMode === 'manual' && (
            <div className="space-y-3.5 max-w-xl pt-2 animate-fade-in">
              {/* 游戏 */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  游戏 <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <select
                    value={fbChannelGame}
                    onChange={e => {
                      setFbChannelGame(e.target.value);
                      if (e.target.value === '0') {
                        setFbChannelManualCode('');
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
                  {fbChannelGame === '0' ? (
                    <select
                      disabled
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-400 focus:outline-hidden appearance-none cursor-not-allowed"
                    >
                      <option value="">请先选择游戏</option>
                    </select>
                  ) : (
                    <select
                      value={fbChannelManualCode}
                      onChange={e => {
                        setFbChannelManualCode(e.target.value);
                      }}
                      className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                    >
                      <option value="">请选择渠道号</option>
                      <option value="CHAN_FB_01">CHAN_FB_01 (100192)</option>
                      <option value="CHAN_FB_02">CHAN_FB_02 (100193)</option>
                      <option value="CHAN_FB_03">CHAN_FB_03 (100194)</option>
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
                    if (fbChannelGame === '0') {
                      alert('请选择具体游戏后再进行确认！');
                      return;
                    }
                    if (!fbChannelManualCode) {
                      alert('请选择渠道号后再进行确认！');
                      return;
                    }
                    setFbChannelConfigured(true);
                    alert(`渠道号配置成功！已绑定游戏并同步手动输入渠道号 [${fbChannelManualCode}]`);
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

      {/* 4. 地区组 */}
      <div ref={steps[4].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-300 transition-all font-sans text-xs">
        {/* Section Title & Batch Actions to match Image 2 */}
        <div className="border-b border-slate-150 pb-3 mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-blue-600 rounded-2xs inline-block"></span>
            地区组
          </h3>
          <div className="flex items-center gap-4 text-xs font-bold relative">
            {/* Batch Ops Dropdown Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFbBatchOpsDropdownOpen(!isFbBatchOpsDropdownOpen)}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>批量操作</span>
                <span className="text-[9px]">▼</span>
              </button>
              
              {isFbBatchOpsDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFbBatchOpsDropdownOpen(false)}></div>
                  <div className="absolute right-0 top-6 bg-white border border-slate-200 shadow-lg rounded py-1 w-36 z-55 text-slate-700 text-xs font-medium animate-fade-in">
                    <button
                      type="button"
                      onClick={() => {
                        setIsFbBatchOpsDropdownOpen(false);
                        setIsFbExistingRegionModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs"
                    >
                      添加已有地区组
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsFbBatchOpsDropdownOpen(false);
                        setFbBatchImportTargetType('selectedRegions');
                        setFbBatchImportText('');
                        setIsFbBatchImportModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs"
                    >
                      批量导入
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsFbBatchOpsDropdownOpen(false);
                        setIsFbBatchSettingsModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs"
                    >
                      批量设置
                    </button>
                  </div>
                </>
              )}
            </div>
            
            {/* Clear All */}
            <button
              type="button"
              onClick={() => {
                if (confirm('确认清空所有地区组配置吗？')) {
                  setFbRegionGroups([
                    {
                      id: 'rg1',
                      name: '地区组1',
                      selectedRegions: [],
                      excludedRegions: [],
                      isSpecifiedRegion: false,
                      languageOption: 'all',
                      selectedLanguages: [],
                      targetOption: '此位置或对其感兴趣的用户(推荐)',
                      excludeOption: '此位置或对其感兴趣的用户(推荐)',
                      selectedTag: ''
                    }
                  ]);
                  setActiveFbRegionGroupId('rg1');
                  setIsFbExistingRegionChecked(false);
                }
              }}
              className="text-slate-600 hover:text-rose-600 cursor-pointer"
            >
              清空
            </button>
          </div>
        </div>

        {/* Region Groups Tabs Row to match Image 2 */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-2 rounded mb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {fbRegionGroups.map((rg, idx) => (
              <div
                key={rg.id}
                className={`relative flex items-center gap-1 px-3 py-1.5 rounded border text-xs font-bold transition-all cursor-pointer ${
                  activeFbRegionGroupId === rg.id 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs' 
                    : 'bg-white border-slate-200 hover:border-slate-350 text-slate-600 hover:text-slate-800'
                }`}
                onClick={() => setActiveFbRegionGroupId(rg.id)}
              >
                <span>{rg.name}</span>
                <span 
                  className="text-[11px] opacity-70 hover:opacity-100 pl-1 font-bold cursor-pointer inline-block w-4 h-4 text-center leading-4 hover:bg-black/10 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFbRegionGroupId(rg.id);
                    const rect = e.currentTarget.getBoundingClientRect();
                    setFbTabMenuCoords({
                      top: rect.bottom + 4,
                      left: rect.left
                    });
                    setFbTabMenuOpenId(fbTabMenuOpenId === rg.id ? null : rg.id);
                  }}
                  title="地区组操作"
                >
                  ⋮
                </span>
              </div>
            ))}
            
            <button
              type="button"
              onClick={handleAddRegionGroup}
              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-[10.5px] rounded border border-blue-200 flex items-center gap-1 cursor-pointer transition-colors shrink-0"
            >
              <span>+ 新增地区组</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-bold pr-1">
            {fbRegionGroups.length} / 30
          </div>
        </div>

        {/* Global/Fixed Dropdown Menu for Region Groups (Renders outside the scrollable container to prevent clipping) */}
        {fbTabMenuOpenId && fbTabMenuCoords && (
          <>
            <div 
              className="fixed inset-0 z-45 bg-transparent cursor-default" 
              onClick={(e) => {
                e.stopPropagation();
                setFbTabMenuOpenId(null);
                setFbTabMenuCoords(null);
              }}
            ></div>
            <div 
              className="fixed bg-white border border-slate-200 shadow-md rounded py-1 w-32 z-50 text-slate-700 text-xs font-medium animate-fade-in select-none"
              style={{
                top: `${fbTabMenuCoords.top}px`,
                left: `${fbTabMenuCoords.left}px`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  handleDuplicateRegionGroup(fbTabMenuOpenId);
                  setFbTabMenuOpenId(null);
                  setFbTabMenuCoords(null);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs flex items-center gap-1.5 font-semibold text-slate-700 transition-colors"
              >
                <span>复制</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetGroup = fbRegionGroups.find(x => x.id === fbTabMenuOpenId);
                  if (targetGroup) {
                    setFbRegionGroupActionModal({
                      type: 'batch_duplicate',
                      targetId: fbTabMenuOpenId,
                      targetName: targetGroup.name,
                      inputValue: '3'
                    });
                  }
                  setFbTabMenuOpenId(null);
                  setFbTabMenuCoords(null);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs flex items-center gap-1.5 font-semibold text-slate-700 transition-colors"
              >
                <span>批量复制</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetGroup = fbRegionGroups.find(x => x.id === fbTabMenuOpenId);
                  if (targetGroup) {
                    setFbRegionGroupActionModal({
                      type: 'rename',
                      targetId: fbTabMenuOpenId,
                      targetName: targetGroup.name,
                      inputValue: targetGroup.name
                    });
                  }
                  setFbTabMenuOpenId(null);
                  setFbTabMenuCoords(null);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs flex items-center gap-1.5 font-semibold text-slate-700 transition-colors"
              >
                <span>重命名</span>
              </button>
              <div className="border-t border-slate-100 my-1"></div>
              <button
                type="button"
                onClick={() => {
                  const targetGroup = fbRegionGroups.find(x => x.id === fbTabMenuOpenId);
                  if (targetGroup) {
                    setFbRegionGroupActionModal({
                      type: 'delete',
                      targetId: fbTabMenuOpenId,
                      targetName: targetGroup.name,
                      inputValue: ''
                    });
                  }
                  setFbTabMenuOpenId(null);
                  setFbTabMenuCoords(null);
                }}
                className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 cursor-pointer text-xs flex items-center gap-1.5 font-bold transition-colors"
              >
                <span>删除</span>
              </button>
            </div>
          </>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">选择已有地区组</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFbExistingRegionModalOpen(true)}
                className="flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer bg-transparent border-0 outline-hidden"
              >
                <input 
                  type="checkbox" 
                  checked={isFbExistingRegionChecked}
                  onChange={e => {
                    e.stopPropagation();
                    setIsFbExistingRegionChecked(e.target.checked);
                    if (e.target.checked) {
                      setIsFbExistingRegionModalOpen(true);
                    }
                  }}
                  className="rounded text-blue-600 cursor-pointer"
                />
                <span>选择已有地区组</span>
              </button>
            </div>
          </div>

          {/* 绑定对象 */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">绑定对象 <span className="text-rose-500">*</span></span>
            <div 
              onClick={() => {
                setFbBindingRulesModule('region');
                setFbBindingRulesActiveTab('account');
                setIsFbBindingRulesModalOpen(true);
              }}
              className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-blue-600 cursor-pointer transition-colors"
            >
              <span>{getBoundLabel(activeFbRegionGroupId, 'region')}</span>
              <span className="text-slate-400 hover:text-slate-600 cursor-pointer">✏️</span>
            </div>
          </div>

          {/* Region selector twin-panel (地区) */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start">
            <span className="font-bold text-slate-700 pt-2">地区 <span className="text-rose-500 font-bold">*</span></span>
            <div className="w-full">
              <div className="grid grid-cols-2 gap-4 max-w-2xl border border-slate-200 rounded overflow-hidden">
                {/* Left Panel */}
                <div className="bg-white border-r border-slate-200 flex flex-col h-[280px]">
                  <div className="p-2 border-b border-slate-100">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="搜索..." 
                        value={fbRegionSearch}
                        onChange={e => setFbRegionSearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 pl-7 text-xs text-slate-800 focus:outline-hidden focus:border-blue-500"
                      />
                      <span className="absolute left-2.5 top-2.5 text-slate-400 text-xs">🔍</span>
                    </div>
                  </div>
                  
                  {/* Table Headers */}
                  <div className="grid grid-cols-[1fr_100px] px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 font-bold">
                    <span>名称</span>
                    <span className="text-right">操作</span>
                  </div>

                  {/* List Container */}
                  <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                    {[
                      'iTunes App Store 开放国家/地区 地区',
                      '东盟自由贸易区 地区',
                      'Tucson, AZ 市场',
                      'Fairbanks, AK 市场',
                      '美国 (USA)',
                      '加拿大 (Canada)',
                      '英国 (United Kingdom)',
                      '澳大利亚 (Australia)',
                      '新加坡 (Singapore)',
                      '泰国 (Thailand)',
                      '巴西 (Brazil)',
                      '台湾地区 (Taiwan)',
                      '德国 (Germany)',
                      '法国 (France)',
                      '欧盟地区 (European Union)',
                      // 美国州级
                      '加利福尼亚州 (California, US)',
                      '德克萨斯州 (Texas, US)',
                      '纽约州 (New York, US)',
                      '佛罗里达州 (Florida, US)',
                      '华盛顿州 (Washington, US)',
                      '伊利诺伊州 (Illinois, US)',
                      '宾夕法尼亚州 (Pennsylvania, US)',
                      '俄亥俄州 (Ohio, US)',
                      '乔治亚州 (Georgia, US)',
                      '马萨诸塞州 (Massachusetts, US)',
                      '新泽西州 (New Jersey, US)',
                      '密歇根州 (Michigan, US)',
                      '北卡罗来纳州 (North Carolina, US)',
                      '弗吉尼亚州 (Virginia, US)',
                      '亚利桑那州 (Arizona, US)',
                      // 加拿大省级
                      '安大略省 (Ontario, CA)',
                      '魁北克省 (Quebec, CA)',
                      '不列颠哥伦比亚省 (British Columbia, CA)',
                      '阿尔伯塔省 (Alberta, CA)',
                      '马尼托巴省 (Manitoba, CA)',
                      // 英国省级/地区级
                      '英格兰 (England, UK)',
                      '苏格兰 (Scotland, UK)',
                      '威尔士 (Wales, UK)',
                      '北爱尔兰 (Northern Ireland, UK)',
                      // 澳大利亚州级
                      '新南威尔士州 (New South Wales, AU)',
                      '维多利亚州 (Victoria, AU)',
                      '昆士兰州 (Queensland, AU)',
                      '西澳大利亚州 (Western Australia, AU)',
                      '南澳大利亚州 (South Australia, AU)',
                      // 巴西州级
                      '圣保罗州 (São Paulo, BR)',
                      '里约热内卢州 (Rio de Janeiro, BR)',
                      '米纳斯吉拉斯州 (Minas Gerais, BR)',
                      '巴拉那州 (Paraná, BR)',
                      // 德国联邦州级
                      '巴伐利亚自由州 (Bavaria, DE)',
                      '巴登-符腾堡州 (Baden-Württemberg, DE)',
                      '北莱茵-威斯特法伦州 (North Rhine-Westphalia, DE)',
                      '柏林 (Berlin, DE)',
                      '黑森州 (Hesse, DE)',
                      // 法国大区级
                      '法兰西岛大区 (Île-de-France, FR)',
                      '普罗旺斯-阿尔卑斯-蓝色海岸大区 (Provence-Alpes-Côte\'Azur, FR)',
                      '奥弗涅-罗讷-阿尔卑斯大区 (Auvergne-Rhône-Alpes, FR)',
                      '新阿基坦大区 (Nouvelle-Aquitaine, FR)',
                      // 泰国省级
                      '曼谷直辖市 (Bangkok, TH)',
                      '清迈府 (Chiang Mai, TH)',
                      '普吉府 (Phuket, TH)',
                      '春武里府 (Chon Buri, TH)',
                      // 台湾地区县市级
                      '台北市 (Taipei, TW)',
                      '新北市 (New Taipei, TW)',
                      '台中市 (Taichung, TW)',
                      '高雄市 (Kaohsiung, TW)'
                    ]
                      .filter(r => r.toLowerCase().includes(fbRegionSearch.toLowerCase()))
                      .map(reg => {
                        const isTargeted = currentRegionGroup.selectedRegions.includes(reg);
                        const isExcluded = currentRegionGroup.excludedRegions.includes(reg);
                        
                        return (
                          <div key={reg} className="grid grid-cols-[1fr_100px] items-center px-3 py-2 text-xs hover:bg-slate-50 transition-colors">
                            <span className="text-slate-700 font-medium truncate pr-2">{reg}</span>
                            <div className="flex justify-end gap-2 text-[11px]">
                              {isTargeted ? (
                                <span className="text-slate-400 font-semibold">已定向</span>
                              ) : isExcluded ? (
                                <span className="text-slate-400 font-semibold">已排除</span>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFbRegionGroups(prev => prev.map(rg => rg.id === activeFbRegionGroupId ? {
                                        ...rg, selectedRegions: [...rg.selectedRegions, reg]
                                      } : rg));
                                    }}
                                    className="text-blue-600 hover:underline font-bold cursor-pointer"
                                  >
                                    定向
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFbRegionGroups(prev => prev.map(rg => rg.id === activeFbRegionGroupId ? {
                                        ...rg, excludedRegions: [...rg.excludedRegions, reg]
                                      } : rg));
                                    }}
                                    className="text-blue-600 hover:underline font-bold cursor-pointer"
                                  >
                                    排除
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Right Panel */}
                <div className="bg-white flex flex-col h-[280px]">
                  {/* Selected Headers */}
                  <div className="flex justify-between items-center p-2 border-b border-slate-100 bg-slate-50">
                    <span className="font-bold text-slate-700">已选</span>
                    <div className="flex gap-3 text-[11px]">
                      <button 
                        type="button" 
                        onClick={() => {
                          setFbBatchImportTargetType('selectedRegions');
                          setFbBatchImportText('');
                          setIsFbBatchImportModalOpen(true);
                        }}
                        className="text-blue-600 hover:underline font-bold cursor-pointer"
                      >
                        批量导入
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          setFbRegionGroups(prev => prev.map(rg => rg.id === activeFbRegionGroupId ? {
                            ...rg, selectedRegions: [], excludedRegions: []
                          } : rg));
                        }}
                        className="text-blue-600 hover:underline font-bold cursor-pointer"
                      >
                        清除
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Tabs */}
                  <div className="flex border-b border-slate-100">
                    <button
                      type="button"
                      onClick={() => setFbRegionDualTab('include')}
                      className={`flex-1 text-center py-2 font-bold transition-all text-xs border-b-2 ${
                        fbRegionDualTab === 'include' 
                          ? 'border-blue-500 text-blue-600 bg-blue-50/20' 
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      定向 ({currentRegionGroup.selectedRegions.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFbRegionDualTab('exclude')}
                      className={`flex-1 text-center py-2 font-bold transition-all text-xs border-b-2 ${
                        fbRegionDualTab === 'exclude' 
                          ? 'border-blue-500 text-blue-600 bg-blue-50/20' 
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      排除 ({currentRegionGroup.excludedRegions.length})
                    </button>
                  </div>

                  {/* Selected regions list container */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-slate-50/30">
                    {fbRegionDualTab === 'include' ? (
                      currentRegionGroup.selectedRegions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 font-semibold py-8 text-center">
                          <span>暂无定向地区</span>
                        </div>
                      ) : (
                        currentRegionGroup.selectedRegions.map(r => (
                          <div key={r} className="flex justify-between items-center bg-blue-50 text-blue-700 rounded-sm px-2 py-1 font-bold text-[11px]">
                            <span className="truncate pr-2">{r}</span>
                            <button 
                              type="button" 
                              onClick={() => setFbRegionGroups(prev => prev.map(rg => rg.id === activeFbRegionGroupId ? {
                                ...rg, selectedRegions: rg.selectedRegions.filter(x => x !== r)
                              } : rg))} 
                              className="text-slate-400 hover:text-blue-700 font-extrabold cursor-pointer text-xs shrink-0"
                            >
                              ✕
                            </button>
                          </div>
                        ))
                      )
                    ) : (
                      currentRegionGroup.excludedRegions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 font-semibold py-8 text-center">
                          <span>暂无排除地区</span>
                        </div>
                      ) : (
                        currentRegionGroup.excludedRegions.map(r => (
                          <div key={r} className="flex justify-between items-center bg-rose-50 text-rose-700 rounded-sm px-2 py-1 font-bold text-[11px]">
                            <span className="truncate pr-2">{r}</span>
                            <button 
                              type="button" 
                              onClick={() => setFbRegionGroups(prev => prev.map(rg => rg.id === activeFbRegionGroupId ? {
                                ...rg, excludedRegions: rg.excludedRegions.filter(x => x !== r)
                              } : rg))} 
                              className="text-slate-400 hover:text-rose-700 font-extrabold cursor-pointer text-xs shrink-0"
                            >
                              ✕
                            </button>
                          </div>
                        ))
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* EU Alert banner (欧盟政策提示) */}
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded flex gap-2 max-w-2xl text-blue-700">
            <span className="text-sm">●</span>
            <span className="leading-relaxed font-bold text-blue-600">
              对于任何定位欧盟地区受众 of 广告组，你需要指明广告组的受益人或组织，以及广告组的赞助方。 <span className="underline cursor-pointer text-blue-700 font-bold">详细了解</span>
            </span>
          </div>

          {/* Dropdowns of Beneficiaries and Sponsors sequentially */}
          <div className="space-y-3.5 pt-2">
            {/* Financial ad specified location */}
            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
              <span className="font-bold text-slate-700">在什么地区投放金融产品类广告</span>
              <div className="relative max-w-sm w-full">
                <select
                  value={fbSpecifiedRegionFinance}
                  onChange={e => setFbSpecifiedRegionFinance(e.target.value)}
                  className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                >
                  <option value="">请选择</option>
                  <option value="tw">中国台湾地区</option>
                  <option value="au">澳大利亚</option>
                  <option value="sg">新加坡</option>
                  <option value="th">泰国或巴西</option>
                  <option value="eu">欧盟成员国</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Beneficiary and Sponsor for Taiwan */}
            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
              <span className="font-bold text-slate-700">受益方(台湾地区)</span>
              <div className="relative max-w-sm w-full">
                <select 
                  value={fbBeneficiaryTaiwan} 
                  onChange={e => setFbBeneficiaryTaiwan(e.target.value)}
                  className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                >
                  <option value="">请选择</option>
                  <option value="self">Perfect Avenger Corp</option>
                  <option value="other">第三方投放代理</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
              <span className="font-bold text-slate-700">赞助方(台湾地区)</span>
              <div className="relative max-w-sm w-full">
                <select 
                  value={fbSponsorTaiwan} 
                  onChange={e => setFbSponsorTaiwan(e.target.value)}
                  className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                >
                  <option value="">请选择</option>
                  <option value="self">Perfect Avenger Corp</option>
                  <option value="other">第三方投放代理</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Beneficiary and Sponsor for Australia */}
            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
              <span className="font-bold text-slate-700">受益方(澳大利亚)</span>
              <div className="relative max-w-sm w-full">
                <select 
                  value={fbBeneficiaryAustralia} 
                  onChange={e => setFbBeneficiaryAustralia(e.target.value)}
                  className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                >
                  <option value="">请选择</option>
                  <option value="self">Perfect Avenger Corp</option>
                  <option value="other">第三方投放代理</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
              <span className="font-bold text-slate-700">赞助方(澳大利亚)</span>
              <div className="relative max-w-sm w-full">
                <select 
                  value={fbSponsorAustralia} 
                  onChange={e => setFbSponsorAustralia(e.target.value)}
                  className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                >
                  <option value="">请选择</option>
                  <option value="self">Perfect Avenger Corp</option>
                  <option value="other">第三方投放代理</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Beneficiary and Sponsor for Singapore */}
            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
              <span className="font-bold text-slate-700">受益方(新加坡)</span>
              <div className="relative max-w-sm w-full">
                <select 
                  value={fbBeneficiarySingapore} 
                  onChange={e => setFbBeneficiarySingapore(e.target.value)}
                  className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                >
                  <option value="">请选择</option>
                  <option value="self">Perfect Avenger Corp</option>
                  <option value="other">第三方投放代理</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
              <span className="font-bold text-slate-700">赞助方(新加坡)</span>
              <div className="relative max-w-sm w-full">
                <select 
                  value={fbSponsorSingapore} 
                  onChange={e => setFbSponsorSingapore(e.target.value)}
                  className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                >
                  <option value="">请选择</option>
                  <option value="self">Perfect Avenger Corp</option>
                  <option value="other">第三方投放代理</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Beneficiary and Sponsor for Thailand or Brazil */}
            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
              <span className="font-bold text-slate-700">受益方(泰国或巴西)</span>
              <div className="relative max-w-sm w-full">
                <select 
                  value={fbBeneficiaryThailand} 
                  onChange={e => setFbBeneficiaryThailand(e.target.value)}
                  className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                >
                  <option value="">请选择</option>
                  <option value="self">Perfect Avenger Corp</option>
                  <option value="other">第三方投放代理</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
              <span className="font-bold text-slate-700">赞助方(泰国或巴西)</span>
              <div className="relative max-w-sm w-full">
                <select 
                  value={fbSponsorThailand} 
                  onChange={e => setFbSponsorThailand(e.target.value)}
                  className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                >
                  <option value="">请选择</option>
                  <option value="self">Perfect Avenger Corp</option>
                  <option value="other">第三方投放代理</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Beneficiary and Sponsor for EU */}
            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
              <span className="font-bold text-slate-700">受益方(欧盟)</span>
              <div className="relative max-w-sm w-full">
                <select 
                  value={fbBeneficiaryEU} 
                  onChange={e => setFbBeneficiaryEU(e.target.value)}
                  className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                >
                  <option value="">请选择</option>
                  <option value="self">Perfect Avenger Corp</option>
                  <option value="other">第三方投放代理</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
              <span className="font-bold text-slate-700">赞助方(欧盟)</span>
              <div className="relative max-w-sm w-full">
                <select 
                  value={fbSponsorEU} 
                  onChange={e => setFbSponsorEU(e.target.value)}
                  className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                >
                  <option value="">请选择</option>
                  <option value="self">Perfect Avenger Corp</option>
                  <option value="other">第三方投放代理</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Label / 标签 */}
            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                标签 <span className="text-slate-400 cursor-help" title="用于筛选和分类地区组">ⓘ</span>
              </span>
              <div className="relative max-w-sm w-full">
                <select
                  value={fbRegionTag}
                  onChange={e => setFbRegionTag(e.target.value)}
                  className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                >
                  <option value="">请选择</option>
                  <option value="global">全球通投</option>
                  <option value="apac">亚太核心</option>
                  <option value="europe">欧洲核心</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Region Group Name */}
            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
              <span className="font-bold text-slate-700">地区组名称 <span className="text-rose-500">*</span></span>
              <div className="relative max-w-sm w-full">
                <input 
                  type="text" 
                  value={currentRegionGroup.name}
                  onChange={e => {
                    const val = e.target.value;
                    setFbRegionGroups(prev => prev.map(rg => rg.id === activeFbRegionGroupId ? { ...rg, name: val } : rg));
                  }}
                  className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-12 text-xs font-bold"
                  placeholder="地区组1"
                />
                <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-mono font-bold">
                  {currentRegionGroup.name.length} / 50
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 pt-2">
            <span></span>
            <button
              type="button"
              onClick={() => alert('地区组设置保存成功！')}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-3xs w-36 cursor-pointer text-center text-xs"
            >
              保存为地区组
            </button>
          </div>
        </div>

        {/* 0. 地区组操作弹窗 (重命名 / 批量复制 / 确认删除) */}
        {fbRegionGroupActionModal.type && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans select-none animate-fade-in text-slate-800">
            <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md flex flex-col">
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-lg">
                <span className="text-sm font-extrabold text-slate-800">
                  {fbRegionGroupActionModal.type === 'rename' && '重命名地区组'}
                  {fbRegionGroupActionModal.type === 'batch_duplicate' && '批量复制地区组'}
                  {fbRegionGroupActionModal.type === 'delete' && '确认删除地区组'}
                </span>
                <button 
                  onClick={() => setFbRegionGroupActionModal({ type: null, targetId: null, targetName: '', inputValue: '' })} 
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                {fbRegionGroupActionModal.type === 'rename' && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 block">请输入新的地区组名称：</label>
                    <input 
                      type="text" 
                      value={fbRegionGroupActionModal.inputValue}
                      onChange={e => setFbRegionGroupActionModal(prev => ({ ...prev, inputValue: e.target.value }))}
                      placeholder="请输入名称..."
                      className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 text-xs font-bold focus:outline-hidden focus:border-blue-500"
                      autoFocus
                    />
                  </div>
                )}

                {fbRegionGroupActionModal.type === 'batch_duplicate' && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 block">请输入需要复制的份数：</label>
                    <input 
                      type="number" 
                      min="1"
                      max="100"
                      value={fbRegionGroupActionModal.inputValue}
                      onChange={e => setFbRegionGroupActionModal(prev => ({ ...prev, inputValue: e.target.value }))}
                      placeholder="份数"
                      className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 text-xs font-bold focus:outline-hidden focus:border-blue-500"
                      autoFocus
                    />
                  </div>
                )}

                {fbRegionGroupActionModal.type === 'delete' && (
                  <div className="py-2">
                    <p className="text-xs font-semibold text-slate-600">
                      确定要删除地区组「<span className="text-slate-900 font-extrabold">{fbRegionGroupActionModal.targetName}</span>」吗？
                    </p>
                    <p className="text-[10.5px] text-rose-500 font-bold mt-1.5">
                      警告：此操作不可撤销，且将清空该地区组内配置的所有区域、语言等定向设置。
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50 rounded-b-lg flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFbRegionGroupActionModal({ type: null, targetId: null, targetName: '', inputValue: '' })}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded text-xs font-bold text-slate-600 cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const { type, targetId, inputValue } = fbRegionGroupActionModal;
                    if (type === 'rename') {
                      if (!inputValue.trim()) {
                        alert('名称不能为空！');
                        return;
                      }
                      setFbRegionGroups(prev => prev.map(x => x.id === targetId ? { ...x, name: inputValue.trim() } : x));
                    } else if (type === 'batch_duplicate') {
                      const count = parseInt(inputValue, 10);
                      if (isNaN(count) || count <= 0) {
                        alert('请输入有效的复制数量！');
                        return;
                      }
                      handleBatchDuplicateRegionGroup(targetId!, count);
                    } else if (type === 'delete') {
                      handleDeleteRegionGroup(targetId!);
                    }
                    // Close modal
                    setFbRegionGroupActionModal({ type: null, targetId: null, targetName: '', inputValue: '' });
                  }}
                  className={`px-4 py-2 text-white rounded text-xs font-bold cursor-pointer transition-colors ${
                    fbRegionGroupActionModal.type === 'delete' 
                      ? 'bg-rose-600 hover:bg-rose-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 0.5. 定向包/出价/创意 批量操作弹窗 */}
        {fbGenericActionModal.type && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans select-none animate-fade-in text-slate-800">
            <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md flex flex-col">
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-lg">
                <span className="text-sm font-extrabold text-slate-800">
                  {fbGenericActionModal.type === 'rename' && '重命名'}
                  {fbGenericActionModal.type === 'batch_duplicate' && '批量复制'}
                  {fbGenericActionModal.type === 'delete' && '确认删除'}
                </span>
                <button 
                  onClick={() => setFbGenericActionModal({ module: null, type: null, targetId: null, targetName: '', inputValue: '' })} 
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                {fbGenericActionModal.type === 'rename' && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 block">请输入新名称：</label>
                    <input 
                      type="text" 
                      value={fbGenericActionModal.inputValue}
                      onChange={e => setFbGenericActionModal(prev => ({ ...prev, inputValue: e.target.value }))}
                      placeholder="请输入名称..."
                      className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 text-xs font-bold focus:outline-hidden focus:border-blue-500"
                      autoFocus
                    />
                  </div>
                )}

                {fbGenericActionModal.type === 'batch_duplicate' && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 block">请输入需要复制的份数：</label>
                    <input 
                      type="number" 
                      min="1"
                      max="100"
                      value={fbGenericActionModal.inputValue}
                      onChange={e => setFbGenericActionModal(prev => ({ ...prev, inputValue: e.target.value }))}
                      placeholder="份数"
                      className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 text-xs font-bold focus:outline-hidden focus:border-blue-500"
                      autoFocus
                    />
                  </div>
                )}

                {fbGenericActionModal.type === 'delete' && (
                  <div className="py-2">
                    <p className="text-xs font-semibold text-slate-600">
                      确定要删除「<span className="text-slate-900 font-extrabold">{fbGenericActionModal.targetName}</span>」吗？
                    </p>
                    <p className="text-[10.5px] text-rose-500 font-bold mt-1.5">
                      警告：此操作不可撤销，且将清空配置的所有设定。
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50 rounded-b-lg flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFbGenericActionModal({ module: null, type: null, targetId: null, targetName: '', inputValue: '' })}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded text-xs font-bold text-slate-600 cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const { module, type, targetId, inputValue } = fbGenericActionModal;
                    if (type === 'rename') {
                      if (!inputValue.trim()) {
                        alert('名称不能为空！');
                        return;
                      }
                      if (module === 'targeting_package') {
                        setFbTargetingPackages(prev => prev.map(x => x.id === targetId ? { ...x, name: inputValue.trim() } : x));
                      } else if (module === 'budget') {
                        setFbBudgets(prev => prev.map(x => x.id === targetId ? { ...x, name: inputValue.trim() } : x));
                      } else if (module === 'creative_group') {
                        setFbCreativeGroups(prev => prev.map(x => x.id === targetId ? { ...x, name: inputValue.trim() } : x));
                      }
                    } else if (type === 'batch_duplicate') {
                      const count = parseInt(inputValue, 10);
                      if (isNaN(count) || count <= 0) {
                        alert('请输入有效的复制数量！');
                        return;
                      }
                      if (module === 'targeting_package') {
                        handleBatchDuplicateTargetingPackage(targetId!, count);
                      } else if (module === 'budget') {
                        handleBatchDuplicateBudget(targetId!, count);
                      } else if (module === 'creative_group') {
                        handleBatchDuplicateCreativeGroup(targetId!, count);
                      }
                    } else if (type === 'delete') {
                      if (module === 'targeting_package') {
                        handleDeleteTargetingPackage(targetId!);
                      } else if (module === 'budget') {
                        handleDeleteBudget(targetId!);
                      } else if (module === 'creative_group') {
                        handleDeleteCreativeGroup(targetId!);
                      }
                    }
                    // Close modal
                    setFbGenericActionModal({ module: null, type: null, targetId: null, targetName: '', inputValue: '' });
                  }}
                  className={`px-4 py-2 text-white rounded text-xs font-bold cursor-pointer transition-colors ${
                    fbGenericActionModal.type === 'delete' 
                      ? 'bg-rose-600 hover:bg-rose-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 1. 选择已有地区组弹窗 (Image 1) */}
        {isFbExistingRegionModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans select-none animate-fade-in text-slate-800">
            <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-4xl flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-lg">
                <span className="text-sm font-extrabold text-slate-800">选择已有地区组</span>
                <button 
                  onClick={() => setIsFbExistingRegionModalOpen(false)} 
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Search Filters */}
              <div className="p-4 border-b border-slate-100 bg-white flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700 text-xs shrink-0">地区组:</span>
                  <input
                    type="text"
                    placeholder="搜索..."
                    value={fbTemplateSearch}
                    onChange={e => setFbTemplateSearch(e.target.value)}
                    className="border border-slate-200 rounded px-2.5 py-1.5 text-xs font-bold w-48 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700 text-xs shrink-0">标签:</span>
                  <select
                    value={fbTemplateTag}
                    onChange={e => setFbTemplateTag(e.target.value)}
                    className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs font-bold w-40 focus:outline-hidden cursor-pointer text-slate-800"
                  >
                    <option value="">请选择</option>
                    <option value="亚太">亚太</option>
                    <option value="欧美">欧美</option>
                    <option value="拉美">拉美</option>
                    <option value="全球">全球</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="flex-1 overflow-auto bg-slate-50/50 p-4 min-h-[300px]">
                <div className="bg-white border border-slate-200 rounded overflow-hidden shadow-2xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                        <th className="px-4 py-3 font-bold w-1/3">地区组名称</th>
                        <th className="px-4 py-3 font-bold">操作</th>
                        <th className="px-4 py-3 font-bold">标签</th>
                        <th className="px-4 py-3 font-bold">创建时间</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const filtered = fbRegionGroupTemplates.filter(tmpl => {
                          const matchesName = tmpl.name.toLowerCase().includes(fbTemplateSearch.toLowerCase());
                          const matchesTag = !fbTemplateTag || tmpl.tag === fbTemplateTag;
                          return matchesName && matchesTag;
                        });

                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan={4} className="text-center py-16 text-slate-400 font-bold bg-white">
                                <div className="flex flex-col items-center gap-2">
                                  <span className="text-3xl">📂</span>
                                  <span>暂无数据</span>
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        return filtered.map(tmpl => (
                          <tr 
                            key={tmpl.id}
                            onClick={() => setFbSelectedTemplateId(tmpl.id)}
                            className={`border-b border-slate-100 hover:bg-blue-50/30 transition-colors cursor-pointer ${
                              fbSelectedTemplateId === tmpl.id ? 'bg-blue-50/60 text-blue-700 font-semibold' : 'text-slate-700'
                            }`}
                          >
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  checked={fbSelectedTemplateId === tmpl.id}
                                  onChange={() => setFbSelectedTemplateId(tmpl.id)}
                                  className="text-blue-600 rounded-full cursor-pointer"
                                />
                                <span className="font-bold">{tmpl.name}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 font-normal pl-5">
                                包含: {tmpl.regions.join(', ')}
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFbRegionGroups(prev => prev.map(rg => rg.id === activeFbRegionGroupId ? {
                                    ...rg,
                                    selectedRegions: Array.from(new Set([...rg.selectedRegions, ...tmpl.regions]))
                                  } : rg));
                                  setIsFbExistingRegionChecked(true);
                                  setIsFbExistingRegionModalOpen(false);
                                }}
                                className="text-blue-600 hover:underline font-bold cursor-pointer"
                              >
                                使用
                              </button>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                {tmpl.tag}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 font-mono text-slate-400 text-[11px]">
                              {tmpl.createdAt}
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination Panel (matches the design of the first image) */}
              <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between bg-white text-xs font-bold text-slate-600">
                {(() => {
                  const filteredCount = fbRegionGroupTemplates.filter(tmpl => {
                    const matchesName = tmpl.name.toLowerCase().includes(fbTemplateSearch.toLowerCase());
                    const matchesTag = !fbTemplateTag || tmpl.tag === fbTemplateTag;
                    return matchesName && matchesTag;
                  }).length;
                  return (
                    <>
                      <span>共 {filteredCount} 条</span>
                      <div className="flex items-center gap-4">
                        <select className="bg-white border border-slate-200 rounded px-2 py-1 text-xs cursor-pointer focus:outline-hidden font-bold">
                          <option value="20">20条/页</option>
                          <option value="50">50条/页</option>
                        </select>
                        
                        <div className="flex items-center gap-1.5">
                          <button type="button" className="p-1 px-2 border border-slate-200 rounded bg-slate-50 text-slate-400 cursor-not-allowed text-[10px]">
                            &lt;
                          </button>
                          <span className="px-2.5 py-1 border border-blue-500 bg-blue-50 text-blue-600 rounded">
                            1
                          </span>
                          <button type="button" className="p-1 px-2 border border-slate-200 rounded bg-slate-50 text-slate-400 cursor-not-allowed text-[10px]">
                            &gt;
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span>前往</span>
                          <input
                            type="text"
                            defaultValue="1"
                            className="border border-slate-200 rounded text-center w-10 py-1 text-xs font-bold focus:outline-hidden"
                            readOnly
                          />
                          <span>页</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Footer buttons */}
              <div className="px-5 py-4 border-t border-slate-150 flex justify-end gap-3 bg-slate-50 rounded-b-lg">
                <button
                  type="button"
                  onClick={() => setIsFbExistingRegionModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded border border-slate-250 cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!fbSelectedTemplateId) {
                      alert('请先选择一个模板！');
                      return;
                    }
                    const tmpl = fbRegionGroupTemplates.find(t => t.id === fbSelectedTemplateId);
                    if (tmpl) {
                      setFbRegionGroups(prev => prev.map(rg => rg.id === activeFbRegionGroupId ? {
                        ...rg,
                        selectedRegions: Array.from(new Set([...rg.selectedRegions, ...tmpl.regions]))
                      } : rg));
                      setIsFbExistingRegionChecked(true);
                    }
                    setIsFbExistingRegionModalOpen(false);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded cursor-pointer transition-colors"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. 批量导入地区弹窗 */}
        {isFbBatchImportModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans select-none animate-fade-in text-slate-800">
            <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-lg flex flex-col">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-lg">
                <span className="text-sm font-extrabold text-slate-800">批量导入地区</span>
                <button onClick={() => setIsFbBatchImportModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
              </div>
              
              <div className="p-5 space-y-4 text-xs">
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-700 block">导入目标:</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                      <input 
                        type="radio" 
                        name="import_target"
                        checked={fbBatchImportTargetType === 'selectedRegions'} 
                        onChange={() => setFbBatchImportTargetType('selectedRegions')} 
                        className="text-blue-600 cursor-pointer"
                      />
                      <span>添加至 定向 地区</span>
                    </label>
                    <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                      <input 
                        type="radio" 
                        name="import_target"
                        checked={fbBatchImportTargetType === 'excludedRegions'} 
                        onChange={() => setFbBatchImportTargetType('excludedRegions')} 
                        className="text-blue-600 cursor-pointer"
                      />
                      <span>添加至 排除 地区</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-slate-700 block">输入地区名称:</span>
                  <span className="text-[10px] text-slate-400 block font-semibold leading-tight">
                    支持换行或半角逗号(,)分隔。例如: 美国, 加拿大, 英国 (支持自动匹配已有选项)
                  </span>
                  <textarea
                    value={fbBatchImportText}
                    onChange={e => setFbBatchImportText(e.target.value)}
                    placeholder="请输入地区名称..."
                    rows={6}
                    className="w-full bg-white border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:outline-hidden rounded p-3 font-mono text-xs text-slate-800 font-bold"
                  />
                </div>
              </div>

              <div className="px-5 py-4 border-t border-slate-150 flex justify-end gap-3 bg-slate-50 rounded-b-lg">
                <button
                  type="button"
                  onClick={() => setIsFbBatchImportModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded border border-slate-250 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!fbBatchImportText.trim()) {
                      alert('请输入地区名称！');
                      return;
                    }
                    
                    const inputs = fbBatchImportText
                      .split(/[\n,，]+/)
                      .map(s => s.trim())
                      .filter(Boolean);
                    
                    if (inputs.length === 0) {
                      alert('未解析到有效地区名称！');
                      return;
                    }

                    const knownRegions = [
                      'iTunes App Store 开放国家/地区 地区',
                      '东盟自由贸易区 地区',
                      'Tucson, AZ 市场',
                      'Fairbanks, AK 市场',
                      '美国',
                      '加拿大',
                      '英国',
                      '澳大利亚',
                      '新加坡',
                      '泰国',
                      '巴西',
                      '台湾地区',
                      '德国',
                      '法国',
                      '欧盟地区'
                    ];

                    const matchedToImport: string[] = [];
                    inputs.forEach(input => {
                      const matched = knownRegions.find(r => r.toLowerCase().includes(input.toLowerCase()));
                      if (matched) {
                        matchedToImport.push(matched);
                      } else {
                        matchedToImport.push(input);
                      }
                    });

                    setFbRegionGroups(prev => prev.map(rg => rg.id === activeFbRegionGroupId ? {
                      ...rg,
                      [fbBatchImportTargetType]: Array.from(new Set([...rg[fbBatchImportTargetType], ...matchedToImport]))
                    } : rg));

                    setIsFbBatchImportModalOpen(false);
                    alert(`成功导入 ${matchedToImport.length} 个地区！`);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded cursor-pointer"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. 批量设置地区组弹窗 */}
        {isFbBatchSettingsModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans select-none animate-fade-in text-slate-800">
            <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md flex flex-col">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-lg">
                <span className="text-sm font-extrabold text-slate-800">批量设置地区组参数</span>
                <button onClick={() => setIsFbBatchSettingsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
              </div>
              
              <div className="p-5 space-y-4 text-xs">
                <span className="text-[11px] text-slate-500 block font-bold leading-tight bg-blue-50 border border-blue-100 text-blue-700 p-2.5 rounded">
                  提示: 以下设置将一次性应用到<strong>所有地区组 ({fbRegionGroups.length}个)</strong>。
                </span>

                <div className="space-y-1.5">
                  <span className="font-bold text-slate-700 text-xs block">受众定向选项:</span>
                  <select
                    value={fbBatchSettingsTargetOption}
                    onChange={e => setFbBatchSettingsTargetOption(e.target.value)}
                    className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs font-bold w-full focus:outline-hidden text-slate-800"
                  >
                    <option value="此位置或对其感兴趣的用户(推荐)">此位置或对其感兴趣的用户(推荐)</option>
                    <option value="居住在或最近在此位置的用户">居住在或最近在此位置的用户</option>
                    <option value="居住在此位置的用户">居住在此位置的用户</option>
                    <option value="最近在此位置的用户">最近在此位置的用户</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-slate-700 text-xs block">语言设置:</span>
                  <select
                    value={fbBatchSettingsLanguageOption}
                    onChange={e => setFbBatchSettingsLanguageOption(e.target.value as 'all' | 'specified')}
                    className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs font-bold w-full focus:outline-hidden text-slate-800"
                  >
                    <option value="all">所有语言</option>
                    <option value="specified">特定语言 (如：英语、中文等)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-slate-700 text-xs block">分类标签:</span>
                  <input
                    type="text"
                    placeholder="请输入标签, 例如: 亚太区"
                    value={fbBatchSettingsTag}
                    onChange={e => setFbBatchSettingsTag(e.target.value)}
                    className="border border-slate-200 rounded px-2.5 py-1.5 text-xs font-bold w-full focus:outline-hidden focus:border-blue-500 text-slate-800 animate-none"
                  />
                </div>
              </div>

              <div className="px-5 py-4 border-t border-slate-150 flex justify-end gap-3 bg-slate-50 rounded-b-lg">
                <button
                  type="button"
                  onClick={() => setIsFbBatchSettingsModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded border border-slate-250 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFbRegionGroups(prev => prev.map(rg => ({
                      ...rg,
                      targetOption: fbBatchSettingsTargetOption,
                      languageOption: fbBatchSettingsLanguageOption,
                      selectedTag: fbBatchSettingsTag || rg.selectedTag
                    })));
                    setIsFbBatchSettingsModalOpen(false);
                    alert('已成功批量应用至所有地区组！');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded cursor-pointer"
                >
                  应用到所有地区组
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 绑定规则弹窗 */}
        {isFbBindingRulesModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-55 p-4 font-sans select-none animate-fade-in text-slate-800">
            <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-2xl flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50 rounded-t-lg">
                <span className="text-sm font-extrabold text-slate-800">绑定规则</span>
                <button 
                  onClick={() => setIsFbBindingRulesModalOpen(false)} 
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 text-xs flex-1 overflow-y-auto">
                {/* Row 1: 绑定对象 */}
                <div className="flex items-center gap-6">
                  <span className="font-bold text-slate-500 w-16">绑定对象</span>
                  <div className="flex items-center border border-slate-200 rounded-md bg-slate-100/50 p-0.5">
                    {[
                      { id: 'account', label: '广告账户' },
                      { id: 'region', label: '地区' },
                      { id: 'targeting', label: '定向' }
                    ].map(tab => {
                      const isActive = fbBindingRulesActiveTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setFbBindingRulesActiveTab(tab.id as any)}
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
                  <span className="font-bold text-slate-500 w-16">绑定规则</span>
                  <div className="relative">
                    <select
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val) return;
                        if (checkedRowIds.length === 0) {
                          alert('请先勾选需要批量设置的行！');
                          e.target.value = '';
                          return;
                        }
                        setTempBindings(prev => {
                          const next = { ...prev };
                          checkedRowIds.forEach(id => {
                            next[id] = val;
                          });
                          return next;
                        });
                        alert(`已成功将所选的 ${checkedRowIds.length} 个项目批量绑定！`);
                        e.target.value = '';
                      }}
                      className="bg-white border border-slate-200 hover:border-slate-300 rounded px-3 py-1.5 text-xs font-bold text-slate-600 cursor-pointer focus:outline-hidden"
                    >
                      <option value="">批量设置</option>
                      <option value="all">全部</option>
                      {fbBindingRulesActiveTab === 'region' && fbRegionGroups.map(rg => (
                        <option key={rg.id} value={rg.id}>{rg.name}</option>
                      ))}
                      {fbBindingRulesActiveTab === 'targeting' && fbTargetingPackages.map(tp => (
                        <option key={tp.id} value={tp.id}>{tp.name}</option>
                      ))}
                      {fbBindingRulesActiveTab === 'account' && (
                        <>
                          <option value="account_1">广告账户1</option>
                          <option value="account_2">广告账户2</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* The Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-slate-600 font-bold">
                        <th className="px-4 py-3 w-10">
                          <input
                            type="checkbox"
                            checked={
                              fbBindingRulesModule === 'budget' 
                                ? checkedRowIds.length === fbBudgets.length && fbBudgets.length > 0
                                : (fbBindingRulesModule === 'targeting' 
                                    ? checkedRowIds.length === fbTargetingPackages.length && fbTargetingPackages.length > 0
                                    : (fbBindingRulesModule === 'creative'
                                        ? checkedRowIds.length === fbCreativeGroups.length && fbCreativeGroups.length > 0
                                        : checkedRowIds.length === fbRegionGroups.length && fbRegionGroups.length > 0))
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                const ids = fbBindingRulesModule === 'budget' 
                                  ? fbBudgets.map(b => b.id) 
                                  : (fbBindingRulesModule === 'targeting' 
                                      ? fbTargetingPackages.map(tp => tp.id) 
                                      : (fbBindingRulesModule === 'creative' ? fbCreativeGroups.map(cg => cg.id) : fbRegionGroups.map(rg => rg.id)));
                                setCheckedRowIds(ids);
                              } else {
                                setCheckedRowIds([]);
                              }
                            }}
                            className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </th>
                        <th className="px-4 py-3 font-extrabold">
                          {fbBindingRulesModule === 'budget' && '出价和预算'}
                          {fbBindingRulesModule === 'targeting' && '定向包'}
                          {fbBindingRulesModule === 'region' && '地区组'}
                          {fbBindingRulesModule === 'creative' && '创意组'}
                        </th>
                        <th className="px-4 py-3 font-extrabold w-1/2">绑定对象</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {fbBindingRulesModule === 'budget' && fbBudgets.map(b => (
                        <tr key={b.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={checkedRowIds.includes(b.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCheckedRowIds(prev => [...prev, b.id]);
                                } else {
                                  setCheckedRowIds(prev => prev.filter(id => id !== b.id));
                                }
                              }}
                              className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-3 font-bold">{b.name}</td>
                          <td className="px-4 py-3">
                            <select
                              value={tempBindings[b.id] || 'all'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTempBindings(prev => ({ ...prev, [b.id]: val }));
                              }}
                              className="bg-white border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:outline-hidden rounded px-2.5 py-1.5 text-xs font-bold w-full max-w-xs cursor-pointer text-slate-700"
                            >
                              <option value="all">全部</option>
                              {fbBindingRulesActiveTab === 'region' && fbRegionGroups.map(rg => (
                                <option key={rg.id} value={rg.id}>{rg.name}</option>
                              ))}
                              {fbBindingRulesActiveTab === 'targeting' && fbTargetingPackages.map(tp => (
                                <option key={tp.id} value={tp.id}>{tp.name}</option>
                              ))}
                              {fbBindingRulesActiveTab === 'account' && (
                                <>
                                  <option value="account_1">广告账户1</option>
                                  <option value="account_2">广告账户2</option>
                                </>
                              )}
                            </select>
                          </td>
                        </tr>
                      ))}

                      {fbBindingRulesModule === 'targeting' && fbTargetingPackages.map(tp => (
                        <tr key={tp.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={checkedRowIds.includes(tp.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCheckedRowIds(prev => [...prev, tp.id]);
                                } else {
                                  setCheckedRowIds(prev => prev.filter(id => id !== tp.id));
                                }
                              }}
                              className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-3 font-bold">{tp.name}</td>
                          <td className="px-4 py-3">
                            <select
                              value={tempBindings[tp.id] || 'all'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTempBindings(prev => ({ ...prev, [tp.id]: val }));
                              }}
                              className="bg-white border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:outline-hidden rounded px-2.5 py-1.5 text-xs font-bold w-full max-w-xs cursor-pointer text-slate-700"
                            >
                              <option value="all">全部</option>
                              {fbBindingRulesActiveTab === 'region' && fbRegionGroups.map(rg => (
                                <option key={rg.id} value={rg.id}>{rg.name}</option>
                              ))}
                              {fbBindingRulesActiveTab === 'targeting' && fbTargetingPackages.map(tp => (
                                <option key={tp.id} value={tp.id}>{tp.name}</option>
                              ))}
                              {fbBindingRulesActiveTab === 'account' && (
                                <>
                                  <option value="account_1">广告账户1</option>
                                  <option value="account_2">广告账户2</option>
                                </>
                              )}
                            </select>
                          </td>
                        </tr>
                      ))}

                      {fbBindingRulesModule === 'region' && fbRegionGroups.map(rg => (
                        <tr key={rg.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={checkedRowIds.includes(rg.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCheckedRowIds(prev => [...prev, rg.id]);
                                } else {
                                  setCheckedRowIds(prev => prev.filter(id => id !== rg.id));
                                }
                              }}
                              className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-3 font-bold">{rg.name}</td>
                          <td className="px-4 py-3">
                            <select
                              value={tempBindings[rg.id] || 'all'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTempBindings(prev => ({ ...prev, [rg.id]: val }));
                              }}
                              className="bg-white border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:outline-hidden rounded px-2.5 py-1.5 text-xs font-bold w-full max-w-xs cursor-pointer text-slate-700"
                            >
                              <option value="all">全部</option>
                              {fbBindingRulesActiveTab === 'region' && fbRegionGroups.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                              ))}
                              {fbBindingRulesActiveTab === 'targeting' && fbTargetingPackages.map(tp => (
                                <option key={tp.id} value={tp.id}>{tp.name}</option>
                              ))}
                              {fbBindingRulesActiveTab === 'account' && (
                                <>
                                  <option value="account_1">广告账户1</option>
                                  <option value="account_2">广告账户2</option>
                                </>
                              )}
                            </select>
                          </td>
                        </tr>
                      ))}

                      {fbBindingRulesModule === 'creative' && fbCreativeGroups.map(cg => (
                        <tr key={cg.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={checkedRowIds.includes(cg.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCheckedRowIds(prev => [...prev, cg.id]);
                                } else {
                                  setCheckedRowIds(prev => prev.filter(id => id !== cg.id));
                                }
                              }}
                              className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-3 font-bold">{cg.name}</td>
                          <td className="px-4 py-3">
                            <select
                              value={tempBindings[cg.id] || 'all'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTempBindings(prev => ({ ...prev, [cg.id]: val }));
                              }}
                              className="bg-white border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:outline-hidden rounded px-2.5 py-1.5 text-xs font-bold w-full max-w-xs cursor-pointer text-slate-700"
                            >
                              <option value="all">全部</option>
                              {fbBindingRulesActiveTab === 'region' && fbRegionGroups.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                              ))}
                              {fbBindingRulesActiveTab === 'targeting' && fbTargetingPackages.map(tp => (
                                <option key={tp.id} value={tp.id}>{tp.name}</option>
                              ))}
                              {fbBindingRulesActiveTab === 'account' && (
                                <>
                                  <option value="account_1">广告账户1</option>
                                  <option value="account_2">广告账户2</option>
                                </>
                              )}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-slate-150 flex justify-end gap-3 bg-slate-50 rounded-b-lg">
                <button
                  type="button"
                  onClick={() => setIsFbBindingRulesModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded border border-slate-250 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (fbBindingRulesModule === 'budget') {
                      setFbBudgetBindings(tempBindings);
                    } else if (fbBindingRulesModule === 'targeting') {
                      setFbTargetingBindings(tempBindings);
                    } else if (fbBindingRulesModule === 'region') {
                      setFbRegionBindings(tempBindings);
                    } else if (fbBindingRulesModule === 'creative') {
                      setFbCreativeBindings(tempBindings);
                    }
                    setIsFbBindingRulesModalOpen(false);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded cursor-pointer"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. 版位 */}
      <div ref={steps[5].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-300 transition-all font-sans text-xs">
        <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-blue-600 rounded-2xs inline-block"></span>
            <span className="text-sm font-bold text-slate-800">版位 (Placements)</span>
          </div>
          <span className="text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-sm">✓ 已配置</span>
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">版位设置</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFbPlacementSetting('adv_plus')}
                className={`px-3.5 py-1.5 border font-bold rounded text-xs cursor-pointer ${
                  fbPlacementSetting === 'adv_plus' ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs' : 'border-slate-250 bg-white text-slate-600'
                }`}
              >
                进阶赋能型版位
              </button>
              <button
                type="button"
                onClick={() => setFbPlacementSetting('manual')}
                className={`px-3.5 py-1.5 border font-bold rounded text-xs cursor-pointer ${
                  fbPlacementSetting === 'manual' ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs' : 'border-slate-250 bg-white text-slate-600'
                }`}
              >
                手动版位
              </button>
            </div>
          </div>

          {fbPlacementSetting === 'adv_plus' && (
            <div className="text-slate-400 pl-[140px] md:pl-[160px] pb-2 text-[11px] font-semibold">
              已启用进阶赋能型版位（推荐）。系统将自动分配广告预算至成效更佳的版位。
            </div>
          )}

          {fbPlacementSetting === 'manual' && (
            <div className="space-y-4 animate-fade-in pl-[140px] md:pl-[160px]">
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  平台和版位 <span className="text-rose-500">*</span>
                </span>
                
                {/* Platform Selection Row */}
                <div className="flex gap-2 flex-wrap pb-2 border-b border-slate-100">
                  {['Facebook', 'Messenger', 'Instagram', 'Audience Network', 'Threads'].map(p => {
                    const id = p.toLowerCase().replace(' ', '_');
                    const isChecked = fbPlatformsSelected.includes(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setFbPlatformsSelected(prev => prev.filter(x => x !== id));
                            // Also uncheck sub-placements of this platform
                            const subs = ALL_SUB_PLACEMENTS.filter(sp => sp.platform === id).map(sp => sp.id);
                            setFbPlacementsChecked(prev => prev.filter(x => !subs.includes(x)));
                          } else {
                            setFbPlatformsSelected(prev => [...prev, id]);
                            // Also check sub-placements of this platform by default
                            const subs = ALL_SUB_PLACEMENTS.filter(sp => sp.platform === id).map(sp => sp.id);
                            setFbPlacementsChecked(prev => Array.from(new Set([...prev, ...subs])));
                          }
                        }}
                        className={`px-3 py-1 border rounded font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1 ${
                          isChecked 
                            ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-3xs' 
                            : 'border-slate-200 bg-white text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={isChecked} 
                          readOnly 
                          className="rounded text-blue-600 w-3 h-3 mr-1 pointer-events-none" 
                        />
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dual-Panel Selector */}
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 border border-slate-200 rounded overflow-hidden max-w-4xl bg-slate-50/20">
                {/* Left Categories List */}
                <div className="border-r border-slate-200 bg-slate-50/50 p-2.5 space-y-1">
                  {PLACEMENT_CATEGORIES.map(cat => {
                    const categorySubs = ALL_SUB_PLACEMENTS.filter(sp => sp.category === cat.id);
                    const checkedSubsInCategory = categorySubs.filter(sp => fbPlacementsChecked.includes(sp.id));
                    const isAllChecked = categorySubs.length > 0 && checkedSubsInCategory.length === categorySubs.length;
                    const isPartiallyChecked = checkedSubsInCategory.length > 0 && checkedSubsInCategory.length < categorySubs.length;

                    return (
                      <div
                        key={cat.id}
                        onClick={() => setFbActivePlacementCategory(cat.id)}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all ${
                          fbActivePlacementCategory === cat.id 
                            ? 'bg-blue-50/50 text-blue-600 font-bold border-l-2 border-blue-600 pl-1.5' 
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isAllChecked}
                            ref={el => {
                              if (el) el.indeterminate = isPartiallyChecked;
                            }}
                            onChange={e => {
                              e.stopPropagation();
                              const subIds = categorySubs.map(sp => sp.id);
                              if (isAllChecked) {
                                setFbPlacementsChecked(prev => prev.filter(x => !subIds.includes(x)));
                              } else {
                                setFbPlacementsChecked(prev => Array.from(new Set([...prev, ...subIds])));
                              }
                            }}
                            className="rounded text-blue-600 w-3.5 h-3.5 cursor-pointer"
                          />
                          <span className="text-[11.5px] font-bold">{cat.label}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    );
                  })}
                </div>

                {/* Right Specific Placements List */}
                <div className="p-4 bg-white space-y-3 max-h-[300px] overflow-y-auto">
                  <div className="text-[11px] text-slate-400 font-bold pb-1.5 border-b border-slate-100">
                    {PLACEMENT_CATEGORIES.find(c => c.id === fbActivePlacementCategory)?.label} 的具体版位
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ALL_SUB_PLACEMENTS.filter(sp => sp.category === fbActivePlacementCategory).map(sp => {
                      const isPlatformActive = fbPlatformsSelected.includes(sp.platform);
                      const isChecked = fbPlacementsChecked.includes(sp.id) && isPlatformActive;

                      return (
                        <label 
                          key={sp.id} 
                          className={`flex items-center gap-2.5 p-2 rounded border border-slate-100 transition-all font-semibold ${
                            !isPlatformActive 
                              ? 'opacity-40 bg-slate-50 cursor-not-allowed text-slate-400' 
                              : 'hover:bg-slate-50/50 cursor-pointer text-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            disabled={!isPlatformActive}
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setFbPlacementsChecked(prev => prev.filter(x => x !== sp.id));
                              } else {
                                setFbPlacementsChecked(prev => [...prev, sp.id]);
                              }
                            }}
                            className="rounded text-blue-600 w-3.5 h-3.5 cursor-pointer"
                          />
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold">{sp.label}</span>
                            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">
                              {sp.platform.replace('_', ' ')}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Placement Counts Display */}
              <div className="flex items-center gap-2 text-slate-500 font-bold text-[11px] bg-slate-50 p-2 border border-slate-200 rounded max-w-sm">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>已选择 <span className="text-blue-600">{fbPlacementsChecked.filter(id => {
                  const sp = ALL_SUB_PLACEMENTS.find(x => x.id === id);
                  return sp && fbPlatformsSelected.includes(sp.platform);
                }).length}</span> 个版位</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6. 定向包 */}
      <div ref={steps[6].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-300 transition-all font-sans text-xs">
        {/* Targeting Packages Tabs Row to match Image 1 */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-2 rounded mb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {fbTargetingPackages.map((tp, idx) => (
              <div
                key={tp.id}
                className={`relative flex items-center gap-1 px-3 py-1.5 rounded border text-xs font-bold transition-all cursor-pointer ${
                  activeFbTargetingPackageId === tp.id 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs' 
                    : 'bg-white border-slate-200 hover:border-slate-350 text-slate-600 hover:text-slate-800'
                }`}
                onClick={() => setActiveFbTargetingPackageId(tp.id)}
              >
                <span>{tp.name}</span>
                <span 
                  className="text-[11px] opacity-70 hover:opacity-100 pl-1 font-bold cursor-pointer inline-block w-4 h-4 text-center leading-4 hover:bg-black/10 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFbTargetingPackageId(tp.id);
                    const rect = e.currentTarget.getBoundingClientRect();
                    setFbTargetingPackageMenuCoords({
                      top: rect.bottom + window.scrollY,
                      left: rect.left + window.scrollX
                    });
                    setFbTargetingPackageMenuOpenId(fbTargetingPackageMenuOpenId === tp.id ? null : tp.id);
                  }}
                  title="定向包操作"
                >
                  ⋮
                </span>
              </div>
            ))}
            
            <button
              type="button"
              onClick={handleAddTargetingPackage}
              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-[10.5px] rounded border border-blue-200 flex items-center gap-1 cursor-pointer transition-colors shrink-0"
            >
              <span>+ 新增定向包</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-bold pr-1">
            {fbTargetingPackages.length} / 30
          </div>
        </div>

        {/* Global/Fixed Dropdown Menu for Targeting Packages */}
        {fbTargetingPackageMenuOpenId && fbTargetingPackageMenuCoords && (
          <>
            <div 
              className="fixed inset-0 z-45 bg-transparent cursor-default" 
              onClick={(e) => {
                e.stopPropagation();
                setFbTargetingPackageMenuOpenId(null);
                setFbTargetingPackageMenuCoords(null);
              }}
            ></div>
            <div 
              className="fixed bg-white border border-slate-200 shadow-md rounded py-1 w-32 z-50 text-slate-700 text-xs font-medium animate-fade-in select-none"
              style={{
                top: `${fbTargetingPackageMenuCoords.top - window.scrollY}px`,
                left: `${fbTargetingPackageMenuCoords.left - window.scrollX}px`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  handleDuplicateTargetingPackage(fbTargetingPackageMenuOpenId);
                  setFbTargetingPackageMenuOpenId(null);
                  setFbTargetingPackageMenuCoords(null);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs flex items-center gap-1.5 font-semibold text-slate-700 transition-colors"
              >
                <span>复制</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetPkg = fbTargetingPackages.find(x => x.id === fbTargetingPackageMenuOpenId);
                  if (targetPkg) {
                    setFbGenericActionModal({
                      module: 'targeting_package',
                      type: 'batch_duplicate',
                      targetId: fbTargetingPackageMenuOpenId,
                      targetName: targetPkg.name,
                      inputValue: '3'
                    });
                  }
                  setFbTargetingPackageMenuOpenId(null);
                  setFbTargetingPackageMenuCoords(null);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs flex items-center gap-1.5 font-semibold text-slate-700 transition-colors"
              >
                <span>批量复制</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetPkg = fbTargetingPackages.find(x => x.id === fbTargetingPackageMenuOpenId);
                  if (targetPkg) {
                    setFbGenericActionModal({
                      module: 'targeting_package',
                      type: 'rename',
                      targetId: fbTargetingPackageMenuOpenId,
                      targetName: targetPkg.name,
                      inputValue: targetPkg.name
                    });
                  }
                  setFbTargetingPackageMenuOpenId(null);
                  setFbTargetingPackageMenuCoords(null);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs flex items-center gap-1.5 font-semibold text-slate-700 transition-colors"
              >
                <span>重命名</span>
              </button>
              <div className="border-t border-slate-100 my-1"></div>
              <button
                type="button"
                onClick={() => {
                  const targetPkg = fbTargetingPackages.find(x => x.id === fbTargetingPackageMenuOpenId);
                  if (targetPkg) {
                    setFbGenericActionModal({
                      module: 'targeting_package',
                      type: 'delete',
                      targetId: fbTargetingPackageMenuOpenId,
                      targetName: targetPkg.name,
                      inputValue: ''
                    });
                  }
                  setFbTargetingPackageMenuOpenId(null);
                  setFbTargetingPackageMenuCoords(null);
                }}
                className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 cursor-pointer text-xs flex items-center gap-1.5 font-bold transition-colors"
              >
                <span>删除</span>
              </button>
            </div>
          </>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">选择已有定向包</span>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isFbExistingTargetingChecked}
                  onChange={e => setIsFbExistingTargetingChecked(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>使用已保存的定向包</span>
              </label>
            </div>
          </div>

          {/* 绑定对象 */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">绑定对象 <span className="text-rose-500">*</span></span>
            <div 
              onClick={() => {
                setFbBindingRulesModule('targeting');
                setFbBindingRulesActiveTab('region');
                setIsFbBindingRulesModalOpen(true);
              }}
              className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-blue-600 cursor-pointer transition-colors"
            >
              <span>{getBoundLabel(activeFbTargetingPackageId, 'targeting')}</span>
              <span className="text-slate-400 hover:text-slate-600 cursor-pointer">✏️</span>
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">进阶赋能型受众</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFbAdvantageAudienceEnabled(!fbAdvantageAudienceEnabled)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${fbAdvantageAudienceEnabled ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${fbAdvantageAudienceEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </button>
              <span className="font-semibold text-slate-400">开启后广告覆盖更广泛的目标受众</span>
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start">
            <span className="font-bold text-slate-700 pt-2">自定义受众 <span className="text-rose-500">*</span></span>
            <div className="space-y-3 w-full">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFbTargetingPackages(prev => prev.map(tp => tp.id === activeFbTargetingPackageId ? { ...tp, customAudienceType: 'all' } : tp));
                  }}
                  className={`px-3.5 py-1.5 border font-bold rounded text-xs cursor-pointer ${
                    currentTargetingPackage.customAudienceType === 'all' ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs' : 'border-slate-205 bg-white text-slate-600'
                  }`}
                >
                  不限
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFbTargetingPackages(prev => prev.map(tp => tp.id === activeFbTargetingPackageId ? { ...tp, customAudienceType: 'custom' } : tp));
                  }}
                  className={`px-3.5 py-1.5 border font-bold rounded text-xs cursor-pointer ${
                    currentTargetingPackage.customAudienceType === 'custom' ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs' : 'border-slate-205 bg-white text-slate-600'
                  }`}
                >
                  自定义
                </button>
              </div>

              {/* Custom Audience Dual Panel Selector */}
              {currentTargetingPackage.customAudienceType === 'custom' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-200 rounded max-w-3xl overflow-hidden bg-white animate-fade-in">
                  {/* Left panel: List search and tabs */}
                  <div className="border-r border-slate-200 p-3 space-y-3 bg-slate-50/20">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        placeholder="搜索..."
                        value={customAudienceLeftSearch}
                        onChange={e => setCustomAudienceLeftSearch(e.target.value)}
                        className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded pl-8 pr-3 py-1.5 text-[11px] font-bold focus:outline-hidden focus:border-blue-500"
                      />
                    </div>

                    {/* Tabs for left panel */}
                    <div className="flex gap-1.5 border-b border-slate-100 pb-1 flex-wrap">
                      {[
                        { id: 'all', label: '全部受众' },
                        { id: 'lookalike', label: '类似受众' },
                        { id: 'custom_aud', label: '自定义受众' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setCustomAudienceLeftTab(tab.id as any)}
                          className={`px-2 py-1 text-[11px] font-bold border-b-2 transition-all cursor-pointer ${
                            customAudienceLeftTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Left list table structure */}
                    <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
                      {(() => {
                        const filtered = MOCK_CUSTOM_AUDIENCES.filter(item => {
                          const matchSearch = item.name.toLowerCase().includes(customAudienceLeftSearch.toLowerCase());
                          if (!matchSearch) return false;
                          if (customAudienceLeftTab === 'all') return true;
                          return item.type === customAudienceLeftTab;
                        });

                        if (filtered.length === 0) {
                          return <div className="text-slate-400 font-bold text-center py-8">暂无数据</div>;
                        }

                        return filtered.map(item => {
                          const targetList = currentTargetingPackage.customAudiencesTarget || [];
                          const excludeList = currentTargetingPackage.customAudiencesExclude || [];
                          const isTargeted = targetList.includes(item.id);
                          const isExcluded = excludeList.includes(item.id);

                          return (
                            <div key={item.id} className="flex items-center justify-between p-1.5 hover:bg-slate-50 rounded border border-slate-100 bg-white">
                              <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-slate-700 text-[11px]">{item.name}</span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase">
                                  {item.type === 'lookalike' ? '类似受众' : '自定义受众'}
                                </span>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    // add to target
                                    setFbTargetingPackages(prev => prev.map(tp => {
                                      if (tp.id === activeFbTargetingPackageId) {
                                        const t = tp.customAudiencesTarget || [];
                                        const ex = tp.customAudiencesExclude || [];
                                        return {
                                          ...tp,
                                          customAudiencesTarget: t.includes(item.id) ? t : [...t, item.id],
                                          customAudiencesExclude: ex.filter(x => x !== item.id)
                                        };
                                      }
                                      return tp;
                                    }));
                                  }}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                                    isTargeted ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-white hover:bg-emerald-50 text-slate-600 border-slate-200'
                                  }`}
                                >
                                  {isTargeted ? '已定向' : '定向'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    // add to exclude
                                    setFbTargetingPackages(prev => prev.map(tp => {
                                      if (tp.id === activeFbTargetingPackageId) {
                                        const t = tp.customAudiencesTarget || [];
                                        const ex = tp.customAudiencesExclude || [];
                                        return {
                                          ...tp,
                                          customAudiencesExclude: ex.includes(item.id) ? ex : [...ex, item.id],
                                          customAudiencesTarget: t.filter(x => x !== item.id)
                                        };
                                      }
                                      return tp;
                                    }));
                                  }}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                                    isExcluded ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-white hover:bg-rose-50 text-slate-600 border-slate-200'
                                  }`}
                                >
                                  {isExcluded ? '已排除' : '排除'}
                                </button>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* Right panel: Selected items with clear */}
                  <div className="p-3 space-y-3 bg-slate-50/10">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="font-bold text-slate-700 text-[11px]">已选</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFbTargetingPackages(prev => prev.map(tp => {
                            if (tp.id === activeFbTargetingPackageId) {
                              return { ...tp, customAudiencesTarget: [], customAudiencesExclude: [] };
                            }
                            return tp;
                          }));
                        }}
                        className="text-blue-600 hover:text-blue-800 font-bold text-[10px] cursor-pointer"
                      >
                        清除
                      </button>
                    </div>

                    {/* Right Panel Tabs */}
                    <div className="flex gap-2">
                      {[
                        { id: 'target', label: `定向 (${currentTargetingPackage.customAudiencesTarget?.length || 0})` },
                        { id: 'exclude', label: `排除 (${currentTargetingPackage.customAudiencesExclude?.length || 0})` }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setCustomAudienceRightTab(tab.id as any)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                            customAudienceRightTab === tab.id
                              ? 'bg-blue-600 text-white border-transparent'
                              : 'bg-white text-slate-500 border-slate-200'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Right Panel List */}
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                      {(() => {
                        const targetList = currentTargetingPackage.customAudiencesTarget || [];
                        const excludeList = currentTargetingPackage.customAudiencesExclude || [];
                        const activeList = customAudienceRightTab === 'target' ? targetList : excludeList;

                        if (activeList.length === 0) {
                          return <div className="text-slate-400 font-bold text-center py-8">暂无已选受众</div>;
                        }

                        return activeList.map(id => {
                          const item = MOCK_CUSTOM_AUDIENCES.find(x => x.id === id);
                          if (!item) return null;

                          return (
                            <div key={id} className="flex items-center justify-between p-1.5 rounded border border-slate-100 bg-white">
                              <span className="font-bold text-slate-700 text-[11px]">{item.name}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setFbTargetingPackages(prev => prev.map(tp => {
                                    if (tp.id === activeFbTargetingPackageId) {
                                      const t = tp.customAudiencesTarget || [];
                                      const ex = tp.customAudiencesExclude || [];
                                      return {
                                        ...tp,
                                        customAudiencesTarget: t.filter(x => x !== id),
                                        customAudiencesExclude: ex.filter(x => x !== id)
                                      };
                                    }
                                    return tp;
                                  }));
                                }}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Conditional Rendering of Age / Minimum Age limit & Age Suggestion */}
          {fbAdvantageAudienceEnabled ? (
            <>
              {/* Checked State (Image 5): 最低年龄限制 and 年龄建议 */}
              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center animate-fade-in">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  最低年龄限制 <span className="text-rose-500">*</span>
                </span>
                <select
                  value={currentTargetingPackage.minAge || '18'}
                  onChange={e => {
                    const val = e.target.value;
                    setFbTargetingPackages(prev => prev.map(tp => tp.id === activeFbTargetingPackageId ? { ...tp, minAge: val } : tp));
                  }}
                  className="bg-white border border-slate-250 rounded px-2.5 py-1.5 text-xs font-bold w-24 cursor-pointer focus:outline-hidden"
                >
                  {Array.from({ length: 48 }, (_, i) => 18 + i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center animate-fade-in">
                <span className="font-bold text-slate-700">年龄建议</span>
                <div className="flex items-center gap-2">
                  <select
                    value={currentTargetingPackage.ageMinVal}
                    onChange={e => {
                      const val = e.target.value;
                      setFbTargetingPackages(prev => prev.map(tp => tp.id === activeFbTargetingPackageId ? { ...tp, ageMinVal: val } : tp));
                    }}
                    className="bg-white border border-slate-250 rounded px-2.5 py-1.5 text-xs font-bold w-20 cursor-pointer"
                  >
                    {Array.from({ length: 50 }, (_, i) => 18 + i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <span className="font-bold text-slate-400">至</span>
                  <select
                    value={currentTargetingPackage.ageMaxVal}
                    onChange={e => {
                      const val = e.target.value;
                      setFbTargetingPackages(prev => prev.map(tp => tp.id === activeFbTargetingPackageId ? { ...tp, ageMaxVal: val } : tp));
                    }}
                    className="bg-white border border-slate-250 rounded px-2.5 py-1.5 text-xs font-bold w-20 cursor-pointer"
                  >
                    {Array.from({ length: 50 }, (_, i) => 18 + i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                    <option value="65+">65+</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            /* Unchecked State (Image 4): 年龄 only */
            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center animate-fade-in">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                年龄 <span className="text-rose-500">*</span>
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={currentTargetingPackage.ageMinVal}
                  onChange={e => {
                    const val = e.target.value;
                    setFbTargetingPackages(prev => prev.map(tp => tp.id === activeFbTargetingPackageId ? { ...tp, ageMinVal: val } : tp));
                  }}
                  className="bg-white border border-slate-250 rounded px-2.5 py-1.5 text-xs font-bold w-20 cursor-pointer"
                >
                  {Array.from({ length: 50 }, (_, i) => 18 + i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <span className="font-bold text-slate-400">至</span>
                <select
                  value={currentTargetingPackage.ageMaxVal}
                  onChange={e => {
                    const val = e.target.value;
                    setFbTargetingPackages(prev => prev.map(tp => tp.id === activeFbTargetingPackageId ? { ...tp, ageMaxVal: val } : tp));
                  }}
                  className="bg-white border border-slate-250 rounded px-2.5 py-1.5 text-xs font-bold w-20 cursor-pointer"
                >
                  {Array.from({ length: 50 }, (_, i) => 18 + i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                  <option value="65+">65+</option>
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">性别</span>
            <div className="flex gap-2">
              {[
                { id: 'all', label: '不限' },
                { id: 'male', label: '男性' },
                { id: 'female', label: '女性' }
              ].map(gen => (
                <button
                  key={gen.id}
                  type="button"
                  onClick={() => {
                    setFbTargetingPackages(prev => prev.map(tp => tp.id === activeFbTargetingPackageId ? { ...tp, gender: gen.id as any } : tp));
                  }}
                  className={`px-3 py-1 border font-bold rounded-sm ${
                    currentTargetingPackage.gender === gen.id ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  {gen.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">细分定位</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setFbTargetingPackages(prev => prev.map(tp => tp.id === activeFbTargetingPackageId ? { ...tp, detailedTargeting: 'all' } : tp));
                }}
                className={`px-3 py-1 border font-bold rounded-sm ${
                  currentTargetingPackage.detailedTargeting === 'all' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                不限
              </button>
              <button
                type="button"
                onClick={() => {
                  setFbTargetingPackages(prev => prev.map(tp => tp.id === activeFbTargetingPackageId ? { ...tp, detailedTargeting: 'custom' } : tp));
                }}
                className={`px-3 py-1 border font-bold rounded-sm ${
                  currentTargetingPackage.detailedTargeting === 'custom' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                自定义
              </button>
            </div>
          </div>

          {/* Detailed Targeting Search Field */}
          {currentTargetingPackage.detailedTargeting === 'custom' && (
            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center animate-fade-in pl-[140px] md:pl-[160px]">
              <div className="relative max-w-md w-full">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="搜索细分定位兴趣、人口统计或行为..."
                  className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded pl-8 pr-3 py-1.5 text-xs font-bold focus:outline-hidden"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">语言</span>
            <select
              className="bg-white border border-slate-250 rounded px-3 py-2 text-xs font-bold w-48 focus:outline-hidden"
            >
              <option value="all">不限语言 (All Languages)</option>
              <option value="zh">中文简体/繁体 (Chinese)</option>
              <option value="en">英语 (English)</option>
              <option value="ja">日语 (Japanese)</option>
            </select>
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              包含的设备 <span className="text-rose-500">*</span>
            </span>
            <select
              className="bg-white border border-slate-250 rounded px-3 py-2 text-xs font-bold w-48 focus:outline-hidden"
            >
              <option value="all">已选 3 个 (iPhone, Android, Tablet)</option>
              <option value="mobile">仅手机 (Mobile only)</option>
              <option value="desktop">仅电脑 (Desktop only)</option>
            </select>
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">排除的设备</span>
            <select
              className="bg-white border border-slate-250 rounded px-3 py-2 text-xs font-bold w-48 focus:outline-hidden"
            >
              <option value="none">请选择</option>
              <option value="feature_phones">功能手机 (Feature phones)</option>
            </select>
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              操作系统版本 <span className="text-rose-500">*</span>
            </span>
            <div className="flex items-center gap-2">
              <select
                className="bg-white border border-slate-250 rounded px-2.5 py-1.5 text-xs font-bold w-20 cursor-pointer"
              >
                <option value="2.0">2.0</option>
                <option value="4.0">4.0</option>
                <option value="8.0">8.0</option>
              </select>
              <span className="font-bold text-slate-400">至</span>
              <select
                className="bg-white border border-slate-250 rounded px-2.5 py-1.5 text-xs font-bold w-20 cursor-pointer"
              >
                <option value="14.4">14.4</option>
                <option value="16.0">16.0</option>
                <option value="all">不限</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">仅在连接 Wi-Fi 时</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setFbTargetingPackages(prev => prev.map(tp => tp.id === activeFbTargetingPackageId ? { ...tp, wifiOnly: !tp.wifiOnly } : tp));
                }}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${currentTargetingPackage.wifiOnly ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${currentTargetingPackage.wifiOnly ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </button>
              <span className="font-semibold text-slate-400">开启后仅在Wi-Fi环境下展示广告</span>
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">标签</span>
            <select
              className="bg-white border border-slate-250 rounded px-3 py-2 text-xs font-bold w-48 focus:outline-hidden"
            >
              <option value="all">请选择</option>
              <option value="t1">主要受众</option>
              <option value="t2">再营销</option>
            </select>
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              定向包名称 <span className="text-rose-500">*</span>
            </span>
            <div className="relative max-w-sm w-full">
              <input 
                type="text" 
                value={currentTargetingPackage.name}
                onChange={e => {
                  const val = e.target.value;
                  setFbTargetingPackages(prev => prev.map(tp => tp.id === activeFbTargetingPackageId ? { ...tp, name: val } : tp));
                }}
                className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 text-xs font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4">
            <span></span>
            <button
              type="button"
              onClick={() => alert('定向包设置保存成功！')}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-3xs w-36 cursor-pointer text-center"
            >
              保存为定向包
            </button>
          </div>
        </div>
      </div>

      {/* 7. 出价和预算 */}
      <div ref={steps[7].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-300 transition-all font-sans text-xs">
        <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-blue-600 rounded-2xs inline-block"></span>
            <span>7. 出价和预算 (Bidding & Budget)</span>
          </div>
          <span className="text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-sm">✓ 已配置</span>
        </h3>

        {/* Bidding & Budget Tabs Row to match Image 2 */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-2 rounded mb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {fbBudgets.map((b, idx) => (
              <div
                key={b.id}
                className={`relative flex items-center gap-1 px-3 py-1.5 rounded border text-xs font-bold transition-all cursor-pointer ${
                  activeFbBudgetId === b.id 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs' 
                    : 'bg-white border-slate-200 hover:border-slate-350 text-slate-600 hover:text-slate-800'
                }`}
                onClick={() => setActiveFbBudgetId(b.id)}
              >
                <span>{b.name}</span>
                <span 
                  className="text-[11px] opacity-70 hover:opacity-100 pl-1 font-bold cursor-pointer inline-block w-4 h-4 text-center leading-4 hover:bg-black/10 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFbBudgetId(b.id);
                    const rect = e.currentTarget.getBoundingClientRect();
                    setFbBudgetMenuCoords({
                      top: rect.bottom + window.scrollY,
                      left: rect.left + window.scrollX
                    });
                    setFbBudgetMenuOpenId(fbBudgetMenuOpenId === b.id ? null : b.id);
                  }}
                  title="出价和预算操作"
                >
                  ⋮
                </span>
              </div>
            ))}
            
            <button
              type="button"
              onClick={handleAddBudget}
              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-[10.5px] rounded border border-blue-200 flex items-center gap-1 cursor-pointer transition-colors shrink-0"
            >
              <span>+ 新增出价预算</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-bold pr-1">
            {fbBudgets.length} / 30
          </div>
        </div>

        {/* Global/Fixed Dropdown Menu for Bidding & Budget */}
        {fbBudgetMenuOpenId && fbBudgetMenuCoords && (
          <>
            <div 
              className="fixed inset-0 z-45 bg-transparent cursor-default" 
              onClick={(e) => {
                e.stopPropagation();
                setFbBudgetMenuOpenId(null);
                setFbBudgetMenuCoords(null);
              }}
            ></div>
            <div 
              className="fixed bg-white border border-slate-200 shadow-md rounded py-1 w-32 z-50 text-slate-700 text-xs font-medium animate-fade-in select-none"
              style={{
                top: `${fbBudgetMenuCoords.top - window.scrollY}px`,
                left: `${fbBudgetMenuCoords.left - window.scrollX}px`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  handleDuplicateBudget(fbBudgetMenuOpenId);
                  setFbBudgetMenuOpenId(null);
                  setFbBudgetMenuCoords(null);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs flex items-center gap-1.5 font-semibold text-slate-700 transition-colors"
              >
                <span>复制</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetB = fbBudgets.find(x => x.id === fbBudgetMenuOpenId);
                  if (targetB) {
                    setFbGenericActionModal({
                      module: 'budget',
                      type: 'batch_duplicate',
                      targetId: fbBudgetMenuOpenId,
                      targetName: targetB.name,
                      inputValue: '3'
                    });
                  }
                  setFbBudgetMenuOpenId(null);
                  setFbBudgetMenuCoords(null);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs flex items-center gap-1.5 font-semibold text-slate-700 transition-colors"
              >
                <span>批量复制</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetB = fbBudgets.find(x => x.id === fbBudgetMenuOpenId);
                  if (targetB) {
                    setFbGenericActionModal({
                      module: 'budget',
                      type: 'rename',
                      targetId: fbBudgetMenuOpenId,
                      targetName: targetB.name,
                      inputValue: targetB.name
                    });
                  }
                  setFbBudgetMenuOpenId(null);
                  setFbBudgetMenuCoords(null);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs flex items-center gap-1.5 font-semibold text-slate-700 transition-colors"
              >
                <span>重命名</span>
              </button>
              <div className="border-t border-slate-100 my-1"></div>
              <button
                type="button"
                onClick={() => {
                  const targetB = fbBudgets.find(x => x.id === fbBudgetMenuOpenId);
                  if (targetB) {
                    setFbGenericActionModal({
                      module: 'budget',
                      type: 'delete',
                      targetId: fbBudgetMenuOpenId,
                      targetName: targetB.name,
                      inputValue: ''
                    });
                  }
                  setFbBudgetMenuOpenId(null);
                  setFbBudgetMenuCoords(null);
                }}
                className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 cursor-pointer text-xs flex items-center gap-1.5 font-bold transition-colors"
              >
                <span>删除</span>
              </button>
            </div>
          </>
        )}

        <div className="space-y-4">
          {/* 绑定对象 */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">绑定对象 <span className="text-rose-500">*</span></span>
            <div 
              onClick={() => {
                setFbBindingRulesModule('budget');
                setFbBindingRulesActiveTab('region');
                setIsFbBindingRulesModalOpen(true);
              }}
              className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-blue-600 cursor-pointer transition-colors"
            >
              <span>{getBoundLabel(activeFbBudgetId, 'budget')}</span>
              <span className="text-slate-400 hover:text-slate-600 cursor-pointer">✏️</span>
            </div>
          </div>

          {/* 成效目标 */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">成效目标</span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'installs', label: '应用安装量最大化' },
                { id: 'events', label: '应用事件数量最大化' },
                { id: 'clicks', label: '链接点击量最大化' },
                { id: 'value', label: '转化价值最大化' }
              ].map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setFbOptGoal(g.id as any);
                    if (g.id === 'installs') {
                      setFbAttribution('1d_click');
                      setFbBillingEvent('impressions');
                    } else if (g.id === 'events') {
                      setFbAttribution('7d_click');
                      setFbBillingEvent('impressions');
                    } else if (g.id === 'clicks') {
                      setFbBillingEvent('impressions');
                    } else if (g.id === 'value') {
                      setFbAttribution('7d_click');
                      setFbBillingEvent('impressions');
                    }
                  }}
                  className={`px-4 py-1.5 border font-bold rounded text-xs cursor-pointer transition-all ${
                    fbOptGoal === g.id 
                      ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs' 
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* 价值规则集 (仅在应用安装量最大化, 应用事件数量最大化 or 链接点击量最大化时显示) */}
          {(fbOptGoal === 'installs' || fbOptGoal === 'events' || fbOptGoal === 'clicks') && (
            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center animate-fade-in">
              <span className="font-bold text-slate-700">价值规则集</span>
              <select
                value={fbValueRuleSet}
                onChange={e => setFbValueRuleSet(e.target.value)}
                className={`bg-white border border-slate-200 hover:border-slate-350 rounded px-3 py-1.5 text-xs font-bold w-64 focus:outline-hidden cursor-pointer ${
                  !fbValueRuleSet ? 'text-slate-400' : 'text-slate-800'
                }`}
              >
                <option value="">请选择</option>
                <option value="ruleset_1">默认规则集 (Rule Set 1)</option>
                <option value="ruleset_2">高价值付费用户规则集 (Rule Set 2)</option>
              </select>
            </div>
          )}

          {/* 转化事件 (仅当选择“转化价值最大化”时展示) */}
          {fbOptGoal === 'value' && (
            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center animate-fade-in">
              <span className="font-bold text-slate-700">转化事件 <span className="text-rose-500">*</span></span>
              <select
                value={fbConversionEvent}
                onChange={e => setFbConversionEvent(e.target.value)}
                className="bg-white border border-slate-200 hover:border-slate-350 rounded px-3 py-1.5 text-xs font-bold w-64 focus:outline-hidden cursor-pointer text-slate-800"
              >
                <option value="purchase">购物</option>
                <option value="registration">注册</option>
                <option value="add_payment_info">添加支付信息</option>
                <option value="initiate_checkout">发起结账</option>
              </select>
            </div>
          )}

          {/* 应用事件分配方式 & 应用事件 (仅当选择“应用事件数量最大化”时展示) */}
          {fbOptGoal === 'events' && (
            <>
              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center animate-fade-in">
                <span className="font-bold text-slate-700">应用事件分配方式</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFbEventAllocation('unified')}
                    className={`px-4 py-1.5 border font-bold rounded text-xs cursor-pointer transition-all ${
                      fbEventAllocation === 'unified'
                        ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    统一分配
                  </button>
                  <button
                    type="button"
                    onClick={() => setFbEventAllocation('account')}
                    className={`px-4 py-1.5 border font-bold rounded text-xs cursor-pointer transition-all ${
                      fbEventAllocation === 'account'
                        ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    按账户
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center animate-fade-in">
                <span className="font-bold text-slate-700">应用事件 <span className="text-rose-500">*</span></span>
                <select
                  value={fbAppEvent}
                  onChange={e => setFbAppEvent(e.target.value)}
                  className={`bg-white border border-slate-200 hover:border-slate-350 rounded px-3 py-1.5 text-xs font-bold w-64 focus:outline-hidden cursor-pointer ${
                    !fbAppEvent ? 'text-slate-400' : 'text-slate-800'
                  }`}
                >
                  <option value="">请选择推广应用</option>
                  <option value="purchase">purchase (购买事件)</option>
                  <option value="registration">registration (注册事件)</option>
                  <option value="level_achieved">level_achieved (关卡达成)</option>
                  <option value="add_to_cart">add_to_cart (加入购物车)</option>
                </select>
              </div>
            </>
          )}

          {/* 竞价控制额 (已根据最新设计图为应用安装量最大化移除) */}

          {/* 归因设置 (链接点击量最大化时不展示) */}
          {fbOptGoal !== 'clicks' && (
            <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center animate-fade-in">
              <span className="font-bold text-slate-700">归因设置 <span className="text-rose-500">*</span></span>
              <select
                value={fbAttribution}
                onChange={e => setFbAttribution(e.target.value)}
                className="bg-white border border-slate-200 hover:border-slate-350 rounded px-3 py-1.5 text-xs font-bold w-64 focus:outline-hidden cursor-pointer"
              >
                {fbOptGoal === 'installs' ? (
                  <>
                    <option value="1d_click_1d_view">点击后1天内，浏览后1天内</option>
                    <option value="7d_click_1d_view">7 天点击与 1 天浏览</option>
                    <option value="1d_click">点击后1天内</option>
                    <option value="7d_click">7 天点击</option>
                  </>
                ) : (
                  <>
                    <option value="7d_click">点击后7天内</option>
                    <option value="1d_click">点击后1天内</option>
                    <option value="7d_click_1d_view">7 天点击与 1 天浏览</option>
                    <option value="1d_click_1d_view">1 天点击与 1 天浏览</option>
                  </>
                )}
              </select>
            </div>
          )}

          {/* 计费方式 */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">计费方式</span>
            <div className="flex gap-2">
              {fbOptGoal === 'clicks' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setFbBillingEvent('impressions')}
                    className={`px-4 py-1.5 border font-bold rounded text-xs cursor-pointer transition-all ${
                      fbBillingEvent === 'impressions'
                        ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    展示次数
                  </button>
                  <button
                    type="button"
                    onClick={() => setFbBillingEvent('link_clicks')}
                    className={`px-4 py-1.5 border font-bold rounded text-xs cursor-pointer transition-all ${
                      fbBillingEvent === 'link_clicks'
                        ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    链接点击量 (CPC)
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="px-4 py-1.5 border font-bold rounded text-xs border-blue-500 bg-blue-50 text-blue-600 shadow-3xs cursor-default"
                >
                  展示次数
                </button>
              )}
            </div>
          </div>

          {/* 排期 */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">排期</span>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFbScheduleType('now')}
                  className={`px-4 py-1.5 border font-bold rounded text-xs cursor-pointer transition-all ${
                    fbScheduleType === 'now'
                      ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  现在开始
                </button>
                <button
                  type="button"
                  onClick={() => setFbScheduleType('custom')}
                  className={`px-4 py-1.5 border font-bold rounded text-xs cursor-pointer transition-all ${
                    fbScheduleType === 'custom'
                      ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  自定义
                </button>
              </div>

              {fbScheduleType === 'custom' && (
                <div className="flex flex-col gap-2 mt-1 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <input 
                      type="datetime-local" 
                      value={fbStartDate}
                      onChange={e => setFbStartDate(e.target.value)}
                      className="bg-white border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:outline-hidden rounded px-3 py-1.5 text-xs font-bold"
                    />
                    {fbEndDate && (
                      <>
                        <span className="font-bold text-slate-400">至</span>
                        <input 
                          type="datetime-local" 
                          value={fbEndDate}
                          onChange={e => setFbEndDate(e.target.value)}
                          className="bg-white border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:outline-hidden rounded px-3 py-1.5 text-xs font-bold"
                        />
                      </>
                    )}
                  </div>
                  <label className="flex items-center gap-1.5 text-xs text-slate-500 font-bold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!fbEndDate}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFbEndDate('2026-12-31T23:59');
                        } else {
                          setFbEndDate('');
                        }
                      }}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>设置结束日期</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* 广告组花费限额 */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">广告组花费限额</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white border border-slate-200 rounded hover:border-slate-350 focus-within:border-blue-500 overflow-hidden w-28 px-2 py-1.5">
                <input 
                  type="text"
                  placeholder="下限"
                  value={fbGroupSpendingLimitMin}
                  onChange={e => setFbGroupSpendingLimitMin(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold focus:outline-hidden text-slate-700"
                />
                <span className="text-slate-400 font-bold text-[10px] pl-1 font-mono uppercase shrink-0">USD</span>
              </div>
              <span className="text-slate-400 font-bold">~</span>
              <div className="flex items-center bg-white border border-slate-200 rounded hover:border-slate-350 focus-within:border-blue-500 overflow-hidden w-28 px-2 py-1.5">
                <input 
                  type="text"
                  placeholder="上限"
                  value={fbGroupSpendingLimitMax}
                  onChange={e => setFbGroupSpendingLimitMax(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold focus:outline-hidden text-slate-700"
                />
                <span className="text-slate-400 font-bold text-[10px] pl-1 font-mono uppercase shrink-0">USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. 创意设置 */}
      <div ref={steps[8].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-300 transition-all font-sans text-xs">
        <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-blue-600 rounded-2xs inline-block"></span>
            <span>8. 创意设置 (Identity & Tracking)</span>
          </div>
          <span className="text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-sm">✓ 已配置</span>
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">广告名称 <span className="text-rose-500">*</span></span>
            <input 
              type="text"
              value={fbAdName}
              onChange={e => setFbAdName(e.target.value)}
              className="w-full max-w-xl bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 text-xs font-bold focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">广告状态</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFbAdStatus(!fbAdStatus)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${fbAdStatus ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${fbAdStatus ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </button>
              <span className="font-bold">{fbAdStatus ? '开启' : '关闭'}</span>
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">主页类型</span>
            <div className="flex gap-2">
              {[
                { id: 'all_pages', label: '全部主页' },
                { id: 'personal', label: '个人号主页' },
                { id: 'account', label: '广告账户主页' }
              ].map(pt => (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => setFbPageType(pt.id)}
                  className={`px-3 py-1.5 border font-bold rounded text-xs cursor-pointer ${
                    fbPageType === pt.id ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs' : 'border-slate-205 bg-white text-slate-655'
                  }`}
                >
                  {pt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start">
            <span className="font-bold text-slate-700 pt-2">Facebook 公共主页 <span className="text-rose-500">*</span></span>
            <div className="space-y-2 w-full">
              <select
                value={fbPageSelected}
                onChange={e => {
                  const val = e.target.value;
                  setFbPageSelected(val);
                  setFbExistingPostId('');
                }}
                className="bg-white border border-slate-250 rounded px-3 py-2 text-xs font-bold w-72 focus:outline-hidden cursor-pointer"
              >
                <option value="">请选择公共主页</option>
                <option value="Perfect Avenger Official">Perfect Avenger Official (公共主页)</option>
                <option value="Idle Games World">Idle Games World (游戏社区主页)</option>
              </select>
              <p className="text-[10px] text-amber-600 max-w-xl font-medium leading-relaxed bg-amber-50/50 p-2 border border-amber-100 rounded">
                ⚠️ 若您的主页没有全部授权，主页将默认选中"全部主页"，系统将为您随机选择投放帖子对应主页；若您希望控制投放主页，请先前往授权页完成主页授权。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">使用公共主页而不是应用名称作为广告发布身份</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFbUsePageAsAdIdentity(!fbUsePageAsAdIdentity)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${fbUsePageAsAdIdentity ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${fbUsePageAsAdIdentity ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </button>
              <span className="font-bold">{fbUsePageAsAdIdentity ? '开启' : '关闭'}</span>
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">多广告主广告</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFbMultiAdvertiserAds(!fbMultiAdvertiserAds)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${fbMultiAdvertiserAds ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${fbMultiAdvertiserAds ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </button>
              <span className="font-semibold text-slate-400">开启后允许在其他品牌广告旁并排展示您的产品推荐</span>
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">网站事件追踪</span>
            <div className="flex items-center gap-2">
              <select
                value={fbWebsiteEventTracking}
                onChange={e => setFbWebsiteEventTracking(e.target.value)}
                className="bg-white border border-slate-250 rounded px-3 py-2 text-xs font-bold w-48 focus:outline-hidden cursor-pointer"
              >
                <option value="">请选择 / 无</option>
                <option value="pixel_1">Pixel - 游戏核心点位像素</option>
                <option value="pixel_2">Pixel - 流量监控像素</option>
              </select>
              <button
                type="button"
                onClick={() => alert('已打开新增 Pixel 设置界面')}
                className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 font-bold rounded text-xs text-slate-600 cursor-pointer"
              >
                + 新增
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 9. 创意组 */}
      <div ref={steps[9].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-300 transition-all font-sans text-xs animate-fade-in">
        <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-blue-600 rounded-2xs inline-block"></span>
            <span>9. 创意组 (Creative Group)</span>
          </div>
          <span className="text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-sm">✓ 已配置</span>
        </h3>

        {/* Creative Groups Tabs Row to match Image 3 */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-2 rounded mb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {fbCreativeGroups.map((cg, idx) => (
              <div
                key={cg.id}
                className={`relative flex items-center gap-1 px-3 py-1.5 rounded border text-xs font-bold transition-all cursor-pointer ${
                  activeFbCreativeGroupId === cg.id 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs' 
                    : 'bg-white border-slate-200 hover:border-slate-350 text-slate-600 hover:text-slate-800'
                }`}
                onClick={() => setActiveFbCreativeGroupId(cg.id)}
              >
                <span>{cg.name}</span>
                <span 
                  className="text-[11px] opacity-70 hover:opacity-100 pl-1 font-bold cursor-pointer inline-block w-4 h-4 text-center leading-4 hover:bg-black/10 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFbCreativeGroupId(cg.id);
                    const rect = e.currentTarget.getBoundingClientRect();
                    setFbCreativeGroupMenuCoords({
                      top: rect.bottom + window.scrollY,
                      left: rect.left + window.scrollX
                    });
                    setFbCreativeGroupMenuOpenId(fbCreativeGroupMenuOpenId === cg.id ? null : cg.id);
                  }}
                  title="创意组操作"
                >
                  ⋮
                </span>
              </div>
            ))}
            
            <button
              type="button"
              onClick={handleAddCreativeGroup}
              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-[10.5px] rounded border border-blue-200 flex items-center gap-1 cursor-pointer transition-colors shrink-0"
            >
              <span>+ 新增创意组</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-bold pr-1">
            {fbCreativeGroups.length} / 30
          </div>
        </div>

        {/* Global/Fixed Dropdown Menu for Creative Groups */}
        {fbCreativeGroupMenuOpenId && fbCreativeGroupMenuCoords && (
          <>
            <div 
              className="fixed inset-0 z-45 bg-transparent cursor-default" 
              onClick={(e) => {
                e.stopPropagation();
                setFbCreativeGroupMenuOpenId(null);
                setFbCreativeGroupMenuCoords(null);
              }}
            ></div>
            <div 
              className="fixed bg-white border border-slate-200 shadow-md rounded py-1 w-32 z-50 text-slate-700 text-xs font-medium animate-fade-in select-none"
              style={{
                top: `${fbCreativeGroupMenuCoords.top - window.scrollY}px`,
                left: `${fbCreativeGroupMenuCoords.left - window.scrollX}px`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  handleDuplicateCreativeGroup(fbCreativeGroupMenuOpenId);
                  setFbCreativeGroupMenuOpenId(null);
                  setFbCreativeGroupMenuCoords(null);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs flex items-center gap-1.5 font-semibold text-slate-700 transition-colors"
              >
                <span>复制</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetCG = fbCreativeGroups.find(x => x.id === fbCreativeGroupMenuOpenId);
                  if (targetCG) {
                    setFbGenericActionModal({
                      module: 'creative_group',
                      type: 'batch_duplicate',
                      targetId: fbCreativeGroupMenuOpenId,
                      targetName: targetCG.name,
                      inputValue: '3'
                    });
                  }
                  setFbCreativeGroupMenuOpenId(null);
                  setFbCreativeGroupMenuCoords(null);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs flex items-center gap-1.5 font-semibold text-slate-700 transition-colors"
              >
                <span>批量复制</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetCG = fbCreativeGroups.find(x => x.id === fbCreativeGroupMenuOpenId);
                  if (targetCG) {
                    setFbGenericActionModal({
                      module: 'creative_group',
                      type: 'rename',
                      targetId: fbCreativeGroupMenuOpenId,
                      targetName: targetCG.name,
                      inputValue: targetCG.name
                    });
                  }
                  setFbCreativeGroupMenuOpenId(null);
                  setFbCreativeGroupMenuCoords(null);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs flex items-center gap-1.5 font-semibold text-slate-700 transition-colors"
              >
                <span>重命名</span>
              </button>
              <div className="border-t border-slate-100 my-1"></div>
              <button
                type="button"
                onClick={() => {
                  const targetCG = fbCreativeGroups.find(x => x.id === fbCreativeGroupMenuOpenId);
                  if (targetCG) {
                    setFbGenericActionModal({
                      module: 'creative_group',
                      type: 'delete',
                      targetId: fbCreativeGroupMenuOpenId,
                      targetName: targetCG.name,
                      inputValue: ''
                    });
                  }
                  setFbCreativeGroupMenuOpenId(null);
                  setFbCreativeGroupMenuCoords(null);
                }}
                className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 cursor-pointer text-xs flex items-center gap-1.5 font-bold transition-colors"
              >
                <span>删除</span>
              </button>
            </div>
          </>
        )}

        {/* 提示 Banner */}
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded px-3 py-2 text-[11.5px] mb-4 flex items-center gap-2 font-semibold">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>视频、图片、轮播、单个主页的帖子、灵活格式创意总共最多上传50个，轮播多个素材也仅占用一个额度，现在已上传({(currentCreativeGroup.videos?.length || 0) + (currentCreativeGroup.images?.length || 0)}/50)个</span>
        </div>

        <div className="space-y-4">
          {/* 绑定对象 */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">绑定对象 <span className="text-rose-500">*</span></span>
            <div 
              onClick={() => {
                setFbBindingRulesModule('creative');
                setFbBindingRulesActiveTab('region');
                setIsFbBindingRulesModalOpen(true);
              }}
              className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-blue-600 cursor-pointer transition-colors"
            >
              <span>{getBoundLabel(activeFbCreativeGroupId || currentCreativeGroup.id, 'creative')}</span>
              <span className="text-slate-400 hover:text-slate-600 cursor-pointer">✏️</span>
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">选择已有创意组</span>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isFbExistingCreativeChecked}
                  onChange={e => setIsFbExistingCreativeChecked(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>使用已保存的创意组模板</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">动态素材</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const nextVal = !fbDynamicCreative;
                  setFbDynamicCreative(nextVal);
                  if (nextVal) {
                    setFbCreativeTypes(['create']);
                  }
                  if (nextVal && fbFormatsSelected.includes('flexible')) {
                    setFbFormatsSelected(prev => {
                      const filtered = prev.filter(x => x !== 'flexible');
                      return filtered.length > 0 ? filtered : ['single'];
                    });
                  }
                }}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${fbDynamicCreative ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${fbDynamicCreative ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </button>
              <span className="font-semibold text-slate-400">开启后系统将自动优化素材组合</span>
            </div>
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">创意类型 <span className="text-rose-500">*</span></span>
            <div className="flex gap-2">
              {[
                { id: 'create', label: '创建广告' },
                { id: 'existing', label: '使用已有帖子' }
              ].map(item => {
                const isSelected = fbCreativeTypes.includes(item.id as any);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setFbCreativeTypes(prev => {
                        // If dynamic creative is ON, only allow single selection
                        if (fbDynamicCreative) {
                          return [item.id as any];
                        }
                        
                        // Otherwise (dynamic creative is OFF), allow multiple selection (并选)
                        if (prev.includes(item.id as any)) {
                          // Prevent clearing all selections (must have at least one)
                          if (prev.length > 1) {
                            return prev.filter(x => x !== item.id);
                          }
                          return prev;
                        } else {
                          return [...prev, item.id as any];
                        }
                      });
                    }}
                    className={`relative px-4 py-1.5 border font-bold rounded text-xs cursor-pointer overflow-hidden transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {item.label}
                    {isSelected && (
                      <div className="absolute top-0 right-0 w-0 h-0 border-t-[10px] border-t-blue-600 border-l-[10px] border-l-transparent pointer-events-none"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 如果选择了“使用已有帖子” (无论单选还是并选)，在“创意类型”下方紧接着展示 合创广告 和 帖子 字段 */}
          {fbCreativeTypes.includes('existing') && (
            <div className="space-y-4 animate-fade-in py-1 border-y border-slate-100 bg-slate-50/20 p-4 rounded-md">
              {/* 合创广告 */}
              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
                <span className="font-bold text-slate-700">合创广告</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFbCollaborativeAds(!fbCollaborativeAds)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${fbCollaborativeAds ? 'bg-blue-600' : 'bg-slate-200'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${fbCollaborativeAds ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              </div>

              {/* 帖子 */}
              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
                <span className="font-bold text-slate-700">帖子 <span className="text-rose-500">*</span></span>
                {fbPageSelected ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={fbExistingPostId || (fbPageSelected === 'Idle Games World' ? 'post_4' : 'post_1')}
                      onChange={e => setFbExistingPostId(e.target.value)}
                      className="bg-white border border-slate-250 rounded px-3 py-2 text-xs font-bold w-72 focus:outline-hidden cursor-pointer"
                    >
                      {fbPageSelected === 'Idle Games World' ? (
                        <>
                          <option value="post_4">【游戏】放置世界攻略帖子 - 新手必看</option>
                          <option value="post_5">【福利】限时兑换码礼包发放</option>
                          <option value="post_6">【公告】S2新赛季热血开启</option>
                        </>
                      ) : (
                        <>
                          <option value="post_1">【热门】主页首发帖子 - 极速挑战活动</option>
                          <option value="post_2">【最新】日常互动分享 - 100连抽福利</option>
                          <option value="post_3">【宣传】精彩CG视频 - 混沌纪元公测</option>
                        </>
                      )}
                    </select>
                    <span className="text-slate-400 text-xs">或输入ID:</span>
                    <input 
                      type="text" 
                      value={fbExistingPostId}
                      onChange={e => setFbExistingPostId(e.target.value)}
                      placeholder="输入帖子 ID"
                      className="bg-white border border-slate-250 rounded px-3 py-1.5 text-xs font-bold w-36 focus:outline-hidden"
                    />
                  </div>
                ) : (
                  <span className="text-slate-400 text-xs font-bold text-slate-400">请选择Facebook公共主页</span>
                )}
              </div>
            </div>
          )}

          {/* 如果选择了“创建广告” (无论单选还是并选)，则叠加上面“创建广告”专属的所有配置(格式、素材、文本等) */}
          {fbCreativeTypes.includes('create') && (
            fbDynamicCreative ? (
            <div className="space-y-5 animate-fade-in w-full">
              {/* 格式 */}
              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
                <span className="font-bold text-slate-700">格式</span>
                <div className="flex gap-2">
                  {[
                    { id: 'single', label: '单图片或视频' },
                    { id: 'carousel', label: '轮播' }
                  ].map(f => {
                    const isSelected = fbFormatsSelected.includes(f.id as any);
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          setFbFormatsSelected([f.id as any]);
                        }}
                        className={`relative px-4 py-1.5 border font-bold rounded text-xs cursor-pointer overflow-hidden transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs' 
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {f.label}
                        {isSelected && (
                          <div className="absolute top-0 right-0 w-0 h-0 border-t-[10px] border-t-blue-600 border-l-[10px] border-l-transparent pointer-events-none"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 延迟深度链接 */}
              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start">
                <span className="font-bold text-slate-700 pt-1.5">延迟深度链接</span>
                <div className="flex flex-col gap-2 w-full max-w-lg">
                  <input 
                    type="text" 
                    placeholder="请输入"
                    value={currentCreativeGroup.deepLink || ''}
                    onChange={e => {
                      const val = e.target.value;
                      setFbCreativeGroups(prev => prev.map(cg => cg.id === activeFbCreativeGroupId ? { ...cg, deepLink: val } : cg));
                    }}
                    className="w-full bg-white border border-slate-250 hover:border-slate-350 focus:border-blue-500 focus:outline-hidden rounded px-3 py-2 text-xs font-bold"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { key: 'campaign_name', label: '广告系列名称' },
                      { key: 'adset_name', label: '广告组名称' },
                      { key: 'ad_name', label: '广告名称' }
                    ].map(tag => (
                      <button
                        key={tag.key}
                        type="button"
                        onClick={() => {
                          const currentVal = currentCreativeGroup.deepLink || '';
                          const newVal = currentVal + `{{${tag.label}}}`;
                          setFbCreativeGroups(prev => prev.map(cg => cg.id === activeFbCreativeGroupId ? { ...cg, deepLink: newVal } : cg));
                        }}
                        className="px-2 py-1 bg-slate-50 border border-slate-150 hover:bg-slate-100 hover:border-slate-250 text-slate-500 rounded text-[10px] font-bold transition-all cursor-pointer"
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 自定义商品页面 */}
              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
                <span className="font-bold text-slate-700">自定义商品页面</span>
                <input 
                  type="text" 
                  placeholder="请输入自定义商品页面 ID"
                  value={currentCreativeGroup.customProductPageId || ''}
                  onChange={e => {
                    const val = e.target.value;
                    setFbCreativeGroups(prev => prev.map(cg => cg.id === activeFbCreativeGroupId ? { ...cg, customProductPageId: val } : cg));
                  }}
                  className="w-full max-w-lg bg-white border border-slate-250 hover:border-slate-350 focus:border-blue-500 focus:outline-hidden rounded px-3 py-2 text-xs font-bold"
                />
              </div>

              {/* FORMAT SPECIFIC: CAROUSEL (轮播) */}
              {fbFormatsSelected.includes('carousel') && (
                <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start bg-slate-50/50 p-4 border border-slate-200 rounded max-w-3xl">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800 text-[11.5px] block">轮播图片 <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] text-slate-400 block font-semibold leading-normal">
                      轮播模式下，支持添加多张图片素材，字段在图片下方展示并统一对齐
                    </span>
                  </div>
                  <div className="space-y-3 w-full">
                    <button
                      type="button"
                      onClick={() => {
                        setFbActiveCreativeGroupIdForPicker(activeFbCreativeGroupId);
                        setFbMaterialPickerType('image');
                        setIsFbMaterialPickerOpen(true);
                      }}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded shadow-3xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Image className="w-3.5 h-3.5 text-white" />
                      添加图片
                    </button>

                    {/* Previews */}
                    {currentCreativeGroup.images.length === 0 ? (
                      <span className="text-[10px] text-slate-400 font-bold block py-2 select-none">
                        暂无添加图片，请点击上方按钮选择
                      </span>
                    ) : (
                      <div className="grid grid-cols-4 gap-2 border border-slate-150 p-2 rounded bg-white max-w-lg max-h-40 overflow-y-auto">
                        {currentCreativeGroup.images.map(img => {
                          const mat = materials.find(m => m.id === img);
                          return (
                            <div key={img} className="border border-slate-200 rounded p-1 relative flex flex-col justify-between bg-slate-50">
                              <img referrerPolicy="no-referrer" src={mat?.thumbnail} alt="" className="w-full h-12 object-cover rounded-sm mb-1" />
                              <span className="text-[8.5px] text-slate-500 truncate block font-mono">{mat?.fileName}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setFbCreativeGroups(prev => prev.map(c => c.id === activeFbCreativeGroupId ? {
                                    ...c, images: c.images.filter(i => i !== img)
                                  } : c));
                                }}
                                className="absolute top-0.5 right-0.5 bg-rose-500 hover:bg-rose-600 text-white p-0.5 rounded-full cursor-pointer"
                              >
                                <X className="w-2.5 h-2.5 text-white" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FORMAT SPECIFIC: SINGLE IMAGE/VIDEO (单图片或视频) */}
              {(fbFormatsSelected.includes('single') || fbFormatsSelected.includes('flexible')) && (
                <>
                  {/* 视频 */}
                  <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start bg-slate-50/50 p-4 border border-slate-200 rounded max-w-3xl">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-800 text-[11.5px] block">视频 <span className="text-rose-500">*</span></span>
                      <span className="text-[10px] text-slate-400 block font-semibold leading-normal">
                        支持添加单视频或多视频作为动态素材优化组合
                      </span>
                    </div>
                    <div className="space-y-3 w-full">
                      <button
                        type="button"
                        onClick={() => {
                          setFbActiveCreativeGroupIdForPicker(activeFbCreativeGroupId);
                          setFbMaterialPickerType('video');
                          setIsFbMaterialPickerOpen(true);
                        }}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded shadow-3xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Video className="w-3.5 h-3.5 text-white" />
                        添加视频
                      </button>

                      {/* Video Previews */}
                      {currentCreativeGroup.videos.length === 0 ? (
                        <span className="text-[10px] text-slate-400 font-bold block py-2 select-none">
                          暂无添加视频，请点击上方按钮选择
                        </span>
                      ) : (
                        <div className="grid grid-cols-4 gap-2 border border-slate-150 p-2 rounded bg-white max-w-lg max-h-40 overflow-y-auto">
                          {currentCreativeGroup.videos.map(vid => {
                            const mat = materials.find(m => m.id === vid);
                            return (
                              <div key={vid} className="border border-slate-200 rounded p-1 relative flex flex-col justify-between bg-slate-50">
                                <img referrerPolicy="no-referrer" src={mat?.thumbnail} alt="" className="w-full h-12 object-cover rounded-sm mb-1" />
                                <span className="text-[8.5px] text-slate-500 truncate block font-mono">{mat?.fileName}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFbCreativeGroups(prev => prev.map(c => c.id === activeFbCreativeGroupId ? {
                                      ...c, videos: c.videos.filter(v => v !== vid)
                                    } : c));
                                  }}
                                  className="absolute top-0.5 right-0.5 bg-rose-500 hover:bg-rose-600 text-white p-0.5 rounded-full cursor-pointer"
                                >
                                  <X className="w-2.5 h-2.5 text-white" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 图片 */}
                  <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start bg-slate-50/50 p-4 border border-slate-200 rounded max-w-3xl">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-800 text-[11.5px] block">图片 <span className="text-rose-500">*</span></span>
                      <span className="text-[10px] text-slate-400 block font-semibold leading-normal">
                        支持添加单图片或多图片作为动态素材优化组合
                      </span>
                    </div>
                    <div className="space-y-3 w-full">
                      <button
                        type="button"
                        onClick={() => {
                          setFbActiveCreativeGroupIdForPicker(activeFbCreativeGroupId);
                          setFbMaterialPickerType('image');
                          setIsFbMaterialPickerOpen(true);
                        }}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded shadow-3xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Image className="w-3.5 h-3.5 text-white" />
                        添加图片
                      </button>

                      {/* Image Previews */}
                      {currentCreativeGroup.images.length === 0 ? (
                        <span className="text-[10px] text-slate-400 font-bold block py-2 select-none">
                          暂无添加图片，请点击上方按钮选择
                        </span>
                      ) : (
                        <div className="grid grid-cols-4 gap-2 border border-slate-150 p-2 rounded bg-white max-w-lg max-h-40 overflow-y-auto">
                          {currentCreativeGroup.images.map(img => {
                            const mat = materials.find(m => m.id === img);
                            return (
                              <div key={img} className="border border-slate-200 rounded p-1 relative flex flex-col justify-between bg-slate-50">
                                <img referrerPolicy="no-referrer" src={mat?.thumbnail} alt="" className="w-full h-12 object-cover rounded-sm mb-1" />
                                <span className="text-[8.5px] text-slate-500 truncate block font-mono">{mat?.fileName}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFbCreativeGroups(prev => prev.map(c => c.id === activeFbCreativeGroupId ? {
                                      ...c, images: c.images.filter(i => i !== img)
                                    } : c));
                                  }}
                                  className="absolute top-0.5 right-0.5 bg-rose-500 hover:bg-rose-600 text-white p-0.5 rounded-full cursor-pointer"
                                >
                                  <X className="w-2.5 h-2.5 text-white" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* 正文 */}
              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start bg-slate-50/50 p-4 border border-slate-200 rounded max-w-3xl">
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 text-[11.5px] block">正文 ⓘ</span>
                  <span className="text-[10px] text-slate-400 block font-semibold leading-normal">
                    主要展示的主标题文案信息
                  </span>
                </div>
                <div className="space-y-3 w-full">
                  <div className="flex border border-slate-250 rounded max-w-sm overflow-hidden">
                    <button type="button" className="flex-1 py-1 font-bold bg-blue-600 text-white text-[11px]">选文案</button>
                    <button type="button" className="flex-1 py-1 font-bold bg-white text-slate-600 hover:bg-slate-50 text-[11px]">批量添加文案</button>
                  </div>

                  {currentCreativeGroup.descriptions.map((desc, dIdx) => (
                    <div key={dIdx} className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <input 
                          type="text"
                          value={desc}
                          onChange={e => {
                            const next = [...currentCreativeGroup.descriptions];
                            next[dIdx] = e.target.value.slice(0, 90);
                            setFbCreativeGroups(prev => prev.map(c => c.id === activeFbCreativeGroupId ? { ...c, descriptions: next } : c));
                          }}
                          placeholder="输入主广告主体的文本 (限90字符)..."
                          className="flex-1 bg-white border border-slate-250 hover:border-slate-350 focus:border-blue-500 focus:outline-hidden rounded px-3 py-1.5 text-slate-800 text-xs font-semibold leading-normal"
                        />
                        <span className="text-[10px] font-mono text-slate-400 w-10 text-right">{desc.length}/90</span>
                        {currentCreativeGroup.descriptions.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => {
                              const next = currentCreativeGroup.descriptions.filter((_, idx) => idx !== dIdx);
                              setFbCreativeGroups(prev => prev.map(c => c.id === activeFbCreativeGroupId ? { ...c, descriptions: next } : c));
                            }}
                            className="text-rose-500 hover:text-rose-700 font-bold text-xs px-1 cursor-pointer"
                          >
                            删除
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {currentCreativeGroup.descriptions.length < 5 && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...currentCreativeGroup.descriptions, ''];
                        setFbCreativeGroups(prev => prev.map(c => c.id === activeFbCreativeGroupId ? { ...c, descriptions: next } : c));
                      }}
                      className="px-2.5 py-1.5 border border-dashed border-slate-300 hover:border-slate-400 text-slate-600 font-semibold rounded text-[10.5px] cursor-pointer"
                    >
                      + 增加正文组 (最多5个)
                    </button>
                  )}
                </div>
              </div>

              {/* 标题 */}
              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start bg-slate-50/50 p-4 border border-slate-200 rounded max-w-3xl">
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 text-[11.5px] block">标题 ⓘ</span>
                  <span className="text-[10px] text-slate-400 block font-semibold leading-normal">
                    短标题文案信息
                  </span>
                </div>
                <div className="space-y-3 w-full">
                  <div className="flex border border-slate-250 rounded max-w-sm overflow-hidden">
                    <button type="button" className="flex-1 py-1 font-bold bg-blue-600 text-white text-[11px]">选文案</button>
                    <button type="button" className="flex-1 py-1 font-bold bg-white text-slate-600 hover:bg-slate-50 text-[11px]">批量添加文案</button>
                  </div>

                  {currentCreativeGroup.titles.map((title, tIdx) => (
                    <div key={tIdx} className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <input 
                          type="text"
                          value={title}
                          onChange={e => {
                            const next = [...currentCreativeGroup.titles];
                            next[tIdx] = e.target.value.slice(0, 40);
                            setFbCreativeGroups(prev => prev.map(c => c.id === activeFbCreativeGroupId ? { ...c, titles: next } : c));
                          }}
                          placeholder="输入广告标题内容 (限40字符)..."
                          className="flex-1 bg-white border border-slate-250 hover:border-slate-350 focus:border-blue-500 focus:outline-hidden rounded px-3 py-1.5 text-slate-800 text-xs font-semibold leading-normal"
                        />
                        <span className="text-[10px] font-mono text-slate-400 w-10 text-right">{title.length}/40</span>
                        {currentCreativeGroup.titles.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => {
                              const next = currentCreativeGroup.titles.filter((_, idx) => idx !== tIdx);
                              setFbCreativeGroups(prev => prev.map(c => c.id === activeFbCreativeGroupId ? { ...c, titles: next } : c));
                            }}
                            className="text-rose-500 hover:text-rose-700 font-bold text-xs px-1 cursor-pointer"
                          >
                            删除
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {currentCreativeGroup.titles.length < 5 && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...currentCreativeGroup.titles, ''];
                        setFbCreativeGroups(prev => prev.map(c => c.id === activeFbCreativeGroupId ? { ...c, titles: next } : c));
                      }}
                      className="px-2.5 py-1.5 border border-dashed border-slate-300 hover:border-slate-400 text-slate-600 font-semibold rounded text-[10.5px] cursor-pointer"
                    >
                      + 增加标题组 (最多5个)
                    </button>
                  )}
                </div>
              </div>

              {/* 行动号召 */}
              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
                <span className="font-bold text-slate-700">行动号召 <span className="text-rose-500">*</span></span>
                <select
                  className="bg-white border border-slate-250 rounded px-3 py-2 text-xs font-bold w-48 focus:outline-hidden cursor-pointer"
                >
                  <option value="DOWNLOAD">立即下载 (Install Now)</option>
                  <option value="PLAY">去玩游戏 (Play Game)</option>
                  <option value="LEARN_MORE">了解更多 (Learn More)</option>
                </select>
              </div>

              {/* 针对每位用户优化创意 */}
              {(fbFormatsSelected.includes('single') || fbFormatsSelected.includes('flexible')) && (
                <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
                  <span className="font-bold text-slate-700">针对每位用户优化创意</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFbOptimizeCreativePerUser(!fbOptimizeCreativePerUser)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${fbOptimizeCreativePerUser ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${fbOptimizeCreativePerUser ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </button>
                    <span className="font-semibold text-slate-400">开启后将面向更有可能产生互动的用户展示优化版创意</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
                <span className="font-bold text-slate-700">格式</span>
                <div className="flex gap-2">
                  {[
                    { id: 'flexible', label: '灵活' },
                    { id: 'single', label: '单图片或视频' },
                    { id: 'carousel', label: '轮播' }
                  ].map(f => {
                    const isSelected = fbFormatsSelected.includes(f.id as any);
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          setFbFormatsSelected([f.id as any]);
                        }}
                        className={`relative px-4 py-1.5 border font-bold rounded text-xs cursor-pointer overflow-hidden transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {f.label}
                        {isSelected && (
                          <div className="absolute top-0 right-0 w-0 h-0 border-t-[10px] border-t-blue-600 border-l-[10px] border-l-transparent pointer-events-none"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 1. 灵活模式专属字段 (放在“格式”后，“延迟深度链接”前) */}
              {fbFormatsSelected.includes('flexible') && (
                <>
                  <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start bg-slate-50/50 p-4 border border-slate-200 rounded max-w-3xl animate-fade-in">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-800 text-[11.5px] block">灵活格式创意 <span className="text-rose-500">*</span></span>
                      <span className="text-[10px] text-slate-400 block font-semibold leading-normal">
                        通过批量上传，自动组合生成最佳灵活素材组合
                      </span>
                    </div>
                    <div className="space-y-3 w-full">
                      <button
                        type="button"
                        onClick={() => {
                          setFbActiveCreativeGroupIdForPicker(activeFbCreativeGroupId);
                          setFbMaterialPickerType('image'); // 默认可以选择图片/视频
                          setIsFbMaterialPickerOpen(true);
                        }}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded shadow-3xs cursor-pointer flex items-center gap-1.5"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-white" />
                        批量添加素材
                      </button>
                      <button
                        type="button"
                        onClick={() => alert('已打开添加分组界面')}
                        className="text-blue-600 hover:text-blue-800 text-[11px] font-bold block pt-1 cursor-pointer text-left"
                      >
                        + 添加分组
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center animate-fade-in">
                    <span className="font-bold text-slate-700">使用进阶赋能型素材优化灵活格式创意</span>
                    <select
                      className="bg-white border border-slate-250 rounded px-3 py-2 text-xs font-bold w-48 focus:outline-hidden cursor-pointer"
                    >
                      <option value="ALL">全面优化(全选)</option>
                      <option value="NONE">不优化</option>
                    </select>
                  </div>
                </>
              )}

              {/* 2. 单图片/视频专属前置字段 (放在“格式”后，“延迟深度链接”前) */}
              {fbFormatsSelected.includes('single') && (
                <>
                  <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
                    <span className="font-bold text-slate-700">添加目标位置 <span className="text-rose-500">*</span></span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFbCreativeDestination('app')}
                        className={`px-3.5 py-1.5 border font-bold rounded text-xs cursor-pointer ${
                          fbCreativeDestination === 'app' ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs' : 'border-slate-205 bg-white text-slate-655'
                        }`}
                      >
                        应用
                      </button>
                      <button
                        type="button"
                        onClick={() => setFbCreativeDestination('playable')}
                        className={`px-3.5 py-1.5 border font-bold rounded text-xs cursor-pointer ${
                          fbCreativeDestination === 'playable' ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs' : 'border-slate-205 bg-white text-slate-655'
                        }`}
                      >
                        试玩广告来源
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      设置方式 ⓘ
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFbCreativeSettingMethod('group')}
                        className={`px-3.5 py-1.5 border font-bold rounded text-xs cursor-pointer ${
                          fbCreativeSettingMethod === 'group' ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs' : 'border-slate-205 bg-white text-slate-655'
                        }`}
                      >
                        按创意组
                      </button>
                      <button
                        type="button"
                        onClick={() => setFbCreativeSettingMethod('material')}
                        className={`px-3.5 py-1.5 border font-bold rounded text-xs cursor-pointer ${
                          fbCreativeSettingMethod === 'material' ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs' : 'border-slate-205 bg-white text-slate-655'
                        }`}
                      >
                        按素材
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* 公用前置字段: 延迟深度链接 & 自定义商品页面 */}
              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start">
                <span className="font-bold text-slate-700 pt-1.5">延迟深度链接</span>
                <div className="flex flex-col gap-2 w-full max-w-lg">
                  <input 
                    type="text" 
                    placeholder="请输入"
                    value={currentCreativeGroup.deepLink || ''}
                    onChange={e => {
                      const val = e.target.value;
                      setFbCreativeGroups(prev => prev.map(cg => cg.id === activeFbCreativeGroupId ? { ...cg, deepLink: val } : cg));
                    }}
                    className="w-full bg-white border border-slate-250 hover:border-slate-350 focus:border-blue-500 focus:outline-hidden rounded px-3 py-2 text-xs font-bold"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { key: 'campaign_name', label: '广告系列名称' },
                      { key: 'adset_name', label: '广告组名称' },
                      { key: 'ad_name', label: '广告名称' }
                    ].map(tag => (
                      <button
                        key={tag.key}
                        type="button"
                        onClick={() => {
                          const currentVal = currentCreativeGroup.deepLink || '';
                          const newVal = currentVal + `{{${tag.label}}}`;
                          setFbCreativeGroups(prev => prev.map(cg => cg.id === activeFbCreativeGroupId ? { ...cg, deepLink: newVal } : cg));
                        }}
                        className="px-2 py-1 bg-slate-50 border border-slate-150 hover:bg-slate-100 hover:border-slate-250 text-slate-500 rounded text-[10px] font-bold transition-all cursor-pointer"
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
                <span className="font-bold text-slate-700">自定义商品页面</span>
                <input 
                  type="text" 
                  placeholder="请输入自定义商品页面 ID"
                  value={currentCreativeGroup.customProductPageId || ''}
                  onChange={e => {
                    const val = e.target.value;
                    setFbCreativeGroups(prev => prev.map(cg => cg.id === activeFbCreativeGroupId ? { ...cg, customProductPageId: val } : cg));
                  }}
                  className="w-full max-w-lg bg-white border border-slate-250 hover:border-slate-350 focus:border-blue-500 focus:outline-hidden rounded px-3 py-2 text-xs font-bold"
                />
              </div>

              {/* 3. 单图片/视频专属后置字段 */}
              {fbFormatsSelected.includes('single') && (
                <>
                  {fbCreativeDestination === 'playable' && (
                    <>
                      {/* Warning Banner */}
                      <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start animate-fade-in">
                        <div></div>
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded text-xs font-bold leading-relaxed max-w-3xl flex gap-2">
                          <span className="text-sm">⚠️</span>
                          <span>选择的版位不支持试玩广告，请选择 Facebook 动态、Facebook 快拍、Audience Network、Instagram 动态和 Instagram 快拍版位以投放试玩广告。</span>
                        </div>
                      </div>

                      {/* Playable Ad Asset Picker */}
                      <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start bg-slate-50/50 p-4 border border-slate-200 rounded max-w-3xl animate-fade-in">
                        <div className="space-y-1">
                          <span className="font-bold text-slate-800 text-[11.5px] block">试玩广告 <span className="text-rose-500">*</span></span>
                          <span className="text-[10px] text-slate-400 block font-semibold leading-normal">
                            支持添加 HTML5/Zip 形式的试玩广告素材
                          </span>
                        </div>
                        <div className="space-y-3 w-full">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                setFbActiveCreativeGroupIdForPicker(activeFbCreativeGroupId);
                                setFbMaterialPickerType('html5');
                                setIsFbMaterialPickerOpen(true);
                              }}
                              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded shadow-3xs cursor-pointer flex items-center gap-1.5"
                            >
                              <FolderOpen className="w-3.5 h-3.5 text-white" />
                              添加素材
                            </button>
                            <span className="text-xs text-slate-500 font-bold">
                              已选 ({(currentCreativeGroup.html5s || []).length}/1) 个
                            </span>
                          </div>

                          <div className="grid grid-cols-4 gap-2 border border-slate-150 p-2 rounded bg-white max-h-32 overflow-y-auto">
                            {(!currentCreativeGroup.html5s || currentCreativeGroup.html5s.length === 0) ? (
                              <span className="col-span-4 text-[10px] text-slate-400 font-bold text-center py-4 select-none">
                                请点击上方的"添加素材"勾选本地 HTML5/Zip 试玩资源加入到此创意组中
                              </span>
                            ) : (
                              currentCreativeGroup.html5s.map(h5Id => {
                                const mat = materials.find(m => m.id === h5Id);
                                return (
                                  <div key={h5Id} className="border border-slate-200 rounded p-1 relative flex flex-col justify-between bg-slate-50">
                                    <div className="w-full h-12 flex items-center justify-center bg-slate-100 rounded-sm mb-1">
                                      <span className="text-[20px]">🎮</span>
                                    </div>
                                    <span className="text-[8.5px] text-slate-500 truncate block font-mono">{mat?.fileName || 'playable_ad.zip'}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setFbCreativeGroups(prev => prev.map(c => c.id === activeFbCreativeGroupId ? {
                                          ...c, html5s: (c.html5s || []).filter(h => h !== h5Id)
                                        } : c));
                                      }}
                                      className="absolute top-0.5 right-0.5 bg-rose-500 hover:bg-rose-600 text-white p-0.5 rounded-full cursor-pointer"
                                    >
                                      <X className="w-2.5 h-2.5 text-white" />
                                    </button>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* 视频 */}
                  <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start bg-slate-50/50 p-4 border border-slate-200 rounded max-w-3xl animate-fade-in">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-800 text-[11.5px] block">视频 <span className="text-rose-500">*</span></span>
                      <span className="text-[10px] text-slate-400 block font-semibold leading-normal">
                        支持添加单个或多个视频作为单图片或视频广告素材
                      </span>
                    </div>
                    <div className="space-y-3 w-full">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setFbActiveCreativeGroupIdForPicker(activeFbCreativeGroupId);
                            setFbMaterialPickerType('video');
                            setIsFbMaterialPickerOpen(true);
                          }}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded shadow-3xs cursor-pointer flex items-center gap-1.5"
                        >
                          <Video className="w-3.5 h-3.5 text-white" />
                          添加素材
                        </button>
                      </div>

                      <div className="grid grid-cols-4 gap-2 border border-slate-150 p-2 rounded bg-white max-h-32 overflow-y-auto">
                        {currentCreativeGroup.videos.length === 0 ? (
                          <span className="col-span-4 text-[10px] text-slate-400 font-bold text-center py-4 select-none">
                            请勾选本地视频资源加入到此创意组中
                          </span>
                        ) : (
                          currentCreativeGroup.videos.map(vid => {
                            const mat = materials.find(m => m.id === vid);
                            return (
                              <div key={vid} className="border border-slate-200 rounded p-1 relative flex flex-col justify-between bg-slate-50">
                                <img referrerPolicy="no-referrer" src={mat?.thumbnail} alt="" className="w-full h-12 object-cover rounded-sm mb-1" />
                                <span className="text-[8.5px] text-slate-500 truncate block font-mono">{mat?.fileName}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFbCreativeGroups(prev => prev.map(c => c.id === activeFbCreativeGroupId ? {
                                      ...c, videos: c.videos.filter(v => v !== vid)
                                    } : c));
                                  }}
                                  className="absolute top-0.5 right-0.5 bg-rose-500 hover:bg-rose-600 text-white p-0.5 rounded-full"
                                >
                                  <X className="w-2.5 h-2.5 text-white" />
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center animate-fade-in">
                    <span className="font-bold text-slate-700">使用进阶赋能型素材优化视频广告</span>
                    <select
                      className="bg-white border border-slate-250 rounded px-3 py-2 text-xs font-bold w-48 focus:outline-hidden cursor-pointer"
                    >
                      <option value="ALL">全面优化(全选)</option>
                      <option value="NONE">不优化</option>
                    </select>
                  </div>

                  {/* 图片 */}
                  <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start bg-slate-50/50 p-4 border border-slate-200 rounded max-w-3xl animate-fade-in">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-800 text-[11.5px] block">图片 <span className="text-rose-500">*</span></span>
                      <span className="text-[10px] text-slate-400 block font-semibold leading-normal">
                        支持常用的 PNG / JPG 格式文件进行优化组合
                      </span>
                    </div>
                    <div className="space-y-3 w-full">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setFbActiveCreativeGroupIdForPicker(activeFbCreativeGroupId);
                            setFbMaterialPickerType('image');
                            setIsFbMaterialPickerOpen(true);
                          }}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded shadow-3xs cursor-pointer flex items-center gap-1.5"
                        >
                          <Image className="w-3.5 h-3.5 text-white" />
                          添加素材
                        </button>
                      </div>

                      <div className="grid grid-cols-4 gap-2 border border-slate-150 p-2 rounded bg-white max-h-32 overflow-y-auto">
                        {currentCreativeGroup.images.length === 0 ? (
                          <span className="col-span-4 text-[10px] text-slate-400 font-bold text-center py-4 select-none">
                            请勾选本地图片资源加入到此创意组中
                          </span>
                        ) : (
                          currentCreativeGroup.images.map(img => {
                            const mat = materials.find(m => m.id === img);
                            return (
                              <div key={img} className="border border-slate-200 rounded p-1 relative flex flex-col justify-between bg-slate-50">
                                <img referrerPolicy="no-referrer" src={mat?.thumbnail} alt="" className="w-full h-12 object-cover rounded-sm mb-1" />
                                <span className="text-[8.5px] text-slate-500 truncate block font-mono">{mat?.fileName}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFbCreativeGroups(prev => prev.map(c => c.id === activeFbCreativeGroupId ? {
                                      ...c, images: c.images.filter(i => i !== img)
                                    } : c));
                                  }}
                                  className="absolute top-0.5 right-0.5 bg-rose-500 hover:bg-rose-600 text-white p-0.5 rounded-full"
                                >
                                  <X className="w-2.5 h-2.5 text-white" />
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center animate-fade-in">
                    <span className="font-bold text-slate-700">使用进阶赋能型素材优化图片广告</span>
                    <select
                      className="bg-white border border-slate-250 rounded px-3 py-2 text-xs font-bold w-48 focus:outline-hidden cursor-pointer"
                    >
                      <option value="ALL">全面优化(全选)</option>
                      <option value="NONE">不优化</option>
                    </select>
                  </div>
                </>
              )}

              {/* 4. 轮播专属字段 */}
              {fbFormatsSelected.includes('carousel') && (
                <>
                  <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start bg-slate-50/50 p-4 border border-slate-200 rounded max-w-3xl animate-fade-in">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-800 text-[11.5px] block">轮播 <span className="text-rose-500">*</span></span>
                      <span className="text-[10px] text-slate-400 block font-semibold leading-normal">
                        轮播模式下，支持添加多张图片素材，字段在图片下方展示并统一对齐
                      </span>
                    </div>
                    <div className="space-y-3 w-full">
                      <button
                        type="button"
                        onClick={() => {
                          setFbActiveCreativeGroupIdForPicker(activeFbCreativeGroupId);
                          setFbMaterialPickerType('image'); // 轮播默认也是选择图片
                          setIsFbMaterialPickerOpen(true);
                        }}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded shadow-3xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Image className="w-3.5 h-3.5 text-white" />
                        添加素材
                      </button>

                      {/* Carousel Previews */}
                      {currentCreativeGroup.images.length === 0 ? (
                        <span className="text-[10px] text-slate-400 font-bold block py-2 select-none">
                          暂无添加图片，请点击上方按钮选择
                        </span>
                      ) : (
                        <div className="grid grid-cols-4 gap-2 border border-slate-150 p-2 rounded bg-white max-w-lg max-h-40 overflow-y-auto">
                          {currentCreativeGroup.images.map(img => {
                            const mat = materials.find(m => m.id === img);
                            return (
                              <div key={img} className="border border-slate-200 rounded p-1 relative flex flex-col justify-between bg-slate-50">
                                <img referrerPolicy="no-referrer" src={mat?.thumbnail} alt="" className="w-full h-12 object-cover rounded-sm mb-1" />
                                <span className="text-[8.5px] text-slate-500 truncate block font-mono">{mat?.fileName}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFbCreativeGroups(prev => prev.map(c => c.id === activeFbCreativeGroupId ? {
                                      ...c, images: c.images.filter(i => i !== img)
                                    } : c));
                                  }}
                                  className="absolute top-0.5 right-0.5 bg-rose-500 hover:bg-rose-600 text-white p-0.5 rounded-full cursor-pointer"
                                >
                                  <X className="w-2.5 h-2.5 text-white" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center animate-fade-in">
                    <span className="font-bold text-slate-700">使用进阶赋能型素材优化轮播广告</span>
                    <select
                      className="bg-white border border-slate-250 rounded px-3 py-2 text-xs font-bold w-48 focus:outline-hidden cursor-pointer"
                    >
                      <option value="ALL">全面优化(全选)</option>
                      <option value="NONE">不优化</option>
                    </select>
                  </div>
                </>
              )}

              {/* 5. 多语言 - 仅在单图片/视频模式显示 (参考图2和图1、图3对比) */}
              {fbFormatsSelected.includes('single') && (
                <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    多语言 ⓘ
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFbMultiLanguageEnabled(!fbMultiLanguageEnabled)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${fbMultiLanguageEnabled ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${fbMultiLanguageEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </button>
                  </div>
                </div>
              )}

              {/* 正文 (公用，所有模式均显示) */}
              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start">
                <span className="font-bold text-slate-700 pt-1.5">正文</span>
                <div className="space-y-3 w-full max-w-xl">
                  <div className="flex items-center gap-3">
                    <button type="button" className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded text-xs font-bold cursor-pointer">选文案</button>
                    <button type="button" className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded text-xs font-bold cursor-pointer">批量添加文案</button>
                    <span className="text-xs text-slate-400 font-bold">({currentCreativeGroup.descriptions.length}/5)</span>
                  </div>

                  {currentCreativeGroup.descriptions.map((desc, dIdx) => (
                    <div key={dIdx} className="space-y-1.5">
                      <div className="flex items-start gap-2">
                        <textarea 
                          rows={2}
                          value={desc}
                          onChange={e => {
                            const next = [...currentCreativeGroup.descriptions];
                            next[dIdx] = e.target.value.slice(0, 90);
                            setFbCreativeGroups(prev => prev.map(c => c.id === activeFbCreativeGroupId ? { ...c, descriptions: next } : c));
                          }}
                          placeholder="请输入正文"
                          className="flex-1 bg-white border border-slate-250 hover:border-slate-350 focus:border-blue-500 focus:outline-hidden rounded px-3 py-1.5 text-slate-800 text-xs font-semibold leading-normal"
                        />
                        <span className="text-[10px] font-mono text-slate-400 w-10 text-right pt-2">{desc.length}/90</span>
                        {currentCreativeGroup.descriptions.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => {
                              const next = currentCreativeGroup.descriptions.filter((_, idx) => idx !== dIdx);
                              setFbCreativeGroups(prev => prev.map(c => c.id === activeFbCreativeGroupId ? { ...c, descriptions: next } : c));
                            }}
                            className="text-rose-500 hover:text-rose-700 font-bold text-xs px-1 cursor-pointer pt-2"
                          >
                            删除
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {currentCreativeGroup.descriptions.length < 5 && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...currentCreativeGroup.descriptions, ''];
                        setFbCreativeGroups(prev => prev.map(c => c.id === activeFbCreativeGroupId ? { ...c, descriptions: next } : c));
                      }}
                      className="text-blue-600 hover:text-blue-800 font-bold text-xs cursor-pointer block text-left"
                    >
                      + 添加
                    </button>
                  )}
                </div>
              </div>

              {/* 标题 - 仅在单图片/视频模式显示 (参考图2和图1、图3对比) */}
              {fbFormatsSelected.includes('single') && (
                <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start">
                  <span className="font-bold text-slate-700 pt-1.5 flex items-center gap-1">
                    标题 ⓘ
                  </span>
                  <div className="space-y-3 w-full max-w-xl">
                    <div className="flex items-center gap-3">
                      <button type="button" className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded text-xs font-bold cursor-pointer">选文案</button>
                      <button type="button" className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded text-xs font-bold cursor-pointer">批量添加文案</button>
                      <span className="text-xs text-slate-400 font-bold">({currentCreativeGroup.titles.length}/5)</span>
                    </div>

                    {currentCreativeGroup.titles.map((title, tIdx) => (
                      <div key={tIdx} className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <input 
                            type="text"
                            value={title}
                            onChange={e => {
                              const next = [...currentCreativeGroup.titles];
                              next[tIdx] = e.target.value.slice(0, 40);
                              setFbCreativeGroups(prev => prev.map(c => c.id === activeFbCreativeGroupId ? { ...c, titles: next } : c));
                            }}
                            placeholder="请输入标题"
                            className="flex-1 bg-white border border-slate-250 hover:border-slate-350 focus:border-blue-500 focus:outline-hidden rounded px-3 py-1.5 text-slate-800 text-xs font-semibold leading-normal"
                          />
                          <span className="text-[10px] font-mono text-slate-400 w-10 text-right">{title.length}/40</span>
                          {currentCreativeGroup.titles.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => {
                                const next = currentCreativeGroup.titles.filter((_, idx) => idx !== tIdx);
                                setFbCreativeGroups(prev => prev.map(c => c.id === activeFbCreativeGroupId ? { ...c, titles: next } : c));
                              }}
                              className="text-rose-500 hover:text-rose-700 font-bold text-xs px-1 cursor-pointer"
                            >
                              删除
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {currentCreativeGroup.titles.length < 5 && (
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...currentCreativeGroup.titles, ''];
                          setFbCreativeGroups(prev => prev.map(c => c.id === activeFbCreativeGroupId ? { ...c, titles: next } : c));
                        }}
                        className="text-blue-600 hover:text-blue-800 font-bold text-xs cursor-pointer block text-left"
                      >
                        + 添加
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 行动号召 */}
              <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
                <span className="font-bold text-slate-700">行动号召 <span className="text-rose-500">*</span></span>
                <select
                  className="bg-white border border-slate-250 rounded px-3 py-2 text-xs font-bold w-48 focus:outline-hidden cursor-pointer"
                >
                  <option value="">请选择</option>
                  <option value="DOWNLOAD">立即下载 (Install Now)</option>
                  <option value="PLAY">去玩游戏 (Play Game)</option>
                  <option value="LEARN_MORE">了解更多 (Learn More)</option>
                </select>
              </div>
            </div>
          ))}

          {/* 标签 - 始终展示在最底部，创意组名称上方 */}
          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">标签 ⓘ</span>
            <select
              value={fbCreativeTagSelected}
              onChange={e => setFbCreativeTagSelected(e.target.value)}
              className="bg-white border border-slate-250 rounded px-3 py-2 text-xs font-bold w-48 focus:outline-hidden cursor-pointer"
            >
              <option value="">请选择</option>
              <option value="cg_new">核心主推</option>
              <option value="cg_test">测试创意</option>
            </select>
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
            <span className="font-bold text-slate-700">创意组名称 <span className="text-rose-500">*</span></span>
            <input 
              type="text" 
              value={currentCreativeGroup.name}
              onChange={e => {
                const val = e.target.value;
                setFbCreativeGroups(prev => prev.map(cg => cg.id === activeFbCreativeGroupId ? { ...cg, name: val } : cg));
              }}
              className="w-full max-w-sm bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 text-xs font-bold"
            />
          </div>

          <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4">
            <span></span>
            <button
              type="button"
              onClick={() => alert('创意组设置保存成功！')}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-3xs w-36 cursor-pointer text-center"
            >
              保存创意组
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
