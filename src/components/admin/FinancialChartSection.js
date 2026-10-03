"use client";

import { useState } from "react";
import AnnotatedRevenueChart from "@/components/admin/AnnotatedRevenueChart";
import LogActionModal from "@/components/admin/LogActionModal";
import DecisionHistoryModal from "@/components/admin/DecisionHistoryModal";

export default function FinancialChartSection({
  dailyRevenue = [],
  monthlyRevenue = [],
  strategicActions = [],
  selectedDays = 0,
}) {
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  return (
    <>
      <AnnotatedRevenueChart
        daily={dailyRevenue}
        monthly={monthlyRevenue}
        actions={strategicActions}
        selectedDays={selectedDays}
        onOpenLogModal={() => setLogModalOpen(true)}
        onOpenHistoryModal={() => setHistoryModalOpen(true)}
      />

      <LogActionModal
        open={logModalOpen}
        onClose={() => setLogModalOpen(false)}
      />

      <DecisionHistoryModal
        open={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        actions={strategicActions}
      />
    </>
  );
}