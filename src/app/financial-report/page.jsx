"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Contact from "@/components/section/Contact";

export default function FinancialPage() {
  const [mounted, setMounted] = useState(false);

  // --- STATE UNTUK ANIMASI COUNTER HIGHLIGHT UTAMA ---
  const [animatedRevenue, setAnimatedRevenue] = useState(0);
  const [animatedProduct, setAnimatedProduct] = useState(0);
  const [animatedExpenses, setAnimatedExpenses] = useState(0);
  const [animatedProfit, setAnimatedProfit] = useState(0);

  // --- STATE UNTUK ANIMASI PERTUMBUHAN GRAFIK (GROWTH) ---
  const [graphProgress, setGraphProgress] = useState(0);

  useEffect(() => {
    setMounted(true);

    const graphTimeout = setTimeout(() => {
      setGraphProgress(1);
    }, 100);

    // TARGET ANGKA AKHIR
    const targets = {
      revenue: 50030000,
      product: 1036,
      expenses: 41030000,
      profit: 9000000,
    };

    // ANIMASI COUNTER BERBASIS TIMESTAMP
    const duration = 1500;
    const startTime = performance.now();

    const animateCounters = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const easeOutQuad = progress * (2 - progress);

      setAnimatedRevenue(Math.floor(targets.revenue * easeOutQuad));
      setAnimatedProduct(Math.floor(targets.product * easeOutQuad));
      setAnimatedExpenses(Math.floor(targets.expenses * easeOutQuad));
      setAnimatedProfit(Math.floor(targets.profit * easeOutQuad));

      if (progress < 1) {
        requestAnimationFrame(animateCounters);
      } else {
        setAnimatedRevenue(targets.revenue);
        setAnimatedProduct(targets.product);
        setAnimatedExpenses(targets.expenses);
        setAnimatedProfit(targets.profit);
      }
    };

    const animationFrameId = requestAnimationFrame(animateCounters);

    return () => {
      clearTimeout(graphTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const formatNumber = (num) => {
    return new Intl.NumberFormat("id-ID").format(num || 0);
  };

  // Data Main Bar Chart
  const revenueTrend = [
    { month: "Des 2025", revenue: 6, expenses: 4, profit: 2 },
    { month: "Jan 2026", revenue: 5, expenses: 9, profit: -4 },
    { month: "Feb 2026", revenue: 23, expenses: 13, profit: 10 },
    { month: "Mar 2026", revenue: 18, expenses: 17.5, profit: 0.5 },
  ];

  // DATA 1: Revenue Contribution
  const revenueContributions = [
    { name: "Arvena Shell", sales: 63.3, colorClass: "bg-[#0b0f0d]", hex: "#0b0f0d" },
    { name: "Arvena AMDG", sales: 12.6, colorClass: "bg-[#20c997]", hex: "#20c997" },
    { name: "Arvena Shell Custom", sales: 9.9, colorClass: "bg-[#1f3a30]", hex: "#1f3a30" },
    { name: "Arvena AMDG + Pouch", sales: 7.7, colorClass: "bg-[#335e4e]", hex: "#335e4e" },
    { name: "Arvena Shell Diskon", sales: 4.5, colorClass: "bg-[#4d8570]", hex: "#4d8570" },
    { name: "Arvena Joy", sales: 2.0, colorClass: "bg-[#71b39a]", hex: "#71b39a" },
  ];

  // DATA 2: Gross Profit Contribution
  const profitContributions = [
    { name: "Arvena Shell", sales: 56.3, colorClass: "bg-[#0b0f0d]", hex: "#0b0f0d" },
    { name: "Arvena AMDG", sales: 16.4, colorClass: "bg-[#20c997]", hex: "#20c997" },
    { name: "Arvena Shell Custom", sales: 14.0, colorClass: "bg-[#1f3a30]", hex: "#1f3a30" },
    { name: "Arvena AMDG + Pouch", sales: 9.2, colorClass: "bg-[#335e4e]", hex: "#335e4e" },
    { name: "Arvena Shell Diskon", sales: 2.5, colorClass: "bg-[#4d8570]", hex: "#4d8570" },
    { name: "Arvena Joy", sales: 1.6, colorClass: "bg-[#71b39a]", hex: "#71b39a" },
  ];

  // Data Horizontal Bar Chart
  const unitSold = [
    { name: "Arvena Shell", sold: 430 },
    { name: "Arvena AMDG", sold: 320 },
    { name: "Arvena AMDG + Pouch", sold: 160 },
    { name: "Arvena Joy", sold: 60 },
    { name: "Arvena Shell Custom", sold: 55 },
    { name: "Arvena Shell Diskon", sold: 25 },
  ];

  const financialHighlights = [
    { title: "Total Revenue", value: formatNumber(animatedRevenue) },
    { title: "Total Product", value: formatNumber(animatedProduct) },
    { title: "Total Expenses", value: formatNumber(animatedExpenses) },
    { title: "Net Profit", value: formatNumber(animatedProfit) },
  ];

  const strokeCircumference = 251.2;

  const getDonutSegments = (dataArray) => {
    let accumulatedPercent = 0;
    return dataArray.map((item) => {
      const strokeOffset = strokeCircumference - (item.sales / 100) * strokeCircumference * graphProgress;
      const rotationAngle = (accumulatedPercent / 100) * 360 - 90;
      accumulatedPercent += item.sales;
      return {
        ...item,
        strokeOffset,
        rotationAngle,
      };
    });
  };

  const animatedRevenueSegments = getDonutSegments(revenueContributions);
  const animatedProfitSegments = getDonutSegments(profitContributions);

  return (
    <main className="min-h-screen bg-gradient-to-b from-teal-700 to-cyan-500 font-sans overflow-x-hidden flex flex-col justify-between">
      <Navbar />

      {/* Header Dashboard Section */}
      <section className="pt-28 pb-6 md:pt-40 md:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-left text-white">
          <div className={`transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
            <h1 className="text-2xl sm:text-3xl font-black tracking-wider uppercase">Arthakara Student Company</h1>
            <p className="opacity-90 text-xs sm:text-sm mt-1">Financial Performance Report Page (Period Dec 2025 - Mar 2026)</p>
          </div>
        </div>
      </section>

      {/* Main Grid Dashboard */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className={`max-w-7xl mx-auto space-y-6 transition-all duration-1000 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          
          {/* TOP ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 1. Bar Chart Utama */}
            <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-xl shadow-md flex flex-col justify-between min-h-[380px]">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 mb-3 text-center tracking-wide">Revenue, Expenses, and Profit/Loss</h3>
                <div className="flex flex-wrap justify-center gap-3 text-[11px] font-semibold text-slate-800 mb-6">
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#b4e64b] border border-black/10 rounded-sm inline-block"></span> Revenue</div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#20c997] border border-black/10 rounded-sm inline-block"></span> Expenses</div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#2b5ba9] border border-black/10 rounded-sm inline-block"></span> Profit/loss</div>
                </div>
              </div>

              {/* AREA GRAFIK UTAMA */}
              <div className="flex-1 flex flex-col justify-end px-2">
                {/* Frame Sumbu Grafik */}
                <div className="h-36 border-b border-slate-300 pl-8 pr-2 relative w-full flex items-end justify-between mb-1">
                  {/* Gridlines Penanda Nilai */}
                  <div className="absolute left-0 w-full border-t border-dashed border-slate-200 -translate-y-24 pointer-events-none"></div>
                  <div className="absolute left-0 text-[10px] font-medium text-slate-500 -translate-y-24">20 jt</div>
                  
                  <div className="absolute left-0 w-full border-t border-dashed border-slate-200 -translate-y-12 pointer-events-none"></div>
                  <div className="absolute left-0 text-[10px] font-medium text-slate-500 -translate-y-12">10 jt</div>
                  
                  {/* Angka Titik 0 Akurat di Atas Garis Sumbu */}
                  <div className="absolute left-0 text-[10px] font-bold text-slate-600 -translate-y-1">0</div>

                  {/* Rendering Balok Batang */}
                  {revenueTrend.map((item, idx) => (
                    <div key={idx} className="flex-1 flex justify-center items-end h-full relative z-10">
                      <div className="flex items-end gap-0.5 sm:gap-1 relative">
                        {/* Bar 1: Revenue (Hijau Muda) */}
                        <div 
                          style={{ height: `${item.revenue * 4.5 * graphProgress}px` }} 
                          className="w-2.5 sm:w-4 bg-[#b4e64b] border border-black/10 rounded-t-sm transition-all duration-1000 ease-out origin-bottom" 
                        ></div>
                        
                        {/* Bar 2: Expenses (Ijo Ngejreng) */}
                        <div 
                          style={{ height: `${item.expenses * 4.5 * graphProgress}px` }} 
                          className="w-2.5 sm:w-4 bg-[#20c997] border border-black/10 rounded-t-sm transition-all duration-1000 ease-out origin-bottom" 
                        ></div>
                        
                        {/* Bar 3 Slot Container: Menjamin Letak Biru Tetap di Kanan Sebelah Ijo Ngejreng */}
                        <div className="w-2.5 sm:w-4 relative h-full flex items-end">
                          {item.profit >= 0 ? (
                            /* Jika Positif: Balok tumbuh ke atas normal */
                            <div 
                              style={{ height: `${item.profit * 4.5 * graphProgress}px` }} 
                              className="w-full bg-[#2b5ba9] border border-black/10 rounded-t-sm transition-all duration-1000 ease-out origin-bottom"
                            ></div>
                          ) : (
                            /* Jika Negatif (Jan 2026): Tetap di slot ke-3, ditarik ke bawah garis top-full */
                            <div 
                              style={{ height: `${Math.abs(item.profit) * 4.5 * graphProgress}px` }} 
                              className="absolute left-0 top-full w-full bg-[#2b5ba9] border border-black/10 rounded-b-sm transition-all duration-1000 ease-out origin-top z-20"
                            ></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AREA KHUSUS TEKS BULAN */}
                <div className="pl-8 pr-2 flex justify-between items-center pt-8 pb-1 w-full">
                  {revenueTrend.map((item, idx) => (
                    <div key={idx} className="flex-1 text-center">
                      <span className="text-[10px] font-bold text-slate-700 block whitespace-nowrap">
                        {item.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Donut Chart 1: Revenue Contribution */}
            <div className="lg:col-span-4 bg-white p-4 sm:p-5 rounded-xl shadow-md flex flex-col justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 mb-4 text-center tracking-wide">Revenue Contribution</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-around gap-4 h-full">
                <div className="flex-shrink-0 relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100">
                    {animatedRevenueSegments.map((segment, idx) => (
                      <circle 
                        key={idx}
                        cx="50" cy="50" r="40" 
                        stroke={segment.hex} strokeWidth="10" fill="transparent" 
                        strokeDasharray={strokeCircumference}
                        strokeDashoffset={segment.strokeOffset}
                        style={{ 
                          transform: `rotate(${segment.rotationAngle}deg)`, 
                          transformOrigin: "50px 50px" 
                        }}
                        className="transition-all duration-1500 ease-out"
                      />
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight scale-90">Total</span>
                    <span className="text-[10px] sm:text-[11px] font-black text-slate-800 -mt-0.5">Revenue</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 w-full sm:w-auto max-w-xs">
                  {revenueContributions.map((prod, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 text-[10px] font-medium text-slate-800">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${prod.colorClass}`}></span>
                        <span className="truncate max-w-[120px] sm:max-w-[85px]">{prod.name}</span>
                      </div>
                      <span className="font-bold">{prod.sales}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Right Highlight Cards Panel */}
            <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-3 content-between">
              {financialHighlights.map((item, idx) => (
                <div key={idx} className="bg-white px-4 py-3 rounded-xl shadow-md flex flex-col justify-center min-h-[70px]">
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.title}</p>
                  <p className="text-base sm:text-lg lg:text-xl font-black mt-0.5 text-slate-800 truncate">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* BOTTOM ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
            
            {/* 4. Stock Price Line Chart */}
            <div className="lg:col-span-4 bg-white p-4 sm:p-5 rounded-xl shadow-md flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide">Stock Price</h3>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-800">
                  <span className="w-4 h-0.5 bg-[#2b5ba9] inline-block"></span> Stock Price
                </div>
              </div>
              <div className="w-full bg-slate-50 p-2 rounded-lg border border-slate-200">
                <svg viewBox="0 0 400 140" className="w-full h-auto max-h-36 overflow-visible">
                  <line x1="0" y1="110" x2="400" y2="110" stroke="#cbd5e1" strokeWidth="1"/>
                  <line x1="0" y1="55" x2="400" y2="55" stroke="#cbd5e1" strokeWidth="1"/>
                  <path
                    d="M 10 110 L 40 90 L 80 95 L 120 100 L 160 120 L 200 105 L 240 35 L 280 40 L 320 35 L 360 90 L 390 65 L 390 140 L 10 140 Z"
                    fill="#2b5ba9" fillOpacity="0.06"
                    style={{ transform: `scaleY(${graphProgress})`, transformOrigin: "bottom", transition: "transform 1200ms ease-out" }}
                  />
                  <path
                    d="M 10 90 L 40 95 L 80 100 L 120 120 L 160 105 L 200 105 L 240 35 L 280 40 L 320 35 L 360 90 L 390 65"
                    fill="none" stroke="#2b5ba9" strokeWidth="2" strokeLinecap="round"
                    style={{ strokeDasharray: 2000, strokeDashoffset: 2000 - (2000 * graphProgress), transition: "stroke-dashoffset 1500ms ease-out" }}
                  />
                  <circle cx="390" cy="65" r="3" fill="#2b5ba9" className={`transition-opacity duration-500 ${graphProgress === 1 ? "opacity-100" : "opacity-0"}`} />
                </svg>
                <div className="flex justify-between text-[9px] text-slate-700 font-bold mt-2">
                  <span>Des 2025</span><span>Jan 2026</span><span>Feb 2026</span><span>Mar 2026</span>
                </div>
              </div>
            </div>

            {/* 5. Total Unit Sold Chart */}
            <div className="lg:col-span-4 bg-white p-4 sm:p-5 rounded-xl shadow-md flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide">Total Unit Sold</h3>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-800">
                  <span className="w-3 h-3 bg-[#b4e64b] border border-black/10 inline-block"></span> Total Unit Sold
                </div>
              </div>
              <div className="space-y-2.5 my-auto w-full">
                {[...unitSold]
                  .sort((a, b) => b.sold - a.sold)
                  .map((item, idx) => {
                    const maxSold = 500;
                    const barWidth = ((item.sold / maxSold) * 100) * graphProgress;
                    return (
                      <div key={idx} className="flex items-center text-[10px] w-full">
                        <div className="w-20 sm:w-24 text-slate-800 font-bold truncate pr-2 text-right flex-shrink-0">{item.name}</div>
                        <div className="flex-1 bg-slate-100 h-4 rounded-sm overflow-hidden relative border border-slate-200">
                          <div 
                            style={{ width: `${barWidth}%` }} 
                            className="bg-[#b4e64b] h-full rounded-sm transition-all duration-1200 ease-out origin-left"
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="flex text-[9px] text-slate-700 font-bold mt-3 pl-20 sm:pl-24 justify-between w-full">
                <span>0</span><span>100</span><span>200</span><span>300</span><span>400</span><span>500</span>
              </div>
            </div>

            {/* 6. Donut Chart 2: Gross Profit Contribution */}
            <div className="md:col-span-2 lg:col-span-4 bg-white p-4 sm:p-5 rounded-xl shadow-md flex flex-col justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 mb-4 text-center tracking-wide">Gross Profit Contribution</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-around gap-4 h-full">
                <div className="flex-shrink-0 relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100">
                    {animatedProfitSegments.map((segment, idx) => (
                      <circle 
                        key={idx}
                        cx="50" cy="50" r="40" 
                        stroke={segment.hex} strokeWidth="10" fill="transparent" 
                        strokeDasharray={strokeCircumference}
                        strokeDashoffset={segment.strokeOffset}
                        style={{ 
                          transform: `rotate(${segment.rotationAngle}deg)`, 
                          transformOrigin: "50px 50px" 
                        }}
                        className="transition-all duration-1500 ease-out"
                      />
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight scale-90">Gross</span>
                    <span className="text-[10px] sm:text-[11px] font-black text-slate-800 -mt-0.5">Profit</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 w-full sm:w-auto max-w-xs">
                  {profitContributions.map((prod, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 text-[10px] font-medium text-slate-800">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${prod.colorClass}`}></span>
                        <span className="truncate max-w-[120px] sm:max-w-[85px]">{prod.name}</span>
                      </div>
                      <span className="font-bold">{prod.sales}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <Contact />
    </main>
  );
}