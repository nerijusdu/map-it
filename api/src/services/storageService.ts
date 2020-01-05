import { BlobService, createBlobService } from 'azure-storage';
import { promisify } from 'util';

export class StorageService {
  private blobService: BlobService;
  constructor(accountName: string, accountKey: string) {
    this.blobService = createBlobService(accountName, accountKey);
  }

  public async getBlobText(container: string, blobname: string) {
    const getBlobText = promisify(this.blobService.getBlobToText).bind(this.blobService);
    return getBlobText(container, blobname);
  }

  public async clearBlob(container: string, blobname: string) {
    const deleteBlob = promisify(this.blobService.deleteBlob).bind(this.blobService);
    const createBlob = promisify(this.blobService.createAppendBlobFromText).bind(this.blobService);
    await deleteBlob(container, blobname);
    await createBlob(container, blobname, '');
  }
}

export default (accountName: string, accountKey: string) => new StorageService(accountName, accountKey);
