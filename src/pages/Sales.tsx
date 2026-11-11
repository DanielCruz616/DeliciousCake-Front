import { useEffect, useState } from "react";

import TableCard from "../components/tables/TableCard";
import ShowWindow from "../components/tables/ShowWindow";
import TableConfirmation from "../components/tables/TableConfirmation";
import TableModal from "../components/tables/TableModal";

import { getOpenSales } from "../services/salesService";
import type { Sale } from "../types/Sales";

import "./Sales.css";

export default function Sales() {
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const [showConfirmation, setConfirmation] = useState(false);
    const [showTableModal, setTableModal] = useState(false);
    const [openSales, setOpenSales] = useState<Sale[]>([]);

    const numbers = [1, 2, 3, 4, 5];
    const occupied = openSales.length;

    async function refreshSales() {
        try {
            setOpenSales(await getOpenSales());
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        refreshSales();
    }, []);

    const selectedSale = openSales.find(
        sale => sale.tableId === selectedTable
    ) ?? null;

    const isTableOccupied = (table: number) =>
        openSales.some(sale => sale.tableId === table);

    function handleTableClick(table: number) {
        setSelectedTable(table);

        if (isTableOccupied(table)) {
            setConfirmation(false);
            setTableModal(true);
        } else {
            setTableModal(false);
            setConfirmation(true);
        }
    }

    return (
        <main className="sales-page">

            <header className="sales-heading">
                <div>
                    <h1>Sales & Tables</h1>
                    <p>Manage your tables and keep track of your orders.</p>
                </div>

                <div className="sales-counter">
                    <span>Occupied tables</span>
                    <strong>{occupied} / {numbers.length}</strong>
                    <div className="occupancy-bar">
                        <div style={{ width: `${occupied / numbers.length * 100}%` }} />
                    </div>
                </div>
            </header>

            <div className="sales-content">

                <section className="tables-panel">
                    <div className="section-heading">
                        <div>
                            <h2>Dining Area</h2>
                            <p>Select a table to manage its order.</p>
                        </div>

                        <div className="table-legend">
                            <span><i className="available-dot" /> Available</span>
                            <span><i className="occupied-dot" /> Occupied</span>
                        </div>
                    </div>

                    <div className="tables-grid">
                        {numbers.map(number => (
                            <TableCard
                                key={number}
                                number={number}
                                onClick={handleTableClick}
                                occupied={isTableOccupied(number)}
                            />
                        ))}
                    </div>
                </section>

                <aside className="window-panel">
                    <div className="section-heading">
                        <div>
                            <h2>Show Window</h2>
                            <p>Keep an eye on your shop display.</p>
                        </div>
                    </div>

                    <ShowWindow />
                </aside>

            </div>

            <TableConfirmation
                table={selectedTable}
                open={showConfirmation}
                onClose={() => setConfirmation(false)}
            />

            <TableModal
                table={selectedTable}
                open={showTableModal}
                sale={selectedSale}
                onClose={() => setTableModal(false)}
                onSaved={refreshSales}
            />

        </main>
    );
}