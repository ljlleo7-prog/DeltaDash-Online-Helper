import React, { useState, useEffect } from 'react';
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

  // Load CSV data on component mount
  useEffect(() => {
    fetch('/tire_degradation_data.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            setCircuitData(result.data);
            if (result.data.length > 0) {
              setSelectedCircuit(result.data[0].circuit);
            }
          }
        });
      });
  }, []);

  // Get unique circuits
  const circuits = [...new Set(circuitData.map(item => item.circuit))];

  // Get tire types for selected circuit
  const tireTypes = [...new Set(circuitData
    .filter(item => item.circuit === selectedCircuit)
    .map(item => item.tire_type))];

  // Add new stint
  const addStint = () => {
    const newStint = {
      id: Date.now(),
      tire: tireTypes[0] || 'Soft',
      pushConserve: 0,
      boxLap: 1
    };
    setStints([...stints, newStint]);
  };

  // Remove stint
  const removeStint = (id) => {
    setStints(stints.filter(stint => stint.id !== id));
  };

  // Update stint
  const updateStint = (id, field, value) => {
    setStints(stints.map(stint => 
      stint.id === id ? { ...stint, [field]: value } : stint
    ));
  };

  // Calculate lap times based on strategy
  const calculateStrategy = () => {
    if (!selectedCircuit || stints.length === 0) return;

    const circuitInfo = circuitData.find(item => item.circuit === selectedCircuit);
    if (!circuitInfo) return;

    const totalLaps = parseInt(circuitInfo.total_laps);
    const lapTimesArray = [];
    let currentLap = 1;
    let cumulativeDelta = 0;

    stints.forEach((stint, stintIndex) => {
      const stintData = circuitData.find(item => 
        item.circuit === selectedCircuit && item.tire_type === stint.tire
      );
      
      if (!stintData) return;

      const wearRate = parseFloat(stintData.wear_rate_per_lap);
      const boxLap = Math.min(parseInt(stint.boxLap), totalLaps);
      const stintLaps = stintIndex === stints.length - 1 ? 
        totalLaps - currentLap + 1 : 
        boxLap - currentLap + 1;

      for (let lap = 1; lap <= stintLaps && currentLap <= totalLaps; lap++, currentLap++) {
        const degradation = Math.min(lap * wearRate, 100);
        const degradationKey = `degradation_${Math.floor(degradation / 10) * 10}`;
        const baseDelta = parseFloat(stintData[degradationKey]);
        
        // Apply push/conserve modifier
        const modifier = stint.pushConserve * 0.1; // Each +1 adds 0.1s, each -1 subtracts 0.1s
        const lapDelta = baseDelta + modifier;
        
        cumulativeDelta += lapDelta;
        
        lapTimesArray.push({
          lap: currentLap,
          stint: stintIndex + 1,
          tire: stint.tire,
          degradation: degradation,
          lapDelta: lapDelta,
          cumulativeDelta: cumulativeDelta,
          pushConserve: stint.pushConserve
        });
      }
    });

    setLapTimes(lapTimesArray);
    setTotalDelta(cumulativeDelta);
  };

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
        <h2 className="strategy-title">🏎️ Strategy Simulation</h2>
        
        {/* Circuit Selection */}
        <div className="circuit-section">
          <h3>Circuit Selection</h3>
          <select 
            value={selectedCircuit} 
            onChange={(e) => setSelectedCircuit(e.target.value)}
            className="circuit-selector"
          >
            {circuits.map(circuit => (
              <option key={circuit} value={circuit}>{circuit}</option>
            ))}
          </select>
          {selectedCircuit && (
            <div className="circuit-info">
              <p>Total Laps: {circuitData.find(item => item.circuit === selectedCircuit)?.total_laps}</p>
            </div>
          )}
        </div>

        {/* Stint Management */}
        <div className="stint-section">
          <div className="section-header">
            <h3>Race Strategy Stints</h3>
            <button onClick={addStint} className="add-stint-btn">+ Add Stint</button>
          </div>
          
          <div className="stint-cards">
            {stints.map((stint, index) => (
              <div key={stint.id} className="stint-card" style={{borderLeftColor: getStintColor(index)}}>
                <div className="stint-header">
                  <h4 className="stint-number">Stint {index + 1}</h4>
                  <button onClick={() => removeStint(stint.id)} className="remove-stint-btn">×</button>
                </div>
                
                <div className="stint-form">
                  <div className="form-group">
                    <label>Tire Type:</label>
                    <select 
                      value={stint.tire} 
                      onChange={(e) => updateStint(stint.id, 'tire', e.target.value)}
                      className="stint-tire-selector"
                    >
                      {tireTypes.map(tire => (
                        <option key={tire} value={tire}>{tire}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Push/Conserve:</label>
                    <input 
                      type="number" 
                      min="-5" 
                      max="5" 
                      value={stint.pushConserve}
                      onChange={(e) => updateStint(stint.id, 'pushConserve', parseInt(e.target.value))}
                      placeholder="0"
                      className="stint-push-conserve"
                    />
                    <span className="hint">(+ push, - conserve)</span>
                  </div>
                  
                  <div className="form-group">
                    <label>Box Lap:</label>
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
            🏁 Calculate Strategy
          </button>
        </div>

        {/* Results */}
        {lapTimes.length > 0 && (
          <div className="results-section">
            <h3>Strategy Results</h3>
            
            {/* Lap Time Graph */}
            <div className="graph-container">
              <h4 className="graph-title">Lap Time Delta (seconds)</h4>
              <div className="lap-time-chart">
                <Bar data={lapTimeChartConfig} options={chartOptions} />
              </div>
            </div>

            {/* Cumulative Delta */}
            <div className="cumulative-delta-container">
              <h4 className="cumulative-delta-title">Total Race Time Delta</h4>
              <div className="cumulative-delta-value">
                {totalDelta >= 0 ? '+' : ''}{totalDelta.toFixed(2)} seconds
              </div>
            </div>

            {/* Lap Details Table */}
            <div className="lap-details">
              <h4>Lap-by-Lap Analysis</h4>
              <div className="lap-table">
                <div className="lap-header">
                  <span>Lap</span>
                  <span>Stint</span>
                  <span>Tire</span>
                  <span>Degradation</span>
                  <span>Delta</span>
                  <span>Cumulative</span>
                </div>
                {lapTimes.slice(-20).map((lapData) => (
                  <div key={lapData.lap} className="lap-row">
                    <span>{lapData.lap}</span>
                    <span>{lapData.stint}</span>
                    <span>{lapData.tire}</span>
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