import React, { useState } from 'react';
import { CAR_SPECS, STICKER_OPTIONS } from '../constants/carSpecs';

/**
 * SideSpecSelector: Curated Editions & Livery Control
 *
 * Requirements:
 * - Repositioned comfortably inside the viewport (not pressed against the extreme edge).
 * - Complete removal of the persistent specification/customization card.
 * - Zero empty container, border, shadow, or reserved layout space left behind.
 * - Maintains fast, tactile selection of curated Corvette editions and racing livery.
 */
export function SideSpecSelector({
  activeSpecId,
  onSelectSpec,
  activeStickerId,
  onSelectSticker,
}) {
  const [isStickerMenuOpen, setIsStickerMenuOpen] = useState(false);

  const activeSpec = CAR_SPECS.find((s) => s.id === activeSpecId) || CAR_SPECS[0];
  const activeSticker =
    STICKER_OPTIONS.find((s) => s.id === activeStickerId) || STICKER_OPTIONS[0];

  return (
    <aside className="side-spec-dock" aria-label="Curated Car Editions">
      {/* Header Label */}
      <div className="side-dock-label">
        <span className="dock-label-txt">EDITIONS</span>
        <span className="dock-edition-num">
          0{CAR_SPECS.findIndex((s) => s.id === activeSpecId) + 1}
        </span>
      </div>

      {/* Vertical Palette Buttons */}
      <div className="side-swatch-list">
        {CAR_SPECS.map((spec) => {
          const isActive = spec.id === activeSpecId;

          return (
            <div key={spec.id} className="side-swatch-wrap">
              <button
                type="button"
                className={`side-swatch-btn ${isActive ? 'active' : ''}`}
                onClick={() => onSelectSpec(spec.id)}
                aria-label={`${spec.name} - ${spec.edition}`}
                title={`${spec.name} (${spec.edition})`}
                style={{
                  '--spec-color': spec.swatch,
                  '--accent-color': spec.accentSwatch,
                }}
              >
                {/* Visual Swatch Bead with metallic highlight */}
                <span className="swatch-bead">
                  <span className="swatch-accent-dot" />
                </span>

                {/* Active Indicator Ring */}
                {isActive && <span className="swatch-active-ring" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="side-dock-divider" />

      {/* Sticker / Livery Quick-Selector Button */}
      <div className="side-sticker-control">
        <button
          type="button"
          className={`side-sticker-btn ${isStickerMenuOpen ? 'open' : ''} ${activeStickerId !== 'none' ? 'has-sticker' : ''}`}
          onClick={() => setIsStickerMenuOpen((prev) => !prev)}
          title={`Livery: ${activeSticker.name}`}
        >
          <span className="sticker-icon">🏁</span>
          <span className="sticker-btn-label">{activeStickerId === 'none' ? 'CLEAN' : 'DECAL'}</span>
          <span className="sticker-indicator" />
        </button>

        {/* Sticker Selection Flyout Drawer (Contextual Popup) */}
        {isStickerMenuOpen && (
          <div className="side-sticker-drawer">
            <div className="sticker-drawer-header">
              <span>RACING LIVERIES & DECALS</span>
              <button
                type="button"
                className="sticker-drawer-close"
                onClick={() => setIsStickerMenuOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="sticker-options-list">
              {STICKER_OPTIONS.map((sticker) => {
                const isCurrent = sticker.id === activeStickerId;
                return (
                  <button
                    key={sticker.id}
                    type="button"
                    className={`sticker-option-item ${isCurrent ? 'selected' : ''}`}
                    onClick={() => {
                      onSelectSticker(sticker.id);
                      setIsStickerMenuOpen(false);
                    }}
                  >
                    <div className="sticker-option-top">
                      <span className="sticker-option-radio">
                        {isCurrent ? '●' : '○'}
                      </span>
                      <span className="sticker-option-name">{sticker.name}</span>
                    </div>
                    <span className="sticker-option-desc">{sticker.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Active Spec Mini-Label at dock footer */}
      <div className="side-dock-footer">
        <span className="dock-cur-label">{activeSpec.name.split(' ')[0]}</span>
      </div>
    </aside>
  );
}
