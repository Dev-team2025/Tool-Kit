import { useEffect, useState, useMemo } from 'react';
import { Calendar, Cake, Sparkles, Gift } from 'lucide-react';

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
    const token = localStorage.getItem("token"); // 👈 or useContext(Auth)

    fetch("http://localhost:5000/api/employees", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` // 👈 ADD TOKEN
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Fetched employees:", data);

        // Prevent crash if backend returns an error object instead of array
        if (Array.isArray(data)) {
          setEmployees(data);
        } else {
          console.error("Invalid data:", data);
          setEmployees([]); // avoid map() error
        }

        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching employees:", err);
        setLoading(false);
      });
  }, []);

  const getUpcomingBirthdays = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const nextYear = currentYear + 1;

    return employees
      .map(employee => {
        const [month, day] = (employee.birthday || "01-01")
          .split("-")
          .map(Number);

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
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <p className="text-gray-600 text-center">Loading birthdays...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8 relative overflow-hidden">
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
        <Cake className="w-6 h-6 text-pink-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">
          Upcoming Birthdays
        </h2>
        {todaysBirthdays.length > 0 && (
          <Sparkles className="w-5 h-5 text-yellow-500 ml-2 animate-pulse" />
        )}
      </div>

      {upcomingBirthdays.length === 0 ? (
        <p className="text-gray-600 text-center py-4">
          No upcoming birthdays in the next 30 days.
        </p>
      ) : (
        <div className="space-y-3 relative z-10">
          {upcomingBirthdays.map((employee, index) => (
            <div
              key={`${employee.name}-${employee.birthday}-${index}`}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${
                employee.daysUntil === 0
                  ? "bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-100 border-yellow-300 shadow-lg animate-pulse"
                  : "bg-gradient-to-r from-pink-50 to-purple-50 border-pink-100"
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
