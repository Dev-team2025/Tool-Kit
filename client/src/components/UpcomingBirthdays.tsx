import { useEffect, useState, useMemo } from 'react';
import { Calendar, Cake, Sparkles, Gift } from 'lucide-react';
import { supabase } from "@/lib/supabaseClient";

interface Employee {
  name: string;
  department: string;
  birthday: string; 
  avatar?: string;
}

const UpcomingBirthdays = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadEmployees = async () => {
      const { data, error } = await supabase
        .from("employees")
        .select("name, department, birthday, avatar");

      if (!isMounted) return;

      if (error) {
        console.error("Error fetching employees:", error.message);
        setEmployees([]);
        setLoading(false);
        return;
      }

      setEmployees(Array.isArray(data) ? data : []);
      setLoading(false);
    };

    loadEmployees();

    return () => {
      isMounted = false;
    };
  }, []);

  const getUpcomingBirthdays = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const nextYear = currentYear + 1;

    const parseBirthday = (birthday?: string) => {
      if (!birthday) return null;

      const trimmed = birthday.trim();
      if (!trimmed) return null;

      const parts = trimmed
        .split(/[-/]/)
        .map(part => Number(part))
        .filter(part => !Number.isNaN(part));

      if (parts.length >= 2) {
        let month = 0;
        let day = 0;

        if (parts.length >= 3) {
          const first = parts[0];
          const last = parts[2];

          if (first > 31 || String(first).length === 4) {
            month = parts[1];
            day = parts[2];
          } else if (last > 31 || String(last).length === 4) {
            month = parts[0];
            day = parts[1];
          } else {
            month = parts[0];
            day = parts[1];
          }
        } else {
          if (parts[0] > 12 && parts[1] <= 12) {
            day = parts[0];
            month = parts[1];
          } else {
            month = parts[0];
            day = parts[1];
          }
        }

        if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          return { month, day };
        }
      }

      const parsedDate = new Date(trimmed);
      if (!Number.isNaN(parsedDate.getTime())) {
        return {
          month: parsedDate.getUTCMonth() + 1,
          day: parsedDate.getUTCDate(),
        };
      }

      return null;
    };

    return employees
      .map(employee => {
        const parsed = parseBirthday(employee.birthday);
        const month = parsed?.month ?? 1;
        const day = parsed?.day ?? 1;

        let birthdayThisYear = new Date(currentYear, month - 1, day);

        if (birthdayThisYear < today) {
          birthdayThisYear = new Date(nextYear, month - 1, day);
        }

        const daysUntil = Math.ceil(
          (birthdayThisYear.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        return {
          ...employee,
          daysUntil,
          date: birthdayThisYear
        };
      })
      .filter(e => e.daysUntil <= 30)
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 4);
  };

  const upcomingBirthdays = useMemo(() => getUpcomingBirthdays(), [employees]);
  const todaysBirthdays = useMemo(
    () => upcomingBirthdays.filter(emp => emp.daysUntil === 0),
    [upcomingBirthdays]
  );

  if (loading) {
    return (
      <div className="bg-white/80 rounded-2xl shadow-sm border border-gray-200/80 p-6">
        <p className="text-gray-600 text-center">Loading birthdays...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 rounded-2xl shadow-sm border border-gray-200/80 p-6 relative overflow-hidden">
      {todaysBirthdays.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="confetti-container">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: [
                    "#ff69b4",
                    "#ffd700",
                    "#ff6347",
                    "#98fb98",
                    "#87ceeb"
                  ][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center mb-4 relative z-10">
        <Cake className="w-6 h-6 text-rose-500 mr-2" />
        <h2 className="text-xl font-display text-gray-900">
          Upcoming Birthdays
        </h2>
        {todaysBirthdays.length > 0 && (
          <Sparkles className="w-5 h-5 text-amber-400 ml-2 animate-pulse" />
        )}
      </div>

      {upcomingBirthdays.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-600">
          No upcoming birthdays in the next 30 days.
        </div>
      ) : (
        <div className="space-y-3 relative z-10">
          {upcomingBirthdays.map((employee, index) => (
            <div
              key={`${employee.name}-${employee.birthday}-${index}`}
              className={`flex flex-col gap-3 rounded-xl border p-4 transition-all duration-300 sm:flex-row sm:items-center sm:justify-between ${
                employee.daysUntil === 0
                  ? "bg-gradient-to-r from-amber-100 via-rose-100 to-orange-100 border-amber-200 shadow-lg"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3 ${
                    employee.daysUntil === 0
                      ? "bg-gradient-to-br from-yellow-500 to-pink-500 animate-bounce"
                      : "bg-gradient-to-br from-pink-500 to-purple-500"
                  }`}
                >
                  {employee.daysUntil === 0
                    ? "🎂"
                    : employee.avatar || employee.name[0]}
                </div>
                <div>
                  <div
                    className={`font-medium ${
                      employee.daysUntil === 0
                        ? "text-pink-800 text-lg"
                        : "text-gray-800"
                    }`}
                  >
                    {employee.name}
                    {employee.daysUntil === 0 && (
                      <span className="ml-2 text-sm animate-bounce">🎉</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {employee.department}
                  </div>
                  {employee.daysUntil === 0 && (
                    <div className="text-sm font-medium text-pink-700 animate-pulse flex items-center mt-1">
                      <Gift className="w-3 h-3 mr-1" />
                      Happy Birthday! 🎊
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end text-pink-600 font-medium">
                  <Calendar className="w-4 h-4 mr-1" />
                  {employee.daysUntil === 0 && (
                    <span className="text-pink-700 font-bold text-lg animate-pulse">
                      Today! 🎉
                    </span>
                  )}
                  {employee.daysUntil === 1 && <span>Tomorrow</span>}
                  {employee.daysUntil > 1 && (
                    <span>{employee.daysUntil} days</span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {employee.date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric"
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .confetti-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .confetti {
          position: absolute;
          width: 8px;
          height: 8px;
          animation: confetti-fall 3s linear infinite;
        }
        @keyframes confetti-fall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default UpcomingBirthdays;
