import React, { useState, useEffect } from 'react';

const PhastInputForm = () => {
  // State for basic inputs
  const [pressure, setPressure] = useState('');
  const [temperature, setTemperature] = useState('');
  const [holeSize, setHoleSize] = useState('');
  const [releaseElevation, setReleaseElevation] = useState('');
  const [poolConfinementArea, setPoolConfinementArea] = useState('');
  const [releaseBasis, setReleaseBasis] = useState('mass');
  const [releaseQuantity, setReleaseQuantity] = useState('');
  
  // State for chemical components
  const [isMolarComposition, setIsMolarComposition] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chemicals, setChemicals] = useState([]);
  const [allChemicals, setAllChemicals] = useState([]);
  const [selectedChemicals, setSelectedChemicals] = useState([
    { name: 'Methane', cas: '74-82-8', value: '45' },
    { name: 'Ethane', cas: '74-84-0', value: '30' },
    { name: 'Propane', cas: '74-98-6', value: '25' }
  ]);
  
  // Fetch chemicals from CSV
  useEffect(() => {
    const fetchChemicals = async () => {
    try {
      const response = await fetch('data/cheminfo.csv');
      const text = await response.text();
      
      // Parse CSV
      const rows = text.split('\n');
      const headers = rows[0].split(',');
      const nameIndex = headers.indexOf('chem_name');
      const casIndex = headers.indexOf('cas_no');
      
      const chemicalList = rows.slice(1)
        .map(row => {
          const columns = row.split(',');
          return {
            name: columns[nameIndex]?.trim(),
            cas: columns[casIndex]?.trim()
          };
        })
        .filter(chem => chem.name && chem.cas); // Filter out rows with missing data
      
      setAllChemicals(chemicalList);
    } catch (error) {
      console.error('Error loading chemical data:', error);
    }
  };
  
  fetchChemicals();
}, []);

