import { NextResponse } from "next/server";

const SEOUL_LAT = 37.5665;
const SEOUL_LON = 126.978;

type OpenMeteoResponse = {
  current?: {
    temperature_2m: number;
    apparent_temperature: number;
    weather_code: number;
  };
};

// WMO weather codes (used by Open-Meteo) mapped to a Korean label + a
// lucide-react icon name the widget can look up.
const WEATHER_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: "맑음", icon: "Sun" },
  1: { label: "대체로 맑음", icon: "CloudSun" },
  2: { label: "구름 조금", icon: "CloudSun" },
  3: { label: "흐림", icon: "Cloud" },
  45: { label: "안개", icon: "CloudFog" },
  48: { label: "안개", icon: "CloudFog" },
  51: { label: "이슬비", icon: "CloudDrizzle" },
  53: { label: "이슬비", icon: "CloudDrizzle" },
  55: { label: "이슬비", icon: "CloudDrizzle" },
  56: { label: "언 이슬비", icon: "CloudDrizzle" },
  57: { label: "언 이슬비", icon: "CloudDrizzle" },
  61: { label: "비", icon: "CloudRain" },
  63: { label: "비", icon: "CloudRain" },
  65: { label: "강한 비", icon: "CloudRain" },
  66: { label: "언 비", icon: "CloudRain" },
  67: { label: "언 비", icon: "CloudRain" },
  71: { label: "눈", icon: "CloudSnow" },
  73: { label: "눈", icon: "CloudSnow" },
  75: { label: "강한 눈", icon: "CloudSnow" },
  77: { label: "싸락눈", icon: "CloudSnow" },
  80: { label: "소나기", icon: "CloudRain" },
  81: { label: "소나기", icon: "CloudRain" },
  82: { label: "강한 소나기", icon: "CloudRain" },
  85: { label: "눈 소나기", icon: "CloudSnow" },
  86: { label: "눈 소나기", icon: "CloudSnow" },
  95: { label: "뇌우", icon: "CloudLightning" },
  96: { label: "뇌우·우박", icon: "CloudLightning" },
  99: { label: "뇌우·우박", icon: "CloudLightning" },
};

export async function GET() {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${SEOUL_LAT}&longitude=${SEOUL_LON}` +
    "&current=temperature_2m,apparent_temperature,weather_code&timezone=Asia%2FSeoul";

  const response = await fetch(url, {
    // Weather doesn't need to be second-fresh for a portfolio widget.
    next: { revalidate: 1800 },
  });

  if (!response.ok) {
    return NextResponse.json({ error: "날씨 API 요청에 실패했습니다." }, { status: 502 });
  }

  const payload: OpenMeteoResponse = await response.json();
  const current = payload.current;
  if (!current) {
    return NextResponse.json({ error: "날씨 데이터를 불러오지 못했습니다." }, { status: 502 });
  }

  const weather = WEATHER_CODES[current.weather_code] ?? {
    label: "알 수 없음",
    icon: "CloudSun",
  };

  return NextResponse.json({
    temp: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    condition: weather.label,
    icon: weather.icon,
  });
}
