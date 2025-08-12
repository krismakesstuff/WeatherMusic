import { useState } from 'react';

export interface LayerState {
  baseLayer: 'osm' | 'satellite';
  overlays: {
    cityLabels: boolean;
    radar: boolean;
    temperatureHeatMap: boolean;
  };
}

interface LayerControlsProps {
  layerState: LayerState;
  onLayerStateChange: (newState: LayerState) => void;
  className?: string;
}

interface LayerToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

function LayerToggle({ label, checked, onChange, description }: LayerToggleProps) {
  return (
    <button
      className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
        checked
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-slate-600 text-slate-200 hover:bg-slate-500'
      }`}
      onClick={() => onChange(!checked)}
      title={description}
    >
      <span className="flex-1 text-left">{label}</span>
      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
        checked
          ? 'border-white bg-white'
          : 'border-slate-400 bg-slate-700'
      }`}>
        {checked && <span className="text-blue-600 text-xs">✓</span>}
      </span>
    </button>
  );
}

interface BaseLayerToggleProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  description?: string;
}

function BaseLayerToggle({ label, selected, onClick, description }: BaseLayerToggleProps) {
  return (
    <button
      className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
        selected
          ? 'bg-green-600 text-white'
          : 'bg-slate-600 text-slate-200 hover:bg-slate-500'
      }`}
      onClick={onClick}
      title={description}
    >
      <span className="flex-1 text-left">{label}</span>
      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
        selected
          ? 'border-white bg-white'
          : 'border-slate-400 bg-slate-700'
      }`}>
        {selected && <span className="w-2 h-2 bg-green-600 rounded-full"></span>}
      </span>
    </button>
  );
}

export default function CustomLayerControls({
  layerState,
  onLayerStateChange,
  className = ''
}: LayerControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateBaseLayer = (baseLayer: 'osm' | 'satellite') => {
    onLayerStateChange({
      ...layerState,
      baseLayer
    });
  };

  const updateOverlay = (overlay: keyof LayerState['overlays'], value: boolean) => {
    onLayerStateChange({
      ...layerState,
      overlays: {
        ...layerState.overlays,
        [overlay]: value
      }
    });
  };

  return (
    <div className={`bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Header with toggle button */}
      <button
        className="w-full px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium border-b border-slate-400 flex items-center justify-between transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="flex items-center justify-between w-full gap-2">
          <span>Layers</span>
        <span className={`transform transition-transform text-slate-300 ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
        </span>
      </button>

      {/* Expandable content */}
      {isExpanded && (
        <div className="p-3 space-y-3 bg-slate-800">
          {/* Base Layers Section */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Base Maps
            </h4>
            <div className="space-y-2">
              <BaseLayerToggle
                label="Street Map"
                selected={layerState.baseLayer === 'osm'}
                onClick={() => updateBaseLayer('osm')}
                description="OpenStreetMap base layer"
              />
              <BaseLayerToggle
                label="Satellite"
                selected={layerState.baseLayer === 'satellite'}
                onClick={() => updateBaseLayer('satellite')}
                description="Satellite imagery base layer"
              />
            </div>
          </div>

          {/* Overlay Layers Section */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Overlays
            </h4>
            <div className="space-y-2">
              <LayerToggle
                label="City Labels"
                checked={layerState.overlays.cityLabels}
                onChange={(checked) => updateOverlay('cityLabels', checked)}
                description="Show city names and labels"
              />
              <LayerToggle
                label="Weather Radar"
                checked={layerState.overlays.radar}
                onChange={(checked) => updateOverlay('radar', checked)}
                description="Show precipitation radar"
              />
              <LayerToggle
                label="Temperature Heat Map"
                checked={layerState.overlays.temperatureHeatMap}
                onChange={(checked) => updateOverlay('temperatureHeatMap', checked)}
                description="Show temperature heat map"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
