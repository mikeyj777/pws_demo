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
  
   // Create particle effect
   useEffect(() => {
    // Create the particles container if it doesn't exist
    let particlesContainer = document.querySelector('.particles-container');
    
    if (!particlesContainer) {
      particlesContainer = document.createElement('div');
      particlesContainer.classList.add('particles-container');
      
      // Find the header element and append the particles container to it
      const header = document.querySelector('.phast-header');
      if (header) {
        header.appendChild(particlesContainer);
        
        // Now create the particles
        for (let i = 0; i < 50; i++) {
          const particle = document.createElement('div');
          particle.classList.add('particle');
          
          // Random size between 2px and 6px
          const size = Math.random() * 4 + 2;
          particle.style.width = `${size}px`;
          particle.style.height = `${size}px`;
          
          // Random position
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          
          // Random opacity
          particle.style.opacity = Math.random() * 0.5;
          
          // Random animation
          const duration = Math.random() * 20 + 10;
          const delay = Math.random() * 5;
          particle.style.animationDuration = `${duration}s`;
          particle.style.animationDelay = `${delay}s`;
          
          particlesContainer.appendChild(particle);
        }
        
        // Add a glow effect
        const glowEffect = document.createElement('div');
        glowEffect.classList.add('glow-effect');
        header.appendChild(glowEffect);
      }
    }
    
    // Cleanup function
    return () => {
      if (particlesContainer && particlesContainer.parentNode) {
        particlesContainer.parentNode.removeChild(particlesContainer);
      }
      const glowEffect = document.querySelector('.glow-effect');
      if (glowEffect && glowEffect.parentNode) {
        glowEffect.parentNode.removeChild(glowEffect);
      }
    };
  }, []);

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
    <div className="phast-container">
      <header className="phast-header">
        <div className="header-content">
          <div className="logo-container">
            <div className="logo">
              <span>PH</span>
            </div>
          </div>
          <h1 className="app-title">PHAST Web Application</h1>
          <p className="app-subtitle">Process Hazard Analysis Simulation Tool</p>
        </div>
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
            {/* Example form field */}
            <div className="form-group">
              <label className="form-label">Pressure</label>
              <div className="form-control">
                <input type="number" placeholder="0.0" />
                <div className="unit-badge">psig</div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Temperature</label>
              <div className="form-control">
                <input type="number" placeholder="0.0" />
                <div className="unit-badge">°F</div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Hole Size</label>
              <div className="form-control">
                <input type="number" placeholder="0.0" />
                <div className="unit-badge">in</div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Release Elevation</label>
              <div className="form-control">
                <input type="number" placeholder="0.0" />
                <div className="unit-badge">ft</div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Pool Confinement Area</label>
              <div className="form-control">
                <input type="number" placeholder="0.0" />
                <div className="unit-badge">ft²</div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Release Basis</label>
              <div className="form-control select-wrapper">
                <select>
                  <option value="mass">Mass</option>
                  <option value="volume">Volume</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Release Quantity</label>
              <div className="form-control">
                <input type="number" placeholder="0.0" />
                <div className="unit-badge">lbs</div>
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
          
          <div className="composition-toggle">
            <label className="toggle-label">
              Molar Composition
              <div className="toggle-switch">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </div>
            </label>
          </div>
        </div>
        <div className="card-body">
          <div className="search-container">
            <div className="search-input-wrapper">
              <div className="search-icon">⌕</div>
              <input
                type="text"
                className="search-input"
                placeholder="Search chemical by name or CAS number"
              />
            </div>
            
            {/* Example Chemical Search Results */}
            <div className="search-results" style={{ display: 'none' }}>
              <div className="search-result-item">
                <div className="result-primary">Methane</div>
                <div className="result-secondary">CAS: 74-82-8</div>
              </div>
              <div className="search-result-item">
                <div className="result-primary">Ethane</div>
                <div className="result-secondary">CAS: 74-84-0</div>
              </div>
            </div>
          </div>
          
          <div className="chemical-list">
            {/* Example Chemical Item */}
            <div className="chemical-item">
              <div className="chemical-info">
                <div className="chemical-name">Methane</div>
                <div className="chemical-cas">CAS: 74-82-8</div>
              </div>
              <div className="chemical-controls">
                <div className="value-control">
                  <input type="number" placeholder="0.0" value="45" />
                  <div className="value-badge">wt %</div>
                </div>
                <button className="remove-btn">×</button>
              </div>
            </div>
            
            <div className="chemical-item">
              <div className="chemical-info">
                <div className="chemical-name">Ethane</div>
                <div className="chemical-cas">CAS: 74-84-0</div>
              </div>
              <div className="chemical-controls">
                <div className="value-control">
                  <input type="number" placeholder="0.0" value="30" />
                  <div className="value-badge">wt %</div>
                </div>
                <button className="remove-btn">×</button>
              </div>
            </div>
            
            <div className="chemical-item">
              <div className="chemical-info">
                <div className="chemical-name">Propane</div>
                <div className="chemical-cas">CAS: 74-98-6</div>
              </div>
              <div className="chemical-controls">
                <div className="value-control">
                  <input type="number" placeholder="0.0" value="25" />
                  <div className="value-badge">wt %</div>
                </div>
                <button className="remove-btn">×</button>
              </div>
            </div>
            
            {/* Empty state (hidden when there are chemicals)
            <div className="empty-state">
              <div className="empty-icon">🧪</div>
              <div className="empty-title">No chemicals added</div>
              <div className="empty-description">
                Use the search bar above to find and add chemicals to your mixture.
              </div>
            </div>
            */}
          </div>
        </div>
      </div>
      
      <div className="action-bar">
        <button className="run-btn">Run Model</button>
      </div>
    </div>
  );
};

export default PhastInputForm;