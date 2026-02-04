import React, { useState, useRef, useEffect } from 'react';
import '../styles/components/GameFlowEditor.css';

const GameFlowEditor = ({ language, onExport, readOnly = false, data = null }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [backgroundImg, setBackgroundImg] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectSourceId, setConnectSourceId] = useState(null);
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (data) {
      if (data.nodes) setNodes(data.nodes);
      if (data.edges) setEdges(data.edges);
      if (data.backgroundImage) setBackgroundImg(data.backgroundImage);
    }
  }, [data]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!readOnly && (e.key === 'Delete' || e.key === 'Backspace')) {
        deleteSelected();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, selectedEdgeId, nodes, edges, readOnly]); // Dependencies for deleteSelected closure

  // Helper to get text based on language
  const t = (en, zh) => (language === 'zh' ? zh : en);

  const handleImageUpload = (e) => {
    if (readOnly) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setBackgroundImg(evt.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addNode = (type) => {
    if (readOnly) return;
    const id = `node_${Date.now()}`;
    const newNode = {
      id,
      type,
      x: 100,
      y: 100,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    };
    setNodes([...nodes, newNode]);
  };

  const updateNodePosition = (id, x, y) => {
    if (readOnly) return;
    setNodes(nodes.map((n) => (n.id === id ? { ...n, x, y } : n)));
  };

  const handleMouseDown = (e, id) => {
    if (readOnly) return;
    if (isConnecting) {
      handleConnect(id);
      return;
    }
    e.stopPropagation();
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
    
    // Drag logic
    const startX = e.clientX;
    const startY = e.clientY;
    const node = nodes.find((n) => n.id === id);
    const initialX = node.x;
    const initialY = node.y;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      updateNodePosition(id, initialX + dx, initialY + dy);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleConnect = (id) => {
    if (readOnly) return;
    if (!connectSourceId) {
      setConnectSourceId(id);
    } else {
      if (connectSourceId !== id) {
        // Prevent duplicate edges
        const exists = edges.find(
          (e) => e.source === connectSourceId && e.target === id
        );
        if (!exists) {
          setEdges([
            ...edges,
            { 
              id: `edge_${Date.now()}`, 
              source: connectSourceId, 
              target: id, 
              type: 'straight', 
              label: '' 
            },
          ]);
        }
      }
      setConnectSourceId(null);
      setIsConnecting(false);
    }
  };

  const handleEdgeClick = (e, id) => {
    if (readOnly) return;
    e.stopPropagation();
    setSelectedEdgeId(id);
    setSelectedNodeId(null);
  };

  const updateEdge = (id, updates) => {
    setEdges(edges.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteSelected = () => {
    if (readOnly) return;
    if (selectedNodeId) {
      setNodes(nodes.filter((n) => n.id !== selectedNodeId));
      setEdges(edges.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
      setSelectedNodeId(null);
    } else if (selectedEdgeId) {
      setEdges(edges.filter((e) => e.id !== selectedEdgeId));
      setSelectedEdgeId(null);
    }
  };

  const handleExport = () => {
    const data = {
      backgroundImage: backgroundImg,
      nodes,
      edges,
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game_flow.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    if (onExport) onExport(data);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target.result);
          if (data.nodes && data.edges) {
            setNodes(data.nodes);
            setEdges(data.edges);
            if (data.backgroundImage) setBackgroundImg(data.backgroundImage);
            if (onExport) onExport(data); // Also update parent if import happens here
          }
        } catch (err) {
          console.error("Invalid JSON", err);
          alert(t("Invalid JSON file", "无效的 JSON 文件"));
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={`game-flow-editor ${readOnly ? 'read-only' : ''}`}>
      {!readOnly && (
        <div className="editor-toolbar">
          <div className="toolbar-section">
            <h4>{t('Nodes', '节点')}</h4>
            <button onClick={() => addNode('start')}>{t('Start', '开始')}</button>
            <button onClick={() => addNode('action')}>{t('Action', '行动')}</button>
            <button onClick={() => addNode('decision')}>{t('Decision', '判断')}</button>
            <button onClick={() => addNode('end')}>{t('End', '结束')}</button>
          </div>
          
          <div className="toolbar-section">
            <h4>{t('Tools', '工具')}</h4>
            <button 
              className={isConnecting ? 'active' : ''} 
              onClick={() => { setIsConnecting(!isConnecting); setConnectSourceId(null); }}
            >
              {isConnecting ? t('Cancel Connect', '取消连线') : t('Connect', '连线')}
            </button>
            <button onClick={deleteSelected} disabled={!selectedNodeId && !selectedEdgeId}>
              {t('Delete Selected', '删除选中')}
            </button>
          </div>

          {selectedEdgeId && (
            <div className="toolbar-section">
              <h4>{t('Edge', '连线')}</h4>
              <button onClick={() => updateEdge(selectedEdgeId, { type: 'straight' })} className={edges.find(e => e.id === selectedEdgeId)?.type === 'straight' ? 'active' : ''}>
                {t('Straight', '直线')}
              </button>
              <button onClick={() => updateEdge(selectedEdgeId, { type: 'curved' })} className={edges.find(e => e.id === selectedEdgeId)?.type === 'curved' ? 'active' : ''}>
                {t('Curved', '曲线')}
              </button>
              <input 
                className="edge-label-input"
                placeholder={t('Label', '标签')}
                value={edges.find(e => e.id === selectedEdgeId)?.label || ''}
                onChange={(e) => updateEdge(selectedEdgeId, { label: e.target.value })}
              />
            </div>
          )}

          <div className="toolbar-section">
            <h4>{t('File', '文件')}</h4>
            <label className="file-btn">
              {t('Upload BG', '上传背景')}
              <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            </label>
            <button onClick={handleExport}>{t('Export JSON', '导出 JSON')}</button>
            <label className="file-btn">
              {t('Import JSON', '导入 JSON')}
              <input type="file" accept=".json" onChange={handleImport} hidden />
            </label>
          </div>
        </div>
      )}

      <div className="editor-canvas" ref={canvasRef} onClick={() => !readOnly && setSelectedNodeId(null) && setSelectedEdgeId(null)}>
        {backgroundImg && <img src={backgroundImg} alt="Background" className="canvas-bg" />}
        
        <svg className="edges-layer">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#ff4d00" />
            </marker>
          </defs>
          {edges.map((edge) => {
            const source = nodes.find((n) => n.id === edge.source);
            const target = nodes.find((n) => n.id === edge.target);
            if (!source || !target) return null;

            const x1 = source.x + 60;
            const y1 = source.y + 30;
            const x2 = target.x + 60;
            const y2 = target.y + 30;
            
            let d = '';
            let midX = (x1 + x2) / 2;
            let midY = (y1 + y2) / 2;

            if (edge.type === 'curved') {
              // Calculate control points for a nice curve
              // If nodes are far apart horizontally, curve horizontally
              const dx = Math.abs(x2 - x1);
              const dy = Math.abs(y2 - y1);
              
              if (dx > dy) {
                 d = `M ${x1} ${y1} C ${x1 + dx/2} ${y1}, ${x2 - dx/2} ${y2}, ${x2} ${y2}`;
              } else {
                 d = `M ${x1} ${y1} C ${x1} ${y1 + dy/2}, ${x2} ${y2 - dy/2}, ${x2} ${y2}`;
              }
              
              // Approximate midpoint for label (Bezier curve midpoint calculation is complex, simple avg is roughly ok for symmetric curves)
              // Better approximation for cubic bezier t=0.5:
              // B(t) = (1-t)^3 P0 + 3(1-t)^2 t P1 + 3(1-t) t^2 P2 + t^3 P3
              // Here P0=(x1,y1), P3=(x2,y2). P1, P2 are control points.
              // Let's stick to simple avg for now, usually close enough visually for label placement
            } else {
              d = `M ${x1} ${y1} L ${x2} ${y2}`;
            }

            const isSelected = selectedEdgeId === edge.id;

            return (
              <g key={edge.id} onClick={(e) => handleEdgeClick(e, edge.id)} className={`edge-group ${isSelected ? 'selected' : ''}`}>
                <path
                  d={d}
                  stroke={isSelected ? '#fff' : '#ff4d00'}
                  strokeWidth={isSelected ? '3' : '2'}
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  style={{ cursor: 'pointer', transition: 'stroke 0.2s' }}
                />
                {/* Hit area for easier selection */}
                <path
                  d={d}
                  stroke="transparent"
                  strokeWidth="10"
                  fill="none"
                  style={{ cursor: 'pointer' }}
                />
                {edge.label && (
                  <foreignObject x={midX - 40} y={midY - 10} width="80" height="20">
                    <div className="edge-label-container">
                      <span className="edge-label">{edge.label}</span>
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </svg>

        {nodes.map((node) => (
          <div
            key={node.id}
            className={`flow-node type-${node.type} ${selectedNodeId === node.id ? 'selected' : ''}`}
            style={{ left: node.x, top: node.y }}
            onMouseDown={(e) => handleMouseDown(e, node.id)}
          >
            <div className="node-content">
              {node.type === 'decision' ? '◇' : ''}
              <input
                value={node.label}
                onChange={(e) => {
                    const newLabel = e.target.value;
                    setNodes(nodes.map(n => n.id === node.id ? {...n, label: newLabel} : n));
                }}
                onMouseDown={(e) => e.stopPropagation()} // Prevent drag when editing text
              />
            </div>
            {isConnecting && connectSourceId === node.id && <div className="connecting-indicator" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameFlowEditor;
