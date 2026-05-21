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
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 relative overflow-hidden shadow-sm">
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

      <div className="flex items-center gap-2 mb-5 relative z-10">
        <Cake className="w-5 h-5 text-pink-500" />
        <h2 className="text-lg font-display font-bold text-gray-900">
          Upcoming Birthdays
        </h2>
        {todaysBirthdays.length > 0 && (
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
        )}
      </div>

      {upcomingBirthdays.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
          <Cake className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No upcoming birthdays in the next 30 days</p>
        </div>
      ) : (
        <div className="space-y-3 relative z-10">
          {upcomingBirthdays.map((employee, index) => (
            <div
              key={`${employee.name}-${employee.birthday}-${index}`}
              className={`flex items-center justify-between gap-4 rounded-lg border-2 p-4 transition-all duration-200 ${
                employee.daysUntil === 0
                  ? "bg-gradient-to-r from-pink-50 to-amber-50 border-pink-200 shadow-md"
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ${
                    employee.daysUntil === 0
                      ? "bg-gradient-to-br from-pink-500 to-amber-500 animate-bounce shadow-lg"
                      : "bg-gradient-to-br from-primary to-primary/80 shadow-md"
                  }`}
                >
                  {employee.daysUntil === 0
                    ? "🎂"
                    : employee.avatar || employee.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={`font-semibold truncate ${
                        employee.daysUntil === 0
                          ? "text-pink-900"
                          : "text-gray-900"
                      }`}
                    >
                      {employee.name}
                    </p>
                    {employee.daysUntil === 0 && (
                      <span className="text-sm animate-bounce">🎉</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {employee.department}
                  </p>
                  {employee.daysUntil === 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <Gift className="w-3 h-3 text-pink-600" />
                      <span className="text-xs font-medium text-pink-600">Happy Birthday! 🎊</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1.5 text-pink-600 font-semibold text-sm">
                  <Calendar className="w-4 h-4" />
                  {employee.daysUntil === 0 && (
                    <span className="text-pink-700 font-bold">
                      Today!
                    </span>
                  )}
                  {employee.daysUntil === 1 && <span>Tomorrow</span>}
                  {employee.daysUntil > 1 && (
                    <span>{employee.daysUntil} days</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {employee.date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric"
                  })}
                </p>
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
