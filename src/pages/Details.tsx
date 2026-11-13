import { useEffect, useState } from "react";

import type { Sale, Period } from "../types/Sales";

import PeriodFilter from "../components/sales/PeriodFilter";
import StatisticsCards from "../components/sales/StatisticsCards";
import SalesPerformance, {
    type ChartItem
} from "../components/sales/SalesPerformance";
import TopProducts, {
    type ProductSummary
} from "../components/sales/TopProducts";
import SalesHistory from "../components/sales/SalesHistory";

import {
    formatDateInput,
    getDateOffset,
    getPeriodLabel
} from "../utils/saleUtils";

import "./Details.css";

const PAGE_SIZE = 5;

export default function Details() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);

    const [period, setPeriod] = useState<Period>("ALL");
    const [selectedDate, setSelectedDate] = useState(
        formatDateInput(new Date())
    );

    const today = formatDateInput(new Date());
    const yesterday = getDateOffset(-1);

    // Fetch sales
    useEffect(() => {
        fetch("http://localhost:8080/sales")
            .then(async response => {
                if (!response.ok) {
                    throw new Error("Failed to load sales");
                }

                const data: Sale[] = await response.json();
                setSales(data);
            })
            .catch(error => setError(error.message))
            .finally(() => setLoading(false));
    }, []);

    // Filter sales by period
    const periodSales = sales.filter(sale => {
        const saleDate = sale.createdAt;

        switch (period) {
            case "TODAY":
                return saleDate === today;

            case "YESTERDAY":
                return saleDate === yesterday;

            case "7D":
                return saleDate >= getDateOffset(-6) &&
                    saleDate <= today;

            case "30D":
                return saleDate >= getDateOffset(-29) &&
                    saleDate <= today;

            case "DATE":
                return saleDate === selectedDate;

            default:
                return true;
        }
    });

    // Statistics
    const paidSales = periodSales.filter(
        sale => sale.status === "PAID"
    );

    const totalRevenue = paidSales.reduce(
        (sum, sale) => sum + sale.total,
        0
    );

    const averageSale = paidSales.length
        ? totalRevenue / paidSales.length
        : 0;

    const productsSold = paidSales.reduce(
        (sum, sale) =>
            sum + (sale.details ?? []).reduce(
                (quantity, detail) => quantity + detail.quantity,
                0
            ),
        0
    );

    // Top products
    const productMap = new Map<number, ProductSummary>();

    paidSales.forEach(sale => {
        (sale.details ?? []).forEach(detail => {
            const current = productMap.get(detail.productId);

            productMap.set(detail.productId, {
                id: detail.productId,
                name: detail.productName?.trim()
                    || current?.name
                    || `Product #${detail.productId}`,
                quantity: (current?.quantity ?? 0) + detail.quantity
            });
        });
    });

    const topProducts = [...productMap.values()]
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

    // Sales chart
    const dailySales: ChartItem[] = [];

    if (period === "ALL") {
        // Last 7 months
        for (let index = 6; index >= 0; index--) {
            const date = new Date();
            date.setDate(1);
            date.setMonth(date.getMonth() - index);

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");

            const monthSales = paidSales.filter(sale =>
                sale.createdAt.startsWith(`${year}-${month}`)
            );

            dailySales.push({
                label: date.toLocaleDateString("en-US", {
                    month: "short"
                }),
                count: monthSales.length,
                revenue: monthSales.reduce(
                    (sum, sale) => sum + sale.total,
                    0
                )
            });
        }
    } else if (period === "7D" || period === "30D") {
        // Last 7 or 30 days
        const numberOfDays = period === "7D" ? 7 : 30;

        for (let index = numberOfDays - 1; index >= 0; index--) {
            const dateKey = getDateOffset(-index);

            const daySales = paidSales.filter(
                sale => sale.createdAt === dateKey
            );

            dailySales.push({
                label: dateKey.slice(-2),
                count: daySales.length,
                revenue: daySales.reduce(
                    (sum, sale) => sum + sale.total,
                    0
                )
            });
        }
    } else {
        // Today, yesterday or selected date
        const targetDate = period === "TODAY"
            ? today
            : period === "YESTERDAY"
                ? yesterday
                : selectedDate;

        const targetSales = paidSales.filter(
            sale => sale.createdAt === targetDate
        );

        dailySales.push({
            label: targetDate,
            count: targetSales.length,
            revenue: targetSales.reduce(
                (sum, sale) => sum + sale.total,
                0
            )
        });
    }

    // Sales history
    const filteredSales = [...sales]
        .filter(sale => sale.id.toString().includes(search))
        .filter(sale => status === "ALL" || sale.status === status)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)
            || b.id - a.id);

    const totalPages = Math.ceil(filteredSales.length / PAGE_SIZE);

    const paginatedSales = filteredSales.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    // Keep current page valid
    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) {
            setCurrentPage(totalPages);
        }

        if (totalPages === 0 && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    return (
        <main className="details-page">

            {/* Header */}
            <header className="details-heading">
                <div>
                    <span className="details-subtitle">
                        PASTRY SHOP MANAGEMENT
                    </span>

                    <h1>Sales Details</h1>

                    <p>
                        Review your sales performance and order history.
                    </p>
                </div>

                <div className="details-summary">
                    <span>Total Revenue</span>
                    <strong>${totalRevenue.toFixed(2)}</strong>
                    <small>{getPeriodLabel(period)}</small>
                </div>
            </header>

            {/* Period selector */}
            <PeriodFilter
                period={period}
                selectedDate={selectedDate}
                onPeriodChange={setPeriod}
                onDateChange={setSelectedDate}
            />

            {/* Statistics */}
            <StatisticsCards
                paidSales={paidSales.length}
                averageSale={averageSale}
                productsSold={productsSold}
                totalSales={periodSales.length}
            />

            {/* Charts */}
            <section className="statistics-charts">
                <SalesPerformance
                    data={dailySales}
                    periodLabel={getPeriodLabel(period)}
                />

                <TopProducts products={topProducts} />
            </section>

            {/* Sales history */}
            <SalesHistory
                sales={paginatedSales}
                loading={loading}
                error={error}
                search={search}
                status={status}
                currentPage={currentPage}
                totalPages={totalPages}
                onSearchChange={value => {
                    setSearch(value);
                    setCurrentPage(1);
                }}
                onStatusChange={value => {
                    setStatus(value);
                    setCurrentPage(1);
                }}
                onPageChange={setCurrentPage}
            />

        </main>
    );
}