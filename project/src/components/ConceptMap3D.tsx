import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Network, Brain } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConceptNode, ConceptEdge } from '../types';
import * as THREE from 'three';

function ConceptSphere({ node, onClick }: { node: ConceptNode; onClick: (node: ConceptNode) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onClick={() => onClick(node)}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[node.size, 32, 32]} />
        <meshStandardMaterial color={node.color} />
      </mesh>
      <Text
        position={[0, -node.size - 0.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {node.label}
      </Text>
    </group>
  );
}

function ConnectionLine({ edge, nodes }: { edge: ConceptEdge; nodes: ConceptNode[] }) {
  const fromNode = nodes.find(n => n.id === edge.from);
  const toNode = nodes.find(n => n.id === edge.to);
  
  if (!fromNode || !toNode) return null;

  const points = [
    new THREE.Vector3(...fromNode.position),
    new THREE.Vector3(...toNode.position)
  ];
  
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#ffffff" opacity={edge.strength} transparent />
    </line>
  );
}

function Scene() {
  const { state } = useApp();
  const [selectedNode, setSelectedNode] = React.useState<ConceptNode | null>(null);
  
  if (!state.currentSession) return null;
  
  const { nodes, edges } = state.currentSession.concept_map;

  const handleNodeClick = (node: ConceptNode) => {
    setSelectedNode(node);
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {nodes.map((node) => (
        <ConceptSphere key={node.id} node={node} onClick={handleNodeClick} />
      ))}
      
      {edges.map((edge, index) => (
        <ConnectionLine key={index} edge={edge} nodes={nodes} />
      ))}
      
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      
      {selectedNode && (
        <Html position={[selectedNode.position[0], selectedNode.position[1] + 2, selectedNode.position[2]]}>
          <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200 max-w-xs">
            <h4 className="font-semibold text-gray-800 mb-1">{selectedNode.label}</h4>
            <p className="text-sm text-gray-600">
              Key concept in the learning material. Click to explore related topics.
            </p>
            <button
              onClick={() => setSelectedNode(null)}
              className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </Html>
      )}
    </>
  );
}

export default function ConceptMap3D() {
  const { state } = useApp();
  
  if (!state.currentSession) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Network className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Concept Map</h2>
            <p className="text-green-100 text-sm">Interactive 3D visualization</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-green-100">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>{state.currentSession.concept_map.nodes.length} concepts</span>
          </div>
          <div className="flex items-center space-x-2">
            <Network className="w-4 h-4" />
            <span>{state.currentSession.concept_map.edges.length} connections</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="h-96 bg-gradient-to-b from-indigo-900 to-purple-900">
          <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
            <Scene />
          </Canvas>
        </div>
        
        <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-3 py-2 rounded-lg">
          <p>Drag to rotate • Scroll to zoom • Click nodes for details</p>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-semibold text-gray-800 mb-3">How to Use</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• <strong>Rotate:</strong> Click and drag to explore different angles</li>
          <li>• <strong>Zoom:</strong> Use mouse wheel to zoom in/out</li>
          <li>• <strong>Interact:</strong> Click on concept spheres to learn more</li>
          <li>• <strong>Connections:</strong> Lines show relationships between concepts</li>
        </ul>
      </div>
    </motion.div>
  );
}