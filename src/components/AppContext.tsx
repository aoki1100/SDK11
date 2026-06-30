import React, { createContext, useContext, useState, useEffect } from 'react';
import { Campaign, AdGroup, Ad, Draft, MaterialFolder, Material, AdAccount, Log, SystemUser, SystemRole, Enterprise } from '../types';
import {
  INITIAL_CAMPAIGNS,
  INITIAL_AD_GROUPS,
  INITIAL_ADS,
  INITIAL_DRAFTS,
  INITIAL_FOLDERS,
  INITIAL_MATERIALS,
  INITIAL_ACCOUNTS,
  INITIAL_LOGS,
  INITIAL_SYSTEM_USERS,
  INITIAL_ROLES,
  INITIAL_ENTERPRISES
} from '../data';

interface AppContextType {
  activeTab: 'promotion' | 'creatives' | 'management' | 'logs' | 'settings';
  setActiveTab: React.Dispatch<React.SetStateAction<'promotion' | 'creatives' | 'management' | 'logs' | 'settings'>>;
  activeChannel: 'tiktok' | 'facebook' | 'google';
  setActiveChannel: React.Dispatch<React.SetStateAction<'tiktok' | 'facebook' | 'google'>>;
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  adGroups: AdGroup[];
  setAdGroups: React.Dispatch<React.SetStateAction<AdGroup[]>>;
  ads: Ad[];
  setAds: React.Dispatch<React.SetStateAction<Ad[]>>;
  drafts: Draft[];
  setDrafts: React.Dispatch<React.SetStateAction<Draft[]>>;
  folders: MaterialFolder[];
  setFolders: React.Dispatch<React.SetStateAction<MaterialFolder[]>>;
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
  accounts: AdAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<AdAccount[]>>;
  logs: Log[];
  setLogs: React.Dispatch<React.SetStateAction<Log[]>>;
  systemUsers: SystemUser[];
  setSystemUsers: React.Dispatch<React.SetStateAction<SystemUser[]>>;
  currentUser: SystemUser;
  setCurrentUser: React.Dispatch<React.SetStateAction<SystemUser>>;
  systemRoles: SystemRole[];
  setSystemRoles: React.Dispatch<React.SetStateAction<SystemRole[]>>;
  enterprises: Enterprise[];
  setEnterprises: React.Dispatch<React.SetStateAction<Enterprise[]>>;
  
