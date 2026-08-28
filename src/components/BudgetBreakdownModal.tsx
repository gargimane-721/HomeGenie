import React, { useState } from 'react';
import {
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  X,
} from 'lucide-react';
import { BudgetReport } from '../types';

interface BudgetBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetReport: BudgetReport;
  onApplySavings?: (savingsId: string, applied: boolean) => void;
}

export const BudgetBreakdownModal: React.FC<BudgetBreakdownModalProps> = ({
  isOpen,
  onClose,
  budgetReport,
  onApplySavings,
}) => {
  const [appliedSavingsIds, setAppliedSavingsIds] = useState<string[]>(
    budgetReport.savingsRecommendations?.filter((r) => r.applied).map((r) => r.id) || []
  );

  if (!isOpen) return null;

  const handleToggleSaving = (id: string, savingsAmount: number) => {
    const isCurrentlyApplied = appliedSavingsIds.includes(id);
    const updated = isCurrentlyApplied
      ? appliedSavingsIds.filter((item) => item !== id)
      : [...appliedSavingsIds, id];

    setAppliedSavingsIds(updated);
    if (onApplySavings) {
      onApplySavings(id, !isCurrentlyApplied);
    }
  };

  // Calculate live dynamic adjusted cost
  const totalSavings = (budgetReport.savingsRecommendations || [])
    .filter((r) => appliedSavingsIds.includes(r.id))
    .reduce((acc, r) => acc + r.savingsAmount, 0);

  const finalCost = budgetReport.totalEstimatedCost - totalSavings;
  const variance = budgetReport.userBudget - finalCost;
  const isOverBudget = variance < 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl border border-black/10 bg-white shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-300 bg-gray-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 border border-gray-300 text-gray-900">
              <IndianRupee className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-gray-900">Itemized Construction Cost Analysis</h3>
              <p className="text-xs text-gray-900 font-medium">
                Detailed category estimates, material quality tiers, and value-engineering savings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {/* Summary Overview Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Target Budget */}
            <div className="rounded-xl border border-gray-300 bg-gray-50 p-4 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 block">
                Target User Budget
              </span>
              <span className="font-heading mt-1 text-2xl font-bold text-gray-900 block">
                ₹{(budgetReport.userBudget / 100000).toFixed(2)} Lakh
              </span>
              <span className="text-[11px] text-gray-900 block mt-0.5 font-medium">Fixed financial ceiling</span>
            </div>

            {/* Estimated Total */}
            <div className="rounded-xl border border-gray-300 bg-gray-50 p-4 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 block">
                Current Estimated Cost
              </span>
              <span className="font-heading mt-1 text-2xl font-bold text-gray-900 block">
                ₹{(finalCost / 100000).toFixed(2)} Lakh
              </span>
              <span className="text-[11px] text-gray-900 block mt-0.5 font-medium">
                Avg. ₹{budgetReport.ratePerSqFt}/sq.ft built-up
              </span>
            </div>

            {/* Budget Variance / Savings */}
            <div
              className={`rounded-xl border p-4 shadow-sm ${
                isOverBudget
                  ? 'border-rose-500/30 bg-rose-50 text-rose-800'
                  : 'border-gray-300 bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">
                  {isOverBudget ? 'Budget Deficit' : 'Surplus / Savings'}
                </span>
                {isOverBudget ? (
                  <AlertCircle className="h-4 w-4 text-rose-600" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-gray-900" />
                )}
              </div>
              <span className="font-heading mt-1 text-2xl font-bold block">
                {isOverBudget
                  ? `-₹${(Math.abs(variance) / 100000).toFixed(2)}L`
                  : `+₹${(variance / 100000).toFixed(2)}L`}
              </span>
              <span className="text-[11px] text-gray-900 block mt-0.5 font-medium">
                {isOverBudget ? 'Value-engineering recommended' : 'Comfortably within target budget'}
              </span>
            </div>
          </div>

          {/* Value-Engineering Interactive Optimization Toggles */}
          {budgetReport.savingsRecommendations && budgetReport.savingsRecommendations.length > 0 && (
            <div className="rounded-xl border border-[#5A5A40]/30 bg-[#F5F2ED] p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#5A5A40]" />
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
                    Smart Value-Engineering & Savings Suggestions
                  </h4>
                </div>
                {totalSavings > 0 && (
                  <span className="rounded bg-[#5A5A40]/10 px-2 py-0.5 text-xs font-bold text-[#5A5A40] border border-[#5A5A40]/20">
                    Total Savings: ₹{(totalSavings / 100000).toFixed(2)} Lakh
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {budgetReport.savingsRecommendations.map((saving) => {
                  const isChecked = appliedSavingsIds.includes(saving.id);
                  return (
                    <label
                      key={saving.id}
                      className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors shadow-sm ${
                        isChecked
                          ? 'border-[#5A5A40] bg-white'
                          : 'border-black/10 bg-[#EFECE7] hover:border-black/20'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleSaving(saving.id, saving.savingsAmount)}
                        className="mt-1 h-4 w-4 accent-[#1A1A1A] rounded cursor-pointer"
                      />
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="text-[#1A1A1A] font-bold">{saving.title}</strong>
                          <span className="font-mono font-bold text-[#5A5A40]">
                            -₹{(saving.savingsAmount / 1000).toFixed(0)}k
                          </span>
                        </div>
                        <p className="text-[11px] text-[#1A1A1A]/70 mt-1 leading-relaxed font-medium">{saving.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Itemized Cost Breakdown Table */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] mb-3">
              Itemized Stage & Trade Estimates
            </h4>
            <div className="overflow-x-auto rounded-xl border border-black/10 shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-black/10 bg-[#F5F2ED] text-[#5A5A40] font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Category / Trade</th>
                    <th className="px-4 py-3">Specifications & Materials</th>
                    <th className="px-4 py-3 text-right">Share (%)</th>
                    <th className="px-4 py-3 text-right">Estimated Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 bg-white">
                  {budgetReport.categories.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#F5F2ED] transition-colors">
                      <td className="px-4 py-3 font-bold text-[#1A1A1A]">{item.category}</td>
                      <td className="px-4 py-3 text-[#1A1A1A]/70 max-w-xs font-medium">{item.details}</td>
                      <td className="px-4 py-3 text-right font-mono text-[#5A5A40] font-semibold">
                        <div className="flex items-center justify-end gap-1.5">
                          <span>{item.percentage}%</span>
                          <div className="w-12 h-1.5 rounded-full bg-[#EFECE7] overflow-hidden">
                            <div
                              className="h-full bg-[#5A5A40]"
                              style={{ width: `${Math.min(100, item.percentage * 2.5)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-[#1A1A1A]">
                        ₹{(item.cost / 100000).toFixed(2)}L
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-black/10 bg-[#F5F2ED] px-6 py-4">
          <span className="text-xs text-[#1A1A1A]/60 font-medium">
            Estimates benchmarked to current metro civil construction and material rates.
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-[#1A1A1A] hover:bg-[#2c2c2c] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
