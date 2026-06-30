import { Campaign, AdGroup, Ad, Draft, MaterialFolder, Material, AdAccount, Log, SystemUser, SystemRole, Enterprise } from './types';

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: '186777390641554',
    advertiserId: '759815223087939600',
    advertiserName: '数独-雨果-mini-0时区-01',
    campaignName: 'csgo_SA',
    objective: '应用推广',
    type: 'Smart+',
    budgetMode: '动态日预算',
    budget: 20.00,
    budgetOptimization: true,
    roas: '-',
    status1: '未启用',
    status2: '已暂停',
    createdAt: '2026-06-12 15:07:19'
  },
  {
    id: '1867773742957570',
    advertiserId: '759815223087939600',
    advertiserName: '数独-雨果-mini-0时区-01',
    campaignName: 'csgo_SA',
    objective: '应用推广',
    type: 'Smart+',
    budgetMode: '动态日预算',
    budget: 20.00,
    budgetOptimization: true,
    roas: '-',
    status1: '未启用',
    status2: '已暂停',
    createdAt: '2026-06-12 15:04:12'
  },
  {
    id: '1867773557327121',
    advertiserId: '759815223087939600',
    advertiserName: '数独-雨果-mini-0时区-01',
    campaignName: 'csgo_SA',
    objective: '应用推广',
    type: 'Smart+',
    budgetMode: '动态日预算',
    budget: 20.00,
    budgetOptimization: true,
    roas: '-',
    status1: '未启用',
    status2: '已暂停',
    createdAt: '2026-06-12 15:01:19'
  },
  {
    id: '1867772889579730',
    advertiserId: '759815223087939600',
    advertiserName: '数独-雨果-mini-0时区-01',
    campaignName: 'csgo_SA',
    objective: '应用推广',
    type: 'Smart+',
    budgetMode: '动态日预算',
    budget: 20.00,
    budgetOptimization: true,
    roas: '-',
    status1: '未启用',
    status2: '已暂停',
    createdAt: '2026-06-12 14:50:46'
  },
  {
    id: '1867772720736305',
    advertiserId: '759815223087939600',
    advertiserName: '数独-雨果-mini-0时区-01',
    campaignName: 'csgo_SA',
    objective: '应用推广',
    type: 'Smart+',
    budgetMode: '动态日预算',
    budget: 20.00,
    budgetOptimization: true,
    roas: '-',
    status1: '未启用',
    status2: '已暂停',
    createdAt: '2026-06-12 14:48:00'
  },
  {
    id: '1867695493683570',
    advertiserId: '759815223087939600',
    advertiserName: '数独-雨果-mini-0时区-01',
    campaignName: '数独TEST_VO_20260611',
    objective: '应用推广',
    type: 'Smart+',
    budgetMode: '不限',
    budget: 0,
    budgetOptimization: false,
    roas: '-',
    status1: '未启用',
    status2: '已暂停',
    createdAt: '2026-06-11 18:20:27'
  },
  {
    id: '1867691091279266',
    advertiserId: '759815223087939600',
    advertiserName: '数独-雨果-mini-0时区-01',
    campaignName: 'test2_打龙',
    objective: '应用推广',
    type: 'Smart+',
    budgetMode: '动态日预算',
    budget: 22.00,
    budgetOptimization: true,
    roas: '-',
    status1: '未启用',
    status2: '已暂停',
    createdAt: '2026-06-11 17:10:27'
  },
  {
    id: '1867689703043457',
    advertiserId: '759815223087939600',
    advertiserName: '数独-雨果-mini-0时区-01',
    campaignName: 'test_真神之路_安卓',
    objective: '应用推广',
    type: 'Smart+',
    budgetMode: '动态日预算',
    budget: 20.00,
    budgetOptimization: true,
    roas: '-',
    status1: '未启用',
    status2: '已暂停',
    createdAt: '2026-06-11 16:48:26'
  },
  {
    id: '1867689532092562',
    advertiserId: '759815223087939600',
    advertiserName: '数独-雨果-mini-0时区-01',
    campaignName: 'csgo_SA',
    objective: '应用推广',
    type: 'Smart+',
    budgetMode: '动态日预算',
    budget: 20.00,
    budgetOptimization: true,
    roas: '-',
    status1: '未启用',
    status2: '已暂停',
    createdAt: '2026-06-11 16:45:44'
  },
  {
    id: '1867614371029089',
    advertiserId: '759815223087939600',
    advertiserName: '数独-雨果-mini-0时区-01',
    campaignName: 'csgo',
    objective: '应用推广',
    type: 'Smart+',
    budgetMode: '动态日预算',
    budget: 20.00,
    budgetOptimization: true,
    roas: '-',
    status1: '未启用',
    status2: '已暂停',
    createdAt: '2026-06-10 20:51:04'
  }
];

