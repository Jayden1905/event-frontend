'use client'

import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'

interface Attendee {
  attendance: boolean
}

export default function AttendanceChart({
  attendees,
}: {
  attendees: Attendee[]
}) {
  const presentCount = attendees.filter((a) => a.attendance).length
  const absentCount = attendees.length - presentCount

  const data = [
    { name: 'Present', value: presentCount },
    { name: 'Absent', value: absentCount },
  ]

  const COLORS = ['#0088FE', '#FF8042']

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}