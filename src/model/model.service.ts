import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as THREE from 'three';

@Injectable()
export class ModelService {
  async analyzeModel(filePath: string): Promise<any> {
    try {
      const fileSize = fs.statSync(filePath).size / (1024 * 1024); // MB
      const extension = path.extname(filePath).toLowerCase();

      const fileBuffer = fs.readFileSync(filePath);
      let geometry: THREE.BufferGeometry;

      if (extension === '.obj') {
        // Analyze OBJ file
        const objLoader = new THREE.OBJLoader();
        const obj = objLoader.parse(fileBuffer.toString());
        geometry = obj.children[0].geometry as THREE.BufferGeometry;
      } else if (extension === '.gltf' || extension === '.glb') {
        // Analyze GLTF file
        const gltfLoader = new THREE.GLTFLoader();
        const gltf = await gltfLoader.parseAsync(fileBuffer);
        geometry = gltf.scene.children[0].geometry as THREE.BufferGeometry;
      } else {
        throw new Error('Unsupported file format');
      }

      const polygonCount = geometry.index ? geometry.index.count / 3 : geometry.attributes.position.count / 3;
      const vertexCount = geometry.attributes.position.count;

      return {
        fileSizeMB: fileSize,
        polygonCount,
        vertexCount,
        fileType: extension,
        fileSizeOk: fileSize < 10,
        polygonCountOk: 5000 <= polygonCount && polygonCount <= 20000,
        vertexCountOk: 10000 <= vertexCount && vertexCount <= 40000,
      };
    } catch (error) {
      console.error('Model analysis failed:', error);
      throw new Error('Failed to analyze the model');
    }
  }
}
