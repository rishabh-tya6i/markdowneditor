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
          const exists = state.widgets.find(w => w.id === widget.id);
          if (exists) return state;
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
          .filter(w => w.enabled && w.position === position)
          .sort((a, b) => a.order - b.order);
      },
    }),
    {
      name: 'widget-storage',
      partialize: (state) => ({
        widgets: state.widgets.map(w => ({
          id: w.id,
          enabled: w.enabled,
          order: w.order,
        })),
      }),
    }
  )
);
