"use client";

import { useState, ChangeEvent, FormEvent, Component } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";  
import { CloudIcon, MapPinIcon, ThermometerIcon, ThermometerSunIcon } from 'lucide-react';


interface WeatherData {
    temperature: number;
    description: string;
    location: string;
    unit: string;
}

export default function WheatherWidget() {
    const [location, setLocation] = useState<string>("")
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState<String | null>(null);
    const [isloading, setIsLoading] = useState<boolean>(false)

    const handleSearch = async (e: FormEvent<HTMLFormElement> ) => {
        e.preventDefault();                                                   // usi page pr rhte hue result ajaye (means refresh nhi krn barega)

        const trimLocation = location.trim();                                  // Jo bh extra spaces ho to wo trim k through finish hojaye.
        if (trimLocation === "") {
            setError("Please Enter a Valid Location");
            setWeather(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try{
           const Response = await fetch(
            `http://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WHEATHER_API_KEYS}&q=${trimLocation}`
           );

           if(!Response.ok) {
            throw new Error("City not found.")
           };

           const data = await Response.json();                                         // ya isliye k jo bh raw data ho usko json format mein convert krde.
           const weatherdata: WeatherData = {                                          // yahn hum weather data obj bna rahe hai
            temperature: data.current.temp_c,
            description: data.current.condition.text,
            location: data.location.name,
            unit: "C",
           }
           setWeather(weatherdata);                                                    // ya func hai react k state ko update krne k liye.jisse fetch data ko ui mein display karenge

        }catch(error){
           setError("City not found. Please try again.")
           setWeather(null)

        }finally {                                                                      // error aye ya nw aye ya hamesha chalega
           setIsLoading(false);
        }
    };

    // TEMPERATURE :
    function getTemperatureMessage ( temperature: number, unit: string ): string {
            
        if(unit == "C") {
            if(temperature < 0){
                return `It's freezing at ${temperature}°C! Bundle up!`
            }else if(temperature < 10){
                return `It's quite cold at ${temperature}°C. Wear Warm Clothes`
            }else if(temperature < 20){
                return `The temperature is ${temperature}°C. Comfortable for a light Jacket.`
            }else if(temperature < 30){
                return `It's a pleasent ${temperature}°C. Enjoy the weather!`
            }else {
                return `It's hot  ${temperature}°C. Stay hydrated!`;
            }

            } else {
                return `${temperature}° ${unit}`
            }
        }

    // DESCRIPTION :
    function getWeatherMessage ( description: string ): string {
        switch(description.toLocaleLowerCase()) {
       
            case "sunny":
                return "It's a bright and sunny day! Perfect for outdoor activities.";
        
            case "cloudy":
                return "It's partly cloudy. You might want to keep an umbrella just in case.";
        
            case "overcast":
                return "The sky is overcast with heavy clouds. Rain might be on the way.";
        
            case "rain":
                return "It's raining outside. Don't forget to take an umbrella!";
        
            case "thunderstorm":
                return "There's a thunderstorm. Better to stay indoors and stay safe.";
        
            case "snow":
                return "It's snowing! Time to get cozy or enjoy the snow outside.";
        
            case "fog":
                return "It's foggy, visibility is low. Drive carefully!";
        
            case "windy":
                return "It's quite windy today. Hold on to your hats!";
        
            case "drizzle":
                return "Light drizzles outside. A pleasant walk if you don't mind getting a little wet.";
        
            default:
                return description;
            }
        }

    // LOCATION :
    function getLocationMessage ( location:string ): string {
        const currentHour = new Date().getHours();
        const isNight = currentHour >= 18 || currentHour < 6;
        return `${location} ${isNight? "at Night" : "During the Day"}`
    }


    return (
        <div className="flex justify-center items-center bg-cover bg-center h-screen bg-gradient-to-br from-gray-300 to-gray-500">
        <Card className="w-full max-w-sm mx-auto text-center bg-opacity-70 border border-[#4682B4] shadow-lg shadow-[#4682B4]shadow-lg rounded-lg bg-gradient-to-br from-[#ab61ec] to-[#bc7af3]">

            <CardHeader>
                <CardTitle className="text-white"> Weather Widget </CardTitle>
                <CardDescription className="text-yellow-200"> A weather widget provides real-time updates on temperature and weather conditions for a selected location. </CardDescription>
            </CardHeader>

           <CardContent>
              <form onSubmit={handleSearch} className='flex items-center gap-2'>
                <Input className="border-[#f8ff3b]"
                type='text'
                placeholder='Enter a city name'
                value={location}
                onChange={(e) => setLocation(e.target.value)}    
                />

                <Button type="submit" disabled={isloading} className=" bg-[#ffd334]  hover:bg-[#e0f56a] text-white">
                    {isloading ? "loading..." : "Search"}
                </Button>
            </form>

            {error && <div className="mt-4 text-red-500"> {error} </div>}
            {weather && (
                <div className='mt-4 grid gap-2 text-white'>
                    <div className='flex items-center gap-2'> 
                        <ThermometerIcon className="w-6 h-6 text-red-500" />
                        {getTemperatureMessage (weather.temperature, weather.unit)}
                    </div>

                    <div className='flex items-center gap-2'> 
                        <CloudIcon className="w-6 h-6 text-blue-800"/>
                        {getWeatherMessage (weather.description)}
                    </div>

                    <div className='flex items-center gap-2'> 
                        <MapPinIcon className="w-6 h-6 text-yellow-300" />
                        {getLocationMessage (weather.location)}
                    </div>
                </div>
               )}
             </CardContent>
        </Card>
    </div>
  )
}