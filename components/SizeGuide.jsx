export default function SizeGuide({ product }) {
  // Size options for different product groups
  const sizeOptions = {
    bracelet: [
      { wrist: '13-13.9 CM', recommended: 15 },
      { wrist: '14-14.9 CM', recommended: 16 },
      { wrist: '15-15.9 CM', recommended: 17 },
      { wrist: '16-16.9 CM', recommended: 18 },
      { wrist: '17-17.9 CM', recommended: 19 },
      { wrist: '18-18.9 CM', recommended: 20 },
      { wrist: '19-19.9 CM', recommended: 21 },
    ],
    ring: [
      { size: '5', diameter: '15.7 mm' },
      { size: '6', diameter: '16.5 mm' },
      { size: '7', diameter: '17.3 mm' },
      { size: '8', diameter: '18.1 mm' },
      { size: '9', diameter: '19.0 mm' },
      { size: '10', diameter: '19.8 mm' },
    ],
    pendant: [
      { type: 'Small Pendant', recommended: 'S' },
      { type: 'Medium Pendant', recommended: 'M' },
      { type: 'Large Pendant', recommended: 'L' },
    ],
  };

  const sizes = sizeOptions[product.group] || [];

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Size Guide</h2>
      <p className='mb-6 text-gray-600'>
        Sizing recommendations may vary among our collections. Identify the
        recommended size for this {product.group}.
      </p>

      {product.group === 'bracelet' && (
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
      )}

      {product.group === 'ring' && (
        <table className='w-full border-collapse'>
          <thead>
            <tr className='border-b'>
              <th className='text-left py-2'>Ring Size</th>
              <th className='text-left py-2'>Diameter</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((s, idx) => (
              <tr key={idx} className='border-b'>
                <td className='py-2'>{s.size}</td>
                <td className='py-2 font-semibold'>{s.diameter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {product.group === 'pendant' && (
        <table className='w-full border-collapse'>
          <thead>
            <tr className='border-b'>
              <th className='text-left py-2'>Pendant Type</th>
              <th className='text-left py-2'>Recommended Size</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((s, idx) => (
              <tr key={idx} className='border-b'>
                <td className='py-2'>{s.type}</td>
                <td className='py-2 font-semibold'>{s.recommended}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
