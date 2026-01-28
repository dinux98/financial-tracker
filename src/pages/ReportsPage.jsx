import React, { useContext, useState, useMemo } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { TransactionList } from '../components/TransactionList';
import { Header } from '../components/Header';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, format, parseISO, eachDayOfInterval, eachMonthOfInterval, startOfDay, endOfDay } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Download } from 'lucide-react';

export const ReportsPage = () => {
    const { transactions } = useContext(GlobalContext);
    const [range, setRange] = useState('monthly');
    const [currentDate, setCurrentDate] = useState(new Date());

    const getInterval = () => {
        const now = currentDate;
        switch (range) {
            case 'daily': return { start: startOfDay(now), end: endOfDay(now) };
            case 'weekly': return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
            case 'monthly': return { start: startOfMonth(now), end: endOfMonth(now) };
            case 'yearly': return { start: startOfYear(now), end: endOfYear(now) };
            default: return { start: startOfMonth(now), end: endOfMonth(now) };
        }
    };

    const { start, end } = getInterval();

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const tDate = parseISO(t.date);
            return isWithinInterval(tDate, { start, end });
        });
    }, [transactions, start, end]);

    const totalIncome = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    const netSavings = totalIncome - totalExpense;

    const getFormatString = () => {
        if (range === 'daily') return 'MMMM do, yyyy';
        if (range === 'weekly') return 'MMMM yyyy';
        if (range === 'monthly') return 'MMMM yyyy';
        if (range === 'yearly') return 'yyyy';
        return 'MMMM yyyy';
    };

    const prevPeriod = () => {
        const newDate = new Date(currentDate);
        if (range === 'daily') newDate.setDate(newDate.getDate() - 1);
        if (range === 'weekly') newDate.setDate(newDate.getDate() - 7);
        if (range === 'monthly') newDate.setMonth(newDate.getMonth() - 1);
        if (range === 'yearly') newDate.setFullYear(newDate.getFullYear() - 1);
        setCurrentDate(newDate);
    };

    const nextPeriod = () => {
        const newDate = new Date(currentDate);
        if (range === 'daily') newDate.setDate(newDate.getDate() + 1);
        if (range === 'weekly') newDate.setDate(newDate.getDate() + 7);
        if (range === 'monthly') newDate.setMonth(newDate.getMonth() + 1);
        if (range === 'yearly') newDate.setFullYear(newDate.getFullYear() + 1);
        setCurrentDate(newDate);
    };

    const handleDownloadPDF = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Header using colors
        doc.setFillColor(59, 130, 246); // Primary Blue
        doc.rect(0, 0, 210, 40, 'F');

        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.text("Financial Report", 14, 20);

        doc.setFontSize(12);
        doc.text(format(currentDate, getFormatString()), 14, 28);
        doc.text(`Generated on: ${format(new Date(), 'PP')}`, 14, 35);

        // Summary Section
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(16);
        doc.text("Summary", 14, 55);

        // Summary Table
        doc.autoTable({
            startY: 60,
            head: [['Description', 'Amount']],
            body: [
                ['Total Income', `Rs ${totalIncome.toLocaleString()}`],
                ['Total Expense', `Rs ${totalExpense.toLocaleString()}`],
                ['Net Savings', `${netSavings >= 0 ? '+' : ''}Rs ${netSavings.toLocaleString()}`],
            ],
            theme: 'grid',
            headStyles: { fillColor: [248, 250, 252], textColor: [71, 85, 105], fontStyle: 'bold' },
            styles: { fontSize: 12, cellPadding: 4 },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 80 },
                1: { halign: 'right' }
            }
        });

        // Transactions Section
        const finalY = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(16);
        doc.text("Transaction History", 14, finalY);

        // Transaction Table
        const tableBody = filteredTransactions.map(t => [
            t.date,
            t.text,
            t.category,
            t.type.toUpperCase(),
            `${t.type === 'income' ? '+' : '-'}Rs ${t.amount.toLocaleString()}`
        ]);

        doc.autoTable({
            startY: finalY + 5,
            head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
            body: tableBody,
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
            styles: { fontSize: 10 },
            alternateRowStyles: { fillColor: [241, 245, 249] },
        });

        doc.save(`MoneyTracker_Report_${format(currentDate, 'yyyy-MM-dd')}.pdf`);
    };

    return (
        <div className="animate-fade-in-up h-screen flex flex-col overflow-hidden">
            <Header title="Reports" subtitle="Download your financial statements" />

            <div className="flex-1 overflow-auto px-4 lg:px-6 pb-6 pt-4">
                <div className="max-w-[1000px] mx-auto space-y-6">
                    {/* Controls & PDF Download */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            {['daily', 'weekly', 'monthly', 'yearly'].map(r => (
                                <button
                                    key={r}
                                    onClick={() => setRange(r)}
                                    className={`px-4 py-2 rounded-md text-sm font-bold capitalize transition-all ${range === r ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                                <button onClick={prevPeriod} className="p-1 rounded-full hover:bg-slate-200 text-slate-500">
                                    <ChevronLeft size={18} />
                                </button>
                                <span className="font-bold text-slate-700 text-sm min-w-[140px] text-center">
                                    {format(currentDate, getFormatString())}
                                </span>
                                <button onClick={nextPeriod} className="p-1 rounded-full hover:bg-slate-200 text-slate-500">
                                    <ChevronRight size={18} />
                                </button>
                            </div>

                            <button
                                onClick={handleDownloadPDF}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
                            >
                                <Download size={18} />
                                Download PDF
                            </button>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <TrendingUp size={64} className="text-emerald-500" />
                            </div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Total Income</p>
                            <h3 className="text-3xl font-bold text-emerald-600">
                                +Rs {totalIncome.toLocaleString()}
                            </h3>
                            <div className="h-1 w-full bg-emerald-100 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-emerald-500 w-full rounded-full"></div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <TrendingDown size={64} className="text-rose-500" />
                            </div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Total Expense</p>
                            <h3 className="text-3xl font-bold text-rose-600">
                                -Rs {totalExpense.toLocaleString()}
                            </h3>
                            <div className="h-1 w-full bg-rose-100 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-rose-500 w-full rounded-full"></div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Calendar size={64} className="text-blue-500" />
                            </div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Net Savings</p>
                            <h3 className={`text-3xl font-bold ${netSavings >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {netSavings >= 0 ? '+' : '-'}Rs {Math.abs(netSavings).toLocaleString()}
                            </h3>
                            <div className={`h-1 w-full rounded-full mt-2 overflow-hidden ${netSavings >= 0 ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                                <div className={`h-full w-full rounded-full ${netSavings >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                            </div>
                        </div>
                    </div>

                    {/* Filtered List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Detailed Breakdown</h3>
                        <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            <TransactionList limit={null} customData={filteredTransactions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};