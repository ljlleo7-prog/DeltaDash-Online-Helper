import React, { useState, useEffect, useContext, useCallback } from 'react';
import Papa from 'papaparse';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { LanguageContext } from '../contexts/LanguageContext';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

function StrategyPage() {
  const [circuitData, setCircuitData] = useState([]);
  const [selectedCircuit, setSelectedCircuit] = useState('');
  const [stints, setStints] = useState([]);
  const [lapTimes, setLapTimes] = useState([]);
  const [totalDelta, setTotalDelta] = useState(0);
  const [circuits, setCircuits] = useState([]);
  const [tireTypes, setTireTypes] = useState([]);
  const [translations, setTranslations] = useState({});
  const { language } = useContext(LanguageContext);
  const [calculationMode, setCalculationMode] = useState('refined'); // 'refined' or 'coarse'
  const [totalPitLoss, setTotalPitLoss] = useState(0); // Add totalPitLoss to state

  // Load translations based on language
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL || ''}/translations/${language}.json`);
        if (response.ok) {
          const data = await response.json();
          setTranslations(data);
        }
      } catch (error) {
        console.error('Error loading translations:', error);
      }
    };

    loadTranslations();
  }, [language]);

  // Helper function to get text based on language
  const getText = (key) => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key; // Fallback to key if translation not found
    }
    
    return value || key;
  };

  // List of possible CSV file paths for different build environments
  const csvPaths = [
    '/tire_degradation_data.csv',                    // Production build (served from public/)
    './tire_degradation_data.csv',                   // Relative path in development
    '../public/tire_degradation_data.csv',           // Relative to src/components
    '../../public/tire_degradation_data.csv',        // Relative to src/components
    '/public/tire_degradation_data.csv',             // Absolute path in development
    '/build/tire_degradation_data.csv',              // Build directory
    '/generated/tire_degradation_data.csv',          // Generated directory
    'tire_degradation_data.csv'                      // Same directory (fallback)
  ];

  // Function to try loading CSV from multiple paths
  const loadCSVData = async () => {
    for (const path of csvPaths) {
      try {
        console.log(`Trying to load CSV from: ${path}`);
        const response = await fetch(path);
        
        if (!response.ok) {
          console.log(`Path ${path} not found, trying next path...`);
          continue;
        }
        
        const csvText = await response.text();
        
        return new Promise((resolve, reject) => {
          Papa.parse(csvText, {
            header: true,
            complete: (result) => {
              console.log(`CSV loaded successfully from: ${path}`);
              console.log('CSV parsed successfully:', result.data);
              setCircuitData(result.data);
              
              // Extract unique circuits
              const uniqueCircuits = [...new Set(result.data.map(item => item.circuit))].filter(Boolean);
              setCircuits(uniqueCircuits);
              
              if (uniqueCircuits.length > 0) {
                const firstCircuit = uniqueCircuits[0];
                setSelectedCircuit(firstCircuit);
                
                // Extract tire types for the selected circuit
                const circuitTireTypes = [...new Set(result.data
                  .filter(item => item.circuit === firstCircuit)
                  .map(item => item.tire_type))].filter(Boolean);
                setTireTypes(circuitTireTypes);
              }
              resolve(result.data);
            },
            error: (error) => {
              console.error(`Error parsing CSV from ${path}:`, error);
              reject(error);
            }
          });
        });
        
      } catch (error) {
        console.log(`Failed to load from ${path}:`, error.message);
        // Continue to next path
      }
    }
    
    // If all paths fail, use fallback data
    throw new Error('All CSV paths failed, using fallback data');
  };

  // Load CSV data on component mount
  useEffect(() => {
    loadCSVData()
      .catch(error => {
        console.error('Error loading CSV data:', error);
        // Set up default circuits and tires if CSV fails to load
        console.log('Using fallback data...');
        const fallbackData = [
          { circuit: 'Monaco', total_laps: '78', tire_type: 'Soft', wear_rate_per_lap: '1.8', degradation_0: '0.0', degradation_10: '0.2', degradation_20: '0.5', degradation_30: '0.9', degradation_40: '1.4', degradation_50: '2.0', degradation_60: '2.7', degradation_70: '3.5', degradation_80: '4.4', degradation_90: '5.4', degradation_100: '6.5' },
          { circuit: 'Monaco', total_laps: '78', tire_type: 'Medium', wear_rate_per_lap: '1.2', degradation_0: '0.0', degradation_10: '0.1', degradation_20: '0.3', degradation_30: '0.6', degradation_40: '1.0', degradation_50: '1.5', degradation_60: '2.1', degradation_70: '2.8', degradation_80: '3.6', degradation_90: '4.5', degradation_100: '5.5' },
          { circuit: 'Monaco', total_laps: '78', tire_type: 'Hard', wear_rate_per_lap: '0.8', degradation_0: '0.0', degradation_10: '0.0', degradation_20: '0.1', degradation_30: '0.3', degradation_40: '0.6', degradation_50: '1.0', degradation_60: '1.5', degradation_70: '2.1', degradation_80: '2.8', degradation_90: '3.6', degradation_100: '4.5' },
          { circuit: 'Silverstone', total_laps: '52', tire_type: 'Soft', wear_rate_per_lap: '2.1', degradation_0: '0.0', degradation_10: '0.3', degradation_20: '0.7', degradation_30: '1.2', degradation_40: '1.8', degradation_50: '2.5', degradation_60: '3.3', degradation_70: '4.2', degradation_80: '5.2', degradation_90: '6.3', degradation_100: '7.5' },
          { circuit: 'Silverstone', total_laps: '52', tire_type: 'Medium', wear_rate_per_lap: '1.5', degradation_0: '0.0', degradation_10: '0.2', degradation_20: '0.5', degradation_30: '0.9', degradation_40: '1.4', degradation_50: '2.0', degradation_60: '2.7', degradation_70: '3.5', degradation_80: '4.4', degradation_90: '5.4', degradation_100: '6.5' },
          { circuit: 'Silverstone', total_laps: '52', tire_type: 'Hard', wear_rate_per_lap: '1.0', degradation_0: '0.0', degradation_10: '0.1', degradation_20: '0.3', degradation_30: '0.6', degradation_40: '1.0', degradation_50: '1.5', degradation_60: '2.1', degradation_70: '2.8', degradation_80: '3.6', degradation_90: '4.5', degradation_100: '5.5' }
        ];
        setCircuitData(fallbackData);
        
        const fallbackCircuits = ['Monaco', 'Silverstone'];
        setCircuits(fallbackCircuits);
        setSelectedCircuit('Monaco');
        setTireTypes(['Soft', 'Medium', 'Hard']);
      });
  }, []);

  // Update tire types when selected circuit changes
  useEffect(() => {
    if (selectedCircuit && circuitData.length > 0) {
      const circuitTireTypes = [...new Set(circuitData
        .filter(item => item.circuit === selectedCircuit)
        .map(item => item.tire_type))].filter(Boolean);
      setTireTypes(circuitTireTypes);
      
      console.log('Selected Circuit:', selectedCircuit);
      console.log('Tire Types for selected circuit:', circuitTireTypes);
    }
  }, [selectedCircuit, circuitData]);

  // Calculate lap times based on strategy
  const calculateStrategy = useCallback(() => {
    if (!selectedCircuit || stints.length === 0) return;

    const circuitInfo = circuitData.find(item => item.circuit === selectedCircuit);
    if (!circuitInfo) return;

    const totalLaps = parseInt(circuitInfo.total_laps);
    const lapTimesArray = [];
    let currentLap = 1;
    let cumulativeDelta = 0;
    let totalPitLoss = 0; // Local variable for calculation

    stints.forEach((stint, stintIndex) => {
      const stintData = circuitData.find(item => 
        item.circuit === selectedCircuit && item.tire_type === stint.tire
      );
      
      if (!stintData) return;

      // Add pit time loss for each tire change (except first stint)
      if (stintIndex > 0) {
        const pitLoss = parseFloat(stintData.pit_loss);
        cumulativeDelta += pitLoss;
        totalPitLoss += pitLoss;
        
        // Add pit stop entry to lap times array
        lapTimesArray.push({
          lap: currentLap,
          stint: stintIndex + 1,
          tire: 'PIT',
          degradation: 0,
          lapDelta: pitLoss,
          cumulativeDelta: cumulativeDelta,
          pushConserve: 0,
          isPitStop: true
        });
      }

      const baseWearRate = parseFloat(stintData.wear_rate_per_lap);
      const boxLap = Math.min(parseInt(stint.boxLap), totalLaps);
      const stintLaps = stintIndex === stints.length - 1 ? 
        totalLaps - currentLap + 1 : 
        boxLap - currentLap + 1;

      // Calculate push/conserve effect per lap based on stint length
      const pushPerLap = stint.pushConserve / stintLaps; // Divide push by stint length
      const wearRateMultiplier = 1 + (pushPerLap * 0.5); // +5% wear per 0.1 push
      const timeModifierPerLap = -pushPerLap * 1.5; // -0.15s per lap per 0.1 push

      for (let lap = 1; lap <= stintLaps && currentLap <= totalLaps; lap++, currentLap++) {
        // Apply push/conserve wear rate multiplier
        const adjustedWearRate = baseWearRate * wearRateMultiplier;
        
        const degradation = Math.min(lap * adjustedWearRate, 100);
        const degradationKey = `degradation_${Math.floor(degradation / 10) * 10}`;
        let degradationDelta = parseFloat(stintData[degradationKey]);
        
        // Apply push/conserve time modifier per lap
        let lapDelta = degradationDelta + timeModifierPerLap;
        
        // Apply rounding for coarse mode (nearest 0.5s)
        if (calculationMode === 'coarse') {
          lapDelta = Math.round(lapDelta * 2) / 2; // Round to nearest 0.5
        }
        
        cumulativeDelta += lapDelta;
        
        lapTimesArray.push({
          lap: currentLap,
          stint: stintIndex + 1,
          tire: stint.tire,
          degradation: degradation,
          lapDelta: lapDelta,
          cumulativeDelta: cumulativeDelta,
          pushConserve: stint.pushConserve,
          isPitStop: false
        });
      }
    });

    setLapTimes(lapTimesArray);
    setTotalDelta(cumulativeDelta);
    setTotalPitLoss(totalPitLoss); // Update state with calculated pit loss
  }, [selectedCircuit, stints, circuitData, calculationMode]);

  // Automatically recalculate strategy when stint inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedCircuit && stints.length > 0) {
        calculateStrategy();
      }
    }, 200); // 3 second delay to ensure page is fully loaded
    
    return () => clearTimeout(timer); // Cleanup on unmount
  }, [selectedCircuit, stints, calculateStrategy, calculationMode]);

  // Debug logging
  useEffect(() => {
    console.log('Circuit Data:', circuitData);
    console.log('Circuits:', circuits);
    console.log('Selected Circuit:', selectedCircuit);
    console.log('Tire Types:', tireTypes);
  }, [circuitData, circuits, selectedCircuit, tireTypes]);

  // Add new stint
  const addStint = () => {
    const totalLaps = parseInt(circuitData.find(item => item.circuit === selectedCircuit)?.total_laps || 78);
    
    let newBoxLap = totalLaps;
    if (stints.length > 0) {
      // New stint should have boxLap equal to total laps (it becomes the last stint)
      newBoxLap = totalLaps;
      
      // Update the previous last stint to have a boxLap less than total laps
      const updatedStints = [...stints];
      const lastStintIndex = stints.length - 1;
      updatedStints[lastStintIndex] = {
        ...updatedStints[lastStintIndex],
        boxLap: Math.max(1, Math.min(totalLaps - 1, stints[lastStintIndex].boxLap))
      };
      setStints(updatedStints);
    }
    
    const newStint = {
      id: Date.now(),
      tire: tireTypes[0] || 'Soft',
      pushConserve: 0,
      boxLap: newBoxLap
    };
    setStints([...stints, newStint]);
  };

  // Initialize with one stint when circuit is selected
  useEffect(() => {
    if (selectedCircuit && tireTypes.length > 0 && stints.length === 0) {
      const totalLaps = parseInt(circuitData.find(item => item.circuit === selectedCircuit)?.total_laps || 78);
      const initialStint = {
        id: Date.now(),
        tire: tireTypes[0],
        pushConserve: 0,
        boxLap: totalLaps
      };
      setStints([initialStint]);
    }
  }, [selectedCircuit, tireTypes]);

  // Remove stint
  const removeStint = (id) => {
    const updatedStints = stints.filter(stint => stint.id !== id);
    
    if (updatedStints.length > 0) {
      // Update the new last stint to have boxLap equal to total laps
      const totalLaps = parseInt(circuitData.find(item => item.circuit === selectedCircuit)?.total_laps || 78);
      const lastStintIndex = updatedStints.length - 1;
      updatedStints[lastStintIndex] = {
        ...updatedStints[lastStintIndex],
        boxLap: totalLaps
      };
    }
    
    setStints(updatedStints);
  };

  // Update stint
  const updateStint = (id, field, value) => {
    setStints(stints.map(stint => {
      if (stint.id === id) {
        const updatedStint = { ...stint, [field]: value };
        
        // If updating boxLap, validate the constraints
        if (field === 'boxLap') {
          const stintIndex = stints.findIndex(s => s.id === id);
          const totalLaps = parseInt(circuitData.find(item => item.circuit === selectedCircuit)?.total_laps || 78);
          
          // For last stint, boxLap must equal total laps
          if (stintIndex === stints.length - 1) {
            updatedStint.boxLap = totalLaps;
          } else {
            // For non-last stints, boxLap must be less than next stint's boxLap
            const nextStintBoxLap = stints[stintIndex + 1].boxLap;
            if (value >= nextStintBoxLap) {
              updatedStint.boxLap = Math.max(1, nextStintBoxLap - 1);
            }
            
            // Also ensure boxLap is at least 1 and at most totalLaps
            updatedStint.boxLap = Math.max(1, Math.min(totalLaps, updatedStint.boxLap));
          }
        }
        
        return updatedStint;
      }
      return stint;
    }));
  };

  // When circuit changes, update all stints' boxLap constraints
  useEffect(() => {
    if (selectedCircuit && stints.length > 0) {
      const totalLaps = parseInt(circuitData.find(item => item.circuit === selectedCircuit)?.total_laps || 78);
      
      const updatedStints = stints.map((stint, index) => {
        if (index === stints.length - 1) {
          // Last stint: boxLap must equal total laps
          return { ...stint, boxLap: totalLaps };
        } else {
          // Non-last stints: ensure boxLap is less than next stint's boxLap
          const nextStintBoxLap = stints[index + 1].boxLap;
          const constrainedBoxLap = Math.min(stint.boxLap, nextStintBoxLap - 1);
          return { ...stint, boxLap: Math.max(1, constrainedBoxLap) };
        }
      });
      
      setStints(updatedStints);
    }
  }, [selectedCircuit, circuitData]);

  // Get color for lap delta
  const getDeltaColor = (delta) => {
    if (delta < 0.5) return '#4CAF50'; // Green for good
    if (delta < 1.5) return '#FFC107'; // Yellow for medium
    return '#F44336'; // Red for bad
  };

  // Get stint color
  const getStintColor = (stintIndex) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    return colors[stintIndex % colors.length];
  };

  // Chart configuration for lap time delta
  const lapTimeChartConfig = {
    labels: lapTimes.map(lap => lap.lap),
    datasets: [
      {
        label: 'Lap Time Delta (seconds)',
        data: lapTimes.map(lap => lap.lapDelta),
        borderColor: '#4CAF50',
        backgroundColor: lapTimes.map(lap => getDeltaColor(lap.lapDelta)),
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#e6e6e6'
        }
      },
      title: {
        display: true,
        text: 'Lap Time Delta (seconds)',
        color: '#e6e6e6',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Delta (seconds)',
          color: '#e6e6e6'
        },
        ticks: {
          color: '#e6e6e6'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Lap Number',
          color: '#e6e6e6'
        },
        ticks: {
          color: '#e6e6e6'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  return (
    <section id="strategy-page" className="page-content">
      <div className="strategy-container">
        <h2 className="strategy-title">{getText('strategy.title')}</h2>
        
        {/* Circuit Selection */}
        <div className="circuit-section">
          <h3>{getText('strategy.circuit_selection')}</h3>
          <select 
            value={selectedCircuit} 
            onChange={(e) => setSelectedCircuit(e.target.value)}
            className="circuit-selector"
          >
            <option value="">{getText('strategy.select_circuit')}</option>
            {circuits.map(circuit => (
              <option key={circuit} value={circuit}>{circuit}</option>
            ))}
          </select>
          {selectedCircuit && (
            <div className="circuit-info">
              <p>{getText('strategy.total_laps')}: {circuitData.find(item => item.circuit === selectedCircuit)?.total_laps}</p>
            </div>
          )}
        </div>

        {/* Stint Management */}
        <div className="stint-section">
          <div className="section-header">
            <h3>{getText('strategy.race_strategy_stints')}</h3>
            <button onClick={addStint} className="add-stint-btn">{getText('strategy.add_stint')}</button>
          </div>
          
          {/* Calculation Mode Toggle */}
          <div className="calculation-mode-toggle">
            <label>{getText('strategy.calculation_mode')}:</label>
            <div className="toggle-buttons">
              <button 
                className={`toggle-btn ${calculationMode === 'refined' ? 'active' : ''}`}
                onClick={() => setCalculationMode('refined')}
              >
                {getText('strategy.refined')}
              </button>
              <button 
                className={`toggle-btn ${calculationMode === 'coarse' ? 'active' : ''}`}
                onClick={() => setCalculationMode('coarse')}
              >
                {getText('strategy.coarse')}
              </button>
            </div>
            <span className="hint">{getText('strategy.calculation_mode_hint')}</span>
          </div>
          <div className="stint-cards">
            {stints.map((stint, index) => (
              <div key={stint.id} className="stint-card" style={{borderLeftColor: getStintColor(index)}}>
                <div className="stint-header">
                  <h4 className="stint-number">{getText('strategy.stint')} {index + 1}</h4>
                  <button onClick={() => removeStint(stint.id)} className="remove-stint-btn">×</button>
                </div>
                
                <div className="stint-form">
                  <div className="form-group">
                    <label>{getText('strategy.tire_type')}:</label>
                    <select 
                      value={stint.tire} 
                      onChange={(e) => updateStint(stint.id, 'tire', e.target.value)}
                      className="stint-tire-selector"
                    >
                      <option value="">{getText('strategy.select_tire_type')}</option>
                      {tireTypes.map(tire => (
                        <option key={tire} value={tire}>{tire}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>{getText('strategy.push_conserve')}:</label>
                    <input 
                      type="number" 
                      min="-5" 
                      max="5" 
                      value={stint.pushConserve}
                      onChange={(e) => updateStint(stint.id, 'pushConserve', parseInt(e.target.value))}
                      placeholder="0"
                      className="stint-push-conserve"
                    />
                    <span className="hint">{getText('strategy.push_conserve_hint')}</span>
                  </div>
                  
                  <div className="form-group">
                    <label>{getText('strategy.box_lap')}:</label>
                    <input 
                      type="number" 
                      min="1" 
                      max={circuitData.find(item => item.circuit === selectedCircuit)?.total_laps || 78}
                      value={stint.boxLap}
                      onChange={(e) => updateStint(stint.id, 'boxLap', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        <div className="results-section">
          <button onClick={calculateStrategy} className="calculate-btn">
            {getText('strategy.calculate_strategy')}
          </button>
        </div>

        {/* Results */}
        {lapTimes.length > 0 && (
          <div className="results-section">
            <h3>{getText('strategy.strategy_results')}</h3>
            
            {/* Pit Time Loss Summary */}
            <div className="pit-loss-container">
              <h4 className="pit-loss-title">Pit Stop Time Loss</h4>
              <div className="pit-loss-info">
                <p>Total Pit Loss: <span className="pit-loss-value">+{totalPitLoss.toFixed(1)} seconds</span></p>
                <p>Number of Pit Stops: <span className="pit-stops-count">{stints.length - 1}</span></p>
                <p>Average Pit Loss: <span className="pit-loss-average">+{(totalPitLoss / Math.max(1, stints.length - 1)).toFixed(1)} seconds</span></p>
              </div>
            </div>
            
            {/* Lap Time Graph */}
            <div className="graph-container">
              <h4 className="graph-title">{getText('strategy.lap_time_delta')}</h4>
              <div className="lap-time-chart">
                <Bar data={lapTimeChartConfig} options={chartOptions} />
              </div>
            </div>

            {/* Cumulative Delta */}
            <div className="cumulative-delta-container">
              <h4 className="cumulative-delta-title">{getText('strategy.total_race_time_delta')}</h4>
              <div className="cumulative-delta-value">
                {totalDelta >= 0 ? '+' : ''}{totalDelta.toFixed(2)} {language === 'zh' ? '秒' : 'seconds'}
              </div>
            </div>

            {/* Lap Details Table */}
            <div className="lap-details">
              <h4>{getText('strategy.lap_by_lap_analysis')}</h4>
              <div className="lap-table">
                <div className="lap-header">
                  <span>{getText('strategy.lap')}</span>
                  <span>{getText('strategy.stint_number')}</span>
                  <span>{getText('strategy.tire')}</span>
                  <span>{getText('strategy.degradation')}</span>
                  <span>{getText('strategy.delta')}</span>
                  <span>{getText('strategy.cumulative')}</span>
                </div>
                {lapTimes.slice(0, 20).map((lapData) => (
                  <div key={lapData.lap} className={`lap-row ${lapData.isPitStop ? 'pit-stop-row' : ''}`}>
                    <span>{lapData.lap}</span>
                    <span>{lapData.stint}</span>
                    <span className={lapData.isPitStop ? 'pit-stop-tire' : ''}>{lapData.tire}</span>
                    <span>{lapData.degradation.toFixed(1)}%</span>
                    <span style={{color: getDeltaColor(lapData.lapDelta)}}>
                      +{lapData.lapDelta.toFixed(2)}s
                    </span>
                    <span>+{lapData.cumulativeDelta.toFixed(2)}s</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default StrategyPage;