export const INITIAL_AD_GROUPS: AdGroup[] = [
  {
    id: 'g30641554',
    campaignId: '186777390641554',
    campaignName: 'csgo_SA',
    adGroupName: 'Placements_Global_Group_01',
    placement: 'TikTok, Pangle',
    targetLocation: 'Saudi Arabia',
    budget: 20.00,
    status: '暂停',
    createdAt: '2026-06-12 15:07:30'
  },
  {
    id: 'g10912792',
    campaignId: '1867691091279266',
    campaignName: 'test2_打龙',
    adGroupName: 'Group_Android_Drago_01',
    placement: 'TikTok Only',
    targetLocation: 'Taiwan',
    budget: 22.00,
    status: '暂停',
    createdAt: '2026-06-11 17:11:00'
  }
];

export const INITIAL_ADS: Ad[] = [
  {
    id: 'ad90641554',
    groupId: 'g30641554',
    groupName: 'Placements_Global_Group_01',
    adName: 'csgo_unboxing_video_v1',
    creativeIds: ['mat_1'],
    copywriting: 'Unlock premium crates! Code CSGO50 for free roll.',
    status: '暂停',
    createdAt: '2026-06-12 15:08:00'
  }
];

export const INITIAL_DRAFTS: Draft[] = [
  {
    id: 'D20260612150718-9fb762ca',
    campaignName: 'csgo_SA',
    adGroupName: 'Placements_Global_Group_01',
    adName: 'csgo_unboxing_video_v1',
    budget: 20.00,
    creativeCount: 1,
    status: '发布中',
    updatedAt: '2026-06-12 15:07:19'
  }
];

export const INITIAL_FOLDERS: MaterialFolder[] = [
  { id: 'uncategorized', name: '未分类' },
  { id: 'test_dir', name: 'test' },
  { id: 'test2_dir', name: 'test2', parentId: 'test_dir' },
  { id: 'test3_dir', name: 'test3', parentId: 'test2_dir' },
  { id: 'b_dir', name: 'b' }
];

export const INITIAL_MATERIALS: Material[] = [
  {
    id: 'mat_1',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=260&auto=format&fit=crop',
    fileName: '飞书20260612-150258.mp4',
    format: 'mp4',
    size: '4.5 MB',
    duration: '-',
    pushStatus: '已推送',
    pushAccount: '数独-雨果-mini-0时区-01',
    uploadTime: '2026-06-12 15:03:49',
    folderId: 'test3_dir'
  },
  {
    id: 'mat_2',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=260&auto=format&fit=crop',
    fileName: 'test555555555.mp4',
    format: 'mp4',
    size: '3.6 MB',
    duration: '-',
    pushStatus: '已推送',
    pushAccount: '数独-雨果-mini-0时区-01',
    uploadTime: '2026-06-12 15:00:52',
    folderId: 'test3_dir'
  },
  {
    id: 'mat_3',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=260&auto=format&fit=crop',
    fileName: 'test333333333.mp4',
    format: 'mp4',
    size: '3.6 MB',
    duration: '-',
    pushStatus: '未推送',
    pushAccount: '-',
    uploadTime: '2026-06-12 14:50:16',
    folderId: 'test3_dir'
  },
  {
    id: 'mat_4',
    thumbnail: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?q=80&w=260&auto=format&fit=crop',
    fileName: 'Haunted Merge-720 X 720-2026-06-04-30bb3f7158fabafd7...',
    format: 'mp4',
    size: '7.8 MB',
    duration: '-',
    pushStatus: '未推送',
    pushAccount: '-',
    uploadTime: '2026-06-08 11:56:35',
    folderId: 'test3_dir'
  },
  {
    id: 'mat_5',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=260&auto=format&fit=crop',
    fileName: 'u_1610cdaa-cc86-4438-ae54-124d764ef392.mp4',
    format: 'mp4',
    size: '13.8 MB',
    duration: '-',
    pushStatus: '未推送',
    pushAccount: '-',
    uploadTime: '2026-06-08 09:43:15',
    folderId: 'uncategorized'
  },
  {
    id: 'mat_6',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=260&auto=format&fit=crop',
    fileName: 'test3.mp4',
    format: 'mp4',
    size: '19.0 MB',
    duration: '-',
    pushStatus: '已推送',
    pushAccount: '数独-雨果-mini-0时区-01',
    uploadTime: '2026-05-28 17:50:40',
    folderId: 'b_dir'
  }
];

