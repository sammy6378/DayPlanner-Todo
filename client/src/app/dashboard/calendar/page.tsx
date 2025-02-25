"use client";

import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import Badge from '@mui/material/Badge';
import { Card, CardContent, Typography } from '@mui/material';

// Sample event data
const events = [
  { date: '2025-02-26', title: 'Meeting', description: 'Discuss project progress' },
  { date: '2025-02-27', title: 'Conference', description: 'Attend annual tech conference' },
];

// Extract event dates
function getEventDates() {
  return events.map(event => parseInt(dayjs(event.date).format('D')));
}

// Custom Day Renderer
function ServerDay(props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? '📅' : undefined}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        sx={{
          color: 'text.primary',
          '&.Mui-selected': {
            backgroundColor: 'primary.main',
          },
          '&:hover': {
            backgroundColor: 'primary.light',
          },
        }}
      />
    </Badge>
  );
}

export default function DateCalendarWithEvents() {
  const [highlightedDays, setHighlightedDays] = React.useState<number[]>(getEventDates());
  const [selectedEvent, setSelectedEvent] = React.useState<any>(null);

  const handleDayClick = (day: Dayjs) => {
    const event = events.find(event => dayjs(event.date).isSame(day, 'day'));
    if (event) {
      setSelectedEvent(event);
    } else {
      setSelectedEvent(null);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          defaultValue={dayjs()}
          slots={{
            day: ServerDay,
          }}
          slotProps={{
            day: {
              highlightedDays,
            } as any,
          }}
          onChange={(date) => handleDayClick(date)}
          sx={{ flex: 1 }}
        />
      </LocalizationProvider>

      {selectedEvent && (
        <Card sx={{ marginTop: '20px', maxWidth: 400, margin: 'auto' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {selectedEvent.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedEvent.description}
            </Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
