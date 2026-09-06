// Centralized portfolio data — used by the terminal CLI and the world map.
// Visual sections use literal text (editable via the Base44 editor), so this
// file is the source of truth only for the terminal and map coordinates.

export const PROFILE = {
  name: "DARIUS NISTOR",
  handle: "ABYSS.SYS",
  tagline: "AI & robotics enthusiast",
};

export const ABOUT = {
  title: "The !=visible Engine",
  paragraphs: [
    "I'm an AI and robotics engineer who lives in the space between data and cognition. My main focus is robotics, AI, electronics, and design — building intelligent systems that sense, think, and move.",
    "I design intelligent systems, ship predictive pipelines, and treat every model as a living instrument. I build for durability, document like a paranoid, and optimize every process I touch.",
  ],
};

export const STATS = [
  { id: "01", label: "Projects Completed", value: "9" },
  { id: "02", label: "Certificates", value: "47" },
  { id: "03", label: "Skills", value: "90" },
];

export const DOMAINS = [
  { id: "AI", status: "ACTIVE" },
  { id: "ENGINEERING", status: "ACTIVE" },
  { id: "ROBOTICS", status: "ACTIVE" },
  { id: "ELECTRONICS", status: "ACTIVE" },
  { id: "TECH", status: "ACTIVE" },
];

export const GITHUB_URL = "https://github.com/nistordarius26h-ship-it";
export const LINKEDIN_URL =
  "https://www.linkedin.com/in/darius-nistor-3292783b1/";
export const CONTACT_EMAIL = "nistordarius26h@gmail.com";
export const GITHUB_USER = "nistordarius26h-ship-it";

// Three main featured GitHub projects.
export const PROJECTS = [
  {
    id: "gaairobot",
    title: "GAAI Robot",
    repo: "gaairobot",
    description:
      "Globally accessible AI robot you can control from anywhere. Home server in Brasov, edge nodes worldwide.",
  },
  {
    id: "aistallpredictionsystem",
    title: "AI Stall Prediction System",
    repo: "aistallpredictionsystem",
    description:
      "Predictive analytics system forecasting stall conditions from real-time sensor and telemetry data.",
  },
  {
    id: "esp32jamm",
    title: "ESP32 JAMM",
    repo: "esp32jamm",
    description:
      "ESP32-based research and signal tooling for controlled RF testing.",
  },
];

export const SKILL_GROUPS = [
  {
    id: "01",
    title: "AI & Data",
    skills: [
      "Artificial Intelligence (AI)",
      "Generative AI",
      "Large Language Models (LLMs)",
      "Data Analysis",
      "Data Visualization",
      "Business Intelligence",
      "Python",
    ],
  },
  {
    id: "02",
    title: "Cloud & Security",
    skills: [
      "Amazon Web Services (AWS)",
      "Cybersecurity",
      "Risk Management",
      "Git & GitHub",
      "Open Source Software",
    ],
  },
  {
    id: "03",
    title: "Professional",
    skills: [
      "Process Optimization",
      "Critical Thinking",
      "Problem Solving",
      "Analytical Thinking",
      "Professional Communication",
      "AI Productivity Tools (Microsoft 365 Copilot)",
      "Web Technologies (HTML)",
      "Digital Marketing",
    ],
  },
  {
    id: "04",
    title: "Engineering & Robotics",
    skills: [
      "Mechatronics",
      "ElectricalEngineering",
      "Automation",
      "Robotics",
      "CircuitDesign",
      "Instrumentation",
      "Microcontrollers",
      "Sensors",
      "ControlSystems",
      "CAD(Computer-Aided Design)",
      "SolidWorks",
      "Fusion360",
    ],
  },
];

export const CERTIFICATES = [
  { id: "CRT-01", name: "Google AI Professional Certificate", issuer: "Google" },
  {
    id: "CRT-02",
    name: "Google AI Essentials Specialization Certificate",
    issuer: "Google",
  },
  {
    id: "CRT-03",
    name: "CS50's Introduction to Programming with Python",
    issuer: "Harvard University",
  },
  { id: "CRT-04", name: "Diploma in Mechatronics", issuer: "Alison" },
  { id: "CRT-05", name: "Electrical Engineering Certificate", issuer: "CURSA" },
  {
    id: "CRT-06",
    name: "Career Essentials in Generative AI",
    issuer: "Microsoft & LinkedIn",
  },
  { id: "CRT-07", name: "AI for Business Professionals", issuer: "HP LIFE" },
  { id: "CRT-08", name: "Open Source Foundations", issuer: "IBM" },
  {
    id: "CRT-09",
    name: "Basics of Cyber Law",
    issuer: "Cambridge International Qualifications / UniAthena",
  },
  { id: "CRT-10", name: "Claude Code 101", issuer: "DataCamp" },
];

