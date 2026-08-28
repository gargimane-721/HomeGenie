import React, { useState } from 'react';
import {
  Layers,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { MaterialCategory, MaterialItem, QualityTier } from '../types';
import { INITIAL_MATERIALS } from '../../server/materialsCatalog';

interface MaterialsComparisonViewProps {
  userTier?: QualityTier;
  onSelectMaterial?: (item: MaterialItem) => void;
}

export const MaterialsComparisonView: React.FC<MaterialsComparisonViewProps> = ({
  userTier = 'Standard',
  onSelectMaterial,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory | 'All'>('Flooring');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTierFilter, setSelectedTierFilter] = useState<QualityTier | 'All'>('All');

  const categories: (MaterialCategory | 'All')[] = [
    'All',
    'Flooring',
    'Windows',
    'Doors',
    'Sanitary',
    'Paint',
    'Electrical',
    'Kitchen',
    'Cement',
    'Steel',
  ];

  // Filter materials
  const filteredMaterials = INITIAL_MATERIALS.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesTier = selectedTierFilter === 'All' || item.qualityLevel === selectedTierFilter;
    const matchesSearch =
      !searchQuery ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesTier && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-300 pb-5">
        <div>
          <div className="flex items-center gap-2 text-gray-900 text-xs font-mono font-bold uppercase tracking-widest">
            <Layers className="h-4 w-4 text-gray-900" />
            <span>Architectural Materials Intelligence</span>
          </div>
          <h2 className="font-heading text-3xl font-bold text-gray-900 mt-1">
            Construction Materials & Brand Comparison
          </h2>
          <p className="text-xs text-gray-900 mt-1 font-medium">
            Compare specs, durability ratings, prices in INR, and warranty across Economy, Standard, and Premium tiers.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-900" />
          <input
            type="text"
            placeholder="Search brands (e.g. Kajaria, Jaquar)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-4 py-2 text-xs font-bold text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Category Pills & Tier Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Categories */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
                selectedCategory === cat
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tier Filter */}
        <div className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white p-1 shadow-sm">
          {(['All', 'Economy', 'Standard', 'Premium'] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTierFilter(tier)}
              className={`rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                selectedTierFilter === tier
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-900 hover:text-black'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Tier Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMaterials.map((item) => {
          const isRecommendedForUser = item.qualityLevel === userTier;

          return (
            <div
              key={item.id}
              className={`relative flex flex-col justify-between rounded-xl border p-5 transition-all duration-200 shadow-sm ${
                isRecommendedForUser
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-300 bg-white hover:border-gray-500'
              }`}
            >
              {/* Recommended Badge */}
              {isRecommendedForUser && (
                <div className="absolute -top-3 right-4 flex items-center gap-1 rounded-full bg-gray-900 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                  <Sparkles className="h-3 w-3 text-gray-200" />
                  <span>RECOMMENDED FOR YOU</span>
                </div>
              )}

              <div>
                {/* Brand & Category Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-gray-900">
                      {item.category} • {item.brand}
                    </span>
                    <h3 className="font-heading text-lg font-bold text-gray-900 mt-0.5">{item.productName}</h3>
                  </div>

                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      item.qualityLevel === 'Premium'
                        ? 'bg-gray-200 text-gray-900 border border-gray-300'
                        : item.qualityLevel === 'Standard'
                        ? 'bg-gray-100 text-gray-900 border border-gray-300'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {item.qualityLevel}
                  </span>
                </div>

                <p className="text-xs text-gray-900 mt-2 leading-relaxed font-medium">{item.description}</p>

                {/* Price & Unit */}
                <div className="mt-4 flex items-baseline gap-1 border-t border-gray-200 pt-3">
                  <span className="font-heading text-2xl font-bold text-gray-900">
                    ₹{item.priceRange ? `${item.priceRange.min.toLocaleString('en-IN')} - ₹${item.priceRange.max.toLocaleString('en-IN')}` : item.approxPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-gray-900 font-mono font-bold">/ {item.unit}</span>
                </div>

                {/* Specs list */}
                <div className="mt-3 space-y-1.5 text-xs text-[#1A1A1A]">
                  {item.durability && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#1A1A1A]/60">Expected Lifespan:</span>
                      <span className="font-mono font-bold text-[#1A1A1A]">{item.durability}</span>
                    </div>
                  )}
                  {item.recommendedUse && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#1A1A1A]/60">Recommended Use:</span>
                      <span className="font-mono font-bold text-[#5A5A40]">{item.recommendedUse}</span>
                    </div>
                  )}
                </div>

                {/* Features Bullets */}
                {item.features && item.features.length > 0 && (
                  <div className="mt-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] block mb-1.5">
                      Key Specifications
                    </span>
                    <ul className="space-y-1 text-[11px] text-[#1A1A1A]/80">
                      {item.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-[#5A5A40] shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-5 border-t border-black/10 pt-3">
                <button
                  onClick={() => onSelectMaterial && onSelectMaterial(item)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-black/10 bg-white py-2 text-xs font-bold uppercase tracking-wider text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors shadow-sm"
                >
                  <span>Select for BOQ & Cost Model</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
