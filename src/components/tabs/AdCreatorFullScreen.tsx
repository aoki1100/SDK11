import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../AppContext';
import { ChannelSidebar } from '../layout/ChannelSidebar';
import {
  X,
  Check,
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
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
  Clock,
  Image,
  Info,
  Film,
  Video,
  Images
} from 'lucide-react';
import { FacebookAdForm } from './FacebookAdForm';
import { GoogleAdForm } from './GoogleAdForm';
import { WeekHourGrid } from './WeekHourGrid';

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

interface AdCreatorFullScreenProps {
  onClose: () => void;
  onSuccess: (msg: string) => void;
  initialObjective: string;
  initialType: string;
}

const allCtaOptions = [
  'Learn more',
  'Download now',
  'Check it out',
  'Install app now',
  'Install app',
  'Download',
  'Get it now',
  'Install now',
  'Download it now',
  'Play game',
  'Shop now',
  'Sign up'
];

export const AdCreatorFullScreen: React.FC<AdCreatorFullScreenProps> = ({
  onClose,
  onSuccess,
  initialObjective,
  initialType
}) => {
  const {
    accounts,
    materials,
    setMaterials,
    createCampaign,
    setDrafts,
    addLog,
    activeChannel
  } = useApp();

  const channelAccounts = accounts.filter(acc => (acc.channel || 'tiktok') === activeChannel);

  // Active step in left sub-menu
  const [activeStep, setActiveStep] = useState(1);

  // --- Facebook Meta Specific States ---
  const [campaignStatus, setCampaignStatus] = useState(true);
  const [fbPersonalAccount, setFbPersonalAccount] = useState('Bob Ze|984179864117084');
  const [fbPersonalAccountDropdownOpen, setFbPersonalAccountDropdownOpen] = useState(false);
  const [xmpProduct, setXmpProduct] = useState('');
  const [fbObjective, setFbObjective] = useState('应用推广');
  
  const [specialAdCategoryPopup, setSpecialAdCategoryPopup] = useState(false);
  const [selectedSpecialCategories, setSelectedSpecialCategories] = useState<string[]>([]);
  const [specialAdCategorySearch, setSpecialAdCategorySearch] = useState('');
  const [ios14CampaignOn, setIos14CampaignOn] = useState(false);
  const [campaignBiddingStrategy, setCampaignBiddingStrategy] = useState<'highest' | 'cost_target' | 'bid_cap' | 'roas'>('bid_cap'); // "竞价上限"
  const [deliveryScheduleOption, setDeliveryScheduleOption] = useState<'all_day' | 'scheduled'>('all_day'); // "全天投放广告"
  const [deliveryTypeOption, setDeliveryTypeOption] = useState<'uniform' | 'accelerated'>('uniform'); // "匀速"
  const [campaignSpendLimitOption, setCampaignSpendLimitOption] = useState<'unlimited' | 'custom'>('unlimited'); // "不限"
  const [campaignSpendLimitValue, setCampaignSpendLimitValue] = useState('');

  const [mobileAppStore, setMobileAppStore] = useState<'google_play' | 'app_store' | 'samsung' | 'amazon'>('app_store');
  const [selectedFbApp, setSelectedFbApp] = useState('');
  const [fbPixel, setFbPixel] = useState('154564887964_pixel_01');
  const [fbOptimizationGoal, setFbOptimizationGoal] = useState('purchase');

  // Dual Targeting/Excluding for regions
  const [selectedTargetRegions, setSelectedTargetRegions] = useState<string[]>([]);
  const [selectedExcludeRegions, setSelectedExcludeRegions] = useState<string[]>([]);
  const [regionsListTab, setRegionsListTab] = useState<'target' | 'exclude'>('target');
  const [financeRegionOption, setFinanceRegionOption] = useState('');
  const [beneficiaryTaiwan, setBeneficiaryTaiwan] = useState('');
  const [sponsorTaiwan, setSponsorTaiwan] = useState('');
  const [beneficiaryAustralia, setBeneficiaryAustralia] = useState('');
  const [sponsorAustralia, setSponsorAustralia] = useState('');
  const [beneficiarySingapore, setBeneficiarySingapore] = useState('');
  const [sponsorSingapore, setSponsorSingapore] = useState('');
  const [beneficiaryThailand, setBeneficiaryThailand] = useState('');
  const [sponsorThailand, setSponsorThailand] = useState('');
  const [beneficiaryEu, setBeneficiaryEu] = useState('');
  const [sponsorEu, setSponsorEu] = useState('');
  const [complianceTag, setComplianceTag] = useState('');

  // Placements Manual Toggle
  const [placementSettingMode, setPlacementSettingMode] = useState<'advanced' | 'manual'>('manual');
  const [activePlacementPlatform, setActivePlacementPlatform] = useState<'facebook' | 'messenger' | 'instagram' | 'audience_network'>('facebook');
  const [selectedManualPlacements, setSelectedManualPlacements] = useState<string[]>([
    'Facebook Marketplace', 'Facebook 视频动态', 'Instagram 发现', 'Instagram 发现首页', 'Messenger 收件箱', '发现 Facebook 商家'
  ]);

  // oCPM and bidding
  const [fbAttributionSetting, setFbAttributionSetting] = useState('click1day'); // 点击后1天内
  const [attributionPopupOn, setAttributionPopupOn] = useState(false);
  const [fbBiddingMinLimit, setFbBiddingMinLimit] = useState('');
  const [fbBiddingMaxLimit, setFbBiddingMaxLimit] = useState('');
  const [fbOptimizationGoalOption, setFbOptimizationGoalOption] = useState<'app_install' | 'app_event' | 'link_click' | 'value_max'>('app_install');
  const [fbValueRuleSet, setFbValueRuleSet] = useState('');
  const [fbBillingMethod, setFbBillingMethod] = useState<'impressions'>('impressions');
  const [fbScheduleOption, setFbScheduleOption] = useState<'now' | 'custom'>('now');
  const [attributionSearchQuery, setAttributionSearchQuery] = useState('');

  // Custom Audience popover & subsets
  const [fbTargetCustomAudiences, setFbTargetCustomAudiences] = useState<string[]>([]);
  const [fbExcludeCustomAudiences, setFbExcludeCustomAudiences] = useState<string[]>([]);
  const [customAudienceListTab, setCustomAudienceListTab] = useState<'target' | 'exclude'>('target');
  const [showCustomAudiencePopup, setShowCustomAudiencePopup] = useState(false);

  // Creative page and format
  const [fbPubPageType, setFbPubPageType] = useState<'all' | 'personal' | 'ad_account'>('ad_account');
  const [selectedFbPage, setSelectedFbPage] = useState('');
  const [fbUsePageIdentity, setFbUsePageIdentity] = useState(false);
  const [fbMultiAdvertiserAds, setFbMultiAdvertiserAds] = useState(false);
  const [fbWebsiteEventTracking, setFbWebsiteEventTracking] = useState('');
  const [fbDynamicCreativesOn, setFbDynamicCreativesOn] = useState(false);
  const [fbCreativeType, setFbCreativeType] = useState<'create_ad' | 'existing_post'>('create_ad');
  const [fbCreativeFormat, setFbCreativeFormat] = useState<'flexible' | 'single_media' | 'carousel'>('single_media');
  const [fbTargetDestination, setFbTargetDestination] = useState<'app' | 'trial'>('app');
  const [fbCreativeSetupMethod, setFbCreativeSetupMethod] = useState<'group' | 'material'>('group');
  const [delayDeepLink, setDelayDeepLink] = useState('');
  const [customProductPageId, setCustomProductPageId] = useState('');
  const [fbVideoOptimizeOption, setFbVideoOptimizeOption] = useState('全面优化(全选)');
  const [fbImageOptimizeOption, setFbImageOptimizeOption] = useState('全面优化(全选)');
  const [fbMultiLanguageOn, setFbMultiLanguageOn] = useState(false);
  const [fbActionCallOption, setFbActionCallOption] = useState('');
  const [fbAdTagsOption, setFbAdTagsOption] = useState('');
  
  // Custom expandable inputs arrays
  const [bodyCopywritingsList, setBodyCopywritingsList] = useState<string[]>(['']);
  const [headlineCopywritingsList, setHeadlineCopywritingsList] = useState<string[]>(['']);

  // --- Campaign States (Slide 1) ---
  const [campaignName, setCampaignName] = useState('');
  const [showAllCampaignBadges, setShowAllCampaignBadges] = useState(false);
  const [commoditySeries, setCommoditySeries] = useState(false);
  const [postPublishOn, setPostPublishOn] = useState(false);
  const [campaignBudgetOptimization, setCampaignBudgetOptimization] = useState(true);
  const [budgetType, setBudgetType] = useState<'daily' | 'lifetime'>('daily');
  const [budgetValue, setBudgetValue] = useState('50.00');

  // --- Delivery Content States (Slide 2) ---
  const [adGroupName, setAdGroupName] = useState('');
  const [selectedApplet, setSelectedApplet] = useState('');

  // --- Channel Code Configurations (Slide 3) ---
  const [channelGenerationMode, setChannelGenerationMode] = useState<'auto' | 'manual'>('auto');
  const [channelSharing, setChannelSharing] = useState<'shared' | 'independent'>('shared');
  const [selectedGame, setSelectedGame] = useState('0');
  const [selectedPlatform, setSelectedPlatform] = useState('0');
  const [selectedChannel, setSelectedChannel] = useState('');
  const [selectedTargetRegion, setSelectedTargetRegion] = useState('');
  const [pitcherText, setPitcherText] = useState('未选择投手');
  const [tagsText, setTagsText] = useState('');
  const [remarks, setRemarks] = useState('');

  // --- Geographic Groups (Slide 4) ---
  const [regionGroupName, setRegionGroupName] = useState('');
  const [regionSearchQuery, setRegionSearchQuery] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('不限');
  const [regionTags, setRegionTags] = useState('');

  // --- Placement States (Slide 5) ---
  const [selectedPlacement, setSelectedPlacement] = useState('TikTok');
  const [allowUserComments, setAllowUserComments] = useState(true);
  const [allowVideoDownload, setAllowVideoDownload] = useState(false);
  const [allowVideoShare, setAllowVideoShare] = useState(true);

  // --- Targeting Bundles (Slide 6) ---
  const [useExistingTargeting, setUseExistingTargeting] = useState(false);
  const [customPeopleMode, setCustomPeopleMode] = useState<'unlimited' | 'specified'>('unlimited');
  const [targetingGender, setTargetingGender] = useState<'unlimited' | 'male' | 'female'>('unlimited');
  const [targetingMinAge, setTargetingMinAge] = useState('18+');
  const [targetingInterestTag, setTargetingInterestTag] = useState('');
  const [targetingBundleName, setTargetingBundleName] = useState('');

  // --- TikTok Specific Targeting Bundles (Slide 6 style for TikTok) ---
  const [ttTargetingPackages, setTtTargetingPackages] = useState<Array<{
    id: string;
    name: string;
    useExisting: boolean;
    customPeopleMode: 'unlimited' | 'specified';
    gender: 'unlimited' | 'male' | 'female';
    minAge: string;
    interestTag: string;
  }>>([
    {
      id: 'tt_tp1',
      name: '定向包1',
      useExisting: false,
      customPeopleMode: 'unlimited',
      gender: 'unlimited',
      minAge: '18+',
      interestTag: ''
    }
  ]);
  const [activeTtTargetingPackageId, setActiveTtTargetingPackageId] = useState('tt_tp1');

  // --- OCPM Billing and Budgets (Slide 7) ---
  const [billingType, setBillingType] = useState('价值');
  const [selectedValueOption, setSelectedValueOption] = useState('广告收入价值');
  const [bidStrategy, setBidStrategy] = useState('Highest value');
  const [roasType, setRoasType] = useState('Day 0 ROAS');

  // --- TikTok Specific Standard App States ---
  const [ttPromotionType, setTtPromotionType] = useState<'app' | 'applet'>(
    initialType === '小程序' ? 'applet' : 'app'
  ); // 'app' = 常规应用, 'applet' = 小程序
  const [ttAppPlatform, setTtAppPlatform] = useState<'android' | 'ios'>('android');
  const [ttSelectedApp, setTtSelectedApp] = useState('完美大侠 (Perfect Hero) - Android');
  const [ttAppUrl, setTtAppUrl] = useState('https://play.google.com/store/apps/details?id=com.yuguo.perfecthero');
  const [ttBudgetType, setTtBudgetType] = useState<'unlimited' | 'daily' | 'lifetime'>('unlimited');
  const [ttPlacementMode, setTtPlacementMode] = useState<'auto' | 'manual'>('auto');
  const [ttSelectedPlacements, setTtSelectedPlacements] = useState<string[]>(['TikTok', 'Pangle', 'Global App Bundle']);
  const [ttAllowComments, setTtAllowComments] = useState(true);
  const [ttAllowVideoDownload, setTtAllowVideoDownload] = useState(false);
  const [ttAllowVideoShare, setTtAllowVideoShare] = useState(true);
  
  // TikTok OCPM Bidding states
  const [ttOptimizationGoal, setTtOptimizationGoal] = useState<'conversion' | 'install' | 'clicks' | 'event'>('install');
  const [ttOptimizationEvent, setTtOptimizationEvent] = useState<string>('purchase');
  const [ttBiddingMethod, setTtBiddingMethod] = useState<'lowest_cost' | 'cost_cap'>('lowest_cost');
  const [ttTargetBid, setTtTargetBid] = useState<string>('1.50');
  const [ttScheduleType, setTtScheduleType] = useState<'now' | 'custom'>('now');
  const [ttStartDate, setTtStartDate] = useState('2026-06-28');
  const [ttStartTime, setTtStartTime] = useState('11:17');
  const [ttEndDate, setTtEndDate] = useState('');

  // TikTok Tracking states (Monitoring)
  const [ttClickTrackingUrl, setTtClickTrackingUrl] = useState('https://click.adjust.com/cb/v1/tiktok?click_id=__TRACKING_ID__&ad_id=__AD_ID__&campaign_id=__CAMPAIGN_ID__&callback=__CALLBACK__');
  const [ttImpressionTrackingUrl, setTtImpressionTrackingUrl] = useState('https://view.adjust.com/cb/v1/tiktok?impression_id=__TRACKING_ID__&ad_id=__AD_ID__&campaign_id=__CAMPAIGN_ID__');
  const [ttVideoPlayTrackingUrl, setTtVideoPlayTrackingUrl] = useState('');

  // --- Optimized TikTok states ---
  const [ttBudgetEndDate, setTtBudgetEndDate] = useState('2026-07-05');
  const [ttBudgetEndTime, setTtBudgetEndTime] = useState('11:17');
  const [ttBudgetTimezone, setTtBudgetTimezone] = useState('UTC 0');
  const [ttGroupTagsExpanded, setTtGroupTagsExpanded] = useState(false);
  const [ttAdNameTagsExpanded, setTtAdNameTagsExpanded] = useState(false);
  const [ttIos14CampaignOn, setTtIos14CampaignOn] = useState(false);
  const [ttAppIntroPageOn, setTtAppIntroPageOn] = useState(false);
  const [ttAdvancedDedicatedCampaignOn, setTtAdvancedDedicatedCampaignOn] = useState(false);
  const [ttSkanAttributionOn, setTtSkanAttributionOn] = useState(true);
  const [ttAdAccount, setTtAdAccount] = useState('7598159223087939600');
  const [ttLoginUser, setTtLoginUser] = useState('739732451653960705');
  const [ttXmpProduct, setTtXmpProduct] = useState('完美大侠');
  const [ttAppAllocationMode, setTtAppAllocationMode] = useState<'unified' | 'by_account'>('unified');
  const [ttSelectedAppByAccount, setTtSelectedAppByAccount] = useState<Record<string, string>>({
    '7598159223087939600': '完美大侠 (Perfect Hero) - Android',
    '7397618729426878480': '极速钢琴节奏连连弹 (Piano Rhythms) - iOS'
  });
  const [ttCampaignType, setTtCampaignType] = useState<'manual' | 'smart' | 'smart_plus'>('manual');
  const [ttCboEnabled, setTtCboEnabled] = useState(true);
  const [ttBindTracking, setTtBindTracking] = useState(true);
  const [ttCarrier, setTtCarrier] = useState<'unlimited' | 'has_card'>('unlimited');
  const [ttTargetingPackageType, setTtTargetingPackageType] = useState<'unlimited' | 'custom'>('unlimited');
  const [ttTargetingAgeType, setTtTargetingAgeType] = useState<'unlimited' | 'custom'>('unlimited');
  const [ttSelectedAges, setTtSelectedAges] = useState<string[]>(['18-24', '25-34']);
  const [ttCustomPeopleType, setTtCustomPeopleType] = useState<'unlimited' | 'include' | 'exclude'>('unlimited');
  const [ttPlacement, setTtPlacement] = useState('TikTok');
  const [ttOptimizationGoalType, setTtOptimizationGoalType] = useState<'install' | 'event'>('install');
  const [ttBidType, setTtBidType] = useState<'lowest_cost' | 'cost_cap'>('lowest_cost');
  const [ttDeepOptGoal, setTtDeepOptGoal] = useState<'none' | 'app_event'>('none');
  const [ttBoundRule, setTtBoundRule] = useState<'none' | 'budget' | 'region'>('none');
  const [ttBudgetAllocMode, setTtBudgetAllocMode] = useState<'unified' | 'by_account'>('unified');
  const [ttAdGroupDailyBudget, setTtAdGroupDailyBudget] = useState('50');
  const [ttScheduleMode, setTtScheduleMode] = useState<'always' | 'custom'>('always');
  const [ttCreativeAllocMode, setTtCreativeAllocMode] = useState<'unified' | 'by_account'>('unified');
  const [ttLandingPageType, setTtLandingPageType] = useState<'tiktok_page' | 'external_link'>('tiktok_page');
  const [ttLandingPageTemplate, setTtLandingPageTemplate] = useState('template_1');
  const [ttCtaMode, setTtCtaMode] = useState<'standard' | 'dynamic'>('standard');
  const [ttSelectedCtaTexts, setTtSelectedCtaTexts] = useState<string[]>(['立即下载']);
  const [ttExternalLinkUrl, setTtExternalLinkUrl] = useState('https://play.google.com/store/apps/details?id=com.yuguo.perfecthero');

  // TikTok Channel Config States
  const [ttChannelGenMode, setTtChannelGenMode] = useState<'auto' | 'manual'>('auto');
  const [ttChannelSharingMode, setTtChannelSharingMode] = useState<'shared' | 'independent'>('shared');
  const [ttChannelGame, setTtChannelGame] = useState<string>('0');
  const [ttChannelPlatform, setTtChannelPlatform] = useState<string>('0');
  const [ttChannelSource, setTtChannelSource] = useState<string>('');
  const [ttChannelRegion, setTtChannelRegion] = useState<string>('');
  const [ttChannelRegionTouched, setTtChannelRegionTouched] = useState(false);
  const [ttChannelPitcher, setTtChannelPitcher] = useState<string>('');
  const [ttChannelLabel, setTtChannelLabel] = useState<string>('');
  const [ttChannelRemark, setTtChannelRemark] = useState<string>('');
  const [ttChannelManualCode, setTtChannelManualCode] = useState<string>('');
  const [ttChannelConfigured, setTtChannelConfigured] = useState(false);

  // TikTok Region Groups (Unified multiple regions support)
  const [ttRegionGroups, setTtRegionGroups] = useState<Array<{
    id: string;
    name: string;
    selectedRegions: string[];
    selectedLanguage: string;
    regionTags: string;
  }>>([
    {
      id: 'rg1',
      name: '地区组1',
      selectedRegions: ['沙特阿拉伯 (Saudi Arabia)'],
      selectedLanguage: '不限',
      regionTags: ''
    }
  ]);
  const [activeTtRegionGroupId, setActiveTtRegionGroupId] = useState('rg1');
  const [ttCountrySearchText, setTtCountrySearchText] = useState('');
  const [ttSelectExistingRegion, setTtSelectExistingRegion] = useState(false);

  // New TikTok Placements & Budget States
  const [ttSearchAdsEnabled, setTtSearchAdsEnabled] = useState(true);
  const [ttPangleBlocklistEnabled, setTtPangleBlocklistEnabled] = useState(false);
  const [ttBudgets, setTtBudgets] = useState<Array<{
    id: string;
    name: string;
    optimizationGoal: 'conversion' | 'install' | 'clicks' | 'event';
    clickAttributionWindow: string;
    deepAttributionWindow: string;
    viewAttributionWindow: string;
    eventCountType: string;
    pacing: string;
    timezone: string;
    startTimeType: 'now' | 'custom';
    endTimeType: 'lifetime' | 'custom';
    deliveryScheduleType: 'all_day' | 'custom';
    scheduleGrid?: boolean[][];
    targetRoasType?: 'day0' | 'day7';
    targetRoasValue?: string;
  }>>([
    {
      id: 'bg1',
      name: '出价和预算1',
      optimizationGoal: 'install',
      clickAttributionWindow: '7天 (点击)',
      deepAttributionWindow: '7天 (深度互动观看)',
      viewAttributionWindow: '1天 (展示)',
      eventCountType: '每一次',
      pacing: '标准',
      timezone: '请选择',
      startTimeType: 'now',
      endTimeType: 'lifetime',
      deliveryScheduleType: 'all_day',
      scheduleGrid: Array.from({ length: 7 }, () => Array(24).fill(false)),
      targetRoasType: 'day0',
      targetRoasValue: '120'
    }
  ]);
  const [activeTtBudgetId, setActiveTtBudgetId] = useState('bg1');

  // TikTok action modals & context menus state
  const [ttGenericActionModal, setTtGenericActionModal] = useState<{
    module: 'region' | 'budget' | 'creative_group' | null;
    type: 'rename' | 'batch_duplicate' | 'delete' | null;
    targetId: string | null;
    targetName: string | null;
    inputValue: string;
  }>({
    module: null,
    type: null,
    targetId: null,
    targetName: '',
    inputValue: ''
  });

  const [ttBudgetMenuOpenId, setTtBudgetMenuOpenId] = useState<string | null>(null);
  const [ttBudgetMenuCoords, setTtBudgetMenuCoords] = useState<{ top: number; left: number } | null>(null);

  const [ttCreativeGroupMenuOpenId, setTtCreativeGroupMenuOpenId] = useState<string | null>(null);
  const [ttCreativeGroupMenuCoords, setTtCreativeGroupMenuCoords] = useState<{ top: number; left: number } | null>(null);

  // --- Creatives Group States (Slide 8) ---
  const [ttCreativeGroups, setTtCreativeGroups] = useState<Array<{
    id: string;
    name: string;
    onlyAsAdDisplay: boolean;
    adCopywritingInput: string;
    targetLandingUrl: string;
    adCreativeTags: string;
    selectedCreativeIds: string[];
  }>>([
    {
      id: 'tcg1',
      name: '创意组1',
      onlyAsAdDisplay: true,
      adCopywritingInput: '请输入广告文案',
      targetLandingUrl: 'https://www.tiktok.com/minis/...',
      adCreativeTags: '',
      selectedCreativeIds: []
    }
  ]);
  const [activeTtCreativeGroupId, setActiveTtCreativeGroupId] = useState('tcg1');

  const activeTtCG = ttCreativeGroups.find(cg => cg.id === activeTtCreativeGroupId) || ttCreativeGroups[0];

  const creativeGroupName = activeTtCG.name;
  const setCreativeGroupName = (val: string | ((p: string) => string)) => {
    setTtCreativeGroups(prev => prev.map(cg => cg.id === activeTtCreativeGroupId ? { ...cg, name: typeof val === 'function' ? val(cg.name) : val } : cg));
  };

  const [selectedTikTokAccount, setSelectedTikTokAccount] = useState('');

  const onlyAsAdDisplay = activeTtCG.onlyAsAdDisplay;
  const setOnlyAsAdDisplay = (val: boolean | ((p: boolean) => boolean)) => {
    setTtCreativeGroups(prev => prev.map(cg => cg.id === activeTtCreativeGroupId ? { ...cg, onlyAsAdDisplay: typeof val === 'function' ? val(cg.onlyAsAdDisplay) : val } : cg));
  };

  const adCopywritingInput = activeTtCG.adCopywritingInput;
  const setAdCopywritingInput = (val: string | ((p: string) => string)) => {
    setTtCreativeGroups(prev => prev.map(cg => cg.id === activeTtCreativeGroupId ? { ...cg, adCopywritingInput: typeof val === 'function' ? val(cg.adCopywritingInput) : val } : cg));
  };

  const targetLandingUrl = activeTtCG.targetLandingUrl;
  const setTargetLandingUrl = (val: string | ((p: string) => string)) => {
    setTtCreativeGroups(prev => prev.map(cg => cg.id === activeTtCreativeGroupId ? { ...cg, targetLandingUrl: typeof val === 'function' ? val(cg.targetLandingUrl) : val } : cg));
  };

  const adCreativeTags = activeTtCG.adCreativeTags;
  const setAdCreativeTags = (val: string | ((p: string) => string)) => {
    setTtCreativeGroups(prev => prev.map(cg => cg.id === activeTtCreativeGroupId ? { ...cg, adCreativeTags: typeof val === 'function' ? val(cg.adCreativeTags) : val } : cg));
  };

  const selectedCreativeIds = activeTtCG.selectedCreativeIds;
  const setSelectedCreativeIds = (val: string[] | ((p: string[]) => string[])) => {
    setTtCreativeGroups(prev => prev.map(cg => cg.id === activeTtCreativeGroupId ? { ...cg, selectedCreativeIds: typeof val === 'function' ? val(cg.selectedCreativeIds) : val } : cg));
  };

  // --- New TikTok Creative & Group optimizations states ---
  const [ttSmartCreativeEnabled, setTtSmartCreativeEnabled] = useState(false);
  const [ttAutoGenAdNameByFile, setTtAutoGenAdNameByFile] = useState(false);
  const [ttSparkAdsEnabled, setTtSparkAdsEnabled] = useState(false);
  const [ttInnovativeStyleEnabled, setTtInnovativeStyleEnabled] = useState(false);
  const [ttCustomIdentities, setTtCustomIdentities] = useState<Record<string, string>>({
    '7598159223087939600': '',
    '7397618729426878480': ''
  });

  const [ttPlacementsDropdownOpen, setTtPlacementsDropdownOpen] = useState(false);

  const [ttBindAccountsType, setTtBindAccountsType] = useState('全部');
  const [ttSelectExistingCreativeGroup, setTtSelectExistingCreativeGroup] = useState(false);
  
  const [ttPlayableAssets, setTtPlayableAssets] = useState<Record<string, string>>({
    '7598159223087939600': '',
    '7397618729426878480': ''
  });
  const [ttDeferredDeepLink, setTtDeferredDeepLink] = useState('');
  const [ttCtaType, setTtCtaType] = useState<'standard' | 'dynamic'>('standard');
  const [ttCtaSelectedAction, setTtCtaSelectedAction] = useState('查看详情');
  const [ttCtaDropdownOpen, setTtCtaDropdownOpen] = useState(false);
  const [ttCtaDynamicSelected, setTtCtaDynamicSelected] = useState<string[]>([
    'Learn more', 'Download now', 'Check it out', 'Install app now',
    'Install app', 'Download', 'Get it now', 'Install now',
    'Download it now', 'Play game'
  ]);
  const [ttCtaDynamicSearch, setTtCtaDynamicSearch] = useState('');
  const [ttTagsSelected, setTtTagsSelected] = useState('');
  const [materialSelectorType, setMaterialSelectorType] = useState<'video' | 'image' | 'carousel' | null>(null);

  const [adCreativeName, setAdCreativeName] = useState('');
  const [innovativeStyleEnabled, setInnovativeStyleEnabled] = useState(true);
  const [interactiveStyle, setInteractiveStyle] = useState<'create_now' | 'from_library'>('create_now');
  const [cardStyle, setCardStyle] = useState<'image_card'>('image_card');

  const handleInsertTagToAdCreativeName = (tag: string) => {
    setAdCreativeName(prev => {
      return prev + tag;
    });
  };

  // --- Google Specific Optimization States ---
  const [googleCampaignType, setGoogleCampaignType] = useState('app');
  const [googleCampaignSubtype, setGoogleCampaignSubtype] = useState('app_install');
  const [googlePlatform, setGooglePlatform] = useState('android');
  const [googleAccount, setGoogleAccount] = useState('雨果-GridMaster-01');
  const [googleXmpProduct, setGoogleXmpProduct] = useState('');
  const [googleApp, setGoogleApp] = useState('');
  const [googleCampaignName, setGoogleCampaignName] = useState('{创意组名称}_{广告系列子类型}');
  
  // Create App Modal
  const [isCreateAppModalOpen, setIsCreateAppModalOpen] = useState(false);
  const [createAppPlatform, setCreateAppPlatform] = useState<'android' | 'ios'>('android');
  const [createAppPackage, setCreateAppPackage] = useState('');
  const [googleCreatedApps, setGoogleCreatedApps] = useState<string[]>([
    'com.moonton.mobilelegends (王者对决国际版)',
    'com.supercell.clashofclans (部落冲突)'
  ]);

  // Google Region Groups
  const [googleRegionGroups, setGoogleRegionGroups] = useState<Array<{
    id: string;
    name: string;
    selectedRegions: string[]; // list of country names selected
    excludedRegions: string[];
    isSpecifiedRegion: boolean;
    languageOption: 'all' | 'specified';
    selectedLanguages: string[];
    targetOption: string;
    excludeOption: string;
    selectedTag: string;
  }>>([
    {
      id: 'rg1',
      name: '地区组1',
      selectedRegions: ['美国'],
      excludedRegions: [],
      isSpecifiedRegion: true,
      languageOption: 'all',
      selectedLanguages: [],
      targetOption: 'target_presence',
      excludeOption: '',
      selectedTag: ''
    }
  ]);
  const [activeGoogleRegionGroupId, setActiveGoogleRegionGroupId] = useState('rg1');
  const [isExistingRegionChecked, setIsExistingRegionChecked] = useState(false);
  const [googleRegionSearch, setGoogleRegionSearch] = useState('');
  const [googleLanguageDropdownOpen, setGoogleLanguageDropdownOpen] = useState(false);

  // Google Ad Group (广告组)
  const [googleAdGroupName, setGoogleAdGroupName] = useState('');
  const [isGoogleAdGroupExpanded, setIsGoogleAdGroupExpanded] = useState(false);

  // Google Creative Group (创意组)
  const [googleCreativeGroups, setGoogleCreativeGroups] = useState<Array<{
    id: string;
    name: string;
    videos: string[];
    images: string[];
    html5s: string[];
    titles: string[];
    descriptions: string[];
    deepLink: string;
    tag: string;
  }>>([
    {
      id: 'cg1',
      name: '创意组1',
      videos: [],
      images: [],
      html5s: [],
      titles: ['', ''], // 2/5 initial titles
      descriptions: [''], // 1/5 initial descriptions
      deepLink: '',
      tag: ''
    }
  ]);
  const [activeGoogleCreativeGroupId, setActiveGoogleCreativeGroupId] = useState('cg1');
  const [isExistingCreativeChecked, setIsExistingCreativeChecked] = useState(false);

  // --- Facebook 5-Step Unified States ---
  const [fbCampaignType, setFbCampaignType] = useState<'app' | 'web'>('app');
  const [fbCampaignSubtype, setFbCampaignSubtype] = useState<'app_install' | 'app_event' | 'pre_register'>('app_install');
  const [fbPlatform, setFbPlatform] = useState<'android' | 'ios'>('android');
  const [fbAdAccount, setFbAdAccount] = useState('HoleDrop-雨果-01');
  const [fbXmpProduct, setFbXmpProduct] = useState('Perfect Avenger - Idle games');
  const [fbApp, setFbApp] = useState('perfect-avenger');
  const [fbCampaignName, setFbCampaignName] = useState('Campaign-Perfect Avenger-Idle games');

  const [fbRegionGroups, setFbRegionGroups] = useState<Array<{
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
  }>>([
    {
      id: 'rg1',
      name: '地区组1',
      selectedRegions: ['美国'],
      excludedRegions: [],
      isSpecifiedRegion: true,
      languageOption: 'all',
      selectedLanguages: [],
      targetOption: '此位置或对其感兴趣的用户(推荐)',
      excludeOption: '此位置或对其感兴趣的用户(推荐)',
      selectedTag: ''
    }
  ]);
  const [activeFbRegionGroupId, setActiveFbRegionGroupId] = useState('rg1');
  const [isFbExistingRegionChecked, setIsFbExistingRegionChecked] = useState(false);
  const [fbRegionSearch, setFbRegionSearch] = useState('');
  const [fbLanguageDropdownOpen, setFbLanguageDropdownOpen] = useState(false);

  const [fbOptGoal, setFbOptGoal] = useState<'installs' | 'actions' | 'value'>('installs');
  const [fbInstallTracker, setFbInstallTracker] = useState('perfect-avenger - Perfect Avenger - idle games');
  const [fbActionEvent, setFbActionEvent] = useState('perfect-avenger - Perfect Avenger - idle games');
  const [fbTargetUserType, setFbTargetUserType] = useState<'all' | 'new' | 'returning'>('all');
  const [fbDailyBudget, setFbDailyBudget] = useState('50');
  const [fbBidType, setFbBidType] = useState<'tcpi' | 'maximize'>('tcpi');
  const [fbBidType2, setFbBidType2] = useState<'tcpa' | 'maximize'>('tcpa');
  const [fbBidValue, setFbBidValue] = useState('2.5');
  const [fbBidValue2, setFbBidValue2] = useState('3.0');
  const [fbTroasPercent, setFbTroasPercent] = useState('200');
  const [fbStartDateType, setFbStartDateType] = useState<'now' | 'custom'>('now');
  const [fbStartDate, setFbStartDate] = useState('2026-06-23');
  const [fbEndDateType, setFbEndDateType] = useState<'long' | 'custom'>('long');
  const [fbEndDate, setFbEndDate] = useState('长期');

  const [fbAdGroupName, setFbAdGroupName] = useState('Adgroup-Perfect Avenger-Idle games');

  const [fbCreativeGroups, setFbCreativeGroups] = useState<Array<{
    id: string;
    name: string;
    videos: string[];
    images: string[];
    html5s: string[];
    titles: string[];
    descriptions: string[];
    deepLink: string;
    tag: string;
  }>>([
    {
      id: 'cg1',
      name: '创意组1',
      videos: [],
      images: [],
      html5s: [],
      titles: ['', ''], // 2 initial empty slots
      descriptions: [''], // 1 initial empty slot
      deepLink: '',
      tag: ''
    }
  ]);
  const [activeFbCreativeGroupId, setActiveFbCreativeGroupId] = useState('cg1');
  const [isFbExistingCreativeChecked, setIsFbExistingCreativeChecked] = useState(false);

  const [fbProductSearchQuery, setFbProductSearchQuery] = useState('');
  const [fbProductDropdownOpen, setFbProductDropdownOpen] = useState(false);
  const [fbAppDropdownOpen, setFbAppDropdownOpen] = useState(false);

  const [isFbMaterialPickerOpen, setIsFbMaterialPickerOpen] = useState(false);
  const [fbMaterialPickerType, setFbMaterialPickerType] = useState<'video' | 'image' | 'html5'>('video');
  const [fbActiveCreativeGroupIdForPicker, setFbActiveCreativeGroupIdForPicker] = useState('cg1');

  // Additional Facebook Specific States for high-fidelity mirroring of codebuddy fields
  const [fbAdAccountsSelected, setFbAdAccountsSelected] = useState<string[]>(['丽莲-Pixel (984179864117084)']);
  const [fbAdAccountsDropdownOpen, setFbAdAccountsDropdownOpen] = useState(false);
  const [fbSpecialCatSelected, setFbSpecialCatSelected] = useState<string[]>([]);
  const [fbSpecialCatDropdownOpen, setFbSpecialCatDropdownOpen] = useState(false);
  const [fbSpecialRegions, setFbSpecialRegions] = useState<string[]>([]);
  const [fbSpecialRegionsExclude, setFbSpecialRegionsExclude] = useState<string[]>([]);
  const [fbSpecialRegionTab, setFbSpecialRegionTab] = useState<'include' | 'exclude'>('include');
  const [fbSpecialRegionSearch, setFbSpecialRegionSearch] = useState('');
  const [fbCampaignStatus, setFbCampaignStatus] = useState(true);
  const [fbIos14Campaign, setFbIos14Campaign] = useState(false);
  const [fbCboEnabled, setFbCboEnabled] = useState(false);
  const [fbCampaignBudgetType, setFbCampaignBudgetType] = useState<'daily' | 'lifetime'>('daily');
  const [fbCampaignBidStrategy, setFbCampaignBidStrategy] = useState('highest_volume');
  const [fbCampaignPacing, setFbCampaignPacing] = useState('standard');
  const [fbCampaignSchedule, setFbCampaignSchedule] = useState('all_time');
  const [fbCampaignSpendingLimitType, setFbCampaignSpendingLimitType] = useState<'none' | 'custom'>('none');
  const [fbCampaignSpendingLimit, setFbCampaignSpendingLimit] = useState('1000');
  const [fbCampaignExtraHintsOpen, setFbCampaignExtraHintsOpen] = useState(false);

  const [fbAdGroupStatus, setFbAdGroupStatus] = useState(true);
  const [fbStore, setFbStore] = useState('app_store');
  const [fbAppPackage, setFbAppPackage] = useState('com.example.app1');
  const [fbPlacementSetting, setFbPlacementSetting] = useState<'adv_plus' | 'manual'>('adv_plus');
  const [fbPlatformsSelected, setFbPlatformsSelected] = useState<string[]>(['facebook', 'messenger', 'instagram', 'audience_network']);
  const [fbPlacementsChecked, setFbPlacementsChecked] = useState<string[]>([
    'feeds', 'reels', 'reels_overlay', 'search', 'instant_articles', 'sponsored_messages', 'instagram_explore', 'messenger_inbox'
  ]);
  const [fbAdGroupExtraHintsOpen, setFbAdGroupExtraHintsOpen] = useState(false);

  const [fbRegionDualTab, setFbRegionDualTab] = useState<'include' | 'exclude'>('include');
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

  const [fbTargetingPackages, setFbTargetingPackages] = useState<Array<{
    id: string;
    name: string;
    customAudienceType: 'all' | 'custom';
    customAudiences: string[];
    minAge: string;
    suggestedAge: string;
    ageMinVal: string;
    ageMaxVal: string;
    gender: 'all' | 'male' | 'female';
    detailedTargeting: 'all' | 'custom';
    languages: string[];
    includedDevices: string[];
    excludedDevices: string[];
    osVersion: string;
    wifiOnly: boolean;
    tag: string;
  }>>([
    {
      id: 'tp1',
      name: '定向包1',
      customAudienceType: 'all',
      customAudiences: [],
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
  const [activeFbTargetingPackageId, setActiveFbTargetingPackageId] = useState('tp1');
  const [isFbExistingTargetingChecked, setIsFbExistingTargetingChecked] = useState(false);
  const [fbAdvantageAudienceEnabled, setFbAdvantageAudienceEnabled] = useState(true);

  const [fbBudgets, setFbBudgets] = useState<FbBudget[]>([
    {
      id: 'b1',
      name: '出价和预算1',
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
  const [activeFbBudgetId, setActiveFbBudgetId] = useState('b1');

  const [fbBidControl, setFbBidControl] = useState('');
  const [fbAttribution, setFbAttribution] = useState('7d_click_1d_view');
  const [fbBillingEvent, setFbBillingEvent] = useState('impressions');
  const [fbGroupSpendingLimit, setFbGroupSpendingLimit] = useState('');

  const [fbAdName, setFbAdName] = useState('Ad-Perfect Avenger-Idle games');
  const [fbAdStatus, setFbAdStatus] = useState(true);
  const [fbPageType, setFbPageType] = useState('all_pages');
  const [fbPageSelected, setFbPageSelected] = useState('Perfect Avenger Official');
  const [fbUsePageAsAdIdentity, setFbUsePageAsAdIdentity] = useState(true);

  const [fbDynamicCreative, setFbDynamicCreative] = useState(false);
  const [fbCreativeDestination, setFbCreativeDestination] = useState<'app' | 'playable'>('app');
  const [fbCreativeSettingMethod, setFbCreativeSettingMethod] = useState<'group' | 'material'>('group');
  const [fbCollaborativeAds, setFbCollaborativeAds] = useState(false);
  const [fbExistingPostId, setFbExistingPostId] = useState('');
  const [fbMultiLanguageEnabled, setFbMultiLanguageEnabled] = useState(false);
  const [fbOptimizeCreativePerUser, setFbOptimizeCreativePerUser] = useState(true);
  const [fbCreativeTagSelected, setFbCreativeTagSelected] = useState('');

  // Simulation loading for Region search
  const [isSearchingRegions, setIsSearchingRegions] = useState(false);

  // Split rules configuration states (supporting cross and free binding modes)
  const [isSplitRulesModalOpen, setIsSplitRulesModalOpen] = useState(false);
  const [splitMode, setSplitMode] = useState<'cross' | 'free'>('cross');
  const [splitLevels, setSplitLevels] = useState<{
    region: 'campaign' | 'adgroup';
    targeting: 'campaign' | 'adgroup';
    budget: 'campaign' | 'adgroup';
    creative: 'campaign' | 'adgroup' | 'ad';
  }>({
    region: 'adgroup',
    targeting: 'adgroup',
    budget: 'adgroup',
    creative: 'adgroup'
  });
  const [boundTargeting, setBoundTargeting] = useState<string>('none'); // 'none' or 'region'
  const [boundBudget, setBoundBudget] = useState<string>('none'); // 'none' or 'region'
  const [boundCreative, setBoundCreative] = useState<string>('none'); // 'none' or 'region'

  // Reference hooks matching step cards
  const steps = [
    { id: 1, label: '基础设置', ref: useRef<HTMLDivElement>(null) },
    { id: 2, label: '广告系列', ref: useRef<HTMLDivElement>(null) },
    { id: 3, label: '投放内容', ref: useRef<HTMLDivElement>(null) },
    { id: 4, label: '渠道号配置', ref: useRef<HTMLDivElement>(null) },
    { id: 5, label: '地区组', ref: useRef<HTMLDivElement>(null) },
    { id: 6, label: '版位', ref: useRef<HTMLDivElement>(null) },
    { id: 7, label: '定向包', ref: useRef<HTMLDivElement>(null) },
    { id: 8, label: '出价和预算', ref: useRef<HTMLDivElement>(null) },
    { id: 9, label: '创意设置', ref: useRef<HTMLDivElement>(null) },
    { id: 10, label: '创意组', ref: useRef<HTMLDivElement>(null) },
    { id: 11, label: '监控模块', ref: useRef<HTMLDivElement>(null) }
  ];

  // Set default state variables
  useEffect(() => {
    if (channelAccounts.length > 0) {
      setSelectedTikTokAccount(channelAccounts[0].tiktokAccount);
    }
  }, [accounts, activeChannel]);

  // Append Dynamic tags in Campaign inputs
  const handleInsertTagToCampaign = (tag: string) => {
    setCampaignName(prev => {
      if (prev === '请输入') return tag;
      return prev + tag;
    });
  };

  const handleInsertTagToAdGroup = (tag: string) => {
    setAdGroupName(prev => {
      if (prev === '请输入') return tag;
      return prev + tag;
    });
  };

  // TikTok Region Groups Action Handlers
  const handleAddTtRegionGroup = () => {
    const nextId = `rg_${Date.now()}`;
    const nextNum = ttRegionGroups.length + 1;
    setTtRegionGroups(prev => [
      ...prev,
      {
        id: nextId,
        name: `地区组${nextNum}`,
        selectedRegions: [],
        selectedLanguage: '不限',
        regionTags: ''
      }
    ]);
    setActiveTtRegionGroupId(nextId);
  };

  const handleDuplicateTtRegionGroup = (id: string) => {
    const source = ttRegionGroups.find(rg => rg.id === id);
    if (!source) return;
    const nextId = `rg_${Date.now()}_copy`;
    setTtRegionGroups(prev => {
      const index = prev.findIndex(rg => rg.id === id);
      const copy = {
        ...source,
        id: nextId,
        name: `${source.name} - 副本`,
        selectedRegions: [...source.selectedRegions]
      };
      const result = [...prev];
      result.splice(index + 1, 0, copy);
      return result;
    });
    setActiveTtRegionGroupId(nextId);
  };

  const handleBatchDuplicateTtRegionGroup = (id: string, count: number) => {
    if (isNaN(count) || count <= 0) return;
    const source = ttRegionGroups.find(rg => rg.id === id);
    if (!source) return;
    
    const now = Date.now();
    setTtRegionGroups(prev => {
      const index = prev.findIndex(rg => rg.id === id);
      const copies = [];
      for (let i = 1; i <= count; i++) {
        copies.push({
          ...source,
          id: `rg_${now}_copy_${i}`,
          name: `${source.name} - 副本${i}`,
          selectedRegions: [...source.selectedRegions],
          selectedLanguage: source.selectedLanguage,
          regionTags: source.regionTags
        });
      }
      const result = [...prev];
      result.splice(index + 1, 0, ...copies);
      return result;
    });
  };

  const handleDeleteTtRegionGroup = (id: string) => {
    if (ttRegionGroups.length <= 1) {
      alert('必须保留至少一个地区组！');
      return;
    }
    const filtered = ttRegionGroups.filter(rg => rg.id !== id);
    setTtRegionGroups(filtered);
    if (activeTtRegionGroupId === id) {
      setActiveTtRegionGroupId(filtered[0].id);
    }
  };

  // TikTok Bidding & Budget handlers
  const handleAddTtBudget = () => {
    if (ttBudgets.length >= 10) {
      alert('最多只能创建 10 个出价和预算包');
      return;
    }
    const newId = 'bg_' + Date.now();
    const nextNum = ttBudgets.length + 1;
    const newBudget = {
      id: newId,
      name: `出价和预算${nextNum}`,
      optimizationGoal: ttOptimizationGoal,
      clickAttributionWindow: '7天 (点击)',
      deepAttributionWindow: '7天 (深度互动观看)',
      viewAttributionWindow: '1天 (展示)',
      eventCountType: '每一次',
      pacing: '标准',
      timezone: '请选择',
      startTimeType: 'now' as const,
      endTimeType: 'lifetime' as const,
      deliveryScheduleType: 'all_day' as const,
      scheduleGrid: Array.from({ length: 7 }, () => Array(24).fill(false)),
      targetRoasType: 'day0' as const,
      targetRoasValue: '120'
    };
    setTtBudgets([...ttBudgets, newBudget]);
    setActiveTtBudgetId(newId);
  };

  const handleDuplicateTtBudget = (id: string) => {
    const source = ttBudgets.find(b => b.id === id);
    if (!source) return;
    const nextId = `bg_${Date.now()}_copy`;
    setTtBudgets(prev => {
      const index = prev.findIndex(b => b.id === id);
      const copy = {
        ...source,
        id: nextId,
        name: `${source.name} - 副本`
      };
      if (source.scheduleGrid) {
        copy.scheduleGrid = source.scheduleGrid.map(row => [...row]);
      }
      const result = [...prev];
      result.splice(index + 1, 0, copy);
      return result;
    });
    setActiveTtBudgetId(nextId);
  };

  const handleBatchDuplicateTtBudget = (id: string, count: number) => {
    if (isNaN(count) || count <= 0) return;
    const source = ttBudgets.find(b => b.id === id);
    if (!source) return;
    const now = Date.now();
    setTtBudgets(prev => {
      const index = prev.findIndex(b => b.id === id);
      const copies = [];
      for (let i = 1; i <= count; i++) {
        const copy = {
          ...source,
          id: `bg_${now}_copy_${i}`,
          name: `${source.name} - 副本${i}`
        };
        if (source.scheduleGrid) {
          copy.scheduleGrid = source.scheduleGrid.map(row => [...row]);
        }
        copies.push(copy);
      }
      const result = [...prev];
      result.splice(index + 1, 0, ...copies);
      return result;
    });
  };

  const handleDeleteTtBudget = (id: string) => {
    if (ttBudgets.length <= 1) {
      alert('必须保留至少一个出价和预算组！');
      return;
    }
    const filtered = ttBudgets.filter(b => b.id !== id);
    setTtBudgets(filtered);
    if (activeTtBudgetId === id) {
      setActiveTtBudgetId(filtered[0].id);
    }
  };

  // TikTok Creative Group handlers
  const handleAddTtCreativeGroup = () => {
    const nextId = `tcg_${Date.now()}`;
    const nextNum = ttCreativeGroups.length + 1;
    setTtCreativeGroups(prev => [
      ...prev,
      {
        id: nextId,
        name: `创意组${nextNum}`,
        onlyAsAdDisplay: true,
        adCopywritingInput: '请输入广告文案',
        targetLandingUrl: 'https://www.tiktok.com/minis/...',
        adCreativeTags: '',
        selectedCreativeIds: []
      }
    ]);
    setActiveTtCreativeGroupId(nextId);
  };

  const handleDuplicateTtCreativeGroup = (id: string) => {
    const source = ttCreativeGroups.find(cg => cg.id === id);
    if (!source) return;
    const nextId = `tcg_${Date.now()}_copy`;
    setTtCreativeGroups(prev => {
      const index = prev.findIndex(cg => cg.id === id);
      const copy = {
        ...source,
        id: nextId,
        name: `${source.name} - 副本`,
        selectedCreativeIds: [...source.selectedCreativeIds]
      };
      const result = [...prev];
      result.splice(index + 1, 0, copy);
      return result;
    });
    setActiveTtCreativeGroupId(nextId);
  };

  const handleBatchDuplicateTtCreativeGroup = (id: string, count: number) => {
    if (isNaN(count) || count <= 0) return;
    const source = ttCreativeGroups.find(cg => cg.id === id);
    if (!source) return;
    const now = Date.now();
    setTtCreativeGroups(prev => {
      const index = prev.findIndex(cg => cg.id === id);
      const copies = [];
      for (let i = 1; i <= count; i++) {
        copies.push({
          ...source,
          id: `tcg_${now}_copy_${i}`,
          name: `${source.name} - 副本${i}`,
          selectedCreativeIds: [...source.selectedCreativeIds]
        });
      }
      const result = [...prev];
      result.splice(index + 1, 0, ...copies);
      return result;
    });
  };

  const handleDeleteTtCreativeGroup = (id: string) => {
    if (ttCreativeGroups.length <= 1) {
      alert('必须保留至少一个创意组！');
      return;
    }
    const filtered = ttCreativeGroups.filter(cg => cg.id !== id);
    setTtCreativeGroups(filtered);
    if (activeTtCreativeGroupId === id) {
      setActiveTtCreativeGroupId(filtered[0].id);
    }
  };

  const visibleSteps = activeChannel === 'google'
    ? [
        { id: 1, label: '基础设置', ref: steps[0].ref },
        { id: 4, label: '渠道号配置', ref: steps[3].ref },
        { id: 5, label: '地区组', ref: steps[4].ref },
        { id: 8, label: '出价和预算', ref: steps[7].ref },
        { id: 3, label: '广告组', ref: steps[2].ref },
        { id: 10, label: '创意组', ref: steps[9].ref }
      ]
    : activeChannel === 'facebook'
    ? [
        { id: 1, label: '基础设置', ref: steps[0].ref },
        { id: 2, label: '广告系列', ref: steps[1].ref },
        { id: 3, label: '投放内容', ref: steps[2].ref },
        { id: 4, label: '渠道号配置', ref: steps[3].ref },
        { id: 5, label: '地区组', ref: steps[4].ref },
        { id: 6, label: '版位', ref: steps[5].ref },
        { id: 7, label: '定向包', ref: steps[6].ref },
        { id: 8, label: '出价和预算', ref: steps[7].ref },
        { id: 9, label: '创意设置', ref: steps[8].ref },
        { id: 10, label: '创意组', ref: steps[9].ref }
      ]
    : activeChannel === 'tiktok'
    ? (ttPromotionType === 'applet'
        ? [
            { id: 1, label: '基础设置', ref: steps[0].ref }
          ]
        : [
            { id: 1, label: '基础设置', ref: steps[0].ref },
            { id: 2, label: '推广系列', ref: steps[1].ref },
            { id: 3, label: '投放内容', ref: steps[2].ref },
            { id: 4, label: '渠道号配置', ref: steps[3].ref },
            { id: 7, label: '定向包', ref: steps[6].ref },
            { id: 5, label: '地区组', ref: steps[4].ref },
            { id: 8, label: '出价和预算', ref: steps[7].ref },
            { id: 9, label: '创意设置', ref: steps[8].ref },
            { id: 10, label: '创意组', ref: steps[9].ref },
            { id: 11, label: '监控模块', ref: steps[10].ref }
          ]
      )
    : steps;

  // Cartesian combinations estimation
  const accountFactor = activeChannel === 'google'
    ? (googleAccount ? 1 : 0)
    : (activeChannel === 'facebook' ? (fbAdAccount ? 1 : 0) : (channelAccounts.length > 0 ? 1 : 0));

  const regionFactor = activeChannel === 'google'
    ? googleRegionGroups.length
    : (activeChannel === 'facebook'
      ? fbRegionGroups.length
      : ttRegionGroups.length);

  const targetingFactor = activeChannel === 'google'
    ? 1
    : (activeChannel === 'facebook'
      ? fbTargetingPackages.length
      : ttTargetingPackages.length);

  const budgetFactor = activeChannel === 'facebook' ? fbBudgets.length : 1;

  const creativeFactor = activeChannel === 'google'
    ? googleCreativeGroups.length
    : (activeChannel === 'facebook'
      ? fbCreativeGroups.length
      : (selectedCreativeIds.length > 0 ? selectedCreativeIds.length : 1));

  // Compute based on split rules
  const activeRegionGroup = ttRegionGroups.find(g => g.id === activeTtRegionGroupId) || ttRegionGroups[0];
  const activeBudget = ttBudgets.find(b => b.id === activeTtBudgetId) || ttBudgets[0];
  const updateActiveBudget = (updater: (b: typeof ttBudgets[0]) => Partial<typeof ttBudgets[0]>) => {
    setTtBudgets(prev => prev.map(b => b.id === activeTtBudgetId ? { ...b, ...updater(b) } : b));
  };

  let totalCampaignsEstimated = 1;
  let totalAdGroupsEstimated = 1;
  let totalAdsEstimated = 1;

  if (activeChannel === 'facebook') {
    if (splitMode === 'cross') {
      // Campaign multiplier
      let campaignMult = 1;
      if (splitLevels.region === 'campaign') campaignMult *= regionFactor;
      if (splitLevels.targeting === 'campaign') campaignMult *= targetingFactor;
      if (splitLevels.budget === 'campaign') campaignMult *= budgetFactor;
      if (splitLevels.creative === 'campaign') campaignMult *= creativeFactor;
      totalCampaignsEstimated = campaignMult;

      // AdGroup per campaign multiplier
      let adGroupMult = 1;
      if (splitLevels.region === 'adgroup') adGroupMult *= regionFactor;
      if (splitLevels.targeting === 'adgroup') adGroupMult *= targetingFactor;
      if (splitLevels.budget === 'adgroup') adGroupMult *= budgetFactor;
      if (splitLevels.creative === 'adgroup') adGroupMult *= creativeFactor;
      totalAdGroupsEstimated = totalCampaignsEstimated * adGroupMult;

      // Ads per adgroup multiplier
      let adsPerAdGroup = 1;
      if (splitLevels.creative === 'ad') adsPerAdGroup *= creativeFactor;
      totalAdsEstimated = totalAdGroupsEstimated * adsPerAdGroup;
    } else {
      // Free binding mode
      // baseGroup incorporates region and any bound dimensions
      let baseGroupCount = regionFactor;
      let baseGroupSplit: 'campaign' | 'adgroup' = splitLevels.region;

      if (boundTargeting === 'region') {
        baseGroupCount = Math.max(baseGroupCount, targetingFactor);
        if (splitLevels.targeting === 'campaign') baseGroupSplit = 'campaign';
      }
      if (boundBudget === 'region') {
        baseGroupCount = Math.max(baseGroupCount, budgetFactor);
        if (splitLevels.budget === 'campaign') baseGroupSplit = 'campaign';
      }
      if (boundCreative === 'region') {
        baseGroupCount = Math.max(baseGroupCount, creativeFactor);
        if (splitLevels.creative === 'campaign') baseGroupSplit = 'campaign';
      }

      const unboundTargetingCount = boundTargeting === 'none' ? targetingFactor : 1;
      const unboundBudgetCount = boundBudget === 'none' ? budgetFactor : 1;
      const unboundCreativeCount = boundCreative === 'none' ? creativeFactor : 1;

      // Campaigns calculation
      let campaignMult = 1;
      if (baseGroupSplit === 'campaign') campaignMult *= baseGroupCount;
      if (boundTargeting === 'none' && splitLevels.targeting === 'campaign') campaignMult *= unboundTargetingCount;
      if (boundBudget === 'none' && splitLevels.budget === 'campaign') campaignMult *= unboundBudgetCount;
      if (boundCreative === 'none' && splitLevels.creative === 'campaign') campaignMult *= unboundCreativeCount;
      totalCampaignsEstimated = campaignMult;

      // AdGroups calculation
      let adGroupMult = 1;
      if (baseGroupSplit === 'adgroup') adGroupMult *= baseGroupCount;
      if (boundTargeting === 'none' && splitLevels.targeting === 'adgroup') adGroupMult *= unboundTargetingCount;
      if (boundBudget === 'none' && splitLevels.budget === 'adgroup') adGroupMult *= unboundBudgetCount;
      if (boundCreative === 'none' && splitLevels.creative === 'adgroup') adGroupMult *= unboundCreativeCount;
      totalAdGroupsEstimated = totalCampaignsEstimated * adGroupMult;

      // Ads calculation
      let adsPerAdGroup = 1;
      if (boundCreative === 'none' && splitLevels.creative === 'ad') {
        adsPerAdGroup *= unboundCreativeCount;
      } else if (boundCreative === 'region' && splitLevels.creative === 'ad') {
        adsPerAdGroup *= creativeFactor;
      }
      totalAdsEstimated = totalAdGroupsEstimated * adsPerAdGroup;
    }
  } else {
    // Non-facebook default logic
    totalCampaignsEstimated = 1;
    totalAdGroupsEstimated = regionFactor * targetingFactor;
    totalAdsEstimated = totalAdGroupsEstimated * creativeFactor;
  }

  // Scroll logic
  const handleScrollToSection = (stepId: number) => {
    setActiveStep(stepId);
    const stepObj = steps.find(s => s.id === stepId);
    if (stepObj?.ref.current) {
      stepObj.ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleSwitchPackage = (dir: 'prev' | 'next') => {
    const idx = ttTargetingPackages.findIndex(p => p.id === activeTtTargetingPackageId);
    if (idx === -1) return;
    if (dir === 'prev') {
      const nextIdx = (idx - 1 + ttTargetingPackages.length) % ttTargetingPackages.length;
      setActiveTtTargetingPackageId(ttTargetingPackages[nextIdx].id);
    } else {
      const nextIdx = (idx + 1) % ttTargetingPackages.length;
      setActiveTtTargetingPackageId(ttTargetingPackages[nextIdx].id);
    }
  };

  const handleDeleteTtTargetingPackage = (id: string) => {
    if (ttTargetingPackages.length <= 1) {
      alert('必须保留至少一个定向包！');
      return;
    }
    const idx = ttTargetingPackages.findIndex(p => p.id === id);
    const newPackages = ttTargetingPackages.filter(p => p.id !== id);
    setTtTargetingPackages(newPackages);
    if (activeTtTargetingPackageId === id) {
      const nextActiveId = newPackages[Math.max(0, idx - 1)].id;
      setActiveTtTargetingPackageId(nextActiveId);
    }
  };

  // Mock handle saving draft
  const handleSaveDraftLocal = () => {
    if (activeChannel === 'tiktok' && ttPromotionType === 'applet') {
      alert('已开发页面不做参考');
      return;
    }
    const activeAcc = channelAccounts[0] || { id: '75000000', name: '默认广告账户' };
    const timeString = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const draftId = `DRAFT_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const activeCG = activeChannel === 'google' ? googleCreativeGroups[0] : (activeChannel === 'facebook' ? fbCreativeGroups[0] : null);
    const googleCreativeCount = googleCreativeGroups.reduce((acc, curr) => acc + curr.videos.length + curr.images.length + curr.html5s.length, 0);
    const fbCreativeCount = fbCreativeGroups.reduce((acc, curr) => acc + curr.videos.length + curr.images.length + curr.html5s.length, 0);

    const checkCampaignName = activeChannel === 'google' ? googleCampaignName : (activeChannel === 'facebook' ? fbCampaignName : campaignName);
    const checkGroupName = activeChannel === 'google' ? googleAdGroupName : (activeChannel === 'facebook' ? fbAdGroupName : adGroupName);
    const checkAdName = activeChannel === 'google' ? (googleCreativeGroups[0]?.name || '创意组1') : (activeChannel === 'facebook' ? (fbCreativeGroups[0]?.name || '创意组1') : (adCreativeName || `${creativeGroupName || '创意组1'}_Ad`));
    const checkCount = activeChannel === 'google' ? googleCreativeCount : (activeChannel === 'facebook' ? fbCreativeCount : selectedCreativeIds.length);

    const newDraft = {
      id: draftId,
      campaignName: checkCampaignName || '未命名智能推广系列_Draft',
      adGroupName: checkGroupName || '未命名广告组_Draft',
      adName: checkAdName,
      budget: Number(activeChannel === 'facebook' ? fbDailyBudget : budgetValue) || 50.00,
      creativeCount: checkCount || 1,
      status: '草稿' as const,
      updatedAt: timeString
    };

    setDrafts(prev => [newDraft, ...prev]);
    addLog('上传', `存入推广活动草稿: ${checkCampaignName || '未命名智能系列'}`, 'draft', '草稿');
    onSuccess(`草稿保存成功！代码号: ${draftId}`);
    onClose();
  };

  // Mock publish campaign with all custom dimensions
  const handlePublishProject = () => {
    // Basic verification matching validation highlights
    if (activeChannel === 'google') {
      if (!googleCampaignName.trim()) {
        alert('请完成广告系列名称的填写');
        handleScrollToSection(1);
        return;
      }
      if (!googleApp) {
        alert('请选择关联的应用');
        handleScrollToSection(1);
        return;
      }
      if (!googleAdGroupName.trim()) {
        alert('请填写广告组名称');
        handleScrollToSection(3);
        return;
      }
      const activeCG = googleCreativeGroups.find(g => g.id === activeGoogleCreativeGroupId);
      if (!activeCG || !activeCG.titles.some(t => t.trim())) {
        alert('请至少填写一个创意组标题');
        handleScrollToSection(10);
        return;
      }
      if (!activeCG || !activeCG.descriptions.some(d => d.trim())) {
        alert('请至少填写一个创意组描述');
        handleScrollToSection(10);
        return;
      }
    } else if (activeChannel === 'facebook') {
      if (!fbCampaignName.trim()) {
        alert('请完成广告系列名称的填写');
        handleScrollToSection(1);
        return;
      }
      if (!fbAdGroupName.trim()) {
        alert('请填写广告组名称');
        handleScrollToSection(3);
        return;
      }
      const activeCG = fbCreativeGroups.find(g => g.id === activeFbCreativeGroupId);
      if (!activeCG || !activeCG.titles.some(t => t.trim())) {
        alert('请至少填写一个创意组标题');
        handleScrollToSection(10);
        return;
      }
      if (!activeCG || !activeCG.descriptions.some(d => d.trim())) {
        alert('请至少填写一个创意组描述');
        handleScrollToSection(10);
        return;
      }
      if (!selectedFbApp) {
        alert('请在第三步：投放内容 中选择关联的移动应用');
        handleScrollToSection(3);
        return;
      }
    } else if (activeChannel === 'tiktok') {
      if (ttPromotionType === 'applet') {
        alert('已开发页面不做参考');
        return;
      }
      if (!campaignName.trim()) {
        alert('请完成推广系列名称的填写（目前为红色警示状态）');
        handleScrollToSection(1);
        return;
      }
      if (!adGroupName.trim()) {
        alert('请填写广告组名称');
        handleScrollToSection(2);
        return;
      }
    }

    const firstActiveAccount = channelAccounts[0] || { id: '759815223087939600', name: '亚太多地区代投-01' };

    const checkCampaignName = activeChannel === 'google' ? googleCampaignName : campaignName;
    const checkGroupName = activeChannel === 'google' ? googleAdGroupName : adGroupName;
    const checkObjType = activeChannel === 'facebook' ? fbObjective : (activeChannel === 'google' ? 'Google 应用安装/应用互动' : (initialObjective || '应用推广'));

    const campaignObj = {
      advertiserId: firstActiveAccount.id,
      advertiserName: firstActiveAccount.name,
      campaignName: checkCampaignName,
      objective: checkObjType,
      type: (activeChannel === 'tiktok' && ttPromotionType === 'app')
        ? (ttCampaignType === 'smart_plus' ? 'Smart+' : 'Standard')
        : ('Smart+' as const),
      budgetMode: '动态日预算' as const,
      budget: Number(budgetValue) || 50.00,
      budgetOptimization: campaignBudgetOptimization,
      roas: '1.92',
      status1: '已启用' as const,
      status2: '进行中' as const
    };

    const googleTargetLoc = googleRegionGroups.map(g => g.selectedRegions.join(',')).filter(Boolean).join(' | ');

    const groupObj = {
      adGroupName: checkGroupName || '智能广告分发组_Dynamic',
      placement: activeChannel === 'google' ? 'Google 全网络版位' : (activeChannel === 'facebook' ? (placementSettingMode === 'manual' ? '手动版位' : '进阶赋能型版位') : (selectedPlacement || 'TikTok info flow')),
      targetLocation: activeChannel === 'google' ? (googleTargetLoc || '不限') : (activeChannel === 'facebook' ? (selectedTargetRegions.join(', ') || '全球推荐地区') : (selectedRegions.join(', ') || '亚太全域(沙特/中国台湾/日本等)')),
      budget: Number(budgetValue) || 50.00,
      status: '开启' as const
    };

    const currentCG = googleCreativeGroups[0];
    const googleMediaIds = currentCG ? [...currentCG.videos, ...currentCG.images, ...currentCG.html5s] : [];

    createCampaign(
      campaignObj,
      groupObj,
      activeChannel === 'google' ? (googleCreativeGroups[0]?.name || 'Google_Creative_Main') : (adCreativeName || creativeGroupName || 'Ad_Creative_Main'),
      activeChannel === 'google' ? (googleCreativeGroups[0]?.titles.filter(Boolean).join(' / ') || '极速点击秒玩！') : (adCopywritingInput || '极速点击秒玩！'),
      activeChannel === 'google' ? (googleMediaIds.length > 0 ? googleMediaIds : ['video_placeholder_1.mp4']) : (selectedCreativeIds.length > 0 ? selectedCreativeIds : materials.slice(0, 1).map(m => m.id))
    );

    addLog('发布', `通过高级交叉矩阵发布广告系列 [${checkCampaignName}] | 生成组数: ${totalAdGroupsEstimated}`, 'campaign', '成功');
    onSuccess(`广告投放配置和拆分生成组合已顺利上传部署！生成在投推广系列数 ${totalCampaignsEstimated} 个，广告组 ${totalAdGroupsEstimated} 个，以及定制广告创意 ${totalAdsEstimated} 条。`);
    onClose();
  };

  // Region selections list
  const regionsDb = [
    { code: 'SA', name: '沙特阿拉伯 (Saudi Arabia)', group: '中东地区' },
    { code: 'TW', name: '中国台湾 (Taiwan)', group: '大中华地区' },
    { code: 'JP', name: '日本 (Japan)', group: '东北亚' },
    { code: 'AE', name: '阿拉伯联合酋长国 (UAE)', group: '中东地区' },
    { code: 'US', name: '美国 (United States)', group: '北美洲' },
    { code: 'TH', name: '泰国 (Thailand)', group: '东南亚' },
    { code: 'VN', name: '越南 (Vietnam)', group: '东南亚' },
    { code: 'MY', name: '马来西亚 (Malaysia)', group: '东南亚' }
  ];

  const filteredRegions = regionsDb.filter(r => 
    r.name.toLowerCase().includes(regionSearchQuery.toLowerCase()) || 
    r.code.toLowerCase().includes(regionSearchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-[#f4f7fc] z-50 flex flex-col font-sans text-xs text-slate-800 leading-normal antialiased select-none">
      
      {/* Top Banner exactly based on Screenshot 2 header */}
      <div className="h-12 bg-white border-b border-slate-200 px-6 shrink-0 flex items-center justify-between shadow-xs select-none">
        <div className="flex items-center gap-3">
          {activeChannel === 'facebook' ? (
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center relative overflow-hidden shadow-xs scale-90">
              <span className="text-white font-black text-lg select-none">f</span>
            </div>
          ) : activeChannel === 'google' ? (
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center relative overflow-hidden shadow-xs scale-90">
              <span className="text-white font-black text-lg select-none">G</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center relative overflow-hidden shadow-xs scale-90">
              <div className="text-white font-extrabold font-mono select-none tracking-tighter text-[13px] relative">
                <span className="text-cyan-400 absolute -left-0.5 -top-0.5">TT</span>
                <span className="text-rose-400 absolute left-0.5 top-0.5">TT</span>
                <span className="text-white relative z-10">TT</span>
              </div>
            </div>
          )}
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5 animate-fade-in">
              创建广告 — {activeChannel === 'facebook' ? 'Facebook Ads Manager' : activeChannel === 'google' ? 'Google Ads Client' : 'TikTok Mini Game'}
            </h1>
            <p className="text-[10px] text-slate-400">配置广告投放参数，系统根据拆分规则自动生成广告组合</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="p-1.5 px-3 border border-slate-350 bg-white hover:bg-slate-50 rounded text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold transition-all shadow-2xs text-[11px]"
        >
          <X className="w-4 h-4 text-slate-400" /> 关闭回到自推广列表
        </button>
      </div>

      {/* Screen Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Step-Link Rail Side bar Left-Most */}
        <ChannelSidebar />

        {/* Form sections navigator side panel */}
        <div className="w-[160px] bg-white border-r border-slate-200 py-4 px-2 overflow-y-auto shrink-0 select-none">
          <span className="text-[10px] font-bold text-slate-400 tracking-widest pl-3 block mb-3 uppercase">导航大纲</span>
          <div className="flex flex-col gap-0.5">
            {visibleSteps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => handleScrollToSection(step.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left rounded font-semibold text-[11px] transition-all cursor-pointer
                  ${activeStep === step.id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono font-bold
                    ${activeStep === step.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {idx + 1}
                  </span>
                  <span>{step.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Central main form container exactly resembling high fidelity elements */}
        <div className="flex-1 overflow-y-auto p-6 space-y-7 bg-[#f4f7fc]">
          
          {activeChannel === 'google' && (
            <GoogleAdForm
              materials={materials}
              setMaterials={setMaterials}
              googleCampaignType={googleCampaignType}
              setGoogleCampaignType={setGoogleCampaignType}
              googleCampaignSubtype={googleCampaignSubtype}
              setGoogleCampaignSubtype={setGoogleCampaignSubtype}
              googlePlatform={googlePlatform}
              setGooglePlatform={setGooglePlatform}
              googleAccount={googleAccount}
              setGoogleAccount={setGoogleAccount}
              googleXmpProduct={googleXmpProduct}
              setGoogleXmpProduct={setGoogleXmpProduct}
              googleApp={googleApp}
              setGoogleApp={setGoogleApp}
              googleCampaignName={googleCampaignName}
              setGoogleCampaignName={setGoogleCampaignName}
              googleCreatedApps={googleCreatedApps}
              setGoogleCreatedApps={setGoogleCreatedApps}
              googleRegionGroups={googleRegionGroups}
              setGoogleRegionGroups={setGoogleRegionGroups}
              activeGoogleRegionGroupId={activeGoogleRegionGroupId}
              setActiveGoogleRegionGroupId={setActiveGoogleRegionGroupId}
              isExistingRegionChecked={isExistingRegionChecked}
              setIsExistingRegionChecked={setIsExistingRegionChecked}
              googleRegionSearch={googleRegionSearch}
              setGoogleRegionSearch={setGoogleRegionSearch}
              googleLanguageDropdownOpen={googleLanguageDropdownOpen}
              setGoogleLanguageDropdownOpen={setGoogleLanguageDropdownOpen}
              googleAdGroupName={googleAdGroupName}
              setGoogleAdGroupName={setGoogleAdGroupName}
              isGoogleAdGroupExpanded={isGoogleAdGroupExpanded}
              setIsGoogleAdGroupExpanded={setIsGoogleAdGroupExpanded}
              googleCreativeGroups={googleCreativeGroups}
              setGoogleCreativeGroups={setGoogleCreativeGroups}
              activeGoogleCreativeGroupId={activeGoogleCreativeGroupId}
              setActiveGoogleCreativeGroupId={setActiveGoogleCreativeGroupId}
              isExistingCreativeChecked={isExistingCreativeChecked}
              setIsExistingCreativeChecked={setIsExistingCreativeChecked}
              bidStrategy={bidStrategy}
              setBidStrategy={setBidStrategy}
              roasType={roasType}
              setRoasType={setRoasType}
              budgetValue={budgetValue}
              setBudgetValue={setBudgetValue}
              steps={steps}
            />
          )}

          {activeChannel === 'facebook' && (
            <FacebookAdForm
              materials={materials}
              setMaterials={setMaterials}
              fbAdAccount={fbAdAccount}
              setFbAdAccount={setFbAdAccount}
              fbXmpProduct={fbXmpProduct}
              setFbXmpProduct={setFbXmpProduct}
              fbCampaignName={fbCampaignName}
              setFbCampaignName={setFbCampaignName}
              fbAdGroupName={fbAdGroupName}
              setFbAdGroupName={setFbAdGroupName}
              fbDailyBudget={fbDailyBudget}
              setFbDailyBudget={setFbDailyBudget}
              fbCreativeGroups={fbCreativeGroups}
              setFbCreativeGroups={setFbCreativeGroups}
              activeFbCreativeGroupId={activeFbCreativeGroupId}
              setActiveFbCreativeGroupId={setActiveFbCreativeGroupId}
              isFbMaterialPickerOpen={isFbMaterialPickerOpen}
              setIsFbMaterialPickerOpen={setIsFbMaterialPickerOpen}
              fbMaterialPickerType={fbMaterialPickerType}
              setFbMaterialPickerType={setFbMaterialPickerType}
              fbActiveCreativeGroupIdForPicker={fbActiveCreativeGroupIdForPicker}
              setFbActiveCreativeGroupIdForPicker={setFbActiveCreativeGroupIdForPicker}
              fbRegionGroups={fbRegionGroups}
              setFbRegionGroups={setFbRegionGroups}
              activeFbRegionGroupId={activeFbRegionGroupId}
              setActiveFbRegionGroupId={setActiveFbRegionGroupId}
              fbTargetingPackages={fbTargetingPackages}
              setFbTargetingPackages={setFbTargetingPackages}
              activeFbTargetingPackageId={activeFbTargetingPackageId}
              setActiveFbTargetingPackageId={setActiveFbTargetingPackageId}
              fbBudgets={fbBudgets}
              setFbBudgets={setFbBudgets}
              activeFbBudgetId={activeFbBudgetId}
              setActiveFbBudgetId={setActiveFbBudgetId}
              steps={steps}
            />
          )}

          {activeChannel === 'tiktok' && (
            <>
              <div ref={steps[0].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-colors">
                <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-4 flex items-center gap-1.5 uppercase tracking-wide">
                  <span className="w-1.5 h-3.5 bg-blue-600 rounded-2xs inline-block"></span>
                  基础设置
                </h3>
                
                <div className="space-y-4 font-sans text-xs">
                  {ttPromotionType === 'applet' ? (
                    <div className="p-8 text-center bg-slate-50/50 border border-slate-200 rounded-lg select-none max-w-xl animate-fade-in">
                      <p className="text-sm font-extrabold text-slate-500 tracking-wide">
                        已开发页面不做参考
                      </p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-slate-655 font-bold mb-1.5">
                          广告账户 <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="relative max-w-xl">
                          <select
                            value={ttAdAccount}
                            onChange={e => setTtAdAccount(e.target.value)}
                            className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 cursor-pointer font-bold text-slate-800 focus:outline-hidden appearance-none"
                          >
                            <option value="7598159223087939600">数独-雨果-mini-0时区-01 (ID: 7598159223087939600)</option>
                            <option value="7397618729426878480">PA-雨果-01 (ID: 7397618729426878480)</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-655 font-bold mb-1.5">
                          TikTok 登录用户 <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="relative max-w-xl">
                          <select
                            value={ttLoginUser}
                            onChange={e => setTtLoginUser(e.target.value)}
                            className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 cursor-pointer font-bold text-slate-800 focus:outline-hidden appearance-none"
                          >
                            <option value="739732451653960705">用户349398748874 (ID: 739732451653960705)</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      </div>

                      <div className="grid grid-cols-[140px_1fr] gap-4 max-w-2xl pt-2">
                        <div>
                          <label className="block text-slate-500 font-bold mb-1.5 select-none">推广目标</label>
                          <span className="inline-block px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-600 rounded font-bold text-[11px] select-none">
                            应用推广
                          </span>
                        </div>
                        <div>
                          <label className="block text-slate-500 font-bold mb-1.5 select-none">推广系列设置</label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { label: '手动推广系列', value: 'manual' as const },
                              { label: 'smart推广系列', value: 'smart' as const },
                              { label: '升级smart＋推广系列', value: 'smart_plus' as const }
                            ].map(opt => {
                              const isActive = ttCampaignType === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => setTtCampaignType(opt.value)}
                                  className={`px-3 py-1.5 border rounded text-[11px] font-bold transition-all cursor-pointer ${
                                    isActive
                                      ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs'
                                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {activeChannel === 'tiktok' && ttPromotionType === 'app' && (
            <>
              {/* Step 2: 推广系列 (Campaign) */}
              <div ref={steps[1].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-colors">
                <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-4 flex items-center gap-1.5 uppercase tracking-wide">
                  <span className="w-1.5 h-3.5 bg-blue-600 rounded-2xs inline-block"></span>
                  推广系列
                </h3>
                
                <div className="space-y-4 font-sans text-xs">
                  <div>
                    <label className="block text-slate-655 font-bold mb-1.5">
                      推广系列名称 <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <div className="relative max-w-xl">
                      <input
                        type="text"
                        placeholder="请输入推广系列名称"
                        value={campaignName}
                        onChange={e => setCampaignName(e.target.value)}
                        className="w-full bg-white border border-slate-250 rounded px-3 py-2 text-slate-800 font-bold focus:outline-hidden focus:border-blue-500"
                      />
                    </div>

                    <div className="mt-1.5 flex flex-wrap gap-1.5 select-none items-center">
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
                          onClick={() => handleInsertTagToCampaign(badge.value)}
                          className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          {badge.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Campaign Type Row as per Image 1 */}
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-slate-500 font-bold">推广系列类型</label>
                    <button
                      type="button"
                      className="py-1 px-4 border border-blue-500 bg-blue-50 text-blue-600 rounded font-bold text-xs"
                    >
                      应用安装
                    </button>
                  </div>

                  {/* CBO Toggle Row as per Image 1 */}
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-slate-500 font-bold flex items-center gap-1">
                      推广系列预算优化
                      <span className="text-slate-400 cursor-help text-[11px]" title="Campaign Budget Optimization (CBO) 开启后将在各广告组之间优化预算分配">③</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const nextVal = !ttCboEnabled;
                        setTtCboEnabled(nextVal);
                        if (nextVal) {
                          setTtBudgetType('daily');
                        }
                      }}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        ttCboEnabled ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          ttCboEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Budget Type & Value Options */}
                  <div className="space-y-4 pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-4">
                      <label className="w-32 text-slate-500 font-bold">预算类型</label>
                      <div className="flex gap-2">
                        {ttCboEnabled ? (
                          <button
                            type="button"
                            className="py-1 px-4 border border-blue-500 bg-blue-50 text-blue-600 rounded text-xs font-bold transition-all"
                          >
                            日预算
                          </button>
                        ) : (
                          <>
                            {['unlimited', 'daily', 'lifetime'].map(type => {
                              const label = type === 'unlimited' ? '不限' : type === 'daily' ? '日预算' : '总预算';
                              const isActive = ttBudgetType === type;
                              return (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => setTtBudgetType(type as any)}
                                  className={`py-1.5 px-4 border rounded text-xs font-bold transition-all cursor-pointer ${
                                    isActive
                                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                                  }`}
                                >
                                  {label}
                                </button>
                              );
                            })}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Show budget value input if budget type is NOT unlimited */}
                    {(!ttCboEnabled ? (ttBudgetType !== 'unlimited') : true) && (
                      <div className="flex items-center gap-4 animate-fade-in">
                        <div className="w-32"></div>
                        <div className="flex max-w-sm">
                          <input
                            type="number"
                            min="50"
                            placeholder="50.00"
                            value={budgetValue}
                            onChange={e => setBudgetValue(e.target.value)}
                            className="w-48 bg-white border border-slate-250 rounded-l px-3 py-1.5 text-xs text-slate-800 font-bold focus:outline-hidden focus:border-blue-500"
                          />
                          <span className="bg-slate-100 border border-l-0 border-slate-250 rounded-r px-3 py-1.5 text-slate-500 text-xs font-bold flex items-center justify-center">
                            USD
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 3: 投放内容 (Delivery Content) */}
              <div ref={steps[2].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-colors">
                <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-4 flex items-center gap-1.5 uppercase tracking-wide">
                  <span className="w-1.5 h-3.5 bg-blue-600 rounded-2xs inline-block"></span>
                  投放内容
                </h3>
                
                <div className="space-y-5 font-sans text-xs">
                  {/* Row 1: 广告组名称 */}
                  <div className="flex items-start gap-4">
                    <label className="w-44 text-slate-500 font-bold mt-2 select-none">
                      广告组名称
                    </label>
                    <div className="flex-1 max-w-xl">
                      <input
                        type="text"
                        placeholder="请输入"
                        value={adGroupName}
                        onChange={e => setAdGroupName(e.target.value)}
                        className="w-full bg-white border border-slate-250 rounded px-3 py-1.5 text-slate-800 font-bold focus:outline-hidden focus:border-blue-500 text-xs"
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
                        ].map(badge => (
                          <button
                            key={badge.label}
                            type="button"
                            onClick={() => handleInsertTagToAdGroup(badge.value)}
                            className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            {badge.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: 投放平台 */}
                  <div className="flex items-center gap-4 border-t border-slate-50 pt-4">
                    <label className="w-44 text-slate-500 font-bold select-none">
                      投放平台
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTtAppPlatform('android');
                          if (ttSelectedApp.includes('iOS')) {
                            setTtSelectedApp('完美大侠 (Perfect Hero) - Android');
                          }
                        }}
                        className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                          ttAppPlatform === 'android'
                            ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs'
                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        安卓
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTtAppPlatform('ios');
                          if (ttSelectedApp.includes('Android') || !ttSelectedApp) {
                            setTtSelectedApp('极速钢琴节奏连连弹 (Piano Rhythms) - iOS');
                          }
                        }}
                        className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                          ttAppPlatform === 'ios'
                            ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs'
                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        IOS
                      </button>
                    </div>
                  </div>

                  {/* Row 3: 应用 */}
                  <div className="flex items-center gap-4 border-t border-slate-50 pt-4">
                    <label className="w-44 text-slate-500 font-bold flex items-center gap-0.5 select-none">
                      <span>应用</span>
                      <span className="text-rose-500 font-bold">*</span>
                    </label>
                    
                    <div className="flex-1 max-w-xl">
                      {ttAppAllocationMode === 'unified' ? (
                        <div className="relative max-w-sm">
                          <select
                            value={ttSelectedApp}
                            onChange={e => setTtSelectedApp(e.target.value)}
                            className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-1.5 pr-10 text-xs text-slate-800 font-bold focus:outline-hidden appearance-none cursor-pointer"
                          >
                            <option value="">请选择</option>
                            {ttAppPlatform === 'ios' ? (
                              <>
                                <option value="极速钢琴节奏连连弹 (Piano Rhythms) - iOS">极速钢琴节奏连连弹 (Piano Rhythms) - iOS</option>
                                <option value="怪兽合成防御战 (Monster Defense) - iOS">怪兽合成防御战 (Monster Defense) - iOS</option>
                                <option value="完美大侠 (Perfect Hero) - Android">完美大侠 (Perfect Hero) - Android</option>
                              </>
                            ) : (
                              <>
                                <option value="完美大侠 (Perfect Hero) - Android">完美大侠 (Perfect Hero) - Android</option>
                                <option value="极速钢琴节奏连连弹 (Piano Rhythms) - iOS">极速钢琴节奏连连弹 (Piano Rhythms) - iOS</option>
                                <option value="怪兽合成防御战 (Monster Defense) - iOS">怪兽合成防御战 (Monster Defense) - iOS</option>
                              </>
                            )}
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 pointer-events-none" />
                        </div>
                      ) : (
                        <div className="border border-slate-200 rounded-lg overflow-hidden max-w-md animate-fade-in bg-white">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[11px]">
                                  <th className="p-2.5">广告账户</th>
                                  <th className="p-2.5">关联应用</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-slate-100 last:border-none">
                                  <td className="p-2.5 font-semibold text-slate-800">
                                    <div>数独-雨果-mini-0时区-01</div>
                                    <div className="text-[10px] text-slate-400 font-mono">ID: 7598159223087939600</div>
                                  </td>
                                  <td className="p-2.5">
                                    <select
                                      value={ttSelectedAppByAccount['7598159223087939600'] || ''}
                                      onChange={e => {
                                        const val = e.target.value;
                                        setTtSelectedAppByAccount(prev => ({ ...prev, '7598159223087939600': val }));
                                      }}
                                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs font-bold focus:outline-hidden cursor-pointer"
                                    >
                                      <option value="">请选择</option>
                                      <option value="完美大侠 (Perfect Hero) - Android">完美大侠 (Perfect Hero) - Android</option>
                                      <option value="极速钢琴节奏连连弹 (Piano Rhythms) - iOS">极速钢琴节奏连连弹 (Piano Rhythms) - iOS</option>
                                      <option value="怪兽合成防御战 (Monster Defense) - iOS">怪兽合成防御战 (Monster Defense) - iOS</option>
                                    </select>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="p-2.5 font-semibold text-slate-800">
                                    <div>PA-雨果-01</div>
                                    <div className="text-[10px] text-slate-400 font-mono">ID: 7397618729426878480</div>
                                  </td>
                                  <td className="p-2.5">
                                    <select
                                      value={ttSelectedAppByAccount['7397618729426878480'] || ''}
                                      onChange={e => {
                                        const val = e.target.value;
                                        setTtSelectedAppByAccount(prev => ({ ...prev, '7397618729426878480': val }));
                                      }}
                                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs font-bold focus:outline-hidden cursor-pointer"
                                    >
                                      <option value="">请选择</option>
                                      <option value="完美大侠 (Perfect Hero) - Android">完美大侠 (Perfect Hero) - Android</option>
                                      <option value="极速钢琴节奏连连弹 (Piano Rhythms) - iOS">极速钢琴节奏连连弹 (Piano Rhythms) - iOS</option>
                                      <option value="怪兽合成防御战 (Monster Defense) - iOS">怪兽合成防御战 (Monster Defense) - iOS</option>
                                    </select>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                        
                        <div className="mt-2.5 flex items-center justify-between max-w-sm">
                          <span className="text-[10.5px] text-slate-400 font-semibold select-none">
                            应用分配方式: <span className="text-slate-600 font-bold">{ttAppAllocationMode === 'unified' ? '统一分配' : '按账户分配'}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setTtAppAllocationMode(ttAppAllocationMode === 'unified' ? 'by_account' : 'unified')}
                            className="text-[10.5px] text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer"
                          >
                            [切换分配方式]
                          </button>
                        </div>
                      </div>
                    </div>

                  {/* Row 4: iOS 14+ 广告系列 */}
                  {ttAppPlatform === 'ios' && (
                    <>
                      <div className="flex items-center gap-4 border-t border-slate-50 pt-4 animate-fade-in">
                        <label className="w-44 text-slate-500 font-bold select-none">
                          iOS 14+ 广告系列
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setTtIos14CampaignOn(false);
                              setTtAppIntroPageOn(false);
                              setTtAdvancedDedicatedCampaignOn(false);
                            }}
                            className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                              !ttIos14CampaignOn
                                ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs'
                                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            关闭
                          </button>
                          <button
                            type="button"
                            onClick={() => setTtIos14CampaignOn(true)}
                            className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                              ttIos14CampaignOn
                                ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs'
                                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            开启
                          </button>
                        </div>
                      </div>

                      {ttIos14CampaignOn && (
                        <>
                          {/* Row 4.1: 应用介绍页 */}
                          <div className="flex items-center gap-4 border-t border-slate-50 pt-4 animate-fade-in">
                            <label className="w-44 text-slate-500 font-bold select-none">
                              应用介绍页
                            </label>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setTtAppIntroPageOn(false)}
                                className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                                  !ttAppIntroPageOn
                                    ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs'
                                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                                }`}
                              >
                                关闭
                              </button>
                              <button
                                type="button"
                                onClick={() => setTtAppIntroPageOn(true)}
                                className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                                  ttAppIntroPageOn
                                    ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs'
                                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                                }`}
                              >
                                开启
                              </button>
                            </div>
                          </div>

                          {/* Row 4.1.5: SKAN归因 */}
                          {(ttCampaignType === 'smart' || ttCampaignType === 'smart_plus') && (
                            <div className="flex items-center gap-4 border-t border-slate-50 pt-4 animate-fade-in">
                              <label className="w-44 text-slate-500 font-bold select-none">
                                SKAN归因
                              </label>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setTtSkanAttributionOn(false)}
                                  className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                                    !ttSkanAttributionOn
                                      ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs'
                                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                                  }`}
                                >
                                  关闭
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setTtSkanAttributionOn(true)}
                                  className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                                    ttSkanAttributionOn
                                      ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs'
                                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                                  }`}
                                >
                                  开启
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Row 4.2: 高级专属推广系列 */}
                          {ttCampaignType !== 'smart_plus' && (
                            <div className="flex items-center gap-4 border-t border-slate-50 pt-4 animate-fade-in">
                              <label className="w-44 text-slate-500 font-bold select-none">
                                高级专属推广系列
                              </label>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setTtAdvancedDedicatedCampaignOn(false)}
                                  className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                                    !ttAdvancedDedicatedCampaignOn
                                      ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs'
                                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                                  }`}
                                >
                                  关闭
                                </button>
                                <button
                                  type="button"
                                  disabled
                                  className="py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                                  title="开启该项需要符合特定的广告条件"
                                >
                                  开启
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Step 3.5: 渠道号配置 (Channel Code Configuration) */}
              <div ref={steps[3].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-colors">
                <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-4 flex items-center justify-between font-sans">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 bg-blue-600 rounded-2xs inline-block"></span>
                    <span className="text-sm font-bold text-slate-800">渠道号配置</span>
                  </div>
                  {ttChannelConfigured ? (
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
                        name="tt_chan_gen" 
                        checked={ttChannelGenMode === 'auto'} 
                        onChange={() => {
                          setTtChannelGenMode('auto');
                          setTtChannelConfigured(false);
                        }}
                        className="text-blue-600 focus:ring-0 h-3.5 w-3.5 cursor-pointer" 
                      />
                      <span className={`${ttChannelGenMode === 'auto' ? 'text-blue-600' : ''}`}>配置生成</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input 
                        type="radio" 
                        name="tt_chan_gen" 
                        checked={ttChannelGenMode === 'manual'} 
                        onChange={() => {
                          setTtChannelGenMode('manual');
                          setTtChannelConfigured(false);
                        }}
                        className="text-blue-600 focus:ring-0 h-3.5 w-3.5 cursor-pointer" 
                      />
                      <span className={`${ttChannelGenMode === 'manual' ? 'text-blue-600' : ''}`}>手动输入</span>
                    </label>
                  </div>

                  {/* 渠道号生成方式 */}
                  <div className="space-y-1.5 pt-1">
                    <span className="block text-slate-400 font-bold text-[11px]">渠道号生成方式</span>
                    <div className="flex items-center gap-6 select-none font-bold">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                        <input 
                          type="radio" 
                          name="tt_chan_way" 
                          checked={ttChannelSharingMode === 'shared'} 
                          onChange={() => setTtChannelSharingMode('shared')}
                          className="text-blue-600 focus:ring-0 h-3.5 w-3.5 cursor-pointer" 
                        />
                        <span className={`${ttChannelSharingMode === 'shared' ? 'text-blue-600' : ''}`}>所有广告组共用</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                        <input 
                          type="radio" 
                          name="tt_chan_way" 
                          checked={ttChannelSharingMode === 'independent'} 
                          onChange={() => setTtChannelSharingMode('independent')}
                          className="text-blue-600 focus:ring-0 h-3.5 w-3.5 cursor-pointer" 
                        />
                        <span className={`${ttChannelSharingMode === 'independent' ? 'text-blue-600' : ''}`}>每个广告组独立生成</span>
                      </label>
                    </div>
                  </div>

                  {/* Mode: auto (配置生成) */}
                  {ttChannelGenMode === 'auto' && (
                    <div className="space-y-3.5 max-w-xl pt-2 animate-fade-in">
                      {/* 游戏 */}
                      <div>
                        <label className="block text-slate-700 font-bold mb-1.5">
                          游戏 <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={ttChannelGame}
                            onChange={e => {
                              setTtChannelGame(e.target.value);
                              if (e.target.value !== '0') {
                                setTtChannelSource('TikTok Ads');
                              } else {
                                setTtChannelSource('');
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
                            value={ttChannelPlatform}
                            onChange={e => setTtChannelPlatform(e.target.value)}
                            className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                          >
                            <option value="0">0</option>
                            <option value="tt_spark">TikTok Spark Ads</option>
                            <option value="tt_non_spark">TikTok Non-Spark Ads</option>
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
                          {ttChannelGame === '0' ? (
                            <select
                              disabled
                              className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-400 focus:outline-hidden appearance-none cursor-not-allowed"
                            >
                              <option value="">请先选择游戏</option>
                            </select>
                          ) : (
                            <select
                              value={ttChannelSource}
                              onChange={e => setTtChannelSource(e.target.value)}
                              className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                            >
                              <option value="TikTok Ads">TikTok Ads</option>
                              <option value="Pangle">Pangle</option>
                              <option value="BuzzVideo">BuzzVideo</option>
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
                            value={ttChannelRegion}
                            onChange={e => {
                              setTtChannelRegion(e.target.value);
                              setTtChannelRegionTouched(true);
                              if (e.target.value) {
                                setTtChannelConfigured(true);
                              } else {
                                setTtChannelConfigured(false);
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
                        {(!ttChannelRegion || !ttChannelRegionTouched) && (
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
                          <span className={`font-bold ${ttChannelPitcher ? 'text-slate-800 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded' : 'text-slate-400'}`}>
                            {ttChannelPitcher || '未选择投手'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const names = ['投手张三', '投手李四', '投手王五'];
                              const picked = names[Math.floor(Math.random() * names.length)] + ` (${Math.floor(100 + Math.random() * 900)})`;
                              setTtChannelPitcher(picked);
                            }}
                            className="px-3 py-1.5 bg-white border border-slate-250 hover:border-slate-350 hover:bg-slate-50 text-slate-700 font-bold rounded-sm cursor-pointer transition-colors"
                          >
                            选择投手
                          </button>
                          {ttChannelPitcher && (
                            <button 
                              type="button" 
                              onClick={() => setTtChannelPitcher('')}
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
                          {ttChannelLabel ? (
                            <span className="font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded flex items-center gap-1">
                              <span>{ttChannelLabel}</span>
                              <button 
                                type="button" 
                                onClick={() => setTtChannelLabel('')}
                                className="hover:bg-blue-100 p-0.5 rounded-full w-4 h-4 flex items-center justify-center text-[9px] text-blue-500"
                              >
                                ✕
                              </button>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const tags = ['TT-TEST-CAMP', 'GLOBAL-ADV', 'SUMMER-SPECIAL'];
                                const picked = tags[Math.floor(Math.random() * tags.length)];
                                setTtChannelLabel(picked);
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
                          value={ttChannelRemark}
                          onChange={e => setTtChannelRemark(e.target.value)}
                          placeholder="请输入备注信息"
                          rows={3}
                          className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Mode: manual (手动输入) */}
                  {ttChannelGenMode === 'manual' && (
                    <div className="space-y-3.5 max-w-xl pt-2 animate-fade-in">
                      {/* 游戏 */}
                      <div>
                        <label className="block text-slate-700 font-bold mb-1.5">
                          游戏 <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={ttChannelGame}
                            onChange={e => {
                              setTtChannelGame(e.target.value);
                              if (e.target.value === '0') {
                                setTtChannelManualCode('');
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
                          {ttChannelGame === '0' ? (
                            <select
                              disabled
                              className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-400 focus:outline-hidden appearance-none cursor-not-allowed"
                            >
                              <option value="">请先选择游戏</option>
                            </select>
                          ) : (
                            <select
                              value={ttChannelManualCode}
                              onChange={e => {
                                setTtChannelManualCode(e.target.value);
                              }}
                              className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold text-slate-800 focus:outline-hidden appearance-none cursor-pointer"
                            >
                              <option value="">请选择渠道号</option>
                              <option value="CHAN_TT_01">CHAN_TT_01 (100192)</option>
                              <option value="CHAN_TT_02">CHAN_TT_02 (100193)</option>
                              <option value="CHAN_TT_03">CHAN_TT_03 (100194)</option>
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
                            if (ttChannelGame === '0') {
                              alert('请选择具体游戏后再进行确认！');
                              return;
                            }
                            if (!ttChannelManualCode) {
                              alert('请选择渠道号后再进行确认！');
                              return;
                            }
                            setTtChannelConfigured(true);
                            alert(`渠道号配置成功！已绑定游戏并同步手动输入渠道号 [${ttChannelManualCode}]`);
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

              {/* Step 7: 定向包 (Targeting Package) */}
              <div ref={steps[6].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-colors">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900 inline-block uppercase tracking-wide">
                      定向包 ({ttTargetingPackages.length}/20)
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 select-none">
                    <button
                      type="button"
                      onClick={() => {
                        setTtTargetingPackages(prev => prev.map(p => p.id === activeTtTargetingPackageId ? {
                          ...p,
                          useExisting: false,
                          customPeopleMode: 'unlimited',
                          gender: 'unlimited',
                          minAge: '18+',
                          interestTag: '',
                          name: ''
                        } : p));
                      }}
                      className="px-3 py-1 border border-slate-300 text-slate-600 bg-white hover:bg-slate-50 text-[11px] font-bold rounded transition-colors cursor-pointer"
                    >
                      清空
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (ttTargetingPackages.length >= 20) {
                          alert('最多只能创建20个定向包！');
                          return;
                        }
                        const nextNum = ttTargetingPackages.length + 1;
                        const nextId = `tt_tp_${Date.now()}`;
                        const newPackage = {
                          id: nextId,
                          name: `定向包${nextNum}`,
                          useExisting: false,
                          customPeopleMode: 'unlimited' as const,
                          gender: 'unlimited' as const,
                          minAge: '18+',
                          interestTag: ''
                        };
                        setTtTargetingPackages(prev => [...prev, newPackage]);
                        setActiveTtTargetingPackageId(nextId);
                      }}
                      className="px-3 py-1 bg-[#2563eb] hover:bg-blue-700 text-white text-[11px] font-extrabold rounded transition-colors shadow-2xs cursor-pointer"
                    >
                      + 新增
                    </button>
                  </div>
                </div>

                {/* Simulated Tabs below header */}
                <div className="flex items-center justify-between border-b border-slate-200 mb-4 select-none pb-1.5">
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {ttTargetingPackages.map((pkg, idx) => (
                      <div
                        key={pkg.id}
                        onClick={() => setActiveTtTargetingPackageId(pkg.id)}
                        className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-xs font-bold transition-all cursor-pointer ${
                          activeTtTargetingPackageId === pkg.id
                            ? 'bg-[#2563eb] border-[#2563eb] text-white shadow-3xs'
                            : 'bg-white border-slate-200 hover:border-slate-350 text-slate-600 hover:text-slate-800'
                        }`}
                      >
                        <span>{pkg.name || `定向包${idx + 1}`}</span>
                        {ttTargetingPackages.length > 1 && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTtTargetingPackage(pkg.id);
                            }}
                            className={`text-[10px] pl-1 font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center transition-colors ${
                              activeTtTargetingPackageId === pkg.id
                                ? 'hover:bg-white/20 text-white/80 hover:text-white'
                                : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
                            }`}
                            title="删除"
                          >
                            ✕
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Up/Down Arrow adjusters to the right of the tab row matching screenshot */}
                  <div className="flex flex-col border border-slate-200 rounded divide-y divide-slate-200 bg-white">
                    <button
                      type="button"
                      onClick={() => handleSwitchPackage('prev')}
                      className="p-1 hover:bg-slate-50 text-slate-500 cursor-pointer"
                      title="上一个定向包"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchPackage('next')}
                      className="p-1 hover:bg-slate-50 text-slate-500 cursor-pointer"
                      title="下一个定向包"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Card Fields */}
                {(() => {
                  const activePkg = ttTargetingPackages.find(p => p.id === activeTtTargetingPackageId) || ttTargetingPackages[0];
                  return (
                    <div className="space-y-4">
                      {/* Checkbox 1: 选择已有定向包 */}
                      <div className="flex items-center gap-2 select-none">
                        <input
                          id={`tt-use-existing-${activePkg.id}`}
                          type="checkbox"
                          checked={activePkg.useExisting}
                          onChange={e => {
                            setTtTargetingPackages(prev => prev.map(p => p.id === activePkg.id ? { ...p, useExisting: e.target.checked } : p));
                          }}
                          className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`tt-use-existing-${activePkg.id}`}
                          className="text-xs font-bold text-slate-700 cursor-pointer"
                        >
                          选择已有定向包
                        </label>
                      </div>

                      {/* Custom input fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-1">
                        {/* Column 1: 自定义人群 */}
                        <div className="space-y-1.5">
                          <label className="block text-slate-500 font-bold text-xs">
                            自定义人群
                          </label>
                          <div className="flex items-center gap-6 select-none pt-0.5">
                            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 text-xs">
                              <input
                                type="radio"
                                name={`customPeopleMode-${activePkg.id}`}
                                checked={activePkg.customPeopleMode === 'unlimited'}
                                onChange={() => {
                                  setTtTargetingPackages(prev => prev.map(p => p.id === activePkg.id ? { ...p, customPeopleMode: 'unlimited' } : p));
                                }}
                                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                              />
                              不限
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 text-xs">
                              <input
                                type="radio"
                                name={`customPeopleMode-${activePkg.id}`}
                                checked={activePkg.customPeopleMode === 'specified'}
                                onChange={() => {
                                  setTtTargetingPackages(prev => prev.map(p => p.id === activePkg.id ? { ...p, customPeopleMode: 'specified' } : p));
                                }}
                                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                              />
                              指定人群
                            </label>
                          </div>
                        </div>

                        {/* Column 2: 性别 */}
                        <div className="space-y-1.5">
                          <label className="block text-slate-500 font-bold text-xs">
                            性别
                          </label>
                          <div className="flex items-center gap-6 select-none pt-0.5">
                            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 text-xs">
                              <input
                                type="radio"
                                name={`targetingGender-${activePkg.id}`}
                                checked={activePkg.gender === 'unlimited'}
                                onChange={() => {
                                  setTtTargetingPackages(prev => prev.map(p => p.id === activePkg.id ? { ...p, gender: 'unlimited' } : p));
                                }}
                                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                              />
                              不限
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 text-xs">
                              <input
                                type="radio"
                                name={`targetingGender-${activePkg.id}`}
                                checked={activePkg.gender === 'male'}
                                onChange={() => {
                                  setTtTargetingPackages(prev => prev.map(p => p.id === activePkg.id ? { ...p, gender: 'male' } : p));
                                }}
                                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                              />
                              男性
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 text-xs">
                              <input
                                type="radio"
                                name={`targetingGender-${activePkg.id}`}
                                checked={activePkg.gender === 'female'}
                                onChange={() => {
                                  setTtTargetingPackages(prev => prev.map(p => p.id === activePkg.id ? { ...p, gender: 'female' } : p));
                                }}
                                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                              />
                              女性
                            </label>
                          </div>
                        </div>

                        {/* Column 3: 最低年龄 */}
                        <div className="space-y-1.5">
                          <label className="block text-slate-500 font-bold text-xs">
                            最低年龄
                          </label>
                          <div className="relative max-w-xs">
                            <select
                              value={activePkg.minAge}
                              onChange={e => {
                                setTtTargetingPackages(prev => prev.map(p => p.id === activePkg.id ? { ...p, minAge: e.target.value } : p));
                              }}
                              className="w-full bg-white border border-slate-200 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-blue-500 appearance-none cursor-pointer"
                            >
                              <option value="不限">不限</option>
                              <option value="13+">13+</option>
                              <option value="18+">18+</option>
                              <option value="25+">25+</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                          </div>
                        </div>

                        {/* Column 4: 兴趣标签 */}
                        <div className="space-y-1.5">
                          <label className="block text-slate-500 font-bold text-xs">
                            兴趣标签
                          </label>
                          <div className="relative max-w-xs flex items-center">
                            <input
                              type="text"
                              value={activePkg.interestTag}
                              onChange={e => {
                                setTtTargetingPackages(prev => prev.map(p => p.id === activePkg.id ? { ...p, interestTag: e.target.value } : p));
                              }}
                              placeholder="搜索或选择兴趣标签"
                              className="w-full bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded px-3 py-2 pr-10 text-xs font-semibold text-slate-800 placeholder-slate-405 focus:outline-hidden focus:border-blue-500 transition-colors"
                            />
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
                          </div>
                        </div>

                        {/* Column 5: 定向包名称 */}
                        <div className="space-y-1.5 md:col-span-2 max-w-md pt-2">
                          <div className="flex items-center justify-between">
                            <label className="block text-slate-500 font-bold text-xs">
                              定向包名称
                            </label>
                            <span className="text-[10.5px] font-mono text-slate-400">
                              {(activePkg.name || '').length}/50
                            </span>
                          </div>
                          <input
                            type="text"
                            maxLength={50}
                            value={activePkg.name}
                            onChange={e => {
                              setTtTargetingPackages(prev => prev.map(p => p.id === activePkg.id ? { ...p, name: e.target.value } : p));
                            }}
                            placeholder="输入定向包名称"
                            className="w-full bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded px-3.5 py-2 text-xs font-semibold text-slate-800 placeholder-slate-405 focus:outline-hidden focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>

                      {/* Button: 保存为定向包 */}
                      <div className="pt-2 select-none">
                        <button
                          type="button"
                          onClick={() => {
                            if (!activePkg.name.trim()) {
                              alert('请先输入有效的定向包名称！');
                              return;
                            }
                            alert(`定向组合已成功保存为定向包模板：[${activePkg.name}]`);
                          }}
                          className="px-4 py-2 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-bold rounded text-xs transition-colors shadow-3xs cursor-pointer"
                        >
                          保存为定向包
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Step 4: 地区组 (Region Group) */}
              <div ref={steps[4].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-colors">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900 inline-block uppercase tracking-wide">地区组</h3>
                  </div>
                  
                  <div className="flex items-center gap-3 select-none text-xs">
                    <div className="relative group">
                      <button
                        type="button"
                        className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        批量操作
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <div className="hidden group-hover:block absolute right-0 top-4 w-32 bg-white border border-slate-200 rounded shadow-md z-10 py-1">
                        <button
                          type="button"
                          onClick={() => {
                            const activeGroup = ttRegionGroups.find(g => g.id === activeTtRegionGroupId);
                            if (activeGroup) {
                              // Duplicate active group
                              const newId = 'rg_' + Date.now();
                              const newGroup = {
                                ...activeGroup,
                                id: newId,
                                name: `${activeGroup.name} (副本)`
                              };
                              setTtRegionGroups([...ttRegionGroups, newGroup]);
                              setActiveTtRegionGroupId(newId);
                            }
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-[11px] text-slate-700 cursor-pointer"
                        >
                          复制当前组
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (ttRegionGroups.length > 1) {
                              setTtRegionGroups(ttRegionGroups.filter(g => g.id !== activeTtRegionGroupId));
                              setActiveTtRegionGroupId(ttRegionGroups[0].id);
                            } else {
                              alert('必须保留至少一个地区组');
                            }
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-[11px] text-rose-600 border-t border-slate-100 cursor-pointer"
                        >
                          删除当前组
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setTtRegionGroups(prev => prev.map(g => {
                          if (g.id === activeTtRegionGroupId) {
                            return { ...g, selectedRegions: [] };
                          }
                          return g;
                        }));
                      }}
                      className="text-slate-500 hover:text-rose-600 font-medium cursor-pointer"
                    >
                      清空
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (ttRegionGroups.length >= 50) {
                          alert('最多只能创建 50 个地区组');
                          return;
                        }
                        const newId = 'rg_' + Date.now();
                        const nextNum = ttRegionGroups.length + 1;
                        const newGroup = {
                          id: newId,
                          name: `地区组${nextNum}`,
                          selectedRegions: [],
                          selectedLanguage: '不限',
                          regionTags: ''
                        };
                        setTtRegionGroups([...ttRegionGroups, newGroup]);
                        setActiveTtRegionGroupId(newId);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-extrabold flex items-center gap-0.5 cursor-pointer"
                    >
                      + 新增 {ttRegionGroups.length}/50
                    </button>
                  </div>
                </div>

                {/* Region Group Tabs dynamically loaded as per Image 2 */}
                <div className="flex flex-wrap border-b border-slate-200 mb-4 select-none">
                  {ttRegionGroups.map(group => {
                    const isActive = group.id === activeTtRegionGroupId;
                    return (
                      <div
                        key={group.id}
                        onClick={() => setActiveTtRegionGroupId(group.id)}
                        className={`px-5 py-2 border-b-2 font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-colors ${
                          isActive
                            ? 'border-blue-600 text-blue-600 bg-slate-50/50'
                            : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/30'
                        }`}
                      >
                        <span>{group.name}</span>
                        {isActive && (
                          <span className="text-[10px] bg-blue-100 text-blue-600 px-1 rounded-sm">
                            {group.selectedRegions.length}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4 font-sans text-xs">


                  {/* Choose Existing checkbox as per Image 2 */}
                  <div className="flex items-center gap-2 py-1">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={ttSelectExistingRegion}
                        onChange={e => setTtSelectExistingRegion(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-0"
                      />
                      <span>选择已有地区组</span>
                    </label>

                    {ttSelectExistingRegion && (
                      <select
                        onChange={e => {
                          const val = e.target.value;
                          if (val === 'gcc') {
                            setTtRegionGroups(prev => prev.map(g => {
                              if (g.id === activeTtRegionGroupId) {
                                return {
                                  ...g,
                                  name: '中东GCC地区组',
                                  selectedRegions: ['沙特阿拉伯(SA)', '阿拉伯联合酋长国(AE)', '科威特(KW)', '卡塔尔(QA)', '巴林(BH)', '阿曼(OM)'],
                                  selectedLanguage: 'ar'
                                };
                              }
                              return g;
                            }));
                          } else if (val === 'asia') {
                            setTtRegionGroups(prev => prev.map(g => {
                              if (g.id === activeTtRegionGroupId) {
                                return {
                                  ...g,
                                  name: '亚洲核心组',
                                  selectedRegions: ['阿塞拜疆(AZ)', '孟加拉国(BD)', '比利时(BE)'],
                                  selectedLanguage: 'en'
                                };
                              }
                              return g;
                            }));
                          }
                        }}
                        className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-700"
                      >
                        <option value="">-- 请选择已有地区组模板 --</option>
                        <option value="gcc">中东GCC六国组合模板</option>
                        <option value="asia">亚洲/孟加拉国/比利时模板</option>
                      </select>
                    )}
                  </div>

                  {/* Region selection dual layout as per Image 2 */}
                  <div className="border-t border-dashed border-slate-150 pt-3.5">
                    <label className="block text-slate-655 font-bold mb-1.5">地区 (?)</label>
                    
                    <div className="grid grid-cols-2 gap-4 border border-slate-200 rounded-lg overflow-hidden h-[240px] max-w-2xl bg-white">
                      {/* Left Column: Countries checklist */}
                      <div className="border-r border-slate-150 flex flex-col h-full">
                        <div className="p-2 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                          <span className="text-[10px] text-slate-500 font-bold">名称</span>
                          <span className="text-[10px] text-slate-400 font-bold">TikTok 支持</span>
                        </div>
                        {/* Search in Checklist */}
                        <div className="p-1.5 border-b border-slate-100">
                          <input
                            type="text"
                            placeholder="请输入搜索国家/地区"
                            value={ttCountrySearchText}
                            onChange={e => setTtCountrySearchText(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-[11px] focus:outline-hidden"
                          />
                        </div>
                        <div className="overflow-y-auto flex-1 p-2 space-y-1.5">
                          {[
                            { label: '阿塞拜疆(AZ)', value: '阿塞拜疆(AZ)' },
                            { label: '波斯尼亚和黑塞哥维那(BA)', value: '波斯尼亚和黑塞哥维那(BA)' },
                            { label: '巴巴多斯(BB)', value: '巴巴多斯(BB)' },
                            { label: '孟加拉国(BD)', value: '孟加拉国(BD)' },
                            { label: '比利时(BE)', value: '比利时(BE)' },
                            { label: '保加利亚(BG)', value: '保加利亚(BG)' },
                            { label: '沙特阿拉伯(SA)', value: '沙特阿拉伯(SA)' },
                            { label: '阿拉伯联合酋长国(AE)', value: '阿拉伯联合酋长国(AE)' },
                            { label: '科威特(KW)', value: '科威特(KW)' },
                            { label: '卡塔尔(QA)', value: '卡塔尔(QA)' },
                            { label: '巴林(BH)', value: '巴林(BH)' },
                            { label: '阿曼(OM)', value: '阿曼(OM)' },
                            { label: '埃及(EG)', value: '埃及(EG)' }
                          ].filter(c => c.label.toLowerCase().includes(ttCountrySearchText.toLowerCase()))
                           .map(country => {
                             const activeGroup = ttRegionGroups.find(g => g.id === activeTtRegionGroupId) || ttRegionGroups[0];
                             const isChecked = activeGroup.selectedRegions.includes(country.value);
                             return (
                               <label
                                 key={country.value}
                                 className="flex items-center justify-between p-1 hover:bg-slate-50 rounded text-xs text-slate-700 cursor-pointer font-bold"
                               >
                                 <div className="flex items-center gap-2">
                                   <input
                                     type="checkbox"
                                     checked={isChecked}
                                     onChange={() => {
                                       setTtRegionGroups(prev => prev.map(g => {
                                         if (g.id === activeTtRegionGroupId) {
                                           const exists = g.selectedRegions.includes(country.value);
                                           return {
                                             ...g,
                                             selectedRegions: exists
                                               ? g.selectedRegions.filter(r => r !== country.value)
                                               : [...g.selectedRegions, country.value]
                                           };
                                         }
                                         return g;
                                       }));
                                     }}
                                     className="rounded text-blue-600 focus:ring-0"
                                   />
                                   <span>{country.label}</span>
                                 </div>
                               </label>
                             );
                           })}
                        </div>
                      </div>

                      {/* Right Column: Selected list */}
                      <div className="flex flex-col h-full bg-slate-50/50">
                        <div className="p-2 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                          {(() => {
                            const activeGroup = ttRegionGroups.find(g => g.id === activeTtRegionGroupId) || ttRegionGroups[0];
                            return <span className="text-[10px] text-slate-500 font-bold">已选 {activeGroup.selectedRegions.length} 个</span>;
                          })()}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                // Paste clipboard / Batch import mock
                                const imported = prompt('请输入国家简称，多个用逗号隔开 (例如: SA,AE,KW)');
                                if (imported) {
                                  const list = imported.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
                                  const nameMap: Record<string, string> = {
                                    SA: '沙特阿拉伯(SA)',
                                    AE: '阿拉伯联合酋长国(AE)',
                                    KW: '科威特(KW)',
                                    QA: '卡塔尔(QA)',
                                    BH: '巴林(BH)',
                                    OM: '阿曼(OM)',
                                    AZ: '阿塞拜疆(AZ)',
                                    BD: '孟加拉国(BD)',
                                    BE: '比利时(BE)'
                                  };
                                  const mapped = list.map(code => nameMap[code] || `${code}(${code})`);
                                  setTtRegionGroups(prev => prev.map(g => {
                                    if (g.id === activeTtRegionGroupId) {
                                      return { ...g, selectedRegions: Array.from(new Set([...g.selectedRegions, ...mapped])) };
                                    }
                                    return g;
                                  }));
                                }
                              }}
                              className="text-[10px] text-blue-600 hover:underline font-bold cursor-pointer"
                            >
                              批量导入
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setTtRegionGroups(prev => prev.map(g => {
                                  if (g.id === activeTtRegionGroupId) {
                                    return { ...g, selectedRegions: [] };
                                  }
                                  return g;
                                }));
                              }}
                              className="text-[10px] text-rose-500 hover:underline font-bold cursor-pointer"
                            >
                              清除
                            </button>
                          </div>
                        </div>

                        <div className="overflow-y-auto flex-1 p-2 space-y-1">
                          {(() => {
                            const activeGroup = ttRegionGroups.find(g => g.id === activeTtRegionGroupId) || ttRegionGroups[0];
                            return activeGroup.selectedRegions.map(country => (
                              <div
                                key={country}
                                className="flex items-center justify-between p-1.5 bg-white border border-slate-150 hover:bg-rose-50 hover:border-rose-200 rounded text-xs text-slate-700 font-bold"
                              >
                                <span>{country}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTtRegionGroups(prev => prev.map(g => {
                                      if (g.id === activeTtRegionGroupId) {
                                        return { ...g, selectedRegions: g.selectedRegions.filter(c => c !== country) };
                                      }
                                      return g;
                                    }));
                                  }}
                                  className="text-rose-500 text-xs font-bold px-1 cursor-pointer"
                                >
                                  ×
                                </button>
                              </div>
                            ));
                          })()}
                          {(() => {
                            const activeGroup = ttRegionGroups.find(g => g.id === activeTtRegionGroupId) || ttRegionGroups[0];
                            if (activeGroup.selectedRegions.length === 0) {
                              return <div className="text-slate-400 text-[11px] p-4 text-center mt-4">暂未选择国家/地区</div>;
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Language Row as per Image 2 */}
                  <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
                    <label className="w-24 text-slate-500 font-bold">语言</label>
                    <div className="relative max-w-xs flex-1">
                      <select
                        value={(() => {
                          const activeGroup = ttRegionGroups.find(g => g.id === activeTtRegionGroupId) || ttRegionGroups[0];
                          return activeGroup.selectedLanguage;
                        })()}
                        onChange={e => {
                          const val = e.target.value;
                          setTtRegionGroups(prev => prev.map(g => {
                            if (g.id === activeTtRegionGroupId) {
                              return { ...g, selectedLanguage: val };
                            }
                            return g;
                          }));
                        }}
                        className="w-full bg-white border border-slate-250 rounded px-3 py-1.5 text-xs text-slate-855 font-bold focus:outline-hidden appearance-none cursor-pointer"
                      >
                        <option value="不限">不限 (All Languages)</option>
                        <option value="zh">中文 (Chinese)</option>
                        <option value="en">英语 (English)</option>
                        <option value="ar">阿拉伯语 (Arabic)</option>
                        <option value="ja">日语 (Japanese)</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Tags Row as per Image 2 */}
                  <div className="flex items-center gap-4">
                    <label className="w-24 text-slate-500 font-bold flex items-center gap-0.5">
                      标签
                      <span className="text-slate-400 cursor-help" title="自定义分类标签">?</span>
                    </label>
                    <div className="relative max-w-xs flex-1">
                      <select
                        value={(() => {
                          const activeGroup = ttRegionGroups.find(g => g.id === activeTtRegionGroupId) || ttRegionGroups[0];
                          return activeGroup.regionTags || '';
                        })()}
                        onChange={e => {
                          const val = e.target.value;
                          setTtRegionGroups(prev => prev.map(g => {
                            if (g.id === activeTtRegionGroupId) {
                              return { ...g, regionTags: val };
                            }
                            return g;
                          }));
                        }}
                        className="w-full bg-white border border-slate-250 rounded px-3 py-1.5 text-xs text-slate-855 font-bold focus:outline-hidden appearance-none cursor-pointer"
                      >
                        <option value="">请选择</option>
                        <option value="default">默认标签</option>
                        <option value="heavy_gamer">重度玩家</option>
                        <option value="casual_gamer">轻度休闲</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Region Group Name input with characters count as per Image 2 */}
                  <div className="flex items-center gap-4">
                    <label className="w-24 text-slate-500 font-bold">地区组名称</label>
                    <div className="relative max-w-xs flex-1 flex items-center">
                      <input
                        type="text"
                        placeholder="地区组名称"
                        value={(() => {
                          const activeGroup = ttRegionGroups.find(g => g.id === activeTtRegionGroupId) || ttRegionGroups[0];
                          return activeGroup.name;
                        })()}
                        onChange={e => {
                          const val = e.target.value.slice(0, 50);
                          setTtRegionGroups(prev => prev.map(g => {
                            if (g.id === activeTtRegionGroupId) {
                              return { ...g, name: val };
                            }
                            return g;
                          }));
                        }}
                        className="w-full bg-white border border-slate-250 rounded pl-3 pr-16 py-1.5 text-xs text-slate-800 font-bold focus:outline-hidden focus:border-blue-500"
                      />
                      <span className="absolute right-3 text-[10px] text-slate-400 font-mono pointer-events-none">
                        {(() => {
                          const activeGroup = ttRegionGroups.find(g => g.id === activeTtRegionGroupId) || ttRegionGroups[0];
                          return activeGroup.name.length;
                        })()} / 50
                      </span>
                    </div>
                  </div>

                  {/* Save region group button as per Image 2 */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => alert(`地区组 "${activeRegionGroup.name}" 保存成功！`)}
                      className="px-4 py-1.5 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-bold rounded text-xs transition-colors cursor-pointer"
                    >
                      保存为地区组
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 4.5 / 拆分版位模块 (Placement Module) as per Image 3 */}
              <div className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-colors font-sans text-xs">
                <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-4 flex items-center gap-1.5 uppercase tracking-wide">
                  <span className="w-1.5 h-3.5 bg-blue-600 rounded-2xs inline-block"></span>
                  版位
                </h3>

                <div className="space-y-4 max-w-2xl">
                  {/* Row 1: 版位 selection */}
                  <div className="flex items-center gap-4">
                    <label className="w-36 text-slate-500 font-bold">版位</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setTtPlacementMode('auto')}
                        className={`py-1.5 px-4 border rounded text-xs font-bold transition-all cursor-pointer ${
                          ttPlacementMode === 'auto'
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        自动版位
                      </button>
                      <button
                        type="button"
                        onClick={() => setTtPlacementMode('manual')}
                        className={`py-1.5 px-4 border rounded text-xs font-bold transition-all cursor-pointer ${
                          ttPlacementMode === 'manual'
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        指定版位
                      </button>
                    </div>
                  </div>

                  {/* Manual placement selection dropdown as per Image 2 */}
                  {ttPlacementMode === 'manual' && (
                    <div className="flex items-start gap-4 border-t border-slate-50 pt-3 animate-fade-in">
                      <label className="w-36 text-slate-500 font-bold mt-1.5">版位选择</label>
                      <div className="relative flex-1 max-w-sm">
                        <button
                          type="button"
                          onClick={() => setTtPlacementsDropdownOpen(!ttPlacementsDropdownOpen)}
                          className="w-full bg-white border border-slate-250 rounded px-3 py-1.5 font-bold text-slate-800 text-left flex items-center justify-between cursor-pointer focus:outline-hidden focus:border-blue-500 hover:bg-slate-50 transition-colors"
                        >
                          <span>已选 {ttSelectedPlacements.length} 个</span>
                          <span className="text-slate-400">▼</span>
                        </button>

                        {ttPlacementsDropdownOpen && (
                          <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg p-3 space-y-2 select-none animate-fade-in">
                            {['TikTok', 'Pangle', 'Global App Bundle'].map(plat => {
                              const isChecked = ttSelectedPlacements.includes(plat);
                              return (
                                <label key={plat} className="flex items-center gap-2 cursor-pointer py-1 hover:bg-slate-50 rounded px-1.5 font-semibold text-slate-700">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setTtSelectedPlacements([...ttSelectedPlacements, plat]);
                                      } else {
                                        setTtSelectedPlacements(ttSelectedPlacements.filter(p => p !== plat));
                                      }
                                    }}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                                  />
                                  <span>{plat}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Row 2: 搜索广告 (Search Ads) toggle switch */}
                  <div className="flex items-center justify-between border-t border-slate-50 pt-2.5">
                    <span className="font-bold text-slate-700">搜索广告</span>
                    <button
                      type="button"
                      onClick={() => setTtSearchAdsEnabled(!ttSearchAdsEnabled)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        ttSearchAdsEnabled ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          ttSearchAdsEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Row 3: 用户评论 toggle switch */}
                  <div className="flex items-center justify-between border-t border-slate-50 pt-2.5">
                    <span className="font-bold text-slate-700">用户评论</span>
                    <button
                      type="button"
                      onClick={() => setTtAllowComments(!ttAllowComments)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        ttAllowComments ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          ttAllowComments ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Row 4: 视频下载 toggle switch */}
                  <div className="flex items-center justify-between border-t border-slate-50 pt-2.5">
                    <span className="font-bold text-slate-700">视频下载</span>
                    <button
                      type="button"
                      onClick={() => setTtAllowVideoDownload(!ttAllowVideoDownload)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        ttAllowVideoDownload ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          ttAllowVideoDownload ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Row 5: Pangle 媒体屏蔽列表 toggle switch */}
                  <div className="flex items-center justify-between border-t border-slate-50 pt-2.5">
                    <span className="font-bold text-slate-700">Pangle 媒体屏蔽列表</span>
                    <button
                      type="button"
                      onClick={() => setTtPangleBlocklistEnabled(!ttPangleBlocklistEnabled)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        ttPangleBlocklistEnabled ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          ttPangleBlocklistEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Row 6: 视频共享 toggle switch */}
                  <div className="flex items-center justify-between border-t border-slate-50 pt-2.5">
                    <span className="font-bold text-slate-700">视频共享</span>
                    <button
                      type="button"
                      onClick={() => setTtAllowVideoShare(!ttAllowVideoShare)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        ttAllowVideoShare ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          ttAllowVideoShare ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 5: 出价和预算模块 (Bidding & Budget) */}
              <div ref={steps[7].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-colors">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-4">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                    <span className="w-1.5 h-3.5 bg-blue-600 rounded-2xs inline-block"></span>
                    出价和预算
                  </h3>

                  {/* Multi-budget pack creator tab select */}
                  <div className="flex items-center gap-2 select-none text-xs">
                    <button
                      type="button"
                      onClick={handleAddTtBudget}
                      className="text-blue-600 hover:text-blue-700 font-extrabold flex items-center gap-0.5 cursor-pointer"
                    >
                      + 新增预算包 {ttBudgets.length}/10
                    </button>
                  </div>
                </div>

                {/* Budget Pack Tabs */}
                <div className="flex flex-wrap border-b border-slate-200 mb-4 select-none items-center gap-1">
                  {ttBudgets.map(budget => {
                    const isActive = budget.id === activeTtBudgetId;
                    return (
                      <div
                        key={budget.id}
                        onClick={() => setActiveTtBudgetId(budget.id)}
                        className={`px-4 py-1.5 border-b-2 font-bold text-xs cursor-pointer transition-colors flex items-center gap-1.5 relative ${
                          isActive
                            ? 'border-blue-600 text-blue-600 bg-slate-50/50'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <span>{budget.name}</span>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTtBudgetMenuCoords({
                              top: rect.bottom + window.scrollY,
                              left: rect.left + window.scrollX
                            });
                            setTtBudgetMenuOpenId(ttBudgetMenuOpenId === budget.id ? null : budget.id);
                          }}
                          className="hover:text-blue-700 text-slate-400 font-extrabold px-1"
                          title="操作"
                        >
                          ⋮
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Conditional Notice if CBO is active */}
                {ttCboEnabled && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-150 rounded-lg text-[11px] text-blue-700 font-semibold flex items-center gap-2">
                    💡 <b>提示：</b> 您已在推广系列中开启了 "推广系列预算优化 (CBO)"，此处的部分预算设置已由推广系列全局接管控制。
                  </div>
                )}

                <div className="space-y-5 font-sans text-xs">
                  {/* Row 1: 预算 */}
                  <div className="flex items-start gap-4">
                    <label className="w-44 text-slate-500 font-bold mt-2 flex items-center gap-1 select-none">
                      <span>预算</span>
                      <span className="w-3.5 h-3.5 inline-flex items-center justify-center rounded-full border border-slate-400 text-slate-400 text-[10px] cursor-help font-extrabold" title="设置每个广告组的最高日预算或总预算">?</span>
                      <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <div className="flex-1 space-y-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setTtBudgetType('daily')}
                          className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                            ttBudgetType === 'daily' || ttBudgetType === 'unlimited'
                              ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs'
                              : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          单日预算
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTtBudgetType('lifetime');
                            updateActiveBudget(() => ({ endTimeType: 'custom' }));
                          }}
                          className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                            ttBudgetType === 'lifetime'
                              ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs'
                              : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          总预算
                        </button>
                      </div>
                      
                      <div className="flex max-w-[200px] animate-fade-in">
                        <input
                          type="text"
                          placeholder="请输入"
                          value={ttAdGroupDailyBudget}
                          onChange={e => setTtAdGroupDailyBudget(e.target.value)}
                          className="flex-1 bg-white border border-slate-250 hover:border-slate-350 rounded-l px-3 py-1.5 font-bold text-slate-800 focus:outline-hidden focus:border-blue-500 text-xs"
                        />
                        <span className="bg-slate-50 border border-l-0 border-slate-250 rounded-r px-4 py-1.5 text-slate-500 font-bold flex items-center justify-center text-[11px] select-none">USD</span>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: 优化目标 */}
                  <div className="flex items-center gap-4 border-t border-slate-50 pt-4">
                    <label className="w-44 text-slate-500 font-bold select-none">优化目标</label>
                    <div className="flex gap-2">
                      {[
                        { label: '安装', value: 'install' as const },
                        { label: '点击数', value: 'clicks' as const },
                        { label: '应用内事件', value: 'event' as const },
                        { label: '价值', value: 'conversion' as const },
                      ].map(opt => {
                        const isActive = ttOptimizationGoal === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setTtOptimizationGoal(opt.value);
                              const extra: any = {};
                              if (opt.value === 'event') {
                                extra.clickAttributionWindow = '7天 (点击)';
                                extra.deepAttributionWindow = '7天 (深度互动观看)';
                                extra.viewAttributionWindow = '1天 (展示)';
                                extra.eventCountType = '仅一次';
                              }
                              updateActiveBudget(() => ({
                                optimizationGoal: opt.value as any,
                                ...extra
                              }));
                            }}
                            className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                              isActive ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Row 2.5: 目标ROAS (Only shown when ttOptimizationGoal === 'conversion' / 价值) */}
                  {ttOptimizationGoal === 'conversion' && (
                    <div className="flex flex-col gap-2.5 border-t border-slate-50 pt-4 animate-fade-in">
                      <div className="flex items-start gap-4">
                        <label className="w-44 text-slate-500 font-bold mt-2 flex items-center gap-1 select-none">
                          <span>目标ROAS</span>
                          <span className="w-3.5 h-3.5 inline-flex items-center justify-center rounded-full border border-slate-400 text-slate-400 text-[10px] cursor-help font-extrabold" title="设置广告组的广告花费回报目标 (ROAS)">?</span>
                          <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="flex-1 space-y-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => updateActiveBudget(() => ({ targetRoasType: 'day0' }))}
                              className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                                (activeBudget.targetRoasType || 'day0') === 'day0'
                                  ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs'
                                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                              }`}
                            >
                              第0天 ROAS
                            </button>
                            <button
                              type="button"
                              onClick={() => updateActiveBudget(() => ({ targetRoasType: 'day7' }))}
                              className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                                activeBudget.targetRoasType === 'day7'
                                  ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs'
                                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                              }`}
                            >
                              第7天 ROAS
                            </button>
                          </div>
                          
                          <div className="flex max-w-[200px] animate-fade-in">
                            <input
                              type="text"
                              placeholder="请输入"
                              value={activeBudget.targetRoasValue || ''}
                              onChange={e => updateActiveBudget(() => ({ targetRoasValue: e.target.value }))}
                              className="flex-1 bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-1.5 font-bold text-slate-800 focus:outline-hidden focus:border-blue-500 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Row 3: 计费方式 */}
                  <div className="flex items-center gap-4 border-t border-slate-50 pt-4">
                    <label className="w-44 text-slate-500 font-bold select-none">计费方式</label>
                    <div className="flex gap-2">
                      <span className="py-1.5 px-6 border border-blue-500 bg-blue-50 text-blue-600 rounded text-xs font-extrabold shadow-2xs select-none">
                        {ttOptimizationGoal === 'clicks' ? '点击(CPC)' : '展示(oCPM)'}
                      </span>
                    </div>
                  </div>

                  {/* Row 4: 竞价策略 */}
                  <div className="flex items-center gap-4 border-t border-slate-50 pt-4">
                    <label className="w-44 text-slate-500 font-bold select-none">竞价策略</label>
                    <div className="flex gap-2">
                      {ttOptimizationGoal === 'conversion' ? (
                        <span className="py-1.5 px-6 border border-blue-500 bg-blue-50 text-blue-600 rounded text-xs font-extrabold shadow-2xs select-none">
                          最大投放量
                        </span>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => setTtBidType('cost_cap')}
                            className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                              ttBidType === 'cost_cap' ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            成本上限
                          </button>
                          <button
                            type="button"
                            onClick={() => setTtBidType('lowest_cost')}
                            className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                              ttBidType === 'lowest_cost' ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            最大投放量
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Row 5: 出价 */}
                  {ttBidType === 'cost_cap' && ttOptimizationGoal !== 'conversion' && (
                    <div className="flex items-center gap-4 border-t border-slate-50 pt-4 animate-fade-in">
                      <label className="w-44 text-slate-500 font-bold select-none">出价</label>
                      <div className="flex max-w-[200px] flex-1">
                        <input
                          type="text"
                          placeholder="请输入"
                          value={ttTargetBid}
                          onChange={e => setTtTargetBid(e.target.value)}
                          className="flex-1 bg-white border border-slate-250 hover:border-slate-350 rounded-l px-3 py-1.5 font-bold text-slate-800 focus:outline-hidden focus:border-blue-500 text-xs"
                        />
                        <span className="bg-slate-50 border border-l-0 border-slate-250 rounded-r px-4 py-1.5 text-slate-500 font-bold flex items-center justify-center text-[11px] select-none">USD</span>
                      </div>
                    </div>
                  )}

                  {/* Row 5.1: 点击归因窗口期 (Shown when ttOptimizationGoal === 'conversion' or 'event') */}
                  {(ttOptimizationGoal === 'conversion' || ttOptimizationGoal === 'event') && (
                    <div className="flex items-center gap-4 border-t border-slate-50 pt-4 animate-fade-in">
                      <label className="w-44 text-slate-500 font-bold select-none">点击归因窗口期</label>
                      <div className="flex gap-2">
                        {(ttOptimizationGoal === 'event' ? ['7天 (点击)'] : ['1天 (点击)', '7天 (点击)', '14天 (点击)', '28天 (点击)']).map(win => {
                          const currentWin = activeBudget.clickAttributionWindow || '7天 (点击)';
                          const isActive = ttOptimizationGoal === 'event' ? true : (currentWin === win);
                          return (
                            <button
                              key={win}
                              type="button"
                              onClick={() => {
                                if (ttOptimizationGoal === 'event') return;
                                updateActiveBudget(() => ({ clickAttributionWindow: win }));
                              }}
                              className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                                isActive ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                              }`}
                            >
                              {win}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Row 5.2: 深度互动观看归因窗口期 (Shown when ttOptimizationGoal === 'conversion' or 'event') */}
                  {(ttOptimizationGoal === 'conversion' || ttOptimizationGoal === 'event') && (
                    <div className="flex items-center gap-4 border-t border-slate-50 pt-4 animate-fade-in">
                      <label className="w-44 text-slate-500 font-bold select-none">深度互动观看归因窗口期</label>
                      <div className="flex gap-2">
                        {(ttOptimizationGoal === 'event' ? ['7天 (深度互动观看)'] : ['1天 (深度互动观看)', '7天 (深度互动观看)']).map(win => {
                          const currentWin = activeBudget.deepAttributionWindow || '7天 (深度互动观看)';
                          const isActive = ttOptimizationGoal === 'event' ? true : (currentWin === win);
                          return (
                            <button
                              key={win}
                              type="button"
                              onClick={() => {
                                if (ttOptimizationGoal === 'event') return;
                                updateActiveBudget(() => ({ deepAttributionWindow: win }));
                              }}
                              className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                                isActive ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                              }`}
                            >
                              {win}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Row 5.3: 展示归因窗口期 (Shown when ttOptimizationGoal === 'conversion' or 'event') */}
                  {(ttOptimizationGoal === 'conversion' || ttOptimizationGoal === 'event') && (
                    <div className="flex items-center gap-4 border-t border-slate-50 pt-4 animate-fade-in">
                      <label className="w-44 text-slate-500 font-bold select-none">展示归因窗口期</label>
                      <div className="flex gap-2">
                        {(ttOptimizationGoal === 'event' ? ['1天 (展示)'] : ['1天 (展示)', '7天 (展示)']).map(win => {
                          const currentWin = activeBudget.viewAttributionWindow || '1天 (展示)';
                          const isActive = ttOptimizationGoal === 'event' ? true : (currentWin === win);
                          return (
                            <button
                              key={win}
                              type="button"
                              onClick={() => {
                                if (ttOptimizationGoal === 'event') return;
                                updateActiveBudget(() => ({ viewAttributionWindow: win }));
                              }}
                              className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                                isActive ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                              }`}
                            >
                              {win}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Row 5.4: 事件统计方式 (Shown when ttOptimizationGoal === 'conversion' or 'event') */}
                  {(ttOptimizationGoal === 'conversion' || ttOptimizationGoal === 'event') && (
                    <div className="flex items-center gap-4 border-t border-slate-50 pt-4 animate-fade-in">
                      <label className="w-44 text-slate-500 font-bold select-none">事件统计方式</label>
                      <div className="flex gap-2">
                        {(ttOptimizationGoal === 'event' ? ['仅一次'] : ['每一次', '仅一次']).map(countType => {
                          const currentCountType = activeBudget.eventCountType || '每一次';
                          const isActive = ttOptimizationGoal === 'event' ? true : (currentCountType === countType);
                          return (
                            <button
                              key={countType}
                              type="button"
                              onClick={() => {
                                if (ttOptimizationGoal === 'event') return;
                                updateActiveBudget(() => ({ eventCountType: countType }));
                              }}
                              className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                                isActive ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                              }`}
                            >
                              {countType}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Row 6: 投放速度 */}
                  <div className="flex items-center gap-4 border-t border-slate-50 pt-4">
                    <label className="w-44 text-slate-500 font-bold select-none">投放速度</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => updateActiveBudget(() => ({ pacing: '标准' }))}
                        className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                          activeBudget.pacing === '标准' || !activeBudget.pacing || ttBudgetType === 'lifetime'
                            ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs'
                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        标准
                      </button>
                      {ttBudgetType !== 'lifetime' && (
                        <button
                          type="button"
                          onClick={() => updateActiveBudget(() => ({ pacing: '加速' }))}
                          className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer animate-fade-in ${
                            activeBudget.pacing === '加速'
                              ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs'
                              : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          加速
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Row 7: 开始时间 */}
                  <div className="flex flex-col gap-2.5 border-t border-slate-50 pt-4">
                    <div className="flex items-center gap-4">
                      <label className="w-44 text-slate-500 font-bold select-none">开始时间</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => updateActiveBudget(() => ({ startTimeType: 'now' }))}
                          className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                            activeBudget.startTimeType === 'now' || !activeBudget.startTimeType
                              ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs'
                              : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          立即开始
                        </button>
                        <button
                          type="button"
                          onClick={() => updateActiveBudget(() => ({ startTimeType: 'custom' }))}
                          className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                            activeBudget.startTimeType === 'custom'
                              ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs'
                              : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          指定时间
                        </button>
                      </div>
                    </div>

                    {/* Custom DateTime Inputs for Start Time */}
                    {activeBudget.startTimeType === 'custom' && (
                      <div className="flex items-center gap-3 pl-48 animate-fade-in select-none">
                        {/* Date Input with Calendar Icon */}
                        <div className="relative flex items-center max-w-[150px]">
                          <input
                            type="date"
                            value={ttStartDate}
                            onChange={e => setTtStartDate(e.target.value)}
                            className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-2.5 py-1.5 pr-8 text-xs font-bold text-slate-700 cursor-pointer focus:outline-hidden"
                          />
                          <Calendar className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
                        </div>

                        {/* Time Input with Clock Icon */}
                        <div className="relative flex items-center max-w-[100px]">
                          <input
                            type="text"
                            placeholder="11:17"
                            value={ttStartTime}
                            onChange={e => setTtStartTime(e.target.value)}
                            className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-2.5 py-1.5 pr-8 text-xs font-bold text-slate-700 focus:outline-hidden"
                          />
                          <Clock className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
                        </div>

                        {/* Timezone Indicator */}
                        <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold pl-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{ttBudgetTimezone}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Row 8: 结束时间 */}
                  <div className="flex flex-col gap-2.5 border-t border-slate-50 pt-4">
                    <div className="flex items-center gap-4">
                      <label className="w-44 text-slate-500 font-bold select-none">结束时间</label>
                      <div className="flex gap-2">
                        {ttBudgetType === 'lifetime' ? (
                          <button
                            type="button"
                            disabled
                            className="py-1.5 px-6 border rounded text-xs font-bold border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed select-none opacity-50"
                            title="总预算必须指定结束时间"
                          >
                            长期投放
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => updateActiveBudget(() => ({ endTimeType: 'lifetime' }))}
                            className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                              activeBudget.endTimeType === 'lifetime' || !activeBudget.endTimeType
                                ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs'
                                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            长期投放
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => updateActiveBudget(() => ({ endTimeType: 'custom' }))}
                          className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                            activeBudget.endTimeType === 'custom' || ttBudgetType === 'lifetime'
                              ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs'
                              : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          自定义投放时间
                        </button>
                      </div>
                    </div>

                    {/* Custom DateTime Inputs */}
                    {(activeBudget.endTimeType === 'custom' || ttBudgetType === 'lifetime') && (
                      <div className="flex items-center gap-3 pl-48 animate-fade-in select-none">
                        {/* Date Input with Calendar Icon */}
                        <div className="relative flex items-center max-w-[150px]">
                          <input
                            type="date"
                            value={ttBudgetEndDate}
                            onChange={e => setTtBudgetEndDate(e.target.value)}
                            className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-2.5 py-1.5 pr-8 text-xs font-bold text-slate-700 cursor-pointer focus:outline-hidden"
                          />
                          <Calendar className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
                        </div>

                        {/* Time Input with Clock Icon */}
                        <div className="relative flex items-center max-w-[100px]">
                          <input
                            type="text"
                            placeholder="11:17"
                            value={ttBudgetEndTime}
                            onChange={e => setTtBudgetEndTime(e.target.value)}
                            className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-2.5 py-1.5 pr-8 text-xs font-bold text-slate-700 focus:outline-hidden"
                          />
                          <Clock className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
                        </div>

                        {/* Timezone Indicator */}
                        <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold pl-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{ttBudgetTimezone}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Row 9: 投放时段 */}
                  <div className="flex flex-col gap-3 border-t border-slate-50 pt-4 pb-2">
                    <div className="flex items-center gap-4">
                      <label className="w-44 text-slate-500 font-bold select-none">投放时段</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => updateActiveBudget(() => ({ deliveryScheduleType: 'all_day' }))}
                          className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                            activeBudget.deliveryScheduleType === 'all_day' || !activeBudget.deliveryScheduleType
                              ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs'
                              : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          全天投放
                        </button>
                        <button
                          type="button"
                          onClick={() => updateActiveBudget(() => ({ deliveryScheduleType: 'custom' }))}
                          className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                            activeBudget.deliveryScheduleType === 'custom'
                              ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold shadow-2xs'
                              : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          指定时间投
                        </button>
                      </div>
                    </div>

                    {/* Custom Week Hour Grid for delivery schedule */}
                    {activeBudget.deliveryScheduleType === 'custom' && (
                      <div className="pl-48 animate-fade-in">
                        <WeekHourGrid
                          value={activeBudget.scheduleGrid || Array.from({ length: 7 }, () => Array(24).fill(false))}
                          onChange={(newGrid) => updateActiveBudget(() => ({ scheduleGrid: newGrid }))}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 6: 创意设置 (Creative Settings) */}
              <div ref={steps[8].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-colors">
                <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-4 flex items-center gap-1.5 uppercase tracking-wide">
                  <span className="w-1.5 h-3.5 bg-blue-600 rounded-2xs inline-block"></span>
                  创意设置
                </h3>
                
                <div className="space-y-5 font-sans text-xs">
                  {/* Row 1: 智能创意广告 */}
                  <div className="flex items-center gap-4">
                    <label className="w-48 text-slate-500 font-bold flex items-center gap-1">
                      智能创意广告
                      <span className="text-slate-400 cursor-help text-[11px]" title="开启后将自动组合多个视频和文案并智能优化">③</span>
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTtSmartCreativeEnabled(false);
                          setTtAutoGenAdNameByFile(false);
                        }}
                        className={`py-1.5 px-4 border rounded text-xs font-bold transition-all cursor-pointer ${
                          !ttSmartCreativeEnabled ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        关闭
                      </button>
                      <button
                        type="button"
                        onClick={() => setTtSmartCreativeEnabled(true)}
                        className={`py-1.5 px-4 border rounded text-xs font-bold transition-all cursor-pointer ${
                          ttSmartCreativeEnabled ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        开启
                      </button>
                    </div>
                  </div>

                  {/* Row 1.5: 根据素材文件名自动生成AD名称 (Only visible when Smart Creative is enabled) */}
                  {ttSmartCreativeEnabled && (
                    <div className="flex items-center gap-4 border-t border-slate-50 pt-3 animate-fade-in">
                      <label className="w-48 text-slate-500 font-bold flex items-center gap-1">
                        根据素材文件名自动生成AD名称
                        <span className="text-slate-400 cursor-help text-[11px]" title="开启后，广告名称将根据上传素材的文件名自动生成，支持动态占位符">③</span>
                      </label>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => setTtAutoGenAdNameByFile(!ttAutoGenAdNameByFile)}
                          className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                            ttAutoGenAdNameByFile ? 'bg-blue-600' : 'bg-slate-250'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4.2 w-4.2 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              ttAutoGenAdNameByFile ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className="ml-2.5 font-bold text-slate-600">
                          {ttAutoGenAdNameByFile ? '已开启' : '已关闭'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Row 2: 广告名称 (Only visible when NOT auto-generating name) */}
                  {!ttAutoGenAdNameByFile ? (
                    <div className="border-t border-slate-50 pt-3 animate-fade-in">
                      <label className="block text-slate-655 font-bold mb-1.5">
                        广告名称 <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <div className="relative max-w-xl">
                        <input
                          type="text"
                          placeholder="请输入广告名称"
                          value={adCreativeName}
                          onChange={e => setAdCreativeName(e.target.value)}
                          className="w-full bg-white border border-slate-250 rounded px-3 py-2 text-slate-800 font-bold focus:outline-hidden focus:border-blue-500"
                        />
                      </div>

                      <div className="mt-2 text-[10.5px] font-bold text-slate-400">
                        点击添加标签到广告名称:
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1.5 select-none items-center max-w-xl">
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
                            onClick={() => handleInsertTagToAdCreativeName(badge.value)}
                            className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            {badge.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="border-t border-slate-50 pt-3 animate-fade-in">
                      <div className="bg-emerald-50 border border-emerald-150 rounded-lg p-3 text-[11px] text-emerald-800 font-bold max-w-xl flex items-center gap-2">
                        <span>✨</span>
                        <span>广告名称将根据上传素材的文件名自动生成。可以在下方的 [创意组] 里查看具体素材名与动态效果。</span>
                      </div>
                    </div>
                  )}

                  {/* Row 3: 使用TikTok账号投放Spark Ads */}
                  <div className="flex items-center gap-4 border-t border-slate-50 pt-3">
                    <label className="w-48 text-slate-500 font-bold flex items-center gap-1">
                      使用TikTok账号投放Spark Ads
                      <span className="text-slate-400 cursor-help text-[11px]" title="开启后，可以使用拥有的TikTok账号视频或者获得授权的视频进行投放">③</span>
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setTtSparkAdsEnabled(false)}
                        className={`py-1.5 px-4 border rounded text-xs font-bold transition-all cursor-pointer ${
                          !ttSparkAdsEnabled ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        关闭
                      </button>
                      <button
                        type="button"
                        onClick={() => setTtSparkAdsEnabled(true)}
                        className={`py-1.5 px-4 border rounded text-xs font-bold transition-all cursor-pointer ${
                          ttSparkAdsEnabled ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        开启
                      </button>
                    </div>
                  </div>

                  {/* Row 4: 设置自定义身份 */}
                  {!ttSparkAdsEnabled && (
                    <div className="border-t border-slate-100 pt-3 max-w-xl animate-fade-in">
                      <label className="block text-slate-700 font-extrabold mb-2 text-xs">
                        设置自定义身份
                      </label>
                      
                      {ttAutoGenAdNameByFile ? (
                        /* Mode: Dropdown selection (Image 3) */
                        <div className="space-y-1 max-w-sm">
                          <select
                            value={ttCustomIdentities['7598159223087939600'] || ''}
                            onChange={e => {
                              const val = e.target.value;
                              // Set custom identity for both default accounts to synchronize
                              setTtCustomIdentities({
                                '7598159223087939600': val,
                                '7397618729426878480': val
                              });
                            }}
                            className="w-full bg-white border border-slate-250 rounded px-3 py-1.5 font-bold text-slate-700 cursor-pointer focus:outline-hidden text-xs"
                          >
                            <option value="">请选择</option>
                            <option value="sudoku_master">数独达人 (Sudoku Pro)</option>
                            <option value="funny_commentary">搞笑解说_tt</option>
                            <option value="piano_expert">钢琴高手-01</option>
                            <option value="rhythm_blogger">音游博主_99</option>
                          </select>
                          <p className="text-[10.5px] text-slate-400 font-semibold">当自动生成名称开启时，将对所有关联账号统一套用选择的自定义身份</p>
                        </div>
                      ) : (
                        /* Mode: Table grid allocation (Image 2) */
                        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                                <th className="p-2.5 font-bold w-1/2">广告账户</th>
                                <th className="p-2.5 font-bold w-1/2">自定义身份</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              <tr>
                                <td className="p-2.5">
                                  <div className="font-bold text-slate-800">数独-跑崇-mini-0时区-01</div>
                                  <div className="text-[10px] text-slate-400 font-mono">ID: 7598159223087939600</div>
                                </td>
                                <td className="p-2.5">
                                  <select
                                    value={ttCustomIdentities['7598159223087939600'] || ''}
                                    onChange={e => setTtCustomIdentities({
                                      ...ttCustomIdentities,
                                      '7598159223087939600': e.target.value
                                    })}
                                    className="w-full bg-white border border-slate-250 rounded px-2.5 py-1.5 font-bold text-slate-700 focus:outline-hidden text-xs cursor-pointer"
                                  >
                                    <option value="">请选择</option>
                                    <option value="sudoku_master">数独达人 (Sudoku Pro)</option>
                                    <option value="funny_commentary">搞笑解说_tt</option>
                                  </select>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2.5">
                                  <div className="font-bold text-slate-800">PA-跑崇-01</div>
                                  <div className="text-[10px] text-slate-400 font-mono">ID: 7397618729426878480</div>
                                </td>
                                <td className="p-2.5">
                                  <select
                                    value={ttCustomIdentities['7397618729426878480'] || ''}
                                    onChange={e => setTtCustomIdentities({
                                      ...ttCustomIdentities,
                                      '7397618729426878480': e.target.value
                                    })}
                                    className="w-full bg-white border border-slate-250 rounded px-2.5 py-1.5 font-bold text-slate-700 focus:outline-hidden text-xs cursor-pointer"
                                  >
                                    <option value="">请选择</option>
                                    <option value="piano_expert">钢琴高手-01</option>
                                    <option value="rhythm_blogger">音游博主_99</option>
                                  </select>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Row 5: 创新互动样式 */}
                  <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
                    <label className="w-48 text-slate-500 font-bold flex items-center gap-1">
                      创新互动样式
                      <span className="text-slate-400 cursor-help text-[11px]" title="开启后可以使用卡片、投票、滑动等附加创意，从而获得更高的点击率">③</span>
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setTtInnovativeStyleEnabled(false)}
                        className={`py-1.5 px-4 border rounded text-xs font-bold transition-all cursor-pointer ${
                          !ttInnovativeStyleEnabled ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        关闭
                      </button>
                      <button
                        type="button"
                        onClick={() => setTtInnovativeStyleEnabled(true)}
                        className={`py-1.5 px-4 border rounded text-xs font-bold transition-all cursor-pointer ${
                          ttInnovativeStyleEnabled ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        开启
                      </button>
                    </div>
                  </div>

                  {/* Conditional fields for Interactive Style when enabled */}
                  {ttInnovativeStyleEnabled && (
                    <div className="space-y-4 animate-fade-in border-t border-slate-50 pt-3">
                      {/* Row 6: 选择互动样式 */}
                      <div className="flex items-center gap-4">
                        <label className="w-48 text-slate-500 font-bold flex items-center">
                          选择互动样式
                        </label>
                        <div className="flex gap-2">
                          <button
                            key="tt_create_now"
                            type="button"
                            onClick={() => setInteractiveStyle('create_now')}
                            className={`py-1.5 px-4 border rounded text-xs font-bold transition-all cursor-pointer ${
                              interactiveStyle === 'create_now'
                                ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold'
                                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            立即制作
                          </button>
                          <button
                            key="tt_from_library"
                            type="button"
                            onClick={() => setInteractiveStyle('from_library')}
                            className={`py-1.5 px-4 border rounded text-xs font-bold transition-all cursor-pointer ${
                              interactiveStyle === 'from_library'
                                ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold'
                                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            从素材库选择
                          </button>
                        </div>
                      </div>

                      {/* Row 7: 卡片样式 */}
                      {interactiveStyle === 'create_now' && (
                        <div className="flex items-center gap-4">
                          <label className="w-48 text-slate-500 font-bold flex items-center">
                            卡片样式
                          </label>
                          <button
                            type="button"
                            className="py-1.5 px-4 border border-blue-500 bg-blue-50 text-blue-600 font-extrabold rounded text-xs select-none cursor-pointer"
                          >
                            图片卡片
                          </button>
                        </div>
                      )}

                      {/* Row 8: 附加创意 */}
                      <div className="flex items-center gap-4">
                        <label className="w-48 text-slate-500 font-bold flex items-center">
                          附加创意
                        </label>
                        <button
                          type="button"
                          onClick={() => alert('已打开添加附加创意素材选项')}
                          className="flex items-center gap-1.5 py-1.5 px-4 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-xs font-bold transition-all cursor-pointer shadow-3xs"
                        >
                          <Image className="w-3.5 h-3.5 text-slate-500" />
                          <span>添加素材</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 7: 创意组 (Creative Group) */}
              <div ref={steps[9].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-colors">
                <div className="flex items-center justify-between border-b border-slate-150 pb-2.5 mb-4 select-none">
                  <h3 className="text-sm font-bold text-slate-900">创意组</h3>
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                    <button
                      type="button"
                      onClick={() => alert('已打开批量操作菜单')}
                      className="hover:text-blue-600 flex items-center gap-0.5 cursor-pointer transition-colors"
                    >
                      <span>批量操作</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCreativeIds([]);
                        setAdCopywritingInput('');
                        setAdCreativeTags('');
                        alert('已清空选中的素材及文本');
                      }}
                      className="hover:text-blue-600 cursor-pointer transition-colors"
                    >
                      清空
                    </button>
                  </div>
                </div>

                {/* Tabs row */}
                <div className="flex items-center justify-between border-b border-slate-200 mb-4 select-none">
                  <div className="flex flex-wrap items-center gap-1 -mb-[1px]">
                    {ttCreativeGroups.map(group => {
                      const isActive = group.id === activeTtCreativeGroupId;
                      return (
                        <div
                          key={group.id}
                          onClick={() => setActiveTtCreativeGroupId(group.id)}
                          className={`px-5 py-2 border-t border-l border-r font-bold text-xs flex items-center gap-2 cursor-pointer rounded-t transition-colors ${
                            isActive
                              ? 'border-slate-200 bg-white text-blue-600'
                              : 'border-transparent bg-transparent text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <span>{group.name}</span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = e.currentTarget.getBoundingClientRect();
                              setTtCreativeGroupMenuCoords({
                                top: rect.bottom + window.scrollY,
                                left: rect.left + window.scrollX
                              });
                              setTtCreativeGroupMenuOpenId(ttCreativeGroupMenuOpenId === group.id ? null : group.id);
                            }}
                            className="text-slate-400 hover:text-slate-600 font-extrabold text-[11px] px-0.5"
                          >
                            ⋮
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <button
                      type="button"
                      onClick={handleAddTtCreativeGroup}
                      className="text-slate-700 hover:text-blue-600 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-slate-500" />
                      <span>新增</span>
                    </button>
                    <span className="text-slate-400 font-mono">{ttCreativeGroups.length}/50</span>
                  </div>
                </div>

                <div className="space-y-4 font-sans text-xs">
                  {ttCampaignType === 'smart' ? (
                    <>
                      {/* --- SMART CAMPAIGN OPTIMIZED LAYOUT --- */}
                      {/* Notice Bar 1 */}
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-md flex items-center gap-2.5 text-blue-800 leading-relaxed font-semibold animate-fade-in">
                        <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <div>
                          视频和帖子总共最多上传30个，现在已上传<b className="text-blue-600 mx-1">({selectedCreativeIds.length}/30)</b>个
                        </div>
                      </div>

                      {/* Row: 选择已有创意组 Checkbox */}
                      <div className="flex items-center gap-2 py-1 select-none">
                        <input
                          type="checkbox"
                          id="tt-select-existing-group-optimized"
                          checked={ttSelectExistingCreativeGroup}
                          onChange={e => setTtSelectExistingCreativeGroup(e.target.checked)}
                          className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                        />
                        <label htmlFor="tt-select-existing-group-optimized" className="font-bold text-blue-600 hover:underline cursor-pointer">
                          选择已有创意组
                        </label>
                      </div>

                      {/* Notice Bar 2 */}
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-md flex items-center gap-2.5 text-blue-800 leading-relaxed font-semibold animate-fade-in">
                        <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <div>
                          如果选中的视频宽高比或者分辨率不符合tiktok的要求，系统会自动修复，但会默认以选第一个封面且需要一些修复时间
                        </div>
                      </div>

                      {/* Field: 视频 */}
                      <div className="flex items-center min-h-[36px] border-t border-slate-50 pt-2 animate-fade-in">
                        <label className="w-44 text-slate-800 font-bold select-none text-xs flex-shrink-0">
                          视频 <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setMaterialSelectorType('video')}
                            className="flex items-center gap-1.5 py-1.5 px-4 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-xs font-bold transition-all cursor-pointer shadow-3xs"
                          >
                            <Plus className="w-3.5 h-3.5 text-slate-500" />
                            <span>添加素材</span>
                          </button>
                        </div>
                      </div>

                      {/* Selected Materials List Preview */}
                      {selectedCreativeIds.length > 0 && (
                        <div className="p-3 border border-slate-200 rounded-lg bg-white ml-44 max-w-xl animate-fade-in">
                          <div className="font-bold text-slate-600 mb-2">已添加素材预览 ({selectedCreativeIds.length} 个)</div>
                          <div className="grid grid-cols-5 gap-2.5">
                            {selectedCreativeIds.map(id => {
                              const mat = materials.find(m => m.id === id);
                              return (
                                <div key={id} className="relative aspect-square border border-slate-200 rounded overflow-hidden bg-black flex items-center justify-center">
                                  {mat?.type === 'video' ? (
                                    <video src={mat.url} className="w-full h-full object-cover" muted />
                                  ) : (
                                    <img src={mat?.url || '/video_placeholder.png'} className="w-full h-full object-cover" alt="" />
                                  )}
                                  <span className="absolute bottom-1 left-1 px-1 py-0.5 bg-black/60 text-white rounded text-[8px] scale-90 font-bold uppercase">
                                    {mat?.type || 'Image'}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedCreativeIds(p => p.filter(x => x !== id))}
                                    className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold cursor-pointer hover:bg-rose-600"
                                  >
                                    ×
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Field: 广告文案 */}
                      <div className="flex items-start min-h-[36px] border-t border-slate-50 pt-2 animate-fade-in">
                        <label className="w-44 text-slate-800 font-bold select-none text-xs flex-shrink-0 pt-1.5">
                          广告文案 <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="space-y-2 w-[360px]">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => alert('已打开系统文案推荐库')}
                              className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded text-xs font-bold transition-all cursor-pointer shadow-3xs"
                            >
                              选文案
                            </button>
                            <button
                              type="button"
                              onClick={() => alert('支持多项配比智能优选文案文箱')}
                              className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded text-xs font-bold transition-all cursor-pointer shadow-3xs"
                            >
                              批量添加文案
                            </button>
                            <span className="text-xs text-slate-400 font-medium font-mono select-none">(1 / 5)</span>
                          </div>

                          <div className="relative flex items-center">
                            <input
                              type="text"
                              placeholder="请输入广告文案"
                              value={adCopywritingInput}
                              onChange={e => setAdCopywritingInput(e.target.value.slice(0, 100))}
                              className="w-full bg-white border border-slate-250 hover:border-slate-300 rounded pl-3 pr-16 py-1.5 text-xs text-slate-800 font-bold focus:outline-hidden focus:border-blue-500"
                            />
                            <span className="absolute right-3 text-[10px] text-slate-400 font-mono pointer-events-none">
                              {adCopywritingInput.length} / 100
                            </span>
                          </div>

                          <div>
                            <button
                              type="button"
                              onClick={() => alert('已开启动态测试文案标题输入框')}
                              className="text-blue-600 hover:underline font-bold text-xs cursor-pointer select-none"
                            >
                              新增标题
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Field: 延迟深度链接 */}
                      <div className="flex items-center min-h-[36px] border-t border-slate-50 pt-2 animate-fade-in">
                        <label className="w-44 text-slate-800 font-bold select-none text-xs flex-shrink-0">
                          延迟深度链接
                        </label>
                        <input
                          type="text"
                          placeholder="目前只支持scheme格式"
                          value={ttDeferredDeepLink}
                          onChange={e => setTtDeferredDeepLink(e.target.value)}
                          className="w-[360px] bg-white border border-slate-250 hover:border-slate-300 rounded px-3 py-1.5 font-bold text-slate-700 text-xs focus:outline-hidden focus:border-blue-500"
                        />
                      </div>

                      {/* Field: 行动号召 */}
                      <div className="flex items-start min-h-[36px] border-t border-slate-50 pt-2 animate-fade-in">
                        <label className="w-44 text-slate-800 font-bold select-none text-xs flex-shrink-0 pt-1.5">
                          行动号召 <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="space-y-2 w-[360px]">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setTtCtaType('standard')}
                              className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                                ttCtaType === 'standard'
                                  ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold'
                                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                              }`}
                            >
                              标准
                            </button>
                            <button
                              type="button"
                              onClick={() => setTtCtaType('dynamic')}
                              className={`py-1.5 px-6 border rounded text-xs font-bold transition-all cursor-pointer ${
                                ttCtaType === 'dynamic'
                                  ? 'border-blue-500 bg-blue-50 text-blue-600 font-extrabold'
                                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                              }`}
                            >
                              动态优选
                            </button>
                          </div>

                          {ttCtaType === 'standard' ? (
                            <div className="space-y-2">
                              <div className="relative flex items-center">
                                <select
                                  value={ttCtaSelectedAction}
                                  onChange={e => setTtCtaSelectedAction(e.target.value)}
                                  className="w-full bg-white border border-slate-250 hover:border-slate-300 rounded pl-3 pr-8 py-1.5 font-bold text-slate-700 text-xs focus:outline-hidden cursor-pointer appearance-none"
                                >
                                  <option value="查看详情">查看详情</option>
                                  <option value="立即下载">立即下载</option>
                                  <option value="玩游戏">玩游戏</option>
                                  <option value="立即购买">立即购买</option>
                                </select>
                                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
                              </div>
                              <div>
                                <button
                                  type="button"
                                  onClick={() => alert('已新增一条行动号召动作项')}
                                  className="text-blue-600 hover:underline font-bold text-xs cursor-pointer select-none"
                                >
                                  添加
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="relative">
                              {/* Selection Display Trigger */}
                              <button
                                type="button"
                                onClick={() => setTtCtaDropdownOpen(!ttCtaDropdownOpen)}
                                className="w-full flex items-center justify-between bg-white border border-blue-500 rounded px-3 py-1.5 font-bold text-slate-800 text-xs cursor-pointer focus:outline-hidden select-none"
                              >
                                <span>
                                  {ttCtaDynamicSelected.length === 0 
                                    ? '请选择' 
                                    : ttCtaDynamicSelected.length === allCtaOptions.length 
                                      ? '全部' 
                                      : `已选 ${ttCtaDynamicSelected.length} 个`}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${ttCtaDropdownOpen ? 'rotate-180' : ''}`} />
                              </button>

                              {/* Custom Dropdown Panel */}
                              {ttCtaDropdownOpen && (
                                <div className="absolute top-full left-0 mt-1.5 w-[520px] bg-white border border-slate-200 rounded shadow-xl z-50 flex divide-x divide-slate-100 font-sans text-xs">
                                  {/* Left Column: Search & Options */}
                                  <div className="w-1/2 p-3 flex flex-col h-72">
                                    <div className="relative mb-2">
                                      <span className="absolute left-2.5 top-2.5 text-slate-400">
                                        <Search className="w-3.5 h-3.5" />
                                      </span>
                                      <input
                                        type="text"
                                        value={ttCtaDynamicSearch}
                                        onChange={e => setTtCtaDynamicSearch(e.target.value)}
                                        placeholder="请输入"
                                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 text-xs"
                                      />
                                    </div>

                                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                                      {/* Select All */}
                                      <label className="flex items-center gap-2 py-1 px-2 hover:bg-slate-50 rounded cursor-pointer select-none">
                                        <input
                                          type="checkbox"
                                          checked={ttCtaDynamicSelected.length === allCtaOptions.length}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setTtCtaDynamicSelected([...allCtaOptions]);
                                            } else {
                                              setTtCtaDynamicSelected([]);
                                            }
                                          }}
                                          className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                                        />
                                        <span className="font-bold text-slate-800">全选</span>
                                      </label>

                                      {/* Options list */}
                                      {allCtaOptions
                                        .filter(opt => opt.toLowerCase().includes(ttCtaDynamicSearch.toLowerCase()))
                                        .map(opt => {
                                          const isChecked = ttCtaDynamicSelected.includes(opt);
                                          return (
                                            <label key={opt} className="flex items-center gap-2 py-1 px-2 hover:bg-slate-50 rounded cursor-pointer select-none">
                                              <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={(e) => {
                                                  if (e.target.checked) {
                                                    setTtCtaDynamicSelected([...ttCtaDynamicSelected, opt]);
                                                  } else {
                                                    setTtCtaDynamicSelected(ttCtaDynamicSelected.filter(item => item !== opt));
                                                  }
                                                }}
                                                className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                                              />
                                              <span className="text-slate-700 font-medium">{opt}</span>
                                            </label>
                                          );
                                        })
                                      }
                                    </div>
                                  </div>

                                  {/* Right Column: Selected list */}
                                  <div className="w-1/2 p-3 flex flex-col h-72">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2 font-semibold">
                                      <span className="text-slate-500">已选 {ttCtaDynamicSelected.length} 个</span>
                                      <button
                                        type="button"
                                        onClick={() => setTtCtaDynamicSelected([])}
                                        className="text-blue-600 hover:underline cursor-pointer font-bold"
                                      >
                                        清除
                                      </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                                      {ttCtaDynamicSelected.map(opt => (
                                        <div key={opt} className="flex items-center justify-between py-1 px-2 bg-slate-50 border border-slate-100 rounded text-slate-700">
                                          <span>{opt}</span>
                                          <button
                                            type="button"
                                            onClick={() => setTtCtaDynamicSelected(ttCtaDynamicSelected.filter(item => item !== opt))}
                                            className="text-slate-400 hover:text-slate-600 text-[11px] font-bold cursor-pointer"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Field: 标签 */}
                      <div className="flex items-center min-h-[36px] border-t border-slate-50 pt-2 animate-fade-in">
                        <label className="w-44 text-slate-800 font-bold select-none text-xs flex-shrink-0 flex items-center gap-1">
                          <span>标签</span>
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" title="可选填标签以帮助对广告进行归类" />
                        </label>
                        <div className="relative flex items-center w-[360px]">
                          <select
                            value={ttTagsSelected}
                            onChange={e => setTtTagsSelected(e.target.value)}
                            className="w-full bg-white border border-slate-250 hover:border-slate-300 rounded pl-3 pr-8 py-1.5 font-bold text-slate-700 text-xs focus:outline-hidden cursor-pointer appearance-none"
                          >
                            <option value="">请选择</option>
                            <option value="game">游戏 (Games)</option>
                            <option value="utility">工具 (Utilities)</option>
                            <option value="lifestyle">休闲 (Casual)</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
                        </div>
                      </div>

                      {/* Field: 创意组名称 */}
                      <div className="flex items-center min-h-[36px] border-t border-slate-50 pt-2 animate-fade-in">
                        <label className="w-44 text-slate-800 font-bold select-none text-xs flex-shrink-0">
                          创意组名称
                        </label>
                        <div className="relative flex items-center w-[360px]">
                          <input
                            type="text"
                            placeholder="创意组名称"
                            value={creativeGroupName}
                            onChange={e => setCreativeGroupName(e.target.value.slice(0, 100))}
                            className="w-full bg-white border border-slate-250 hover:border-slate-300 rounded pl-3 pr-16 py-1.5 text-xs text-slate-800 font-bold focus:outline-hidden focus:border-blue-500"
                          />
                          <span className="absolute right-3 text-[10px] text-slate-400 font-mono pointer-events-none">
                            {creativeGroupName.length} / 100
                          </span>
                        </div>
                      </div>

                      {/* Save button */}
                      <div className="pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => alert(`创意组 "${creativeGroupName}" 保存成功！`)}
                          className="px-4 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 rounded text-xs font-bold transition-colors cursor-pointer shadow-3xs"
                        >
                          保存创意组
                        </button>
                      </div>
                    </>
                  ) : ttCampaignType === 'smart_plus' ? (
                    <>
                      {/* --- SMART_PLUS (UPGRADE SMART+) OPTIMIZED LAYOUT --- */}
                      {/* Notice Bar 1 */}
                      <div className="p-3 bg-[#e6f4ff] border border-[#bae0ff] rounded-md flex items-center gap-2.5 text-[#0958d9] leading-relaxed font-semibold animate-fade-in">
                        <Info className="w-4 h-4 text-[#1677ff] flex-shrink-0" />
                        <div>
                          视频、图片和轮播图组总共最多上传50个，现在已上传<b className="text-[#1677ff] mx-1">({selectedCreativeIds.length}/50)</b>个
                        </div>
                      </div>

                      {/* Row: 选择已有创意组 Checkbox */}
                      <div className="flex items-center gap-2 py-1 select-none">
                        <input
                          type="checkbox"
                          id="tt-select-existing-group-smart-plus"
                          checked={ttSelectExistingCreativeGroup}
                          onChange={e => setTtSelectExistingCreativeGroup(e.target.checked)}
                          className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                        />
                        <label htmlFor="tt-select-existing-group-smart-plus" className="font-bold text-blue-600 hover:underline cursor-pointer">
                          选择已有创意组
                        </label>
                      </div>

                      {/* Notice Bar 2 */}
                      <div className="p-3 bg-[#e6f4ff] border border-[#bae0ff] rounded-md flex items-center gap-2.5 text-[#0958d9] leading-relaxed font-semibold animate-fade-in">
                        <Info className="w-4 h-4 text-[#1677ff] flex-shrink-0" />
                        <div>
                          选择实时拉取素材时，将实时从媒体拉取帖子，由于媒体的限制，实时拉取不支持搜索
                        </div>
                      </div>

                      {/* Field: Tiktok帖子 */}
                      <div className="flex items-center min-h-[36px] border-t border-slate-50 pt-2 animate-fade-in">
                        <label className="w-44 text-slate-850 font-bold select-none text-xs flex-shrink-0">
                          Tiktok帖子 <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setMaterialSelectorType('video')}
                            className="flex items-center gap-1.5 py-1.5 px-4 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-xs font-bold transition-all cursor-pointer shadow-3xs"
                          >
                            <Film className="w-3.5 h-3.5 text-slate-500" />
                            <span>添加素材 (实时拉取)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setMaterialSelectorType('video')}
                            className="flex items-center gap-1.5 py-1.5 px-4 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-xs font-bold transition-all cursor-pointer shadow-3xs"
                          >
                            <Plus className="w-3.5 h-3.5 text-slate-500" />
                            <span>添加素材</span>
                          </button>
                        </div>
                      </div>

                      {/* Notice Bar 3 */}
                      <div className="p-3 bg-[#e6f4ff] border border-[#bae0ff] rounded-md flex items-center gap-2.5 text-[#0958d9] leading-relaxed font-semibold animate-fade-in">
                        <Info className="w-4 h-4 text-[#1677ff] flex-shrink-0" />
                        <div>
                          如果选中的视频宽高比或者分辨率不符合tiktok的要求，系统会自动修复，但会默认选第一个封面且需要一些修复时间
                        </div>
                      </div>

                      {/* Field: 视频 */}
                      <div className="flex items-center min-h-[36px] border-t border-slate-50 pt-2 animate-fade-in">
                        <label className="w-44 text-slate-855 font-bold select-none text-xs flex-shrink-0">
                          视频 <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setMaterialSelectorType('video')}
                            className="flex items-center gap-1.5 py-1.5 px-4 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-xs font-bold transition-all cursor-pointer shadow-3xs"
                          >
                            <Video className="w-3.5 h-3.5 text-slate-500" />
                            <span>添加素材</span>
                          </button>
                        </div>
                      </div>

                      {/* Field: 轮播图 */}
                      <div className="flex items-center min-h-[36px] border-t border-slate-50 pt-2 animate-fade-in">
                        <label className="w-44 text-slate-855 font-bold select-none text-xs flex-shrink-0">
                          轮播图 <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setMaterialSelectorType('image')}
                            className="flex items-center gap-1.5 py-1.5 px-4 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-xs font-bold transition-all cursor-pointer shadow-3xs"
                          >
                            <Images className="w-3.5 h-3.5 text-slate-500" />
                            <span>添加素材</span>
                          </button>
                        </div>
                      </div>

                      {/* Selected Materials List Preview */}
                      {selectedCreativeIds.length > 0 && (
                        <div className="p-3 border border-slate-200 rounded-lg bg-white ml-44 max-w-xl animate-fade-in">
                          <div className="font-bold text-slate-600 mb-2">已添加素材预览 ({selectedCreativeIds.length} 个)</div>
                          <div className="grid grid-cols-5 gap-2.5">
                            {selectedCreativeIds.map(id => {
                              const mat = materials.find(m => m.id === id);
                              return (
                                <div key={id} className="relative aspect-square border border-slate-200 rounded overflow-hidden bg-black flex items-center justify-center">
                                  {mat?.type === 'video' ? (
                                    <video src={mat.url} className="w-full h-full object-cover" muted />
                                  ) : (
                                    <img src={mat?.url || '/video_placeholder.png'} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                                  )}
                                  <span className="absolute bottom-1 left-1 px-1 py-0.5 bg-black/60 text-white rounded text-[8px] scale-90 font-bold uppercase">
                                    {mat?.type || 'Image'}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedCreativeIds(p => p.filter(x => x !== id))}
                                    className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold cursor-pointer hover:bg-rose-600"
                                  >
                                    ×
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Notice Bar 3 */}
                      <div className="p-3 bg-[#e6f4ff] border border-[#bae0ff] rounded-md flex items-center gap-2.5 text-[#0958d9] leading-relaxed font-semibold animate-fade-in">
                        <Info className="w-4 h-4 text-[#1677ff] flex-shrink-0" />
                        <div>
                          广告组内的所有广告共享同一试玩资产，修改试玩素材时，会自动修改广告组内的其他广告
                        </div>
                      </div>

                      {/* Field: 试玩素材 */}
                      <div className="flex items-center min-h-[36px] border-t border-slate-50 pt-2 animate-fade-in">
                        <label className="w-44 text-slate-800 font-bold select-none text-xs flex-shrink-0">
                          试玩素材
                        </label>
                        <div className="relative flex items-center w-[360px]">
                          <select
                            value={ttPlayableAssets['7598159223087939600'] || ''}
                            onChange={e => setTtPlayableAssets({
                              '7598159223087939600': e.target.value,
                              '7397618729426878480': e.target.value
                            })}
                            className="w-full bg-white border border-slate-250 hover:border-slate-300 rounded pl-3 pr-8 py-1.5 font-bold text-slate-500 focus:outline-hidden text-xs cursor-pointer appearance-none"
                          >
                            <option value="">仅Pangle版位支持试玩广告，且非必填</option>
                            <option value="sudoku_trial_1">极速数独试玩 (Sudoku Fast Play)</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
                        </div>
                      </div>

                      {/* Field: 延迟深度链接 */}
                      <div className="flex items-center min-h-[36px] border-t border-slate-50 pt-2 animate-fade-in">
                        <label className="w-44 text-slate-800 font-bold select-none text-xs flex-shrink-0">
                          延迟深度链接
                        </label>
                        <input
                          type="text"
                          placeholder="目前只支持scheme格式"
                          value={ttDeferredDeepLink}
                          onChange={e => setTtDeferredDeepLink(e.target.value)}
                          className="w-[360px] bg-white border border-slate-250 hover:border-slate-300 rounded px-3 py-1.5 font-bold text-slate-700 text-xs focus:outline-hidden focus:border-blue-500"
                        />
                      </div>

                      {/* Field: 行动号召 */}
                      <div className="flex items-start min-h-[36px] border-t border-slate-50 pt-2 animate-fade-in">
                        <label className="w-44 text-slate-800 font-bold select-none text-xs flex-shrink-0 pt-1.5">
                          行动号召 <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="space-y-2 w-[360px]">
                          <div className="flex">
                            <button
                              type="button"
                              className="py-1.5 px-6 border border-blue-500 bg-blue-50 text-blue-600 font-extrabold rounded text-xs select-none cursor-pointer"
                            >
                              动态优选
                            </button>
                          </div>
                          <div className="relative flex items-center">
                            <select
                              value="all"
                              disabled
                              className="w-full bg-white border border-slate-250 rounded pl-3 pr-8 py-1.5 font-bold text-slate-700 text-xs focus:outline-hidden cursor-not-allowed appearance-none"
                            >
                              <option value="all">全部</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      {/* Field: 标签 */}
                      <div className="flex items-center min-h-[36px] border-t border-slate-50 pt-2 animate-fade-in">
                        <label className="w-44 text-slate-800 font-bold select-none text-xs flex-shrink-0 flex items-center gap-1">
                          <span>标签</span>
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" title="可选填标签以帮助对广告进行归类" />
                        </label>
                        <div className="relative flex items-center w-[360px]">
                          <select
                            value={ttTagsSelected}
                            onChange={e => setTtTagsSelected(e.target.value)}
                            className="w-full bg-white border border-slate-250 hover:border-slate-300 rounded pl-3 pr-8 py-1.5 font-bold text-slate-700 text-xs focus:outline-hidden cursor-pointer appearance-none"
                          >
                            <option value="">请选择</option>
                            <option value="game">游戏 (Games)</option>
                            <option value="utility">工具 (Utilities)</option>
                            <option value="lifestyle">休闲 (Casual)</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
                        </div>
                      </div>

                      {/* Field: 创意组名称 */}
                      <div className="flex items-center min-h-[36px] border-t border-slate-50 pt-2 animate-fade-in">
                        <label className="w-44 text-slate-800 font-bold select-none text-xs flex-shrink-0">
                          创意组名称
                        </label>
                        <div className="relative flex items-center w-[360px]">
                          <input
                            type="text"
                            placeholder="创意组名称"
                            value={creativeGroupName}
                            onChange={e => setCreativeGroupName(e.target.value.slice(0, 100))}
                            className="w-full bg-white border border-slate-250 hover:border-slate-300 rounded pl-3 pr-16 py-1.5 text-xs text-slate-800 font-bold focus:outline-hidden focus:border-blue-500"
                          />
                          <span className="absolute right-3 text-[10px] text-slate-400 font-mono pointer-events-none">
                            {creativeGroupName.length} / 100
                          </span>
                        </div>
                      </div>

                      {/* Save button */}
                      <div className="pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => alert(`创意组 "${creativeGroupName}" 保存成功！`)}
                          className="px-4 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 rounded text-xs font-bold transition-colors cursor-pointer shadow-3xs"
                        >
                          保存创意组
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* --- HIGH-FIDELITY STANDARD/MANUAL CAMPAIGN OPTIMIZED LAYOUT --- */}
                      {/* Notice Bar 1 */}
                      <div className="p-3 bg-[#e6f4ff] border border-[#bae0ff] rounded-md flex items-center gap-2.5 text-[#0958d9] leading-relaxed font-semibold animate-fade-in">
                        <Info className="w-4 h-4 text-[#1677ff] flex-shrink-0" />
                        <div>
                          视频、图片和轮播图组总共最多上传50个，现在已上传<b className="text-[#1677ff] mx-1">({selectedCreativeIds.length}/50)</b>个
                        </div>
                      </div>

                      {/* Row: 选择已有创意组 Checkbox */}
                      <div className="flex items-center gap-2 py-1 select-none">
                        <input
                          type="checkbox"
                          id="tt-select-existing-group-manual"
                          checked={ttSelectExistingCreativeGroup}
                          onChange={e => setTtSelectExistingCreativeGroup(e.target.checked)}
                          className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                        />
                        <label htmlFor="tt-select-existing-group-manual" className="font-bold text-blue-600 hover:underline cursor-pointer">
                          选择已有创意组
                    </label>
                      </div>

                      {/* Notice Bar 2 */}
                      <div className="p-3 bg-[#e6f4ff] border border-[#bae0ff] rounded-md flex items-center gap-2.5 text-[#0958d9] leading-relaxed font-semibold animate-fade-in">
                        <Info className="w-4 h-4 text-[#1677ff] flex-shrink-0" />
                        <div>
                          如果选中的视频宽高比或者分辨率不符合tiktok的要求，系统会自动修复，但会默认选第一个封面且需要一些修复时间
                        </div>
                      </div>

                      {/* Field: 视频 */}
                      <div className="flex items-center min-h-[36px] border-t border-slate-50 pt-2 animate-fade-in">
                        <label className="w-44 text-slate-855 font-bold select-none text-xs flex-shrink-0">
                          视频 <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setMaterialSelectorType('video')}
                            className="flex items-center gap-1.5 py-1.5 px-4 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded text-xs font-bold transition-all cursor-pointer shadow-3xs"
                          >
                            <Video className="w-3.5 h-3.5 text-slate-500" />
                            <span>添加素材</span>
                          </button>
                        </div>
                      </div>

                      {/* Field: 图片 */}
                      <div className="flex items-center min-h-[36px] border-t border-slate-50 pt-2 animate-fade-in">
                        <label className="w-44 text-slate-855 font-bold select-none text-xs flex-shrink-0">
                          图片 <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setMaterialSelectorType('image')}
                            className="flex items-center gap-1.5 py-1.5 px-4 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded text-xs font-bold transition-all cursor-pointer shadow-3xs"
                          >
                            <Image className="w-3.5 h-3.5 text-slate-500" />
                            <span>添加素材</span>
                          </button>
                        </div>
                      </div>

                      {/* Field: 轮播图 */}
                      <div className="flex items-center min-h-[36px] border-t border-slate-50 pt-2 animate-fade-in">
                        <label className="w-44 text-slate-855 font-bold select-none text-xs flex-shrink-0">
                          轮播图 <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setMaterialSelectorType('image')}
                            className="flex items-center gap-1.5 py-1.5 px-4 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded text-xs font-bold transition-all cursor-pointer shadow-3xs"
                          >
                            <Images className="w-3.5 h-3.5 text-slate-500" />
                            <span>添加素材</span>
                          </button>
                        </div>
                      </div>

                      {/* Selected Materials List Preview */}
                      {selectedCreativeIds.length > 0 && (
                        <div className="p-3 border border-slate-200 rounded-lg bg-white ml-44 max-w-xl animate-fade-in">
                          <div className="font-bold text-slate-600 mb-2">已添加素材预览 ({selectedCreativeIds.length} 个)</div>
                          <div className="grid grid-cols-5 gap-2.5">
                            {selectedCreativeIds.map(id => {
                              const mat = materials.find(m => m.id === id);
                              return (
                                <div key={id} className="relative aspect-square border border-slate-200 rounded overflow-hidden bg-black flex items-center justify-center">
                                  {mat?.type === 'video' ? (
                                    <video src={mat.url} className="w-full h-full object-cover" muted />
                                  ) : (
                                    <img src={mat?.url || '/video_placeholder.png'} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                                  )}
                                  <span className="absolute bottom-1 left-1 px-1 py-0.5 bg-black/60 text-white rounded text-[8px] scale-90 font-bold uppercase">
                                    {mat?.type || 'Image'}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedCreativeIds(p => p.filter(x => x !== id))}
                                    className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold cursor-pointer hover:bg-rose-600"
                                  >
                                    ×
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Field: 广告文案 */}
                      <div className="flex items-start min-h-[36px] border-t border-slate-50 pt-2 animate-fade-in">
                        <label className="w-44 text-slate-855 font-bold select-none text-xs flex-shrink-0 pt-1.5">
                          广告文案 <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="space-y-2 w-[420px]">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setAdCopywritingInput('极速点击，秒玩不等待！立即进入游戏体验。')}
                              className="px-3 py-1 border border-slate-250 bg-white hover:bg-slate-50 text-slate-750 font-bold rounded text-xs cursor-pointer shadow-3xs transition-colors"
                            >
                              选文案
                            </button>
                            <button
                              type="button"
                              onClick={() => alert('已自动批量生成5组高质量候选广告文案')}
                              className="px-3 py-1 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded text-xs font-bold cursor-pointer transition-colors"
                            >
                              批量添加文案 (1 / 5)
                            </button>
                          </div>
                          <div className="relative">
                            <textarea
                              rows={3}
                              placeholder="请输入广告文案"
                              value={adCopywritingInput}
                              onChange={e => setAdCopywritingInput(e.target.value.slice(0, 100))}
                              className="w-full bg-white border border-slate-250 hover:border-slate-300 rounded p-2.5 text-xs text-slate-800 font-bold focus:outline-hidden focus:border-blue-500 resize-none pr-14"
                            />
                            <span className="absolute bottom-2.5 right-2.5 text-[10px] text-slate-400 font-mono select-none">
                              {adCopywritingInput.length} / 105
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => alert('已新增标题输入字段（上限5条）')}
                            className="text-blue-600 hover:underline cursor-pointer font-bold text-xs flex items-center gap-1 select-none"
                          >
                            + 新增标题
                          </button>
                        </div>
                      </div>

                      {/* Notice Bar 3 */}
                      <div className="p-3 bg-[#e6f4ff] border border-[#bae0ff] rounded-md flex items-center gap-2.5 text-[#0958d9] leading-relaxed font-semibold animate-fade-in">
                        <Info className="w-4 h-4 text-[#1677ff] flex-shrink-0" />
                        <div>
                          广告组内的所有广告共享同一试玩资产，修改试玩素材时，会自动修改广告组内的其他广告
                        </div>
                      </div>

                      {/* Field: 试玩素材 */}
                      <div className="flex items-center min-h-[36px] border-t border-slate-50 pt-2 animate-fade-in">
                        <label className="w-44 text-slate-800 font-bold select-none text-xs flex-shrink-0">
                          试玩素材
                        </label>
                        <div className="relative flex items-center w-[360px]">
                          <select
                            value={ttPlayableAssets['7598159223087939600'] || ''}
                            onChange={e => setTtPlayableAssets({
                              '7598159223087939600': e.target.value,
                              '7397618729426878480': e.target.value
                            })}
                            className="w-full bg-white border border-slate-250 hover:border-slate-300 rounded pl-3 pr-8 py-1.5 font-bold text-slate-550 focus:outline-hidden text-xs cursor-pointer appearance-none"
                          >
                            <option value="">仅Pangle版位支持试玩广告，且非必填</option>
                            <option value="sudoku_trial_1">极速数独试玩 (Sudoku Fast Play)</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
                        </div>
                      </div>

                      {/* Field: 延迟深度链接 */}
                      <div className="flex items-center min-h-[36px] border-t border-slate-50 pt-2 animate-fade-in">
                        <label className="w-44 text-slate-800 font-bold select-none text-xs flex-shrink-0">
                          延迟深度链接
                        </label>
                        <input
                          type="text"
                          placeholder="目前只支持scheme格式"
                          value={ttDeferredDeepLink}
                          onChange={e => setTtDeferredDeepLink(e.target.value)}
                          className="w-[360px] bg-white border border-slate-250 hover:border-slate-300 rounded px-3 py-1.5 font-bold text-slate-700 text-xs focus:outline-hidden focus:border-blue-500"
                        />
                      </div>

                      {/* Field: 行动号召 */}
                      <div className="flex items-start min-h-[36px] border-t border-slate-50 pt-2 animate-fade-in">
                        <label className="w-44 text-slate-800 font-bold select-none text-xs flex-shrink-0 pt-1.5">
                          行动号召 <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="space-y-2 w-[360px]">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setTtCtaType('standard')}
                              className={`py-1 px-4 border rounded text-xs font-bold transition-all cursor-pointer ${
                                ttCtaType === 'standard'
                                  ? 'border-blue-500 bg-blue-55 text-blue-600 font-extrabold'
                                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                              }`}
                            >
                              标准
                            </button>
                            <button
                              type="button"
                              onClick={() => setTtCtaType('dynamic')}
                              className={`py-1 px-4 border rounded text-xs font-bold transition-all cursor-pointer ${
                                ttCtaType === 'dynamic'
                                  ? 'border-blue-500 bg-blue-55 text-blue-600 font-extrabold'
                                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                              }`}
                            >
                              动态优选
                            </button>
                          </div>

                          {ttCtaType === 'standard' ? (
                            <div className="relative flex items-center">
                              <select
                                value={ttCtaSelectedAction}
                                onChange={e => setTtCtaSelectedAction(e.target.value)}
                                className="w-full bg-white border border-slate-250 hover:border-slate-300 rounded pl-3 pr-8 py-1.5 font-bold text-slate-700 text-xs focus:outline-hidden cursor-pointer appearance-none"
                              >
                                <option value="">请选择</option>
                                <option value="查看详情">查看详情</option>
                                <option value="立即下载">立即下载</option>
                                <option value="玩游戏">玩游戏</option>
                                <option value="立即购买">立即购买</option>
                              </select>
                              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
                            </div>
                          ) : (
                            <div className="relative">
                              {/* Selection Display Trigger */}
                              <button
                                type="button"
                                onClick={() => setTtCtaDropdownOpen(!ttCtaDropdownOpen)}
                                className="w-full flex items-center justify-between bg-white border border-blue-500 rounded px-3 py-1.5 font-bold text-slate-800 text-xs cursor-pointer focus:outline-hidden select-none"
                              >
                                <span>
                                  {ttCtaDynamicSelected.length === 0 
                                    ? '请选择' 
                                    : ttCtaDynamicSelected.length === allCtaOptions.length 
                                      ? '全部' 
                                      : `已选 ${ttCtaDynamicSelected.length} 个`}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${ttCtaDropdownOpen ? 'rotate-180' : ''}`} />
                              </button>

                              {/* Custom Dropdown Panel */}
                              {ttCtaDropdownOpen && (
                                <div className="absolute top-full left-0 mt-1.5 w-[520px] bg-white border border-slate-200 rounded shadow-xl z-50 flex divide-x divide-slate-100 font-sans text-xs">
                                  {/* Left Column: Search & Options */}
                                  <div className="w-1/2 p-3 flex flex-col h-72">
                                    <div className="relative mb-2">
                                      <span className="absolute left-2.5 top-2.5 text-slate-400">
                                        <Search className="w-3.5 h-3.5" />
                                      </span>
                                      <input
                                        type="text"
                                        value={ttCtaDynamicSearch}
                                        onChange={e => setTtCtaDynamicSearch(e.target.value)}
                                        placeholder="请输入"
                                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 text-xs"
                                      />
                                    </div>

                                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                                      {/* Select All */}
                                      <label className="flex items-center gap-2 py-1 px-2 hover:bg-slate-50 rounded cursor-pointer select-none">
                                        <input
                                          type="checkbox"
                                          checked={ttCtaDynamicSelected.length === allCtaOptions.length}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setTtCtaDynamicSelected([...allCtaOptions]);
                                            } else {
                                              setTtCtaDynamicSelected([]);
                                            }
                                          }}
                                          className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                                        />
                                        <span className="font-bold text-slate-800">全选</span>
                                      </label>

                                      {/* Options list */}
                                      {allCtaOptions
                                        .filter(opt => opt.toLowerCase().includes(ttCtaDynamicSearch.toLowerCase()))
                                        .map(opt => {
                                          const isChecked = ttCtaDynamicSelected.includes(opt);
                                          return (
                                            <label key={opt} className="flex items-center gap-2 py-1 px-2 hover:bg-slate-50 rounded cursor-pointer select-none">
                                              <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={(e) => {
                                                  if (e.target.checked) {
                                                    setTtCtaDynamicSelected([...ttCtaDynamicSelected, opt]);
                                                  } else {
                                                    setTtCtaDynamicSelected(ttCtaDynamicSelected.filter(item => item !== opt));
                                                  }
                                                }}
                                                className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                                              />
                                              <span className="text-slate-700 font-medium">{opt}</span>
                                            </label>
                                          );
                                        })
                                      }
                                    </div>
                                  </div>

                                  {/* Right Column: Selected list */}
                                  <div className="w-1/2 p-3 flex flex-col h-72">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2 font-semibold">
                                      <span className="text-slate-500">已选 {ttCtaDynamicSelected.length} 个</span>
                                      <button
                                        type="button"
                                        onClick={() => setTtCtaDynamicSelected([])}
                                        className="text-blue-600 hover:underline cursor-pointer font-bold"
                                      >
                                        清除
                                      </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                                      {ttCtaDynamicSelected.map(opt => (
                                        <div key={opt} className="flex items-center justify-between py-1 px-2 bg-slate-50 border border-slate-100 rounded text-slate-700">
                                          <span>{opt}</span>
                                          <button
                                            type="button"
                                            onClick={() => setTtCtaDynamicSelected(ttCtaDynamicSelected.filter(item => item !== opt))}
                                            className="text-slate-400 hover:text-slate-600 text-[11px] font-bold cursor-pointer"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Field: 标签 */}
                      <div className="flex items-center min-h-[36px] border-t border-slate-50 pt-2 animate-fade-in">
                        <label className="w-44 text-slate-800 font-bold select-none text-xs flex-shrink-0 flex items-center gap-1">
                          <span>标签</span>
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" title="可选填标签以帮助对广告进行归类" />
                        </label>
                        <div className="relative flex items-center w-[360px]">
                          <select
                            value={ttTagsSelected}
                            onChange={e => setTtTagsSelected(e.target.value)}
                            className="w-full bg-white border border-slate-250 hover:border-slate-300 rounded pl-3 pr-8 py-1.5 font-bold text-slate-700 text-xs focus:outline-hidden cursor-pointer appearance-none"
                          >
                            <option value="">请选择</option>
                            <option value="game">游戏 (Games)</option>
                            <option value="utility">工具 (Utilities)</option>
                            <option value="lifestyle">休闲 (Casual)</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
                        </div>
                      </div>

                      {/* Field: 创意组名称 */}
                      <div className="flex items-center min-h-[36px] border-t border-slate-50 pt-2 animate-fade-in">
                        <label className="w-44 text-slate-800 font-bold select-none text-xs flex-shrink-0">
                          创意组名称
                        </label>
                        <div className="relative flex items-center w-[360px]">
                          <input
                            type="text"
                            placeholder="创意组名称"
                            value={creativeGroupName}
                            onChange={e => setCreativeGroupName(e.target.value.slice(0, 100))}
                            className="w-full bg-white border border-slate-250 hover:border-slate-300 rounded pl-3 pr-16 py-1.5 text-xs text-slate-800 font-bold focus:outline-hidden focus:border-blue-500"
                          />
                          <span className="absolute right-3 text-[10px] text-slate-400 font-mono pointer-events-none">
                            {creativeGroupName.length} / 100
                          </span>
                        </div>
                      </div>

                      {/* Save button */}
                      <div className="pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => alert(`创意组 "${creativeGroupName}" 保存成功！`)}
                          className="px-4 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 rounded text-xs font-bold transition-colors cursor-pointer shadow-3xs"
                        >
                          保存创意组
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Material Selection Modal Dialog */}
              {materialSelectorType && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs select-none animate-fade-in p-4">
                  <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-100">
                    <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 capitalize">
                        <span>选择 {materialSelectorType === 'video' ? '视频素材' : materialSelectorType === 'image' ? '图片素材' : '轮播图素材'}</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => setMaterialSelectorType(null)}
                        className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                      >
                        ×
                      </button>
                    </div>

                    <div className="p-5 overflow-y-auto flex-1 bg-slate-50/50">
                      <div className="grid grid-cols-4 gap-4">
                        {materials
                          .filter(mat => {
                            if (materialSelectorType === 'video') return mat.type === 'video';
                            if (materialSelectorType === 'image') return mat.type === 'image';
                            // Carousel can use images
                            return mat.type === 'image';
                          })
                          .map(mat => {
                            const isSelected = selectedCreativeIds.includes(mat.id);
                            return (
                              <div
                                key={mat.id}
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedCreativeIds(selectedCreativeIds.filter(id => id !== mat.id));
                                  } else {
                                    setSelectedCreativeIds([...selectedCreativeIds, mat.id]);
                                  }
                                }}
                                className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                                  isSelected ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                {mat.type === 'video' ? (
                                  <video src={mat.url} className="w-full h-full object-cover" muted />
                                ) : (
                                  <img src={mat.url} className="w-full h-full object-cover" alt="" />
                                )}
                                <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors" />
                                {isSelected && (
                                  <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-xs">
                                    ✓
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        {materials.filter(mat => {
                          if (materialSelectorType === 'video') return mat.type === 'video';
                          if (materialSelectorType === 'image') return mat.type === 'image';
                          return mat.type === 'image';
                        }).length === 0 && (
                          <div className="col-span-4 text-center py-10 text-slate-400 font-semibold">
                            没有找到对应的素材
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          const relevantIds = materials
                            .filter(mat => {
                              if (materialSelectorType === 'video') return mat.type === 'video';
                              if (materialSelectorType === 'image') return mat.type === 'image';
                              return mat.type === 'image';
                            })
                            .map(m => m.id);
                          setSelectedCreativeIds(Array.from(new Set([...selectedCreativeIds, ...relevantIds])));
                        }}
                        className="px-4 py-1.5 text-blue-600 border border-blue-200 hover:bg-blue-50 text-xs font-bold rounded-lg cursor-pointer"
                      >
                        全选
                      </button>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setMaterialSelectorType(null)}
                          className="px-4 py-1.5 text-slate-600 border border-slate-300 hover:bg-slate-50 text-xs font-bold rounded-lg cursor-pointer"
                        >
                          取消
                        </button>
                        <button
                          type="button"
                          onClick={() => setMaterialSelectorType(null)}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
                        >
                          确定
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 8: 监控模块 */}
              <div ref={steps[10].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-colors">
                <div className="flex items-center justify-between border-b border-slate-150 pb-2.5 mb-4 select-none">
                  <h3 className="text-sm font-bold text-slate-900">监测</h3>
                </div>
                
                <div className="space-y-4 font-sans text-xs">
                  {/* Row 1: 展示监测URL */}
                  <div className="flex items-center min-h-[36px]">
                    <label className="w-44 text-slate-800 font-bold select-none text-xs flex-shrink-0">
                      展示监测URL
                    </label>
                    <input
                      type="text"
                      value={ttImpressionTrackingUrl}
                      onChange={e => setTtImpressionTrackingUrl(e.target.value)}
                      placeholder="请输入展示监测URL"
                      className="flex-1 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Row 2: 点击监测URL */}
                  <div className="flex items-center min-h-[36px]">
                    <label className="w-44 text-slate-800 font-bold select-none text-xs flex-shrink-0">
                      点击监测URL
                    </label>
                    <input
                      type="text"
                      value={ttClickTrackingUrl}
                      onChange={e => setTtClickTrackingUrl(e.target.value)}
                      placeholder="请输入点击监测URL"
                      className="flex-1 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeChannel === 'tiktok_legacy' && (
            <>
              {/* Card 2: 推广系列 (Slide 1) */}
          <div ref={steps[1].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-colors">
            <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-3.5 bg-blue-600 rounded-2xs inline-block"></span>
              推广系列 (Campaign - Step 2)
            </h3>
            
            <div className="space-y-4">
              {activeChannel === 'facebook' ? (
                <>
                  {/* FB 推广系列名称 */}
                  <div>
                    <label className="block text-slate-655 font-bold mb-1.5 mt-1">
                      推广系列名称 <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <div className="relative max-w-xl">
                      <input
                        type="text"
                        placeholder="请输入"
                        value={campaignName}
                        onChange={e => setCampaignName(e.target.value)}
                        className={`w-full bg-white border rounded px-3 py-3 text-xs text-slate-800 font-bold focus:outline-hidden ${!campaignName.trim() ? 'border-rose-400 focus:border-rose-500' : 'border-slate-250 focus:border-blue-500'}`}
                      />
                      {!campaignName.trim() && (
                        <p className="text-rose-500 text-[10.5px] mt-1.5 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          请输入推广系列名称
                        </p>
                      )}
                    </div>

                    {/* Sub Dynamic fields inserts matching Screenshot 1 exactly */}
                    <div className="mt-2 text-[10.5px] font-bold text-slate-400">
                      模板标签 (点击插入，系统在发布时将动态替换相应参数)
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5 select-none items-center">
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
                          onClick={() => handleInsertTagToCampaign(badge.value)}
                          className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          {badge.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 广告系列状态 */}
                  <div>
                    <label className="block text-slate-655 font-bold mb-1.5 mt-1">
                      广告系列状态 <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCampaignStatus(true)}
                        className={`py-1.5 px-5 border rounded text-center text-xs shadow-3xs cursor-pointer flex items-center justify-center font-sans tracking-wide font-bold transition-all
                          ${campaignStatus 
                            ? 'border-blue-400 bg-blue-50 text-blue-500' 
                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                      >
                        开启 (Active)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCampaignStatus(false)}
                        className={`py-1.5 px-5 border rounded text-center text-xs shadow-3xs cursor-pointer flex items-center justify-center font-sans tracking-wide font-bold transition-all
                          ${!campaignStatus 
                            ? 'border-blue-400 bg-blue-50 text-blue-500' 
                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                      >
                        暂停 (Paused)
                      </button>
                    </div>
                  </div>

                  {/* 特殊广告类别 (Special Ad Categories) dropdown matching image 2 */}
                  <div>
                    <label className="block text-slate-655 font-bold mb-1.5 mt-1 flex items-center gap-1">
                      <span>特殊广告类别</span>
                      <span className="text-[10px] font-normal text-slate-400 font-mono">(Special Ad Category)</span>
                    </label>
                    <div className="relative max-w-xl">
                      <div
                        onClick={() => setSpecialAdCategoryPopup(p => !p)}
                        className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-3 pr-10 text-xs font-bold text-slate-800 cursor-pointer min-h-[42px] flex items-center justify-between"
                      >
                        {selectedSpecialCategories.length > 0 ? (
                          <div className="flex flex-wrap gap-1 items-center">
                            {selectedSpecialCategories.map(cat => (
                              <span key={cat} className="px-2 py-0.5 bg-blue-50 border border-blue-150 text-blue-600 rounded text-[10px] font-bold flex items-center gap-1 shrink-0">
                                {cat.split(' (')[0]}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSpecialCategories(prev => prev.filter(c => c !== cat));
                                  }}
                                  className="text-blue-500 hover:text-blue-800 text-[11px] font-bold"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 font-normal">请选择</span>
                        )}
                        <ChevronDown className="w-4 h-4 text-slate-350 pointer-events-none" />
                      </div>

                      {specialAdCategoryPopup && (
                        <div className="absolute left-0 right-0 top-12 mt-1 bg-white border border-slate-200 shadow-xl rounded-lg p-3 z-40 space-y-2.5 animate-fade-in-fast max-h-72 overflow-y-auto">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-1.5">
                            <span className="font-bold text-slate-850 text-xs text-slate-800">选择特殊广告类别 ({selectedSpecialCategories.length})</span>
                            {selectedSpecialCategories.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setSelectedSpecialCategories([])}
                                className="text-blue-600 hover:text-blue-800 font-bold text-[10.5px]"
                              >
                                清除全部
                              </button>
                            )}
                          </div>
                          
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="搜索特殊类别..."
                              value={specialAdCategorySearch}
                              onChange={e => setSpecialAdCategorySearch(e.target.value)}
                              className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-[11px] focus:outline-hidden focus:border-blue-500 font-medium"
                            />
                          </div>

                          <div className="space-y-1">
                            {[
                              { label: '金融产品和服务 (旧称"信贷")', raw: '信贷 (Credit)', desc: '宣传信用卡、汽车贷款、个人贷款、商业贷款等广告。' },
                              { label: '就业', raw: '就业 (Employment)', desc: '提供求职推荐、职业展示、招聘广告、专业网络培训等。' },
                              { label: '住房', raw: '住房 (Housing)', desc: '房源出售、房屋出租、抵押贷款、房主信托服务 or 房屋保险交易等广告。' },
                              { label: '社会问题、选举或政治', raw: '社会问题、选举或政治 (Social Issues, Elections/Politics)', desc: '涉及公共福祉保护、议案讨论、公投竞选或政党选举。' }
                            ]
                            .filter(item => item.label.toLowerCase().includes(specialAdCategorySearch.toLowerCase()) || item.raw.toLowerCase().includes(specialAdCategorySearch.toLowerCase()))
                            .map(item => {
                              const isSelected = selectedSpecialCategories.includes(item.raw);
                              return (
                                <label key={item.raw} className="flex items-start gap-2.5 p-2 hover:bg-slate-50 cursor-pointer rounded border border-transparent hover:border-slate-100 transition-colors">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {
                                      if (isSelected) {
                                        setSelectedSpecialCategories(prev => prev.filter(c => c !== item.raw));
                                      } else {
                                        setSelectedSpecialCategories(prev => [...prev, item.raw]);
                                      }
                                    }}
                                    className="rounded mt-0.5 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                                  />
                                  <div className="text-[11px]">
                                    <span className="font-bold text-slate-800 block leading-tight">{item.label}</span>
                                    <span className="text-[9.5px] text-slate-400 mt-0.5 block leading-tight">{item.desc}</span>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* iOS 14+ 专属广告系列 Target Toggle */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg max-w-xl">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">iOS 14+ 专属广告系列 (iOS 14+ Dedicated Campaign)</span>
                      <span className="text-[10.5px] text-slate-400 font-medium leading-tight block mt-0.5">
                        主要用于聚合转化成效评估（AEM）。开启该功能可针对 iOS 14.5 及更高版本的用户进行专属转化归因优化。
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIos14CampaignOn(!ios14CampaignOn)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-hidden
                        ${ios14CampaignOn ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-150 ease-in-out
                        ${ios14CampaignOn ? 'translate-x-4' : 'translate-x-0'}`} 
                      />
                    </button>
                  </div>

                  {/* CBO Toggle switcher */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg max-w-xl">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">优势渠道预算优化 (Advantage Campaign Budget / CBO)</span>
                      <span className="text-[10.5px] text-slate-400 font-medium leading-tight block mt-0.5">
                        开启后，系统将在现有的各个广告组之间动态分配预算，以追求最佳的总体广告转化效果。
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCampaignBudgetOptimization(!campaignBudgetOptimization)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-hidden
                        ${campaignBudgetOptimization ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-150 ease-in-out
                        ${campaignBudgetOptimization ? 'translate-x-4' : 'translate-x-0'}`} 
                      />
                    </button>
                  </div>

                  {/* Budgets layout showing if CBO is on */}
                  {campaignBudgetOptimization ? (
                    <div className="space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-lg animate-fade-in max-w-2xl">
                      {/* CBO Budget Setup */}
                      <div className="space-y-2">
                        <label className="block text-slate-800 font-bold text-xs select-none">
                          广告系列预算 <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="flex flex-col gap-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setBudgetType('daily')}
                              className={`py-1.5 px-4 border rounded text-center text-xs shadow-3xs cursor-pointer flex items-center justify-center font-sans font-bold transition-all
                                ${budgetType === 'daily' 
                                  ? 'border-blue-400 bg-blue-50 text-blue-500' 
                                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                            >
                              单日预算 (Daily)
                            </button>
                            <button
                              type="button"
                              onClick={() => setBudgetType('lifetime')}
                              className={`py-1.5 px-4 border rounded text-center text-xs shadow-3xs cursor-pointer flex items-center justify-center font-sans font-bold transition-all
                                ${budgetType === 'lifetime' 
                                  ? 'border-blue-400 bg-blue-50 text-blue-500' 
                                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                            >
                              单次投放总预算 (Lifetime)
                            </button>
                          </div>

                          <div className="relative max-w-[200px]">
                            <input
                              type="text"
                              value={budgetValue}
                              onChange={e => setBudgetValue(e.target.value)}
                              className="w-full bg-white border border-slate-250 rounded px-3 py-2 pr-12 text-xs text-slate-800 font-bold font-mono focus:outline-hidden"
                            />
                            <span className="text-[10px] font-extrabold text-slate-400 absolute right-3 top-2.5 select-none text-slate-500">USD</span>
                          </div>
                        </div>
                      </div>

                      {/* Campaign Bidding Strategy Panel */}
                      <div className="space-y-2.5 border-t border-slate-200 pt-3.5">
                        <span className="text-xs font-bold text-slate-800 block">广告系列竞价策略 (Campaign Bidding Strategy)</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {[
                            { key: 'highest', title: '最高数量 (Highest volume)', desc: '花费预算获取最多转化成果(推荐)' },
                            { key: 'cost_target', title: '费用目标 (Cost target)', desc: '控制单次获量平均成本在设定内' },
                            { key: 'bid_cap', title: '竞价上限 (Bid cap)', desc: '限制竞拍市场单次出价最高额度' },
                            { key: 'roas', title: '广告花费回报目标 (Highest ROAS)', desc: '保证总体回报比例最大化' }
                          ].map(item => (
                            <button
                              key={item.key}
                              type="button"
                              onClick={() => setCampaignBiddingStrategy(item.key as any)}
                              className={`p-3 border rounded-lg text-left transition-all cursor-pointer flex flex-col justify-between min-h-[70px]
                                ${campaignBiddingStrategy === item.key 
                                  ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-3xs' 
                                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-655'}`}
                            >
                              <span className="text-[11px] font-bold block">{item.title}</span>
                              <span className="text-[9.5px] text-slate-400 block mt-1 leading-normal font-medium">{item.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Schedule Options */}
                      <div className="space-y-2 border-t border-slate-200 pt-3.5">
                        <span className="text-xs font-bold text-slate-800 block">广告投放时段 (Delivery Schedule)</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setDeliveryScheduleOption('all_day')}
                            className={`py-1.5 px-4 border rounded text-center text-xs shadow-3xs cursor-pointer flex items-center justify-center font-sans font-bold transition-all
                              ${deliveryScheduleOption === 'all_day' 
                                ? 'border-blue-400 bg-blue-50 text-blue-500' 
                                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                          >
                            全天投放广告
                          </button>
                        </div>
                      </div>

                      {/* Delivery Speed / Type Options */}
                      <div className="space-y-2 border-t border-slate-200 pt-3.5">
                        <span className="text-xs font-bold text-slate-800 block">投放类型 (Delivery Speed)</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setDeliveryTypeOption('uniform')}
                            className={`py-1.5 px-4 border rounded text-center text-xs shadow-3xs cursor-pointer flex items-center justify-center font-sans font-bold transition-all
                              ${deliveryTypeOption === 'uniform' 
                                ? 'border-blue-400 bg-blue-50 text-blue-500' 
                                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                          >
                            匀速 (Standard)
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeliveryTypeOption('accelerated')}
                            className={`py-1.5 px-4 border rounded text-center text-xs shadow-3xs cursor-pointer flex items-center justify-center font-sans font-bold transition-all
                              ${deliveryTypeOption === 'accelerated' 
                                ? 'border-blue-400 bg-blue-50 text-blue-500' 
                                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                          >
                            加速 (Accelerated)
                          </button>
                        </div>
                      </div>

                      {/* Campaign Spend Limit Selector under CBO */}
                      <div className="space-y-2 border-t border-slate-200 pt-3.5">
                        <span className="text-xs font-bold text-slate-800 block">广告系列花费限额 (Campaign Spend Limit)</span>
                        <div className="flex flex-col gap-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setCampaignSpendLimitOption('unlimited')}
                              className={`py-1.5 px-4 border rounded text-center text-xs shadow-3xs cursor-pointer flex items-center justify-center font-sans font-bold transition-all
                                ${campaignSpendLimitOption === 'unlimited' 
                                  ? 'border-blue-400 bg-blue-50 text-blue-500' 
                                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                            >
                              不限花费
                            </button>
                            <button
                              type="button"
                              onClick={() => setCampaignSpendLimitOption('custom')}
                              className={`py-1.5 px-4 border rounded text-center text-xs shadow-3xs cursor-pointer flex items-center justify-center font-sans font-bold transition-all
                                ${campaignSpendLimitOption === 'custom' 
                                  ? 'border-blue-400 bg-blue-50 text-blue-500' 
                                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                            >
                              设置自定义限额
                            </button>
                          </div>

                          {campaignSpendLimitOption === 'custom' && (
                            <div className="relative max-w-[200px] animate-fade-in-fast">
                              <input
                                type="text"
                                placeholder="最低 100"
                                value={campaignSpendLimitValue}
                                onChange={e => setCampaignSpendLimitValue(e.target.value)}
                                className="w-full bg-white border border-slate-250 rounded px-3 py-2 pr-12 text-xs text-slate-800 font-bold font-mono focus:outline-hidden"
                              />
                              <span className="text-[10px] font-extrabold text-slate-400 absolute right-3 top-2.5 select-none text-slate-500">USD</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-lg animate-fade-in max-w-2xl">
                      {/* Campaign Spend Limit Selector under non-CBO */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-800 block">广告系列花费限额 (Campaign Spend Limit)</span>
                        <div className="flex flex-col gap-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setCampaignSpendLimitOption('unlimited')}
                              className={`py-1.5 px-4 border rounded text-center text-xs shadow-3xs cursor-pointer flex items-center justify-center font-sans font-bold transition-all
                                ${campaignSpendLimitOption === 'unlimited' 
                                  ? 'border-blue-400 bg-blue-50 text-blue-500' 
                                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                            >
                              不限花费
                            </button>
                            <button
                              type="button"
                              onClick={() => setCampaignSpendLimitOption('custom')}
                              className={`py-1.5 px-4 border rounded text-center text-xs shadow-3xs cursor-pointer flex items-center justify-center font-sans font-bold transition-all
                                ${campaignSpendLimitOption === 'custom' 
                                  ? 'border-blue-400 bg-blue-50 text-blue-500' 
                                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                            >
                              设置自定义限额
                            </button>
                          </div>

                          {campaignSpendLimitOption === 'custom' && (
                            <div className="relative max-w-[200px] animate-fade-in-fast">
                              <input
                                type="text"
                                placeholder="最低 100"
                                value={campaignSpendLimitValue}
                                onChange={e => setCampaignSpendLimitValue(e.target.value)}
                                className="w-full bg-white border border-slate-250 rounded px-3 py-2 pr-12 text-xs text-slate-800 font-bold font-mono focus:outline-hidden"
                              />
                              <span className="text-[10px] font-extrabold text-slate-400 absolute right-3 top-2.5 select-none text-slate-500">USD</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* RED/AMBER alert box warning user they cannot set budget unless CBO is on */}
                      <div className="p-3 bg-amber-50 border border-amber-250 rounded flex items-start gap-2 text-amber-700 leading-normal select-none animate-fade-in">
                        <AlertCircle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[10.5px] font-bold">
                          花费限额不是预算，如需设置广告系列预算请开启“优势渠道预算优化 (Advantage Campaign Budget / CBO)”功能。
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* 推广系列名称 */}
                  <div>
                    <label className="block text-slate-655 font-bold mb-1.5 mt-1">
                      推广系列名称 <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <div className="relative max-w-xl">
                      <input
                        type="text"
                        placeholder="请输入推广系列名称"
                        value={campaignName}
                        onChange={e => setCampaignName(e.target.value)}
                        className={`w-full bg-white border rounded px-3 py-2 text-xs text-slate-850 font-bold focus:outline-hidden ${!campaignName.trim() ? 'border-rose-400 focus:border-rose-500' : 'border-slate-250 focus:border-blue-500'}`}
                      />
                      {!campaignName.trim() && (
                        <p className="text-rose-500 text-[10.5px] mt-1.5 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          请输入推广系列名称
                        </p>
                      )}
                    </div>

                    {/* Template Tags for Campaign Name */}
                    <div className="mt-2 text-[10.5px] font-bold text-slate-400">
                      模板标签 (点击插入，系统在发布时将动态替换相应参数)
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5 select-none items-center">
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
                          onClick={() => handleInsertTagToCampaign(badge.value)}
                          className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          {badge.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 广告系列状态 */}
                  <div>
                    <label className="block text-slate-655 font-bold mb-1.5 mt-1">
                      广告系列状态 <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCampaignStatus(true)}
                        className={`py-1.5 px-5 border rounded text-center text-xs shadow-3xs cursor-pointer flex items-center justify-center font-sans tracking-wide font-bold transition-all
                          ${campaignStatus 
                            ? 'border-blue-400 bg-blue-50 text-blue-500' 
                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                      >
                        开启 (Active)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCampaignStatus(false)}
                        className={`py-1.5 px-5 border rounded text-center text-xs shadow-3xs cursor-pointer flex items-center justify-center font-sans tracking-wide font-bold transition-all
                          ${!campaignStatus 
                            ? 'border-blue-400 bg-blue-50 text-blue-500' 
                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                      >
                        暂停 (Paused)
                      </button>
                    </div>
                  </div>

                  {/* 推广系列预算优化 (CBO) */}
                  <div className="space-y-3 pt-1.5 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setCommoditySeries(!commoditySeries)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-hidden
                          ${commoditySeries ? 'bg-blue-600' : 'bg-slate-200'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-150 ease-in-out
                          ${commoditySeries ? 'translate-x-4' : 'translate-x-0'}`} 
                        />
                      </button>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">推广系列预算优化 (CBO)</span>
                        <span className="text-[10px] text-slate-400">开启后，系统将在该推广系列下的所有广告组中动态分配预算。</span>
                      </div>
                    </div>
                  </div>

                  {/* Budgets Section */}
                  <div className="space-y-2.5 pt-2.5 border-t border-slate-100">
                    <label className="block text-slate-550 font-bold text-xs select-none">推广系列预算</label>
                    <div className="flex items-center gap-4 select-none flex-wrap">
                      {[
                        { key: 'unlimited', label: '不设限' },
                        { key: 'daily', label: '日预算' },
                        { key: 'lifetime', label: '总预算' }
                      ].map(opt => (
                        <label key={opt.key} className="flex items-center gap-1.5 font-bold cursor-pointer hover:text-slate-800 text-slate-600">
                          <input 
                            type="radio" 
                            name="tt_budget_type" 
                            checked={ttBudgetType === opt.key} 
                            onChange={() => setTtBudgetType(opt.key as any)}
                            className="rounded-full text-blue-600 focus:ring-0 cursor-pointer" 
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}

                      {/* Show budget input field ONLY when choice is daily or lifetime */}
                      {(ttBudgetType === 'daily' || ttBudgetType === 'lifetime') && (
                        <div className="flex items-center gap-2 ml-4 animate-fade-in-fast">
                          <div className="relative">
                            <input
                              type="text"
                              value={budgetValue}
                              onChange={e => setBudgetValue(e.target.value)}
                              className="w-24 bg-white border border-slate-250 rounded px-2.5 py-1 text-xs text-slate-800 font-bold font-mono focus:outline-hidden pr-8 focus:border-blue-500"
                            />
                            <span className="text-[10px] font-bold text-slate-400 absolute right-2.5 top-1.5">USD</span>
                          </div>
                          <span className="text-[10.5px] text-slate-450 font-bold text-slate-500">最低 $50</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Card 3: 投放内容 (Slide 2) */}
          <div ref={steps[2].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-4 uppercase tracking-wide">
              投放内容
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-slate-550 font-bold mb-1">广告组名称</label>
                <input
                  type="text"
                  placeholder="请输入广告组名称"
                  value={adGroupName}
                  onChange={e => setAdGroupName(e.target.value)}
                  className="w-full max-w-lg bg-white border border-slate-250 rounded px-3.5 py-2 text-xs focus:outline-hidden focus:border-blue-500 font-bold font-sans"
                />

                <div className="mt-2 flex flex-wrap gap-1.5 select-none items-center">
                  {['渠道号', '项目名称', '地区组名称', '跑法', '创意组名称', '创建日期(yyyymmdd)', '创建时间(HH:mm:ss)', '开始日期(yyyymmdd)'].map(badge => (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => handleInsertTagToAdGroup(`_{${badge}}_`)}
                      className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      {badge}
                    </button>
                  ))}
                </div>
              </div>

              {activeChannel === 'facebook' ? (
                <div className="space-y-4 animate-fade-in text-xs">
                  {/* 主要应用商店, 关联 Facebook 注册应用 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-655 font-bold mb-1.5 flex items-center gap-1">
                        <span>主要应用商店</span>
                        <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={mobileAppStore}
                          onChange={e => setMobileAppStore(e.target.value as any)}
                          className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs text-slate-800 font-bold focus:outline-hidden appearance-none cursor-pointer"
                        >
                          <option value="app_store">iOS App Store</option>
                          <option value="google_play">Google Play Store</option>
                          <option value="samsung">Samsung Galaxy Store</option>
                          <option value="amazon">Amazon Appstore</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-350 absolute right-3 top-2.5 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-655 font-bold mb-1.5 flex items-center gap-1">
                        <span>关联 Facebook 注册应用</span>
                        <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={selectedFbApp}
                          onChange={e => setSelectedFbApp(e.target.value)}
                          className={`w-full bg-white rounded px-3 py-2 pr-10 text-xs text-slate-805 font-sans font-bold focus:outline-hidden appearance-none cursor-pointer border-[1.5px] ${!selectedFbApp ? 'border-rose-350 hover:border-rose-450 text-rose-500 bg-rose-50/20' : 'border-slate-250 hover:border-slate-350'}`}
                        >
                          <option value="">- 请选择 Facebook 注册应用 -</option>
                          <option value="fb.app.cut.grass">极速割草 H5 迷你端 (App ID: 154564887964)</option>
                          <option value="fb.app.piano">钢琴节奏连连弹 (App ID: 154564841102)</option>
                          <option value="fb.app.defense">魔法城堡怪兽合成防御 (App ID: 154564855913)</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-350 absolute right-3 top-2.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {!selectedFbApp && (
                    <div className="p-2.5 bg-rose-50/50 border border-rose-100 rounded text-[11px] font-bold text-rose-600 flex items-center gap-1.5 animate-pulse">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      请关联要投放的 Facebook 移动官方应用，否则广告将无法加载对应的成效度量数据
                    </div>
                  )}

                  {/* Facebook公共主页 Identity */}
                  <div className="bg-slate-50/40 p-4 border border-slate-100 rounded-lg space-y-3 mt-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-slate-700 font-extrabold flex items-center gap-1 text-[11.5px]">
                        <span>Facebook 公共主页</span>
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                      </label>
                      <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-extrabold uppercase">Identity</span>
                    </div>

                    <div className="relative">
                      <select
                        value={selectedFbPage || 'xmp.page.global'}
                        onChange={e => setSelectedFbPage(e.target.value)}
                        className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs font-bold font-sans text-slate-805 focus:outline-hidden appearance-none cursor-pointer"
                      >
                        <option value="xmp.page.global">XMP Global Mini-Game Publishing (Page ID: 884711854961)</option>
                        <option value="xmp.page.casual">Spark Happy Gaming House (Page ID: 884711993102)</option>
                        <option value="xmp.page.piano">Magic Rhythms Piano Fans (Page ID: 884711815520)</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-350 absolute right-3 top-2.5 pointer-events-none" />
                    </div>

                    <div className="pt-0.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFbUsePageIdentity(!fbUsePageIdentity)}
                        className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-hidden
                          ${fbUsePageIdentity ? 'bg-blue-600' : 'bg-slate-200'}`}
                      >
                        <span className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-md ring-0 transition duration-150 ease-in-out
                          ${fbUsePageIdentity ? 'translate-x-3' : 'translate-x-0'}`} 
                        />
                      </button>
                      <span className="text-[10.5px] font-bold text-slate-500">
                        在此投放的所有广告组均自动套用此公共主页身份运营
                      </span>
                    </div>
                  </div>

                  {/* 像素与事件设定 Meta Pixel & Attribution Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block text-slate-655 font-bold mb-1.5 flex items-center gap-1">
                        <span>Meta 像素（Pixel）</span>
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                      </label>
                      <div className="relative">
                        <select
                          value={fbPixel}
                          onChange={e => setFbPixel(e.target.value)}
                          className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs text-slate-800 font-bold focus:outline-hidden appearance-none cursor-pointer"
                        >
                          <option value="154564887964_pixel_01">开箱割草官方 Pixel (ID: 154564887964)</option>
                          <option value="154564841102_pixel_02">智能钢琴节奏 Pixel (ID: 154564841102)</option>
                          <option value="154564855913_pixel_03">怪兽合成防御 Pixel (ID: 154564855913)</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-350 absolute right-3 top-2.5 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-655 font-bold mb-1.5 flex items-center gap-1">
                        <span>转化事件 / 优化事件</span>
                        <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={fbOptimizationGoal}
                          onChange={e => setFbOptimizationGoal(e.target.value)}
                          className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs text-slate-805 font-bold focus:outline-hidden appearance-none cursor-pointer"
                        >
                          <option value="purchase">购买（Purchase）- 推荐投放</option>
                          <option value="complete_registration">完成注册（Complete Registration）</option>
                          <option value="app_install">应用安装（App Install）</option>
                          <option value="initiate_checkout">发起结账（Initiate Checkout）</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-350 absolute right-3 top-2.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* 提示信息 */}
                  <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-md flex items-start gap-2.5 text-blue-800 leading-normal select-none mt-1">
                    <span className="text-[10px] bg-blue-600 text-white font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider select-none mt-0.5 font-mono shrink-0">XMP SYNC</span>
                    <p className="text-[10.5px] font-medium text-slate-600 leading-normal">
                      所选像素与事件处于正常（Active）接收状态。XMP 系统正实时同步其最近 15 天内累积的归因样本，一键为您在后续的优势受众步骤中，智能优化自动化像素定向成效。
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in text-xs">
                  {ttPromotionType === 'app' ? (
                    <>
                      {/* App Platform & Selection */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-655 font-bold mb-1.5 flex items-center gap-1">
                            <span>应用平台 (App Platform)</span>
                            <span className="text-rose-500 font-bold">*</span>
                          </label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setTtAppPlatform('android');
                                setTtSelectedApp('完美大侠 (Perfect Hero) - Android');
                                setTtAppUrl('https://play.google.com/store/apps/details?id=com.yuguo.perfecthero');
                              }}
                              className={`flex-1 py-2 px-3 border rounded-lg text-center text-xs shadow-3xs cursor-pointer flex items-center justify-center gap-1.5 font-bold transition-all
                                ${ttAppPlatform === 'android' 
                                  ? 'border-blue-400 bg-blue-50 text-blue-600' 
                                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                            >
                              <span className="text-sm">🤖</span> Android
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setTtAppPlatform('ios');
                                setTtSelectedApp('极速钢琴节奏连连弹 (Piano Rhythms) - iOS');
                                setTtAppUrl('https://apps.apple.com/us/app/piano-rhythms-tap/id1545648411');
                              }}
                              className={`flex-1 py-2 px-3 border rounded-lg text-center text-xs shadow-3xs cursor-pointer flex items-center justify-center gap-1.5 font-bold transition-all
                                ${ttAppPlatform === 'ios' 
                                  ? 'border-blue-400 bg-blue-50 text-blue-600' 
                                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                            >
                              <span className="text-sm">🍏</span> iOS
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-655 font-bold mb-1.5 flex items-center gap-1">
                            <span>选择已注册应用 (Select App)</span>
                            <span className="text-rose-500 font-bold">*</span>
                          </label>
                          <div className="relative">
                            <select
                              value={ttSelectedApp}
                              onChange={e => {
                                const val = e.target.value;
                                setTtSelectedApp(val);
                                if (val.includes('Android') || val.includes('Hero')) {
                                  setTtAppUrl('https://play.google.com/store/apps/details?id=com.yuguo.perfecthero');
                                } else {
                                  setTtAppUrl('https://apps.apple.com/us/app/piano-rhythms-tap/id1545648411');
                                }
                              }}
                              className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 pr-10 text-xs text-slate-800 font-bold focus:outline-hidden appearance-none cursor-pointer"
                            >
                              {ttAppPlatform === 'android' ? (
                                <>
                                  <option value="完美大侠 (Perfect Hero) - Android">完美大侠 (Perfect Hero) - Android</option>
                                  <option value="消消乐极速版 (Match3 Swift) - Android">消消乐极速版 (Match3 Swift) - Android</option>
                                </>
                              ) : (
                                <>
                                  <option value="极速钢琴节奏连连弹 (Piano Rhythms) - iOS">极速钢琴节奏连连弹 (Piano Rhythms) - iOS</option>
                                  <option value="怪兽合成防御战 (Monster Defense) - iOS">怪兽合成防御战 (Monster Defense) - iOS</option>
                                </>
                              )}
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-350 absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      {/* App download URL */}
                      <div>
                        <label className="block text-slate-655 font-bold mb-1.5">
                          应用商店下载链接 (App Download URL) <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          value={ttAppUrl}
                          onChange={e => setTtAppUrl(e.target.value)}
                          className="w-full max-w-xl bg-white border border-slate-250 rounded px-3 py-2 text-xs text-slate-800 font-mono font-bold focus:outline-hidden focus:border-blue-500"
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-slate-655 font-bold mb-1.5">
                        小程序 <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <div className="relative max-w-sm">
                        <select
                          value={selectedApplet}
                          onChange={e => setSelectedApplet(e.target.value)}
                          className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 text-xs text-slate-800 font-sans focus:outline-hidden appearance-none pr-10 cursor-pointer"
                        >
                          <option value="">搜索或选择小程序</option>
                          <option value="MiniGame_RPG_Unboxing_v18">开箱极速割草 H5 迷你游戏 v1.8</option>
                          <option value="Smart_Synthesizer_Piano_01">智能钢琴节奏连连弹</option>
                          <option value="Magic_Defense_Casual_02">魔法城堡怪兽合成防御</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                      </div>
                      
                      {!selectedApplet && (
                        <p className="text-[11px] font-bold text-rose-550 mt-1.5 text-rose-500">
                          请选择小程序
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Card 4: 渠道号配置 (Slide 3) */}
          {activeChannel !== 'facebook' && (
            <div ref={steps[3].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-colors">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-4 uppercase tracking-wide">
                渠道号配置
              </h3>
            
            <div className="space-y-4">
              {/* Radio Group matching Slide 3 */}
              <div className="flex items-center gap-6 select-none font-bold pb-2 border-b border-slate-50">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="radio" 
                    name="chan_gen" 
                    checked={channelGenerationMode === 'auto'} 
                    onChange={() => setChannelGenerationMode('auto')}
                    className="text-blue-600 focus:ring-0" 
                  />
                  <span>配置生成</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="radio" 
                    name="chan_gen" 
                    checked={channelGenerationMode === 'manual'} 
                    onChange={() => setChannelGenerationMode('manual')}
                    className="text-blue-600 focus:ring-0" 
                  />
                  <span>手动输入</span>
                </label>
              </div>

              {/* Sub-Generation types radios */}
              <div>
                <label className="block text-slate-500 font-bold mb-1.5">渠道号生成方式</label>
                <div className="flex items-center gap-6 select-none font-bold">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="chan_way" 
                      checked={channelSharing === 'shared'} 
                      onChange={() => setChannelSharing('shared')}
                      className="text-blue-600 focus:ring-0" 
                    />
                    <span>所有广告组共用</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="chan_way" 
                      checked={channelSharing === 'independent'} 
                      onChange={() => setChannelSharing('independent')}
                      className="text-blue-600 focus:ring-0" 
                    />
                    <span>每个广告组独立生成</span>
                  </label>
                </div>
              </div>

              {/* Grid selectors exactly in sequence from slide 3 */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1.5">
                    游戏 <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedGame}
                      onChange={e => setSelectedGame(e.target.value)}
                      className="w-full bg-white border border-slate-205 border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-hidden appearance-none pr-10"
                    >
                      <option value="0">0</option>
                      <option value="1">开箱割草传奇1</option>
                      <option value="2">极简数字华容道</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1.5">
                    投放平台 <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedPlatform}
                      onChange={e => setSelectedPlatform(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-hidden appearance-none pr-10 cursor-pointer"
                    >
                      {activeChannel === 'facebook' ? (
                        <>
                          <option value="fb_feed">Facebook Feed/主页广告</option>
                          <option value="fb_carousel">Facebook 轮播/精品全屏</option>
                          <option value="fb_material">Facebook 视频/图片直投</option>
                        </>
                      ) : activeChannel === 'google' ? (
                        <>
                          <option value="gg_ac">Google 应用程序系列 (AC Ads)</option>
                          <option value="gg_search">Google 搜索和展示系列</option>
                          <option value="gg_pmax">Google 效果最大化系列 (PMax)</option>
                        </>
                      ) : (
                        <>
                          <option value="0">0</option>
                          <option value="tt_spark">TikTok Spark Ads</option>
                          <option value="tt_non_spark">TikTok Non-Spark Ads</option>
                        </>
                      )}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1.5">
                    渠道 <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedChannel}
                      onChange={e => setSelectedChannel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-400 cursor-not-allowed text-center font-bold"
                      disabled
                    >
                      <option value="">请先选择游戏</option>
                    </select>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-slate-550 text-slate-500 font-bold mb-1.5">
                    投放地区 <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedTargetRegion}
                      onChange={e => setSelectedTargetRegion(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-hidden appearance-none pr-10"
                    >
                      <option value="">请选择投放地区</option>
                      <option value="TW">中国台湾地区 (Taiwan)</option>
                      <option value="SA">中东沙特阿拉伯 (Saudi Arabia)</option>
                      <option value="JP">东北亚日本 (Japan)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 pointer-events-none" />
                  </div>

                  {/* Red warning exactly highlighting bottom input warning */}
                  {!selectedTargetRegion && (
                    <p className="text-[11px] font-bold text-rose-550 mt-1.5 text-rose-500">
                      请选择投放地区
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1.5">
                    投手 <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <div className="flex items-center gap-2 select-none pt-1">
                    <span className="text-slate-400 text-xs font-semibold">{pitcherText}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const next = prompt('请输入新授权的广告投放投手昵称:', '投放专家-大刘');
                        if (next) setPitcherText(next);
                      }}
                      className="px-3 py-1 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors text-xs font-bold rounded"
                    >
                      选择投手
                    </button>
                  </div>
                </div>
              </div>

              {/* Tag selector matching slide 3 */}
              <div>
                <label className="block text-slate-500 font-bold mb-1.5">标签</label>
                <div className="select-none">
                  <button
                    type="button"
                    onClick={() => {
                      const tg = prompt('请输入投放标签标签词:', '极速割草, 高留存');
                      if (tg) setTagsText(tg);
                    }}
                    className="px-3 py-1 border border-slate-350 text-slate-800 hover:bg-slate-50 font-bold rounded text-xs transition-colors"
                  >
                    选择标签
                  </button>
                  {tagsText && <span className="ml-3 font-mono text-blue-600 bg-blue-50 px-2 py-1 border border-blue-200 rounded font-bold">{tagsText}</span>}
                </div>
              </div>

              {/* Remarks matching slide 3 */}
              <div>
                <label className="block text-slate-500 font-bold mb-1.5">备注</label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded px-3.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 font-semibold focus:outline-hidden focus:border-blue-500"
                  placeholder="请输入备注信息"
                />
              </div>

            </div>
          </div>
          )}

          {/* Card 5: 地区组 (1/50) (Slide 4) */}
          <div ref={steps[4].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 inline-block">地区组 (1/50)</h3>
                <span className="text-[11px] text-slate-405 text-slate-400 font-medium ml-3 select-none">每个地区组对应1个广告组</span>
              </div>
              
              {/* Reset/Batch buttons matching top-right Slide 4 */}
              <div className="flex items-center gap-2 select-none">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRegions([]);
                    setRegionGroupName('');
                  }}
                  className="px-3 py-1 border border-slate-300 text-slate-600 bg-white hover:bg-slate-50 text-[11px] font-bold rounded transition-colors"
                >
                  清空
                </button>
                <button
                  type="button"
                  onClick={() => alert('已新增一条地区组合分配通道（可在上方选项卡间切换）')}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-extrabold rounded transition-colors shadow-2xs"
                >
                  + 新增
                </button>
              </div>
            </div>

            {/* Simulated Tabs below header */}
            <div className="flex border-b border-slate-200 mb-4 select-none">
              <span className="px-5 py-2 border-b-2 border-blue-600 text-blue-650 font-bold text-xs select-none cursor-pointer bg-slate-50/50">
                地区组1
              </span>
            </div>

            {/* Input list with dual selection columns */}
            <div className="space-y-4">
              <div>
                <label className="block text-slate-505 text-slate-500 font-bold mb-1">地区组名称</label>
                <input
                  type="text"
                  placeholder="地区组名称"
                  value={regionGroupName}
                  onChange={e => setRegionGroupName(e.target.value)}
                  className="w-full max-w-sm bg-white border border-slate-250 rounded px-3.5 py-1.5 text-xs text-slate-800 placeholder-slate-405 font-semibold focus:outline-hidden"
                />

                {/* Red warning list matching slide 4 */}
                {selectedRegions.length === 0 && (
                  <p className="text-[11px] font-bold text-rose-550 mt-1.5 text-rose-500">
                    请至少选择1个地区
                  </p>
                )}
              </div>

              {/* High-Fidelity Dual Column Country Selector layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-200 rounded-lg overflow-hidden bg-slate-50 p-2 select-none">
                
                {/* Left Side: searchable checklist & dynamic load */}
                <div className="bg-white border border-slate-150 rounded p-3 flex flex-col gap-3 min-h-[190px]">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="搜索地区名称或代码"
                      value={regionSearchQuery}
                      onChange={e => {
                        setRegionSearchQuery(e.target.value);
                        setIsSearchingRegions(true);
                        setTimeout(() => setIsSearchingRegions(false), 300);
                      }}
                      className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto max-h-[135px] space-y-1">
                    {isSearchingRegions ? (
                      <div className="py-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>加载地区数据中...</span>
                      </div>
                    ) : filteredRegions.length === 0 ? (
                      <p className="text-center text-slate-400 py-6">无匹配的地区代码或名称</p>
                    ) : (
                      filteredRegions.map(reg => {
                        const isChosen = selectedRegions.includes(reg.name);
                        return (
                          <label 
                            key={reg.code}
                            className="flex items-center gap-2.5 p-1.5 rounded hover:bg-slate-55 hover:bg-slate-50 cursor-pointer text-xs"
                          >
                            <input
                              type="checkbox"
                              checked={isChosen}
                              className="rounded text-blue-600 text-xs"
                              onChange={() => {
                                if (isChosen) {
                                  setSelectedRegions(prev => prev.filter(r => r !== reg.name));
                                } else {
                                  setSelectedRegions(prev => [...prev, reg.name]);
                                  // Auto-fill group name safely if empty
                                  if (!regionGroupName) setRegionGroupName(reg.name + '多地区组合');
                                }
                              }}
                            />
                            <span className="font-bold text-slate-800">{reg.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono font-medium lowercase">({reg.group})</span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right Side selected counter list exactly resembling slide 4 */}
                <div className="bg-white border border-slate-150 rounded p-3 flex flex-col min-h-[190px]">
                  <div className="border-b border-slate-100 pb-1.5 flex items-center justify-between font-bold text-slate-700">
                    <span>已选 <b className="text-blue-600 text-sm font-mono">{selectedRegions.length}</b> 个</span>
                    {selectedRegions.length > 0 && (
                      <button 
                        type="button" 
                        onClick={() => setSelectedRegions([])} 
                        className="text-slate-400 hover:text-slate-600 text-[10px]"
                      >
                        清空
                      </button>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-center items-center py-6 text-center text-slate-400 overflow-y-auto max-h-[135px]">
                    {selectedRegions.length === 0 ? (
                      <span className="font-semibold text-slate-400">请在左侧勾选地区</span>
                    ) : (
                      <div className="w-full space-y-1 leading-normal text-left font-mono text-[11px]">
                        {selectedRegions.map(rName => (
                          <div key={rName} className="flex justify-between items-center p-1 bg-slate-50 rounded border border-slate-100 font-bold text-slate-705">
                            <span>{rName}</span>
                            <button 
                              type="button" 
                              onClick={() => setSelectedRegions(p => p.filter(it => it !== rName))}
                              className="text-rose-500 hover:text-rose-700 px-1 font-bold"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Language selection matching Slide 4 bottom */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1.5">语言</label>
                  <div className="relative">
                    <select
                      value={selectedLanguage}
                      onChange={e => setSelectedLanguage(e.target.value)}
                      className="w-full bg-[#f8fafc] border border-slate-205 border-slate-200 rounded px-3 py-2 text-xs focus:outline-hidden appearance-none pr-10"
                    >
                      <option value="不限">不限</option>
                      <option value="zh">繁体/简体中文</option>
                      <option value="en">English (美国/欧洲)</option>
                      <option value="ar">阿拉伯语 (Arabian)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-505 text-slate-505 text-slate-500 font-bold mb-1.5">标签</label>
                  <input
                    type="text"
                    value={regionTags}
                    onChange={e => setRegionTags(e.target.value)}
                    placeholder="输入标签按Enter"
                    className="w-full bg-white border border-slate-250 rounded px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* 欧盟及特定投放地区受益方 & 赞助方合规配置 (EU/Specific Regional Transparency Compliance) */}
              {activeChannel === 'facebook' && (
                <div className="mt-5 pt-5 border-t border-slate-100 space-y-4 animate-fade-in text-xs font-sans">
                  <div className="flex items-center gap-2 mb-1 select-none">
                    <span className="text-[10px] bg-sky-600 text-white font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-mono">
                      Meta 欧盟透明度
                    </span>
                    <span className="text-xs font-extrabold text-slate-800">广告受益与赞助主体配置（合规设定）</span>
                  </div>

                  <div className="space-y-3">
                    {/* Pair 1: Taiwan */}
                    <div className="grid grid-cols-[180px_1fr] md:grid-cols-[190px_1fr] gap-4 items-center">
                      <span className="font-bold text-slate-700">受益方 (台湾地区)</span>
                      <div className="relative">
                        <select
                          value={beneficiaryTaiwan}
                          onChange={e => setBeneficiaryTaiwan(e.target.value)}
                          className={`w-full bg-white border border-slate-200 rounded px-3 py-1.5 pr-10 text-xs focus:outline-hidden appearance-none cursor-pointer ${!beneficiaryTaiwan ? 'text-slate-400' : 'text-slate-800 font-bold'}`}
                        >
                          <option value="">请选择</option>
                          <option value="XMP Global">XMP Global Mini-Game Publishing</option>
                          <option value="Spark Happy">Spark Happy Gaming House</option>
                          <option value="Magic Rhythms">Magic Rhythms Piano Fans</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 pointer-events-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] md:grid-cols-[190px_1fr] gap-4 items-center">
                      <span className="font-bold text-slate-700">赞助方 (台湾地区)</span>
                      <div className="relative">
                        <select
                          value={sponsorTaiwan}
                          onChange={e => setSponsorTaiwan(e.target.value)}
                          className={`w-full bg-white border border-slate-200 rounded px-3 py-1.5 pr-10 text-xs focus:outline-hidden appearance-none cursor-pointer ${!sponsorTaiwan ? 'text-slate-400' : 'text-slate-800 font-bold'}`}
                        >
                          <option value="">请选择</option>
                          <option value="XMP Global">XMP Global Mini-Game Publishing</option>
                          <option value="Spark Happy">Spark Happy Gaming House</option>
                          <option value="Magic Rhythms">Magic Rhythms Piano Fans</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Pair 2: Australia */}
                    <div className="grid grid-cols-[180px_1fr] md:grid-cols-[190px_1fr] gap-4 items-center">
                      <span className="font-bold text-slate-700">受益方 (澳大利亚)</span>
                      <div className="relative">
                        <select
                          value={beneficiaryAustralia}
                          onChange={e => setBeneficiaryAustralia(e.target.value)}
                          className={`w-full bg-white border border-slate-200 rounded px-3 py-1.5 pr-10 text-xs focus:outline-hidden appearance-none cursor-pointer ${!beneficiaryAustralia ? 'text-slate-400' : 'text-slate-800 font-bold'}`}
                        >
                          <option value="">请选择</option>
                          <option value="XMP Global">XMP Global Mini-Game Publishing</option>
                          <option value="Spark Happy">Spark Happy Gaming House</option>
                          <option value="Magic Rhythms">Magic Rhythms Piano Fans</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 pointer-events-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] md:grid-cols-[190px_1fr] gap-4 items-center">
                      <span className="font-bold text-slate-700">赞助方 (澳大利亚)</span>
                      <div className="relative">
                        <select
                          value={sponsorAustralia}
                          onChange={e => setSponsorAustralia(e.target.value)}
                          className={`w-full bg-white border border-slate-200 rounded px-3 py-1.5 pr-10 text-xs focus:outline-hidden appearance-none cursor-pointer ${!sponsorAustralia ? 'text-slate-400' : 'text-slate-800 font-bold'}`}
                        >
                          <option value="">请选择</option>
                          <option value="XMP Global">XMP Global Mini-Game Publishing</option>
                          <option value="Spark Happy">Spark Happy Gaming House</option>
                          <option value="Magic Rhythms">Magic Rhythms Piano Fans</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Pair 3: Singapore */}
                    <div className="grid grid-cols-[180px_1fr] md:grid-cols-[190px_1fr] gap-4 items-center">
                      <span className="font-bold text-slate-700">受益方 (新加坡)</span>
                      <div className="relative">
                        <select
                          value={beneficiarySingapore}
                          onChange={e => setBeneficiarySingapore(e.target.value)}
                          className={`w-full bg-white border border-slate-200 rounded px-3 py-1.5 pr-10 text-xs focus:outline-hidden appearance-none cursor-pointer ${!beneficiarySingapore ? 'text-slate-400' : 'text-slate-800 font-bold'}`}
                        >
                          <option value="">请选择</option>
                          <option value="XMP Global">XMP Global Mini-Game Publishing</option>
                          <option value="Spark Happy">Spark Happy Gaming House</option>
                          <option value="Magic Rhythms">Magic Rhythms Piano Fans</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 pointer-events-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] md:grid-cols-[190px_1fr] gap-4 items-center">
                      <span className="font-bold text-slate-700">赞助方 (新加坡)</span>
                      <div className="relative">
                        <select
                          value={sponsorSingapore}
                          onChange={e => setSponsorSingapore(e.target.value)}
                          className={`w-full bg-white border border-slate-200 rounded px-3 py-1.5 pr-10 text-xs focus:outline-hidden appearance-none cursor-pointer ${!sponsorSingapore ? 'text-slate-400' : 'text-slate-800 font-bold'}`}
                        >
                          <option value="">请选择</option>
                          <option value="XMP Global">XMP Global Mini-Game Publishing</option>
                          <option value="Spark Happy">Spark Happy Gaming House</option>
                          <option value="Magic Rhythms">Magic Rhythms Piano Fans</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Pair 4: Thailand */}
                    <div className="grid grid-cols-[180px_1fr] md:grid-cols-[190px_1fr] gap-4 items-center">
                      <span className="font-bold text-slate-700">受益方 (泰国)</span>
                      <div className="relative">
                        <select
                          value={beneficiaryThailand}
                          onChange={e => setBeneficiaryThailand(e.target.value)}
                          className={`w-full bg-white border border-slate-200 rounded px-3 py-1.5 pr-10 text-xs focus:outline-hidden appearance-none cursor-pointer ${!beneficiaryThailand ? 'text-slate-400' : 'text-slate-800 font-bold'}`}
                        >
                          <option value="">请选择</option>
                          <option value="XMP Global">XMP Global Mini-Game Publishing</option>
                          <option value="Spark Happy">Spark Happy Gaming House</option>
                          <option value="Magic Rhythms">Magic Rhythms Piano Fans</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 pointer-events-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] md:grid-cols-[190px_1fr] gap-4 items-center">
                      <span className="font-bold text-slate-700">赞助方 (泰国)</span>
                      <div className="relative">
                        <select
                          value={sponsorThailand}
                          onChange={e => setSponsorThailand(e.target.value)}
                          className={`w-full bg-white border border-slate-200 rounded px-3 py-1.5 pr-10 text-xs focus:outline-hidden appearance-none cursor-pointer ${!sponsorThailand ? 'text-slate-400' : 'text-slate-800 font-bold'}`}
                        >
                          <option value="">请选择</option>
                          <option value="XMP Global">XMP Global Mini-Game Publishing</option>
                          <option value="Spark Happy">Spark Happy Gaming House</option>
                          <option value="Magic Rhythms">Magic Rhythms Piano Fans</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Pair 5: EU */}
                    <div className="grid grid-cols-[180px_1fr] md:grid-cols-[190px_1fr] gap-4 items-center">
                      <span className="font-bold text-slate-700">受益方 (欧盟)</span>
                      <div className="relative">
                        <select
                          value={beneficiaryEu}
                          onChange={e => setBeneficiaryEu(e.target.value)}
                          className={`w-full bg-white border border-slate-200 rounded px-3 py-1.5 pr-10 text-xs focus:outline-hidden appearance-none cursor-pointer ${!beneficiaryEu ? 'text-slate-400' : 'text-slate-800 font-bold'}`}
                        >
                          <option value="">请选择</option>
                          <option value="XMP Global">XMP Global Mini-Game Publishing</option>
                          <option value="Spark Happy">Spark Happy Gaming House</option>
                          <option value="Magic Rhythms">Magic Rhythms Piano Fans</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 pointer-events-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] md:grid-cols-[190px_1fr] gap-4 items-center">
                      <span className="font-bold text-slate-700">赞助方 (欧盟)</span>
                      <div className="relative">
                        <select
                          value={sponsorEu}
                          onChange={e => setSponsorEu(e.target.value)}
                          className={`w-full bg-white border border-slate-200 rounded px-3 py-1.5 pr-10 text-xs focus:outline-hidden appearance-none cursor-pointer ${!sponsorEu ? 'text-slate-400' : 'text-slate-800 font-bold'}`}
                        >
                          <option value="">请选择</option>
                          <option value="XMP Global">XMP Global Mini-Game Publishing</option>
                          <option value="Spark Happy">Spark Happy Gaming House</option>
                          <option value="Magic Rhythms">Magic Rhythms Piano Fans</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Label with info icon */}
                    <div className="grid grid-cols-[180px_1fr] md:grid-cols-[190px_1fr] gap-4 items-center">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-slate-700">标签</span>
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                      </div>
                      <div className="relative">
                        <select
                          value={complianceTag}
                          onChange={e => setComplianceTag(e.target.value)}
                          className={`w-full bg-white border border-slate-200 rounded px-3 py-1.5 pr-10 text-xs focus:outline-hidden appearance-none cursor-pointer ${!complianceTag ? 'text-slate-400' : 'text-slate-800 font-bold'}`}
                        >
                          <option value="">请选择</option>
                          <option value="tag-regular">常规投放 - 合规认证</option>
                          <option value="tag-premium">高度合规 - 财务独立</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 pointer-events-none" />
                      </div>
                    </div>

                    {/* 地区组名称 inside this specific compliance row style */}
                    <div className="grid grid-cols-[180px_1fr] md:grid-cols-[190px_1fr] gap-4 items-center pt-1">
                      <span className="font-bold text-slate-700 font-medium">地区组名称</span>
                      <div className="relative">
                        <input
                          type="text"
                          maxLength={50}
                          value={regionGroupName || '地区组1'}
                          onChange={e => setRegionGroupName(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded px-3 py-2 pr-16 text-xs text-slate-800 font-bold focus:outline-hidden"
                          placeholder="请输入地区组名称"
                        />
                        <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-mono select-none font-bold">
                          {(regionGroupName || '地区组1').length} / 50
                        </span>
                      </div>
                    </div>

                    {/* Save button exactly matching visual photo */}
                    <div className="grid grid-cols-[180px_1fr] md:grid-cols-[190px_1fr] gap-4 items-center">
                      <div></div>
                      <div className="pt-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            alert('地区组保存成功！欧盟透明度受益方与赞助方合规配置已应用于该层级投放。');
                          }}
                          className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-950 px-3.5 py-1.5 font-bold rounded text-xs shadow-3xs transition-all pointer cursor-pointer"
                        >
                          保存为地区组
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Card 6: 版位 (Slide 5) */}
          <div ref={steps[5].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-4 uppercase tracking-wide">
              版位
            </h3>
            
            {activeChannel === 'facebook' ? (
              <div className="space-y-4 font-sans text-xs">
                <div className="flex items-center gap-4 py-2 mt-1">
                  <span className="text-xs font-bold text-slate-500 w-16 select-none shrink-0">版位设置</span>
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Button 1: 进阶赋能型版位 */}
                    <button
                      type="button"
                      disabled
                      className="border border-blue-500 bg-blue-50/60 text-blue-600 text-[11px] font-bold px-4 py-1.5 rounded-sm select-none shadow-2xs"
                    >
                      进阶赋能型版位
                    </button>
                    {/* Button 2: 手动版位 with "无可选" badge */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled
                        className="border border-slate-200 bg-slate-50/50 text-slate-350 text-[11px] font-semibold px-4 py-1.5 rounded-sm line-through"
                      >
                        手动版位
                      </button>
                      <span className="text-[11px] font-extrabold text-rose-500 bg-rose-50 border border-rose-100 rounded px-2 py-0.5 select-none flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
                        无可选
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1.5">广告位</label>
                  <div className="relative max-w-xs">
                    <select
                      value={selectedPlacement}
                      onChange={e => setSelectedPlacement(e.target.value)}
                      className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-1.5 text-xs text-slate-850 font-bold focus:outline-hidden appearance-none cursor-pointer pr-10"
                    >
                      <option value="TikTok">TikTok</option>
                      <option value="Pangle">Pangle info-feed</option>
                      <option value="All">智能多版路穿插联盟</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 pointer-events-none" />
                  </div>
                </div>

                {/* Toggles according to Slide 5 */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAllowUserComments(!allowUserComments)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-hidden
                        ${allowUserComments ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-150 ease-in-out
                        ${allowUserComments ? 'translate-x-4' : 'translate-x-0'}`} 
                      />
                    </button>
                    <span className="text-xs font-bold text-slate-800">用户评论</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAllowVideoDownload(!allowVideoDownload)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-hidden
                        ${allowVideoDownload ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-150 ease-in-out
                        ${allowVideoDownload ? 'translate-x-4' : 'translate-x-0'}`} 
                      />
                    </button>
                    <span className="text-xs font-bold text-slate-800">允许下载视频</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAllowVideoShare(!allowVideoShare)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-hidden
                        ${allowVideoShare ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-150 ease-in-out
                        ${allowVideoShare ? 'translate-x-4' : 'translate-x-0'}`} 
                      />
                    </button>
                    <span className="text-xs font-bold text-slate-800">允许共享视频</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card 7: 定向包 (1/20) (Slide 6) */}
          <div ref={steps[6].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 inline-block">定向包 (1/20)</h3>
              </div>
              
              <div className="flex items-center gap-2 select-none">
                <button
                  type="button"
                  onClick={() => {
                    setTargetingBundleName('');
                    setTargetingInterestTag('');
                  }}
                  className="px-3 py-1 border border-slate-300 text-slate-600 bg-white hover:bg-slate-50 text-[11px] font-bold rounded transition-colors"
                >
                  清空
                </button>
                <button
                  type="button"
                  onClick={() => alert('已新增一条定向通道（可以在上方选项卡间切换）')}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-extrabold rounded transition-colors shadow-2xs"
                >
                  + 新增
                </button>
              </div>
            </div>

            {/* Simulated Tabs below header */}
            <div className="flex border-b border-slate-200 mb-4 select-none">
              <span className="px-5 py-2 border-b-2 border-blue-600 text-blue-650 font-bold text-xs cursor-pointer bg-slate-50/50">
                定向包1
              </span>
            </div>

            {/* Detailed contents styled according to Slide 6 */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={useExistingTargeting}
                  onChange={e => setUseExistingTargeting(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>选择已有定向包</span>
              </label>

              {/* Custom Target Audience */}
              <div>
                <label className="block text-slate-500 font-bold mb-1.5 select-none text-[11.5px]">自定义人群</label>
                <div className="flex items-center gap-6 font-bold select-none">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="cus_mode" 
                      checked={customPeopleMode === 'unlimited'} 
                      onChange={() => setCustomPeopleMode('unlimited')}
                      className="text-blue-600 focus:ring-0" 
                    />
                    <span>不限</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="cus_mode" 
                      checked={customPeopleMode === 'specified'} 
                      onChange={() => setCustomPeopleMode('specified')}
                      className="text-blue-600 focus:ring-0" 
                    />
                    <span>指定人群</span>
                  </label>
                </div>
              </div>

              {/* Gender selection */}
              <div>
                <label className="block text-slate-500 font-bold mb-1.5 select-none text-[11.5px]">性别</label>
                <div className="flex items-center gap-6 font-bold select-none">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="gen_mode" 
                      checked={targetingGender === 'unlimited'} 
                      onChange={() => setTargetingGender('unlimited')}
                      className="text-blue-600 focus:ring-0" 
                    />
                    <span>不限</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="gen_mode" 
                      checked={targetingGender === 'male'} 
                      onChange={() => setTargetingGender('male')}
                      className="text-blue-600 focus:ring-0" 
                    />
                    <span>男性</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="gen_mode" 
                      checked={targetingGender === 'female'} 
                      onChange={() => setTargetingGender('female')}
                      className="text-blue-600 focus:ring-0" 
                    />
                    <span>女性</span>
                  </label>
                </div>
              </div>

              {/* Min Age dropdown */}
              <div>
                <label className="block text-slate-500 font-bold mb-1.5 select-none text-[11.5px]">最低年龄</label>
                <div className="relative max-w-28">
                  <select
                    value={targetingMinAge}
                    onChange={e => setTargetingMinAge(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-slate-205 border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-855 font-bold focus:outline-hidden appearance-none pr-10 cursor-pointer"
                  >
                    <option value="18+">18+</option>
                    <option value="13+">13+</option>
                    <option value="25+">25+</option>
                    <option value="不限">不限</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Interest labels in input box */}
              <div>
                <label className="block text-slate-500 font-bold mb-1.5 text-[11.5px]">兴趣标签</label>
                <div className="relative max-w-md select-none">
                  <input
                    type="text"
                    placeholder="搜索或选择兴趣标签"
                    value={targetingInterestTag}
                    onChange={e => setTargetingInterestTag(e.target.value)}
                    className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden pr-10 font-medium"
                  />
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 pointer-events-none" />
                </div>
              </div>

              {/* Targeting bundle identifier name */}
              <div className="pt-2 border-t border-slate-100 max-w-sm">
                <label className="block text-slate-500 font-bold mb-1 select-none text-[11px]">定向包名称 0/50</label>
                <input
                  type="text"
                  placeholder="输入定向包名称"
                  value={targetingBundleName}
                  onChange={e => setTargetingBundleName(e.target.value)}
                  className="w-full bg-white border border-slate-250 rounded px-3.5 py-1.5 text-xs font-semibold focus:outline-hidden"
                />
              </div>

              {/* Action save trigger */}
              <button
                type="button"
                onClick={() => {
                  if (!targetingBundleName) {
                    alert('请先输入有效的定向包名称！');
                    return;
                  }
                  alert(`定向组合已保存在模板库：[${targetingBundleName}]`);
                }}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 rounded text-xs font-bold transition-all"
              >
                保存为定向包
              </button>

            </div>
          </div>

          {/* Card 8: 出价和预算 (1/20) (Slide 7) */}
          <div ref={steps[7].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 inline-block">出价和预算 (1/20)</h3>
              </div>
              
              <div className="flex items-center gap-2 select-none">
                <button
                  type="button"
                  onClick={() => {
                    setBudgetValue('50.00');
                    setFbBiddingMinLimit('');
                    setFbBiddingMaxLimit('');
                  }}
                  className="px-3 py-1 border border-slate-300 text-slate-600 bg-white hover:bg-slate-50 text-[11px] font-bold rounded transition-colors"
                >
                  清空
                </button>
                <button
                  type="button"
                  onClick={() => alert('已新增一条调配出价与预算包路径')}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-extrabold rounded transition-colors shadow-2xs"
                >
                  + 新增
                </button>
              </div>
            </div>

            {/* Simulated Tabs below header with trailing vertical more-dots list action */}
            <div className="flex items-center justify-between border-b border-slate-200 mb-4 select-none pr-3">
              <div className="flex">
                <span className="px-5 py-2 border-b-2 border-blue-600 text-blue-650 font-extrabold text-xs cursor-pointer bg-slate-50/50 flex items-center gap-1.5">
                  出价和预算1
                </span>
              </div>
              <span className="text-slate-400 font-bold hover:text-slate-600 text-sm tracking-wider cursor-pointer font-sans select-none px-1">
                ⋮
              </span>
            </div>

            {activeChannel === 'facebook' ? (
              <div className="space-y-4 font-sans text-xs bg-white p-5 rounded-lg border border-slate-150 relative">
                {/* Row 1: 成效目标 */}
                <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
                  <span className="font-bold text-slate-700">成效目标</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'app_install', label: '应用安装量最大化' },
                      { id: 'app_event', label: '应用事件数量最大化' },
                      { id: 'link_click', label: '链接点击量最大化' },
                      { id: 'value_max', label: '转化价值最大化' },
                    ].map(goal => {
                      const isSelected = fbOptimizationGoalOption === goal.id;
                      return (
                        <button
                          key={goal.id}
                          type="button"
                          onClick={() => setFbOptimizationGoalOption(goal.id as any)}
                          className={`px-3 py-1.5 border font-bold text-xs rounded transition-all cursor-pointer ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                              : 'border-slate-205 bg-white hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          {goal.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Row 2: 价值规则集 */}
                <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
                  <span className="font-bold text-slate-700">价值规则集</span>
                  <div className="relative max-w-sm w-full">
                    <select
                      value={fbValueRuleSet}
                      onChange={e => setFbValueRuleSet(e.target.value)}
                      className={`w-full bg-white border border-slate-200 rounded px-3 py-1.5 pr-10 text-xs focus:outline-hidden appearance-none cursor-pointer ${!fbValueRuleSet ? 'text-slate-400' : 'text-slate-800 font-bold'}`}
                    >
                      <option value="">请选择</option>
                      <option value="ruleset-01">常规价值矩阵规则集 (Global_Pay_v1)</option>
                      <option value="ruleset-02">极速变现与内购乘数 (Pay_Matrix_Max)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 pointer-events-none" />
                  </div>
                </div>

                {/* Row 3: 归因设置 */}
                <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-start pt-1">
                  <span className="font-bold text-slate-700 pt-1.5">
                    归因设置 <span className="text-rose-500">*</span>
                  </span>
                  
                  {/* High-Fidelity Interactive Dropdown */}
                  <div className="relative max-w-sm w-full">
                    <div 
                      onClick={() => setAttributionPopupOn(!attributionPopupOn)}
                      className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded px-3 py-1.5 pr-10 text-xs font-bold text-slate-800 cursor-pointer flex justify-between items-center h-8 shadow-3xs select-none"
                    >
                      <span>
                        {fbAttributionSetting === 'click1day_view1day' ? '点击后1天内，浏览后1天内' : '点击后1天内'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${attributionPopupOn ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Popover options list exactly depicting third picture */}
                    {attributionPopupOn && (
                      <div className="absolute left-0 bottom-[34px] w-full bg-white border border-slate-200 rounded-md shadow-lg z-50 p-2 animate-fade-in">
                        {/* Search input with "Q" placeholder as shown in the picture */}
                        <div className="relative mb-2 select-text">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
                          <input
                            type="text"
                            placeholder="搜索..."
                            value={attributionSearchQuery}
                            onChange={e => setAttributionSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded pl-8 pr-3 py-1 text-[11px] focus:outline-hidden text-slate-800 placeholder-slate-400 font-bold"
                          />
                        </div>

                        {/* Filtered list */}
                        <div className="space-y-0.5 max-h-[140px] overflow-y-auto">
                          {[
                            { value: 'click1day_view1day', label: '点击后1天内，浏览后1天内' },
                            { value: 'click1day', label: '点击后1天内' }
                          ].filter(opt => opt.label.includes(attributionSearchQuery)).map(opt => {
                            const isSelected = fbAttributionSetting === opt.value;
                            return (
                              <div
                                key={opt.value}
                                onClick={() => {
                                  setFbAttributionSetting(opt.value);
                                  setAttributionPopupOn(false);
                                }}
                                className={`px-2.5 py-1.5 rounded text-xs cursor-pointer flex items-center justify-between font-medium ${
                                  isSelected
                                    ? 'bg-blue-50 text-blue-600 font-bold'
                                    : 'text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <span>{opt.label}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 4: 计费方式 */}
                <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
                  <span className="font-bold text-slate-700">计费方式</span>
                  <div>
                    <button
                      type="button"
                      disabled
                      className="border border-blue-500 bg-blue-50 text-blue-600 text-[11px] font-bold px-4 py-1.5 rounded-sm select-none shadow-2xs"
                    >
                      展示次数
                    </button>
                  </div>
                </div>

                {/* Row 5: 排期 */}
                <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
                  <span className="font-bold text-slate-700">排期</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFbScheduleOption('now')}
                      className={`px-4 py-1.5 border font-bold text-xs rounded transition-all cursor-pointer ${
                        fbScheduleOption === 'now'
                          ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                          : 'border-slate-205 bg-white hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      现在开始
                    </button>
                    <button
                      type="button"
                      onClick={() => setFbScheduleOption('custom')}
                      className={`px-4 py-1.5 border font-bold text-xs rounded transition-all cursor-pointer ${
                        fbScheduleOption === 'custom'
                          ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-3xs'
                          : 'border-slate-205 bg-white hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      自定义
                    </button>
                  </div>
                </div>

                {/* Row 6: 广告组花费限额 */}
                <div className="grid grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-4 items-center">
                  <span className="font-bold text-slate-700">广告组花费限额</span>
                  <div className="flex items-center gap-2 max-w-sm w-full select-text">
                    {/* Lower bound input */}
                    <div className="relative flex-1">
                      <input
                        type="number"
                        placeholder="下限"
                        value={fbBiddingMinLimit}
                        onChange={e => setFbBiddingMinLimit(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded pl-3 pr-10 py-1.5 text-xs font-semibold focus:outline-hidden focus:border-blue-500 placeholder-slate-400"
                      />
                      <span className="text-[10px] text-slate-400 font-bold absolute right-3 top-2.5">USD</span>
                    </div>

                    <span className="text-slate-400 font-bold select-none text-xs px-1">~</span>

                    {/* Upper bound input */}
                    <div className="relative flex-1">
                      <input
                        type="number"
                        placeholder="上限"
                        value={fbBiddingMaxLimit}
                        onChange={e => setFbBiddingMaxLimit(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded pl-3 pr-10 py-1.5 text-xs font-semibold focus:outline-hidden focus:border-blue-500 placeholder-slate-400"
                      />
                      <span className="text-[10px] text-slate-400 font-bold absolute right-3 top-2.5">USD</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Internal layout identical to Slide 7 */
              <div className="space-y-5 p-4 bg-slate-50 rounded border border-slate-200">
                
                {/* Box 1: 优化目标 */}
                <div className="space-y-3.5">
                  <span className="font-bold text-slate-800 text-xs block select-none">优化目标</span>
                  
                  <div className="space-y-2 max-w-sm">
                    <div>
                      <span className="block text-[11px] text-slate-400 font-bold mb-1 select-none">类型</span>
                      <input
                        type="text"
                        disabled
                        value={billingType}
                        className="w-full bg-[#f1f5f9] border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-500 font-bold cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <span className="block text-[11px] text-slate-400 font-bold mb-1 select-none">选择价值</span>
                      <input
                        type="text"
                        disabled
                        value={selectedValueOption}
                        className="w-full bg-[#f1f5f9] border border-slate-200 text-slate-500 rounded px-3 py-1.5 text-xs font-bold cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Box 2: 出价策略 */}
                <div className="space-y-3 border-t border-slate-150 pt-3.5">
                  <span className="font-bold text-slate-800 text-xs block select-none">出价策略</span>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] text-slate-400 font-bold mb-1">Bid strategy</label>
                      <div className="relative">
                        <select
                          value={bidStrategy}
                          onChange={e => setBidStrategy(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 font-bold focus:outline-hidden appearance-none pr-10"
                        >
                          <option value="Highest value">Highest value</option>
                          <option value="Lowest cost">Lowest cost优先</option>
                          <option value="Cost cap">Cost cap出价限制</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 cursor-pointer pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 font-bold mb-1">ROAS类型</label>
                      <div className="relative">
                        <select
                          value={roasType}
                          onChange={e => setRoasType(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 font-bold focus:outline-hidden appearance-none pr-10"
                        >
                          <option value="Day 0 ROAS">Day 0 ROAS</option>
                          <option value="Day 7 ROAS">Day 7 ROAS</option>
                          <option value="Overall ROAS">Overall ROAS</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2 cursor-pointer pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Card 9: 创意设置 */}
          <div ref={steps[8].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-4 uppercase tracking-wide">
              创意设置
            </h3>
            
            <div className="space-y-4 pt-2">
              
              {/* Row 1: 智能创意广告 */}
              <div className="flex items-center min-h-[36px]">
                <label className="w-48 text-slate-800 font-medium select-none text-xs flex-shrink-0">
                  智能创意广告
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTtSmartCreativeEnabled(false)}
                    className={`py-1.5 px-6 border rounded text-xs font-medium transition-all cursor-pointer ${
                      !ttSmartCreativeEnabled
                        ? 'border-blue-500 bg-blue-50/50 text-blue-600 font-bold'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    关闭
                  </button>
                  <button
                    type="button"
                    onClick={() => setTtSmartCreativeEnabled(true)}
                    className={`py-1.5 px-6 border rounded text-xs font-medium transition-all cursor-pointer ${
                      ttSmartCreativeEnabled
                        ? 'border-blue-500 bg-blue-50/50 text-blue-600 font-bold'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    开启
                  </button>
                </div>
              </div>

              {/* Row 2: 广告名称 */}
              <div className="flex items-start">
                <label className="w-48 text-slate-800 font-medium select-none text-xs flex-shrink-0 mt-2">
                  广告名称
                </label>
                <div className="flex-1 max-w-xl">
                  <input
                    type="text"
                    placeholder="请输入"
                    value={adCreativeName}
                    onChange={e => setAdCreativeName(e.target.value)}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 font-medium"
                  />

                  {/* Tags underneath input */}
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
                    ].map(badge => (
                      <button
                        key={badge.label}
                        type="button"
                        onClick={() => handleInsertTagToAdCreativeName(badge.value)}
                        className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        {badge.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 3: 使用TikTok账号投放 Spark Ads */}
              <div className="flex items-center min-h-[36px]">
                <label className="w-48 text-slate-800 font-medium select-none text-xs flex-shrink-0 leading-tight">
                  使用TikTok账号投放<br />Spark Ads
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTtSparkAdsEnabled(false)}
                    className={`py-1.5 px-6 border rounded text-xs font-medium transition-all cursor-pointer ${
                      !ttSparkAdsEnabled
                        ? 'border-blue-500 bg-blue-50/50 text-blue-600 font-bold'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    关闭
                  </button>
                  <button
                    type="button"
                    onClick={() => setTtSparkAdsEnabled(true)}
                    className={`py-1.5 px-6 border rounded text-xs font-medium transition-all cursor-pointer ${
                      ttSparkAdsEnabled
                        ? 'border-blue-500 bg-blue-50/50 text-blue-600 font-bold'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    开启
                  </button>
                </div>
              </div>

              {/* Row 4: 设置自定义身份 */}
              {!ttSparkAdsEnabled && (
                <div className="flex items-center min-h-[36px]">
                  <label className="w-48 text-slate-800 font-medium select-none text-xs flex-shrink-0">
                    设置自定义身份
                  </label>
                  <div className="relative flex items-center w-[240px]">
                    <select
                      value={ttCustomIdentities['7598159223087939600'] || ''}
                      onChange={e => {
                        const val = e.target.value;
                        setTtCustomIdentities({
                          '7598159223087939600': val,
                          '7397618729426878480': val
                        });
                      }}
                      className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 cursor-pointer focus:outline-hidden appearance-none"
                    >
                      <option value="">请选择</option>
                      <option value="sudoku_master">数独达人 (Sudoku Pro)</option>
                      <option value="funny_commentary">搞笑解说_tt</option>
                      <option value="piano_expert">钢琴高手-01</option>
                      <option value="rhythm_blogger">音游博主_99</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Row 5: 创新互动样式 */}
              <div className="flex items-center min-h-[36px]">
                <label className="w-48 text-slate-800 font-medium select-none text-xs flex-shrink-0">
                  创新互动样式
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setInnovativeStyleEnabled(false)}
                    className={`py-1.5 px-6 border rounded text-xs font-medium transition-all cursor-pointer ${
                      !innovativeStyleEnabled
                        ? 'border-blue-500 bg-blue-50/50 text-blue-600 font-bold'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    关闭
                  </button>
                  <button
                    type="button"
                    onClick={() => setInnovativeStyleEnabled(true)}
                    className={`py-1.5 px-6 border rounded text-xs font-medium transition-all cursor-pointer ${
                      innovativeStyleEnabled
                        ? 'border-blue-500 bg-blue-50/50 text-blue-600 font-bold'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    开启
                  </button>
                </div>
              </div>

              {/* Conditional rows shown if innovativeStyleEnabled is True */}
              {innovativeStyleEnabled && (
                <div className="space-y-4 animate-fade-in">
                  {/* Row 6: 选择互动样式 */}
                  <div className="flex items-center min-h-[36px]">
                    <label className="w-48 text-slate-800 font-medium select-none text-xs flex-shrink-0">
                      选择互动样式
                    </label>
                    <div className="flex gap-2">
                      <button
                        key="create_now"
                        type="button"
                        onClick={() => setInteractiveStyle('create_now')}
                        className={`py-1.5 px-6 border rounded text-xs font-medium transition-all cursor-pointer ${
                          interactiveStyle === 'create_now'
                            ? 'border-blue-500 bg-blue-50/50 text-blue-600 font-bold'
                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        立即制作
                      </button>
                      <button
                        key="from_library"
                        type="button"
                        onClick={() => setInteractiveStyle('from_library')}
                        className={`py-1.5 px-6 border rounded text-xs font-medium transition-all cursor-pointer ${
                          interactiveStyle === 'from_library'
                            ? 'border-blue-500 bg-blue-50/50 text-blue-600 font-bold'
                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        从素材库选择
                      </button>
                    </div>
                  </div>

                  {/* Row 7: 卡片样式 */}
                  {interactiveStyle === 'create_now' && (
                    <div className="flex items-center min-h-[36px]">
                      <label className="w-48 text-slate-800 font-medium select-none text-xs flex-shrink-0">
                        卡片样式
                      </label>
                      <button
                        type="button"
                        className="py-1.5 px-6 border border-blue-500 bg-blue-50/50 text-blue-600 font-bold rounded text-xs select-none cursor-pointer"
                      >
                        图片卡片
                      </button>
                    </div>
                  )}

                  {/* Row 8: 附加创意 */}
                  <div className="flex items-center min-h-[36px]">
                    <label className="w-48 text-slate-800 font-medium select-none text-xs flex-shrink-0">
                      附加创意
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('已打开添加附加创意素材选项')}
                      className="flex items-center gap-1.5 py-1.5 px-3 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-xs font-bold transition-all cursor-pointer"
                    >
                      <Image className="w-3.5 h-3.5 text-slate-500" />
                      <span>添加素材</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Main Media Selector underneath keeping functionality absolutely sound */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="block text-slate-500 font-bold text-xs select-none">
                  选择在投广告素材 (Select Media Materials)
                </span>
                <p className="text-slate-400 text-[10px]">
                  勾选此处在投广告素材，系统将按交叉乘数建立对应视频创意（本设定可在第10步进一步拆分微调）：
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-h-56 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded">
                  {materials.map(mat => {
                    const isSelected = selectedCreativeIds.includes(mat.id);
                    return (
                      <div
                        key={mat.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedCreativeIds(prev => prev.filter(id => id !== mat.id));
                          } else {
                            setSelectedCreativeIds(prev => [...prev, mat.id]);
                          }
                        }}
                        className={`cursor-pointer bg-white rounded border p-1 transition-all relative flex flex-col justify-between hover:bg-slate-55
                          ${isSelected ? 'ring-2 ring-blue-500 border-transparent' : 'border-slate-200'}`}
                      >
                        <div className="relative">
                          <img
                            referrerPolicy="no-referrer"
                            src={mat.thumbnail}
                            alt={mat.fileName}
                            className="w-full h-20 object-cover rounded-sm mb-1"
                          />
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-0.5 shadow-sm">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="px-1 pt-1 border-t border-slate-50 flex items-center justify-between text-[9px] text-[#475569] font-mono select-none">
                          <span className="truncate w-24 font-bold select-none">{mat.fileName}</span>
                          <span className="bg-gray-100 rounded px-1 select-none">{mat.format}</span>
                        </div>
                      </div>
                    );
                  })}

                  {materials.length === 0 && (
                    <p className="col-span-3 text-center py-6 text-slate-400">目前本地素材库无内容，请在素材管理板极速上传再使用</p>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Card 10: 广告创意组 (Slide 8) */}
          <div ref={steps[9].ref} className="bg-white rounded border border-slate-200 shadow-2xs p-5 hover:border-slate-350 transition-colors">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 inline-block">广告创意组 (1/150)</h3>
              </div>
              
              <div className="flex items-center gap-2 select-none">
                <button
                  type="button"
                  onClick={() => alert('支持对组合建立批量修改，目前处于单级测试状态')}
                  className="px-3 py-1 border border-slate-300 text-slate-650 bg-white hover:bg-slate-50 text-[11px] font-bold rounded transition-colors"
                >
                  批量操作
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreativeGroupName('');
                    setAdCopywritingInput('');
                  }}
                  className="px-3 py-1 border border-slate-300 text-slate-600 bg-white hover:bg-slate-50 text-[11px] font-bold rounded transition-colors"
                >
                  清空
                </button>
                <button
                  type="button"
                  onClick={() => alert('已新增一条创意组分配通道（可在上方选项卡间切换）')}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-extrabold rounded transition-colors shadow-2xs"
                >
                  + 新增
                </button>
              </div>
            </div>

            {/* Simulated Tabs below header */}
            <div className="flex border-b border-slate-200 mb-4 select-none">
              <span className="px-5 py-2 border-b-2 border-blue-600 text-blue-650 font-bold text-xs cursor-pointer bg-slate-50/50">
                创意组1
              </span>
            </div>

            {/* Detailed structures exactly like Slide 8 */}
            <div className="space-y-4">
              
              {/* name of creative */}
              <div className="flex items-center gap-4 max-w-md">
                <div className="flex-1">
                  <label className="block text-slate-500 font-bold mb-1 select-none">创意组名称</label>
                  <input
                    type="text"
                    value={creativeGroupName}
                    onChange={e => setCreativeGroupName(e.target.value)}
                    className="w-full bg-white border border-slate-250 rounded px-3 py-1.5 font-bold text-slate-900 focus:outline-hidden"
                  />
                </div>
                <span className="text-[11px] text-slate-400 font-mono font-bold pt-6 select-none">
                  {creativeGroupName.length}/50
                </span>
              </div>

              {/* video subtab row */}
              <div className="border-b border-slate-150 select-none flex">
                <span className="px-4 py-1.5 border-b-2 border-blue-600 text-blue-600 font-bold hover:text-blue-700 cursor-pointer">
                  视频
                </span>
              </div>

              {/* material section select buttons */}
              <div className="flex items-center justify-between py-1 border-b border-slate-100 select-none">
                <span className="text-slate-500 font-bold">
                  已选 <b className="text-blue-600 text-sm font-mono">{selectedCreativeIds.length}</b> 个素材
                </span>
                <button
                  type="button"
                  onClick={() => {
                    handleScrollToSection(9);
                    alert('请在第9步高级媒体列表中，勾选所需的创意素材');
                  }}
                  className="px-2.5 py-1 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 rounded text-xs font-bold transition-all"
                >
                  + 选择素材
                </button>
              </div>

              {/* Video upload drag boxes exactly from Slide 8 */}
              <div className="p-4 bg-slate-50 rounded border border-dashed border-slate-300 flex items-center justify-between select-none">
                <div 
                  onClick={() => {
                    handleScrollToSection(9);
                    alert('请从第9步 勾选所需的素材文件加入创意组中');
                  }}
                  className="w-20 h-20 bg-white border border-slate-200 hover:border-slate-350 cursor-pointer rounded flex flex-col items-center justify-center text-slate-400 gap-1"
                >
                  <span className="text-xl font-medium">+</span>
                  <span className="text-[10px] font-bold">添加</span>
                </div>

                {/* Validation alert message exactly highlighted in Slide 8 */}
                {selectedCreativeIds.length === 0 && (
                  <span className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-rose-500" /> 请选择视频素材
                  </span>
                )}
              </div>

              {/* Select TikTok Accounts */}
              <div className="max-w-xs">
                <label className="block text-slate-500 font-bold mb-1.5 select-none text-xs">
                  选择 {activeChannel === 'tiktok' ? 'TikTok' : activeChannel === 'facebook' ? 'Facebook 主页' : 'Google CID'} 账号
                </label>
                <div className="relative">
                  <select
                    value={selectedTikTokAccount}
                    onChange={e => setSelectedTikTokAccount(e.target.value)}
                    className="w-full bg-white border border-slate-250 rounded px-3 py-1.5 text-xs text-slate-800 font-sans focus:outline-hidden appearance-none pr-10 cursor-pointer"
                  >
                    <option value="">{`请选择 ${activeChannel === 'tiktok' ? 'TikTok' : activeChannel === 'facebook' ? 'Facebook主页' : 'Google CID'} 账号`}</option>
                    {channelAccounts.map(acc => (
                      <option key={acc.id} value={acc.tiktokAccount}>{acc.tiktokAccount}</option>
                    ))}
                    {channelAccounts.length === 0 && (
                      <option value="test_user">开发者测试账号</option>
                    )}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>

                {/* Red warning list matching slide exactly */}
                {!selectedTikTokAccount && (
                  <p className="text-[11px] font-bold text-rose-505 mt-1.5 text-rose-500">
                    {`请选择 ${activeChannel === 'tiktok' ? 'TikTok' : activeChannel === 'facebook' ? 'Facebook主页' : 'Google CID'} 账号`}
                  </p>
                )}
              </div>

              {/* Just for Ad Display checkbox */}
              <div className="space-y-1 select-none">
                <label className="block text-slate-500 font-bold mb-1 select-none">只作为广告展示</label>
                <label className="flex items-center gap-1.5 cursor-pointer font-bold font-sans">
                  <input
                    type="checkbox"
                    checked={onlyAsAdDisplay}
                    onChange={e => setOnlyAsAdDisplay(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                  <span>仅广告显示</span>
                </label>
              </div>

              {/* Ad copywritings config */}
              <div className="space-y-2">
                <div className="flex justify-between items-center max-w-lg select-none">
                  <label className="block text-slate-500 font-bold">
                    广告文案
                  </label>
                  
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => alert('支持多项配比智能优选文案文箱')}
                      className="px-2 py-0.5 border border-slate-350 text-slate-700 hover:bg-slate-50 rounded text-[10px] font-bold transition-all"
                    >
                      + 添加文案
                    </button>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono font-bold">1/5</span>
                  </div>
                </div>

                {/* Input row representing Slide 8 structure */}
                <div className="flex items-center gap-3 max-w-xl">
                  <input
                    type="text"
                    value={adCopywritingInput}
                    onChange={e => setAdCopywritingInput(e.target.value)}
                    className="flex-1 bg-white border border-slate-250 rounded px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-hidden"
                  />
                  <span className="text-[10px] text-slate-400 font-mono select-none">{adCopywritingInput.length}/100</span>
                  
                  <button
                    type="button"
                    onClick={() => setAdCopywritingInput('')}
                    className="text-rose-500 hover:text-rose-700 text-xs font-bold cursor-pointer px-1 py-1 select-none"
                  >
                    删除
                  </button>

                  {/* Red warning on right side exactly matched to slide */}
                  {!adCopywritingInput.trim() && (
                    <span className="text-[11px] font-bold text-rose-505 shrink-0 text-rose-500 select-none">
                      请至少添加1条广告文案
                    </span>
                  )}
                </div>
              </div>

              {/* Call to action automated message Slide 8 */}
              <div className="space-y-1.5">
                <span className="block text-slate-550 text-slate-500 font-bold select-none">行动号召</span>
                <p className="text-slate-400 text-[10px] select-none leading-normal">
                  系统会从选中的文案中自动优选展示
                </p>
                {/* Simulated CTA elements missing warning strictly shown */}
                <p className="text-[11.5px] font-bold text-rose-500 flex items-center gap-1 select-none">
                  请至少选择1个行动号召
                </p>
              </div>

              {/* URL Landing Links */}
              <div className="max-w-md">
                <label className="block text-slate-500 font-bold mb-1">URL</label>
                <input
                  type="text"
                  value={targetLandingUrl}
                  onChange={e => setTargetLandingUrl(e.target.value)}
                  className="w-full bg-white border border-slate-250 rounded px-3 py-1.5 text-xs font-mono text-slate-700 focus:outline-hidden"
                />
              </div>

              {/* Dynamic tag input */}
              <div className="max-w-md">
                <label className="block text-slate-500 font-bold mb-1 select-none">标签</label>
                <input
                  type="text"
                  value={adCreativeTags}
                  onChange={e => setAdCreativeTags(e.target.value)}
                  placeholder="输入标签按Enter"
                  className="w-full bg-white border border-slate-250 rounded px-3 py-1.5 text-xs placeholder-slate-400 focus:outline-hidden"
                />
              </div>

            </div>
          </div>
          </>
          )}

        </div>

        {/* Right Stats Preview Combination Panel exactly matching Slide 9 / Screenshot 2 / User Request Image 1 */}
        <div className="w-[300px] bg-slate-50 border-l border-slate-200 p-5 overflow-y-auto space-y-5 shrink-0 select-none flex flex-col justify-between">
          
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#0f172a] text-xs">广告结构预览</span>
              <button 
                type="button"
                onClick={() => setIsSplitRulesModalOpen(true)}
                className="px-2 py-1 bg-[#2563eb] hover:bg-blue-700 text-white border border-transparent rounded text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-all shadow-3xs"
              >
                <span>⚙︎ 拆分规则</span>
              </button>
            </div>
 
            {/* Gray box summarizing dimensions */}
            <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-3.5 shadow-2xs">
              <span className="text-[10px] uppercase font-mono font-extrabold text-slate-400 tracking-wider block border-b border-gray-100 pb-1">
                拆分规则
              </span>
              
              <div className="space-y-2 text-[11px] font-medium leading-normal text-slate-650">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">地区组</span>
                  {splitLevels.region === 'campaign' ? (
                    <span className="bg-purple-50 text-purple-600 border border-purple-100 rounded px-1.5 py-0.5 text-[9px] font-bold">推广系列</span>
                  ) : (
                    <span className="bg-sky-50 text-sky-600 border border-sky-100 rounded px-1.5 py-0.5 text-[9px] font-bold">组</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">定向包</span>
                  {splitLevels.targeting === 'campaign' ? (
                    <span className="bg-purple-50 text-purple-600 border border-purple-100 rounded px-1.5 py-0.5 text-[9px] font-bold">推广系列</span>
                  ) : (
                    <span className="bg-sky-50 text-sky-600 border border-sky-100 rounded px-1.5 py-0.5 text-[9px] font-bold">组</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">出价预算</span>
                  {splitLevels.budget === 'campaign' ? (
                    <span className="bg-purple-50 text-purple-600 border border-purple-100 rounded px-1.5 py-0.5 text-[9px] font-bold">推广系列</span>
                  ) : (
                    <span className="bg-sky-50 text-sky-600 border border-sky-100 rounded px-1.5 py-0.5 text-[9px] font-bold">组</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">创意组</span>
                  {splitLevels.creative === 'campaign' ? (
                    <span className="bg-purple-50 text-purple-600 border border-purple-100 rounded px-1.5 py-0.5 text-[9px] font-bold">推广系列</span>
                  ) : splitLevels.creative === 'ad' ? (
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded px-1.5 py-0.5 text-[9px] font-bold">广告</span>
                  ) : (
                    <span className="bg-sky-50 text-sky-600 border border-sky-100 rounded px-1.5 py-0.5 text-[9px] font-bold">组</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center border-t border-slate-100 pt-2 font-bold">
                  <span className="text-slate-500 font-normal">组合模式</span>
                  <span className={splitMode === 'free' ? "text-amber-600 font-extrabold" : "text-slate-800 font-extrabold"}>
                    {splitMode === 'cross' ? '叉乘' : '自由绑定'}
                  </span>
                </div>
              </div>
            </div>
 
            {/* Total combination statistics */}
            <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-3 shadow-2xs">
              <span className="text-[10px] uppercase font-mono font-extrabold text-slate-400 tracking-wider block border-b border-gray-100 pb-1">
                生成统计
              </span>
              <div className="grid grid-cols-3 gap-2 text-center select-none font-mono">
                <div className="bg-slate-50/70 p-2 border border-slate-100 rounded">
                  <span className="text-[10px] text-slate-450 text-slate-400 block font-medium">推广系列</span>
                  <b className="text-lg text-blue-600 font-bold">{totalCampaignsEstimated}</b>
                </div>
                <div className="bg-slate-50/70 p-2 border border-slate-100 rounded">
                  <span className="text-[10px] text-slate-450 text-slate-400 block font-medium">广告组</span>
                  <b className="text-lg text-blue-600 font-bold">{totalAdGroupsEstimated}</b>
                </div>
                <div className="bg-slate-50/70 p-2 border border-slate-100 rounded">
                  <span className="text-[10px] text-slate-450 text-slate-400 block font-medium">广告</span>
                  <b className="text-lg text-[#0284c7] font-bold">{totalAdsEstimated}</b>
                </div>
              </div>
            </div>
 
            {/* Detail matrix calculations */}
            <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-3 shadow-2xs text-[11px] font-medium leading-normal">
              <span className="text-[10px] uppercase font-mono font-extrabold text-slate-400 tracking-wider block border-b border-gray-100 pb-1">
                配置维度
              </span>
              <div className="space-y-2 font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-slate-550 font-sans">广告账户</span>
                  <b className="text-[#334155]">{accountFactor}</b>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-550 font-sans">地区组</span>
                  <b className="text-[#334155]">{regionFactor}</b>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-550 font-sans">定向包</span>
                  <b className="text-[#334155]">{targetingFactor}</b>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-550 font-sans">出价预算</span>
                  <b className="text-[#334155]">{budgetFactor}</b>
                </div>
                <div className="flex justify-between items-center border-t border-slate-100 pt-1.5 font-bold">
                  <span className="text-slate-550 font-sans font-bold">创意组</span>
                  <b className="text-[#85144b]">{creativeFactor}</b>
                </div>
              </div>
            </div>
          </div>
 
          {/* Mathematical visual formulas exactly matching side nav indicator footnote */}
          <div className="bg-slate-100 border border-slate-205 rounded p-3 text-center space-y-2 select-all font-mono">
            <span className="text-[10px] text-slate-400 tracking-wider block select-none">组合公式</span>
            <div className="bg-white border border-slate-200 rounded p-2 text-center text-xs font-bold font-mono">
              {splitMode === 'cross' ? (
                <>
                  <span className="text-slate-400">{regionFactor} × {targetingFactor} × {budgetFactor} × {creativeFactor} = </span>
                  <span className="text-[#2563eb] font-bold ml-1 text-sm">
                    {regionFactor * targetingFactor * budgetFactor * creativeFactor}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-slate-400">
                    max({regionFactor}, {boundTargeting === 'region' ? targetingFactor : 1}, {boundBudget === 'region' ? budgetFactor : 1}, {boundCreative === 'region' ? creativeFactor : 1}) 
                    {boundTargeting === 'none' ? ` × ${targetingFactor}` : ''}
                    {boundBudget === 'none' ? ` × ${budgetFactor}` : ''}
                    {boundCreative === 'none' ? ` × ${creativeFactor}` : ''} = 
                  </span>
                  <span className="text-[#d97706] font-bold ml-1 text-sm">
                    {totalCampaignsEstimated * (totalAdGroupsEstimated / totalCampaignsEstimated) * (totalAdsEstimated / totalAdGroupsEstimated)}
                  </span>
                </>
              )}
            </div>
          </div>
 
        </div>

      </div>

      {/* Immersive bottom drawer footer bar matching Screenshot 2 bar */}
      <div className="h-14 bg-white border-t border-slate-200 px-6 shrink-0 flex items-center justify-between shadow-md select-none font-sans">
        
        {/* Left side actions */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <button 
            type="button"
            onClick={onClose}
            className="px-4.5 py-2 border border-slate-250 text-slate-700 bg-white hover:bg-slate-50 rounded font-bold cursor-pointer transition-colors"
          >
            ✕ 退出
          </button>
          
          <div className="h-4 w-px bg-slate-350" />
          
          <span className="text-slate-500 font-bold select-none text-[11px]">
            推广系列: <span className="text-slate-800 font-mono font-bold bg-slate-100 border border-slate-200 rounded px-2 py-0.5 ml-1">{campaignName || '未命名'}</span>
          </span>
        </div>

        {/* Right side primary action keys */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveDraftLocal}
            className="px-5 py-2.5 bg-white border border-slate-350 hover:bg-slate-50 text-slate-750 text-xs font-bold rounded cursor-pointer transition-colors font-mono"
          >
            保存草稿
          </button>
          
          <button
            type="button"
            onClick={handlePublishProject}
            className="px-7 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold rounded cursor-pointer shadow-sm transform active:translate-y-px transition-colors block"
          >
            预览 / 确认发布
          </button>
        </div>

      </div>

      {/* 跨平台本地素材统一选择器 Modal */}
      {isFbMaterialPickerOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-250 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-fade-in font-sans text-xs">
            {/* Header */}
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-blue-600 animate-pulse" />
                <span className="font-bold text-slate-800 text-sm">
                  统一本地素材选择库 ({fbMaterialPickerType === 'video' ? '视频 mp4' : fbMaterialPickerType === 'image' ? '图片 jpg/png' : 'HTML5 zip'})
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setIsFbMaterialPickerOpen(false)}
                className="text-slate-400 hover:text-slate-655 font-bold cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            {/* Content area */}
            <div className="flex flex-1 overflow-hidden min-h-[350px]">
              {/* Left Column: Folders */}
              <div className="w-48 border-r border-slate-150 p-3 bg-slate-50/25 space-y-2 max-h-[50vh] overflow-y-auto">
                <span className="text-[10px] text-slate-400 font-bold block mb-1">文件夹目录 (Folders)</span>
                {[
                  { id: 'all', name: '📁 所有素材' },
                  { id: 'uncategorized', name: '📁 未分类素材' },
                  { id: 'test_dir', name: '📁 test 核心资源' },
                  { id: 'b_dir', name: '📁 b 辅助创意' }
                ].map(folder => (
                  <button
                    key={folder.id}
                    type="button"
                    className="w-full text-left px-2 py-1.5 rounded font-semibold text-slate-700 hover:bg-slate-100 text-[11px] block truncate"
                  >
                    {folder.name}
                  </button>
                ))}

                <div className="border-t border-slate-150 my-2 pt-2">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">添加模拟素材</span>
                  <div className="space-y-1.5">
                    <input 
                      type="text" 
                      placeholder="素材名称..." 
                      id="input-sim-name"
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-[10px] font-medium"
                    />
                    <input 
                      type="text" 
                      placeholder="网络图片/视频缩略图..." 
                      id="input-sim-thumb"
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-[10px] font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const nameInp = (document.getElementById('input-sim-name') as HTMLInputElement)?.value;
                        const thumbInp = (document.getElementById('input-sim-thumb') as HTMLInputElement)?.value;
                        if (!nameInp) {
                          alert('请输入素材名称！');
                          return;
                        }
                        const newMat = {
                          id: `mat_${Date.now()}`,
                          thumbnail: thumbInp || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=260&auto=format&fit=crop',
                          fileName: nameInp + (fbMaterialPickerType === 'video' ? '.mp4' : fbMaterialPickerType === 'image' ? '.png' : '.zip'),
                          format: fbMaterialPickerType === 'video' ? 'mp4' : fbMaterialPickerType === 'image' ? 'png' : 'zip',
                          size: '1.2 MB',
                          duration: '-',
                          pushStatus: '未推送',
                          pushAccount: '-',
                          uploadTime: '2026-06-24 12:00:00',
                          folderId: 'uncategorized'
                        };
                        setMaterials(prev => [newMat, ...prev]);
                        (document.getElementById('input-sim-name') as HTMLInputElement).value = '';
                        (document.getElementById('input-sim-thumb') as HTMLInputElement).value = '';
                        alert('成功新增本地模拟素材，可供 TikTok/Facebook 选择使用！');
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded py-1 text-[10.5px] cursor-pointer text-center"
                    >
                      + 快速增加
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Grid list */}
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-slate-500 font-bold select-none text-[11px]">请在下方勾选素材，选中的素材会加入到 [Facebook 创意组] 中</span>
                    <span className="text-[10px] text-slate-400 font-mono font-semibold">支持跨平台通用</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[48vh] overflow-y-auto p-2 border border-slate-100 rounded bg-slate-50/25">
                    {materials
                      .filter(m => {
                        if (fbMaterialPickerType === 'video') return m.format === 'mp4';
                        if (fbMaterialPickerType === 'image') return m.format === 'png' || m.format === 'jpg';
                        return m.format === 'zip' || m.format === 'html5';
                      })
                      .map(mat => {
                        const activeCG = fbCreativeGroups.find(c => c.id === fbActiveCreativeGroupIdForPicker);
                        const isSelected = activeCG
                          ? (fbMaterialPickerType === 'video' ? activeCG.videos.includes(mat.id) : fbMaterialPickerType === 'image' ? activeCG.images.includes(mat.id) : activeCG.html5s.includes(mat.id))
                          : false;

                        return (
                          <div
                            key={mat.id}
                            onClick={() => {
                              if (!activeCG) return;
                              let nextList: string[] = [];
                              if (fbMaterialPickerType === 'video') {
                                nextList = isSelected ? activeCG.videos.filter(v => v !== mat.id) : [...activeCG.videos, mat.id];
                                setFbCreativeGroups(prev => prev.map(c => c.id === fbActiveCreativeGroupIdForPicker ? { ...c, videos: nextList } : c));
                              } else if (fbMaterialPickerType === 'image') {
                                nextList = isSelected ? activeCG.images.filter(i => i !== mat.id) : [...activeCG.images, mat.id];
                                setFbCreativeGroups(prev => prev.map(c => c.id === fbActiveCreativeGroupIdForPicker ? { ...c, images: nextList } : c));
                              } else {
                                nextList = isSelected ? activeCG.html5s.filter(h => h !== mat.id) : [...activeCG.html5s, mat.id];
                                setFbCreativeGroups(prev => prev.map(c => c.id === fbActiveCreativeGroupIdForPicker ? { ...c, html5s: nextList } : c));
                              }
                            }}
                            className={`cursor-pointer bg-white rounded border p-1 transition-all relative flex flex-col justify-between hover:border-slate-350
                              ${isSelected ? 'ring-2 ring-blue-500 border-transparent shadow-3xs' : 'border-slate-200'}`}
                          >
                            <div className="relative">
                              <img
                                referrerPolicy="no-referrer"
                                src={mat.thumbnail}
                                alt={mat.fileName}
                                className="w-full h-16 object-cover rounded-sm mb-1 select-none"
                              />
                              {isSelected && (
                                <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-0.5 shadow-xs">
                                  <Check className="w-2.5 h-2.5 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="px-1 pt-1 border-t border-slate-50 flex items-center justify-between text-[8px] text-slate-500 font-mono">
                              <span className="truncate w-24 font-bold">{mat.fileName}</span>
                              <span className="bg-gray-100 rounded px-0.5 font-bold">{mat.format}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div className="border-t border-slate-150 pt-3 mt-4 flex items-center justify-between bg-white">
                  <span className="text-[10px] text-slate-400 font-bold">
                    已选数量: {
                      (fbCreativeGroups.find(c => c.id === fbActiveCreativeGroupIdForPicker)
                        ? (fbMaterialPickerType === 'video' ? fbCreativeGroups.find(c => c.id === fbActiveCreativeGroupIdForPicker)!.videos.length : fbMaterialPickerType === 'image' ? fbCreativeGroups.find(c => c.id === fbActiveCreativeGroupIdForPicker)!.images.length : fbCreativeGroups.find(c => c.id === fbActiveCreativeGroupIdForPicker)!.html5s.length)
                        : 0)
                    } / 20
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsFbMaterialPickerOpen(false)}
                    className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded shadow-3xs transition-all cursor-pointer"
                  >
                    保存选择并关闭
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 编辑拆分规则 Modal (User Request Screenshot 2 & 3) */}
      {isSplitRulesModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col font-sans text-xs">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
              <span className="font-extrabold text-slate-800 text-sm">编辑拆分规则</span>
              <button 
                type="button" 
                onClick={() => setIsSplitRulesModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer text-base select-none"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-5 max-h-[75vh]">
              {/* 组合模式 Selection (Screenshot 2 / 3 Mode switcher) */}
              <div className="space-y-2.5">
                <span className="block font-bold text-slate-700 text-xs">组合模式</span>
                <div className="grid grid-cols-2 gap-4">
                  {/* Radio Card 1: 批量叉乘 */}
                  <div 
                    onClick={() => setSplitMode('cross')}
                    className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all flex flex-col gap-1.5 ${
                      splitMode === 'cross' 
                        ? 'border-blue-500 bg-blue-50/40 shadow-3xs' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="split_mode" 
                        checked={splitMode === 'cross'} 
                        onChange={() => setSplitMode('cross')}
                        className="text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"
                      />
                      <span className="font-extrabold text-slate-800 text-xs">批量叉乘</span>
                    </div>
                    <span className="text-[10.5px] text-slate-450 text-slate-500 font-medium">
                      全交叉: {regionFactor} × {targetingFactor} × {budgetFactor} × {creativeFactor} = {regionFactor * targetingFactor * budgetFactor * creativeFactor}
                    </span>
                  </div>

                  {/* Radio Card 2: 自由绑定 */}
                  <div 
                    onClick={() => setSplitMode('free')}
                    className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all flex flex-col gap-1.5 ${
                      splitMode === 'free' 
                        ? 'border-blue-500 bg-blue-50/40 shadow-3xs' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="split_mode" 
                        checked={splitMode === 'free'} 
                        onChange={() => setSplitMode('free')}
                        className="text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"
                      />
                      <span className="font-extrabold text-slate-800 text-xs">自由绑定</span>
                    </div>
                    <span className="text-[10.5px] text-slate-450 text-slate-500 font-medium">
                      手动指定，如：日语素材 → 日本地区
                    </span>
                  </div>
                </div>
              </div>

              {/* 自由绑定 Table - ONLY displayed when splitMode === 'free' (Screenshot 3 style!) */}
              {splitMode === 'free' && (
                <div className="space-y-2.5 p-4 bg-slate-50 border border-slate-200 rounded-lg animate-fade-in">
                  <div className="flex flex-col gap-1">
                    <span className="font-extrabold text-slate-800 text-xs">各维度的绑定关系，未绑定的维度仍按交叉组合</span>
                    <span className="text-[10.5px] text-slate-450 text-slate-500 leading-normal">
                      绑定后，相同序号的项将会一对一进行绑定组合（如地区组1 + 定向包1），减少不必要的交叉排列组合。
                    </span>
                  </div>

                  <div className="overflow-hidden border border-slate-200 rounded bg-white">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-extrabold">
                          <th className="px-3 py-2 text-[11px]">维度</th>
                          <th className="px-3 py-2 text-[11px]">绑定类型</th>
                          <th className="px-3 py-2 text-[11px]">绑定到</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 font-medium text-slate-700">
                        <tr>
                          <td className="px-3 py-2.5">地区组1</td>
                          <td className="px-3 py-2.5 text-slate-400">—</td>
                          <td className="px-3 py-2.5 text-slate-400">—</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2.5">定向包1</td>
                          <td className="px-3 py-2.5">
                            <select 
                              value={boundTargeting}
                              onChange={(e) => setBoundTargeting(e.target.value)}
                              className="bg-white border border-slate-250 rounded px-2 py-1 text-[11px] focus:outline-hidden font-bold cursor-pointer"
                            >
                              <option value="none">不绑定</option>
                              <option value="region">地区组</option>
                            </select>
                          </td>
                          <td className="px-3 py-2.5 text-slate-400">—</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2.5">出价预算1</td>
                          <td className="px-3 py-2.5">
                            <select 
                              value={boundBudget}
                              onChange={(e) => setBoundBudget(e.target.value)}
                              className="bg-white border border-slate-250 rounded px-2 py-1 text-[11px] focus:outline-hidden font-bold cursor-pointer"
                            >
                              <option value="none">不绑定</option>
                              <option value="region">地区组</option>
                            </select>
                          </td>
                          <td className="px-3 py-2.5 text-slate-400">—</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2.5">创意组1</td>
                          <td className="px-3 py-2.5">
                            <select 
                              value={boundCreative}
                              onChange={(e) => setBoundCreative(e.target.value)}
                              className="bg-white border border-slate-250 rounded px-2 py-1 text-[11px] focus:outline-hidden font-bold cursor-pointer"
                            >
                              <option value="none">不绑定</option>
                              <option value="region">地区组</option>
                            </select>
                          </td>
                          <td className="px-3 py-2.5 text-slate-400">—</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 各维度拆分级别 Table (Displayed in both modes, matches Screenshot 2) */}
              <div className="space-y-2.5">
                <span className="block font-bold text-slate-700 text-xs">各维度拆分级别</span>
                
                <div className="overflow-hidden border border-slate-200 rounded bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-extrabold">
                        <th className="px-3 py-2 text-[11px]">维度</th>
                        <th className="px-3 py-2 text-[11px]">数量</th>
                        <th className="px-3 py-2 text-[11px]">拆分为</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 font-medium text-slate-700">
                      {/* Region Group */}
                      <tr>
                        <td className="px-3 py-3 font-bold text-slate-800">地区组</td>
                        <td className="px-3 py-3 font-mono text-slate-600">{regionFactor}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input 
                                type="radio" 
                                name="split_level_region" 
                                checked={splitLevels.region === 'campaign'} 
                                onChange={() => setSplitLevels(prev => ({ ...prev, region: 'campaign' }))}
                                className="text-blue-600 h-3.5 w-3.5"
                              />
                              <span>推广系列</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input 
                                type="radio" 
                                name="split_level_region" 
                                checked={splitLevels.region === 'adgroup'} 
                                onChange={() => setSplitLevels(prev => ({ ...prev, region: 'adgroup' }))}
                                className="text-blue-600 h-3.5 w-3.5"
                              />
                              <span>广告组</span>
                            </label>
                          </div>
                        </td>
                      </tr>

                      {/* Targeting Package */}
                      <tr>
                        <td className="px-3 py-3 font-bold text-slate-800">定向包</td>
                        <td className="px-3 py-3 font-mono text-slate-600">{targetingFactor}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input 
                                type="radio" 
                                name="split_level_targeting" 
                                checked={splitLevels.targeting === 'campaign'} 
                                onChange={() => setSplitLevels(prev => ({ ...prev, targeting: 'campaign' }))}
                                className="text-blue-600 h-3.5 w-3.5"
                              />
                              <span>推广系列</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input 
                                type="radio" 
                                name="split_level_targeting" 
                                checked={splitLevels.targeting === 'adgroup'} 
                                onChange={() => setSplitLevels(prev => ({ ...prev, targeting: 'adgroup' }))}
                                className="text-blue-600 h-3.5 w-3.5"
                              />
                              <span>广告组</span>
                            </label>
                          </div>
                        </td>
                      </tr>

                      {/* Bid Budget */}
                      <tr>
                        <td className="px-3 py-3 font-bold text-slate-800">出价预算</td>
                        <td className="px-3 py-3 font-mono text-slate-600">{budgetFactor}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input 
                                type="radio" 
                                name="split_level_budget" 
                                checked={splitLevels.budget === 'campaign'} 
                                onChange={() => setSplitLevels(prev => ({ ...prev, budget: 'campaign' }))}
                                className="text-blue-600 h-3.5 w-3.5"
                              />
                              <span>推广系列</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input 
                                type="radio" 
                                name="split_level_budget" 
                                checked={splitLevels.budget === 'adgroup'} 
                                onChange={() => setSplitLevels(prev => ({ ...prev, budget: 'adgroup' }))}
                                className="text-blue-600 h-3.5 w-3.5"
                              />
                              <span>广告组</span>
                            </label>
                          </div>
                        </td>
                      </tr>

                      {/* Creative Group (Allows splitting to Ad) */}
                      <tr>
                        <td className="px-3 py-3 font-bold text-slate-800">创意组</td>
                        <td className="px-3 py-3 font-mono text-slate-600">{creativeFactor}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input 
                                type="radio" 
                                name="split_level_creative" 
                                checked={splitLevels.creative === 'campaign'} 
                                onChange={() => setSplitLevels(prev => ({ ...prev, creative: 'campaign' }))}
                                className="text-blue-600 h-3.5 w-3.5"
                              />
                              <span>推广系列</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input 
                                type="radio" 
                                name="split_level_creative" 
                                checked={splitLevels.creative === 'adgroup'} 
                                onChange={() => setSplitLevels(prev => ({ ...prev, creative: 'adgroup' }))}
                                className="text-blue-600 h-3.5 w-3.5"
                              />
                              <span>广告组</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input 
                                type="radio" 
                                name="split_level_creative" 
                                checked={splitLevels.creative === 'ad'} 
                                onChange={() => setSplitLevels(prev => ({ ...prev, creative: 'ad' }))}
                                className="text-blue-600 h-3.5 w-3.5"
                              />
                              <span>广告</span>
                            </label>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dynamic results preview box */}
              <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 flex items-center justify-between font-mono animate-fade-in">
                <span className="font-extrabold text-slate-700 text-xs">估计生成结果：</span>
                <div className="flex items-center gap-3 text-slate-800 font-extrabold text-xs">
                  <span className="bg-white border border-slate-200 rounded px-2.5 py-1 text-blue-600">
                    {totalCampaignsEstimated} 系列
                  </span>
                  <span className="text-slate-400">/</span>
                  <span className="bg-white border border-slate-200 rounded px-2.5 py-1 text-purple-600">
                    {totalAdGroupsEstimated} 广告组
                  </span>
                  <span className="text-slate-400">/</span>
                  <span className="bg-white border border-slate-200 rounded px-2.5 py-1 text-emerald-600">
                    {totalAdsEstimated} 广告创意
                  </span>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="px-5 py-3.5 border-t border-slate-150 flex items-center justify-end gap-3 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setIsSplitRulesModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-bold rounded cursor-pointer transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSplitRulesModalOpen(false);
                  alert('拆分合并规则更新成功！');
                }}
                className="px-5 py-2 bg-[#2563eb] hover:bg-blue-700 text-white font-extrabold rounded shadow-3xs transition-all cursor-pointer"
              >
                确认规则
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TikTok Budget context menu */}
      {ttBudgetMenuOpenId && ttBudgetMenuCoords && (
        <>
          <div 
            className="fixed inset-0 z-45 bg-transparent cursor-default" 
            onClick={(e) => {
              e.stopPropagation();
              setTtBudgetMenuOpenId(null);
              setTtBudgetMenuCoords(null);
            }}
          ></div>
          <div 
            className="fixed bg-white border border-slate-200 shadow-md rounded py-1 w-32 z-50 text-slate-700 text-xs font-medium animate-fade-in select-none"
            style={{
              top: `${ttBudgetMenuCoords.top - window.scrollY}px`,
              left: `${ttBudgetMenuCoords.left - window.scrollX}px`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                handleDuplicateTtBudget(ttBudgetMenuOpenId);
                setTtBudgetMenuOpenId(null);
                setTtBudgetMenuCoords(null);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs flex items-center gap-1.5 font-semibold text-slate-700 transition-colors"
            >
              <span>复制</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const target = ttBudgets.find(b => b.id === ttBudgetMenuOpenId);
                if (target) {
                  setTtGenericActionModal({
                    module: 'budget',
                    type: 'batch_duplicate',
                    targetId: ttBudgetMenuOpenId,
                    targetName: target.name,
                    inputValue: '3'
                  });
                }
                setTtBudgetMenuOpenId(null);
                setTtBudgetMenuCoords(null);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs flex items-center gap-1.5 font-semibold text-slate-700 transition-colors"
            >
              <span>批量复制</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const target = ttBudgets.find(b => b.id === ttBudgetMenuOpenId);
                if (target) {
                  setTtGenericActionModal({
                    module: 'budget',
                    type: 'rename',
                    targetId: ttBudgetMenuOpenId,
                    targetName: target.name,
                    inputValue: target.name
                  });
                }
                setTtBudgetMenuOpenId(null);
                setTtBudgetMenuCoords(null);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs flex items-center gap-1.5 font-semibold text-slate-700 transition-colors"
            >
              <span>重命名</span>
            </button>
            <div className="border-t border-slate-100 my-1"></div>
            <button
              type="button"
              onClick={() => {
                const target = ttBudgets.find(b => b.id === ttBudgetMenuOpenId);
                if (target) {
                  setTtGenericActionModal({
                    module: 'budget',
                    type: 'delete',
                    targetId: ttBudgetMenuOpenId,
                    targetName: target.name,
                    inputValue: ''
                  });
                }
                setTtBudgetMenuOpenId(null);
                setTtBudgetMenuCoords(null);
              }}
              className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 cursor-pointer text-xs flex items-center gap-1.5 font-bold transition-colors"
            >
              <span>删除</span>
            </button>
          </div>
        </>
      )}

      {/* TikTok Creative Group context menu */}
      {ttCreativeGroupMenuOpenId && ttCreativeGroupMenuCoords && (
        <>
          <div 
            className="fixed inset-0 z-45 bg-transparent cursor-default" 
            onClick={(e) => {
              e.stopPropagation();
              setTtCreativeGroupMenuOpenId(null);
              setTtCreativeGroupMenuCoords(null);
            }}
          ></div>
          <div 
            className="fixed bg-white border border-slate-200 shadow-md rounded py-1 w-32 z-50 text-slate-700 text-xs font-medium animate-fade-in select-none"
            style={{
              top: `${ttCreativeGroupMenuCoords.top - window.scrollY}px`,
              left: `${ttCreativeGroupMenuCoords.left - window.scrollX}px`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                handleDuplicateTtCreativeGroup(ttCreativeGroupMenuOpenId);
                setTtCreativeGroupMenuOpenId(null);
                setTtCreativeGroupMenuCoords(null);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs flex items-center gap-1.5 font-semibold text-slate-700 transition-colors"
            >
              <span>复制</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const target = ttCreativeGroups.find(cg => cg.id === ttCreativeGroupMenuOpenId);
                if (target) {
                  setTtGenericActionModal({
                    module: 'creative_group',
                    type: 'batch_duplicate',
                    targetId: ttCreativeGroupMenuOpenId,
                    targetName: target.name,
                    inputValue: '3'
                  });
                }
                setTtCreativeGroupMenuOpenId(null);
                setTtCreativeGroupMenuCoords(null);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs flex items-center gap-1.5 font-semibold text-slate-700 transition-colors"
            >
              <span>批量复制</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const target = ttCreativeGroups.find(cg => cg.id === ttCreativeGroupMenuOpenId);
                if (target) {
                  setTtGenericActionModal({
                    module: 'creative_group',
                    type: 'rename',
                    targetId: ttCreativeGroupMenuOpenId,
                    targetName: target.name,
                    inputValue: target.name
                  });
                }
                setTtCreativeGroupMenuOpenId(null);
                setTtCreativeGroupMenuCoords(null);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs flex items-center gap-1.5 font-semibold text-slate-700 transition-colors"
            >
              <span>重命名</span>
            </button>
            <div className="border-t border-slate-100 my-1"></div>
            <button
              type="button"
              onClick={() => {
                const target = ttCreativeGroups.find(cg => cg.id === ttCreativeGroupMenuOpenId);
                if (target) {
                  setTtGenericActionModal({
                    module: 'creative_group',
                    type: 'delete',
                    targetId: ttCreativeGroupMenuOpenId,
                    targetName: target.name,
                    inputValue: ''
                  });
                }
                setTtCreativeGroupMenuOpenId(null);
                setTtCreativeGroupMenuCoords(null);
              }}
              className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 cursor-pointer text-xs flex items-center gap-1.5 font-bold transition-colors"
            >
              <span>删除</span>
            </button>
          </div>
        </>
      )}

      {/* TikTok Action Dialog/Modal */}
      {ttGenericActionModal.type && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans select-none animate-fade-in text-slate-800">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md flex flex-col">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-lg">
              <span className="text-sm font-extrabold text-slate-800">
                {ttGenericActionModal.type === 'rename' && '重命名'}
                {ttGenericActionModal.type === 'batch_duplicate' && '批量复制'}
                {ttGenericActionModal.type === 'delete' && '确认删除'}
              </span>
              <button 
                onClick={() => setTtGenericActionModal({ module: null, type: null, targetId: null, targetName: '', inputValue: '' })} 
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
              {ttGenericActionModal.type === 'rename' && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 block">请输入新名称：</label>
                  <input 
                    type="text" 
                    value={ttGenericActionModal.inputValue}
                    onChange={e => setTtGenericActionModal(prev => ({ ...prev, inputValue: e.target.value }))}
                    placeholder="请输入名称..."
                    className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 text-xs font-bold focus:outline-hidden focus:border-blue-500"
                    autoFocus
                  />
                </div>
              )}

              {ttGenericActionModal.type === 'batch_duplicate' && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 block">请输入需要复制的份数：</label>
                  <input 
                    type="number" 
                    min="1"
                    max="100"
                    value={ttGenericActionModal.inputValue}
                    onChange={e => setTtGenericActionModal(prev => ({ ...prev, inputValue: e.target.value }))}
                    placeholder="份数"
                    className="w-full bg-white border border-slate-250 hover:border-slate-350 rounded px-3 py-2 text-xs font-bold focus:outline-hidden focus:border-blue-500"
                    autoFocus
                  />
                </div>
              )}

              {ttGenericActionModal.type === 'delete' && (
                <div className="py-2">
                  <p className="text-xs font-semibold text-slate-600">
                    确定要删除「<span className="text-slate-900 font-extrabold">{ttGenericActionModal.targetName}</span>」吗？
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
                onClick={() => setTtGenericActionModal({ module: null, type: null, targetId: null, targetName: '', inputValue: '' })}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded text-xs font-bold text-slate-600 cursor-pointer transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  const { module, type, targetId, inputValue } = ttGenericActionModal;
                  if (type === 'rename') {
                    if (!inputValue.trim()) {
                      alert('名称不能为空！');
                      return;
                    }
                    if (module === 'budget') {
                      setTtBudgets(prev => prev.map(x => x.id === targetId ? { ...x, name: inputValue.trim() } : x));
                    } else if (module === 'creative_group') {
                      setTtCreativeGroups(prev => prev.map(x => x.id === targetId ? { ...x, name: inputValue.trim() } : x));
                    }
                  } else if (type === 'batch_duplicate') {
                    const count = parseInt(inputValue, 10);
                    if (isNaN(count) || count <= 0) {
                      alert('请输入有效的复制数量！');
                      return;
                    }
                    if (module === 'budget') {
                      handleBatchDuplicateTtBudget(targetId!, count);
                    } else if (module === 'creative_group') {
                      handleBatchDuplicateTtCreativeGroup(targetId!, count);
                    }
                  } else if (type === 'delete') {
                    if (module === 'budget') {
                      handleDeleteTtBudget(targetId!);
                    } else if (module === 'creative_group') {
                      handleDeleteTtCreativeGroup(targetId!);
                    }
                  }
                  setTtGenericActionModal({ module: null, type: null, targetId: null, targetName: '', inputValue: '' });
                }}
                className={`px-4 py-2 text-white rounded text-xs font-bold cursor-pointer transition-colors ${
                  ttGenericActionModal.type === 'delete' 
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

    </div>
  );
};
