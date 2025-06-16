import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
// OrbitControls não disponível, implementando controles personalizados

const HH3DVisualization = () => {
  const mountRef = useRef(null);
  const controlsRef = useRef(null);
  
  // Estado para os valores dimensionais
  const [dimensions, setDimensions] = useState({
    v1: 0, // Valência Emocional (-5 a +5)
    v2: 5, // Excitação Emocional (0-10)
    v3: 3, // Dominância Emocional (0-10)
    v4: 7, // Intensidade Afetiva (0-10)
    v5: 6, // Complexidade Sintática (0-10)
    v6: 5, // Coerência Narrativa (0-10)
    v7: 4, // Flexibilidade Cognitiva (0-10)
    v8: 6, // Dissonância Cognitiva (0-10)
    v9_past: 7,   // Perspectiva Temporal - Passado (0-10)
    v9_present: 4, // Perspectiva Temporal - Presente (0-10)
    v9_future: 2,  // Perspectiva Temporal - Futuro (0-10)
    v10: 3, // Autocontrole (0-10)
  });
  
  // Pontos históricos de trajetória
  const [trajectoryPoints, setTrajectoryPoints] = useState([
    { v1: -3, v2: 8, v3: 2, time: new Date('2025-01-15').getTime() },
    { v1: -2, v2: 7, v3: 2, time: new Date('2025-02-01').getTime() },
    { v1: -1, v2: 6, v3: 3, time: new Date('2025-02-15').getTime() },
    { v1: 0, v2: 5, v3: 3, time: new Date('2025-03-01').getTime() },
    { v1: 0, v2: 5, v3: 3, time: new Date('2025-03-15').getTime() },
    { v1: 0, v2: 5, v3: 3, time: new Date('2025-04-01').getTime() }
  ]);
  
  // Estado ativo para seleção de dimensões
  const [activeDimension, setActiveDimension] = useState('emotional');
  
  // Cores por grupo dimensional
  const dimensionColors = {
    emotional: '#3b82f6',    // Azul para dimensões emocionais
    cognitive: '#10b981',    // Verde para dimensões cognitivas
    autonomy: '#8b5cf6'      // Roxo para dimensões de autonomia
  };
  
  // Função para ajustar valor dimensional
  const handleDimensionChange = (dim, value) => {
    setDimensions(prev => ({
      ...prev,
      [dim]: Number(value)
    }));
  };
  
  // Função para adicionar ponto à trajetória
  const addTrajectoryPoint = () => {
    const newPoint = {
      v1: dimensions.v1,
      v2: dimensions.v2,
      v3: dimensions.v3,
      time: new Date().getTime()
    };
    
    setTrajectoryPoints(prev => [...prev, newPoint]);
  };
  
  // Implementação da visualização 3D com Three.js
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Inicialização da cena, câmera e renderizador
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    
    // Definir dimensões do container
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    
    // Configuração da câmera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(5, 5, 5);
    
    // Configuração do renderizador
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    
    // Adicionar iluminação
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);
    
    // Implementar controles personalizados para rotação e zoom
    const controls = {
      rotationSpeed: 0.01,
      zoomSpeed: 0.1,
      isDragging: false,
      previousMousePosition: { x: 0, y: 0 },
      update: () => {} // Função vazia para compatibilidade
    };
    
    // Função para lidar com o início do arrasto
    const handleMouseDown = (event) => {
      controls.isDragging = true;
      controls.previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    };
    
    // Função para lidar com o movimento do mouse
    const handleMouseMove = (event) => {
      if (!controls.isDragging) return;
      
      const deltaMove = {
        x: event.clientX - controls.previousMousePosition.x,
        y: event.clientY - controls.previousMousePosition.y
      };
      
      // Rotacionar a câmera com base no movimento do mouse
      const rotateY = deltaMove.x * controls.rotationSpeed;
      const rotateX = deltaMove.y * controls.rotationSpeed;
      
      // Atualizar a posição da câmera em uma órbita esférica
      const radius = camera.position.length();
      
      // Calcular nova posição
      camera.position.x = Math.sin(rotateY) * radius;
      camera.position.z = Math.cos(rotateY) * radius;
      camera.position.y += rotateX;
      
      // Manter a câmera olhando para o centro
      camera.lookAt(0, 0, 0);
      
      controls.previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    };
    
    // Função para lidar com o fim do arrasto
    const handleMouseUp = () => {
      controls.isDragging = false;
    };
    
    // Função para lidar com o zoom (roda do mouse)
    const handleMouseWheel = (event) => {
      const delta = Math.max(-1, Math.min(1, event.deltaY || -event.detail));
      
      // Ajustar a distância da câmera
      const direction = new THREE.Vector3(0, 0, 0).sub(camera.position).normalize();
      const moveDistance = delta * controls.zoomSpeed;
      
      camera.position.addScaledVector(direction, moveDistance);
    };
    
    // Adicionar event listeners
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('mouseout', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleMouseWheel);
    
    controlsRef.current = controls;
    
    // Criar o grid para os eixos
    const gridHelper = new THREE.GridHelper(10, 10, 0x666666, 0x222222);
    scene.add(gridHelper);
    
    // Adicionar eixos
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    
    // Criar a superfície do "campo mental"
    const geometry = new THREE.PlaneGeometry(10, 10, 50, 50);
    
    // Função para modificar a geometria criando "ondulações" no campo mental
    const vertices = geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      
      // Criar ondulações no campo usando funções seno
      vertices[i + 2] = Math.sin(x * 0.5) * 0.5 + Math.sin(y * 0.5) * 0.5 + 
                        Math.sin(x * 0.25 + y * 0.3) * 0.3;
    }
    
    // Atualizar as normais da geometria
    geometry.computeVertexNormals();
    
    // Material com gradiente baseado na altura
    const material = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      wireframe: false,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
      flatShading: false,
    });
    
    const plane = new THREE.Mesh(geometry, material);
    // Rotacionar o plano para posicioná-lo horizontalmente
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);
    
    // Criar marcadores para os pontos da trajetória
    const trajectoryGeometry = new THREE.BufferGeometry();
    const trajectoryPoints3D = [];
    
    trajectoryPoints.forEach(point => {
      // Mapear as dimensões para coordenadas 3D
      // Usar v1 como x, v2 como z e v3 como y
      trajectoryPoints3D.push(
        point.v1, // Valência como x
        point.v3, // Dominância como y
        point.v2  // Excitação como z
      );
    });
    
    // Criar geometria da linha de trajetória
    trajectoryGeometry.setAttribute(
      'position', 
      new THREE.Float32BufferAttribute(trajectoryPoints3D, 3)
    );
    
    // Material para a linha de trajetória
    const trajectoryMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 2
    });
    
    // Criar a linha de trajetória
    const trajectoryLine = new THREE.Line(trajectoryGeometry, trajectoryMaterial);
    scene.add(trajectoryLine);
    
    // Adicionar esferas nos pontos da trajetória
    trajectoryPoints.forEach((point, index) => {
      const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
      
      // Determinar a cor baseada na valência (v1)
      const color = point.v1 < 0 ? 
                   new THREE.Color(0x3b82f6) : // Azul para valência negativa
                   new THREE.Color(0xef4444);  // Vermelho para valência positiva
      
      const sphereMaterial = new THREE.MeshStandardMaterial({ color });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      
      // Posicionar a esfera
      sphere.position.set(point.v1, point.v3, point.v2);
      
      // Adicionar label com timestamp
      const date = new Date(point.time);
      const label = date.toLocaleDateString();
      
      // Adicionar à cena
      scene.add(sphere);
    });
    
    // Adicionar ponto atual (estado mental atual)
    const currentPointGeometry = new THREE.SphereGeometry(0.15, 24, 24);
    const currentPointMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff9500,
      emissive: 0xff9500,
      emissiveIntensity: 0.3
    });
    
    const currentPoint = new THREE.Mesh(currentPointGeometry, currentPointMaterial);
    currentPoint.position.set(dimensions.v1, dimensions.v3, dimensions.v2);
    scene.add(currentPoint);
    
    // Função de animação
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Para os controles personalizados, não precisamos chamar update explicitamente
      // já que as atualizações ocorrem nos event handlers
      
      // Atualizar a posição do ponto atual
      currentPoint.position.set(dimensions.v1, dimensions.v3, dimensions.v2);
      
      // Renderizar a cena
      renderer.render(scene, camera);
    };
    
    // Iniciar a animação
    animate();
    
    // Função de limpeza
    return () => {
      if (mountRef.current) {
        // Remover event listeners
        renderer.domElement.removeEventListener('mousedown', handleMouseDown);
        renderer.domElement.removeEventListener('mousemove', handleMouseMove);
        renderer.domElement.removeEventListener('mouseup', handleMouseUp);
        renderer.domElement.removeEventListener('mouseout', handleMouseUp);
        renderer.domElement.removeEventListener('wheel', handleMouseWheel);
        
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [mountRef, dimensions, trajectoryPoints]);
  
  // Estilos para o componente
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    overflow: 'hidden'
  };
  
  const headerStyle = {
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#1e293b',
    color: 'white'
  };
  
  const contentStyle = {
    display: 'flex',
    flex: 1,
    overflow: 'hidden'
  };
  
  const visualizationStyle = {
    flex: 1,
    height: '500px',
    position: 'relative'
  };
  
  const controlsStyle = {
    width: '300px',
    padding: '16px',
    borderLeft: '1px solid #e2e8f0',
    backgroundColor: 'white',
    overflow: 'auto'
  };
  
  const dimensionGroupStyle = {
    marginBottom: '24px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#f1f5f9'
  };
  
  const sliderContainerStyle = {
    marginBottom: '12px'
  };
  
  const sliderLabelStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
    fontSize: '14px'
  };
  
  const sliderStyle = {
    width: '100%'
  };
  
  const buttonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    marginTop: '16px'
  };
  
  const tabsStyle = {
    display: 'flex',
    marginBottom: '16px'
  };
  
  const tabStyle = (isActive, colorKey) => ({
    padding: '8px 16px',
    borderRadius: '8px 8px 0 0',
    backgroundColor: isActive ? dimensionColors[colorKey] : '#e2e8f0',
    color: isActive ? 'white' : '#475569',
    fontWeight: isActive ? '600' : '400',
    cursor: 'pointer',
    marginRight: '4px'
  });
  
  const valueBoxStyle = {
    display: 'inline-block',
    width: '40px',
    textAlign: 'center',
    padding: '2px 4px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    fontSize: '14px'
  };
  
  const legendStyle = {
    position: 'absolute',
    bottom: '16px',
    left: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '8px',
    borderRadius: '4px',
    fontSize: '12px'
  };
  
  const legendItemStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '4px'
  };
  
  const legendColorStyle = (color) => ({
    width: '12px',
    height: '12px',
    backgroundColor: color,
    borderRadius: '50%',
    marginRight: '8px'
  });
  
  // Renderização do componente
  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', letterSpacing: '-0.02em' }}>
          HH - Visualização INtegrativa TRAjetorial
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: '14px', opacity: 0.8 }}>
          Representação 3D do espaço vetorial da mente
        </p>
      </div>
      
      <div style={contentStyle}>
        <div style={visualizationStyle}>
          <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
          
          <div style={legendStyle}>
            <div style={legendItemStyle}>
              <div style={legendColorStyle('#000000')}></div>
              <span>Trajetória do paciente</span>
            </div>
            <div style={legendItemStyle}>
              <div style={legendColorStyle('#3b82f6')}></div>
              <span>Estados com valência negativa</span>
            </div>
            <div style={legendItemStyle}>
              <div style={legendColorStyle('#ef4444')}></div>
              <span>Estados com valência positiva</span>
            </div>
            <div style={legendItemStyle}>
              <div style={legendColorStyle('#ff9500')}></div>
              <span>Estado atual</span>
            </div>
          </div>
        </div>
        
        <div style={controlsStyle}>
          <div style={tabsStyle}>
            <div 
              style={tabStyle(activeDimension === 'emotional', 'emotional')}
              onClick={() => setActiveDimension('emotional')}
            >
              Emocional
            </div>
            <div 
              style={tabStyle(activeDimension === 'cognitive', 'cognitive')}
              onClick={() => setActiveDimension('cognitive')}
            >
              Cognitiva
            </div>
            <div 
              style={tabStyle(activeDimension === 'autonomy', 'autonomy')}
              onClick={() => setActiveDimension('autonomy')}
            >
              Autonomia
            </div>
          </div>
          
          {activeDimension === 'emotional' && (
            <div style={dimensionGroupStyle}>
              <h3 style={{ marginTop: 0, fontSize: '16px', fontWeight: '600', color: dimensionColors.emotional }}>
                Dimensões Emocionais
              </h3>
              
              <div style={sliderContainerStyle}>
                <div style={sliderLabelStyle}>
                  <span>Valência Emocional (v₁):</span>
                  <span style={valueBoxStyle}>{dimensions.v1}</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.5"
                  value={dimensions.v1}
                  onChange={(e) => handleDimensionChange('v1', e.target.value)}
                  style={sliderStyle}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
                  <span>Negativa (-5)</span>
                  <span>Positiva (+5)</span>
                </div>
              </div>
              
              <div style={sliderContainerStyle}>
                <div style={sliderLabelStyle}>
                  <span>Excitação Emocional (v₂):</span>
                  <span style={valueBoxStyle}>{dimensions.v2}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={dimensions.v2}
                  onChange={(e) => handleDimensionChange('v2', e.target.value)}
                  style={sliderStyle}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
                  <span>Mínima (0)</span>
                  <span>Extrema (10)</span>
                </div>
              </div>
              
              <div style={sliderContainerStyle}>
                <div style={sliderLabelStyle}>
                  <span>Dominância Emocional (v₃):</span>
                  <span style={valueBoxStyle}>{dimensions.v3}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={dimensions.v3}
                  onChange={(e) => handleDimensionChange('v3', e.target.value)}
                  style={sliderStyle}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
                  <span>Dominado (0)</span>
                  <span>Controlando (10)</span>
                </div>
              </div>
              
              <div style={sliderContainerStyle}>
                <div style={sliderLabelStyle}>
                  <span>Intensidade Afetiva (v₄):</span>
                  <span style={valueBoxStyle}>{dimensions.v4}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={dimensions.v4}
                  onChange={(e) => handleDimensionChange('v4', e.target.value)}
                  style={sliderStyle}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
                  <span>Embotamento (0)</span>
                  <span>Sobrecarga (10)</span>
                </div>
              </div>
            </div>
          )}
          
          {activeDimension === 'cognitive' && (
            <div style={dimensionGroupStyle}>
              <h3 style={{ marginTop: 0, fontSize: '16px', fontWeight: '600', color: dimensionColors.cognitive }}>
                Dimensões Cognitivas
              </h3>
              
              <div style={sliderContainerStyle}>
                <div style={sliderLabelStyle}>
                  <span>Complexidade Sintática (v₅):</span>
                  <span style={valueBoxStyle}>{dimensions.v5}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={dimensions.v5}
                  onChange={(e) => handleDimensionChange('v5', e.target.value)}
                  style={sliderStyle}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
                  <span>Simples (0)</span>
                  <span>Complexa (10)</span>
                </div>
              </div>
              
              <div style={sliderContainerStyle}>
                <div style={sliderLabelStyle}>
                  <span>Coerência Narrativa (v₆):</span>
                  <span style={valueBoxStyle}>{dimensions.v6}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={dimensions.v6}
                  onChange={(e) => handleDimensionChange('v6', e.target.value)}
                  style={sliderStyle}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
                  <span>Fragmentada (0)</span>
                  <span>Integrada (10)</span>
                </div>
              </div>
              
              <div style={sliderContainerStyle}>
                <div style={sliderLabelStyle}>
                  <span>Flexibilidade Cognitiva (v₇):</span>
                  <span style={valueBoxStyle}>{dimensions.v7}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={dimensions.v7}
                  onChange={(e) => handleDimensionChange('v7', e.target.value)}
                  style={sliderStyle}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
                  <span>Rígida (0)</span>
                  <span>Flexível (10)</span>
                </div>
              </div>
              
              <div style={sliderContainerStyle}>
                <div style={sliderLabelStyle}>
                  <span>Dissonância Cognitiva (v₈):</span>
                  <span style={valueBoxStyle}>{dimensions.v8}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={dimensions.v8}
                  onChange={(e) => handleDimensionChange('v8', e.target.value)}
                  style={sliderStyle}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
                  <span>Consonância (0)</span>
                  <span>Dissonância (10)</span>
                </div>
              </div>
            </div>
          )}
          
          {activeDimension === 'autonomy' && (
            <div style={dimensionGroupStyle}>
              <h3 style={{ marginTop: 0, fontSize: '16px', fontWeight: '600', color: dimensionColors.autonomy }}>
                Dimensões de Autonomia
              </h3>
              
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Perspectiva Temporal (v₉):</h4>
                
                <div style={sliderContainerStyle}>
                  <div style={sliderLabelStyle}>
                    <span>Passado:</span>
                    <span style={valueBoxStyle}>{dimensions.v9_past}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={dimensions.v9_past}
                    onChange={(e) => handleDimensionChange('v9_past', e.target.value)}
                    style={sliderStyle}
                  />
                </div>
                
                <div style={sliderContainerStyle}>
                  <div style={sliderLabelStyle}>
                    <span>Presente:</span>
                    <span style={valueBoxStyle}>{dimensions.v9_present}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={dimensions.v9_present}
                    onChange={(e) => handleDimensionChange('v9_present', e.target.value)}
                    style={sliderStyle}
                  />
                </div>
                
                <div style={sliderContainerStyle}>
                  <div style={sliderLabelStyle}>
                    <span>Futuro:</span>
                    <span style={valueBoxStyle}>{dimensions.v9_future}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={dimensions.v9_future}
                    onChange={(e) => handleDimensionChange('v9_future', e.target.value)}
                    style={sliderStyle}
                  />
                </div>
                
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  Distribuição temporal em valores 0-10 para cada dimensão
                </div>
              </div>
              
              <div style={sliderContainerStyle}>
                <div style={sliderLabelStyle}>
                  <span>Autocontrole (v₁₀):</span>
                  <span style={valueBoxStyle}>{dimensions.v10}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={dimensions.v10}
                  onChange={(e) => handleDimensionChange('v10', e.target.value)}
                  style={sliderStyle}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
                  <span>Perda de controle (0)</span>
                  <span>Autorregulação (10)</span>
                </div>
              </div>
            </div>
          )}
          
          <button 
            style={buttonStyle}
            onClick={addTrajectoryPoint}
          >
            Adicionar Ponto à Trajetória
          </button>
          
          <div style={{ marginTop: '24px', fontSize: '14px', color: '#64748b' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
              Sobre a Visualização
            </h3>
            <p style={{ margin: '0 0 8px' }}>
              Esta visualização 3D representa o espaço vetorial da mente conforme definido pelo modelo HH.
            </p>
            <p style={{ margin: '0 0 8px' }}>
              Os eixos visualizados correspondem a:
            </p>
            <ul style={{ padding: '0 0 0 16px', margin: '0 0 8px' }}>
              <li>X (vermelho): Valência Emocional (v₁)</li>
              <li>Y (verde): Dominância Emocional (v₃)</li>
              <li>Z (azul): Excitação Emocional (v₂)</li>
            </ul>
            <p style={{ margin: '0' }}>
              A linha preta mostra a trajetória do paciente através do tempo. Use o mouse para rotacionar, 
              dar zoom e mover a visualização.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HH3DVisualization;
