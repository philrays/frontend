import React, { useState } from 'react';

const cardClass =
  'bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-xl shadow-lg flex flex-col gap-4 mb-8 border border-gray-600';

// Utility: Safe template rendering (replaces {{key}} with values from data object)
function renderTemplate(template, data) {
  if (typeof template !== 'string' || typeof data !== 'object' || !data) return template;
  return template.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
    return Object.prototype.hasOwnProperty.call(data, key) && data[key] != null ? String(data[key]) : '';
  });
}

const mockProducts = [
  { id: '1', name: 'Eco Floped', price: '₹499', color: 'Green', feature: 'Sustainable' },
  { id: '2', name: 'Kids Chappal', price: '₹299', color: 'Blue', feature: 'Waterproof' },
  { id: '3', name: 'Classic Doohickey', price: '₹399', color: 'Black', feature: 'Comfort' },
];

const defaultTemplates = {
  headline: [
    'Buy {{name}} for just {{price}}!',
    'New: {{feature}} {{name}}',
  ],
  description: [
    'Get your {{color}} {{name}} today.',
    'Perfect for all ages. Only {{price}}.'
  ],
  cta: [
    'Shop Now',
    'Learn More'
  ]
};

export default function DynamicCreativeOptimizationPage() {
  const [products, setProducts] = useState(mockProducts);
  const [templates, setTemplates] = useState(defaultTemplates);
  const [generated, setGenerated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTemplateChange = (type, idx, value) => {
    setTemplates(t => ({
      ...t,
      [type]: t[type].map((v, i) => (i === idx ? value : v))
    }));
  };
  const handleAddTemplate = type => {
    setTemplates(t => ({ ...t, [type]: [...t[type], ''] }));
  };
  const handleRemoveTemplate = (type, idx) => {
    setTemplates(t => ({ ...t, [type]: t[type].filter((_, i) => i !== idx) }));
  };

  const handleGenerateDCO = async () => {
    setLoading(true); setError(''); setGenerated([]);
    try {
      const res = await fetch('/api/dco/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products, templates })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) setGenerated(data.data);
      else setError(data.error || 'Failed to generate creatives.');
    } catch (e) {
      setError('Network error.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className={cardClass}>
        <h3 className="text-xl font-semibold text-gray-100 mb-2">Dynamic Creative Optimization (DCO)</h3>
        <p className="mb-6 text-gray-300">Generate ad creative variations by combining product data with creative templates. Use <code className='bg-gray-700 px-1 rounded'>{'{{name}}'}</code>, <code className='bg-gray-700 px-1 rounded'>{'{{price}}'}</code>, etc. as placeholders.</p>
        {/* Template Preview (first product/template) */}
        <div className="mb-6 bg-gray-900 p-4 rounded">
          <h4 className="text-md font-semibold text-gray-200 mb-2">Template Preview</h4>
          {products.length > 0 && (
            <div className="text-gray-300 text-sm">
              {(() => {
                try {
                  return (
                    <>
                      <div><span className="font-semibold">Headline:</span> {renderTemplate(templates.headline[0] || '', products[0])}</div>
                      <div><span className="font-semibold">Description:</span> {renderTemplate(templates.description[0] || '', products[0])}</div>
                      <div><span className="font-semibold">CTA:</span> {templates.cta[0]}</div>
                    </>
                  );
                } catch (err) {
                  return <div className="text-red-400">Error rendering preview: {err.message}</div>;
                }
              })()}
            </div>
          )}
        </div>
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-200 mb-2">Creative Templates</h3>
          {['headline','description','cta'].map(type => (
            <div key={type} className="mb-4">
              <label className="block text-gray-300 font-semibold mb-1 capitalize">{type}s</label>
              {templates[type].map((tpl, idx) => (
                <div key={idx} className="flex gap-2 mb-1">
                  <input
                    className="flex-1 p-2 rounded bg-gray-700 text-gray-100"
                    value={tpl}
                    onChange={e => handleTemplateChange(type, idx, e.target.value)}
                    placeholder={`Enter a ${type} template...`}
                  />
                  <button className="text-red-400" onClick={() => handleRemoveTemplate(type, idx)} title="Remove">&times;</button>
                </div>
              ))}
              <button className="text-sm text-gray-400 hover:underline" onClick={() => handleAddTemplate(type)} type="button">+ Add {type}</button>
            </div>
          ))}
        </div>
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-200 mb-2">Product Data (Mock)</h3>
          <table className="min-w-full border text-sm mb-2">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-2 border text-gray-200">Name</th>
                <th className="p-2 border text-gray-200">Price</th>
                <th className="p-2 border text-gray-200">Color</th>
                <th className="p-2 border text-gray-200">Feature</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td className="p-2 border text-gray-100">{p.name}</td>
                  <td className="p-2 border text-gray-100">{p.price}</td>
                  <td className="p-2 border text-gray-100">{p.color}</td>
                  <td className="p-2 border text-gray-100">{p.feature}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          className="bg-gray-700 text-gray-100 px-6 py-2 rounded font-semibold hover:bg-gray-600 mb-6"
          onClick={handleGenerateDCO}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Ad Variations'}
        </button>
        {error && <div className="text-red-400 mb-4">{error}</div>}
        {generated.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Generated Ad Variations ({generated.length})</h3>
            <div className="overflow-x-auto max-h-96">
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="p-2 border text-gray-200">Product</th>
                    <th className="p-2 border text-gray-200">Headline</th>
                    <th className="p-2 border text-gray-200">Description</th>
                    <th className="p-2 border text-gray-200">CTA</th>
                  </tr>
                </thead>
                <tbody>
                  {generated.map((g, i) => (
                    <tr key={i}>
                      <td className="p-2 border text-gray-100">{g.productName}</td>
                      <td className="p-2 border text-gray-100">{g.headline}</td>
                      <td className="p-2 border text-gray-100">{g.description}</td>
                      <td className="p-2 border text-gray-100">{g.cta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
