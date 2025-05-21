import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  addMonths,
} from "date-fns";
import { es } from "date-fns/locale";

interface DateRangePickerProps {
  onSelectRange: (startDate: string, endDate: string) => void;
  onClose: () => void;
}

export const DateRangePicker = ({
  onSelectRange,
  onClose,
}: DateRangePickerProps) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<Date>(today);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDayClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      // Si no hay fecha de inicio o ambas fechas están seleccionadas, establecer nueva fecha de inicio
      setStartDate(day);
      setEndDate(null);
    } else {
      // Si la fecha es anterior a la fecha de inicio, intercambiar
      if (day < startDate) {
        setEndDate(startDate);
        setStartDate(day);
      } else {
        setEndDate(day);
      }
    }
  };

  const getMonthDays = () => {
    const firstDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );

    // Obtener el día de la semana del primer día (0 = domingo, 1 = lunes, etc.)
    let firstDay = firstDayOfMonth.getDay();
    if (firstDay === 0) firstDay = 7; // Considerar domingo como día 7

    const daysInMonth = lastDayOfMonth.getDate();
    const days: Array<Date | null> = [];

    // Añadir espacios vacíos para los días anteriores al primer día del mes
    for (let i = 1; i < firstDay; i++) {
      days.push(null);
    }

    // Añadir los días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      );
    }

    return days;
  };

  const isDaySelected = (day: Date) => {
    if (!startDate && !endDate) return false;
    if (startDate && !endDate) return day.getTime() === startDate.getTime();
    if (startDate && endDate) {
      return (
        day.getTime() === startDate.getTime() ||
        day.getTime() === endDate.getTime() ||
        (day > startDate && day < endDate)
      );
    }
    return false;
  };

  const isDayStart = (day: Date) => {
    return startDate && day.getTime() === startDate.getTime();
  };

  const isDayEnd = (day: Date) => {
    return endDate && day.getTime() === endDate.getTime();
  };

  const dayClasses = (day: Date | null) => {
    if (!day) return "invisible";

    let classes = "h-8 w-8 flex items-center justify-center rounded-full";

    if (isDaySelected(day)) {
      if (isDayStart(day) && !endDate) {
        classes += " bg-purple-600 text-white";
      } else if (isDayStart(day)) {
        classes += " bg-purple-600 text-white rounded-l-full rounded-r-none";
      } else if (isDayEnd(day)) {
        classes += " bg-purple-600 text-white rounded-r-full rounded-l-none";
      } else {
        classes += " bg-purple-100 text-purple-800";
      }
    } else {
      classes += " hover:bg-gray-200 text-gray-700";
    }

    if (day.getTime() === today.getTime() && !isDaySelected(day)) {
      classes += " border border-purple-400";
    }

    return classes;
  };

  const months = [
    "Este mes",
    "Último mes",
    "Últimos 3 meses",
    "Últimos 6 meses",
    "Este año",
  ];

  const handleQuickSelect = (option: string) => {
    const now = new Date();
    let start: Date, end: Date;

    switch (option) {
      case "Este mes":
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case "Último mes":
        start = startOfMonth(subMonths(now, 1));
        end = endOfMonth(subMonths(now, 1));
        break;
      case "Últimos 3 meses":
        start = startOfMonth(subMonths(now, 2));
        end = endOfMonth(now);
        break;
      case "Últimos 6 meses":
        start = startOfMonth(subMonths(now, 5));
        end = endOfMonth(now);
        break;
      case "Este año":
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        start = startOfMonth(now);
        end = endOfMonth(now);
    }

    setStartDate(start);
    setEndDate(end);
  };

  const applySelection = () => {
    if (startDate && endDate) {
      onSelectRange(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );
      onClose();
    }
  };

  const days = getMonthDays();
  const weekDays = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Seleccionar período
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={handlePrevMonth}
              className="p-1 text-gray-600 hover:text-gray-900"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </button>
            <h3 className="text-lg font-medium text-gray-800">
              {format(currentMonth, "MMMM yyyy", { locale: es })}
            </h3>
            <button
              onClick={handleNextMonth}
              className="p-1 text-gray-600 hover:text-gray-900"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {weekDays.map((day, index) => (
              <div
                key={index}
                className="text-gray-500 text-xs font-medium py-1"
              >
                {day}
              </div>
            ))}

            {days.map((day, index) => (
              <div
                key={index}
                className="flex justify-center items-center p-1"
                onClick={() => day && handleDayClick(day)}
              >
                {day && (
                  <div className={dayClasses(day)}>
                    <span>{day.getDate()}</span>
                  </div>
                )}
                {!day && <div className="invisible">X</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Rangos rápidos:
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {months.map((month) => (
              <button
                key={month}
                onClick={() => handleQuickSelect(month)}
                className="py-2 px-3 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800"
              >
                {month}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Fecha inicio:</p>
              <p className="font-medium">
                {startDate ? format(startDate, "dd/MM/yyyy") : "-"}
              </p>
            </div>
            <div className="text-center text-gray-400">hasta</div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Fecha fin:</p>
              <p className="font-medium">
                {endDate ? format(endDate, "dd/MM/yyyy") : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={applySelection}
            disabled={!startDate || !endDate}
            className={`px-4 py-2 rounded-lg ${
              !startDate || !endDate
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            } transition-colors`}
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};
