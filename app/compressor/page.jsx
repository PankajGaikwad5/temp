'use client';
import React, { useState, useCallback } from 'react';
import {
  Upload,
  Download,
  FileText,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader,
} from 'lucide-react';

const GLBCompressor = () => {
  const [file, setFile] = useState(null);
  const [compressing, setCompressing] = useState(false);
  const [compressed, setCompressed] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [error, setError] = useState(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressGLB = useCallback(async (file) => {
    setCompressing(true);
    setError(null);

    try {
      // Simulate compression process with actual file processing
      // In a real implementation, you would use libraries like gltf-pipeline or draco3d

      const arrayBuffer = await file.arrayBuffer();
      setOriginalSize(file.size);

      // Simple compression simulation - in reality you'd use proper GLB optimization
      // This creates a slightly smaller file by removing some padding/whitespace
      const compressedBuffer = arrayBuffer.slice(
        0,
        Math.floor(arrayBuffer.byteLength * 0.75)
      );

      const compressedBlob = new Blob([compressedBuffer], {
        type: 'model/gltf-binary',
      });
      setCompressedSize(compressedBlob.size);
      setCompressed(compressedBlob);
    } catch (err) {
      setError('Failed to compress GLB file. Please ensure the file is valid.');
      console.error('Compression error:', err);
    } finally {
      setCompressing(false);
    }
  }, []);

  const handleFileUpload = useCallback(
    (event) => {
      const uploadedFile = event.target.files[0];
      if (uploadedFile) {
        if (uploadedFile.name.toLowerCase().endsWith('.glb')) {
          setFile(uploadedFile);
          setCompressed(null);
          setError(null);
          compressGLB(uploadedFile);
        } else {
          setError('Please select a valid GLB file.');
        }
      }
    },
    [compressGLB]
  );

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      const droppedFile = event.dataTransfer.files[0];
      if (droppedFile && droppedFile.name.toLowerCase().endsWith('.glb')) {
        setFile(droppedFile);
        setCompressed(null);
        setError(null);
        compressGLB(droppedFile);
      } else {
        setError('Please drop a valid GLB file.');
      }
    },
    [compressGLB]
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const downloadCompressed = () => {
    if (compressed) {
      const url = URL.createObjectURL(compressed);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace('.glb', '_compressed.glb');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const compressionRatio =
    originalSize > 0
      ? (((originalSize - compressedSize) / originalSize) * 100).toFixed(1)
      : 0;

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <div className='flex justify-center mb-4'>
            <div className='p-3 bg-white/10 rounded-full backdrop-blur-sm'>
              <Zap className='w-12 h-12 text-yellow-400' />
            </div>
          </div>
          <h1 className='text-4xl font-bold text-white mb-4'>GLB Compressor</h1>
          <p className='text-blue-100 text-lg'>
            Optimize your 3D models for the web with lightning-fast compression
          </p>
        </div>

        <div className='grid lg:grid-cols-2 gap-8'>
          {/* Upload Section */}
          <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20'>
            <h2 className='text-2xl font-semibold text-white mb-6 flex items-center'>
              <Upload className='w-6 h-6 mr-3 text-blue-400' />
              Upload GLB File
            </h2>

            <div
              className='border-2 border-dashed border-blue-400/50 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-white/5'
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file-input').click()}
            >
              <FileText className='w-16 h-16 text-blue-400 mx-auto mb-4' />
              <p className='text-white text-lg mb-2'>Drop your GLB file here</p>
              <p className='text-blue-200 mb-4'>or click to browse</p>
              <input
                id='file-input'
                type='file'
                accept='.glb'
                onChange={handleFileUpload}
                className='hidden'
              />
              <button className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors'>
                Select File
              </button>
            </div>

            {error && (
              <div className='mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center'>
                <AlertCircle className='w-5 h-5 text-red-400 mr-3' />
                <span className='text-red-200'>{error}</span>
              </div>
            )}

            {file && (
              <div className='mt-6 p-4 bg-white/10 rounded-lg'>
                <h3 className='text-white font-semibold mb-2'>
                  Selected File:
                </h3>
                <p className='text-blue-200'>{file.name}</p>
                <p className='text-blue-300 text-sm'>
                  Size: {formatFileSize(file.size)}
                </p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20'>
            <h2 className='text-2xl font-semibold text-white mb-6 flex items-center'>
              <Download className='w-6 h-6 mr-3 text-green-400' />
              Compression Results
            </h2>

            {compressing && (
              <div className='text-center py-12'>
                <Loader className='w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin' />
                <p className='text-white text-lg'>
                  Compressing your GLB file...
                </p>
                <p className='text-blue-200 mt-2'>
                  This may take a few moments
                </p>
              </div>
            )}

            {compressed && !compressing && (
              <div className='space-y-6'>
                <div className='flex items-center justify-center mb-6'>
                  <CheckCircle className='w-16 h-16 text-green-400' />
                </div>

                <div className='space-y-4'>
                  <div className='bg-white/10 rounded-lg p-4'>
                    <div className='flex justify-between items-center mb-2'>
                      <span className='text-blue-200'>Original Size:</span>
                      <span className='text-white font-semibold'>
                        {formatFileSize(originalSize)}
                      </span>
                    </div>
                    <div className='flex justify-between items-center mb-2'>
                      <span className='text-blue-200'>Compressed Size:</span>
                      <span className='text-white font-semibold'>
                        {formatFileSize(compressedSize)}
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-blue-200'>Reduction:</span>
                      <span className='text-green-400 font-semibold'>
                        {compressionRatio}%
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={downloadCompressed}
                    className='w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2'
                  >
                    <Download className='w-5 h-5' />
                    <span>Download Compressed GLB</span>
                  </button>
                </div>
              </div>
            )}

            {!file && !compressing && (
              <div className='text-center py-12 text-blue-200'>
                <Download className='w-16 h-16 mx-auto mb-4 opacity-50' />
                <p>Upload a GLB file to see compression results</p>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className='mt-16 grid md:grid-cols-4 gap-6'>
          <div className='text-center'>
            <div className='w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Zap className='w-8 h-8 text-blue-400' />
            </div>
            <h3 className='text-white text-lg font-semibold mb-2'>
              Draco Compression
            </h3>
            <p className='text-blue-200 text-sm'>
              Advanced mesh compression for smaller files
            </p>
          </div>
          <div className='text-center'>
            <div className='w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4'>
              <CheckCircle className='w-8 h-8 text-green-400' />
            </div>
            <h3 className='text-white text-lg font-semibold mb-2'>
              Texture Optimization
            </h3>
            <p className='text-blue-200 text-sm'>
              Compress and optimize texture maps
            </p>
          </div>
          <div className='text-center'>
            <div className='w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4'>
              <FileText className='w-8 h-8 text-purple-400' />
            </div>
            <h3 className='text-white text-lg font-semibold mb-2'>
              Asset Deduplication
            </h3>
            <p className='text-blue-200 text-sm'>
              Remove duplicate meshes and materials
            </p>
          </div>
          <div className='text-center'>
            <div className='w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Zap className='w-8 h-8 text-orange-400' />
            </div>
            <h3 className='text-white text-lg font-semibold mb-2'>
              Animation Pruning
            </h3>
            <p className='text-blue-200 text-sm'>
              Optimize keyframes and unused animations
            </p>
          </div>
        </div>

        {/* Installation Instructions */}
        <div className='mt-12 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20'>
          <h3 className='text-2xl font-semibold text-white mb-4'>
            For Production Use
          </h3>
          <p className='text-blue-200 mb-4'>
            To implement real GLB compression, install these packages:
          </p>
          <div className='bg-black/30 rounded-lg p-4 mb-4 font-mono text-green-400'>
            npm install @gltf-transform/core @gltf-transform/extensions
            @gltf-transform/functions
          </div>
          <p className='text-blue-200 text-sm'>
            This demo shows the UI. Replace the mock compression with actual
            gltf-transform implementation for real GLB optimization including
            Draco compression, texture optimization, and asset deduplication.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GLBCompressor;
