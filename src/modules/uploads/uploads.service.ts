import { Injectable } from '@nestjs/common';
import cloudinary from '../../common/utils/cloudinary';

@Injectable()
export class UploadsService {
  /**
   * Upload a file to Cloudinary.
   * Supports both disk storage (`file.path`) and memory storage (`file.buffer`).
   *
   * @param file - Multer file from request
   * @param folder - Optional Cloudinary folder to upload into
   * @returns Cloudinary upload response
   */
  async uploadFile(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<string> {
    const uploadOptions = {
      folder,
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    } as const;

    // If using disk storage, Multer provides `file.path`
    const filePath = (file as any)?.path as string | undefined;
    if (filePath) {
      const res = await cloudinary.uploader.upload(filePath, uploadOptions);
      return res.secure_url;
    }

    // If using memory storage, use buffer with upload_stream
    if (file?.buffer) {
      return new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) return reject(error);
            resolve(result?.secure_url || '');
          },
        );
        stream.end(file.buffer);
      });
    }

    throw new Error('Invalid file input: expected file.path or file.buffer');
  }
}