  // State helpers
  addLog: (type: Log['type'], content: string, targetType: Log['targetType'], result?: Log['result']) => void;
  createCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt'>, adGroup?: Omit<AdGroup, 'id' | 'createdAt' | 'campaignId' | 'campaignName'>, adName?: string, copywriting?: string, creatives?: string[]) => void;
  deleteCampaign: (id: string) => void;
  uploadMaterial: (file: Omit<Material, 'id' | 'uploadTime'>) => void;
  deleteMaterial: (id: string) => void;
  pushMaterials: (ids: string[], accountId: string) => void;
  addFolder: (name: string, parentId?: string) => void;
  addAccount: (account: Omit<AdAccount, 'createdAt'>) => void;
  removeAccount: (id: string) => void;
  addSystemUser: (user: SystemUser) => void;
  deleteSystemUser: (username: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'promotion' | 'creatives' | 'management' | 'logs' | 'settings'>('promotion');
  const [activeChannel, setActiveChannel] = useState<'tiktok' | 'facebook' | 'google'>(() => {
    const saved = localStorage.getItem('adtool_active_channel');
    return (saved as 'tiktok' | 'facebook' | 'google') || 'tiktok';
  });
  
  // --- Base raw states stored in localStorage ---
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('adtool_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });
  
  const [allAdGroups, setAllAdGroups] = useState<AdGroup[]>(() => {
    const saved = localStorage.getItem('adtool_adgroups');
    return saved ? JSON.parse(saved) : INITIAL_AD_GROUPS;
  });

  const [allAds, setAllAds] = useState<Ad[]>(() => {
    const saved = localStorage.getItem('adtool_ads');
    return saved ? JSON.parse(saved) : INITIAL_ADS;
  });

  const [allDrafts, setAllDrafts] = useState<Draft[]>(() => {
    const saved = localStorage.getItem('adtool_drafts');
    return saved ? JSON.parse(saved) : INITIAL_DRAFTS;
  });

  const [allFolders, setAllFolders] = useState<MaterialFolder[]>(() => {
    const saved = localStorage.getItem('adtool_folders');
    return saved ? JSON.parse(saved) : INITIAL_FOLDERS;
  });

  const [allMaterials, setAllMaterials] = useState<Material[]>(() => {
    const saved = localStorage.getItem('adtool_materials');
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  const [allAccounts, setAllAccounts] = useState<AdAccount[]>(() => {
    const saved = localStorage.getItem('adtool_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [logs, setLogs] = useState<Log[]>(() => {
    const saved = localStorage.getItem('adtool_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [systemUsers, setSystemUsers] = useState<SystemUser[]>(() => {
    const saved = localStorage.getItem('adtool_system_users');
    return saved ? JSON.parse(saved) : INITIAL_SYSTEM_USERS;
  });

  const [currentUser, setCurrentUser] = useState<SystemUser>(() => {
    const saved = localStorage.getItem('adtool_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_SYSTEM_USERS[0];
  });

  const [systemRoles, setSystemRoles] = useState<SystemRole[]>(() => {
    const saved = localStorage.getItem('adtool_system_roles');
    return saved ? JSON.parse(saved) : INITIAL_ROLES;
  });

  const [enterprises, setEnterprises] = useState<Enterprise[]>(() => {
    const saved = localStorage.getItem('adtool_enterprises');
    return saved ? JSON.parse(saved) : INITIAL_ENTERPRISES;
  });

  // Whenever systemUsers changes, keep current user in sync
  useEffect(() => {
    const matched = systemUsers.find(u => u.username === currentUser.username);
    if (matched && JSON.stringify(matched) !== JSON.stringify(currentUser)) {
      setCurrentUser(matched);
    }
  }, [systemUsers, currentUser]);

  useEffect(() => {
    localStorage.setItem('adtool_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('adtool_system_roles', JSON.stringify(systemRoles));
  }, [systemRoles]);

  useEffect(() => {
    localStorage.setItem('adtool_enterprises', JSON.stringify(enterprises));
  }, [enterprises]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('adtool_campaigns', JSON.stringify(allCampaigns));
  }, [allCampaigns]);

  useEffect(() => {
    localStorage.setItem('adtool_adgroups', JSON.stringify(allAdGroups));
  }, [allAdGroups]);

  useEffect(() => {
    localStorage.setItem('adtool_ads', JSON.stringify(allAds));
  }, [allAds]);

  useEffect(() => {
    localStorage.setItem('adtool_drafts', JSON.stringify(allDrafts));
  }, [allDrafts]);

  useEffect(() => {
    localStorage.setItem('adtool_folders', JSON.stringify(allFolders));
  }, [allFolders]);

  useEffect(() => {
    localStorage.setItem('adtool_materials', JSON.stringify(allMaterials));
  }, [allMaterials]);

  useEffect(() => {
    localStorage.setItem('adtool_accounts', JSON.stringify(allAccounts));
  }, [allAccounts]);

  useEffect(() => {
    localStorage.setItem('adtool_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('adtool_system_users', JSON.stringify(systemUsers));
  }, [systemUsers]);

  useEffect(() => {
    localStorage.setItem('adtool_active_channel', activeChannel);
  }, [activeChannel]);

  // --- Multi-tenant Enterprise Isolation Helpers ---
  const filterByEnterprise = <T extends { enterprise?: string }>(list: T[]): T[] => {
    const userEnt = currentUser.enterprise || '雨果跨境';
    return list.filter(item => (item.enterprise || '雨果跨境') === userEnt);
  };

  const updateStateByEnterprise = <T extends { enterprise?: string }>(
    setAll: React.Dispatch<React.SetStateAction<T[]>>,
    value: React.SetStateAction<T[]>
  ): void => {
    const userEnt = currentUser.enterprise || '雨果跨境';
    setAll(prev => {
      const currentFiltered = prev.filter(item => (item.enterprise || '雨果跨境') === userEnt);
      const computedNext = typeof value === 'function' ? (value as any)(currentFiltered) : value;
      const untouched = prev.filter(item => (item.enterprise || '雨果跨境') !== userEnt);
      const stampedNext = computedNext.map((item: any) => ({
        ...item,
        enterprise: item.enterprise || userEnt
      }));
      return [...untouched, ...stampedNext];
    });
  };

  // --- Computed properties and standard dispatchers ---
  const campaigns = filterByEnterprise<Campaign>(allCampaigns);
  const setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>> = (val) => {
    updateStateByEnterprise<Campaign>(setAllCampaigns, val);
  };

  const adGroups = filterByEnterprise<AdGroup>(allAdGroups);
  const setAdGroups: React.Dispatch<React.SetStateAction<AdGroup[]>> = (val) => {
    updateStateByEnterprise<AdGroup>(setAllAdGroups, val);
  };

  const ads = filterByEnterprise<Ad>(allAds);
  const setAds: React.Dispatch<React.SetStateAction<Ad[]>> = (val) => {
    updateStateByEnterprise<Ad>(setAllAds, val);
  };

  const drafts = filterByEnterprise<Draft>(allDrafts);
  const setDrafts: React.Dispatch<React.SetStateAction<Draft[]>> = (val) => {
    updateStateByEnterprise<Draft>(setAllDrafts, val);
  };

  const folders = filterByEnterprise<MaterialFolder>(allFolders);
  const setFolders: React.Dispatch<React.SetStateAction<MaterialFolder[]>> = (val) => {
    updateStateByEnterprise<MaterialFolder>(setAllFolders, val);
  };

  const materials = filterByEnterprise<Material>(allMaterials);
  const setMaterials: React.Dispatch<React.SetStateAction<Material[]>> = (val) => {
    updateStateByEnterprise<Material>(setAllMaterials, val);
  };

  const accounts = filterByEnterprise<AdAccount>(allAccounts);
  const setAccounts: React.Dispatch<React.SetStateAction<AdAccount[]>> = (val) => {
    updateStateByEnterprise<AdAccount>(setAllAccounts, val);
  };

  const addLog = (type: Log['type'], content: string, targetType: Log['targetType'], result: Log['result'] = '成功') => {
    const now = new Date();
    const timeString = now.toISOString().slice(0, 19).replace('T', ' ');
    const newLog: Log = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type,
      content,
      operator: 'admin',
      targetType,
      result,
      createdAt: timeString
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const createCampaign = (
    c: Omit<Campaign, 'id' | 'createdAt'>,
    ag?: Omit<AdGroup, 'id' | 'createdAt' | 'campaignId' | 'campaignName'>,
    adName?: string,
    copywriting?: string,
    creativeIds?: string[]
  ) => {
    const campaignId = String(180000000000000 + Math.floor(Math.random() * 9000000000000));
    const now = new Date();
    const timeString = now.toISOString().slice(0, 19).replace('T', ' ');

    const newCampaign: Campaign = {
      ...c,
      id: campaignId,
      createdAt: timeString,
      channel: activeChannel
    };

    setCampaigns(prev => [newCampaign, ...prev]);
    addLog('发布', `新建推广系列: ${c.campaignName} (ID: ${campaignId})`, 'campaign', '成功');

    // Create ad group if provided
    let createdGroupId = '';
    if (ag) {
      createdGroupId = `g_${Date.now()}`;
      const newGroup: AdGroup = {
        id: createdGroupId,
        campaignId,
        campaignName: c.campaignName,
        adGroupName: ag.adGroupName,
        placement: ag.placement,
        targetLocation: ag.targetLocation,
        budget: ag.budget,
        status: '开启',
        createdAt: timeString
      };
      setAdGroups(prev => [...prev, newGroup]);
    }

    // Create ad inside the group if provided
    if (ag && adName) {
      const newAd: Ad = {
        id: `ad_${Date.now()}`,
        groupId: createdGroupId,
        groupName: ag.adGroupName,
        adName: adName,
        creativeIds: creativeIds || [],
        copywriting: copywriting || '',
        status: '开启',
        createdAt: timeString
      };
      setAds(prev => [...prev, newAd]);

      // Add corresponding Draft as well
      const newDraft: Draft = {
        id: `D${now.toISOString().slice(0, 10).replace(/-/g, '')}${now.toTimeString().slice(0, 8).replace(/:/g, '')}-${Math.random().toString(36).substr(2, 8)}`,
        campaignName: c.campaignName,
        adGroupName: ag.adGroupName,
        adName: adName,
        budget: c.budget || ag.budget,
        creativeCount: creativeIds ? creativeIds.length : 0,
        status: '发布中',
        updatedAt: timeString,
        channel: activeChannel
      };
      setDrafts(prev => [newDraft, ...prev]);
      addLog('发布', `发布广告草稿: ${newDraft.id}`, 'draft', '发布中');
    }
  };

  const deleteCampaign = (id: string) => {
    const camp = campaigns.find(c => c.id === id);
    if (camp) {
      setCampaigns(prev => prev.filter(c => c.id !== id));
      addLog('删除', `删除推广系列: ${camp.campaignName} (${id})`, 'campaign', '成功');
    }
  };

  const uploadMaterial = (file: Omit<Material, 'id' | 'uploadTime'>) => {
    const now = new Date();
    const timeString = now.toISOString().slice(0, 19).replace('T', ' ');
    const newId = `mat_${Date.now()}`;
    const newFile: Material = {
      ...file,
      id: newId,
      uploadTime: timeString
    };
    setMaterials(prev => [newFile, ...prev]);
    addLog('上传', `上传素材: ${file.fileName}`, 'material', '成功');
  };

  const deleteMaterial = (id: string) => {
    const item = materials.find(m => m.id === id);
    if (item) {
      setMaterials(prev => prev.filter(m => m.id !== id));
      addLog('删除', `删除素材: ${item.fileName}`, 'material', '成功');
    }
  };

  const pushMaterials = (ids: string[], accountId: string) => {
    const acc = accounts.find(a => a.id === accountId);
    const accountName = acc ? acc.name : accountId;
    
    setMaterials(prev => prev.map(m => {
      if (ids.includes(m.id)) {
        return {
          ...m,
          pushStatus: '已推送' as const,
          pushAccount: accountName
        };
      }
      return m;
    }));

    ids.forEach(id => {
      const item = materials.find(m => m.id === id);
      if (item) {
        addLog('推送', `推送素材至账户: ${item.fileName} -> ${accountName}`, 'material', '成功');
      }
    });
  };

  const addFolder = (name: string, parentId?: string) => {
    const newId = `${name.toLowerCase()}_dir_${Date.now().toString().slice(-4)}`;
    const newFolder: MaterialFolder = {
      id: newId,
      name,
      parentId
    };
    setFolders(prev => [...prev, newFolder]);
    addLog('系统', `新建文件夹: ${name}`, 'system', '成功');
  };

  const addAccount = (account: Omit<AdAccount, 'createdAt'>) => {
    const now = new Date();
    const timeString = now.toISOString().slice(0, 19).replace('T', ' ');
    const newAcc: AdAccount = {
      ...account,
      createdAt: timeString,
      channel: activeChannel
    };
    setAccounts(prev => [...prev, newAcc]);
    addLog('系统', `添加广告账户: ${account.name} (ID: ${account.id})`, 'account', '成功');
  };

  const removeAccount = (id: string) => {
    const acc = accounts.find(a => a.id === id);
    if (acc) {
      setAccounts(prev => prev.filter(a => a.id !== id));
      addLog('删除', `解除广告账户关联: ${acc.name} (${id})`, 'account', '成功');
    }
  };

  const addSystemUser = (user: SystemUser) => {
    setSystemUsers(prev => [...prev, user]);
    addLog('系统', `新建系统用户: ${user.username}`, 'system', '成功');
  };

  const deleteSystemUser = (username: string) => {
    setSystemUsers(prev => prev.filter(u => u.username !== username));
    addLog('删除', `删除系统用户: ${username}`, 'system', '成功');
  };

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      activeChannel,
      setActiveChannel,
      campaigns,
      setCampaigns,
      adGroups,
      setAdGroups,
      ads,
      setAds,
      drafts,
      setDrafts,
      folders,
      setFolders,
      materials,
      setMaterials,
      accounts,
      setAccounts,
      logs,
      setLogs,
      systemUsers,
      setSystemUsers,
      currentUser,
      setCurrentUser,
      systemRoles,
      setSystemRoles,
      enterprises,
      setEnterprises,
      
      addLog,
      createCampaign,
      deleteCampaign,
      uploadMaterial,
      deleteMaterial,
      pushMaterials,
      addFolder,
      addAccount,
      removeAccount,
      addSystemUser,
      deleteSystemUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
