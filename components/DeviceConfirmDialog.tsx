'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { availableDevices } from '../types';
import { DeviceUsageConfirmation } from './DeviceBreakdown';

interface DeviceConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeSlot: string;
  data: any;
  selectedDevices: string[];
  confirmations: DeviceUsageConfirmation[];
  onUpdateConfirmation: (timeSlot: string, deviceId: string, inUse: boolean) => void;
}

export function DeviceConfirmDialog({
  open,
  onOpenChange,
  timeSlot,
  data,
  selectedDevices,
  confirmations,
  onUpdateConfirmation,
}: DeviceConfirmDialogProps) {
  const [localDeviceStates, setLocalDeviceStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Initialize local states based on data and confirmations
    const existing = confirmations.find((c) => c.timeSlot === timeSlot);
    const states: { [key: string]: boolean } = {};
    
    selectedDevices.forEach((deviceId) => {
      if (existing && deviceId in existing.devices) {
        // Use confirmed state
        states[deviceId] = existing.devices[deviceId];
      } else {
        // Use predicted state (if usage > 0, it's predicted to be in use)
        states[deviceId] = data[deviceId] > 0;
      }
    });
    
    setLocalDeviceStates(states);
  }, [timeSlot, data, selectedDevices, confirmations]);

  const handleToggle = (deviceId: string) => {
    setLocalDeviceStates((prev) => ({
      ...prev,
      [deviceId]: !prev[deviceId],
    }));
  };

  const handleSave = () => {
    Object.entries(localDeviceStates).forEach(([deviceId, inUse]) => {
      onUpdateConfirmation(timeSlot, deviceId, inUse);
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Confirm Device Usage</DialogTitle>
          <DialogDescription>
            Review and adjust which devices were active during <span className="font-semibold">{timeSlot}</span>.
            Your feedback helps improve our AI predictions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4 max-h-[400px] overflow-y-auto">
          {selectedDevices.map((deviceId) => {
            const device = availableDevices.find((d) => d.id === deviceId);
            if (!device) return null;

            const isActive = localDeviceStates[deviceId] || false;
            const usage = data[deviceId] || 0;

            return (
              <div
                key={deviceId}
                className={`flex items-center space-x-4 p-3 rounded-lg border transition-colors cursor-pointer ${
                  isActive ? 'bg-green-50 border-green-300' : 'bg-slate-50 border-slate-200'
                }`}
                onClick={() => handleToggle(deviceId)}
              >
                <Checkbox
                  id={`confirm-${deviceId}`}
                  checked={isActive}
                  onCheckedChange={() => handleToggle(deviceId)}
                />
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-2xl">{device.icon}</span>
                  <div className="flex-1">
                    <label
                      htmlFor={`confirm-${deviceId}`}
                      className="text-slate-900 cursor-pointer block"
                    >
                      {device.name}
                    </label>
                    <p className="text-xs text-slate-500">
                      Predicted usage: {usage.toFixed(2)} kWh
                    </p>
                  </div>
                  {isActive && (
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Active</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            Save Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}