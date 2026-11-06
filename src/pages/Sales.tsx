import { useEffect, useState } from "react";
import TableCard from "../components/tables/TableCard";
import ShowWindow from "../components/tables/ShowWindow"
import TableConfirmation from "../components/tables/TableConfirmation";
import { getOpenSales } from "../services/salesService";
import type { Sale } from "../types/Sales";
import TableModal from "../components/tables/TableModal";

export default function Sales() {

    const [showConfirmation, setConfirmation] = useState(false);
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const [showTableModal, setTableModal] = useState(false);
    const [openSales, setOpenSales] = useState<Sale[]>([])
    const numbers = [1, 2, 3, 4, 5];

    function handleConfirmation(number: number) {

        if (!isTableOccupied(number)) {
            setConfirmation(true);
            setSelectedTable(number);
        } else {
            setTableModal(true);
            setSelectedTable(number);
        }
    }

    function isTableOccupied(tableNumber: number) {
        return openSales.some(
            (sale) => sale.tableId === tableNumber
        );
    }


    useEffect(() => {
        getOpenSales().
        then(setOpenSales).
        catch(console.error);
    })


    return (
        <div>
            <h1>Sales</h1>
            <p>Here's your Pastry Shop, Where's your clients? ^^ </p>
            <div>
                {numbers.map((number) => (
                    <TableCard
                        key={number}
                        number={number}
                        onClick={handleConfirmation}
                        occupied={isTableOccupied(number)}
                    />
                ))}
            </div>
            <ShowWindow />
            <TableConfirmation
                table={selectedTable}
                open={showConfirmation}
                onClose={() => setConfirmation(false)}
            />
            <TableModal
                table={selectedTable}
                open={showTableModal}
                onClose={() => setTableModal(false)}
            />
        </div>
    )
}