export const SOCIALS = [
  { label: "LINKEDIN", href: LINKEDIN_URL, icon: "linkedin" },
  { label: "EMAIL", href: "mailto:" + CONTACT_EMAIL, icon: "mail" },
  { label: "GITHUB", href: GITHUB_URL, icon: "github" },
];

// Global AI robot latency map — Brasov is the home server (50ms).
export const MAP_LOCATIONS = [
  { country: "Romania", city: "Brasov", coords: [45.6427, 25.5887], ms: 50, home: true },
  { country: "Germany", city: "Berlin", coords: [52.52, 13.4], ms: 28 },
  { country: "United Kingdom", city: "London", coords: [51.5, -0.12], ms: 33 },
  { country: "France", city: "Paris", coords: [48.85, 2.35], ms: 35 },
  { country: "Spain", city: "Madrid", coords: [40.41, -3.7], ms: 48 },
  { country: "Sweden", city: "Stockholm", coords: [59.33, 18.07], ms: 40 },
  { country: "Russia", city: "Moscow", coords: [55.75, 37.62], ms: 60 },
  { country: "Egypt", city: "Cairo", coords: [30.04, 31.23], ms: 90 },
  { country: "UAE", city: "Abu Dhabi", coords: [24.45, 54.37], ms: 130 },
  { country: "India", city: "New Delhi", coords: [28.61, 77.2], ms: 180 },
  { country: "Singapore", city: "Singapore", coords: [1.35, 103.82], ms: 200 },
  { country: "China", city: "Beijing", coords: [39.9, 116.4], ms: 210 },
  { country: "Japan", city: "Tokyo", coords: [35.68, 139.69], ms: 220 },
  { country: "South Korea", city: "Seoul", coords: [37.56, 126.97], ms: 215 },
  { country: "Australia", city: "Canberra", coords: [-35.28, 149.13], ms: 280 },
  { country: "USA", city: "Washington DC", coords: [38.9, -77.04], ms: 138 },
  { country: "Canada", city: "Ottawa", coords: [45.42, -75.69], ms: 140 },
  { country: "Brazil", city: "Brasilia", coords: [-15.79, -47.88], ms: 170 },
  { country: "Argentina", city: "Buenos Aires", coords: [-34.6, -58.38], ms: 190 },
  { country: "South Africa", city: "Pretoria", coords: [-25.75, 28.19], ms: 160 },
];

