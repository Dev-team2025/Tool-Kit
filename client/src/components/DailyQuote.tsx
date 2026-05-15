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
  const apiNinjasKey = import.meta.env.VITE_API_NINJAS_KEY;

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
        if (!apiNinjasKey) {
          throw new Error("Missing API Ninjas key");
        }

        const response = await fetch(
          `https://api.api-ninjas.com/v1/quotes?category=${category}`,
          { headers: { "X-Api-Key": apiNinjasKey } }
        );

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`API request failed (${response.status}): ${errorBody}`);
        }

        const data = await response.json();
        const quoteData = data[0]; // API returns an array

        const quote = { text: quoteData.quote, author: quoteData.author };
        setCurrentQuote(quote);
        localStorage.setItem(`dailyQuote_${today}_${category}`, JSON.stringify(quote));
      }
    } catch (error) {
      console.log('Error fetching quote:', error);
      // Fallback quotes array for variety
      const fallbackQuotes = [
        {
          text: "The way to get started is to quit talking and begin doing.",
          author: "Walt Disney"
        },
        {
          text: "Innovation distinguishes between a leader and a follower.",
          author: "Steve Jobs"
        },
        {
          text: "The only way to do great work is to love what you do.",
          author: "Steve Jobs"
        },
        {
          text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
          author: "Winston Churchill"
        }
      ];
      
      // Select a random fallback quote
      const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
      setCurrentQuote(fallbackQuotes[randomIndex]);
    } finally {
      setIsLoading(false);
    }
  };


  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary to-primary/90 p-6 sm:p-8 text-white shadow-xl">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Quote Section */}
        <div className="flex-1 flex items-start gap-4">
          <div className="flex-shrink-0">
            <Quote className="w-8 h-8 opacity-80" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-90 mb-3">Quote of the Day</p>
            <blockquote className="text-lg sm:text-xl font-medium leading-relaxed mb-3">
              "{currentQuote.text}"
            </blockquote>
            <cite className="text-sm text-white/90 font-medium not-italic">— {currentQuote.author}</cite>
          </div>
        </div>

        {/* Info Cards */}
        <div className="lg:w-80 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-white/10 backdrop-blur-sm p-3 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-amber-200" />
              <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">Today</span>
            </div>
            <p className="text-xs font-medium leading-tight">{formatDate(currentTime)}</p>
          </div>

          <div className="rounded-lg bg-white/10 backdrop-blur-sm p-3 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-200" />
              <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">Time</span>
            </div>
            <p className="text-xs font-medium">{formatTime(currentTime)}</p>
          </div>

          <div className="rounded-lg bg-white/10 backdrop-blur-sm p-3 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Cloudy className="w-4 h-4 text-sky-200" />
              <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">Weather</span>
            </div>
            <p className="text-xs font-medium">{weather.temp} • {weather.condition}</p>
          </div>

          <div className="rounded-lg bg-white/10 backdrop-blur-sm p-3 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-rose-200" />
              <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">Location</span>
            </div>
            <p className="text-xs font-medium truncate">
              {location.city}{location.country && `, ${location.country}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyQuote;
