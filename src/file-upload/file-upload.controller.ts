import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import * as path from 'path';
import * as fs from 'fs/promises';
import { GLTFLoader } from 'three-stdlib';
import { diskStorage } from 'multer';
import { readFile } from 'fs/promises';

(global as any).window = { ...global };
(global as any).self = global;


// Define ModelDetails interface
interface ModelDetails {
  numberOfMeshes: number;
  materials: any[];
  geometry: any[];
  vertexCount: number;
  polygonCount: number;
}

@Controller('file-upload')
export class FileUploadController {
  private readonly maxVertexCount = 100000;
  private readonly maxPolygonCount = 50000;

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      const filePath = path.resolve('uploads', file.filename);
      console.log(`File saved to: ${filePath}`);
      console.log('Current Working Directory:', process.cwd());

      try {
        await fs.access(filePath);
      } catch (err) {
        console.error('File not found error:', err.message);
        throw new BadRequestException('File not found');
      }

      // const modelDetails = await this.get3DModelDetails(filePath);

      // if (!modelDetails) {
      //   throw new BadRequestException('Failed to extract model details');
      // }

      // if (modelDetails.vertexCount > this.maxVertexCount || modelDetails.polygonCount > this.maxPolygonCount) {
      //   await fs.unlink(filePath);
      //   throw new BadRequestException('Model exceeds WebXR limits for vertex and polygon count');
      // }

      const fileLink = `/uploads/${file.filename}`;

      return {
        message: 'File uploaded successfully',
        file: file.filename,
        // modelDetails: modelDetails,
        link: fileLink,
      };
    } catch (error) {
      console.error('Upload error:', error.message);
      return {
        message: 'Error uploading file',
        error: error.message,
      };
    }
  }

  async get3DModelDetails(filePath: string): Promise<ModelDetails | null> {
    const fileExt = path.extname(filePath).toLowerCase();

    if (fileExt === '.glb' || fileExt === '.gltf') {
      try {
        return await this.parseGLTF(filePath);
      } catch (error) {
        console.error('Error parsing GLTF model:', error);
        throw new BadRequestException('Failed to parse model file');
      }
    } else if (fileExt === '.fbx') {
      console.log('FBX files are not supported in this example');
      return null;
    }

    return null;
  }

  async parseGLTF(filePath: string): Promise<ModelDetails> {
    return new Promise(async (resolve, reject) => {
      const loader = new GLTFLoader();
  
      try {
        // Read file from the filesystem
        const fileData = await readFile(filePath);
        
        // Parse GLTF from buffer data
        loader.parse(
          fileData.buffer,
          '',
          (gltf) => {
            if (!gltf || !gltf.scene) {
              return reject(new Error('Invalid GLTF model format'));
            }
  
            const scene = gltf.scene;
            const modelDetails: ModelDetails = {
              numberOfMeshes: scene.children.length,
              materials: scene.children.map((mesh) => mesh.material),
              geometry: scene.children.map((mesh) => mesh.geometry),
              vertexCount: 0,
              polygonCount: 0,
            };
  
            scene.traverse((child) => {
              if (child.isMesh) {
                const geometry = child.geometry;
                if (geometry && geometry.attributes && geometry.attributes.position) {
                  modelDetails.vertexCount += geometry.attributes.position.count;
                  modelDetails.polygonCount += geometry.index ? geometry.index.count / 3 : 0;
                }
              }
            });
  
            resolve(modelDetails);
          },
          (error) => {
            reject(new Error(`Error parsing GLTF model: ${error.message}`));
          }
        );
      } catch (error) {
        reject(new Error(`Failed to read file: ${error.message}`));
      }
    });
  }
}
