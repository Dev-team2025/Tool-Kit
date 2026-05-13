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
    <div className="rounded-3xl border border-teal-200/60 bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-500 p-8 text-white shadow-xl">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4 lg:w-2/3">
          <Quote className="w-7 h-7 flex-shrink-0 opacity-90 mt-1" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Quote of the Day</h3>
            <blockquote className="text-2xl font-medium mb-2 leading-relaxed">
              "{currentQuote.text}"
            </blockquote>
            <cite className="text-white/80 font-medium">— {currentQuote.author}</cite>
          </div>
        </div>

        <div className="grid gap-4 rounded-2xl bg-white/10 p-4 text-sm lg:w-1/3">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-amber-200" />
            <div>
              <div className="text-xs text-white/70">TODAY</div>
              <div className="text-sm font-semibold">{formatDate(currentTime)}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-100" />
            <div>
              <div className="text-xs text-white/70">CURRENT TIME</div>
              <div className="text-sm font-semibold">{formatTime(currentTime)}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Cloudy className="w-5 h-5 text-sky-200" />
            <div>
              <div className="text-xs text-white/70">WEATHER</div>
              <div className="text-sm font-semibold">
                {weather.temp} • {weather.condition}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-rose-200" />
            <div>
              <div className="text-xs text-white/70">LOCATION</div>
              <div className="text-sm font-semibold">
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
