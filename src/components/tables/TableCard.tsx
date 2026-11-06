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
            <div className="table-shape">
                <span>{number}</span>
            </div>

            <h3>Mesa {number}</h3>

            <span className="table-status">
                {occupied ? "En uso" : "Disponible"}
            </span>

        </button>
    );
}