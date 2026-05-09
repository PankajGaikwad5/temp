'use client'

import { useState, useMemo } from 'react'
import PDPViewer from '../../components/PDPViewer'
import Image from 'next/image'

// Available fallback models to show for different combinations
const AVAILABLE_MODELS = [
  '/optimized/ring.glb',
  '/optimized/bracelet.glb',
  '/optimized/pendant.glb',
  '/ring2.glb',
  '/ring3.glb',
  '/bracelet2.glb',
  '/bracelet3.glb',
  '/pendant2.glb',
]

const CHARACTERS = [
  { id: 1, name: 'Character 1', image: '/cards/1.webp' },
  { id: 2, name: 'Character 2', image: '/cards/2.webp' },
  { id: 3, name: 'Character 3', image: '/cards/3.webp' },
  { id: 4, name: 'Character 4', image: '/cards/4.webp' },
  { id: 5, name: 'Character 5', image: '/cards/5.webp' },
  { id: 6, name: 'Character 6', image: '/cards/6.webp' },
  { id: 7, name: 'Character 7', image: '/cards/7.webp' },
  { id: 8, name: 'Character 8', image: '/cards/8.webp' },
]

const COLORS = [
  { id: 'gold', name: 'Gold', hex: 0xc9a96e, cssClass: 'bg-[#c9a96e]' },
  { id: 'rosegold', name: 'Rose Gold', hex: 0xb76e79, cssClass: 'bg-[#b76e79]' },
  { id: 'silver', name: 'Silver', hex: 0xc0c0c0, cssClass: 'bg-[#c0c0c0]' },
  { id: 'platinum', name: 'Platinum', hex: 0xe5e4e2, cssClass: 'bg-[#e5e4e2]' },
]

export default function TestingPage() {
  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [selectedChars, setSelectedChars] = useState([]) // Array of character IDs
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleCharacter = (charId) => {
    setSelectedChars(prev => 
      prev.includes(charId) ? prev.filter(id => id !== charId) : [...prev, charId]
    )
  }

  const removeCharacter = (charId) => {
    setSelectedChars(prev => prev.filter(id => id !== charId))
  }

  // Deterministically map a combination of characters to one of the available models
  // If no character is selected, show the first model (base ring).
  const currentModelPath = useMemo(() => {
    if (selectedChars.length === 0) return AVAILABLE_MODELS[0]
    
    // Simple hash based on the sum of selected IDs to pick a model index
    const sum = selectedChars.reduce((acc, id) => acc + id, 0)
    // Use modulo to wrap around available models (excluding the base ring at index 0 if possible, 
    // but here we just map across all available models)
    const index = sum % AVAILABLE_MODELS.length
    return AVAILABLE_MODELS[index]
  }, [selectedChars])

  return (
    <div className="h-screen w-full bg-[#f8f5f0] text-gray-900 font-sans flex flex-col lg:flex-row overflow-hidden">
      {/* 3D Viewer Area */}
      <div className="relative w-full lg:w-[65%] h-[55vh] lg:h-screen">
        <PDPViewer modelPath={currentModelPath} materialColor={selectedColor.hex} />
        
        {/* Navigation / Logo placeholder */}
        <div className="absolute top-8 left-8 z-10 pointer-events-none">
          <span className="text-[#8b0000] tracking-[0.5em] uppercase font-semibold text-sm">The Vault</span>
          <span className="font-serif italic text-[#c9a96e] block mt-1 tracking-widest text-xs">by Karan Desai</span>
        </div>
      </div>

      {/* Details & Controls Area */}
      <div data-lenis-prevent="true" className="relative z-10 w-full lg:w-[35%] h-[45vh] lg:h-full overflow-y-auto border-t lg:border-t-0 lg:border-l border-[#c9a96e]/20 bg-white shadow-xl">
        <div className="min-h-full w-full flex flex-col p-8 lg:p-12">
          <div className="max-w-md mx-auto w-full flex-1 pb-10 lg:pb-12 pt-4 lg:pt-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-light text-gray-900 mb-2 font-serif">Character Ring</h1>
            <p className="text-gray-500 text-xs tracking-widest uppercase mt-3 leading-relaxed">Design your unique combination. Select multiple characters to forge your piece.</p>
          </div>

          {/* Color Selection */}
          <div className="mb-10">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400 mb-4">Material Base</h3>
            <div className="flex gap-5">
              {COLORS.map(color => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color)}
                  className={`relative w-9 h-9 rounded-full focus:outline-none transition-all duration-300 hover:scale-110 ${
                    selectedColor.id === color.id ? 'ring-2 ring-offset-2 ring-[#c9a96e]' : 'ring-1 ring-gray-200'
                  }`}
                  title={color.name}
                >
                  <span className={`block w-full h-full rounded-full shadow-inner ${color.cssClass}`} />
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-700 font-serif italic tracking-wide">{selectedColor.name}</p>
          </div>

          {/* Character Selection (Dropdown & Multiple Select) */}
          <div className="mb-12 relative">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400 mb-4">Add Characters</h3>
            
            {/* Custom Dropdown Trigger */}
            <div 
              className="w-full border border-gray-200 rounded-lg p-4 flex justify-between items-center cursor-pointer hover:border-gray-300 bg-white transition-colors"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="text-sm text-gray-600">Select characters to add...</span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div data-lenis-prevent="true" className="relative z-20 mt-2 bg-white border border-gray-200 rounded-lg shadow-sm max-h-60 overflow-y-auto">
                <div className="p-2 grid grid-cols-2 gap-2">
                  {CHARACTERS.map(char => {
                    const isSelected = selectedChars.includes(char.id)
                    return (
                      <div 
                        key={char.id}
                        onClick={() => toggleCharacter(char.id)}
                        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all ${
                          isSelected ? 'bg-[#c9a96e]/10 border border-[#c9a96e]/30' : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image src={char.image} alt={char.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 flex justify-between items-center">
                          <span className={`text-xs ${isSelected ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{char.name}</span>
                          {isSelected && (
                            <svg className="w-4 h-4 text-[#c9a96e]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Selected Characters Display */}
            {selectedChars.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedChars.map(id => {
                  const char = CHARACTERS.find(c => c.id === id)
                  return (
                    <div key={id} className="flex items-center gap-2 bg-white border border-[#c9a96e]/40 rounded-full pl-2 pr-3 py-1 shadow-sm">
                      <div className="relative w-5 h-5 rounded-full overflow-hidden">
                        <Image src={char.image} alt={char.name} fill className="object-cover" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">{char.name}</span>
                      <button 
                        onClick={() => removeCharacter(id)}
                        className="ml-1 text-gray-400 hover:text-red-500 focus:outline-none"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* CTA */}
          <button className="w-full py-4.5 px-6 bg-gray-900 text-white tracking-[0.25em] uppercase font-semibold text-xs hover:bg-[#c9a96e] transition-colors duration-300 shadow-md">
            Add to Vault
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}