// Filter chemicals based on search term
useEffect(() => {
  if (searchTerm && allChemicals.length > 0) {
    const filtered = allChemicals.filter(chem => 
      chem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chem.cas.includes(searchTerm)
    ).slice(0, 8); // Limit to 8 results for better UX
    
    setChemicals(filtered);
    setShowResults(filtered.length > 0);
  } else {
    setChemicals([]);
    setShowResults(false);
  }
}, [searchTerm, allChemicals]);

  // Add a chemical to the selected list
  const addChemical = (chemical) => {
    if (!selectedChemicals.some(c => c.cas === chemical.cas)) {
      setSelectedChemicals([...selectedChemicals, { ...chemical, value: '' }]);
    }
    setSearchTerm('');
    setShowResults(false);
  };
  
  // Remove a chemical from the selected list
  const removeChemical = (cas) => {
    setSelectedChemicals(selectedChemicals.filter(c => c.cas !== cas));
  };
  
  // Update chemical value
  const updateChemicalValue = (cas, value) => {
    setSelectedChemicals(selectedChemicals.map(chem => 
      chem.cas === cas ? { ...chem, value } : chem
    ));
  };
  
  // Handle form submission
  const handleRunModel = () => {
    setIsSubmitting(true);
    console.log('Running model with data:', {
      pressure,
      temperature,
      holeSize,
      releaseElevation,
      poolConfinementArea,
      releaseBasis,
      releaseQuantity,
      isMolarComposition,
      chemicals: selectedChemicals
    });
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Here you would send the data to your backend
    }, 2000);
  };

  return (
    <div className="phast-app">
      <header className="app-header">
        <div className="app-logo">
          <div className="logo-inner">PH</div>
        </div>
        <h1 className="app-title">PHAST Web Application</h1>
        <p className="app-subtitle">Process Hazard Analysis Simulation Tool</p>
      </header>
      
      {/* Release Parameters Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <div className="card-icon">📊</div>
            <span>Release Parameters</span>
          </div>
        </div>
        <div className="card-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="pressure">Pressure</label>
              <div className="form-control">
                <input 
                  type="number" 
                  id="pressure"
                  placeholder="0.0"
                  value={pressure}
                  onChange={(e) => setPressure(e.target.value)}
                />
                <span className="input-unit">psig</span>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="temperature">Temperature</label>
              <div className="form-control">
                <input 
                  type="number" 
                  id="temperature"
                  placeholder="0.0"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                />
                <span className="input-unit">°F</span>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="holeSize">Hole Size</label>
              <div className="form-control">
                <input 
                  type="number" 
                  id="holeSize"
                  placeholder="0.0"
                  value={holeSize}
                  onChange={(e) => setHoleSize(e.target.value)}
                />
                <span className="input-unit">in</span>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="releaseElevation">Release Elevation</label>
              <div className="form-control">
                <input 
                  type="number" 
                  id="releaseElevation"
                  placeholder="0.0"
                  value={releaseElevation}
                  onChange={(e) => setReleaseElevation(e.target.value)}
                />
                <span className="input-unit">ft</span>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="poolConfinementArea">Pool Confinement Area</label>
              <div className="form-control">
                <input 
                  type="number" 
                  id="poolConfinementArea"
                  placeholder="0.0"
                  value={poolConfinementArea}
                  onChange={(e) => setPoolConfinementArea(e.target.value)}
                />
                <span className="input-unit">ft²</span>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="releaseBasis">Release Basis</label>
              <div className="form-control select-wrapper">
                <select
                  id="releaseBasis"
                  value={releaseBasis}
                  onChange={(e) => setReleaseBasis(e.target.value)}
                >
                  <option value="mass">Mass</option>
                  <option value="volume">Volume</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="releaseQuantity">Release Quantity</label>
              <div className="form-control">
                <input 
                  type="number" 
                  id="releaseQuantity"
                  placeholder="0.0"
                  value={releaseQuantity}
                  onChange={(e) => setReleaseQuantity(e.target.value)}
                />
                <span className="input-unit">{releaseBasis === 'mass' ? 'lbs' : 'gal'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chemical Components Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <div className="card-icon">🧪</div>
            <span>Chemical Components</span>
          </div>
          
          <div className="toggle-container">
            <span className="toggle-label">Molar Composition</span>
            <label className="toggle-switch">
              <input 
                type="checkbox"
                checked={isMolarComposition}
                onChange={(e) => setIsMolarComposition(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
        <div className="card-body">
          <div className="search-container">
            <div className="search-input-wrapper">
              <span className="search-icon">⌕</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search chemical by name or CAS number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {showResults && (
              <div className="search-results">
                {chemicals.map((chem) => (
                  <div 
                    key={chem.cas} 
                    className="search-result-item"
                    onClick={() => addChemical(chem)}
                  >
                    <div className="result-name">{chem.name}</div>
                    <div className="result-cas">{chem.cas}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="chemical-list">
            {selectedChemicals.length > 0 ? (
              selectedChemicals.map((chem) => (
                <div key={chem.cas} className="chemical-item">
                  <div className="chemical-info">
                    <div className="chemical-name">{chem.name}</div>
                    <div className="chemical-cas">CAS: {chem.cas}</div>
                  </div>
                  <div className="chemical-controls">
                    <div className="value-input">
                      <input 
                        type="number" 
                        placeholder="0.0" 
                        value={chem.value}
                        onChange={(e) => updateChemicalValue(chem.cas, e.target.value)}
                      />
                      <span className="value-unit">{isMolarComposition ? 'mol %' : 'wt %'}</span>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => removeChemical(chem.cas)}
                      aria-label={`Remove ${chem.name}`}
                    >×</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🧪</div>
                <div className="empty-title">No chemicals added</div>
                <div className="empty-description">
                  Use the search bar above to find and add chemicals to your mixture.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="action-container">
        <button 
          className={`run-btn ${isSubmitting ? 'loading' : ''}`}
          onClick={handleRunModel}
          disabled={selectedChemicals.length === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loading-indicator"></span>
              Processing...
            </>
          ) : (
            'Run Model'
          )}
        </button>
      </div>
    </div>
  );
};

export default PhastInputForm;