// Detail nodes — revealed when the map is zoomed in (zoom >= 3).
// Covers every country/territory with significant internet access.
export const MAP_LOCATIONS_DETAIL = [
  // Europe
  { country: "Netherlands", city: "Amsterdam", coords: [52.37, 4.9], ms: 32 },
  { country: "Italy", city: "Rome", coords: [41.9, 12.5], ms: 45 },
  { country: "Poland", city: "Warsaw", coords: [52.23, 21.01], ms: 30 },
  { country: "Turkey", city: "Istanbul", coords: [41.01, 28.98], ms: 80 },
  { country: "Greece", city: "Athens", coords: [37.98, 23.73], ms: 55 },
  { country: "Portugal", city: "Lisbon", coords: [38.72, -9.13], ms: 52 },
  { country: "Norway", city: "Oslo", coords: [59.91, 10.75], ms: 42 },
  { country: "Finland", city: "Helsinki", coords: [60.17, 24.94], ms: 44 },
  { country: "Denmark", city: "Copenhagen", coords: [55.68, 12.57], ms: 36 },
  { country: "Switzerland", city: "Zurich", coords: [47.37, 8.54], ms: 38 },
  { country: "Austria", city: "Vienna", coords: [48.21, 16.37], ms: 34 },
  { country: "Czechia", city: "Prague", coords: [50.08, 14.44], ms: 32 },
  { country: "Hungary", city: "Budapest", coords: [47.5, 19.04], ms: 31 },
  { country: "Belgium", city: "Brussels", coords: [50.85, 4.35], ms: 37 },
  { country: "Ireland", city: "Dublin", coords: [53.35, -6.26], ms: 39 },
  { country: "Ukraine", city: "Kyiv", coords: [50.45, 30.52], ms: 35 },
  { country: "Slovakia", city: "Bratislava", coords: [48.15, 17.11], ms: 33 },
  { country: "Croatia", city: "Zagreb", coords: [45.81, 15.98], ms: 40 },
  { country: "Serbia", city: "Belgrade", coords: [44.82, 20.46], ms: 38 },
  { country: "Bulgaria", city: "Sofia", coords: [42.7, 23.32], ms: 42 },
  { country: "Lithuania", city: "Vilnius", coords: [54.69, 25.28], ms: 35 },
  { country: "Latvia", city: "Riga", coords: [56.95, 24.11], ms: 36 },
  { country: "Estonia", city: "Tallinn", coords: [59.44, 24.75], ms: 37 },
  { country: "Luxembourg", city: "Luxembourg", coords: [49.61, 6.13], ms: 36 },
  { country: "Slovenia", city: "Ljubljana", coords: [46.05, 14.51], ms: 38 },
  { country: "Albania", city: "Tirana", coords: [41.33, 19.82], ms: 55 },
  { country: "Moldova", city: "Chisinau", coords: [47.0, 28.86], ms: 40 },
  { country: "Belarus", city: "Minsk", coords: [53.9, 27.57], ms: 45 },
  { country: "Bosnia", city: "Sarajevo", coords: [43.85, 18.39], ms: 50 },
  { country: "North Macedonia", city: "Skopje", coords: [42.0, 21.43], ms: 52 },
  { country: "Montenegro", city: "Podgorica", coords: [42.44, 19.26], ms: 55 },
  { country: "Iceland", city: "Reykjavik", coords: [64.13, -21.93], ms: 55 },
  { country: "Malta", city: "Valletta", coords: [35.9, 14.51], ms: 50 },
  { country: "Cyprus", city: "Nicosia", coords: [35.17, 33.36], ms: 60 },
  // Middle East & Central Asia
  { country: "Morocco", city: "Rabat", coords: [34.02, -6.83], ms: 75 },
  { country: "Israel", city: "Tel Aviv", coords: [32.08, 34.78], ms: 95 },
  { country: "Saudi Arabia", city: "Riyadh", coords: [24.71, 46.68], ms: 120 },
  { country: "Jordan", city: "Amman", coords: [31.96, 35.95], ms: 100 },
  { country: "Lebanon", city: "Beirut", coords: [33.89, 35.5], ms: 95 },
  { country: "Kuwait", city: "Kuwait City", coords: [29.37, 47.98], ms: 125 },
  { country: "Qatar", city: "Doha", coords: [25.29, 51.53], ms: 128 },
  { country: "Bahrain", city: "Manama", coords: [26.22, 50.59], ms: 126 },
  { country: "Oman", city: "Muscat", coords: [23.61, 58.59], ms: 135 },
  { country: "Pakistan", city: "Islamabad", coords: [33.72, 73.06], ms: 175 },
  { country: "Kazakhstan", city: "Astana", coords: [51.18, 71.45], ms: 110 },
  { country: "Uzbekistan", city: "Tashkent", coords: [41.3, 69.24], ms: 115 },
  { country: "Azerbaijan", city: "Baku", coords: [40.41, 49.87], ms: 95 },
  { country: "Georgia", city: "Tbilisi", coords: [41.69, 44.83], ms: 90 },
  { country: "Armenia", city: "Yerevan", coords: [40.18, 44.51], ms: 92 },
  { country: "Iran", city: "Tehran", coords: [35.69, 51.42], ms: 140 },
  { country: "Iraq", city: "Baghdad", coords: [33.34, 44.4], ms: 135 },
  // Asia
  { country: "Nigeria", city: "Lagos", coords: [6.52, 3.38], ms: 150 },
  { country: "Kenya", city: "Nairobi", coords: [-1.29, 36.82], ms: 145 },
  { country: "Mexico", city: "Mexico City", coords: [19.43, -99.13], ms: 165 },
  { country: "Colombia", city: "Bogota", coords: [4.71, -74.07], ms: 175 },
  { country: "Chile", city: "Santiago", coords: [-33.45, -70.67], ms: 200 },
  { country: "Thailand", city: "Bangkok", coords: [13.76, 100.5], ms: 195 },
  { country: "Vietnam", city: "Hanoi", coords: [21.03, 105.85], ms: 205 },
  { country: "Indonesia", city: "Jakarta", coords: [-6.21, 106.85], ms: 210 },
  { country: "Philippines", city: "Manila", coords: [14.6, 120.98], ms: 218 },
  { country: "Malaysia", city: "Kuala Lumpur", coords: [3.14, 101.69], ms: 198 },
  { country: "Bangladesh", city: "Dhaka", coords: [23.81, 90.41], ms: 185 },
  { country: "Sri Lanka", city: "Colombo", coords: [6.93, 79.85], ms: 188 },
  { country: "Nepal", city: "Kathmandu", coords: [27.71, 85.31], ms: 192 },
  { country: "Myanmar", city: "Naypyidaw", coords: [19.74, 96.07], ms: 208 },
  { country: "Cambodia", city: "Phnom Penh", coords: [11.56, 104.92], ms: 210 },
  { country: "Laos", city: "Vientiane", coords: [17.97, 102.6], ms: 212 },
  { country: "Mongolia", city: "Ulaanbaatar", coords: [47.91, 106.88], ms: 230 },
  { country: "Hong Kong", city: "Hong Kong", coords: [22.32, 114.17], ms: 212 },
  { country: "Taiwan", city: "Taipei", coords: [25.03, 121.57], ms: 215 },
  { country: "Macau", city: "Macau", coords: [22.2, 113.55], ms: 213 },
  // Africa
  { country: "Ghana", city: "Accra", coords: [5.56, -0.2], ms: 155 },
  { country: "Ethiopia", city: "Addis Ababa", coords: [9.03, 38.74], ms: 160 },
  { country: "Tanzania", city: "Dar es Salaam", coords: [-6.79, 39.21], ms: 162 },
  { country: "Uganda", city: "Kampala", coords: [0.32, 32.58], ms: 158 },
  { country: "Rwanda", city: "Kigali", coords: [-1.95, 30.06], ms: 165 },
  { country: "Senegal", city: "Dakar", coords: [14.72, -17.47], ms: 155 },
  { country: "Ivory Coast", city: "Abidjan", coords: [5.36, -4.01], ms: 158 },
  { country: "Cameroon", city: "Yaounde", coords: [3.87, 11.52], ms: 163 },
  { country: "Tunisia", city: "Tunis", coords: [36.82, 10.17], ms: 75 },
  { country: "Algeria", city: "Algiers", coords: [36.74, 3.06], ms: 80 },
  { country: "Libya", city: "Tripoli", coords: [32.9, 13.18], ms: 95 },
  { country: "Sudan", city: "Khartoum", coords: [15.5, 32.56], ms: 120 },
  { country: "Zimbabwe", city: "Harare", coords: [-17.83, 31.05], ms: 170 },
  { country: "Zambia", city: "Lusaka", coords: [-15.41, 28.28], ms: 168 },
  { country: "Mozambique", city: "Maputo", coords: [-25.97, 32.59], ms: 172 },
  { country: "Angola", city: "Luanda", coords: [-8.84, 13.23], ms: 168 },
  { country: "Botswana", city: "Gaborone", coords: [-24.65, 25.91], ms: 170 },
  { country: "Namibia", city: "Windhoek", coords: [-22.56, 17.08], ms: 172 },
  { country: "Madagascar", city: "Antananarivo", coords: [-18.91, 47.54], ms: 185 },
  // Americas
  { country: "Peru", city: "Lima", coords: [-12.05, -77.04], ms: 185 },
  { country: "Venezuela", city: "Caracas", coords: [10.49, -66.88], ms: 180 },
  { country: "Ecuador", city: "Quito", coords: [-0.22, -78.51], ms: 183 },
  { country: "Bolivia", city: "La Paz", coords: [-16.5, -68.15], ms: 195 },
  { country: "Paraguay", city: "Asuncion", coords: [-25.29, -57.65], ms: 195 },
  { country: "Uruguay", city: "Montevideo", coords: [-34.9, -56.19], ms: 192 },
  { country: "Guatemala", city: "Guatemala City", coords: [14.64, -90.51], ms: 168 },
  { country: "Costa Rica", city: "San Jose", coords: [9.93, -84.08], ms: 170 },
  { country: "Panama", city: "Panama City", coords: [8.99, -79.52], ms: 172 },
  { country: "Cuba", city: "Havana", coords: [23.13, -82.38], ms: 175 },
  { country: "Dominican Republic", city: "Santo Domingo", coords: [18.49, -69.9], ms: 165 },
  { country: "Puerto Rico", city: "San Juan", coords: [18.47, -66.11], ms: 155 },
  { country: "Jamaica", city: "Kingston", coords: [17.99, -76.79], ms: 162 },
  { country: "Trinidad", city: "Port of Spain", coords: [10.65, -61.52], ms: 168 },
  { country: "El Salvador", city: "San Salvador", coords: [13.69, -89.19], ms: 170 },
  { country: "Honduras", city: "Tegucigalpa", coords: [14.09, -87.21], ms: 172 },
  { country: "Nicaragua", city: "Managua", coords: [12.14, -86.28], ms: 174 },
  // Oceania
  { country: "New Zealand", city: "Wellington", coords: [-41.29, 174.78], ms: 300 },
  { country: "Papua New Guinea", city: "Port Moresby", coords: [-9.44, 147.18], ms: 310 },
  { country: "Fiji", city: "Suva", coords: [-18.14, 178.44], ms: 320 },
];