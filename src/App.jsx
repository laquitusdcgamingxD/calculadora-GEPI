import React, { useState, useRef } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { 
  Wallet, ShieldAlert, User, TrendingUp, 
  Download, Plus, Trash2, DollarSign, RefreshCw, Globe
} from 'lucide-react';

// Diccionario de traducciones para ES, EN y FR
const translations = {
  es: {
    title: 'Calculadora GEPI',
    subtitle: 'Gastos, Emergencia, Personal e Inversiones',
    currency: 'Moneda:',
    language: 'Idioma:',
    incomes: 'Ingresos Mensuales',
    add: 'Agregar',
    expenses: 'Gastos Fijos y Variables',
    emergency: 'Fondo de Emergencia (E)',
    currentSavings: 'Ahorro Actual',
    coverageMonths: 'Meses Cobertura (G)',
    monthlyContribution: 'Aporte Mensual',
    targetMeta: 'Meta Objetivo Calculada',
    months: 'Meses',
    month: 'Mes',
    progress: 'Progreso de meta',
    personal: 'Personal / Ocio (P)',
    investments: 'Inversiones (I)',
    calculateBtn: 'Calcular / Actualizar Resultados',
    totalIncomes: 'Ingresos Totales',
    totalOutflows: 'Egresos Totales (G+E+P+I)',
    netBalance: 'Balance Neto',
    savingsRate: 'Tasa de Inversión / Ahorro',
    distChartTitle: 'Distribución del Flujo Mensual (GEPI)',
    projChartTitle: 'Proyección Acumulada a 12 Meses',
    noData: 'No hay datos suficientes para graficar.',
    downloadReport: 'Descargar Informe (PNG / Reporte)',
    returnRateLabel: 'Tasa de Rendimiento Anual',
    timeHorizonLabel: 'Plazo de Proyección',
    years: 'Años',
    year: 'Año',
    reportTitle: 'INFORME GEPI - PLANIFICACIÓN FINANCIERA',
    dateLabel: 'Fecha',
    newIncome: 'Nuevo ingreso',
    newExpense: 'Nuevo gasto',
    newPersonal: 'Nuevo gusto',
    newInvestment: 'Nueva inversión',
    totalIngresosLabel: 'Total Ingresos',
    totalGastosLabel: 'Total Gastos',
    totalPersonalLabel: 'Total Personal',
    totalInversionesLabel: 'Total Inversiones',
    totalEmergencyLabel: 'TOTAL APORTE MENSUAL EMERGENCIA (E)',
    emergencyCurrentLabel: 'Fondo Acumulado Actual',
    emergencyMonthlyLabel: 'Aporte Mensual Programado',
    emergencyTargetLabel: 'Cobertura Meta',
    savingsNoInvest: 'Ahorro (sin invertir)',
    investmentWithGrowth: 'Inversión (Interés Compuesto {rate}% anual)'
  },
  en: {
    title: 'GEPI Calculator',
    subtitle: 'Expenses, Emergency, Personal & Investments',
    currency: 'Currency:',
    language: 'Language:',
    incomes: 'Monthly Income',
    add: 'Add',
    expenses: 'Fixed & Variable Expenses',
    emergency: 'Emergency Fund (E)',
    currentSavings: 'Current Savings',
    coverageMonths: 'Coverage Months (G)',
    monthlyContribution: 'Monthly Contribution',
    targetMeta: 'Calculated Target Goal',
    months: 'Months',
    month: 'Month',
    progress: 'Goal progress',
    personal: 'Personal / Leisure (P)',
    investments: 'Investments (I)',
    calculateBtn: 'Calculate / Update Results',
    totalIncomes: 'Total Income',
    totalOutflows: 'Total Outflows (G+E+P+I)',
    netBalance: 'Net Balance',
    savingsRate: 'Savings & Investment Rate',
    distChartTitle: 'Monthly Flow Distribution (GEPI)',
    projChartTitle: '12-Month Accumulated Projection',
    noData: 'Not enough data to graph.',
    downloadReport: 'Download Report (PNG / Report)',
    returnRateLabel: 'Annual Return Rate',
    timeHorizonLabel: 'Projection Timeframe',
    years: 'Years',
    year: 'Year',
    reportTitle: 'GEPI REPORT - FINANCIAL PLANNING',
    dateLabel: 'Date',
    newIncome: 'New income',
    newExpense: 'New expense',
    newPersonal: 'New personal item',
    newInvestment: 'New investment',
    totalIngresosLabel: 'Total Income',
    totalGastosLabel: 'Total Expenses',
    totalPersonalLabel: 'Total Personal',
    totalInversionesLabel: 'Total Investments',
    totalEmergencyLabel: 'TOTAL MONTHLY EMERGENCY CONTRIBUTION (E)',
    emergencyCurrentLabel: 'Current Accumulated Fund',
    emergencyMonthlyLabel: 'Scheduled Monthly Contribution',
    emergencyTargetLabel: 'Target Coverage',
    savingsNoInvest: 'Savings (without investing)',
    investmentWithGrowth: 'Investment (Compound Interest {rate}% p.a.)'
  },
  fr: {
    title: 'Calculatrice GEPI',
    subtitle: 'Dépenses, Urgence, Personnel et Investissements',
    currency: 'Devise:',
    language: 'Langue:',
    incomes: 'Revenus Mensuels',
    add: 'Ajouter',
    expenses: 'Dépenses Fixes et Variables',
    emergency: 'Fonds d\'Urgence (E)',
    currentSavings: 'Épargne Actuelle',
    coverageMonths: 'Mois de Couverture (G)',
    monthlyContribution: 'Cotisation Mensuelle',
    targetMeta: 'Objectif Calculé',
    months: 'Mois',
    month: 'Mois',
    progress: 'Progrès de l\'objectif',
    personal: 'Personnel / Loisirs (P)',
    investments: 'Investissements (I)',
    calculateBtn: 'Calculer / Mettre à Jour',
    totalIncomes: 'Revenus Totaux',
    totalOutflows: 'Sorties Totales (G+E+P+I)',
    netBalance: 'Solde Net',
    savingsRate: 'Taux d\'Épargne / Investissement',
    distChartTitle: 'Distribution du Flux Mensuel (GEPI)',
    projChartTitle: 'Projection Cumulée sur 12 Mois',
    noData: 'Pas assez de données a afficher.',
    downloadReport: 'Télécharger el Rapport (PNG / Rapport)',
    returnRateLabel: 'Taux de Rendement Annuel',
    timeHorizonLabel: 'Horizon d\'Investissement',
    years: 'Ans',
    year: 'An',
    reportTitle: 'RAPPORT GEPI - PLANIFICATION FINANCIÈRE',
    dateLabel: 'Date',
    newIncome: 'Nouveau revenu',
    newExpense: 'Nouvelle dépense',
    newPersonal: 'Nouveau loisir',
    newInvestment: 'Nouvel investissement',
    totalIngresosLabel: 'Total Revenus',
    totalGastosLabel: 'Total Dépenses',
    totalPersonalLabel: 'Total Personnel',
    totalInversionesLabel: 'Total Investissements',
    totalEmergencyLabel: 'TOTAL COTISATION MENSUELLE D\'URGENCE (E)',
    emergencyCurrentLabel: 'Fonds Cumulé Actuel',
    emergencyMonthlyLabel: 'Cotisation Mensuelle Prévue',
    emergencyTargetLabel: 'Couverture Cible',
    savingsNoInvest: 'Épargne (sans investir)',
    investmentWithGrowth: 'Investissement (Intérêt Composé {rate}% an)'
  }
};