export const INITIAL_ACCOUNTS: AdAccount[] = [
  {
    id: '759815223087939600',
    name: '数独-雨果-mini-0时区-01',
    entity: '数独网络科技有限公司',
    tiktokAccount: '用户476036120960',
    status: '正常',
    createdAt: '2026-05-19 10:25:24'
  }
];

export const INITIAL_LOGS: Log[] = [
  {
    id: 'log_1',
    type: '发布',
    content: '发布广告草稿: D20260612150718-9fb762ca',
    operator: 'admin',
    targetType: 'draft',
    result: '发布中',
    createdAt: '2026-06-12 15:07:19'
  },
  {
    id: 'log_2',
    type: '发布',
    content: '发布广告草稿: D20260612150411-0b1ce4c5',
    operator: 'admin',
    targetType: 'draft',
    result: '发布中',
    createdAt: '2026-06-12 15:04:11'
  },
  {
    id: 'log_3',
    type: '上传',
    content: '上传素材: 飞书20260612-150258.mp4',
    operator: 'admin',
    targetType: 'material',
    result: '成功',
    createdAt: '2026-06-12 15:03:49'
  },
  {
    id: 'log_4',
    type: '发布',
    content: '发布广告草稿: D20260612150118-ceefc203',
    operator: 'admin',
    targetType: 'draft',
    result: '发布中',
    createdAt: '2026-06-12 15:01:18'
  },
  {
    id: 'log_5',
    type: '上传',
    content: '上传素材: test555555555.mp4',
    operator: 'admin',
    targetType: 'material',
    result: '成功',
    createdAt: '2026-06-12 15:00:52'
  },
  {
    id: 'log_6',
    type: '发布',
    content: '发布广告草稿: D20260612145045-d14811d1',
    operator: 'admin',
    targetType: 'draft',
    result: '发布中',
    createdAt: '2026-06-12 14:50:45'
  },
  {
    id: 'log_7',
    type: '上传',
    content: '上传素材: test333333333.mp4',
    operator: 'admin',
    targetType: 'material',
    result: '成功',
    createdAt: '2026-06-12 14:50:16'
  },
  {
    id: 'log_8',
    type: '发布',
    content: '发布广告草稿: D20260612144759-3f38e257',
    operator: 'admin',
    targetType: 'draft',
    result: '发布中',
    createdAt: '2026-06-12 14:47:59'
  },
  {
    id: 'log_9',
    type: '复制',
    content: '复制广告草稿: D20260611164543-87511732',
    operator: 'admin',
    targetType: 'draft',
    result: '草稿',
    createdAt: '2026-06-12 14:47:38'
  },
  {
    id: 'log_10',
    type: '发布',
    content: '发布广告草稿: D20260611164543-87511732',
    operator: 'admin',
    targetType: 'draft',
    result: '发布中',
    createdAt: '2026-06-11 16:45:43'
  }
];

