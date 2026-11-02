import React, { useState, useRef } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { 
  Wallet, ShieldAlert, User, TrendingUp, 
  Download, Plus, Trash2, DollarSign, RefreshCw 
} from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function App() {
  // Símbolo de moneda
  const [currencySymbol, setCurrencySymbol] = useState('US$');
  const [customCurrency, setCustomCurrency] = useState('');
  const activeSymbol = customCurrency.trim() !== '' ? customCurrency : currencySymbol;

  // 1. ESTADOS DE ENTRADA (Inputs editables)
  const [incomes, setIncomes] = useState([
    { id: 1, name: 'Salario Principal', amount: 3500 }
  ]);

  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Alquiler / Vivienda', amount: 1200 },
    { id: 2, name: 'Alimentación', amount: 600 },
    { id: 3, name: 'Servicios Básicos', amount: 250 }
  ]);

  const [emergencyCurrent, setEmergencyCurrent] = useState(5000);
  const [emergencyMonths, setEmergencyMonths] = useState(6);
  const [emergencyMonthly, setEmergencyMonthly] = useState(300);

  const [personal, setPersonal] = useState([
    { id: 1, name: 'Entretenimiento & Salidas', amount: 300 },
    { id: 2, name: 'Suscripciones & Apps', amount: 50 }
  ]);

  const [investments, setInvestments] = useState([
    { id: 1, name: 'CELI / Acciones (DCA)', amount: 400 },
    { id: 2, name: 'Fondo de Retiro (CELIAPP)', amount: 300 }
  ]);

  // Totales en tiempo real para las cabeceras de cada sección
  const currentTotalIncomes = incomes.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const currentTotalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const currentTotalPersonal = personal.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const currentTotalInvestments = investments.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);

  // Porcentajes en tiempo real con respecto a los ingresos actuales
  const getPercentage = (amount) => {
    if (currentTotalIncomes <= 0) return 0;
    return Math.round((amount / currentTotalIncomes) * 100);
  };

  // 2. ESTADOS APLICADOS (Se actualizan únicamente al hacer clic en Calcular / Actualizar)
  const [appliedIncomes, setAppliedIncomes] = useState(incomes);
  const [appliedExpenses, setAppliedExpenses] = useState(expenses);
  const [appliedEmergencyCurrent, setAppliedEmergencyCurrent] = useState(emergencyCurrent);
  const [appliedEmergencyMonths, setAppliedEmergencyMonths] = useState(emergencyMonths);
  const [appliedEmergencyMonthly, setAppliedEmergencyMonthly] = useState(emergencyMonthly);
  const [appliedPersonal, setAppliedPersonal] = useState(personal);
  const [appliedInvestments, setAppliedInvestments] = useState(investments);
  const [appliedSymbol, setAppliedSymbol] = useState(activeSymbol);

  // Manejadores genéricos
  const handleItemChange = (setter, list, id, field, value) => {
    setter(list.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = (setter, list, defaultName = 'Nuevo item') => {
    setter([...list, { id: Date.now(), name: defaultName, amount: '' }]);
  };

  const removeItem = (setter, list, id) => {
    setter(list.filter(item => item.id !== id));
  };

  // Función de cálculo y actualización explícita
  const handleCalcular = () => {
    setAppliedIncomes([...incomes]);
    setAppliedExpenses([...expenses]);
    setAppliedEmergencyCurrent(emergencyCurrent);
    setAppliedEmergencyMonths(emergencyMonths);
    setAppliedEmergencyMonthly(emergencyMonthly);
    setAppliedPersonal([...personal]);
    setAppliedInvestments([...investments]);
    setAppliedSymbol(activeSymbol);
  };

  const calculatedEmergencyTarget = currentTotalExpenses * Number(emergencyMonths);

  // Cálculos totales basados en los estados APLICADOS
  const totalIncome = appliedIncomes.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const totalExpenses = appliedExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalPersonal = appliedPersonal.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalInvestments = appliedInvestments.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);

  const appliedEmergencyTarget = totalExpenses * Number(appliedEmergencyMonths);

  const totalOutflows = totalExpenses + Number(appliedEmergencyMonthly || 0) + totalPersonal + totalInvestments;
  const netBalance = totalIncome - totalOutflows;

  // Datos para gráficos
  const chartData = [
    { name: 'Gastos', letter: 'G', value: totalExpenses, color: '#ef4444' },
    { name: 'Emergencia', letter: 'E', value: Number(appliedEmergencyMonthly || 0), color: '#3b82f6' },
    { name: 'Personal', letter: 'P', value: totalPersonal, color: '#f59e0b' },
    { name: 'Inversiones', letter: 'I', value: totalInvestments, color: '#10b981' },
  ].filter(item => item.value > 0);

  // Datos para proyección acumulada (6 meses)
  const projectionData = [
    { mes: 'Mes 0', Ahorro: appliedEmergencyCurrent, Inversión: 0 },
    { mes: 'Mes 1', Ahorro: appliedEmergencyCurrent + Number(appliedEmergencyMonthly || 0), Inversión: totalInvestments },
    { mes: 'Mes 2', Ahorro: appliedEmergencyCurrent + (Number(appliedEmergencyMonthly || 0) * 2), Inversión: totalInvestments * 2 },
    { mes: 'Mes 3', Ahorro: appliedEmergencyCurrent + (Number(appliedEmergencyMonthly || 0) * 3), Inversión: totalInvestments * 3 },
    { mes: 'Mes 4', Ahorro: appliedEmergencyCurrent + (Number(appliedEmergencyMonthly || 0) * 4), Inversión: totalInvestments * 4 },
    { mes: 'Mes 5', Ahorro: appliedEmergencyCurrent + (Number(appliedEmergencyMonthly || 0) * 5), Inversión: totalInvestments * 5 },
    { mes: 'Mes 6', Ahorro: appliedEmergencyCurrent + (Number(appliedEmergencyMonthly || 0) * 6), Inversión: totalInvestments * 6 },
  ];

  // Referencia global para PDF (abarca todo el informe)
  const reportRef = useRef();

  const downloadPDF = () => {
    const element = reportRef.current;
    if (!element) return;

    const opt = {
      margin:       10,
      filename:     'Informe_GEPI.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      {/* CONTENEDOR PRINCIPAL ENVUELTO POR LA REFERENCIA DEL PDF */}
      <div ref={reportRef} className="max-w-6xl mx-auto space-y-8 bg-slate-950 p-2">
        
        {/* HEADER Y SELECTOR DE MONEDA */}
        <header className="flex flex-col md:flex-row justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-emerald-500/10 text-emerald-400 p-2.5 rounded-xl border border-emerald-500/20">
                <TrendingUp className="w-8 h-8" />
              </span>
              <div>
                <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Calculadora GEPI
                </h1>
                <p className="text-sm text-slate-400">Gastos, Emergencia, Personal e Inversiones</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-emerald-400" /> Moneda:
            </span>
            <div className="flex gap-1.5">
              {['US$', 'CAD$', '€', 'Q', 'MXN$'].map((sym) => (
                <button
                  key={sym}
                  onClick={() => { setCurrencySymbol(sym); setCustomCurrency(''); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeSymbol === sym && !customCurrency
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Otro..."
              value={customCurrency}
              onChange={(e) => setCustomCurrency(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white w-20 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </header>

        {/* SECCIONES GEPI (ENTRADAS) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 1. INGRESOS */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold flex items-center gap-2 text-emerald-400 flex-wrap">
                <Wallet className="w-5 h-5" /> 
                Ingresos Mensuales
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
                  {currentTotalIncomes.toLocaleString()} {activeSymbol} (100%)
                </span>
              </h2>
              <button 
                onClick={() => addItem(setIncomes, incomes, 'Nuevo ingreso')}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </div>

            <div className="space-y-3">
              {incomes.map(item => (
                <div key={item.id} className="flex items-center gap-3 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                  <input 
                    type="text" 
                    value={item.name}
                    onChange={(e) => handleItemChange(setIncomes, incomes, item.id, 'name', e.target.value)}
                    className="bg-transparent border-none text-slate-200 text-sm focus:outline-none flex-1 font-medium"
                  />
                  <div className="flex items-center gap-1">
                    <input 
                      type="number" 
                      value={item.amount === '' ? '' : item.amount}
                      onChange={(e) => handleItemChange(setIncomes, incomes, item.id, 'amount', e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-right text-sm text-emerald-400 font-bold w-28 focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-xs text-slate-500 w-8">{activeSymbol}</span>
                  </div>
                  {incomes.length > 1 && (
                    <button onClick={() => removeItem(setIncomes, incomes, item.id)} className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 2. GASTOS (G) */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold flex items-center gap-2 text-rose-400 flex-wrap">
                <span className="bg-rose-500/10 px-2 py-0.5 rounded text-xs">G</span> 
                Gastos Fijos y Variables
                <span className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
                  {currentTotalExpenses.toLocaleString()} {activeSymbol} ({getPercentage(currentTotalExpenses)}%)
                </span>
              </h2>
              <button 
                onClick={() => addItem(setExpenses, expenses, 'Nuevo gasto')}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-rose-500/20 flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </div>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {expenses.map(item => (
                <div key={item.id} className="flex items-center gap-3 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                  <input 
                    type="text" 
                    value={item.name}
                    onChange={(e) => handleItemChange(setExpenses, expenses, item.id, 'name', e.target.value)}
                    className="bg-transparent border-none text-slate-200 text-sm focus:outline-none flex-1 font-medium"
                  />
                  <div className="flex items-center gap-1">
                    <input 
                      type="number" 
                      value={item.amount === '' ? '' : item.amount}
                      onChange={(e) => handleItemChange(setExpenses, expenses, item.id, 'amount', e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-right text-sm text-rose-400 font-bold w-28 focus:outline-none focus:border-rose-500"
                    />
                    <span className="text-xs text-slate-500 w-8">{activeSymbol}</span>
                  </div>
                  {expenses.length > 1 && (
                    <button onClick={() => removeItem(setExpenses, expenses, item.id)} className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 3. EMERGENCIA (E) */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2 text-blue-400 flex-wrap">
                <ShieldAlert className="w-5 h-5" /> Fondo de Emergencia (E)
                <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
                  Aporte: {Number(emergencyMonthly || 0).toLocaleString()} {activeSymbol} ({getPercentage(Number(emergencyMonthly || 0))}%)
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-400 mb-1">Ahorro Actual</p>
                <input 
                  type="number" 
                  value={emergencyCurrent === '' ? '' : emergencyCurrent}
                  onChange={(e) => setEmergencyCurrent(e.target.value === '' ? '' : Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-sm text-blue-400 font-bold w-full focus:outline-none"
                />
              </div>

              {/* Selector de Meses de Emergencia (1 a 6 meses) */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-400 mb-1">Meses Cobertura (G)</p>
                <select
                  value={emergencyMonths}
                  onChange={(e) => setEmergencyMonths(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-sm text-blue-400 font-bold w-full focus:outline-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6].map((m) => (
                    <option key={m} value={m}>
                      {m} {m === 1 ? 'Mes' : 'Meses'} ({ (currentTotalExpenses * m).toLocaleString() } {activeSymbol})
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-400 mb-1">Aporte Mensual</p>
                <input 
                  type="number" 
                  value={emergencyMonthly === '' ? '' : emergencyMonthly}
                  onChange={(e) => setEmergencyMonthly(e.target.value === '' ? '' : Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-sm text-blue-400 font-bold w-full focus:outline-none"
                />
              </div>
            </div>

            {/* Resumen de la meta objetivo calculada */}
            <div className="flex justify-between items-center text-xs bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-xl">
              <span className="text-slate-300 font-medium">Meta Objetivo Calculada ({emergencyMonths}x Gastos):</span>
              <span className="font-bold text-blue-400">{calculatedEmergencyTarget.toLocaleString()} {activeSymbol}</span>
            </div>

            {/* Barra de progreso de emergencia basada en datos aplicados */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Progreso de meta</span>
                <span>{appliedEmergencyTarget > 0 ? Math.min(100, Math.round((Number(appliedEmergencyCurrent) / Number(appliedEmergencyTarget)) * 100)) : 0}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="bg-blue-500 h-full transition-all duration-500" 
                  style={{ width: `${appliedEmergencyTarget > 0 ? Math.min(100, (Number(appliedEmergencyCurrent) / Number(appliedEmergencyTarget)) * 100) : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* 4. PERSONAL (P) & INVERSIONES (I) */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
            
            {/* Personal */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold flex items-center gap-2 text-amber-400 flex-wrap">
                  <User className="w-4 h-4" /> 
                  Personal / Ocio (P)
                  <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
                    {currentTotalPersonal.toLocaleString()} {activeSymbol} ({getPercentage(currentTotalPersonal)}%)
                  </span>
                </h3>
                <button onClick={() => addItem(setPersonal, personal, 'Nuevo gusto')} className="text-amber-400 hover:text-amber-300 text-xs flex items-center gap-1 font-bold cursor-pointer">
                  <Plus className="w-3.5 h-3.5" /> Agregar
                </button>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {personal.map(item => (
                  <div key={item.id} className="flex items-center gap-2 bg-slate-950/50 p-2 rounded-xl border border-slate-800">
                    <input type="text" value={item.name} onChange={(e) => handleItemChange(setPersonal, personal, item.id, 'name', e.target.value)} className="bg-transparent text-xs text-slate-200 flex-1 focus:outline-none" />
                    <input type="number" value={item.amount === '' ? '' : item.amount} onChange={(e) => handleItemChange(setPersonal, personal, item.id, 'amount', e.target.value === '' ? '' : Number(e.target.value))} className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-right text-xs text-amber-400 font-bold w-20 focus:outline-none" />
                    {personal.length > 1 && <button onClick={() => removeItem(setPersonal, personal, item.id)} className="text-slate-500 hover:text-rose-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>}
                  </div>
                ))}
              </div>
            </div>

            {/* Inversiones */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold flex items-center gap-2 text-emerald-400 flex-wrap">
                  <TrendingUp className="w-4 h-4" /> 
                  Inversiones (I)
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
                    {currentTotalInvestments.toLocaleString()} {activeSymbol} ({getPercentage(currentTotalInvestments)}%)
                  </span>
                </h3>
                <button onClick={() => addItem(setInvestments, investments, 'Nueva inversión')} className="text-emerald-400 hover:text-emerald-300 text-xs flex items-center gap-1 font-bold cursor-pointer">
                  <Plus className="w-3.5 h-3.5" /> Agregar
                </button>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {investments.map(item => (
                  <div key={item.id} className="flex items-center gap-2 bg-slate-950/50 p-2 rounded-xl border border-slate-800">
                    <input type="text" value={item.name} onChange={(e) => handleItemChange(setInvestments, investments, item.id, 'name', e.target.value)} className="bg-transparent text-xs text-slate-200 flex-1 focus:outline-none" />
                    <input type="number" value={item.amount === '' ? '' : item.amount} onChange={(e) => handleItemChange(setInvestments, investments, item.id, 'amount', e.target.value === '' ? '' : Number(e.target.value))} className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-right text-xs text-emerald-400 font-bold w-20 focus:outline-none" />
                    {investments.length > 1 && <button onClick={() => removeItem(setInvestments, investments, item.id)} className="text-slate-500 hover:text-rose-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* BOTÓN PRINCIPAL: CALCULAR / ACTUALIZAR */}
        <div className="flex justify-center pt-2">
          <button 
            onClick={handleCalcular}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center gap-3 transition-all cursor-pointer text-base transform hover:scale-[1.02]"
          >
            <RefreshCw className="w-5 h-5 animate-spin-slow" /> Calcular / Actualizar Resultados
          </button>
        </div>

        {/* RESUMEN GENERAL (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ingresos Totales</p>
            <p className="text-3xl font-extrabold text-emerald-400 mt-2">{totalIncome.toLocaleString()} {appliedSymbol}</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Egresos Totales (G+E+P+I)</p>
            <p className="text-3xl font-extrabold text-rose-400 mt-2">{totalOutflows.toLocaleString()} {appliedSymbol}</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Balance Neto</p>
            <p className={`text-3xl font-extrabold mt-2 ${netBalance >= 0 ? 'text-blue-400' : 'text-amber-400'}`}>
              {netBalance.toLocaleString()} {appliedSymbol}
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tasa de Inversión / Ahorro</p>
            <p className="text-3xl font-extrabold text-purple-400 mt-2">
              {totalIncome > 0 ? Math.round(((totalInvestments + Number(appliedEmergencyMonthly || 0)) / totalIncome) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* GRÁFICOS INTERACTIVOS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          
          {/* Gráfico de Torta (Distribución GEPI) */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center">
            <h3 className="text-base font-bold text-slate-200 mb-4 w-full text-left">Distribución del Flujo Mensual (GEPI)</h3>
            {chartData.length > 0 ? (
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={chartData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={65} 
                      outerRadius={95} 
                      paddingAngle={4} 
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', color: '#ffffff' }}
                      formatter={(value, name, props) => {
                        const dataItem = props.payload;
                        const totalSum = chartData.reduce((acc, curr) => acc + curr.value, 0);
                        const pct = totalSum > 0 ? Math.round((value / totalSum) * 100) : 0;
                        return [`${dataItem.name} (${dataItem.letter}) : ${value.toLocaleString()} ${appliedSymbol} (${pct}%)`, ''];
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-slate-500 py-20">No hay datos suficientes para graficar.</p>
            )}
          </div>

          {/* Gráfico de Área (Proyección a 6 meses) */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-base font-bold text-slate-200 mb-4">Proyección Acumulada a 6 Meses</h3>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAhorro" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInversion" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="mes" stroke="#64748b" textAnchor="end" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                  <Legend />
                  <Area type="monotone" dataKey="Ahorro" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAhorro)" />
                  <Area type="monotone" dataKey="Inversión" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorInversion)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* BOTÓN DE DESCARGA PDF (Dentro del contenedor de referencia) */}
        <div className="flex justify-end pt-4">
          <button 
            onClick={downloadPDF}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3 rounded-xl shadow-xl shadow-emerald-500/10 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-5 h-5" /> Descargar Informe PDF
          </button>
        </div>

      </div>
    </div>
  );
}