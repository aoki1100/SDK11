import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Material, MaterialFolder } from '../../types';
import { ChannelSidebar } from '../layout/ChannelSidebar';
import {
  Folder,
  FolderPlus,
  Search,
  Upload,
  Send,
  Trash2,
  Play,
  X,
  FileVideo,
  ChevronDown,
  ChevronRight,
  Monitor,
  Calendar,
  Layers,
  HardDrive
} from 'lucide-react';

export const CreativesTab: React.FC = () => {
  const {
    folders,
    materials,
    accounts,
    addFolder,
    uploadMaterial,
    deleteMaterial,
    pushMaterials,
    addLog,
    activeChannel
  } = useApp();

  // Sub Tab Selector
  const [creativeSubTab, setCreativeSubTab] = useState<'local' | 'tiktok'>('local');

  // Directory filter selection
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  
  // Search state
  const [assetSearch, setAssetSearch] = useState('');

  // Row selection for Push
  const [checkedMaterialIds, setCheckedMaterialIds] = useState<string[]>([]);

  // Modals Toggles
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderParent, setNewFolderParent] = useState('');

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [upFileName, setUpFileName] = useState('');
  const [upFolderId, setUpFolderId] = useState('uncategorized');
  const [upSize, setUpSize] = useState('4.5 MB');
  const [upThumbUrl, setUpThumbUrl] = useState('https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=260&auto=format&fit=crop');

  const [showPushModal, setShowPushModal] = useState(false);
  const [targetAccountId, setTargetAccountId] = useState('');

  // Preview Modal
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);

  // Folder Collapsed state tracker
  const [collapsedFolderIds, setCollapsedFolderIds] = useState<string[]>([]);

  // Toggle Collapse
  const toggleFolderCollapse = (id: string) => {
    if (collapsedFolderIds.includes(id)) {
      setCollapsedFolderIds(prev => prev.filter(fid => fid !== id));
    } else {
      setCollapsedFolderIds(prev => [...prev, id]);
    }
  };

  // Helper calculating material file counts for tree
  const getMaterialCountForFolder = (folderId: string): number => {
    if (folderId === 'all') return materials.length;
    
    // Recursive counter for sub folders
    let count = materials.filter(m => m.folderId === folderId).length;
    
    // Find children directories recursively
    const getChildCounts = (fId: string) => {
      const childs = folders.filter(f => f.parentId === fId);
      childs.forEach(child => {
        count += materials.filter(m => m.folderId === child.id).length;
        getChildCounts(child.id);
      });
    };
    
    getChildCounts(folderId);
    return count;
  };

  // Handler making folder creation
  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    addFolder(newFolderName, newFolderParent || undefined);
    setNewFolderName('');
    setNewFolderParent('');
    setShowFolderModal(false);
  };

  // Handler making upload submission
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upFileName.trim()) return;
    
    const formattedName = upFileName.endsWith('.mp4') ? upFileName : `${upFileName}.mp4`;
    uploadMaterial({
      thumbnail: upThumbUrl,
      fileName: formattedName,
      format: 'mp4',
      size: upSize,
      duration: '-',
      pushStatus: '未推送',
      pushAccount: '-',
      folderId: upFolderId
    });

    setUpFileName('');
    setShowUploadModal(false);
  };

  // Handler pushing checked materials
  const handleBatchPushSubmit = () => {
    if (!targetAccountId) return;
    
    pushMaterials(checkedMaterialIds, targetAccountId);
    setCheckedMaterialIds([]);
    setShowPushModal(false);
  };

  // Filter materials based on hierarchy and search input
  const filteredMaterials = materials.filter(m => {
    // 1. Filter by folder
    if (selectedFolderId !== 'all') {
      // Check if folder is this specific folder or its nested subfolder
      let isMatch = m.folderId === selectedFolderId;
      if (!isMatch) {
         // Check children
         const checkIsChild = (fId: string): boolean => {
           const subFolders = folders.filter(f => f.parentId === fId);
           for (const sf of subFolders) {
             if (m.folderId === sf.id) return true;
             if (checkIsChild(sf.id)) return true;
           }
           return false;
         };
         isMatch = checkIsChild(selectedFolderId);
      }
      if (!isMatch) return false;
    }

    // 2. Filter by search input
    if (assetSearch && !m.fileName.toLowerCase().includes(assetSearch.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Folder nested rendering function for Tree layout
  const renderFolderNode = (folder: MaterialFolder, depth: number = 0) => {
    const hasChildren = folders.some(f => f.parentId === folder.id);
    const isCollapsed = collapsedFolderIds.includes(folder.id);
    const children = folders.filter(f => f.parentId === folder.id);
    const count = getMaterialCountForFolder(folder.id);
    const isSelected = selectedFolderId === folder.id;

    return (
      <div key={folder.id} className="flex flex-col">
        <div
          id={`folder-node-${folder.id}`}
          onClick={() => setSelectedFolderId(folder.id)}
          className={`group flex items-center justify-between py-1.5 px-2.5 rounded-md cursor-pointer transition-colors text-xs
            ${isSelected 
              ? 'bg-[#e0f2fe] text-blue-700 font-semibold border-l-2 border-blue-600 pl-[9px]' 
              : 'hover:bg-slate-100 text-slate-700'
            }`}
          style={{ paddingLeft: `${Math.max(depth * 14 + 10, 10)}px` }}
        >
          <div className="flex items-center gap-2 truncate">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolderCollapse(folder.id);
                }}
                className="p-0.5 hover:bg-slate-200 rounded text-slate-500 cursor-pointer"
              >
                {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <div className="w-4.5" />
            )}
            <Folder className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-500 fill-blue-50' : 'text-slate-400'}`} />
            <span className="truncate">{folder.name}</span>
          </div>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-400'}`}>
            {count}
          </span>
        </div>

        {hasChildren && !isCollapsed && (
          <div className="flex flex-col mt-0.5">
            {children.map(child => renderFolderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootFolders = folders.filter(f => !f.parentId);

  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-48px)] bg-slate-50 text-slate-800 text-xs">

      {/* Left sidebar - Channel layout */}
      <ChannelSidebar />

      {/* Main Material panel layout (Folder Tree left, List Grid right) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header tab selector */}
        <div className="bg-white border-b border-slate-200 px-6 h-12 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-8 h-full">
            <button
              id="subtab-local-creative"
              onClick={() => setCreativeSubTab('local')}
              className={`h-full px-2 font-medium border-b-2 flex items-center gap-1 cursor-pointer transition-all ${creativeSubTab === 'local' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              本地素材
            </button>
            <button
              id="subtab-tiktok-creative"
              onClick={() => setCreativeSubTab('tiktok')}
              className={`h-full px-2 font-medium border-b-2 flex items-center gap-1 cursor-pointer transition-all ${creativeSubTab === 'tiktok' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {activeChannel === 'tiktok' ? 'TikTok素材' : activeChannel === 'facebook' ? 'Facebook素材' : 'Google素材'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="open-push-modal-btn"
              onClick={() => {
                if (checkedMaterialIds.length === 0) {
                  alert('请先勾选需要推送的广告素材文件！');
                  return;
                }
                const activeAccounts = accounts.filter(acc => (acc.channel || 'tiktok') === activeChannel);
                if (activeAccounts.length === 0) {
                  alert(`尚未绑定 ${activeChannel === 'tiktok' ? 'TikTok' : activeChannel === 'facebook' ? 'Facebook' : 'Google'} 广告账户，请先到“管理”中添加关联账户！`);
                  return;
                }
                setTargetAccountId(activeAccounts[0].id);
                setShowPushModal(true);
              }}
              className="px-3.5 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-semibold rounded cursor-pointer flex items-center gap-1 font-mono hover:shadow-xs transition-all"
            >
              <Send className="w-3.5 h-3.5" /> 推送素材
            </button>

            <button
              id="open-upload-modal-btn"
              onClick={() => setShowUploadModal(true)}
              className="px-3.5 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold rounded cursor-pointer flex items-center gap-1 font-mono hover:shadow-md transition-all"
            >
              <Upload className="w-3.5 h-3.5" /> 上传素材
            </button>
          </div>
        </div>

        {/* Dynamic sub tab layout */}
        {creativeSubTab === 'tiktok' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white text-slate-400 gap-3">
             <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100">
               <FileVideo className="w-8 h-8" />
             </div>
             <div>
               <p className="font-semibold text-slate-700 text-sm">
                 暂无外部同步 {activeChannel === 'tiktok' ? 'TikTok' : activeChannel === 'facebook' ? 'Facebook' : 'Google'} 素材记录
               </p>
               <p className="text-xs text-slate-400 mt-1">
                 需绑定并在 {activeChannel === 'tiktok' ? 'TikTok' : activeChannel === 'facebook' ? 'Facebook' : 'Google'} 商业账户中心产生视频播放、创意分享等行为后才可同步展示
               </p>
             </div>
             <button
               onClick={() => setCreativeSubTab('local')}
               className="mt-2 text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
             >
               前往查看本地存储的素材 ➔
             </button>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            
            {/* Left Folder Tree Sidebar component */}
            <div className="w-60 border-r border-slate-200 bg-white flex flex-col p-4 select-none shrink-0 overflow-y-auto">
              <div className="flex items-center justify-between mb-3 text-slate-800 border-b border-slate-100 pb-2">
                <span className="font-bold tracking-wider text-[13px] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" /> 文件夹
                </span>
                
                <button
                  id="open-folder-modal-btn"
                  onClick={() => setShowFolderModal(true)}
                  className="p-1 hover:bg-slate-100 rounded text-blue-600 cursor-pointer flex items-center gap-0.5 border border-blue-200 px-1.5 text-[10px] font-semibold font-mono"
                >
                  <FolderPlus className="w-3.5 h-3.5" /> 新建
                </button>
              </div>

              {/* Tree body hierarchy */}
              <div className="flex flex-col gap-0.5">
                {/* All folders option */}
                <div
                  id="folder-node-all"
                  onClick={() => setSelectedFolderId('all')}
                  className={`flex items-center justify-between py-1.5 px-2.5 rounded-md cursor-pointer transition-colors text-xs font-semibold
                    ${selectedFolderId === 'all' 
                      ? 'bg-[#e0f2fe] text-blue-700 border-l-2 border-blue-600 pl-[9px]' 
                      : 'hover:bg-slate-100 text-slate-700'
                    }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Layers className="w-3.5 h-3.5" />
                    <span>全部素材</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${selectedFolderId === 'all' ? 'bg-blue-105 bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-400'}`}>
                    {materials.length}
                  </span>
                </div>

                {/* Recursive directory trees */}
                <div className="flex flex-col mt-1 bg-transparent">
                  {rootFolders.map(rf => renderFolderNode(rf))}
                </div>
              </div>
            </div>

            {/* Right materials content list components */}
            <div className="flex-1 flex flex-col overflow-hidden bg-white p-4">
              
              {/* Asset list filter bar */}
              <div className="flex items-center justify-between gap-4 mb-4 select-none border-b border-slate-100 pb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    id="search-creative-input"
                    type="text"
                    placeholder="输入素材名称检索..."
                    value={assetSearch}
                    onChange={e => setAssetSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs w-64 focus:outline-hidden focus:border-blue-500 focus:bg-white text-slate-700"
                  />
                </div>

                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Monitor className="w-3.5 h-3.5 text-slate-300" />
                  当前展示 <b>{filteredMaterials.length}</b> 个创意资产文件
                </div>
              </div>

              {/* Table rendering files list */}
              <div className="flex-1 overflow-auto border border-slate-200 rounded">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium select-none text-[11px]">
                      <th className="p-3 w-10 text-center">
                        <input
                          type="checkbox"
                          className="rounded text-blue-600"
                          checked={checkedMaterialIds.length === filteredMaterials.length && filteredMaterials.length > 0}
                          onChange={e => {
                            if (e.target.checked) {
                              setCheckedMaterialIds(filteredMaterials.map(m => m.id));
                            } else {
                              setCheckedMaterialIds([]);
                            }
                          }}
                        />
                      </th>
                      <th className="p-3 w-28">预览</th>
                      <th className="p-3">文件名</th>
                      <th className="p-3 w-20">格式</th>
                      <th className="p-3 w-20">大小</th>
                      <th className="p-3 w-20">时长</th>
                      <th className="p-3 text-center w-28">推送状态</th>
                      <th className="p-3 w-48">推送账户</th>
                      <th className="p-3 text-center w-36">上传时间</th>
                      <th className="p-3 text-center w-16">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMaterials.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="p-12 text-center text-slate-400">
                          此文件夹下暂无素材内容，请点击右上角上传
                        </td>
                      </tr>
                    ) : (
                      filteredMaterials.map(mat => {
                        const isChecked = checkedMaterialIds.includes(mat.id);
                        return (
                          <tr key={mat.id} className={`hover:bg-slate-55/40 hover:bg-slate-50/50 transition-colors ${isChecked ? 'bg-blue-25/50' : ''}`}>
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={e => {
                                  if (e.target.checked) {
                                    setCheckedMaterialIds(prev => [...prev, mat.id]);
                                  } else {
                                    setCheckedMaterialIds(prev => prev.filter(cid => cid !== mat.id));
                                  }
                                }}
                                className="rounded text-blue-600"
                              />
                            </td>
                            <td className="p-3">
                              <div
                                id={`preview-thumb-btn-${mat.id}`}
                                onClick={() => setPreviewMaterial(mat)}
                                className="w-20 h-12 bg-slate-900 rounded overflow-hidden relative cursor-zoom-in group shadow-xs hover:shadow transition-all"
                              >
                                <img
                                  referrerPolicy="no-referrer"
                                  src={mat.thumbnail}
                                  alt=""
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Play className="w-5 h-5 text-white stroke-2 drop-shadow-sm" />
                                </div>
                              </div>
                            </td>
                            <td className="p-3 font-semibold text-slate-900 break-all select-all font-sans leading-relaxed">
                              {mat.fileName}
                            </td>
                            <td className="p-3 text-slate-500 font-mono scale-95 origin-left uppercase">{mat.format}</td>
                            <td className="p-3 text-slate-600 font-mono font-medium">{mat.size}</td>
                            <td className="p-3 text-slate-400 font-mono">{mat.duration}</td>
                            <td className="p-3 text-center">
                              <span className={`inline-flex px-2.5 py-0.5 rounded-[3px] font-semibold text-[10px] select-none ${mat.pushStatus === '已推送' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                                {mat.pushStatus}
                              </span>
                            </td>
                            <td className="p-3 text-slate-600 truncate max-w-[160px]" title={mat.pushAccount}>
                              {mat.pushAccount}
                            </td>
                            <td className="p-3 text-slate-400 font-mono text-[11px] text-center">{mat.uploadTime}</td>
                            <td className="p-3 text-center">
                              <button
                                id={`delete-creative-${mat.id}`}
                                onClick={() => {
                                  if (confirm(`确认要彻底删除该创意素材吗：${mat.fileName}?`)) {
                                    deleteMaterial(mat.id);
                                  }
                                }}
                                className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer p-1.5 hover:bg-rose-50 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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

      {/* CREATE DIRECTORY FOLDER MODAL */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50">
          <form onSubmit={handleCreateFolderSubmit} className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-slate-950 text-white px-5 py-3.5 flex items-center justify-between">
              <span className="font-bold flex items-center gap-1">
                <FolderPlus className="w-4 h-4 text-blue-400" /> 新建素材文件夹
              </span>
              <button type="button" onClick={() => setShowFolderModal(false)} className="text-slate-400 hover:text-white cursor-pointer select-none">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">文件夹名称 *</label>
                <input
                  id="new-folder-name"
                  type="text"
                  placeholder="例如: test, game_assets, tags"
                  required
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden focus:border-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">父节点文件夹 (可选)</label>
                <select
                  value={newFolderParent}
                  onChange={e => setNewFolderParent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden focus:border-blue-500"
                >
                  <option value="">最外层(根级别)</option>
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowFolderModal(false)}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded text-xs cursor-pointer hover:bg-slate-100 font-medium"
              >
                取消
              </button>
              <button
                id="create-folder-btn"
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer"
              >
                创建
              </button>
            </div>
          </form>
        </div>
      )}

      {/* UPLOAD CREATIVE MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50">
          <form onSubmit={handleUploadSubmit} className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-[#0c1a30] text-white px-5 py-3.5 flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-sky-400" /> 上传本地视频素材 (.mp4)
              </span>
              <button type="button" onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white cursor-pointer select-none">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">素材文件名 *</label>
                <input
                  id="upload-filename-input"
                  type="text"
                  placeholder="例如: 智能推广视频_01.mp4"
                  required
                  value={upFileName}
                  onChange={e => setUpFileName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden focus:border-blue-500 font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1.5">预选归属文件夹 *</label>
                  <select
                    value={upFolderId}
                    onChange={e => setUpFolderId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden"
                  >
                    {folders.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1.5">文件大小设定 *</label>
                  <select
                    value={upSize}
                    onChange={e => setUpSize(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden"
                  >
                    <option value="4.5 MB">4.5 MB</option>
                    <option value="8.2 MB">8.2 MB</option>
                    <option value="12.4 MB">12.4 MB</option>
                    <option value="19.0 MB">19.0 MB</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">自定义封面缩略图</label>
                <select
                  value={upThumbUrl}
                  onChange={e => setUpThumbUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden"
                >
                  <option value="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=260&auto=format&fit=crop">数字极客 封面</option>
                  <option value="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=260&auto=format&fit=crop">CSGO 开箱 封面</option>
                  <option value="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=260&auto=format&fit=crop">古典电子 封面</option>
                </select>
              </div>

              {/* simulated drop zone wrapper */}
              <div className="border border-dashed border-slate-300 rounded-lg p-5 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors">
                <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
                <span className="text-[10px] text-slate-500 font-medium">支持拖拽媒体或直接点击录入</span>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded text-xs cursor-pointer hover:bg-slate-100"
              >
                取消
              </button>
              <button
                id="upload-submit-btn"
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer"
              >
                开始上传
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CHOOSE ACCOUNT TO PUSH MODAL */}
      {showPushModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-[#0c1a30] text-white px-5 py-3.5 flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5">
                <Send className="w-4 h-4 text-sky-400" /> 推送素材至 {activeChannel === 'tiktok' ? 'TikTok' : activeChannel === 'facebook' ? 'Facebook' : 'Google'} 账户
              </span>
              <button type="button" onClick={() => setShowPushModal(false)} className="text-slate-400 hover:text-white cursor-pointer select-none">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-4">
              <div className="text-[11px] text-slate-500 bg-blue-50 p-3 rounded-lg border border-blue-100 leading-relaxed">
                您已经勾选了 <b>{checkedMaterialIds.length} 个</b> 本地文件。推送成功后素材将被直接注入到对应 {activeChannel === 'tiktok' ? 'TikTok' : activeChannel === 'facebook' ? 'Facebook' : 'Google'} 的广告资产池中，即可随时绑定使用。
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">目标广告账户 *</label>
                <select
                  value={targetAccountId}
                  onChange={e => setTargetAccountId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-hidden focus:border-blue-500 font-mono"
                >
                  {accounts.filter(acc => (acc.channel || 'tiktok') === activeChannel).map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name} ({acc.id})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPushModal(false)}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded text-xs cursor-pointer hover:bg-slate-100"
              >
                取消
              </button>
              <button
                id="push-submit-btn"
                onClick={handleBatchPushSubmit}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer"
              >
                确认推送
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED ASSET PREVIEW MODAL */}
      {previewMaterial && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-55">
          <div className="bg-[#0b1329] border border-slate-800 rounded-xl overflow-hidden shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col text-slate-200">
            <div className="px-5 py-3.5 bg-[#0f1937] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileVideo className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-xs font-sans tracking-wide truncate max-w-lg">{previewMaterial.fileName}</span>
              </div>
              <button onClick={() => setPreviewMaterial(null)} className="text-slate-400 hover:text-white cursor-pointer select-none">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
              {/* Left video mockup pane */}
              <div className="w-full md:w-80 h-48 bg-black rounded-lg border border-slate-800 flex items-center justify-center relative overflow-hidden shrink-0 group">
                <img
                  referrerPolicy="no-referrer"
                  src={previewMaterial.thumbnail}
                  alt=""
                  className="w-full h-full object-cover opacity-80"
                />
                
                {/* Overlay Simulated Player */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-between p-3.5">
                  <div className="self-end bg-black/65 px-1.5 py-0.5 text-[9px] rounded font-mono text-cyan-400 tracking-wider">
                    HD 1080P
                  </div>
                  
                  <div className="flex items-center justify-center gap-3">
                    <button className="w-12 h-12 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center text-white cursor-pointer transform hover:scale-105 transition-all shadow-md group-hover:scale-110 active:scale-95 duration-150">
                      <Play className="w-5 h-5 fill-white" />
                    </button>
                  </div>

                  <div className="text-[10px] text-slate-300 font-mono flex items-center justify-between">
                    <span>0:00 / 0:15</span>
                    <span className="w-20 h-1 bg-slate-700/60 rounded overflow-hidden">
                      <span className="block h-full w-1/4 bg-blue-500" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Right metadata description */}
              <div className="flex-1 flex flex-col gap-3 text-xs">
                <div className="border-b border-slate-800 pb-2">
                  <h4 className="text-white font-semibold text-sm">媒体资产详情</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Asset specs & linked endpoints</p>
                </div>

                <div className="grid grid-cols-2 gap-3.5 pt-1.5">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-55 text-slate-400 flex items-center gap-1">
                      <Monitor className="w-3.5 h-3.5" /> 分辨率比例
                    </span>
                    <span className="font-mono text-white font-medium">1080 * 1080 (1:1 正方形)</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <HardDrive className="w-3.5 h-3.5" /> 物理大小
                    </span>
                    <span className="font-mono text-white font-medium">{previewMaterial.size}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> 存档时间
                    </span>
                    <span className="font-mono text-white font-medium">{previewMaterial.uploadTime}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Send className="w-3.5 h-3.5" /> 推送状态
                    </span>
                    <span className="font-mono font-medium">
                      {previewMaterial.pushStatus === '已推送' ? (
                        <span className="text-emerald-400 font-semibold">● 已同步至主账户</span>
                      ) : (
                        <span className="text-slate-400">未做分发</span>
                      )}
                    </span>
                  </div>
                </div>

                {previewMaterial.pushStatus === '已推送' && (
                  <div className="bg-[#121f3f] rounded-lg p-3 border border-slate-800 mt-2">
                    <ul className="flex flex-col gap-1 text-[10px] text-slate-300 font-mono">
                      <li><b>推送绑定账户:</b> {previewMaterial.pushAccount}</li>
                      <li><b>同步渠道API:</b> TikTok Creative Center Marketplace</li>
                      <li><b>安全检测:</b> Green (已审核通过，可用于商业推广)</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 py-3 bg-[#0d152a] border-t border-slate-800 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setPreviewMaterial(null)}
                className="px-4 py-1.5 bg-[#172554] hover:bg-sky-900 border border-slate-700 text-white rounded text-xs cursor-pointer font-medium"
              >
                退出预览
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