export const INITIAL_SYSTEM_USERS: SystemUser[] = [
  {
    username: 'admin',
    nickname: 'admin',
    role: '超级管理员',
    status: '正常',
    enterprise: '雨果跨境',
    authorizedChannels: ['tiktok', 'facebook', 'google'],
    createdAt: '2026-05-08 17:32:01'
  },
  {
    username: 'yuguo_tt',
    nickname: '雨果投放-小张',
    role: '广告投放专家',
    status: '正常',
    enterprise: '雨果跨境',
    authorizedChannels: ['tiktok'],
    createdAt: '2026-06-15 10:20:00'
  },
  {
    username: 'yuguo_fb_gg',
    nickname: '雨果媒介-小李',
    role: '广告投放专家',
    status: '正常',
    enterprise: '雨果跨境',
    authorizedChannels: ['facebook', 'google'],
    createdAt: '2026-06-16 11:30:00'
  },
  {
    username: 'daxia_all',
    nickname: '大侠总管-老王',
    role: '超级管理员',
    status: '正常',
    enterprise: '大侠数码',
    authorizedChannels: ['tiktok', 'facebook', 'google'],
    createdAt: '2026-06-18 09:15:00'
  },
  {
    username: 'daxia_tt',
    nickname: '大侠投放-小陈',
    role: '广告投放专家',
    status: '正常',
    enterprise: '大侠数码',
    authorizedChannels: ['tiktok'],
    createdAt: '2026-06-19 14:40:00'
  }
];

export const INITIAL_ROLES: SystemRole[] = [
  {
    id: 'r1',
    name: '超级管理员',
    code: 'admin',
    desc: '拥有系统全部业务版块控制权与系统管理设置',
    tabs: ['promotion', 'creatives', 'management', 'logs', 'settings'],
    tabChannels: {
      promotion: ['tiktok', 'facebook', 'google'],
      creatives: ['tiktok', 'facebook', 'google'],
      management: ['tiktok', 'facebook', 'google'],
      logs: ['tiktok', 'facebook', 'google']
    },
    isStatic: true
  },
  {
    id: 'r2',
    name: '广告投放专家',
    code: 'ad_operator',
    desc: '主要负责推广广告系列的制定、优化与创意发布',
    tabs: ['promotion', 'creatives', 'logs'],
    tabChannels: {
      promotion: ['tiktok', 'facebook', 'google'],
      creatives: ['tiktok', 'facebook', 'google'],
      logs: ['tiktok', 'facebook', 'google']
    },
    isStatic: true
  },
  {
    id: 'r3',
    name: '创意设计师',
    code: 'designer',
    desc: '主要负责素材库文件夹建立、设计视频视频上传 and 推送',
    tabs: ['creatives', 'logs'],
    tabChannels: {
      creatives: ['tiktok', 'facebook', 'google'],
      logs: ['tiktok', 'facebook', 'google']
    },
    isStatic: true
  },
  {
    id: 'r4',
    name: '账号关系专员',
    code: 'account_manager',
    desc: '主要负责广告账户与 TikTok 商业账户对应授权解除',
    tabs: ['management', 'logs'],
    tabChannels: {
      management: ['tiktok', 'facebook', 'google'],
      logs: ['tiktok', 'facebook', 'google']
    },
    isStatic: true
  }
];

export const INITIAL_ENTERPRISES: Enterprise[] = [
  {
    id: 'ent_1',
    name: '雨果跨境',
    status: '正常',
    createdAt: '2026-05-01 10:00:00',
    desc: '雨果跨境综合电商投放主体企业'
  },
  {
    id: 'ent_2',
    name: '大侠数码',
    status: '正常',
    createdAt: '2026-05-15 11:20:00',
    desc: '大侠数码3C配件海外代理投放机构'
  },
  {
    id: 'ent_3',
    name: '天域互娱',
    status: '正常',
    createdAt: '2026-06-01 14:00:00',
    desc: '天域互娱移动端游戏全球买量主体'
  }
];

