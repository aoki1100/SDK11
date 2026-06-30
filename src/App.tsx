/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './components/AppContext';
import { Header } from './components/layout/Header';
import { PromotionTab } from './components/tabs/PromotionTab';
import { CreativesTab } from './components/tabs/CreativesTab';
import { ManagementTab } from './components/tabs/ManagementTab';
import { LogsTab } from './components/tabs/LogsTab';
import { SettingsTab } from './components/tabs/SettingsTab';
import { motion, AnimatePresence } from 'motion/react';

function MainLayoutContent() {
  const { activeTab } = useApp();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 font-sans">
      {/* Universal header layout containing brand and navigation list */}
      <Header />

      {/* Main rendering container with smooth animations */}
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="w-full h-full flex flex-col"
          >
            {activeTab === 'promotion' && <PromotionTab />}
            {activeTab === 'creatives' && <CreativesTab />}
            {activeTab === 'management' && <ManagementTab />}
            {activeTab === 'logs' && <LogsTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayoutContent />
    </AppProvider>
  );
}
