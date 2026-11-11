import "./TableCard.css";

interface Props{
    number: number;
    occupied: boolean;
    onClick: (table:number) => void;
}

export default function TableCard({number, onClick, occupied}: Props ){

    return (
        <button
            className={`table-card ${occupied ? "occupied" : "available"}`}
            onClick={() => onClick(number)}
        >

            <h3>Mesa {number}</h3>

            <p className="table-status">
                {occupied ? "En uso" : "Disponible"}
            </p>

        </button>
    );
}
