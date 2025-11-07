import { useState, useEffect } from 'react';
import { Quote, Calendar, Clock, Cloud, MapPin, Cloudy,} from 'lucide-react';

interface QuoteData {
  text: string;
  author: string;
}

interface WeatherData {
  temp: string;
  condition: string;
}

interface LocationData {
  city: string;
  country: string;
}

const DailyQuote = () => {
  const [currentQuote, setCurrentQuote] = useState<QuoteData>({ text: '', author: '' });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData>({ temp: 'Loading...', condition: '' });
  const [location, setLocation] = useState<LocationData>({ city: 'Loading...', country: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    fetchLocationAndWeather();
    fetchDailyQuote();

    return () => clearInterval(timeInterval);
  }, []);

  const fetchLocationAndWeather = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;

            const locationResponse = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const locationData = await locationResponse.json();

            setLocation({
              city: locationData.city || locationData.locality || 'Unknown',
              country: locationData.countryName || ''
            });

            await fetchWeatherData(latitude, longitude);
          } catch (error) {
            console.error('Error fetching location/weather:', error);
            setLocation({ city: 'Location unavailable', country: '' });
            setWeather({ temp: 'N/A', condition: 'Unavailable' });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocation({ city: 'Location unavailable', country: '' });
          setWeather({ temp: 'N/A', condition: 'Unavailable' });
        }
      );
    } else {
      setLocation({ city: 'Location not supported', country: '' });
      setWeather({ temp: 'N/A', condition: 'Unavailable' });
    }
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`
      );
      const data = await response.json();

      const temp = Math.round(data.current_weather.temperature);
      const weatherCode = data.current_weather.weathercode;

      const getWeatherCondition = (code: number) => {
        if (code === 0) return 'Clear';
        if (code <= 3) return 'Partly Cloudy';
        if (code <= 48) return 'Foggy';
        if (code <= 67) return 'Rainy';
        if (code <= 77) return 'Snowy';
        if (code <= 82) return 'Showers';
        return 'Stormy';
      };

      setWeather({
        temp: `${temp}°C`,
        condition: getWeatherCondition(weatherCode)
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeather({ temp: 'N/A', condition: 'Unavailable' });
    }
  };

  const fetchDailyQuote = async (category = "success") => {
    try {
      const today = new Date().toDateString();
      const savedQuote = localStorage.getItem(`dailyQuote_${today}_${category}`);

      if (savedQuote) {
        setCurrentQuote(JSON.parse(savedQuote));
      } else {
        const response = await fetch(`https://api.api-ninjas.com/v1/quotes?category=${category}`, { headers: { "X-Api-Key": "H7sebyWIpcvhls+7hY0Yrg==alJetwJ48ACl3hkt" }});

        if (!response.ok) throw new Error("API request failed");

        const data = await response.json();
        const quoteData = data[0]; // API returns an array

        const quote = { text: quoteData.quote, author: quoteData.author };
        setCurrentQuote(quote);
        localStorage.setItem(`dailyQuote_${today}_${category}`, JSON.stringify(quote));
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
      setCurrentQuote({
        text: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney"
      });
    } finally {
      setIsLoading(false);
    }
  };


  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-xl p-8 text-white shadow-lg mb-8">
      {/* Changed justify-between to no justify, and items-start */}
      <div className="flex items-start">
        {/* Left: Quote Section */}
        <div className="flex items-start space-x-4 w-3/4">
          <Quote className="w-7 h-7 flex-shrink-0 opacity-80 mt-1" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Quote of the Day</h3>
            <blockquote className="text-2xl font-medium mb-2 leading-relaxed">
              "{currentQuote.text}"
            </blockquote>
            <cite className="text-blue-100 font-medium">— {currentQuote.author}</cite>
          </div>
        </div>

        {/* Right: Info Section - Changed items-end to items-start, text-right to text-left */}
        <div className="flex flex-col items-start space-y-4 w-1/4 text-left ml-4"> {/* Added ml-4 for a bit of spacing */}
          {/* Date */}
          <div className="flex items-start space-x-3 justify-start"> {/* Changed justify-end to justify-start */}
            <Calendar className="w-5 h-5 text-pink-400" />
            <div>
              <div className="text-xs text-white/80">TODAY</div>
              <div className="text-sm font-large">{formatDate(currentTime)}</div>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center space-x-3 justify-start"> {/* Changed justify-end to justify-start */}
            <Clock className="w-5 h-5 text-yellow-300" />
            <div>
              <div className="text-xs text-white/80">CURRENT TIME</div>
              <div className="text-sm font-medium">{formatTime(currentTime)}</div>
            </div>
          </div>

          {/* Weather */}
          <div className="flex items-center space-x-3 justify-start"> {/* Changed justify-end to justify-start */}
            <Cloudy className="w-5 h-5 text-cyan-300" />
            <div>
              <div className="text-xs text-white/80">WEATHER</div>
              <div className="text-sm font-medium">
                {weather.temp} - {weather.condition}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-3 justify-start"
          > {/* Changed justify-end to justify-start */}
            <MapPin className="w-5 h-5 text-rose-300" />
            <div>
              <div className="text-xs text-white/80">LOCATION</div>
              <div className="text-sm font-medium">
                {location.city}{location.country && `, ${location.country}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyQuote;
