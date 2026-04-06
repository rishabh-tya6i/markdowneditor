import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Widget } from '../types';

interface WidgetStore {
  widgets: Widget[];
  
  registerWidget: (widget: Widget) => void;
  toggleWidget: (widgetId: string) => void;
  setWidgetOrder: (widgetId: string, order: number) => void;
  getEnabledWidgets: (position: 'left' | 'right' | 'bottom') => Widget[];
}

export const useWidgetStore = create<WidgetStore>()(
  persist(
    (set, get) => ({
      widgets: [],
      
      registerWidget: (widget) => {
        set((state) => {
          const index = state.widgets.findIndex(w => w.id === widget.id);
          if (index !== -1) {
            // Keep persistence but update name and other properties
            const updated = [...state.widgets];
            const stored = updated[index];
            updated[index] = { 
              ...widget, 
              enabled: stored.enabled, 
              order: stored.order,
              // Update from widget definition
              name: widget.name,
              position: widget.position,
              render: widget.render
            };
            return { widgets: updated };
          }
          return { widgets: [...state.widgets, widget] };
        });
      },
      
      toggleWidget: (widgetId) => {
        set((state) => ({
          widgets: state.widgets.map(w =>
            w.id === widgetId ? { ...w, enabled: !w.enabled } : w
          ),
        }));
      },
      
      setWidgetOrder: (widgetId, order) => {
        set((state) => ({
          widgets: state.widgets.map(w =>
            w.id === widgetId ? { ...w, order } : w
          ),
        }));
      },
      
      getEnabledWidgets: (position) => {
        return get().widgets
          .filter(w => w.enabled && w.position === position && typeof w.render === 'function')
          .sort((a, b) => a.order - b.order);
      },
    }),
    {
      name: 'widget-storage',
      partialize: (state) => ({
        widgets: state.widgets.map(w => ({
          id: w.id,
          name: w.name,
          enabled: w.enabled,
          order: w.order,
          position: w.position,
        })),
      }),
    }
  )
);
