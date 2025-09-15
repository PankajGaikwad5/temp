export default function SizeGuide({ product }) {
  // Example sizes
  const sizes = [
    { wrist: '13-13.9 CM', recommended: 15 },
    { wrist: '14-14.9 CM', recommended: 16 },
    { wrist: '15-15.9 CM', recommended: 17 },
    { wrist: '16-16.9 CM', recommended: 18 },
    { wrist: '17-17.9 CM', recommended: 19 },
    { wrist: '18-18.9 CM', recommended: 20 },
    { wrist: '19-19.9 CM', recommended: 21 },
  ];

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Size Guide</h2>
      <p className='mb-6 text-gray-600'>
        Sizing recommendations may vary among our collections. Identify the
        recommended bracelet size for this model using your wrist circumference.
      </p>
      <table className='w-full border-collapse'>
        <thead>
          <tr className='border-b'>
            <th className='text-left py-2'>Wrist Circumference</th>
            <th className='text-left py-2'>Recommended Size</th>
          </tr>
        </thead>
        <tbody>
          {sizes.map((s, idx) => (
            <tr key={idx} className='border-b'>
              <td className='py-2'>{s.wrist}</td>
              <td className='py-2 font-semibold'>{s.recommended}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
