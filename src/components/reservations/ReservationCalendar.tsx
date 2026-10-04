import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../pages/Reservations.css";

interface Props {
    date: Date;
    onDateSelect: (date: Date) => void;
}

export default function ReservationCalendar({
    date,
    onDateSelect
}: Props) {
    return (
        <div className="reservation-calendar">
            <Calendar
                selectRange={false}
                value={date}
                onChange={(value) => {
                    if (value instanceof Date) {
                        onDateSelect(value);
                    }
                }}
            />
        </div>
    );
}