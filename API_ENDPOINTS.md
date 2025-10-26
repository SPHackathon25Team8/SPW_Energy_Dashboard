# API Endpoints Documentation

This document describes the API endpoints that the Energy Dashboard application expects to be available at `http://localhost:8000`.

## Energy Chart Data Endpoints

### GET /day
Returns hourly energy usage data for a single day.

**Response Format:**
```json
[
  {
    "time": "12AM",
    "usage": 1.2,
    "devices": ["fridge", "tv"],
    "tariff": 8
  },
  {
    "time": "2AM", 
    "usage": 0.8,
    "devices": ["fridge"],
    "tariff": 8
  }
  // ... 12 entries total (every 2 hours)
]
```

### GET /week
Returns daily energy usage data for a week.

**Response Format:**
```json
[
  {
    "day": "Mon",
    "usage": 22.5,
    "devices": ["fridge", "washing-machine", "dishwasher", "tv", "oven"],
    "tariff": 24.7
  },
  {
    "day": "Tue",
    "usage": 19.8, 
    "devices": ["fridge", "dishwasher", "tv", "oven"],
    "tariff": 24.7
  }
  // ... 7 entries total (one per day)
]
```

### GET /month
Returns weekly energy usage data for a month.

**Response Format:**
```json
[
  {
    "week": "Week 1",
    "usage": 168,
    "devices": ["fridge", "washing-machine", "dishwasher", "tv", "oven", "ev-car"],
    "tariff": 24.7
  },
  {
    "week": "Week 2",
    "usage": 195,
    "devices": ["fridge", "washing-machine", "dishwasher", "tv", "oven", "dryer", "ev-car", "ac"],
    "tariff": 8
  }
  // ... 4 entries total (one per week)
]
```

## AI Insights Endpoint

### GET /aiinsights?period={day|week|month}
Returns AI-generated insights for the specified time period.

**Query Parameters:**
- `period`: One of `day`, `week`, or `month`

**Response Format:**
```json
[
  {
    "title": "Peak Usage: 6-9 PM",
    "description": "Your highest energy consumption occurs during evening hours. Consider shifting laundry and dishwashing to off-peak times.",
    "trend": "neutral",
    "iconName": "TrendingDown"
  },
  {
    "title": "15% Below Average", 
    "description": "Great work! Your usage today is 15% lower than your typical daily consumption.",
    "trend": "down",
    "iconName": "Lightbulb"
  }
  // ... variable number of insights
]
```

## Field Descriptions

### Energy Data Fields
- `time/day/week`: Time period identifier
- `usage`: Energy usage in kWh
- `devices`: Array of device IDs that were predicted to be active
- `tariff`: Energy tariff rate in pence per kWh

### AI Insights Fields
- `title`: Short insight title
- `description`: Detailed insight description
- `trend`: One of `"up"`, `"down"`, or `"neutral"`
- `iconName`: Icon name for display (TrendingUp, TrendingDown, Lightbulb, Calendar)

### Available Device IDs
- `washing-machine`, `ev-car`, `dishwasher`, `fridge`, `oven`, `tv`, `ac`, `kettle`, `dryer`, `computer`, `heater`, `microwave`, `vacuum`, `fan`, `lights`, `phone`

## Error Handling

If any endpoint is unavailable or returns an error, the application will:
1. Display a loading state initially
2. Show an error message if the request fails
3. Fall back to using hardcoded sample data
4. Display a small "Using offline data" indicator on charts

## CORS Configuration

Make sure your API server includes appropriate CORS headers to allow requests from the frontend:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```