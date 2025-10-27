// Utility functions for device data storage and retrieval

export interface DeviceUsageStats {
  deviceId: string;
  totalUsage: number;
  averageUsage: number;
  peakUsage: number;
  lastUpdated: string;
}

export interface DeviceConfiguration {
  selectedDevices: string[];
  displayMode: 'kwh' | 'cost';
  lastModified: string;
  version: string;
}

// Get device usage statistics from localStorage
export function getDeviceStats(): DeviceUsageStats[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('deviceStats');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load device stats:', error);
    return [];
  }
}

// Save device usage statistics to localStorage
export function saveDeviceStats(stats: DeviceUsageStats[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('deviceStats', JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save device stats:', error);
  }
}

// Update statistics for a specific device
export function updateDeviceStats(deviceId: string, usage: number): void {
  const stats = getDeviceStats();
  const existingIndex = stats.findIndex(s => s.deviceId === deviceId);
  
  if (existingIndex >= 0) {
    const existing = stats[existingIndex];
    stats[existingIndex] = {
      ...existing,
      totalUsage: existing.totalUsage + usage,
      averageUsage: (existing.totalUsage + usage) / 2,
      peakUsage: Math.max(existing.peakUsage, usage),
      lastUpdated: new Date().toISOString()
    };
  } else {
    stats.push({
      deviceId,
      totalUsage: usage,
      averageUsage: usage,
      peakUsage: usage,
      lastUpdated: new Date().toISOString()
    });
  }
  
  saveDeviceStats(stats);
}

// Get configuration with metadata
export function getDeviceConfiguration(): DeviceConfiguration | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const selectedDevices = localStorage.getItem('selectedDevices');
    const displayMode = localStorage.getItem('displayMode');
    
    if (!selectedDevices) return null;
    
    return {
      selectedDevices: JSON.parse(selectedDevices),
      displayMode: (displayMode as 'kwh' | 'cost') || 'kwh',
      lastModified: new Date().toISOString(),
      version: '1.0'
    };
  } catch (error) {
    console.error('Failed to load device configuration:', error);
    return null;
  }
}

// Export configuration as downloadable JSON
export function exportDeviceConfiguration(): void {
  const config = getDeviceConfiguration();
  const stats = getDeviceStats();
  
  const exportData = {
    configuration: config,
    statistics: stats,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
  
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `energy-dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Clear all stored data
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('selectedDevices');
  localStorage.removeItem('displayMode');
  localStorage.removeItem('deviceStats');
}