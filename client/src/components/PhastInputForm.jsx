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
  const [chemicals, setChemicals] = useState([]);
  const [filteredChemicals, setFilteredChemicals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChemicals, setSelectedChemicals] = useState([]);
  const [isMolarComposition, setIsMolarComposition] = useState(false);
  
  // Fetch chemicals from CSV
  useEffect(() => {
    const fetchChemicals = async () => {
      try {
        const response = await fetch('/data/cheminfo.csv');
        const text = await response.text();
        
        // Parse CSV
        const rows = text.split('\n');
        const headers = rows[0].split(',');
        const nameIndex = headers.indexOf('chemical_name');
        const casIndex = headers.indexOf('cas_number');
        
        const chemicalList = rows.slice(1).map(row => {
          const columns = row.split(',');
          return {
            name: columns[nameIndex],
            cas: columns[casIndex]
          };
        }).filter(chem => chem.name && chem.cas);
        
        setChemicals(chemicalList);
      } catch (error) {
        console.error('Error loading chemical data:', error);
      }
    };
    
    fetchChemicals();
  }, []);
  
  // Filter chemicals based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = chemicals.filter(chem => 
        chem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chem.cas.includes(searchTerm)
      );
      setFilteredChemicals(filtered.slice(0, 8)); // Limit to 8 results
    } else {
      setFilteredChemicals([]);
    }
  }, [searchTerm, chemicals]);
  
  // Add chemical to selected list
  const addChemical = (chemical) => {
    if (!selectedChemicals.some(c => c.cas === chemical.cas)) {
      setSelectedChemicals([...selectedChemicals, { ...chemical, value: '' }]);
      setSearchTerm('');
      setFilteredChemicals([]);
    }
  };
  
  // Remove chemical from selected list
  const removeChemical = (cas) => {
    setSelectedChemicals(selectedChemicals.filter(c => c.cas !== cas));
  };
  
  // Update chemical value
  const updateChemicalValue = (cas, value) => {
    setSelectedChemicals(selectedChemicals.map(chem => 
      chem.cas === cas ? { ...chem, value } : chem
    ));
  };
  
  // Run model
  const handleRunModel = () => {
    const formData = {
      pressure,
      temperature,
      holeSize,
      releaseElevation,
      poolConfinementArea,
      releaseBasis,
      releaseQuantity,
      isMolarComposition,
      chemicals: selectedChemicals
    };
    
    console.log('Running model with data:', formData);
    // Here you would send the data to your Flask backend
  };
  
  return (
    <div className="phast-form-container">
      <h1>PHAST Model Input</h1>
      
      <div className="form-section">
        <h2>Release Parameters</h2>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="pressure">Pressure (psig)</label>
            <input
              type="number"
              id="pressure"
              value={pressure}
              onChange={(e) => setPressure(e.target.value)}
              placeholder="Enter pressure"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="temperature">Temperature (°F)</label>
            <input
              type="number"
              id="temperature"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="Enter temperature"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="holeSize">Hole Size (in)</label>
            <input
              type="number"
              id="holeSize"
              value={holeSize}
              onChange={(e) => setHoleSize(e.target.value)}
              placeholder="Enter hole size"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="releaseElevation">Release Elevation (ft)</label>
            <input
              type="number"
              id="releaseElevation"
              value={releaseElevation}
              onChange={(e) => setReleaseElevation(e.target.value)}
              placeholder="Enter release elevation"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="poolConfinementArea">Pool Confinement Area (ft²)</label>
            <input
              type="number"
              id="poolConfinementArea"
              value={poolConfinementArea}
              onChange={(e) => setPoolConfinementArea(e.target.value)}
              placeholder="Enter pool confinement area"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="releaseBasis">Release Basis</label>
            <select
              id="releaseBasis"
              value={releaseBasis}
              onChange={(e) => setReleaseBasis(e.target.value)}
            >
              <option value="mass">Mass</option>
              <option value="volume">Volume</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="releaseQuantity">
              Release Quantity ({releaseBasis === 'mass' ? 'lbs' : 'gal'})
            </label>
            <input
              type="number"
              id="releaseQuantity"
              value={releaseQuantity}
              onChange={(e) => setReleaseQuantity(e.target.value)}
              placeholder={`Enter quantity in ${releaseBasis === 'mass' ? 'lbs' : 'gal'}`}
            />
          </div>
        </div>
      </div>
      
      <div className="form-section">
        <h2>Chemical Components</h2>
        
        <div className="composition-type">
          <label>
            <input
              type="checkbox"
              checked={isMolarComposition}
              onChange={(e) => setIsMolarComposition(e.target.checked)}
            />
            Molar Composition
          </label>
        </div>
        
        <div className="chemical-search">
          <label htmlFor="chemicalSearch">Add Chemical Component</label>
          <input
            type="text"
            id="chemicalSearch"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by chemical name or CAS number"
          />
          
          {filteredChemicals.length > 0 && (
            <ul className="chemical-dropdown">
              {filteredChemicals.map((chem) => (
                <li key={chem.cas} onClick={() => addChemical(chem)}>
                  {chem.name} (CAS: {chem.cas})
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="selected-chemicals">
          {selectedChemicals.length > 0 ? (
            <ul>
              {selectedChemicals.map((chem) => (
                <li key={chem.cas} className="chemical-item">
                  <span className="chemical-name">{chem.name} (CAS: {chem.cas})</span>
                  <div className="chemical-controls">
                    <input
                      type="number"
                      value={chem.value}
                      onChange={(e) => updateChemicalValue(chem.cas, e.target.value)}
                      placeholder={`Enter ${isMolarComposition ? 'molar' : 'mass'} fraction`}
                    />
                    <button
                      className="remove-chemical"
                      onClick={() => removeChemical(chem.cas)}
                      aria-label="Remove chemical"
                    >
                      <span className="remove-icon">×</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-chemicals">
              No chemicals added. Search and add chemicals to the mixture.
            </div>
          )}
        </div>
      </div>
      
      <div className="form-actions">
        <button
          className="run-model-btn"
          onClick={handleRunModel}
          disabled={selectedChemicals.length === 0}
        >
          Run Model
        </button>
      </div>
    </div>
  );
};

export default PhastInputForm;