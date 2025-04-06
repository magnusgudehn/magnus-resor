import { Trip } from '../types';

export function seedTestData() {
  const trips: Trip[] = [
    {
      id: 'paris-2024',
      title: 'Paris',
      startDate: '2024-06-01',
      endDate: '2024-06-07',
      bookings: []
    },
    {
      id: 'tokyo-2024',
      title: 'Tokyo',
      startDate: '2024-09-15',
      endDate: '2024-09-30',
      bookings: []
    }
  ];

  // Rensa existerande data först
  localStorage.clear();
  
  // Spara ny testdata
  localStorage.setItem('travel_trips', JSON.stringify(trips));
  
  console.log('Test data seeded:', trips);
} 