export default function App() {
  // Selector de Idioma ('es' | 'en' | 'fr')
  const [lang, setLang] = useState('es');
  const t = translations[lang];

  // Símbolo de moneda y Nombre del usuario / reporte
  const [currencySymbol, setCurrencySymbol] = useState('US$');
  const [customCurrency, setCustomCurrency] = useState('');
  const [reportTitleName, setReportTitleName] = useState('');
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

  // Nuevos estados interactivos para la gráfica de proyección
  const [customReturnRate, setCustomReturnRate] = useState(8); // Porcentaje anual (base 8%)
  const [projectionYears, setProjectionYears] = useState(1);  // Plazo en años (1 a 10 años)

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
  const [appliedLang, setAppliedLang] = useState(lang);

  // Manejadores genéricos
  const handleItemChange = (setter, list, id, field, value) => {
    setter(list.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = (setter, list, defaultName) => {
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
    setAppliedLang(lang);
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
  const appT = translations[appliedLang];

  const chartData = [
    { name: appT.expenses, letter: 'G', value: totalExpenses, color: '#ef4444' },
    { name: appT.emergency, letter: 'E', value: Number(appliedEmergencyMonthly || 0), color: '#3b82f6' },
    { name: appT.personal, letter: 'P', value: totalPersonal, color: '#f59e0b' },
    { name: appT.investments, letter: 'I', value: totalInvestments, color: '#10b981' },
  ].filter(item => item.value > 0);

  // Tasa de rendimiento estimada mensual basada en la casilla interactiva (%)
  const annualReturnRate = (Number(customReturnRate) || 0) / 100;
  const monthlyRate = Math.pow(1 + annualReturnRate, 1 / 12) - 1;
  const totalMonths = Math.max(1, projectionYears * 12);

  // Formato dinámico del texto de Inversión con la tasa ingresada
  const investmentLegendLabel = (appT.investmentWithGrowth || 'Inversión (Interés Compuesto {rate}% anual)')
    .replace('{rate}', customReturnRate || 0);

  // Generación interactiva de datos para la proyección según años y porcentaje elegidos
  const projectionData = Array.from({ length: totalMonths + 1 }, (_, i) => {
    // Ahorro sin invertir (acumulación lineal de aportaciones de Inversión I)
    const totalContributed = totalInvestments * i;

    // Inversión con interés compuesto mensual sobre las aportaciones acumuladas
    let totalInvestedValue = 0;
    for (let m = 1; m <= i; m++) {
      totalInvestedValue = (totalInvestedValue + totalInvestments) * (1 + monthlyRate);
    }

    // Porcentaje de rendimiento extra ganado
    const gainPct = totalContributed > 0 
      ? Math.round(((totalInvestedValue - totalContributed) / totalContributed) * 1000) / 10
      : 0;

    // Formato de etiqueta amigable para el eje X (meses, años o años y meses)
    let label = `0 ${appT.month || 'Mes'}`;
    if (i === 0) {
      label = `Mes 0`;
    } else if (i < 12) {
      label = `${i} ${i === 1 ? (appT.month || 'Mes') : (appT.months || 'Meses')}`;
    } else {
      const yearsCount = Math.floor(i / 12);
      const remainingMonths = i % 12;
      const yrText = yearsCount === 1 ? (appT.year || 'año') : (appT.years || 'años');
      
      if (remainingMonths === 0) {
        label = `${yearsCount} ${yrText}`;
      } else {
        const moText = remainingMonths === 1 ? (appT.month || 'mes') : (appT.months || 'meses');
        label = `${yearsCount} ${yrText} y ${remainingMonths} ${moText}`;
      }
    }

    return {
      mes: label,
      [appT.savingsNoInvest || 'Ahorro (sin invertir)']: Math.round(totalContributed),
      [investmentLegendLabel]: Math.round(totalInvestedValue),
      pctText: gainPct > 0 ? ` (+${gainPct}% gain)` : ' (0%)'
    };
  });

  const reportRef = useRef();

  // Función para generar un informe limpio en Canvas y descargarlo directamente
  const generateCanvasReport = () => {
    const reportT = translations[appliedLang];
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');

    // Fondo
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Encabezado
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, 0, canvas.width, 16);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    // TÍTULO CAMBIADO A PLANIFICACIÓN FINANCIERA CON NOMBRE OPCIONAL
    const reportHeading = reportTitleName.trim() !== '' 
      ? `PLANIFICACIÓN FINANCIERA - ${reportTitleName.trim()}` 
      : 'PLANIFICACIÓN FINANCIERA';
    ctx.fillText(reportHeading, 60, 90);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px sans-serif';
    ctx.fillText(`${reportT.dateLabel}: ${new Date().toLocaleDateString()} | ${reportT.currency} ${appliedSymbol}`, 60, 130);

    // Línea divisora
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 160);
    ctx.lineTo(1140, 160);
    ctx.stroke();

    // Tarjetas KPIs principales
    const drawKpi = (title, value, x, y, color) => {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(x, y, 240, 120, 16);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px sans-serif';
      ctx.fillText(title.toUpperCase(), x + 20, y + 40);

      ctx.fillStyle = color;
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(value, x + 20, y + 85);
    };

    drawKpi(reportT.totalIncomes, `${totalIncome.toLocaleString()} ${appliedSymbol}`, 60, 190, '#34d399');
    drawKpi(reportT.totalOutflows, `${totalOutflows.toLocaleString()} ${appliedSymbol}`, 330, 190, '#f87171');
    drawKpi(reportT.netBalance, `${netBalance.toLocaleString()} ${appliedSymbol}`, 600, 190, netBalance >= 0 ? '#60a5fa' : '#fbbf24');
    
    const rate = totalIncome > 0 ? Math.round(((totalInvestments + Number(appliedEmergencyMonthly || 0)) / totalIncome) * 100) : 0;
    drawKpi(reportT.savingsRate, `${rate}%`, 870, 190, '#c084fc');

    // Tablas de Detalle
    let currentY = 370;

    const drawSection = (title, items, color, totalLabel) => {
      ctx.fillStyle = color;
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(title, 60, currentY);
      currentY += 20;

      const totalSection = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
      const sectionPct = totalIncome > 0 ? Math.round((totalSection / totalIncome) * 100) : 0;
      const boxHeight = (items.length * 40) + 70;

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(60, currentY, 1080, boxHeight, 12);
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.stroke();

      let rowY = currentY + 35;
      items.forEach((item) => {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '18px sans-serif';
        ctx.fillText(`• ${item.name || '---'}`, 90, rowY);

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(`${Number(item.amount || 0).toLocaleString()} ${appliedSymbol}`, 1000, rowY);
        rowY += 40;
      });

      // Línea divisora previa al Total
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, rowY - 10);
      ctx.lineTo(1120, rowY - 10);
      ctx.stroke();

      // Fila de Total de Sección con Porcentaje
      ctx.fillStyle = color;
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(totalLabel.toUpperCase(), 90, rowY + 15);
      ctx.fillText(`${totalSection.toLocaleString()} ${appliedSymbol} (${sectionPct}%)`, 950, rowY + 15);

      currentY += boxHeight + 40;
    };

    drawSection(`1. ${reportT.incomes.toUpperCase()}`, appliedIncomes, '#34d399', reportT.totalIngresosLabel);
    drawSection(`2. ${reportT.expenses.toUpperCase()} (G)`, appliedExpenses, '#f87171', reportT.totalGastosLabel);
    
    // Sección Emergencia con desglose completo
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`3. ${reportT.emergency.toUpperCase()}`, 60, currentY);
    currentY += 20;

    const emergencyTotalTarget = totalExpenses * Number(appliedEmergencyMonths);
    const emergencyPct = totalIncome > 0 ? Math.round((Number(appliedEmergencyMonthly || 0) / totalIncome) * 100) : 0;

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(60, currentY, 1080, 150, 12);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '18px sans-serif';
    ctx.fillText(`• ${reportT.emergencyCurrentLabel}: ${Number(appliedEmergencyCurrent).toLocaleString()} ${appliedSymbol}`, 90, currentY + 35);
    ctx.fillText(`• ${reportT.emergencyMonthlyLabel}: ${Number(appliedEmergencyMonthly).toLocaleString()} ${appliedSymbol}`, 90, currentY + 75);

    ctx.fillText(`• ${reportT.emergencyTargetLabel} (${appliedEmergencyMonths} ${reportT.months}): ${emergencyTotalTarget.toLocaleString()} ${appliedSymbol}`, 600, currentY + 35);

    // Línea divisora
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, currentY + 95);
    ctx.lineTo(1120, currentY + 95);
    ctx.stroke();

    // Total Aporte Emergencia con Porcentaje
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(reportT.totalEmergencyLabel, 90, currentY + 125);
    ctx.fillText(`${Number(appliedEmergencyMonthly).toLocaleString()} ${appliedSymbol} (${emergencyPct}%)`, 950, currentY + 125);

    currentY += 190;

    drawSection(`4. ${reportT.personal.toUpperCase()}`, appliedPersonal, '#fbbf24', reportT.totalPersonalLabel);
    drawSection(`5. ${reportT.investments.toUpperCase()}`, appliedInvestments, '#34d399', reportT.totalInversionesLabel);

    // Pie de página
    ctx.fillStyle = '#64748b';
    ctx.font = '14px sans-serif';
    ctx.fillText('Report GEPI', 60, 1550);

    // Descarga directa de la imagen
    const link = document.createElement('a');
    link.download = `Informe_GEPI_${new Date().toISOString().slice(0,10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const downloadPDF = () => {
    generateCanvasReport();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          button, input[type="text"], input[type="number"], select, .no-print { display: none !important; }
          .print-only { display: block !important; }
          .bg-slate-900, .bg-slate-950 { background: white !important; border-color: #e2e8f0 !important; color: black !important; }
          .text-slate-100, .text-slate-200, .text-slate-300, .text-slate-400 { color: black !important; }
          h1, h2, h3, p, span { color: black !important; }
        }
      `}</style>

      {/* CONTENEDOR PRINCIPAL */}
      <div ref={reportRef} className="max-w-6xl mx-auto space-y-8 bg-slate-950 p-2">
        
        {/* HEADER, SELECTOR DE NOMBRE, MONEDA E IDIOMA */}
        <header className="flex flex-col lg:flex-row justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-500/10 text-emerald-400 p-2.5 rounded-xl border border-emerald-500/20">
              <TrendingUp className="w-8 h-8" />
            </span>
            <div>
              <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className="text-sm text-slate-400">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 no-print">
            {/* CASILLA DE NOMBRE / TÍTULO */}
            <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
              <User className="w-4 h-4 text-emerald-400" />
              <input
                type="text"
                placeholder="Nombre o Título..."
                value={reportTitleName}
                onChange={(e) => setReportTitleName(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-emerald-500 w-36 md:w-44"
              />
            </div>

            {/* SELECTOR DE IDIOMA */}
            <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium text-slate-400">{t.language}</span>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="es">Español 🇪🇸</option>
                <option value="en">English 🇺🇸</option>
                <option value="fr">Français 🇫🇷</option>
              </select>
            </div>

            {/* SELECTOR DE MONEDA */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-emerald-400" /> {t.currency}
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
          </div>
        </header>

        {/* SECCIONES GEPI (ENTRADAS) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 1. INGRESOS */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold flex items-center gap-2 text-emerald-400 flex-wrap">
                <Wallet className="w-5 h-5" /> 
                {t.incomes}
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
                  {currentTotalIncomes.toLocaleString()} {activeSymbol} (100%)
                </span>
              </h2>
              <button 
                onClick={() => addItem(setIncomes, incomes, t.newIncome)}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> {t.add}
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
                {t.expenses}
                <span className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
                  {currentTotalExpenses.toLocaleString()} {activeSymbol} ({getPercentage(currentTotalExpenses)}%)
                </span>
              </h2>
              <button 
                onClick={() => addItem(setExpenses, expenses, t.newExpense)}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-rose-500/20 flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> {t.add}
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
                <ShieldAlert className="w-5 h-5" /> {t.emergency}
                <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
                  {t.monthlyContribution}: {Number(emergencyMonthly || 0).toLocaleString()} {activeSymbol} ({getPercentage(Number(emergencyMonthly || 0))}%)
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-400 mb-1">{t.currentSavings}</p>
                <input 
                  type="number" 
                  value={emergencyCurrent === '' ? '' : emergencyCurrent}
                  onChange={(e) => setEmergencyCurrent(e.target.value === '' ? '' : Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-sm text-blue-400 font-bold w-full focus:outline-none"
                />
              </div>

              {/* Selector de Meses de Emergencia (1 a 6 meses) */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-400 mb-1">{t.coverageMonths}</p>
                <select
                  value={emergencyMonths}
                  onChange={(e) => setEmergencyMonths(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-sm text-blue-400 font-bold w-full focus:outline-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6].map((m) => (
                    <option key={m} value={m}>
                      {m} {m === 1 ? t.month : t.months} ({ (currentTotalExpenses * m).toLocaleString() } {activeSymbol})
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-400 mb-1">{t.monthlyContribution}</p>
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
              <span className="text-slate-300 font-medium">{t.targetMeta} ({emergencyMonths}x Gastos):</span>
              <span className="font-bold text-blue-400">{calculatedEmergencyTarget.toLocaleString()} {activeSymbol}</span>
            </div>

            {/* Barra de progreso de emergencia basada en datos aplicados */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>{t.progress}</span>
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
                  {t.personal}
                  <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
                    {currentTotalPersonal.toLocaleString()} {activeSymbol} ({getPercentage(currentTotalPersonal)}%)
                  </span>
                </h3>
                <button onClick={() => addItem(setPersonal, personal, t.newPersonal)} className="text-amber-400 hover:text-amber-300 text-xs flex items-center gap-1 font-bold cursor-pointer">
                  <Plus className="w-3.5 h-3.5" /> {t.add}
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
                  {t.investments}
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
                    {currentTotalInvestments.toLocaleString()} {activeSymbol} ({getPercentage(currentTotalInvestments)}%)
                  </span>
                </h3>
                <button onClick={() => addItem(setInvestments, investments, t.newInvestment)} className="text-emerald-400 hover:text-emerald-300 text-xs flex items-center gap-1 font-bold cursor-pointer">
                  <Plus className="w-3.5 h-3.5" /> {t.add}
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
            <RefreshCw className="w-5 h-5 hover:rotate-180 transition-transform duration-500" /> {t.calculateBtn}
          </button>
        </div>

        {/* RESUMEN GENERAL (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{appT.totalIncomes}</p>
            <p className="text-3xl font-extrabold text-emerald-400 mt-2">{totalIncome.toLocaleString()} {appliedSymbol}</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{appT.totalOutflows}</p>
            <p className="text-3xl font-extrabold text-rose-400 mt-2">{totalOutflows.toLocaleString()} {appliedSymbol}</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{appT.netBalance}</p>
            <p className={`text-3xl font-extrabold mt-2 ${netBalance >= 0 ? 'text-blue-400' : 'text-amber-400'}`}>
              {netBalance.toLocaleString()} {appliedSymbol}
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{appT.savingsRate}</p>
            <p className="text-3xl font-extrabold text-purple-400 mt-2">
              {totalIncome > 0 ? Math.round(((totalInvestments + Number(appliedEmergencyMonthly || 0)) / totalIncome) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* GRÁFICOS INTERACTIVOS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          
          {/* Gráfico de Torta (Distribución GEPI) */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center">
            <h3 className="text-base font-bold text-slate-200 mb-4 w-full text-left">{appT.distChartTitle}</h3>
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
              <p className="text-sm text-slate-500 py-20">{appT.noData}</p>
            )}
          </div>

          {/* Gráfico de Área (Proyección Interactiva) */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-200">
                  {projectionYears === 1 ? appT.projChartTitle : `${appT.projChartTitle.split('12')[0]} ${projectionYears} ${projectionYears === 1 ? (appT.year || 'Año') : (appT.years || 'Años')}`}
                </h3>
                <p className="text-xs text-slate-400">
                  {appT.investments}: <span className="font-bold text-emerald-400">{totalInvestments.toLocaleString()} {appliedSymbol}/mes</span>
                </p>
              </div>

              {/* CONTROLES INTERACTIVOS: PORCENTAJE & AÑOS */}
              <div className="flex flex-wrap items-center gap-3 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 w-full xl:w-auto">
                {/* 1. Selector de Porcentaje Anual */}
                <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
                  <span className="text-xs font-semibold text-slate-400">{appT.returnRateLabel || 'Tasa Anual'}:</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={customReturnRate}
                    onChange={(e) => setCustomReturnRate(e.target.value === '' ? '' : Number(e.target.value))}
                    className="bg-transparent text-emerald-400 font-bold text-xs w-12 text-right focus:outline-none"
                  />
                  <span className="text-xs text-emerald-400 font-bold">%</span>
                </div>

                {/* 2. Selector de Plazo en Años */}
                <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
                  <span className="text-xs font-semibold text-slate-400">{appT.timeHorizonLabel || 'Plazo'}:</span>
                  <select
                    value={projectionYears}
                    onChange={(e) => setProjectionYears(Number(e.target.value))}
                    className="bg-transparent text-blue-400 font-bold text-xs focus:outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 5, 7, 10, 15, 20].map((y) => (
                      <option key={y} value={y} className="bg-slate-900 text-white">
                        {y} {y === 1 ? (appT.year || 'Año') : (appT.years || 'Años')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                  <XAxis dataKey="mes" stroke="#64748b" textAnchor="end" fontSize={11} interval={projectionYears > 3 ? Math.floor(totalMonths / 8) : 0} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} 
                    formatter={(value, name, item) => {
                      const isInvestment = name.toLowerCase().includes('invers');
                      const suffix = isInvestment ? item.payload.pctText : '';
                      return [`${value.toLocaleString()} ${appliedSymbol}${suffix}`, name];
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey={appT.savingsNoInvest || 'Ahorro (sin invertir)'} 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorAhorro)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey={investmentLegendLabel} 
                    stroke="#10b981" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#colorInversion)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* BOTÓN DE DESCARGA DE INFORME */}
        <div className="flex justify-end pt-4 no-print">
          <button 
            onClick={downloadPDF}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3 rounded-xl shadow-xl shadow-emerald-500/10 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-5 h-5" /> {t.downloadReport}
          </button>
        </div>

      </div>
    </div>
  );
}