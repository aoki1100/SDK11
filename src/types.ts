export interface Campaign {
  id: string;
  advertiserId: string;
  advertiserName: string;
  campaignName: string;
  objective: string;
  type: 'Smart+' | 'Standard';
  budgetMode: '动态日预算' | '不限' | '指定预算';
  budget: number;
  budgetOptimization: boolean;
  bidType?: string;
  roas: string;
  status1: '未启用' | '已启用';
  status2: '已暂停' | '进行中' | '未投放';
  createdAt: string;
  channel?: 'tiktok' | 'facebook' | 'google';
  enterprise?: string; // 所属企业
}

export interface AdGroup {
  id: string;
  campaignId: string;
  campaignName: string;
  adGroupName: string;
  placement: string;
  targetLocation: string;
  budget: number;
  status: '开启' | '暂停';
  createdAt: string;
  enterprise?: string; // 所属企业
}

export interface Ad {
  id: string;
  groupId: string;
  groupName: string;
  adName: string;
  creativeIds: string[];
  copywriting: string;
  status: '开启' | '暂停';
  createdAt: string;
  enterprise?: string; // 所属企业
}

export interface Draft {
  id: string;
  campaignName: string;
  adGroupName: string;
  adName: string;
  budget: number;
  creativeCount: number;
  status: string;
  updatedAt: string;
  channel?: 'tiktok' | 'facebook' | 'google';
  enterprise?: string; // 所属企业
}

export interface MaterialFolder {
  id: string;
  name: string;
  parentId?: string;
  count?: number;
  enterprise?: string; // 所属企业
}

export interface Material {
  id: string;
  thumbnail: string;
  fileName: string;
  format: 'mp4' | 'png' | 'jpg';
  size: string;
  duration: string;
  pushStatus: '已推送' | '未推送';
  pushAccount: string;
  uploadTime: string;
  folderId: string; // references folder id or 'uncategorized'
  enterprise?: string; // 所属企业
}

export interface AdAccount {
  id: string;
  name: string;
  entity: string;
  tiktokAccount: string;
  status: '正常' | '异常';
  createdAt: string;
  channel?: 'tiktok' | 'facebook' | 'google';
  enterprise?: string; // 所属企业
}

export interface Log {
  id: string;
  type: '发布' | '上传' | '复制' | '删除' | '编辑' | '推送' | '系统';
  content: string;
  operator: string;
  targetType: 'draft' | 'material' | 'account' | 'campaign' | 'system';
  result: '成功' | '失败' | '发布中' | '草稿';
  createdAt: string;
}

export interface SystemUser {
  username: string;
  nickname: string;
  role: string;
  status: '正常' | '停用';
  createdAt: string;
  enterprise?: string; // 一级企业权限：所属企业
  authorizedChannels?: string[]; // 二级渠道管理：拥有权限的渠道, e.g., ['tiktok', 'facebook', 'google']
}

export interface SystemRole {
  id: string;
  name: string;
  code: string;
  desc: string;
  tabs: ('promotion' | 'creatives' | 'management' | 'logs' | 'settings')[];
  tabChannels?: Record<string, ('tiktok' | 'facebook' | 'google')[]>;
  isStatic?: boolean;
}

export interface Enterprise {
  id: string;
  name: string;
  status: '正常' | '停用';
  createdAt: string;
  desc?: string;
}

